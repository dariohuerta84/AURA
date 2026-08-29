import { useEffect, useState } from "react";
import AvatarViewer from "./AvatarViewer";

// En desarrollo el proxy de Vite manda /api al Django de :8000 (ver vite.config.js).
// En produccion, apunta VITE_API_URL a tu backend real.
const API_URL = `${import.meta.env.VITE_API_URL ?? ""}/api/avatar/generate/`;

export default function UploadAvatar() {
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Las URL de objeto ocupan memoria hasta que se revocan.
  useEffect(() => () => preview && URL.revokeObjectURL(preview), [preview]);

  async function handleFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    setAvatarUrl(null);
    setPreview((anterior) => {
      if (anterior) URL.revokeObjectURL(anterior);
      return URL.createObjectURL(file);
    });

    const formData = new FormData();
    formData.append("photo", file);

    try {
      const res = await fetch(API_URL, { method: "POST", body: formData });

      // Si el backend se cae, la respuesta es HTML y res.json() revienta con
      // un error de parseo que no dice nada. Mejor leer texto y decidir.
      const texto = await res.text();
      let data;
      try {
        data = JSON.parse(texto);
      } catch {
        throw new Error(
          res.ok
            ? "El servidor respondio algo que no es JSON."
            : `El servidor respondio ${res.status}. Revisa que Django este corriendo.`
        );
      }

      if (!res.ok) throw new Error(data.error || "Error generando el avatar");

      setAvatarUrl(data.avatar_url);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="subida">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={loading}
        />
        {preview && <img className="miniatura" src={preview} alt="Foto subida" />}
      </div>

      {loading && (
        <p className="estado">
          Generando tu avatar 3D… En GPU son segundos; en CPU puede tardar
          varios minutos. No cierres la pestana.
        </p>
      )}
      {error && <p className="estado error">{error}</p>}

      <AvatarViewer avatarUrl={avatarUrl} />
    </div>
  );
}
