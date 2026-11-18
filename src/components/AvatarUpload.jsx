import React, { useState } from "react";
import { Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getAvatarUrl, subirFotoPerfil } from "../services/auth";

export default function AvatarUpload({
  fotoUrl,
  nombre = "",
  email = "",
  onAvatarUpdated,
  size = "md",
}) {
  const [uploading, setUploading] = useState(false);

  const sizeClasses = {
    sm: "w-16 h-16 text-xl",
    md: "w-24 h-24 text-3xl",
    lg: "w-32 h-32 text-4xl",
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validación de tipo de archivo
    if (!file.type.startsWith("image/")) {
      toast.error("Por favor selecciona un archivo de imagen válido (JPG, PNG, WEBP, GIF)");
      return;
    }

    // Validación de tamaño (< 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("La imagen no debe superar los 5 MB de tamaño");
      return;
    }

    try {
      setUploading(true);
      toast.loading("Subiendo foto de perfil...", { id: "upload-avatar" });
      const res = await subirFotoPerfil(file);
      const newUrl = res?.foto_url || res?.url;

      if (newUrl) {
        toast.success("Foto de perfil actualizada exitosamente", { id: "upload-avatar" });
        try {
          const userStr = localStorage.getItem("user");
          if (userStr) {
            const userObj = JSON.parse(userStr);
            userObj.foto_url = newUrl;
            localStorage.setItem("user", JSON.stringify(userObj));
            window.dispatchEvent(new Event("userProfileUpdated"));
          }
        } catch (e) {
          console.error("Error actualizando user en storage:", e);
        }
        if (onAvatarUpdated) {
          onAvatarUpdated(newUrl);
        }
      } else {
        toast.error("No se pudo obtener la URL de la imagen", { id: "upload-avatar" });
      }
    } catch (err) {
      toast.error(err.message || "Error al subir la foto de perfil", { id: "upload-avatar" });
    } finally {
      setUploading(false);
      // Reset input value
      e.target.value = "";
    }
  };

  const currentAvatarUrl = getAvatarUrl(fotoUrl);
  const initials = (nombre || email || "U").charAt(0).toUpperCase();

  return (
    <div className="relative inline-block group">
      {/* Contenedor del Avatar */}
      <div
        className={`${sizeClasses[size] || sizeClasses.md} rounded-full overflow-hidden border-4 border-white shadow-xl shadow-slate-200/50 bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-extrabold flex-shrink-0 relative transition-transform duration-200 group-hover:scale-105`}
      >
        {currentAvatarUrl ? (
          <img
            src={currentAvatarUrl}
            alt={nombre || "Foto de perfil"}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Si falla la imagen, ocultarla y mostrar iniciales
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <span>{initials}</span>
        )}

        {/* Overlay translúcido al hacer hover */}
        <label
          htmlFor="avatar-file-input"
          className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[11px] font-bold cursor-pointer transition-opacity backdrop-blur-xs"
        >
          <Camera className="w-5 h-5 mb-0.5" />
          <span>Cambiar</span>
        </label>
      </div>

      {/* Botón flotante inferior derecho con icono de cámara */}
      <label
        htmlFor="avatar-file-input"
        className="absolute bottom-0 right-0 p-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-full shadow-lg border-2 border-white cursor-pointer transition-all hover:scale-110 flex items-center justify-center"
        title="Subir nueva foto de perfil"
      >
        {uploading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Camera className="w-4 h-4" />
        )}
      </label>

      {/* Input File oculto */}
      <input
        type="file"
        id="avatar-file-input"
        accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
        onChange={handleFileChange}
        disabled={uploading}
        className="hidden"
      />
    </div>
  );
}
