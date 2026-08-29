import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./estilos.css";

// ---------------------------------------------------------------------
// Para activar el flujo Convex (recien DESPUES de correr `npx convex dev`,
// que es lo que genera convex/_generated/):
//
//   1. Descomenta estas dos lineas:
//        import { ConvexProvider, ConvexReactClient } from "convex/react";
//        const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);
//   2. Envuelve <App /> de abajo en <ConvexProvider client={convex}>.
//   3. En App.jsx cambia UploadAvatar por UploadAvatarConvex.
//
// No se puede dejar activo desde ya: UploadAvatarConvex importa
// ../../convex/_generated/api, que no existe hasta el codegen, y eso
// romperia el build del flujo Django que hoy si funciona.
// ---------------------------------------------------------------------

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
