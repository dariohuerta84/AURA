# AURA — Levantar el servicio GPU

## Estado actual del proyecto

Todo está hecho **menos esto**. Concretamente:

- Convex ya está desplegado y funcionando (proyecto `aura`, deployment
  `giddy-eagle-383`): base de datos, storage, scheduler y estado reactivo.
  Verificado de punta a punta.
- El frontend ya está conectado a Convex y sube fotos correctamente.
- **Falta un único dato**: la URL del servicio con GPU. Sin ella, cada avatar
  termina en `status: "error"` con el mensaje "Falta AVATAR_GPU_SERVICE_URL".
  Eso NO es un bug: es el sistema diciendo que le falta el brazo ejecutor.

Tu trabajo es solo levantar ese brazo. No toques `convex/` ni `frontend/`.

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
   # .venv\Scriptsctivate          # Windows
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
   pip install omegaconf==2.3.0 Pillow einops==0.7.0 transformers==4.35.0        trimesh==4.0.5 rembg huggingface-hub "imageio[ffmpeg]"        xatlas==0.0.9 moderngl==5.10.0

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
