import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
// Ruta con dos niveles: este archivo vive en frontend/src/ (junto a
// AvatarViewer) y la carpeta convex/ esta en la raiz del proyecto.
import { api } from "../../convex/_generated/api";
import AvatarViewer from "./AvatarViewer";

export default function UploadAvatarConvex() {
  const generateUploadUrl = useMutation(api.avatars.generateUploadUrl);
  const createAvatarJob = useMutation(api.avatars.createAvatarJob);
  const [avatarId, setAvatarId] = useState(null);

  // Reactivo: se actualiza solo cuando el estado cambia en Convex,
  // sin necesidad de hacer polling manual.
  const avatar = useQuery(
    api.avatars.getAvatar,
    avatarId ? { avatarId } : "skip"
  );

  async function handleFileChange(event) {
    const file = event.target.files[0];
    if (!file) return;

    const uploadUrl = await generateUploadUrl();

    const result = await fetch(uploadUrl, {
      method: "POST",
      headers: { "Content-Type": file.type },
      body: file,
    });
    const { storageId } = await result.json();

    const id = await createAvatarJob({ photoStorageId: storageId });
    setAvatarId(id);
  }

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />

      {(avatar?.status === "pending") && (
        <p>Generando tu avatar 3D (usando la GPU de tu compañero)...</p>
      )}
      {avatar?.status === "error" && (
        <p style={{ color: "red" }}>Error: {avatar.errorMessage}</p>
      )}

      <AvatarViewer avatarUrl={avatar?.meshUrl} />
    </div>
  );
}
