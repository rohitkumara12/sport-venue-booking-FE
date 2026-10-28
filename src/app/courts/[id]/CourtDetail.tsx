'use client'
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams, useSearchParams } from "next/navigation"
import { format } from "date-fns"
import { ArrowLeft, CalendarDays, CircleAlert, SearchX, Star } from "lucide-react"
import { useCourtDetail } from "@/hooks/useCourtDetail"
import { formatRupiah } from "@/lib/format"
import { CourtLines } from "@/app/components/CourtLines"
import { EmptyState } from "@/app/components/EmptyState"

const todayString = () => format(new Date(), "yyyy-MM-dd")

export function CourtDetail() {
    const { id } = useParams<{ id: string }>()
    const searchParams = useSearchParams()
    const [today] = useState(todayString)
    // Tanggal dari kartu di landing page (?date=...) dipakai sebagai awal, tapi tidak boleh sebelum hari ini.
    const [date, setDate] = useState(() => {
        const fromUrl = searchParams.get("date") ?? ""
        return /^\d{4}-\d{2}-\d{2}$/.test(fromUrl) && fromUrl >= today ? fromUrl : today
    })
    const [activePhoto, setActivePhoto] = useState(0)

    const { court, isLoading, error, notFound, reload } = useCourtDetail(id, date)

    if (notFound) {
        return (
            <EmptyState
                icon={<SearchX size={40} aria-hidden="true" />}
                title="Lapangan tidak ditemukan"
                description="Lapangan ini mungkin sudah tidak aktif. Coba pilih lapangan lain."
            />
        )
    }

    if (error) {
        return (
            <EmptyState
                icon={<CircleAlert size={40} aria-hidden="true" />}
                title="Terjadi kesalahan"
                description={error}
                action={{ label: "Coba lagi", onClick: reload }}
            />
        )
    }

    if (isLoading || !court) return <CourtDetailSkeleton />

    const photo = court.photos[activePhoto] ?? court.photos[0]

    return (
        <div className="grid gap-8 lg:grid-cols-[3fr_2fr]">
            <div>
                <div className="relative aspect-video overflow-hidden rounded-2xl bg-primary">
                    {photo ? (
                        <Image
                            src={photo}
                            alt={`Foto ${court.name}`}
                            fill
                            priority
                            sizes="(min-width: 1024px) 60vw, 100vw"
                            className="object-cover" />
                    ) : (
                        <CourtLines className="absolute inset-0 h-full w-full text-white opacity-30" />
                    )}
                </div>

                {court.photos.length > 1 && (
                    <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
                        {court.photos.map((src, i) => (
                            <button
                                key={src}
                                type="button"
                                onClick={() => setActivePhoto(i)}
                                aria-label={`Lihat foto ${i + 1}`}
                                aria-pressed={i === activePhoto}
                                className={`relative aspect-4/3 w-24 shrink-0 overflow-hidden rounded-lg border-2 ${i === activePhoto ? "border-primary" : "border-transparent"}`}>
                                <Image src={src} alt="" fill sizes="96px" className="object-cover" />
                            </button>
                        ))}
                    </div>
                )}

                <div className="mt-6">
                    {court.sportType && (
                        <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold text-primary">
                            {court.sportType}
                        </span>
                    )}
                    <h1 className="mt-3 font-display text-3xl font-extrabold text-primary sm:text-4xl">{court.name}</h1>

                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                        <span>
                            <span className="text-lg font-bold text-foreground">{formatRupiah(court.pricePerHour)}</span>
                            <span className="text-muted"> /Jam</span>
                        </span>
                        {court.averageRating !== null ? (
                            <span className="flex items-center gap-1 font-semibold">
                                <Star size={14} className="fill-accent stroke-primary" aria-hidden="true" />
                                {court.averageRating.toFixed(1)}
                                <span className="font-normal text-muted">({court.reviewCount} ulasan)</span>
                            </span>
                        ) : (
                            <span className="text-muted">Belum ada ulasan</span>
                        )}
                    </div>

                    <p className="mt-4 leading-relaxed text-muted">
                        {court.description || "Belum ada deskripsi untuk lapangan ini."}
                    </p>
                </div>
            </div>

            <section aria-labelledby="jadwal-heading" className="h-fit rounded-2xl border border-line bg-surface p-5 lg:sticky lg:top-20">
                <h2 id="jadwal-heading" className="font-display text-xl font-bold text-primary">Jadwal tersedia</h2>

                <label className="relative mt-4 block">
                    <span className="sr-only">Tanggal main</span>
                    <CalendarDays size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true" />
                    <input
                        type="date"
                        value={date}
                        min={today}
                        onChange={(e) => setDate(e.target.value || today)}
                        className="w-full rounded-xl border border-line bg-white py-3 pl-10 pr-4 text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                </label>

                <p className="mt-3 text-sm text-muted">
                    {court.availableSlots === 0
                        ? "Semua jam sudah terisi. Coba tanggal lain."
                        : `${court.availableSlots} dari ${court.totalSlots} jam masih kosong.`}
                </p>

                <ul className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-3">
                    {court.slots.map((slot) => (
                        <li
                            key={slot.start}
                            className={`rounded-lg border px-2 py-2.5 text-center text-sm font-semibold ${slot.isAvailable
                                ? "border-primary/30 bg-white text-primary"
                                : "border-line bg-line/60 text-muted line-through"}`}>
                            {slot.label}
                            <span className="sr-only">{slot.isAvailable ? " kosong" : " terisi"}</span>
                        </li>
                    ))}
                </ul>

                <div className="mt-4 flex gap-4 text-xs text-muted">
                    <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded border border-primary/30 bg-white" />Kosong</span>
                    <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-line" />Terisi</span>
                </div>
            </section>
        </div>
    )
}

export function CourtDetailSkeleton() {
    return (
        <div className="grid animate-pulse gap-8 lg:grid-cols-[3fr_2fr]" aria-hidden="true">
            <div>
                <div className="aspect-video rounded-2xl bg-line" />
                <div className="mt-6 h-5 w-24 rounded-full bg-line" />
                <div className="mt-3 h-9 w-2/3 rounded bg-line" />
                <div className="mt-4 h-4 w-full rounded bg-line" />
                <div className="mt-2 h-4 w-5/6 rounded bg-line" />
            </div>
            <div className="h-80 rounded-2xl bg-line" />
        </div>
    )
}

export function BackLink() {
    return (
        <Link href="/#lapangan" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
            <ArrowLeft size={16} aria-hidden="true" />
            Kembali ke daftar lapangan
        </Link>
    )
}
