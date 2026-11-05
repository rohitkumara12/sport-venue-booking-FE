
"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/auth.context";
import { Camera, UserRound } from "lucide-react";
import { uploadProfileImage } from "@/services/auth.service";
import { useRouter } from "next/navigation"
import { Booking } from "@/types/booking";
import { MyMembership } from "@/types/membership";
import { getMyMemberships } from "@/services/membership.services";
import { getMyBookings } from "@/services/booking.service";

export default function ProfilePage() {
  const { user, isLoading, refreshProfile } = useAuth();
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
const [uploadMessage, setUploadMessage] = useState("");
const [dataError,setDataError] = useState("")
const [isloadingData,setIsLoadingData] = useState(true)
const [bookings,setBookings] = useState<Booking[]>([])
const [memberships, setMemberships] = useState<MyMembership[]>([]);

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
useEffect(() => {
  if (isLoading || !user) return;

  async function fetchProfileData() {
    try {
      setIsLoadingData(true);
      setDataError("");

      const [membershipResult, bookingResult] = await Promise.all([
        getMyMemberships(),
        getMyBookings(),
      ]);

      setMemberships(membershipResult);
      setBookings(bookingResult);
    } catch (error) {
      console.error("Gagal mengambil data profile:", error);
      setDataError("Gagal memuat membership atau riwayat booking.");
    } finally {
      setIsLoadingData(false);
    }
  }

  fetchProfileData();
}, [user, isLoading]);
const formatPrice = (price: number | string) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(price));

const formatDate = (date: string | null) => {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};
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
      {/* Membership Saya */}
<section className="mx-auto mt-8 max-w-2xl rounded-2xl bg-white p-8 shadow-sm">
  <h2 className="mb-6 text-xl font-bold text-gray-800">
    Membership Saya
  </h2>

  {isloadingData ? (
    <p className="text-gray-500">Memuat membership...</p>
  ) : memberships.length === 0 ? (
    <p className="text-gray-500">
      Kamu belum memiliki membership.
    </p>
  ) : (
    <div className="space-y-4">
      {memberships.map((membership) => (
        <div
          key={membership.id}
          className="rounded-xl border border-gray-200 p-5"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-semibold text-gray-800">
              {membership.membershipPlan.name}
            </h3>

            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
              {membership.status}
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Total Sesi</p>
              <p className="mt-1 font-semibold text-gray-800">
                {membership.totalSessions}
              </p>
            </div>

            <div>
              <p className="text-gray-500">Sisa Sesi</p>
              <p className="mt-1 font-semibold text-emerald-600">
                {membership.remainingSessions}
              </p>
            </div>

            <div>
              <p className="text-gray-500">Harga Paket</p>
              <p className="mt-1 font-semibold text-gray-800">
                {formatPrice(membership.membershipPlan.price)}
              </p>
            </div>

            <div>
              <p className="text-gray-500">Berlaku Sampai</p>
              <p className="mt-1 font-semibold text-gray-800">
                {formatDate(membership.expiresAt)}
              </p>
            </div>
          </div>

          {membership.transactions?.[0] && (
            <div className="mt-4 border-t pt-3 text-sm">
              <p className="text-gray-500">Status Transaksi</p>
              <p className="mt-1 font-medium text-gray-800">
                {membership.transactions[0].status}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  )}
</section>


<section className="mx-auto mt-8 max-w-2xl rounded-2xl bg-white p-8 shadow-sm">
  <h2 className="mb-6 text-xl font-bold text-gray-800">
    Riwayat Booking
  </h2>

  {isloadingData ? (
    <p className="text-gray-500">Memuat riwayat booking...</p>
  ) : bookings.length === 0 ? (
    <p className="text-gray-500">
      Kamu belum memiliki riwayat booking.
    </p>
  ) : (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <div
          key={booking.id}
          className="rounded-xl border border-gray-200 p-5"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-semibold text-gray-800">
              {booking.court.name}
            </h3>

            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
              {booking.status}
            </span>
          </div>

          <div className="mt-4 space-y-2 text-sm">
            <p className="text-gray-500">
              Mulai:{" "}
              <span className="font-medium text-gray-800">
                {new Date(booking.startTime).toLocaleString("id-ID")}
              </span>
            </p>

            <p className="text-gray-500">
              Selesai:{" "}
              <span className="font-medium text-gray-800">
                {new Date(booking.endTime).toLocaleString("id-ID")}
              </span>
            </p>

            <p className="text-gray-500">
              Total Harga:{" "}
              <span className="font-semibold text-gray-800">
                {formatPrice(booking.totalPrice)}
              </span>
            </p>

            <p className="text-gray-500">
              Transaksi:{" "}
              <span className="font-medium text-gray-800">
                {booking.transaction?.status ?? "Belum ada transaksi"}
              </span>
            </p>
          </div>
        </div>
      ))}
    </div>
  )}
</section>

{dataError && (
  <p className="mx-auto mt-4 max-w-2xl text-sm text-red-600">
    {dataError}
  </p>
)}
    </main>
  );
}
