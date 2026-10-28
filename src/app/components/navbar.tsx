"use client"

import Link from "next/link"

import { useState } from "react"
import { Menu, X } from "lucide-react"

const NAV_LINKS = [
    { href: "#lapangan", label:"lapangan"}, 
    { href:"#cara-memesan", label:"Cara memesan"},
    { href:"/bookings", label:"Pesanan saya"}
]

export function Navbar() {
    const [open, setOpen] = useState(false)

    return(
        <header className="sticky top-0 z-30 border-b border-line bg-emerald-600 backdrop-blur">
            <nav
            aria-label="Navigasi utama"
            className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
                
                <Link href="/" className="font-display text-xl font-extrabold tracking-tight text-primary">
                CourtKita
                </Link>

                <ul className="hidden items-center gap-8 md:flex">
                    {NAV_LINKS.map((link) => (
                        <li key={link.href}>
                            <a href={link.href} className="text-md font-medium text-black hover:text-primary">
                                {link.label}
                            </a>
                        </li>
                    ))}
                </ul>


                <div className="hidden items-center gap-3 md:flex">
                    <Link href="/login" className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/5">
                    Masuk
                    </Link>
                    <Link href="/register" className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90">
                    Daftar
                    </Link>
                </div>

                <button
                type="button"
                className="rounded-lg p-2 text-primary md:hidden"
                aria-label={open ? "Tutup menu" : "Buka menu"}
                aria-expanded={open}
                onClick={() => setOpen((prev) => !prev)}>
                {open? <X size={24} /> : <Menu size={24} />}
                </button>

            </nav>


            {open && (
                <div className="border-t border-line bg-white px-4 pb-4 md:hidden">
                    <ul className="flex flex-col py-2">
                        {NAV_LINKS.map((link) => (
                           <li key={link.href}>
                            <a
                            href={link.href}
                            onClick={() => setOpen(false)}
                            className="block py-3 text-base font-medium text-foreground">
                                {link.label}
                            </a>
                           </li> 
                        ))}
                    </ul>
                    <div className="flex gap-3">
                        <Link href="/login" className="flex-1 rounded-xl border border-primary px-4 py-2.5 text-center text-sm font-semibold text-primary">
                        Masuk
                        </Link>

                        <Link href="/register" className="flex-1 rounded-xl bg-primary px-4 py-2.5 text-center text-sm font-semibold text-white">
                        Daftar
                        </Link>
                    </div>
                </div>
            )}
        </header>
    )
}