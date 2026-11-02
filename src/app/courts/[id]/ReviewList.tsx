'use client'
import { useEffect, useState } from "react"
import { format } from "date-fns"
import { id as localeId } from "date-fns/locale"
import { getCourtReviews } from "@/services/booking.service"
import { Stars } from "@/app/components/Stars"
import type { CourtReview } from "@/types/booking"

// Daftar ulasan di halaman profil lapangan.
export function ReviewList({ courtId }: { courtId: string }) {
    const [reviews, setReviews] = useState<CourtReview[] | null>(null)

    useEffect(() => {
        getCourtReviews(courtId).then(setReviews).catch(() => setReviews([]))
    }, [courtId])

    return (
        <section aria-labelledby="ulasan-heading" className="mt-8">
            <h2 id="ulasan-heading" className="font-display text-xl font-bold text-primary">Ulasan</h2>

            {reviews === null ? (
                <p className="mt-3 text-sm text-muted">Memuat ulasan...</p>
            ) : reviews.length === 0 ? (
                <p className="mt-3 text-sm text-muted">Belum ada ulasan. Ulasan muncul setelah customer selesai bermain.</p>
            ) : (
                <ul className="mt-4 space-y-4">
                    {reviews.map((review) => (
                        <li key={review.id} className="rounded-xl border border-line bg-surface p-4">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <span className="font-semibold text-foreground">{review.user.name}</span>
                                <span className="text-xs text-muted">{format(new Date(review.createdAt), "d MMM yyyy", { locale: localeId })}</span>
                            </div>
                            <Stars value={review.rating} className="mt-1" />
                            {review.comment && <p className="mt-2 text-sm text-muted">{review.comment}</p>}
                        </li>
                    ))}
                </ul>
            )}
        </section>
    )
}
