
"use client";

import { useRef, useState } from "react";
import { useAuth } from "@/context/auth.context";
import { Camera, UserRound } from "lucide-react";
import { uploadProfileImage } from "@/services/auth.service";
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const { user, isLoading, refreshProfile } = useAuth();
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
const [uploadMessage, setUploadMessage] = useState("");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("File harus berupa gambar.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran foto maksimal 5 MB.");
      return;
    }

    setSelectedFile(file);

    if (preview) URL.revokeObjectURL(preview);

    setPreview(URL.createObjectURL(file));
  }

  if (isLoading) {
    return <div className="p-8">Memuat profile...</div>;
  }

  if (!user) {
    return <div className="p-8">Silakan login terlebih dahulu.</div>;
  }

  const profileImage = preview || user.profile_Image;
async function handleUpload(){
    if(!selectedFile) return
    try {
        setIsUploading(true);
        setUploadMessage("")

        await uploadProfileImage(selectedFile);

        await refreshProfile();

        setSelectedFile(null);
        setPreview(null)

        setUploadMessage("Foto profil berhasil diperbarui");
    } catch (error) {
        console.error("Upload foto gagal:",error);
        setUploadMessage("Upload foto gagal,silahkan coba lagi.");
    } finally {
        setIsUploading(false)
    }
}
  return (
    <main className="min-h-screen bg-[#f8f8f5] px-4 py-12">
        <button
            onClick={() => router.push("/")}
            className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black transition"
            >
            ← Back to Dashboard
        </button>
      <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="mb-8 text-2xl font-bold text-gray-800">
          Profile Saya
        </h1>

        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            {profileImage ? (
              <img
                src={profileImage}
                alt="Foto profil"
                className="h-32 w-32 rounded-full border-4 border-gray-100 object-cover"
              />
            ) : (
              <div className="flex h-32 w-32 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <UserRound size={56} />
              </div>
            )}

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 rounded-full bg-emerald-600 p-3 text-white shadow"
              aria-label="Pilih foto profil"
            >
              <Camera size={18} />
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          <p className="text-sm text-gray-500">
            Pilih foto maksimal 5 MB
          </p>

          <div className="mt-4 w-full space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">
                Nama
              </label>
              <p className="mt-1 rounded-lg bg-gray-50 p-3 text-gray-800">
                {user.name}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">
                Email
              </label>
              <p className="mt-1 rounded-lg bg-gray-50 p-3 text-gray-800">
                {user.email}
              </p>
            </div>
          </div>

          {selectedFile && (
            <button type="button"
            onClick={handleUpload}
            disabled={isUploading}
            className="mt-4 rounded-xl bg-emerald-600 px-6 py-3 font-semibold test-white disabled:opacity-50">
                {isUploading ? "Mengupload..." : "Upload Foto"}
            </button>
          )}
          {uploadMessage && (
            <p className="mt-3 text-sm">{uploadMessage}</p>
          )}
        </div>
      </div>
    </main>
  );
}
