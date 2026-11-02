    "use client";

    import type { ReactNode } from "react";
    import Link from "next/link";
    import { Loader2, Lock } from "lucide-react";
    import { useAuth } from "@/context/auth.context";

    export function AdminGuard({ children }: { children: ReactNode }) {
    const { user, isLoading } = useAuth();
    console.log("ADMIN GUARD USER:", user);
    console.log("ADMIN GUARD LOADING:", isLoading);
    console.log("ADMIN GUARD ROLE:", user?.role);

    if (isLoading) {
        return (
        <div className="flex items-center gap-2 py-20 text-muted" role="status">
            <Loader2 size={18} className="animate-spin" aria-hidden="true" />
            Memeriksa akses...
        </div>
        );
    }

    if (!user) {
        return (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-line bg-surface px-6 py-14 text-center">
            <Lock size={40} className="mb-4 text-primary" aria-hidden="true" />
            <h2 className="font-display text-xl font-bold text-primary">
            Silakan login terlebih dadulu
            </h2>
            
            <p className="mt-2 max-w-sm text-sm text-muted">
            Halaman ini hanya untuk admin. Masuk dengan akun admin untuk melanjutkan.
            </p>
            <Link
            href="/login"
            className="mt-6 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary/90"
            >
            Masuk
            </Link>
        </div>
        );
    }

    if (user.role !== "ADMIN") {
        return (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-line bg-surface px-6 py-14 text-center">
            <Lock size={40} className="mb-4 text-primary" aria-hidden="true" />
            <h2 className="font-display text-xl font-bold text-primary">
            Khusus admin
            </h2>
            <p className="mt-2 max-w-sm text-sm text-muted">
            Akunmu bukan admin, jadi tidak bisa mengakses halaman ini.
            </p>
            <Link
            href="/"
            className="mt-6 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary/90"
            >
            Kembali ke beranda
            </Link>
        </div>
        );
    }

    return <>{children}</>;
    }