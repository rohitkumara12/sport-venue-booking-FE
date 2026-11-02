'use client'
import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { toast } from "sonner"
import { CircleAlert, Clock, ImagePlus, Loader2 } from "lucide-react"
import { useCountdown } from "@/hooks/useCountdown"
import { uploadImage } from "@/lib/cloudinary.lib"
import { formatRupiah } from "@/lib/format"
import { TONE_CLASS, bookingStatus, formatSchedule } from "@/lib/booking-status"
import { getBooking, submitPaymentProof } from "@/services/booking.service"
import { getErrorMessage } from "@/services/court.service"
import { EmptyState } from "@/app/components/EmptyState"
import { ReviewForm } from "../ReviewForm"
import type { Booking } from "@/types/booking"

const POLL_INTERVAL_MS = 15000
const MAX_PROOF_MB = 5

export function BookingDetail() {
    const { id } = useParams<{ id: string }>()
    const [booking, setBooking] = useState<Booking | null>(null)
    const [error, setError] = useState<string | null>(null)

    const load = useCallback(() => {
        getBooking(id)
            .then((b) => {
                setBooking(b)
                setError(null)
            })
            .catch((err) => setError(getErrorMessage(err, "Booking gagal dimuat")))
    }, [id])

    // Muat sekali, lalu cek ulang tiap 15 detik supaya keputusan admin / status otomatis langsung terlihat.
    useEffect(() => {
        load()
        const timer = setInterval(load, POLL_INTERVAL_MS)
        return () => clearInterval(timer)
    }, [load])

    const tx = booking?.transaction ?? null
    const waiting = tx?.status === "PENDING" || tx?.status === "PROOF_SUBMITTED"
    // Saat waktu habis, minta status terbaru ke backend (backend yang mengubahnya jadi expired/canceled).
    const countdown = useCountdown(waiting ? tx.expiresAt : null, () => setTimeout(load, 1500))

    if (error && !booking) {
        return <EmptyState icon={<CircleAlert size={40} aria-hidden="true" />} title="Terjadi kesalahan" description={error} action={{ label: "Coba lagi", onClick: load }} />
    }
    if (!booking) return <div className="h-64 animate-pulse rounded-2xl bg-line" aria-hidden="true" />

    const status = bookingStatus(booking)

    return (
        <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
            <section className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <p className="text-sm text-muted">Booking lapangan</p>
                        <h1 className="font-display text-2xl font-extrabold text-primary">{booking.court.name}</h1>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${TONE_CLASS[status.tone]}`}>{status.label}</span>
                </div>

                <dl className="mt-5 space-y-3 text-sm">
                    <div>
                        <dt className="text-muted">Jadwal</dt>
                        <dd className="font-semibold text-foreground">{formatSchedule(booking.startTime, booking.endTime)}</dd>
                    </div>
                    <div>
                        <dt className="text-muted">Total</dt>
                        <dd className="text-lg font-bold text-foreground">
                            {booking.membership ? `${formatRupiah(0)} (pakai ${booking.membership.planName})` : formatRupiah(booking.totalPrice)}
                        </dd>
                    </div>
                </dl>

                {booking.canReview && (
                    <div className="mt-6">
                        <ReviewForm bookingId={booking.id} onDone={load} />
                    </div>
                )}
            </section>

            <section className="h-fit rounded-2xl border border-line bg-surface p-5 sm:p-6">
                {tx?.status === "PENDING" && (
                    <PaymentProofForm booking={booking} countdownLabel={countdown.label} onSubmitted={setBooking} />
                )}

                {tx?.status === "PROOF_SUBMITTED" && (
                    <div className="space-y-3">
                        <h2 className="font-display text-lg font-bold text-primary">Menunggu konfirmasi admin</h2>
                        <CountdownBadge label={countdown.label} />
                        <p className="text-sm text-muted">Admin akan memeriksa bukti bayarmu. Kalau tidak dikonfirmasi sebelum waktu habis, transaksi dibatalkan otomatis dan slot dilepas.</p>
                        {tx.paymentProofUrl && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={tx.paymentProofUrl} alt="Bukti bayar yang kamu kirim" className="max-h-72 w-full rounded-xl border border-line object-contain" />
                        )}
                    </div>
                )}

                {(tx?.status === "PAID" || !tx) && booking.status !== "CANCELLED" && (
                    <div className="space-y-2">
                        <h2 className="font-display text-lg font-bold text-primary">Booking terkonfirmasi</h2>
                        <p className="text-sm text-muted">Sampai jumpa di lapangan! Setelah jadwal main selesai, kamu bisa memberi ulasan.</p>
                    </div>
                )}

                {(tx?.status === "EXPIRED" || tx?.status === "CANCELLED" || tx?.status === "REJECTED") && (
                    <div className="space-y-3">
                        <h2 className="font-display text-lg font-bold text-primary">{status.label}</h2>
                        <p className="text-sm text-muted">
                            {tx.status === "EXPIRED" && "Bukti bayar tidak diupload dalam 30 menit."}
                            {tx.status === "CANCELLED" && "Admin tidak mengonfirmasi dalam 30 menit."}
                            {tx.status === "REJECTED" && "Bukti bayar ditolak admin."}
                            {" "}Slot ini sudah dilepas dan bisa dipesan lagi.
                        </p>
                        <Link href={`/courts/${booking.court.id}`} className="inline-block rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90">
                            Pesan ulang
                        </Link>
                    </div>
                )}
            </section>
        </div>
    )
}

function CountdownBadge({ label }: { label: string }) {
    return (
        <p className="flex items-center gap-2 text-2xl font-bold tabular-nums text-foreground" role="timer" aria-live="off">
            <Clock size={22} className="text-primary" aria-hidden="true" />
            {label}
        </p>
    )
}

function PaymentProofForm({ booking, countdownLabel, onSubmitted }: { booking: Booking; countdownLabel: string; onSubmitted: (b: Booking) => void }) {
    const [file, setFile] = useState<File | null>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => () => {
        if (preview) URL.revokeObjectURL(preview)
    }, [preview])

    function pickFile(picked: File | undefined) {
        if (!picked) return
        if (!picked.type.startsWith("image/")) return toast.error("Bukti bayar harus berupa gambar")
        if (picked.size > MAX_PROOF_MB * 1024 * 1024) return toast.error(`Ukuran maksimal ${MAX_PROOF_MB}MB`)
        setFile(picked)
        setPreview(URL.createObjectURL(picked))
    }

    async function handleSubmit() {
        if (!file) return
        setSubmitting(true)
        try {
            const url = await uploadImage(file)
            onSubmitted(await submitPaymentProof(booking.id, url))
            toast.success("Bukti bayar terkirim. Menunggu konfirmasi admin.")
        } catch (err) {
            toast.error(getErrorMessage(err, "Bukti bayar gagal dikirim"))
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="space-y-4">
            <div>
                <h2 className="font-display text-lg font-bold text-primary">Upload bukti bayar</h2>
                <p className="text-sm text-muted">Transfer {formatRupiah(booking.totalPrice)}, lalu upload bukti sebelum waktu habis.</p>
            </div>
            <CountdownBadge label={countdownLabel} />

            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-line p-4 text-muted hover:border-primary hover:text-primary">
                {preview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={preview} alt="Pratinjau bukti bayar" className="max-h-60 rounded-lg object-contain" />
                ) : (
                    <>
                        <ImagePlus size={28} aria-hidden="true" />
                        <span className="text-sm font-semibold">Pilih foto bukti transfer</span>
                    </>
                )}
                <input type="file" accept="image/*" className="sr-only" disabled={submitting} onChange={(e) => pickFile(e.target.files?.[0])} />
            </label>

            <button
                type="button"
                onClick={handleSubmit}
                disabled={!file || submitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-white hover:bg-primary/90 disabled:opacity-60">
                {submitting && <Loader2 size={18} className="animate-spin" aria-hidden="true" />}
                {submitting ? "Mengirim..." : "Kirim bukti bayar"}
            </button>
        </div>
    )
}
