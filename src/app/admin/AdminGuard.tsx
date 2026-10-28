'use client'
import { useEffect, useState, type ReactNode } from "react"
import Link from "next/link"
import axios from "axios"
import { Loader2, Lock } from "lucide-react"
import { getProfile } from "@/services/auth.service"

type Status = "checking" | "admin" | "not-admin" | "logged-out"

// Halaman admin hanya ditampilkan kalau user yang login ber-role ADMIN.
// Backend tetap mengecek ulang di POST /courts, jadi ini untuk kenyamanan tampilan, bukan satu-satunya pengaman.
export function AdminGuard({ children }: { children: ReactNode }) {
    const [status, setStatus] = useState<Status>("checking")

    useEffect(() => {
        getProfile()
            .then((user) => setStatus(user.role === "ADMIN" ? "admin" : "not-admin"))
            .catch((err: unknown) => {
                const code = axios.isAxiosError(err) ? err.response?.status : undefined
                setStatus(code === 403 ? "not-admin" : "logged-out")
            })
    }, [])

    if (status === "admin") return <>{children}</>

    if (status === "checking") {
        return (
            <div className="flex items-center gap-2 py-20 text-muted" role="status">
                <Loader2 size={18} className="animate-spin" aria-hidden="true" />
                Memeriksa akses...
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-line bg-surface px-6 py-14 text-center">
            <Lock size={40} className="mb-4 text-primary" aria-hidden="true" />
            <h2 className="font-display text-xl font-bold text-primary">
                {status === "logged-out" ? "Silakan masuk dulu" : "Khusus admin"}
            </h2>
            <p className="mt-2 max-w-sm text-sm text-muted">
                {status === "logged-out"
                    ? "Halaman ini hanya untuk admin. Masuk dengan akun admin untuk menambah lapangan."
                    : "Akunmu bukan admin, jadi tidak bisa menambah lapangan."}
            </p>
            <Link
                href={status === "logged-out" ? "/login" : "/"}
                className="mt-6 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary/90">
                {status === "logged-out" ? "Masuk" : "Kembali ke beranda"}
            </Link>
        </div>
    )
}
