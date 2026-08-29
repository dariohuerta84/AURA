"""
Corre esto en la PC con la GPU 3050 (no en Convex, que está en la nube).
Convex le hace POST /generate con la URL de la foto, y este servicio
descarga la foto, corre TripoSR real, y devuelve el .glb resultante.

Debe exponerse a internet con un túnel para que Convex lo alcance:
    ngrok http 8000
y esa URL (https://xxxx.ngrok-free.app) se configura en Convex con:
    npx convex env set AVATAR_GPU_SERVICE_URL https://xxxx.ngrok-free.app
"""

import glob
import os
import shutil
import subprocess
import sys
import uuid
from pathlib import Path

import requests
from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel

app = FastAPI()

BASE_DIR = Path(__file__).resolve().parent
TRIPOSR_REPO_PATH = Path(os.environ.get("TRIPOSR_REPO_PATH", str(BASE_DIR / "TripoSR")))
WORK_DIR = BASE_DIR / "gpu_service_output"
WORK_DIR.mkdir(exist_ok=True)


def get_triposr_python() -> str:
    """
    Busca el intérprete de Python adecuado para TripoSR.
    Si se especificó TRIPOSR_PYTHON, usa esa ruta.
    Si no, busca entornos venv típicos en TripoSR/ o gpu_service/ antes de usar sys.executable.
    """
    configurado = os.environ.get("TRIPOSR_PYTHON", "").strip()
    if configurado:
        return configurado

    for candidato in (
        TRIPOSR_REPO_PATH / ".venv" / "Scripts" / "python.exe",   # Windows
        TRIPOSR_REPO_PATH / "venv" / "Scripts" / "python.exe",
        TRIPOSR_REPO_PATH / ".venv" / "bin" / "python",           # Linux / macOS
        TRIPOSR_REPO_PATH / "venv" / "bin" / "python",
        BASE_DIR / ".venv" / "Scripts" / "python.exe",
        BASE_DIR / "venv" / "Scripts" / "python.exe",
        BASE_DIR / ".venv" / "bin" / "python",
        BASE_DIR / "venv" / "bin" / "python",
    ):
        if candidato.exists():
            return str(candidato)

    return sys.executable


class GenerateRequest(BaseModel):
    image_url: str


@app.get("/health")
def health():
    py_exec = get_triposr_python()
    triposr_exists = (TRIPOSR_REPO_PATH / "run.py").exists()

    cuda_available = False
    torch_version = None
    try:
        res = subprocess.run(
            [py_exec, "-c", "import torch; print(torch.__version__); print(torch.cuda.is_available())"],
            capture_output=True,
            text=True,
            timeout=10,
        )
        if res.returncode == 0:
            lines = [line.strip() for line in res.stdout.strip().splitlines() if line.strip()]
            if len(lines) >= 2:
                torch_version = lines[0]
                cuda_available = (lines[1] == "True")
    except Exception as e:
        torch_version = f"Error al verificar torch: {e}"

    return {
        "status": "ok",
        "triposr_repo_found": triposr_exists,
        "python_interpreter": py_exec,
        "torch_version": torch_version,
        "cuda_available": cuda_available,
    }


@app.post("/generate")
def generate(req: GenerateRequest):
    job_id = str(uuid.uuid4())
    job_dir = WORK_DIR / job_id
    job_dir.mkdir(parents=True, exist_ok=True)

    py_exec = get_triposr_python()
    run_py = TRIPOSR_REPO_PATH / "run.py"

    if not run_py.exists():
        raise HTTPException(
            500,
            f"No se encontró run.py en {TRIPOSR_REPO_PATH}. Clona TripoSR dentro de gpu_service/."
        )

    # 1. Descargar la foto (Convex nos manda la URL, no el archivo directo)
    image_path = job_dir / "input.png"
    img_resp = requests.get(req.image_url, timeout=30)
    if img_resp.status_code != 200:
        raise HTTPException(400, "No se pudo descargar la imagen de entrada.")
    image_path.write_bytes(img_resp.content)

    # 1b. Modo Mock si está activado en el entorno o si falta el modelo/GPU local
    modo_mock = os.environ.get("AVATAR_MOCK", "0").lower() in ("1", "true", "yes", "si", "on")
    mock_file = BASE_DIR / "mock_avatar.glb"

    if modo_mock and mock_file.exists():
        final_path = job_dir / "avatar.glb"
        shutil.copyfile(mock_file, final_path)
        return FileResponse(
            final_path,
            media_type="model/gltf-binary",
            filename="avatar.glb",
        )

    # 2. Correr TripoSR real. Usar mc-resolution=256 (estándar óptimo para GPU 6GB)
    output_dir = job_dir / "output"
    device = os.environ.get("AVATAR_DEVICE", "cuda")
    mc_res = os.environ.get("TRIPOSR_MC_RESOLUTION", "256")

    cmd = [
        py_exec, "run.py", str(image_path.resolve()),
        "--output-dir", str(output_dir.resolve()),
        "--device", device,
        "--mc-resolution", mc_res,
        "--model-save-format", "glb",
    ]

    print(f"Ejecutando TripoSR: {' '.join(cmd)}")
    result = subprocess.run(
        cmd,
        cwd=str(TRIPOSR_REPO_PATH),
        capture_output=True,
        text=True,
    )

    if result.returncode != 0:
        print("ERROR EN TRIPOSR:")
        print("STDOUT:", result.stdout)
        print("STDERR:", result.stderr)
        raise HTTPException(500, f"Error en TripoSR GPU: {result.stderr[-2000:] or result.stdout[-2000:]}")

    glb_files = glob.glob(str(output_dir / "**" / "*.glb"), recursive=True)
    if not glb_files:
        raise HTTPException(500, "TripoSR finalizó pero no generó ningún archivo .glb")

    # Renombrar para evitar colisiones si hay varios jobs seguidos
    final_path = job_dir / "avatar.glb"
    shutil.move(glb_files[0], final_path)

    return FileResponse(
        final_path,
        media_type="model/gltf-binary",
        filename="avatar.glb",
    )


