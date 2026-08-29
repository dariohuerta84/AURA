import UploadAvatarConvex from "./UploadAvatarConvex";

export default function App() {
  return (
    <main className="pagina">
      <h1>AURA — Avatar 3D desde una foto</h1>
      <p className="ayuda">
        Sube una foto de cuerpo completo, fondo simple y persona centrada.
        La foto se guarda en Convex, que agenda la generacion y actualiza el
        estado solo. Arrastra sobre el modelo para girarlo.
      </p>
      <UploadAvatarConvex />
    </main>
  );
}
