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
import shutil
import subprocess
import uuid
from pathlib import Path

import requests
from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel

app = FastAPI()

# Ajusta a la ruta donde clonaste https://github.com/VAST-AI-Research/TripoSR
TRIPOSR_REPO_PATH = Path("./TripoSR")
WORK_DIR = Path("./gpu_service_output")
WORK_DIR.mkdir(exist_ok=True)


class GenerateRequest(BaseModel):
    image_url: str


@app.post("/generate")
def generate(req: GenerateRequest):
    job_id = str(uuid.uuid4())
    job_dir = WORK_DIR / job_id
    job_dir.mkdir(parents=True, exist_ok=True)

    # 1. Descargar la foto (Convex nos manda la URL, no el archivo directo)
    image_path = job_dir / "input.png"
    img_resp = requests.get(req.image_url, timeout=30)
    if img_resp.status_code != 200:
        raise HTTPException(400, "No se pudo descargar la imagen de entrada.")
    image_path.write_bytes(img_resp.content)

    # 2. Correr TripoSR real. --mc-resolution 384 = más detalle que el
    # default (256). Si la 3050 es de 4GB y da CUDA out of memory, baja
    # --mc-resolution a 256 y/o agrega --chunk-size 4096.
    output_dir = job_dir / "output"
    result = subprocess.run(
        [
            "python", "run.py", str(image_path.resolve()),
            "--output-dir", str(output_dir.resolve()),
            "--device", "cuda",
            "--mc-resolution", "384",
            "--model-save-format", "glb",
        ],
        cwd=str(TRIPOSR_REPO_PATH),
        capture_output=True,
        text=True,
    )
    if result.returncode != 0:
        raise HTTPException(500, f"TripoSR falló: {result.stderr[-2000:]}")

    glb_files = glob.glob(str(output_dir / "**" / "*.glb"), recursive=True)
    if not glb_files:
        raise HTTPException(500, "TripoSR corrió pero no generó ningún .glb")

    # Renombrar para evitar colisiones si hay varios jobs seguidos
    final_path = job_dir / "avatar.glb"
    shutil.move(glb_files[0], final_path)

    return FileResponse(
        final_path,
        media_type="model/gltf-binary",
        filename="avatar.glb",
    )
