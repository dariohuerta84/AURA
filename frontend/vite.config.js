import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// El proxy evita CORS en desarrollo: el navegador habla solo con :5173 y
// Vite reenvia /api y /media al Django de :8000.
//
// changeOrigin queda en false a proposito: asi Django ve el Host original
// (localhost:5173) y la avatar_url que devuelve apunta a ese mismo origen,
// o sea vuelve a pasar por el proxy. Con changeOrigin:true devolveria una
// URL a :8000 y el navegador se saldria del proxy.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // convex/_generated/ vive en la raiz, un nivel arriba de esta carpeta.
    // Sin esto Vite se niega a servir archivos fuera de frontend/.
    fs: { allow: [".."] },
    proxy: {
      "/api": { target: "http://127.0.0.1:8000", changeOrigin: false },
      "/media": { target: "http://127.0.0.1:8000", changeOrigin: false },
    },
  },
});
