"""
Endpoint sincrono para generar el avatar 3D.

Sincrono a proposito (v1): el usuario espera. Si algun dia molesta la espera,
lo que cambia es esta vista (encolar a Celery y devolver un job_id), no
generate_avatar.py.
"""

import logging
import os
import shutil
import tempfile
import uuid
from pathlib import Path

from django.conf import settings
from rest_framework import status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView

from .generate_avatar import AvatarGenerationError, generate_avatar

logger = logging.getLogger(__name__)

EXTENSIONES_VALIDAS = {".jpg", ".jpeg", ".png", ".webp", ".bmp"}
TAMANO_MAXIMO = 20 * 1024 * 1024  # 20 MB


class GenerateAvatarView(APIView):
    """
    POST /api/avatar/generate/
    Body: multipart/form-data con campo "photo"

    200 -> { "avatar_url": "/media/avatars/<id>.glb" }
    400 -> { "error": "..." }   foto ausente o invalida
    500 -> { "error": "..." }   TripoSR fallo
    """

    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        photo = request.FILES.get("photo")
        if not photo:
            return Response(
                {"error": "Falta el campo 'photo'."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        extension = Path(photo.name).suffix.lower()
        if extension not in EXTENSIONES_VALIDAS:
            return Response(
                {
                    "error": f"Formato no soportado ({extension or 'sin extension'}). "
                    f"Usa: {', '.join(sorted(EXTENSIONES_VALIDAS))}."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if photo.size > TAMANO_MAXIMO:
            return Response(
                {"error": "La foto pesa mas de 20 MB. Reducela antes de subirla."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # TripoSR espera una ruta de archivo, no bytes en memoria.
        with tempfile.NamedTemporaryFile(suffix=extension, delete=False) as tmp:
            for chunk in photo.chunks():
                tmp.write(chunk)
            tmp_path = tmp.name

        try:
            mesh_path = Path(generate_avatar(tmp_path))
        except AvatarGenerationError as e:
            logger.error("Fallo la generacion del avatar: %s", e)
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        except Exception:
            logger.exception("Error inesperado generando el avatar")
            return Response(
                {"error": "Error inesperado generando el avatar. Revisa el log del servidor."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        finally:
            _borrar(Path(tmp_path))

        # TripoSR llama "mesh.glb" a TODAS sus salidas: si copiamos con ese
        # nombre, cada avatar pisa al anterior. Le damos un nombre unico.
        destino_dir = Path(settings.MEDIA_ROOT) / "avatars"
        destino_dir.mkdir(parents=True, exist_ok=True)
        destino = destino_dir / f"{uuid.uuid4().hex}{mesh_path.suffix}"

        # shutil.move y no Path.replace: el mesh puede estar en otro disco
        # (D:\ vs C:\, o un volumen montado) y replace() falla cruzando discos.
        shutil.move(str(mesh_path), str(destino))
        _borrar_carpeta(mesh_path.parent)

        avatar_url = f"{settings.MEDIA_URL}avatars/{destino.name}"
        return Response(
            {
                "avatar_url": request.build_absolute_uri(avatar_url),
                "formato": destino.suffix.lstrip("."),
            },
            status=status.HTTP_200_OK,
        )


class HealthView(APIView):
    """
    GET /api/avatar/health/ — dice si la configuracion esta lista antes de
    gastar una foto y varios minutos en descubrir que faltaba algo.
    """

    def get(self, request):
        from . import generate_avatar as ga

        repo = ga._repo_path()
        return Response(
            {
                "modo_mock": ga._modo_mock(),
                "triposr_repo": str(repo),
                "triposr_encontrado": (repo / "run.py").exists(),
                "interprete_triposr": ga._interprete_triposr(),
                "device": os.environ.get("AVATAR_DEVICE", "auto"),
                "media_root": str(settings.MEDIA_ROOT),
            }
        )


def _borrar(ruta: Path) -> None:
    try:
        ruta.unlink(missing_ok=True)
    except OSError as e:
        logger.warning("No se pudo borrar el temporal %s: %s", ruta, e)


def _borrar_carpeta(ruta: Path) -> None:
    shutil.rmtree(ruta, ignore_errors=True)
