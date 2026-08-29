"""
Convierte las fotos de images/ en los frames alineados de frames/.

Que hace, en orden:
  1. Recorta el fondo de cada foto con rembg (modelo entrenado en personas).
  2. Muerde 3 px del borde: ahi queda color de la pared y se ve como un fleco naranja.
  3. Escala todas a la misma altura de persona y las centra en el mismo eje de giro,
     con los pies siempre en la misma linea de piso. Sin esto el personaje "salta"
     de una foto a otra en vez de girar.

Cuando agregues fotos: numeralas seguidas en images/ (5.jpeg, 6.jpeg...), corre este
script y listo. El visor detecta solo cuantos frames hay y reparte los 360 grados.

Requiere: pip install rembg[cpu] onnxruntime pillow numpy
Uso:      python preparar_frames.py
Nota:     si numba se queja al cachear, corre con NUMBA_DISABLE_JIT=1.
"""

from PIL import Image, ImageFilter
import numpy as np
import os

from rembg import new_session, remove

AQUI    = os.path.dirname(os.path.abspath(__file__))
ORIGEN  = os.path.join(AQUI, "images")
DESTINO = os.path.join(AQUI, "frames")

CW, CH   = 760, 1180   # lienzo final, igual para todos los frames
TARGET_H = 1040        # altura de la persona dentro del lienzo
BASE_Y   = 1120        # linea de piso: ahi van los pies

EXTENSIONES = (".jpeg", ".jpg", ".png", ".webp")


def rutas_de_entrada():
    """Devuelve images/1.*, images/2.*... en orden, hasta que falte un numero."""
    rutas = []
    for i in range(1, 181):
        for ext in EXTENSIONES:
            p = os.path.join(ORIGEN, f"{i}{ext}")
            if os.path.exists(p):
                rutas.append(p)
                break
        else:
            break
    return rutas


def sin_fondo(ruta, sesion):
    im = Image.open(ruta).convert("RGB")
    corte = remove(im, session=sesion, post_process_mask=True)

    # La madera de la pared es lo unico naranja fuerte de la escena: su Cb baja de 85,
    # mientras piel, pelo, labios y ropa negra se quedan por encima de 95.
    px = np.array(corte).astype(np.float32)
    cb = 128 - 0.168736 * px[:, :, 0] - 0.331264 * px[:, :, 1] + 0.5 * px[:, :, 2]
    px[:, :, 3][cb < 85] = 0
    return Image.fromarray(px.astype(np.uint8), "RGBA")


def normalizar(im):
    """Misma altura, mismo eje y mismos pies para todos los frames."""
    a = np.array(im)[:, :, 3]
    ys, xs = np.where(a > 30)
    top, bot = ys.min(), ys.max()
    alto = bot - top

    # Eje de giro: centro del cuerpo a la altura de la cadera. Es lo que menos se
    # mueve entre el frente y el perfil (el pelo y la nariz si se desplazan mucho).
    cadera = slice(top + int(alto * 0.45), top + int(alto * 0.60))
    hx = np.where(a[cadera] > 30)[1]
    eje = (hx.min() + hx.max()) / 2 if len(hx) else (xs.min() + xs.max()) / 2

    escala = TARGET_H / alto
    im = im.resize((int(round(im.width * escala)), int(round(im.height * escala))),
                   Image.LANCZOS)

    lienzo = Image.new("RGBA", (CW, CH), (0, 0, 0, 0))
    lienzo.paste(im, (int(round(CW / 2 - eje * escala)),
                      int(round(BASE_Y - bot * escala))), im)

    # Muerde el fleco de pared y suaviza para que no parezca recortado con tijera.
    r, g, b, al = lienzo.split()
    al = al.filter(ImageFilter.MinFilter(7)).filter(ImageFilter.GaussianBlur(1.0))
    return Image.merge("RGBA", (r, g, b, al)), escala, alto


def main():
    rutas = rutas_de_entrada()
    if not rutas:
        print(f"No encontre fotos numeradas en {ORIGEN}")
        return

    os.makedirs(DESTINO, exist_ok=True)
    sesion = new_session("u2net_human_seg")

    for i, ruta in enumerate(rutas, start=1):
        frame, escala, alto = normalizar(sin_fondo(ruta, sesion))
        frame.save(os.path.join(DESTINO, f"{i}.png"))
        print(f"{i}. {os.path.basename(ruta)} -> frames/{i}.png "
              f"(alto original {alto} px, escala {escala:.3f})")

    print(f"\nListo: {len(rutas)} frames en {DESTINO}")


if __name__ == "__main__":
    main()
