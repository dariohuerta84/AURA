import UploadAvatar from "./UploadAvatar";

export default function App() {
  return (
    <main className="pagina">
      <h1>Avatar 3D desde una foto</h1>
      <p className="ayuda">
        Sube una foto de cuerpo completo, fondo simple y persona centrada.
        Arrastra sobre el modelo para girarlo.
      </p>
      <UploadAvatar />
    </main>
  );
}
