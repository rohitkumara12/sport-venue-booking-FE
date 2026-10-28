
"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import AuthLayout from "../../components/authLayout";
import { useRouter } from "next/navigation";
import { registerRequest } from "@/lib/api";
import axios from "axios";
import { boolean} from "zod";
import { registerSchema } from "@/validator/auth";


export default function RegisterPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  
async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();
  setError("");
  setSuccess("");

  const form = new FormData(event.currentTarget);
  const name = String(form.get("name") ?? "").trim();
  const email = String(form.get("email") ?? "").trim();
  const password = String(form.get("password") ?? "");
  const confirmPassword = String(form.get("confirmPassword") ?? "");

  if (!name || !email || !password || !confirmPassword) {
    setError("Semua field wajib diisi.");
    return;
  }

  if (password.length < 8) {
    setError("Password harus terdiri dari minimal 8 karakter.");
    return;
  }

  if (password !== confirmPassword) {
    setError("Konfirmasi password tidak cocok.");
    return;
  }

  try {
    setIsSubmitting(true);

    console.log("Data register:",{
      name,
      email,
      passwordReceived : boolean(password)
    })

    const validation = await registerSchema.safeParse({
      body : {
        name,
        email,
        password,
        confirmPassword
      },
    });
    if (!validation.success) {
      setError(validation.error.issues[0].message)
    } 
    const result = await registerRequest({
      name,
      email,
      password,
      confirmPassword
    });

    console.log("Register berhasil:", result);
    setSuccess("Registrasi berhasil! Mengalihkan ke halaman login...");

    setTimeout(() => {
      router.push("/login");
    }, 1000);
  } catch (err: unknown) {
    if (axios.isAxiosError(err)){
      console.error("Status :",err.response?.status);
      console.error("Response backend:",JSON.stringify(err.response?.data,null,2));
    } else {
      console.error("Error :",err)
    }
    setError("Registrasi gagal. Akun sudah terdaftar.")
  } finally {
    setIsSubmitting(false);
  }
}

  return (
    <AuthLayout
      title="Buat akun CourtKita"
      description="Daftar sekarang dan persiapkan pertandingan berikutnya."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="name" className="mb-2 block text-sm font-semibold">
            Nama lengkap
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Masukkan nama lengkap"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-semibold">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="nama@email.com"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-2 block text-sm font-semibold">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              minLength={8}
              placeholder="Minimal 8 karakter"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-12 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50"
              required
            />
            <button
              type="button"
              aria-label={showPassword ? "Sembunyikan password" : "Lihat password"}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
            >
              {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
            </button>
          </div>
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-2 block text-sm font-semibold"
          >
            Konfirmasi password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Ulangi password"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-12 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50"
              required
            />
            <button
              type="button"
              aria-label={showConfirmPassword ? "Sembunyikan password" : "Lihat password"}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
            >
              {showConfirmPassword ? <EyeOff size={19} /> : <Eye size={19} />}
            </button>
          </div>
        </div>

        {error && (
          <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}
        {success && (
          <p 
          role="status"
          className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800"> {success}

          </p>
        )}

        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3.5 font-bold text-white transition hover:bg-emerald-700 disabled:*:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            <><LoaderCircle size={18} className="animate-spin" />
            Membuat akun
            </>
            
            
          ):(
            "Buat akun"
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Sudah punya akun?{" "}
        <Link href="/login" className="font-bold text-emerald-700 hover:underline">
          Masuk
        </Link>
      </p>
    </AuthLayout>
  );
}
