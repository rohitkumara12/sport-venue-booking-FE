
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {GetProfile} from "@/lib/api";
import { Router } from "lucide-react";

type UserProfile = {
  id: string;
  email: string;
  role: "USER" | "ADMIN";
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function checkAuth() {
      try {
        const result = await GetProfile();

        if (active) {
          return;
        }
        if ( result.payload.role === 'ADMIN'){
          router.replace("/admin");
          return
        }
        setUser(result.payload)
      } catch (error) {
        console.error("User belum login atau sesi berakhir:", error);
        router.replace("/login");
      } finally {
        if (active) setLoading(false);
      }
    }

    checkAuth();

    return () => {
      active = false;
    };
  }, [router]);

  if (loading) {
    return <main className="p-8">Memeriksa sesi login...</main>;
  }

  if (!user) {
    return <main className="p-8">Mengalihkan ke halaman login...</main>;
  }

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <h1 className="text-3xl font-bold text-slate-900">
        Dashboard CourtKita
      </h1>

      <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Selamat datang!</h2>
        <p className="mt-2 text-slate-600">
          Name : {user.email}
        </p>
        <p className="text-slate-600">
          Role: {user.role}
        </p>
      </div>
    </main>
  );
}
