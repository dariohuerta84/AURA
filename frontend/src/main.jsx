import React from "react";
import ReactDOM from "react-dom/client";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import App from "./App";
import "./estilos.css";

// Convex es el backend de la app: base de datos, storage de las fotos y de
// los .glb, y la orquestacion del job de generacion. El servicio con GPU es
// solo un worker externo que una accion de Convex invoca.
const convexUrl = import.meta.env.VITE_CONVEX_URL;

if (!convexUrl) {
  throw new Error(
    "Falta VITE_CONVEX_URL en frontend/.env.local. Copiala del CONVEX_URL " +
      "que `npx convex dev` deja en el .env.local de la raiz."
  );
}

const convex = new ConvexReactClient(convexUrl);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ConvexProvider client={convex}>
      <App />
    </ConvexProvider>
  </React.StrictMode>
);
