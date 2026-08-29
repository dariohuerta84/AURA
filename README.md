# AURA — Avatar 3D desde una foto

Subes una foto y obtienes un avatar 3D que puedes girar en el navegador.

## Arquitectura: Convex es el backend

```
navegador → Convex (BD + storage + scheduler) → generador 3D → .glb
     ↑__________ estado reactivo (useQuery) __________|
```

Convex (proyecto `aura`, deployment `giddy-eagle-383`) tiene:

- la **base de datos**: tabla `avatars` con el estado de cada job,
- el **storage** de las fotos subidas y de los `.glb` generados,
- la **orquestacion**: `createAvatarJob` inserta el registro y agenda con
  `ctx.scheduler.runAfter` la accion que genera el avatar,
- el **estado reactivo** que el frontend consume con `useQuery`, sin polling.

La generacion 3D necesita GPU y Convex corre en la nube, asi que esa parte se
delega a un servicio externo que una accion de Convex invoca por HTTP. Es el
patron normal para trabajo pesado: Convex sigue siendo el backend.

## Estructura

```
AURA/
├── convex/                   backend
│   ├── schema.ts             tabla avatars (pending / done / error)
│   └── avatars.ts            subida, job, y accion que llama al generador
├── gpu_service/              worker FastAPI + TripoSR para una PC con GPU
├── frontend/                 React + Vite
│   └── src/
│       ├── UploadAvatarConvex.jsx  sube a Convex y sigue el estado
│       └── AvatarViewer.jsx        visor three.js con auto-encuadre
└── visor-360/                visor de fotos anterior (proyecto aparte)
```

## Correr el frontend

```bash
cd frontend
npm install
npm run dev
```

Necesitas `frontend/.env.local` con la URL del deployment:

```
VITE_CONVEX_URL=https://giddy-eagle-383.convex.cloud
```

Ese archivo no va a git: pidesela a quien tenga el proyecto.

## Estado del generador 3D

La cadena de Convex esta verificada de punta a punta: subida a storage,
insercion en BD, accion agendada y estado reactivo. Lo que falta es conectar
un generador. Ver **HANDOFF.md** para el worker con GPU propia.

Si `AVATAR_GPU_SERVICE_URL` no esta configurada, cada job termina en `error`
con un mensaje que lo dice — es el comportamiento esperado, no un bug.
