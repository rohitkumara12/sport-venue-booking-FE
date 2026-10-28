'use client'
import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import axios from "axios"
import { CalendarX, CircleAlert, Lock } from "lucide-react"
import { formatRupiah } from "@/lib/format"
import { TONE_CLASS, bookingStatus, formatSchedule } from "@/lib/booking-status"
import { getMyBookings } from "@/services/booking.service"
import { EmptyState } from "@/app/components/EmptyState"
import { Stars } from "@/app/components/Stars"
import { ReviewForm } from "./ReviewForm"
import type { Booking } from "@/types/booking"

export function MyBookings() {
    const [bookings, setBookings] = useState<Booking[] | null>(null)
    const [error, setError] = useState<"logged-out" | "failed" | null>(null)

    const load = useCallback(() => {
        getMyBookings()
            .then((list) => {
                setBookings(list)
                setError(null)
            })
            .catch((err) => setError(axios.isAxiosError(err) && err.response?.status === 401 ? "logged-out" : "failed"))
    }, [])

    useEffect(load, [load])

    if (error === "logged-out") {
        return (
            <div className="flex flex-col items-center rounded-2xl border border-dashed border-line bg-surface px-6 py-14 text-center">
                <Lock size={40} className="mb-4 text-primary" aria-hidden="true" />
                <h2 className="font-display text-xl font-bold text-primary">Silakan masuk dulu</h2>
                <p className="mt-2 text-sm text-muted">Masuk untuk melihat pesananmu.</p>
                <Link href="/login" className="mt-6 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white">Masuk</Link>
            </div>
        )
    }
    if (error === "failed") {
        return <EmptyState icon={<CircleAlert size={40} aria-hidden="true" />} title="Terjadi kesalahan" description="Pesanan gagal dimuat." action={{ label: "Coba lagi", onClick: load }} />
    }
    if (!bookings) return <div className="h-48 animate-pulse rounded-2xl bg-line" aria-hidden="true" />
    if (bookings.length === 0) {
        return (
            <div className="flex flex-col items-center rounded-2xl border border-dashed border-line bg-surface px-6 py-14 text-center">
                <CalendarX size={40} className="mb-4 text-primary" aria-hidden="true" />
                <h2 className="font-display text-xl font-bold text-primary">Belum ada pesanan</h2>
                <Link href="/#lapangan" className="mt-6 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white">Cari lapangan</Link>
            </div>
        )
    }

    return (
        <ul className="space-y-4">
            {bookings.map((booking) => {
                const status = bookingStatus(booking)
                return (
                    <li key={booking.id} className="rounded-2xl border border-line bg-surface p-4 sm:p-5">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                                <h2 className="font-display text-lg font-bold text-primary">{booking.court.name}</h2>
                                <p className="text-sm text-muted">{formatSchedule(booking.startTime, booking.endTime)}</p>
                                <p className="mt-1 text-sm font-semibold text-foreground">
                                    {booking.membership ? `Membership ${booking.membership.planName}` : formatRupiah(booking.totalPrice)}
                                </p>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <span className={`rounded-full px-3 py-1 text-xs font-bold ${TONE_CLASS[status.tone]}`}>{status.label}</span>
                                <Link href={`/bookings/${booking.id}`} className="text-sm font-semibold text-primary hover:underline">Lihat detail</Link>
                            </div>
                        </div>

                        {booking.review && (
                            <div className="mt-3 rounded-xl bg-primary/5 p-3">
                                <Stars value={booking.review.rating} />
                                {booking.review.comment && <p className="mt-1 text-sm text-muted">{booking.review.comment}</p>}
                            </div>
                        )}
                        {booking.canReview && (
                            <div className="mt-3">
                                <ReviewForm bookingId={booking.id} onDone={load} />
                            </div>
                        )}
                    </li>
                )
            })}
        </ul>
    )
}
