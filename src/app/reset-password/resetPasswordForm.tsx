"use client"

import { ResetPasswordRequest } from "@/lib/api";
import { useSearchParams,useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import AuthLayout from "@/components/authLayout";

export default function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams()
    const token = searchParams.get('token') ?? "";

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword,setConfirmPassword] = useState("");
    const [loading,setLoading] = useState(false);
    const[error,setError] = useState("");
    const [success,setSuccess] = useState("");

    async function handleSubmit(
        event : React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();
        setError("")
        setSuccess("");
        
        if (!token) {
            setError("Password harus terdiri dari minimal 8 karakter.");
            return;
        }

        if(newPassword.length < 8) {
            setError("Password harus terdiri dari miminal 8 karakter.");
            return
        }

        if (newPassword !== confirmPassword){
            setError("Konfirmasi password tidak cocok.");
            return
        }
        try {
            setLoading(true);

            const result = await ResetPasswordRequest({
                token,
                newPassword,
                confirmPassword
            });
            console.log("Reset password berhasil",result);

            setSuccess("Password berhasil diubah. Mengalihkan ke login..");

            setTimeout(() => {
                router.replace("/login");
            },1500);
        } catch(err: unknown) {
            if(axios.isAxiosError(err)){
                console.error("Reset password error :",{
                    url : err.config?.url,
                    status : err.response?.status,
                    response : err.response?.data,
                });
                    setError(
                        err.response?.data?.message??
                            "Reset password. Token mungkin tidak valid atau kadaluwarsa."
                    );
            } else {
                console.error(err);
                setError("Terjadi kesalahan. Silahkan coba lagi.")
            }
        } finally{
            setLoading(false)
        }
    }
    return (
        <AuthLayout 
        title="Reset Password"
        description="Buat password baru untuk akun CourtKita.">
            <form onSubmit={handleSubmit} className="space-y-5">
               
<div>
  <label
    htmlFor="newPassword"
    className="mb-2 block text-sm font-semibold"
  >
    Password Baru
  </label>
  <input
    id="newPassword"
    name="newPassword"
    type="password"
    autoComplete="new-password"
    minLength={8}
    value={newPassword}
    onChange={(e) => setNewPassword(e.target.value)}
    placeholder="Masukkan password baru"
    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50"
    required
  />
</div>

<div>
  <label
    htmlFor="confirmPassword"
    className="mb-2 block text-sm font-semibold"
  >
    Konfirmasi Password Baru
  </label>
  <input
    id="confirmPassword"
    name="confirmPassword"
    type="password"
    autoComplete="new-password"
    minLength={8}
    value={confirmPassword}
    onChange={(e) => setConfirmPassword(e.target.value)}
    placeholder="Ulangi password baru"
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
                disabled={loading || !token}
                className="w-full rounded-xl bg-emerald-600 px-4 py-3.5 font-bold text-white transition hover:bg-emerald-700 disabled:opacity-60">
                    {loading ? "Menyimpan..." : "Ubah password"}
                </button>

                {!token && (
                    <p className="text-sm text-slate-500">
                        Link tidak memiliki token. Silahkan{""}
                        <Link href="/forgot-password"
                        className="font-semibold text-emerald-700 hover:underline">
                            Minta link reset baru 
                        </Link>
                    </p>
                )}
                <p className="text-center text-sm text-slate-500">
                    Ingat password?{""}
                    <Link href="/login"
                    className="font-semibold text-emerald-700 hover:underline">
                        Kembali login
                    </Link>
                </p>
            </form>
        </AuthLayout>
    )
}