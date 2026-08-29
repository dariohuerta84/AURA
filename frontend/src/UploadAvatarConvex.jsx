import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import AvatarViewer from "./AvatarViewer";

export default function UploadAvatarConvex({ theme = "equilibrio" }) {
  const generateUploadUrl = useMutation(api.avatars.generateUploadUrl);
  const createAvatarJob = useMutation(api.avatars.createAvatarJob);
  const [avatarId, setAvatarId] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [progress, setProgress] = useState(0);

  const latestAvatar = useQuery(api.avatars.getLatestAvatar);
  const avatarJob = useQuery(
    api.avatars.getAvatar,
    avatarId ? { avatarId } : "skip"
  );

  const avatar = avatarId ? avatarJob : latestAvatar;

  const isGenerating = avatar?.status === "pending";
  const isProcessing = isUploading || isGenerating;

  // Manejador de la barra de progreso animada
  useEffect(() => {
    let timer;
    if (isUploading) {
      setProgress(15);
    } else if (isGenerating) {
      setProgress((prev) => (prev < 30 ? 35 : prev));
      timer = setInterval(() => {
        setProgress((old) => {
          if (old >= 92) return 92;
          const diff = Math.floor(Math.random() * 8) + 3;
          return Math.min(old + diff, 92);
        });
      }, 500);
    } else if (avatar?.status === "done") {
      setProgress(100);
    } else if (avatar?.status === "error" || uploadError) {
      setProgress(0);
    }
    return () => clearInterval(timer);
  }, [isUploading, isGenerating, avatar?.status, uploadError]);

  async function handleFileChange(event) {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setUploadError(null);
      setProgress(10);

      let uploadUrl = await generateUploadUrl();
      if (window.location.hostname && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
        uploadUrl = uploadUrl.replace("127.0.0.1", window.location.hostname).replace("localhost", window.location.hostname);
      }

      console.log("Subiendo a URL:", uploadUrl);
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type || "image/png" },
        body: file,
      });

      if (!result.ok) {
        throw new Error(`Error en el servidor de almacenamiento (${result.status})`);
      }

      const { storageId } = await result.json();
      const id = await createAvatarJob({ photoStorageId: storageId });
      setAvatarId(id);
    } catch (err) {
      console.error("Error subiendo foto:", err);
      setUploadError(err.message || String(err));
      setProgress(0);
    } finally {
      setIsUploading(false);
    }
  }

  let stepMessage = "Subir foto para proyección 3D";
  if (isUploading) stepMessage = "⚡ Subiendo imagen a almacenamiento...";
  else if (progress > 0 && progress < 40) stepMessage = "🧠 Removiendo fondo & segmentando sujeto...";
  else if (progress >= 40 && progress < 80) stepMessage = "🔮 Reconstruyendo Malla 3D en GPU (TripoSR CUDA)...";
  else if (progress >= 80 && progress < 100) stepMessage = "✨ Finalizando archivo .GLB y textura...";
  else if (avatar?.status === "done") stepMessage = "✅ ¡Avatar Cyber-Biológico generado con éxito!";

  let buttonText = "SUBIR FOTO AVATAR";
  if (isUploading) buttonText = "SUBIENDO FOTO...";
  else if (isGenerating) buttonText = `PROCESANDO 3D (${progress}%)...`;
  else if (avatar?.status === "done") buttonText = "SUBIR OTRA FOTO";

  let meshUrl = avatar?.meshUrl;
  if (meshUrl && typeof window !== "undefined" && window.location.hostname && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
    meshUrl = meshUrl.replace("127.0.0.1", window.location.hostname).replace("localhost", window.location.hostname);
  }
  if (meshUrl && !meshUrl.includes(".glb") && !meshUrl.includes(".gltf")) {
    meshUrl += "#avatar.glb";
  }

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      
      {/* 3D Viewport or Cyber Scanner Placeholder */}
      <div className="avatar-3d-viewport">
        {meshUrl ? (
          <AvatarViewer avatarUrl={meshUrl} theme={theme} key={meshUrl} />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20, textAlign: "center", background: "radial-gradient(circle, rgba(14,165,233,0.08) 0%, rgba(0,0,0,0) 70%)" }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", border: "2px dashed var(--active-accent)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14, boxShadow: "0 0 20px rgba(14,165,233,0.2)" }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--active-accent)" strokeWidth="1.5">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
            </div>
            <span style={{ color: "#ffffff", fontSize: "0.85rem", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 4 }}>
              ESCÁNER 3D TRAPOSR AI
            </span>
            <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.75rem", maxWidth: 240, lineHeight: "1.4" }}>
              Carga tu foto para sintetizar y proyectar tu entidad 3D en GPU
            </span>
          </div>
        )}
      </div>

      {/* Progress Bar Container */}
      {isProcessing && (
        <div style={{ width: "85%", maxWidth: 320, marginTop: 12, marginBottom: 8, textAlign: "center" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "var(--active-accent)", fontWeight: 700, marginBottom: 4, letterSpacing: "0.5px" }}>
            <span>{stepMessage}</span>
            <span>{progress}%</span>
          </div>
          <div style={{ width: "100%", height: 6, background: "rgba(255,255,255,0.1)", borderRadius: 3, overflow: "hidden", border: "1px solid rgba(255,255,255,0.15)" }}>
            <div 
              style={{ 
                width: `${progress}%`, 
                height: "100%", 
                background: "linear-gradient(90deg, #0ea5e9, #a855f7)", 
                borderRadius: 3, 
                transition: "width 0.4s ease-out",
                boxShadow: "0 0 10px #0ea5e9"
              }} 
            />
          </div>
        </div>
      )}

      {/* Upload Trigger Floating Button */}
      <label className="upload-avatar-trigger" style={{ cursor: isUploading ? "wait" : "pointer" }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        {buttonText}
        <input 
          type="file" 
          accept="image/png, image/jpeg, image/jpg, image/webp" 
          onChange={handleFileChange} 
          className="hidden-file-input"
          disabled={isUploading}
        />
      </label>

      {(uploadError || avatar?.status === "error") && (
        <p style={{ color: "#ff3b5c", fontSize: "0.75rem", marginTop: 8, textAlign: "center", background: "rgba(255,59,92,0.1)", padding: "4px 8px", borderRadius: 4 }}>
          ⚠️ {uploadError || avatar?.errorMessage || "Error en el procesamiento del avatar."}
        </p>
      )}
    </div>
  );
}
