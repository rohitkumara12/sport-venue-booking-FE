
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { ChangeEvent, FormEvent } from "react";
import type { PurchaseMembershipResponse } from "@/types/membership";
import { submitMembershipPaymentProof } from "@/services/membership.services";

interface CloudinaryUploadResponse {
  secure_url: string;
}

export default function MembershipPaymentPage() {
  const router = useRouter();

  const [purchase, setPurchase] =
    useState<PurchaseMembershipResponse | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const storedPurchase = sessionStorage.getItem(
      "pendingMembershipPurchase"
    );

    if (!storedPurchase) {
      router.replace("/cust-Membership");
      return;
    }

    try {
      const parsedPurchase: PurchaseMembershipResponse =
        JSON.parse(storedPurchase);

      setPurchase(parsedPurchase);
    } catch {
      sessionStorage.removeItem("pendingMembershipPurchase");
      router.replace("/cust-Membership");
    }
  }, [router]);

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");

    if (!file.type.startsWith("image/")) {
      setError("File harus berupa gambar.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Ukuran foto maksimal 5 MB.");
      event.target.value = "";
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!purchase || !selectedFile) {
      setError("Silakan pilih foto bukti pembayaran.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      const cloudName =
        process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

      const uploadPreset =
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

      if (!cloudName || !uploadPreset) {
        throw new Error("Konfigurasi Cloudinary belum lengkap.");
      }

      // Upload foto ke Cloudinary
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("upload_preset", uploadPreset);
      formData.append("folder", "membership-proofs");

      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const uploadData = await uploadResponse.json();

      if (!uploadResponse.ok) {
        throw new Error(
          uploadData.error?.message || "Gagal mengupload foto."
        );
      }

      const result: CloudinaryUploadResponse = uploadData;

      // Kirim URL foto ke backend
      await submitMembershipPaymentProof(
        purchase.membership.id,
        result.secure_url
      );

      setSuccess(true);

      sessionStorage.removeItem("pendingMembershipPurchase");
      sessionStorage.removeItem("pendingMembershipId");
      sessionStorage.removeItem("pendingMembershipTransactionId");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal mengirim bukti pembayaran."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!purchase) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p>Memuat detail pembelian...</p>
      </main>
    );
  }

  const formattedPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(purchase.transaction.amount));

  if (success) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
          <div className="text-5xl">✓</div>

          <h1 className="mt-4 text-2xl font-bold">
            Bukti Pembayaran Terkirim!
          </h1>

          <p className="mt-3 text-gray-500">
            Bukti pembayaran kamu berhasil dikirim dan sedang
            menunggu verifikasi admin.
          </p>

          <button
            onClick={() => router.push("/cust-Membership")}
            className="mt-6 w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Kembali ke Membership
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-xl rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">
          Pembayaran Membership
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Periksa detail pembelian dan unggah bukti pembayaran.
        </p>

        <div className="mt-6 space-y-4 border-t border-gray-200 pt-5">
          <div>
            <p className="text-sm text-gray-500">Nama Paket</p>
            <p className="font-semibold">
              {purchase.membershipPlan.name}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Total Pembayaran</p>
            <p className="text-2xl font-bold">
              {formattedPrice}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Jumlah Sesi</p>
            <p className="font-semibold">
              {purchase.membershipPlan.sessionCount} sesi
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Masa Berlaku</p>
            <p className="font-semibold">
              {purchase.membershipPlan.durationDays} hari
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Status Transaksi</p>
            <p className="font-semibold text-yellow-600">
              {purchase.transaction.status}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 border-t pt-6">
          <h2 className="text-lg font-bold">
            Upload Bukti Pembayaran
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Pilih foto bukti transfer dengan format gambar,
            maksimal 5 MB.
          </p>

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-4 block w-full rounded-lg border border-gray-300 p-3 text-sm"
            disabled={isSubmitting}
          />

          {previewUrl && (
            <div className="mt-4">
              <p className="mb-2 text-sm font-medium">
                Preview Foto
              </p>

              <img
                src={previewUrl}
                alt="Preview bukti pembayaran"
                className="max-h-64 w-full rounded-lg border object-contain"
              />
            </div>
          )}

          {error && (
            <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={!selectedFile || isSubmitting}
            className="mt-6 w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting
              ? "Mengirim Bukti..."
              : "Kirim Bukti Pembayaran"}
          </button>
        </form>
      </div>
    </main>
  );
}
