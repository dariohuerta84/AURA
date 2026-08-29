"""
Proyecto Django minimo cuyo unico trabajo es exponer /api/avatar/generate/.

Es autocontenido a proposito: no usa base de datos, ni auth, ni admin, para
que arranque con solo `python manage.py runserver`. Si mas adelante mueves la
app `avatar3d` a GAVI-CRM, copias la carpeta y te olvidas de este archivo.

Todo lo configurable sale de variables de entorno (ver .env.example).
"""

import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
PROJECT_ROOT = BASE_DIR.parent


def _env(nombre: str, defecto: str) -> str:
    """Una variable presente pero vacia en .env (MEDIA_ROOT=) cuenta como ausente."""
    valor = os.environ.get(nombre, "").strip()
    return valor or defecto


def _env_bool(name: str, default: bool) -> bool:
    valor = os.environ.get(name, "").strip().lower()
    if not valor:
        return default
    return valor in ("1", "true", "yes", "si", "sí", "on")


SECRET_KEY = _env("DJANGO_SECRET_KEY", "dev-inseguro-cambiar-en-produccion")
DEBUG = _env_bool("DJANGO_DEBUG", True)
ALLOWED_HOSTS = _env("DJANGO_ALLOWED_HOSTS", "localhost,127.0.0.1").split(",")

INSTALLED_APPS = [
    # DRF importa modelos de contenttypes/auth aunque no los usemos:
    # sin estas dos, cualquier request revienta con un RuntimeError de app_label.
    "django.contrib.contenttypes",
    "django.contrib.auth",
    "django.contrib.staticfiles",
    "corsheaders",
    "rest_framework",
    "avatar3d",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
]

ROOT_URLCONF = "avatar_project.urls"
WSGI_APPLICATION = "avatar_project.wsgi.application"

# El front de Vite corre en otro puerto durante el desarrollo.
CORS_ALLOWED_ORIGINS = _env(
    "CORS_ALLOWED_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173"
).split(",")

# Esta app no guarda nada: sqlite esta solo para que Django tenga un backend
# declarado. Con la config de REST_FRAMEWORK de abajo no se ejecuta ninguna
# consulta, asi que no hace falta correr `migrate`.
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

REST_FRAMEWORK = {
    # Solo JSON: sin la API navegable, que si toca la base de datos (sesiones).
    "DEFAULT_RENDERER_CLASSES": ["rest_framework.renderers.JSONRenderer"],
    "DEFAULT_PARSER_CLASSES": [
        "rest_framework.parsers.JSONParser",
        "rest_framework.parsers.MultiPartParser",
        "rest_framework.parsers.FormParser",
    ],
    # El endpoint es publico en v1. Si lo montas en GAVI-CRM, aqui pones
    # IsAuthenticated y tus clases de autenticacion.
    "DEFAULT_AUTHENTICATION_CLASSES": [],
    "DEFAULT_PERMISSION_CLASSES": ["rest_framework.permissions.AllowAny"],
}

STATIC_URL = "/static/"

MEDIA_ROOT = Path(_env("MEDIA_ROOT", str(PROJECT_ROOT / "media")))
MEDIA_URL = "/media/"

# Limite de subida: una foto de celular entra de sobra en 20 MB.
DATA_UPLOAD_MAX_MEMORY_SIZE = 20 * 1024 * 1024
FILE_UPLOAD_MAX_MEMORY_SIZE = 20 * 1024 * 1024

LANGUAGE_CODE = "es"
TIME_ZONE = _env("TIME_ZONE", "America/Lima")
USE_TZ = True
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {"consola": {"class": "logging.StreamHandler"}},
    "loggers": {"avatar3d": {"handlers": ["consola"], "level": "INFO"}},
}
