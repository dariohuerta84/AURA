"""
Genera avatar3d/assets/mock_avatar.glb: un munequito de cajas.

Para que existe: TripoSR pesa ~1.4GB y necesita GPU. Con este archivo puedes
probar hoy la cadena completa (React sube foto -> Django responde -> el visor
muestra un modelo 3D girando) y recien despues pelear con TripoSR. Cuando
TripoSR ya funcione, pones AVATAR_MOCK=0 y nada mas cambia.

No usa dependencias: escribe el GLB (glTF 2.0 binario) a mano.
Uso: python backend/tools/make_mock_avatar.py
"""

import json
import struct
from pathlib import Path

DESTINO = Path(__file__).resolve().parent.parent / "avatar3d" / "assets" / "mock_avatar.glb"

PIEL = [0.85, 0.68, 0.55, 1.0]
POLO = [0.20, 0.45, 0.80, 1.0]
PANTALON = [0.25, 0.27, 0.34, 1.0]
ZAPATO = [0.12, 0.12, 0.14, 1.0]

# (centro_x, centro_y, centro_z, ancho, alto, fondo, color)
PARTES = [
    (0.00, 1.55, 0.00, 0.34, 0.40, 0.30, PIEL),      # cabeza
    (0.00, 1.30, 0.00, 0.14, 0.12, 0.14, PIEL),      # cuello
    (0.00, 0.95, 0.00, 0.60, 0.62, 0.30, POLO),      # torso
    (0.00, 0.58, 0.00, 0.50, 0.20, 0.28, PANTALON),  # cadera
    (-0.40, 1.02, 0.00, 0.16, 0.46, 0.16, POLO),     # brazo izq
    (-0.40, 0.62, 0.00, 0.14, 0.40, 0.14, PIEL),     # antebrazo izq
    (0.40, 1.02, 0.00, 0.16, 0.46, 0.16, POLO),      # brazo der
    (0.40, 0.62, 0.00, 0.14, 0.40, 0.14, PIEL),      # antebrazo der
    (-0.16, 0.30, 0.00, 0.22, 0.50, 0.22, PANTALON), # muslo izq
    (-0.16, -0.12, 0.00, 0.18, 0.42, 0.18, PANTALON),# pierna izq
    (-0.16, -0.36, 0.06, 0.20, 0.12, 0.34, ZAPATO),  # pie izq
    (0.16, 0.30, 0.00, 0.22, 0.50, 0.22, PANTALON),  # muslo der
    (0.16, -0.12, 0.00, 0.18, 0.42, 0.18, PANTALON), # pierna der
    (0.16, -0.36, 0.06, 0.20, 0.12, 0.34, ZAPATO),   # pie der
]

# Las 6 caras de un cubo: normal + las 4 esquinas en unidades de media-arista.
CARAS = [
    ((0, 0, 1), [(-1, -1, 1), (1, -1, 1), (1, 1, 1), (-1, 1, 1)]),
    ((0, 0, -1), [(1, -1, -1), (-1, -1, -1), (-1, 1, -1), (1, 1, -1)]),
    ((1, 0, 0), [(1, -1, 1), (1, -1, -1), (1, 1, -1), (1, 1, 1)]),
    ((-1, 0, 0), [(-1, -1, -1), (-1, -1, 1), (-1, 1, 1), (-1, 1, -1)]),
    ((0, 1, 0), [(-1, 1, 1), (1, 1, 1), (1, 1, -1), (-1, 1, -1)]),
    ((0, -1, 0), [(-1, -1, -1), (1, -1, -1), (1, -1, 1), (-1, -1, 1)]),
]


def caja(cx, cy, cz, ancho, alto, fondo):
    """Devuelve (posiciones, normales, indices) de una caja con normales por cara."""
    mx, my, mz = ancho / 2, alto / 2, fondo / 2
    posiciones, normales, indices = [], [], []

    for normal, esquinas in CARAS:
        base = len(posiciones) // 3
        for ex, ey, ez in esquinas:
            posiciones += [cx + ex * mx, cy + ey * my, cz + ez * mz]
            normales += list(normal)
        indices += [base, base + 1, base + 2, base, base + 2, base + 3]

    return posiciones, normales, indices


def alinear(datos: bytearray, relleno: int = 0) -> None:
    """glTF exige que cada bloque empiece en multiplo de 4 bytes."""
    while len(datos) % 4:
        datos.append(relleno)


def construir() -> bytes:
    buffer = bytearray()
    accessors, meshes_primitivas, materiales = [], [], []
    min_global = [1e9, 1e9, 1e9]
    max_global = [-1e9, -1e9, -1e9]

    for cx, cy, cz, ancho, alto, fondo, color in PARTES:
        posiciones, normales, indices = caja(cx, cy, cz, ancho, alto, fondo)

        for eje in range(3):
            valores = posiciones[eje::3]
            min_global[eje] = min(min_global[eje], min(valores))
            max_global[eje] = max(max_global[eje], max(valores))

        bloques = [
            (struct.pack(f"<{len(posiciones)}f", *posiciones), 5126, "VEC3", len(posiciones) // 3,
             [min(posiciones[i::3]) for i in range(3)], [max(posiciones[i::3]) for i in range(3)]),
            (struct.pack(f"<{len(normales)}f", *normales), 5126, "VEC3", len(normales) // 3, None, None),
            (struct.pack(f"<{len(indices)}H", *indices), 5123, "SCALAR", len(indices), None, None),
        ]

        ids = []
        for datos, tipo_componente, tipo, cuenta, minimo, maximo in bloques:
            alinear(buffer)
            accessor = {
                "bufferView": len(accessors),
                "componentType": tipo_componente,
                "count": cuenta,
                "type": tipo,
            }
            if minimo is not None:
                accessor["min"], accessor["max"] = minimo, maximo
            accessor["_offset"] = len(buffer)
            accessor["_length"] = len(datos)
            accessors.append(accessor)
            buffer += datos
            ids.append(len(accessors) - 1)

        materiales.append(
            {
                "pbrMetallicRoughness": {
                    "baseColorFactor": color,
                    "metallicFactor": 0.0,
                    "roughnessFactor": 0.85,
                }
            }
        )
        meshes_primitivas.append(
            {
                "attributes": {"POSITION": ids[0], "NORMAL": ids[1]},
                "indices": ids[2],
                "material": len(materiales) - 1,
            }
        )

    alinear(buffer)

    buffer_views = []
    for i, accessor in enumerate(accessors):
        vista = {"buffer": 0, "byteOffset": accessor.pop("_offset"), "byteLength": accessor.pop("_length")}
        # 34962 = vertices, 34963 = indices. El tercer accessor de cada terna es el de indices.
        vista["target"] = 34963 if i % 3 == 2 else 34962
        buffer_views.append(vista)

    # Centramos el munequito en el origen, como hace TripoSR con sus salidas.
    centro_y = (min_global[1] + max_global[1]) / 2

    gltf = {
        "asset": {"version": "2.0", "generator": "make_mock_avatar.py"},
        "scene": 0,
        "scenes": [{"nodes": [0]}],
        "nodes": [{"mesh": 0, "translation": [0.0, -centro_y, 0.0], "name": "avatar_de_prueba"}],
        "meshes": [{"primitives": meshes_primitivas, "name": "munequito"}],
        "materials": materiales,
        "accessors": accessors,
        "bufferViews": buffer_views,
        "buffers": [{"byteLength": len(buffer)}],
    }

    json_bytes = bytearray(json.dumps(gltf, separators=(",", ":")).encode("utf-8"))
    alinear(json_bytes, relleno=0x20)  # el chunk JSON se rellena con espacios

    total = 12 + 8 + len(json_bytes) + 8 + len(buffer)
    glb = bytearray()
    glb += struct.pack("<III", 0x46546C67, 2, total)          # "glTF", version 2, tamano
    glb += struct.pack("<II", len(json_bytes), 0x4E4F534A)    # chunk JSON
    glb += json_bytes
    glb += struct.pack("<II", len(buffer), 0x004E4942)        # chunk BIN
    glb += buffer
    return bytes(glb)


if __name__ == "__main__":
    DESTINO.parent.mkdir(parents=True, exist_ok=True)
    DESTINO.write_bytes(construir())
    print(f"Listo: {DESTINO} ({DESTINO.stat().st_size} bytes)")
