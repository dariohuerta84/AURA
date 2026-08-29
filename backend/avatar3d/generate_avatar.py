"""
Wrapper sobre TripoSR (run.py) para generar un avatar 3D a partir de una foto.

TripoSR vive en SU PROPIO entorno (su repo, su venv, su torch con CUDA). Este
modulo no lo importa: lo invoca como subproceso. Por eso el backend de Django
puede correr con cuatro dependencias livianas mientras TripoSR arrastra torch.

Configuracion (variables de entorno, ver .env.example):
    TRIPOSR_REPO_PATH   carpeta donde clonaste TripoSR
    TRIPOSR_PYTHON      interprete del venv de TripoSR (no el de Django)
    AVATAR_OUTPUT_DIR   donde se dejan los meshes generados
    AVATAR_DEVICE       auto | cuda | cpu
    AVATAR_TIMEOUT      segundos maximos por generacion
    AVATAR_MOCK         1 = no llama a TripoSR, devuelve un avatar de prueba
"""

import logging
import os
import shutil
import subprocess
import sys
import uuid
from pathlib import Path

logger = logging.getLogger(__name__)

AQUI = Path(__file__).resolve().parent
PROJECT_ROOT = AQUI.parent.parent

MOCK_AVATAR = AQUI / "assets" / "mock_avatar.glb"


class AvatarGenerationError(Exception):
    """Falla esperable al generar el avatar. La vista la traduce a un 500 con mensaje."""


def _env(nombre: str, defecto: str) -> str:
    """Una variable presente pero vacia en .env (AVATAR_OUTPUT_DIR=) cuenta como ausente."""
    valor = os.environ.get(nombre, "").strip()
    return valor or defecto


def _modo_mock() -> bool:
    return _env("AVATAR_MOCK", "0").lower() in ("1", "true", "yes", "si", "on")


def _repo_path() -> Path:
    return Path(_env("TRIPOSR_REPO_PATH", str(PROJECT_ROOT / "TripoSR"))).expanduser()


def _output_dir() -> Path:
    return Path(_env("AVATAR_OUTPUT_DIR", str(PROJECT_ROOT / "media" / "_trabajo"))).expanduser()


def _timeout() -> int:
    # En CPU una generacion tarda entre 1 y 3 minutos; 10 min es margen de sobra.
    return int(_env("AVATAR_TIMEOUT", "600"))


def _interprete_triposr() -> str:
    """
    Interprete que ejecuta run.py. Si no se configura uno, se buscan los venv
    tipicos dentro del repo de TripoSR antes de caer al interprete de Django
    (que casi seguro no tiene torch instalado).
    """
    configurado = _env("TRIPOSR_PYTHON", "")
    if configurado:
        return configurado

    repo = _repo_path()
    for candidato in (
        repo / ".venv" / "Scripts" / "python.exe",   # Windows
        repo / "venv" / "Scripts" / "python.exe",
        repo / ".venv" / "bin" / "python",           # Linux / macOS
        repo / "venv" / "bin" / "python",
    ):
        if candidato.exists():
            return str(candidato)

    return sys.executable


def _resolver_device(interprete: str) -> str:
    """
    "auto" pregunta al torch de TripoSR si hay CUDA. Se pregunta a ESE
    interprete, no al de Django: son entornos distintos y pueden no coincidir.
    """
    pedido = _env("AVATAR_DEVICE", "auto").lower()
    if pedido in ("cuda", "cpu"):
        return pedido

    try:
        sonda = subprocess.run(
            [interprete, "-c", "import torch;print(torch.cuda.is_available())"],
            capture_output=True,
            text=True,
            timeout=120,
        )
        if sonda.returncode == 0 and "True" in sonda.stdout:
            return "cuda"
    except (OSError, subprocess.SubprocessError) as e:
        logger.warning("No se pudo detectar CUDA (%s); se usara CPU.", e)

    return "cpu"


def _buscar_mesh(directorio: Path) -> Path | None:
    """TripoSR escribe en una subcarpeta numerada (output/0/mesh.glb)."""
    for patron in ("**/*.glb", "**/*.obj"):
        encontrados = sorted(directorio.glob(patron))
        if encontrados:
            return encontrados[0]
    return None


def _generar_mock(destino: Path) -> Path:
    """Copia el avatar de prueba. Sirve para verificar la cadena completa
    (subida -> backend -> visor) sin tener TripoSR instalado."""
    if not MOCK_AVATAR.exists():
        raise AvatarGenerationError(
            f"AVATAR_MOCK esta activo pero falta {MOCK_AVATAR}. "
            "Generalo con: python backend/tools/make_mock_avatar.py"
        )
    salida = destino / "mesh.glb"
    shutil.copyfile(MOCK_AVATAR, salida)
    logger.info("AVATAR_MOCK activo: se devolvio el avatar de prueba.")
    return salida


def generate_avatar(image_path: str, device: str | None = None) -> str:
    """
    Genera un avatar 3D a partir de una foto usando TripoSR.

    Args:
        image_path: ruta a la foto de entrada (persona de cuerpo completo,
            fondo simple; TripoSR le quita el fondo con rembg).
        device: "cuda" o "cpu". Si es None se resuelve por AVATAR_DEVICE.

    Returns:
        Ruta absoluta al .glb generado.

    Raises:
        AvatarGenerationError con un mensaje explicando que falto.
    """
    job_id = uuid.uuid4().hex[:12]
    output_dir = _output_dir() / job_id
    output_dir.mkdir(parents=True, exist_ok=True)

    if _modo_mock():
        return str(_generar_mock(output_dir))

    repo = _repo_path()
    run_py = repo / "run.py"
    if not run_py.exists():
        raise AvatarGenerationError(
            f"No se encontro run.py en {repo}. Clona TripoSR y apunta "
            "TRIPOSR_REPO_PATH a esa carpeta (o pon AVATAR_MOCK=1 para probar "
            "el resto de la cadena sin TripoSR)."
        )

    interprete = _interprete_triposr()
    device = device or _resolver_device(interprete)

    comando = [
        interprete,
        "run.py",
        str(image_path),
        "--output-dir",
        str(output_dir),
        "--device",
        device,
        # Sin esto TripoSR exporta .obj, y el visor (useGLTF) solo lee glTF/GLB.
        "--model-save-format",
        "glb",
    ]
    logger.info("Generando avatar %s en %s: %s", job_id, device, " ".join(comando))

    try:
        resultado = subprocess.run(
            comando,
            cwd=str(repo),
            capture_output=True,
            text=True,
            timeout=_timeout(),
        )
    except subprocess.TimeoutExpired:
        raise AvatarGenerationError(
            f"TripoSR paso de {_timeout()}s y se corto. En CPU es normal que "
            "tarde: sube AVATAR_TIMEOUT o usa una maquina con GPU."
        )
    except OSError as e:
        raise AvatarGenerationError(f"No se pudo ejecutar {interprete}: {e}")

    if resultado.returncode != 0:
        cola = (resultado.stderr or resultado.stdout or "").strip()[-1500:]
        raise AvatarGenerationError(
            f"TripoSR fallo (codigo {resultado.returncode}):\n{cola}"
        )

    mesh = _buscar_mesh(output_dir)
    if mesh is None:
        raise AvatarGenerationError(
            f"TripoSR corrio sin error pero no dejo ningun mesh en {output_dir}. "
            "Verifica el nombre del archivo de salida con `python run.py --help`."
        )

    logger.info("Avatar %s listo: %s", job_id, mesh)
    return str(mesh)
