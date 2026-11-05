
"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  loginSchema,
  type LoginFormValues,
} from "../../validator/auth";
import { useRouter } from "next/navigation";
import AuthLayout from "../../components/authLayout";
import { GetProfile, loginRequest } from "@/lib/api";
import axios from "axios";
import { useAuth } from "@/context/auth.context";

export default function LoginPage() {
  const router = useRouter();
  const {refreshProfile} = useAuth()
  const [showPassword, setShowPassword] = useState(false);
  

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormValues) {
  try {
    const result = await loginRequest(data);
    console.log("Login berhasil:", result);

    // Ambil profile sekaligus update state AuthContext
    const profile = await refreshProfile();

    if (!profile) {
      console.error("Gagal mengambil profile setelah login");
      return;
    }

    console.log("Profile berhasil:", profile);
    console.log("Role:", profile.role);

    if (profile.role === "ADMIN") {
      router.replace("/admin");
    } else if (profile.role === "USER") {
      router.replace("/");
    } else {
      console.error("Role tidak dikenali:", profile.role);
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Request gagal:", error.config?.url);
      console.error("Status:", error.response?.status);
      console.error("Response Backend:", error.response?.data);
    } else {
      console.error("Error:", error);
    }
  }
}
 

  return (
    <AuthLayout
      title="CourtKita"
      description="Masuk ke akun kamu untuk melanjutkan."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-semibold text-slate-900"
          >
            Email
          </label>

          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="nama@email.com"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50"
            {...register("email")}
            aria-invalid={!!errors.email}
          />

          {errors.email && (
            <p className="mt-1 text-sm text-red-600">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-semibold text-slate-900"
          >
            Password
          </label>

          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Masukkan password"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-12 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50"
              {...register("password")}
              aria-invalid={!!errors.password}
            />

            <button
              type="button"
              aria-label={
                showPassword ? "Sembunyikan password" : "Lihat password"
              }
              onClick={() => setShowPassword((previous) => !previous)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
            >
              {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
            </button>
          </div>

          {errors.password && (
            <p className="mt-1 text-sm text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>
        <div className="flex justify-end">
      <Link
          href="/forgot-password"
          className="text-sm font-semibold text-emerald-700 transition hover:text-emerald-800 hover:underline">
          Lupa password?
        </Link>
      </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center rounded-xl bg-emerald-600 px-4 py-3.5 font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Memproses..." : "Masuk"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Belum punya akun?{" "}
        <Link
          href="/register"
          className="font-bold text-emerald-700 hover:underline"
        >
          Daftar
        </Link>
      </p>
    </AuthLayout>
  );
}