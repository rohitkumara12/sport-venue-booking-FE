
"use client";

import { useState } from "react";
import Link from "next/link";
import AuthLayout from "../../components/authLayout";
import { forgotPasswordRequest } from "@/lib/api";
import axios from "axios";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      setError("Email wajib diisi.");
      return;
    }

    try {
      setLoading(true);

      const result = await forgotPasswordRequest(normalizedEmail);

      console.log("Forgot password response:", result);

      setSuccess(
        result.message??
          "Jika email terdaftar, instruksi reset password akan dikirim."
      );
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error("Forgot password error:", {
          url: err.config?.url,
          status: err.response?.status,
          response: err.response?.data,
        });

        setError(
          err.response?.data?.message ??
            "Permintaan gagal. Silakan coba lagi."
        );
      } else {
        console.error(err);
        setError("Terjadi kesalahan. Silakan coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Lupa Password?"
      description="Masukkan email akun CourtKita untuk meminta instruksi reset password."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-semibold"
          >
            Email
          </label>

          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="nama@email.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50"
            required
          />
        </div>

        {error && (
          <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}

        {success && (
          <p role="status" className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">
            {success}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-emerald-600 px-4 py-3.5 font-bold text-white transition hover:bg-emerald-700 disabled:opacity-60"
        >
          {loading ? "Mengirim..." : "Kirim instruksi reset"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Ingat password?{" "}
        <Link href="/login" >
          Kembali ke login
        </Link>
      </p>
    </AuthLayout>
  );
}
