# AURA — Poner el avatar 3D en produccion

## Como esta armado ahora

La rama `el-aura` contiene el merge de los tres trabajos: la app Next.js
(Miluska), la integracion del orbe 3D (Matias) y la capa Convex + TripoSR
(Frank Kevin). Es una sola historia de git, sin copiar y pegar.

La cadena para que aparezca el avatar 3D tiene cuatro eslabones. Si falta
cualquiera, la app funciona igual pero el orbe muestra la foto en vez del
modelo 3D:

```
navegador (Vercel) → Convex (BD + storage + scheduler) → tunel → PC con GPU
       ↑_____________ estado reactivo (useQuery) _____________|
```

| Eslabon | Quien lo hace | Como se verifica |
| --- | --- | --- |
| 1. Convex desplegado con el schema mergeado | quien administra el Convex | `npx convex env list --prod` responde |
| 2. `NEXT_PUBLIC_CONVEX_URL` en Vercel | quien administra el Vercel | la app carga sin el error de la variable |
| 3. `AVATAR_GPU_SERVICE_URL` en Convex | quien administra el Convex | `npx convex env list --prod` la muestra |
| 4. Worker GPU corriendo + tunel abierto | quien tiene la GPU | `curl .../health` devuelve `cuda_available: true` |

---

## Paso 1 — Desplegar Convex (schema mergeado)

Desde la raiz del proyecto, en la rama `el-aura`:

```bash
npx convex deploy
```

Esto sube `convex/` entero: las tablas que ya existian (`users`, `habits`,
`checkIns`, `twoFutures`, `auraSnapshots`) mas la tabla `avatars` y las
funciones del avatar 3D. Es **aditivo**: no borra ni migra datos existentes.

Al terminar imprime la URL del deployment de produccion
(`https://xxxx.convex.cloud`). **Esa URL es la que va en el paso 2.**

## Paso 2 — Configurar Vercel

En el proyecto de Vercel, *Settings → Environment Variables*:

| Variable | Valor |
| --- | --- |
| `NEXT_PUBLIC_CONVEX_URL` | la URL del paso 1 |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | la clave de Clerk (opcional) |
| `GOOGLE_API_KEY` | la clave de Gemini |

Luego **Redeploy**. Es obligatorio: `NEXT_PUBLIC_*` se incrusta en el bundle
durante el build, no se lee en runtime. Cambiar la variable sin redesplegar no
tiene ningun efecto.

Si `NEXT_PUBLIC_CONVEX_URL` falta, el build **falla a proposito** con un
mensaje que lo dice. Antes caia en silencio a un tunel hardcodeado hacia una
PC de desarrollo; eso ya no pasa.

## Paso 3 — Conectar el worker GPU

Con el worker ya corriendo y expuesto (pasos mas abajo), desde la raiz:

```bash
npx convex env set AVATAR_GPU_SERVICE_URL https://xxxx.ngrok-free.app --prod
```

No hace falta redesplegar nada: las Actions de Convex leen la variable en cada
ejecucion. Si no esta, cada job termina en `status: "failed"` con el mensaje
"Falta AVATAR_GPU_SERVICE_URL" — es el sistema avisando, no un bug.

**La URL del tunel cambia cada vez que se reinicia** (en el plan gratis es
aleatoria). Cada reinicio obliga a repetir este paso, o los avatares se quedan
colgados sin explicacion aparente.

---

# Levantar el servicio GPU

## Por qué hace falta tu PC

Convex corre en la nube y no tiene GPU, así que no puede ejecutar TripoSR.
La generación 3D se delega a `gpu_service/`: un servidor FastAPI que corre en
tu PC y que una acción de Convex invoca por HTTP. Como tu PC no es alcanzable
desde internet, se expone con un túnel (ngrok).

```
navegador → Convex (BD + storage + scheduler) → ngrok → tu PC (TripoSR)
```

## Pasos

1. Clonar el repo y entrar a `gpu_service/`:
   ```bash
   git clone https://github.com/dariohuerta84/AURA
   cd AURA/gpu_service
   ```

2. Clonar TripoSR DENTRO de `gpu_service/`, con su propio venv de Python 3.10
   (torch y torchmcubes no tienen ruedas para 3.13+):
   ```bash
   git clone https://github.com/VAST-AI-Research/TripoSR
   cd TripoSR
   python3.10 -m venv .venv
   source .venv/bin/activate          # Linux / macOS
   # .venv\Scripts\activate     # Windows
   pip install --upgrade pip setuptools wheel
   ```

   **NO corras `pip install -r requirements.txt` tal cual: se cuelga.**
   Ese archivo fija versiones viejas (`transformers==4.35.0`, `Pillow==10.1.0`,
   `omegaconf==2.3.0`) pero deja `gradio` sin fijar. pip instala el gradio mas
   nuevo, que exige versiones modernas de esas mismas librerias, y entra en
   backtracking: imprime miles de lineas probando versiones de
   `antlr4-python3-runtime` buscando una combinacion que no existe.

   `gradio` solo lo usa el demo web de TripoSR. Nosotros llamamos a `run.py`,
   asi que se omite. Instala en este orden:

   ```bash
   # a) torch primero, con la build de CUDA de tu GPU (ajusta cu121 si toca)
   pip install torch torchvision --index-url https://download.pytorch.org/whl/cu121

   # b) el resto, sin gradio
   pip install omegaconf==2.3.0 Pillow einops==0.7.0 transformers==4.35.0 trimesh==4.0.5 rembg huggingface-hub "imageio[ffmpeg]" xatlas==0.0.9 moderngl==5.10.0

   # c) torchmcubes al final: compila, necesita el toolkit de CUDA instalado
   pip install git+https://github.com/tatsy/torchmcubes.git
   ```

3. **Antes que nada**, correr TripoSR a mano una vez:
   ```bash
   python run.py examples/chair.png --output-dir output/ --device cuda
   ```
   La primera ejecución descarga ~1.4GB de pesos desde Hugging Face. Hay que
   dejarlos cacheados AHORA: si esa descarga ocurre dentro de una petición
   real, la acción de Convex se corta por tiempo y el error que aparece no
   tiene ninguna relación con la causa.

4. Instalar las dependencias del worker y levantarlo:
   ```bash
   cd ..
   pip install -r requirements.txt
   uvicorn server:app --host 0.0.0.0 --port 8000
   ```

5. Exponerlo con ngrok, en otra terminal:
   ```bash
   ngrok http 8000
   ```
   Pasar la URL `https://xxxx.ngrok-free.app` a quien administra Convex.

6. Esa persona corre, desde la raíz del proyecto:
   ```bash
   npx convex env set AVATAR_GPU_SERVICE_URL https://xxxx.ngrok-free.app
   ```
   No hace falta reiniciar ni recompilar nada.

## Trampas conocidas

**`server.py` llama a `python` a secas.** En el paso 4, `subprocess.run` usa
el `python` del PATH, que NO es el venv de TripoSR. Si sale
`ModuleNotFoundError: torch`, esa es la causa exacta. Dos salidas: activar el
venv de TripoSR antes de lanzar `uvicorn`, o cambiar esa lista en `server.py`
por la ruta absoluta al python de ese venv (más robusto).

**La URL de ngrok cambia en cada reinicio.** En el plan gratis es aleatoria.
Cada vez que reinicies ngrok hay que repetir el paso 6, o los avatares se
quedan colgados sin explicación aparente.

**El puerto 8000.** Si en tu PC ya hay algo escuchando ahí, usa `--port 8010`
y `ngrok http 8010`.

**`CUDA out of memory`.** En `server.py`, baja `--mc-resolution` de 384 a 256.
Si sigue, agrega `--chunk-size 4096` a la llamada de TripoSR.

## Verificar antes de entregar la URL

Prueba el worker localmente con una foto de cuerpo completo y confirma que
devuelve un `.glb` de verdad y no un JSON de error:

```bash
curl -X POST http://127.0.0.1:8000/generate \
  -H "Content-Type: application/json" \
  -d '{"image_url":"https://upload.wikimedia.org/wikipedia/commons/3/3c/Shaki_waterfall.jpg"}' \
  -o prueba.glb -w "%{http_code} %{size_download} bytes\n"
```

Un `.glb` válido pesa cientos de KB o más. Si pesa 200 bytes, es un error en
JSON, ábrelo y lee el mensaje.

## Si TripoSR decepciona

TripoSR está entrenado sobre todo con objetos, no personas: con una foto de
cuerpo completo suele dar un bulto humanoide con la cara borrosa. Si el
resultado no sirve, el cambio es contenido — se reemplaza el modelo dentro de
`server.py` por TRELLIS o Hunyuan3D-2, que dan mucha mejor calidad. La
arquitectura (Convex, storage, estado, visor) no cambia en nada.
