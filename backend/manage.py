#!/usr/bin/env python
"""Utilidad de linea de comandos de Django."""

import os
import sys
from pathlib import Path


def main():
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "avatar_project.settings")
    _cargar_env(Path(__file__).resolve().parent.parent / ".env")
    from django.core.management import execute_from_command_line

    execute_from_command_line(sys.argv)


def _cargar_env(ruta: Path) -> None:
    """Lee un .env sencillo (CLAVE=valor) sin depender de python-dotenv."""
    if not ruta.exists():
        return
    for linea in ruta.read_text(encoding="utf-8").splitlines():
        linea = linea.strip()
        if not linea or linea.startswith("#") or "=" not in linea:
            continue
        clave, valor = linea.split("=", 1)
        os.environ.setdefault(clave.strip(), valor.strip().strip('"').strip("'"))


if __name__ == "__main__":
    main()
