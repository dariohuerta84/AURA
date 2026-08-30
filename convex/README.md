# convex/

Funciones y esquema de Convex. Esta carpeta la lee el CLI de Convex, que corre
desde la RAIZ del proyecto (ahi esta el package.json con la dependencia).

## Inicializar (una sola vez, lo tienes que correr tu)

```bash
npx convex dev
```

Ese comando abre el navegador para que inicies sesion en tu cuenta de Convex y
elijas/crees el deployment. No se puede automatizar desde aca porque requiere
tu login. Al terminar:

- escribe `CONVEX_DEPLOYMENT` y `VITE_CONVEX_URL` en `.env.local` (ignorado por git)
- genera `convex/_generated/` con los tipos de tus funciones
- queda corriendo, sincronizando cambios de esta carpeta con el deployment

Con el deployment ya creado, para verificar tipos sin levantar el sync:

```bash
npm run typecheck
```
