'use client'
import { useState } from "react"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { Stars } from "@/app/components/Stars"
import { createReview } from "@/services/booking.service"
import { getErrorMessage } from "@/services/court.service"

// Form ulasan; hanya ditampilkan untuk booking yang jadwal mainnya sudah selesai (canReview).
export function ReviewForm({ bookingId, onDone }: { bookingId: string; onDone: () => void }) {
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState("")
    const [submitting, setSubmitting] = useState(false)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (rating === 0) {
            toast.error("Pilih rating 1 sampai 5 bintang")
            return
        }
        setSubmitting(true)
        try {
            await createReview(bookingId, rating, comment.trim())
            toast.success("Terima kasih atas ulasanmu")
            onDone()
        } catch (err) {
            toast.error(getErrorMessage(err, "Ulasan gagal dikirim"))
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-3 rounded-xl border border-line bg-white p-4">
            <p className="text-sm font-semibold text-foreground">Bagaimana pengalaman bermainmu?</p>
            <Stars value={rating} onChange={setRating} />
            <label className="block">
                <span className="sr-only">Komentar</span>
                <textarea
                    rows={3}
                    maxLength={500}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Ceritakan kondisi lapangan, fasilitas, dll. (opsional)"
                    className="w-full rounded-xl border border-line px-4 py-3 text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
            </label>
            <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-60">
                {submitting && <Loader2 size={16} className="animate-spin" aria-hidden="true" />}
                Kirim ulasan
            </button>
        </form>
    )
}
