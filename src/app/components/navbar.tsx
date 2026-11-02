
"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { logoutRequest } from "@/lib/api";
import { useAuth } from "@/context/auth.context";

const NAV_LINKS = [
  { href: "#lapangan", label: "Lapangan" },
  { href: "#cara-memesan", label: "Cara memesan" },
  { href: "/bookings", label: "Pesanan saya" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  const { user, isLoading, setUser } = useAuth();

  async function handleLogout() {
    setLogoutError("");
    setIsLoggingOut(true);

    try {
      await logoutRequest();

      setUser(null);
      setOpen(false);
    } catch (error) {
      console.error("Logout gagal:", error);
      setLogoutError("Logout gagal. Silakan coba lagi.");
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-emerald-600 backdrop-blur">
      <nav
        aria-label="Navigasi utama"
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6"
      >
        <Link
          href="/"
          className="font-display text-xl font-extrabold tracking-tight text-primary"
        >
          CourtKita
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-md font-medium text-black hover:text-primary"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {!isLoading && (
          <div className="hidden items-center gap-3 md:flex">
            {user ? (
              <>
                <Link
                  href="/profile"
                  className="text-sm font-semibold text-black hover:text-white"
                >
                  {user.name}
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-primary hover:bg-emerald-400 disabled:opacity-60"
                >
                  {isLoggingOut ? "Keluar..." : "Logout"}
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-primary hover:bg-emerald-400"
                >
                  Masuk
                </Link>

                <Link
                  href="/register"
                  className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/5"
                >
                  Daftar
                </Link>
              </>
            )}
          </div>
        )}

        <button
          type="button"
          className="rounded-lg p-2 text-primary md:hidden"
          aria-label={open ? "Tutup menu" : "Buka menu"}
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {logoutError && (
        <p className="px-4 py-2 text-sm text-red-700">
          {logoutError}
        </p>
      )}

      {open && (
        <div className="border-t border-line bg-white px-4 pb-4 md:hidden">
          <ul className="flex flex-col py-2">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-base font-medium text-foreground"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {!isLoading && (
            <div className="flex flex-col gap-3">
              {user ? (
                <>
                  <Link
                    href="/profile"
                   className="flex items-center gap-2 text-sm font-semibold text-black hover:text-white"
                   >
                    {user.profile_Image ?(
                      <img 
                      src={user.profile_Image}
                      alt="Foto-Profil"
                      className="h-9 w-9 rounded-full object-cover"
                      />
                    ) : (
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white font-bold text-emerald-700">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <span> {user.name}</span>
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
                  >
                    {isLoggingOut ? "Keluar..." : "Logout"}
                  </button>
                </>
              ) : (
                <div className="flex gap-3">
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="flex-1 rounded-xl border border-primary px-4 py-2.5 text-center text-sm font-semibold text-primary"
                  >
                    Masuk
                  </Link>

                  <Link
                    href="/register"
                    onClick={() => setOpen(false)}
                    className="flex-1 rounded-xl bg-primary px-4 py-2.5 text-center text-sm font-semibold text-white"
                  >
                    Daftar
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </header>
  );
}
