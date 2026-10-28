import Image from "next/image"
import Link from "next/link"
import { Star } from "lucide-react"
import { formatRupiah } from "@/lib/format"
import { Court } from '@/types/court'
import { CourtLines } from "./CourtLines"

interface CourtCardProps {
    court: Court;
    date: string
}

export function CourtCard({ court, date}: CourtCardProps) {
    const isFull = court.availableSlots === 0
    const percent = court.totalSlots > 0 ? (court.availableSlots / court.totalSlots) * 100 : 0;
    const photo = court.photos[0]

    return (
        <article className="flex flex-col overflow-hidden rounded-2xl border border-line bg-surface">
            <div className="relative aspect-4/3 bg-primary">
            {photo ? (
                <Image
                src={photo}
                alt={`Foto ${court.name}`}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover" />
            ) : (
                <CourtLines className="absolute inset-0 h-full w-full text-white opacity-30" />
            )}

            {court.sportType && (
                <span className="absolute left-3 top-3 rounded-full bg-accent px-3 py-1 text-xs font-bold text-primary">
                    {court.sportType}
                </span>
            )}
            </div>
            <div className="flex flex-1 flex-col gap-3 p-4">
                <div className="flex items-start justify-between gap-3">
                    <h3 className="font-display text-lg font-bold leading-snug text-primary">{court.name}</h3>
                    {court.averageRating !== null && (
                        <span
                        className="flex shrink-0 items-center gap-1 text-sm font-semibold"
                        aria-label={`Rating ${court.averageRating} dari 5, ${court.reviewCount} ulasan`}>
                            <Star size={14} className="fill-accent stroke-primary" aria-hidden="true" />
                            {court.averageRating.toFixed(1)}
                            <span className="font-normal text-muted">({court.reviewCount})</span>
                        </span>
                    )}
                </div>
                {court.description && <p className="line-clamp-2 text-sm text-muted">{court.description}</p>}
            <div>
                <div className="mb-1.5 flex justify-between text-xs">
                    <span className={isFull ? "font-semibold text-danger" : "text-muted"}>
                        {isFull ? "Semua jam sudah terisi" : `${court.availableSlots} dari ${court.totalSlots} jam kosong`}
                    </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-line">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${percent}%`}} />
                </div>
            </div>

            <div className="mt-auto flex items-end justify-between gap-3 pt-2">
                <p>
                    <span className="text-lg font-bold text-foreground">{formatRupiah(court.pricePerHour)} </span>
                        <span className="text-sm text-muted"> /Jam</span>
                   
                </p>


                <Link
                href={`/courts/${court.id}?date=${date}`}
                className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90">
                    {isFull ? "Lihat tanggal lain" : "Lihat jadwal"}
                </Link>
            </div>
            </div>
        </article>
    )
}