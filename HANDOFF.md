# Avatar 3D — Handoff para correr con GPU real (Convex + TripoSR)

## Cómo funciona (importante entender esto primero)
Convex vive en la nube — no tiene GPU y no puede correr TripoSR. Por eso la
arquitectura tiene dos partes separadas:

1. **Convex** (`convex/`): maneja la subida de fotos, la base de datos, y el
   estado del avatar. Corre en la nube, no en tu PC.
2. **Servicio GPU** (`gpu_service/`): un servidor pequeño que SÍ corre en tu
   PC (la que tiene la 3050) y ejecuta TripoSR de verdad. Convex le habla por
   HTTP a través de un túnel (ngrok), porque tu PC no es alcanzable desde
   internet directamente.

Dale este archivo completo a tu IA (Claude Code) en tu terminal y pídele que
siga los pasos en orden.

## Pasos

1. Clonar este repo y clonar TripoSR aparte dentro de `gpu_service/`:
   ```bash
   cd gpu_service
   git clone https://github.com/VAST-AI-Research/TripoSR
   cd TripoSR
   pip install --upgrade setuptools
   pip install -r requirements.txt
   cd ..
   pip install -r requirements.txt
   ```

2. Levantar el servicio GPU local:
   ```bash
   uvicorn server:app --host 0.0.0.0 --port 8000
   ```

3. Exponerlo a internet con ngrok (en otra terminal):
   ```bash
   ngrok http 8000
   ```
   Copia la URL `https://xxxx.ngrok-free.app` que te da.

4. Configurar Convex con esa URL:
   ```bash
   cd ../..   # volver a la raíz del proyecto
   npx convex dev
   npx convex env set AVATAR_GPU_SERVICE_URL https://xxxx.ngrok-free.app
   ```

5. Levantar el frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

6. Abrir la app, subir una foto de cuerpo completo, y esperar. La primera
   vez TripoSR descarga ~1.4GB de pesos desde Hugging Face — es normal que
   tarde más en la primera generación.

## Si la 3050 da "CUDA out of memory"
Es la variante de 4GB (laptop). En `gpu_service/server.py`, baja
`--mc-resolution` de 384 a 256, y si sigue fallando agrega
`--chunk-size 4096` a la llamada de TripoSR.

## Para detener todo
`Ctrl+C` en las tres terminales (servicio GPU, ngrok, frontend). Convex sigue
corriendo en la nube — no hace falta apagarlo.

---

# Notas de la integración (agregadas al organizar el repo)

Los archivos de arriba quedaron tal cual los escribiste. Estas son cosas que
salieron al integrarlos y conviene tener a mano.

## Paso 5 del frontend: falta activar el flujo Convex

`npm run dev` levanta el frontend con el **flujo Django** (`UploadAvatar.jsx`),
que es el que funciona hoy. `UploadAvatarConvex.jsx` esta en
`frontend/src/` pero todavia no esta conectado, a proposito: importa
`../../convex/_generated/api`, que no existe hasta correr `npx convex dev`.
Si se conectara antes, se romperia el build entero.

Despues del paso 4 (`npx convex dev`), para activarlo:

1. En `frontend/src/main.jsx`, descomentar las dos lineas indicadas y envolver
   `<App />` en `<ConvexProvider client={convex}>`.
2. En `frontend/src/App.jsx`, cambiar `UploadAvatar` por `UploadAvatarConvex`.
3. Poner `VITE_CONVEX_URL` en `frontend/.env.local` (la URL que imprime
   `npx convex dev`).

## Choque de puertos en el paso 2

`uvicorn --port 8000` es el mismo puerto que usa el backend Django de este
repo. En la PC de la GPU no importa (ahi Django no corre). Si alguna vez
levantas los dos en la misma maquina, cambia uno: `--port 8010`.

## `python` a secas en server.py

`server.py` llama a `subprocess.run(["python", "run.py", ...])`. Eso usa el
`python` que este primero en el PATH, que NO es el venv de TripoSR salvo que
lo actives antes de levantar uvicorn. Si da `ModuleNotFoundError: torch`,
esa es la causa: o activas el venv de TripoSR antes de `uvicorn`, o cambias
esa lista por la ruta absoluta al python del venv. (En `backend/avatar3d/
generate_avatar.py` este mismo problema ya esta resuelto con la variable
`TRIPOSR_PYTHON`, por si quieres copiar el enfoque.)

## Dos caminos al mismo visor

El repo tiene ahora dos backends que hacen lo mismo por vias distintas:

- **Django** (`backend/`): sincrono, la foto va y vuelve en la misma request.
  Funciona hoy, con modo mock incluido para probar sin GPU.
- **Convex + gpu_service**: asincrono y reactivo, la foto se sube a Convex
  storage y el estado se actualiza solo. Necesita login de Convex, la PC con
  la 3050 y ngrok.

Los dos terminan alimentando el mismo `AvatarViewer.jsx`. No se estorban:
puedes dejar los dos y elegir cual conectas en `App.jsx`.
