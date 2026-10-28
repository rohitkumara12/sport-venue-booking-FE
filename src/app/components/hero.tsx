import { CourtLines } from "./CourtLines"

export function Hero() {
    return (
        <section className="relative overflow-hidden bg-primary text-white">
            <CourtLines className="absolute inset-0 h-full w-full text-white opacity-[0.14]" />

            <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
            <h1 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                Pilih lapangan, pilih jam, langsung main
            </h1>

            <p className=" mt-5 max-w-md text-base leading-relaxed text-white/80 sm:text-lg">
            Lihat jam yang masih kosong, pesan sendiri, lalu unggah bukti bayar. Tanpa telepon dan tanpa antre.
            </p>



            <div className="mt-8 flex flex-wrap gap-3">
            <a
                href="#lapangan"
                className="rounded-xl bg-accent px-6 py-3 text-base font-bold text-primary hover:brightness-95">
                    Cari Lapangan
                </a>
            <a
                href="#cara-memesan"
                className="rounded-xl border border-white/40 px-6 py-3 text-base font-semibold hover:bg-white/10">
                    Cara Memesan
                </a>
            </div>
            </div>


        </section>
    )
}