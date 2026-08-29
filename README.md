# AURA — Avatar 3D desde foto (TripoSR)

Genera un avatar 3D de cuerpo completo a partir de una foto usando
**TripoSR** (open source, MIT, uso comercial permitido) y lo muestra en la web
con rotacion de camara. Sin animacion de caminar: el "movimiento" es girar el
modelo arrastrando el mouse.

## Estructura

```
PERSONAJE/
├── .env                      configuracion local (no se sube a git)
├── .env.example              plantilla con todas las variables explicadas
├── backend/
│   ├── manage.py             lee el .env solo, sin python-dotenv
│   ├── requirements.txt      4 dependencias livianas (NO incluye torch)
│   ├── avatar_project/       proyecto Django minimo, autocontenido
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── avatar3d/             LA APP (esto es lo que mueves a GAVI-CRM)
│   │   ├── generate_avatar.py   wrapper que invoca TripoSR
│   │   ├── views.py             endpoint POST /api/avatar/generate/
│   │   ├── urls.py
│   │   └── assets/mock_avatar.glb
│   └── tools/make_mock_avatar.py
├── convex/                   camino B: backend reactivo en la nube
│   ├── schema.ts             tabla avatars (pending / done / error)
│   └── avatars.ts            subida, job, y accion que llama al servicio GPU
├── gpu_service/              servidor FastAPI que corre TripoSR en la PC con GPU
│   ├── server.py             POST /generate -> devuelve el .glb
│   └── requirements.txt
├── frontend/                 app React + Vite lista para correr
│   └── src/
│       ├── UploadAvatar.jsx        camino A: sube la foto al Django local
│       ├── UploadAvatarConvex.jsx  camino B: sube a Convex (no conectado aun)
│       └── AvatarViewer.jsx        visor three.js, compartido por los dos
└── visor-360/                el visor de fotos anterior (proyecto aparte)
```

## Arquitectura: Convex es el backend

La app corre sobre **Convex** (proyecto `aura`, deployment `giddy-eagle-383`).
Convex tiene:

- la **base de datos** (tabla `avatars`, con el estado del job),
- el **storage** de las fotos subidas y de los `.glb` generados,
- la **orquestacion**: `createAvatarJob` inserta el registro y agenda con
  `ctx.scheduler.runAfter` la accion que genera el avatar,
- el **estado reactivo** que el frontend consume con `useQuery`, sin polling.

TripoSR necesita GPU y Convex corre en la nube, asi que la generacion se
delega a `gpu_service/`: un worker FastAPI que corre en una PC con GPU y que
una accion de Convex invoca por HTTP. Es el patron normal para trabajo pesado:
Convex sigue siendo el backend, el worker es solo un brazo ejecutor.

```
navegador → Convex (BD + storage + scheduler) → gpu_service (GPU) → TripoSR
     ↑__________ estado reactivo (useQuery) __________|
```

### Sobre `backend/` (Django)

Fue la primera version, sincrona y local, antes de mover el backend a Convex.
**Ya no esta conectada al frontend** y no hace falta para correr la app; se
queda en el repo como referencia y como banco de pruebas offline (tiene un
modo mock que genera un avatar de juguete sin GPU). Lo que sigue de este
README describe ese camino.

`backend/avatar3d/` es autonomo: cuando quieras, copias esa carpeta a GAVI-CRM,
la agregas a `INSTALLED_APPS` y sumas `path("", include("avatar3d.urls"))` a tu
`urls.py`. `avatar_project/` existe solo para poder correr esto suelto.

## Arrancar (modo prueba, sin TripoSR)

El `.env` viene con `AVATAR_MOCK=1`: el backend no llama a TripoSR y devuelve
un munequito de cajas. Sirve para ver la cadena completa funcionando —
subir foto, backend, visor 3D girando — antes de pelear con TripoSR.

Terminal 1 (backend):

```bash
cd backend
.venv/Scripts/python.exe manage.py runserver
```

Terminal 2 (frontend):

```bash
cd frontend
npm run dev
```

Abre http://localhost:5173, sube cualquier foto y deberias ver el munequito
girando. Si eso funciona, el unico pendiente es TripoSR.

> El venv de `backend/` y el `node_modules/` de `frontend/` ya estan
> instalados. Para rehacerlos: `py -3.13 -m venv backend/.venv` +
> `backend/.venv/Scripts/python.exe -m pip install -r backend/requirements.txt`
> y `npm install` dentro de `frontend/`.

Diagnostico rapido de la configuracion, sin gastar una foto:

```bash
curl http://127.0.0.1:8000/api/avatar/health/
```

## Conectar TripoSR de verdad

TripoSR corre en **su propio entorno** (su repo, su venv, su torch con CUDA).
El backend no lo importa: lo llama como subproceso. Por eso Django se mantiene
liviano y actualizar TripoSR no rompe nada aca.

1. Clonar y probar TripoSR solo:

   ```bash
   git clone https://github.com/VAST-AI-Research/TripoSR
   cd TripoSR
   py -3.10 -m venv .venv          # torch/torchmcubes no tienen ruedas para 3.13+
   .venv/Scripts/python.exe -m pip install --upgrade setuptools
   .venv/Scripts/python.exe -m pip install -r requirements.txt
   .venv/Scripts/python.exe run.py examples/chair.png --output-dir output/ --device cuda
   ```

   Si aparece un mesh en `output/`, TripoSR ya funciona por su cuenta.

2. En el `.env` de este proyecto:

   ```
   AVATAR_MOCK=0
   TRIPOSR_REPO_PATH=C:/ruta/donde/clonaste/TripoSR
   TRIPOSR_PYTHON=                 # vacio = busca .venv dentro del repo
   AVATAR_DEVICE=auto              # auto | cuda | cpu
   ```

3. Reinicia el backend y sube una foto de cuerpo completo, fondo simple,
   persona centrada. TripoSR le quita el fondo con `rembg`, pero rinde mucho
   mejor con fotos limpias.

### Sobre tu GPU

Esta maquina tiene una **NVIDIA MX350 (2 GB de VRAM)**. TripoSR pide del orden
de 6 GB, asi que con `--device cuda` lo mas probable es que muera con
`CUDA out of memory`. Opciones:

- `AVATAR_DEVICE=cpu` — funciona, tarda entre 1 y 3 minutos por avatar.
  Sube `AVATAR_TIMEOUT` si se corta.
- Correr el backend en tu EC2 con GPU, que es el destino final igual.

El `torch` que tienes instalado en Python 3.14 es la build **CPU** (`2.9.0+cpu`),
sin CUDA. No afecta a este backend (no importa torch), pero tenlo en cuenta al
armar el entorno de TripoSR.

## Detalles que ya estan resueltos en el codigo

- **Formato de salida**: TripoSR exporta `.obj` por defecto y el visor
  (`useGLTF`) solo lee glTF/GLB. El wrapper pasa `--model-save-format glb`, y
  si aun asi llega un `.obj`, el visor lo carga con `OBJLoader`.
- **Nombres unicos**: TripoSR llama `mesh.glb` a todas sus salidas. La vista
  renombra cada mesh con un UUID antes de moverlo a `media/`, si no cada
  avatar pisaba al anterior.
- **Mover entre discos**: se usa `shutil.move` y no `Path.replace`, que falla
  cruzando volumenes (C:\ vs D:\).
- **Auto-encuadre**: TripoSR no garantiza una escala fija. El visor calcula el
  bounding box y centra/escala el modelo, en vez de fijar `scale={1}`.
- **Temporales**: la foto subida se borra siempre, y la carpeta de trabajo de
  TripoSR se limpia despues de mover el mesh.
- **Variables vacias**: `MEDIA_ROOT=` en el `.env` cuenta como ausente, no
  como la ruta `"."`.

## Alcance de esta v1

- Generacion **sincrona**: el usuario espera. Cuando moleste, lo que cambia es
  `views.py` (encolar a Celery y devolver un `job_id`), no `generate_avatar.py`.
- Endpoint **publico**: sin autenticacion. Al montarlo en GAVI-CRM, pon
  `IsAuthenticated` en `REST_FRAMEWORK` (settings.py) y limita el rate.
- Django sirve los `.glb` desde `media/` solo con `DEBUG=1`. En produccion eso
  lo hace nginx o S3.
- Sin animacion de huesos. Eso seria otro modelo (LHM u otro animable), no
  TripoSR.

## visor-360/

Es tu proyecto anterior — el que arma un giro 360 a partir de fotos numeradas.
No tiene relacion con el backend de TripoSR; lo movi a su propia carpeta para
que dejara de mezclarse. Sigue funcionando igual: abre `visor-360/index.html`,
y `preparar_frames.py` se corre desde dentro de esa carpeta.
