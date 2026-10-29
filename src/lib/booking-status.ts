import { format } from "date-fns"
import { id as localeId } from "date-fns/locale"
import type { Booking, TransactionStatus } from "@/types/booking"

type Tone = "warning" | "info" | "success" | "danger" | "muted"

export const TRANSACTION_STATUS: Record<TransactionStatus, { label: string; tone: Tone }> = {
    PENDING: { label: "Menunggu pembayaran", tone: "warning" },
    PROOF_SUBMITTED: { label: "Menunggu konfirmasi admin", tone: "info" },
    PAID: { label: "Selesai", tone: "success" },
    REJECTED: { label: "Ditolak", tone: "danger" },
    EXPIRED: { label: "Kedaluwarsa", tone: "muted" },
    CANCELLED: { label: "Dibatalkan", tone: "muted" },
    REFUNDED: { label: "Dikembalikan", tone: "muted" },
}

export const TONE_CLASS: Record<Tone, string> = {
    warning: "bg-amber-100 text-amber-800",
    info: "bg-sky-100 text-sky-800",
    success: "bg-emerald-100 text-emerald-800",
    danger: "bg-red-100 text-red-700",
    muted: "bg-gray-100 text-gray-600",
}

// Booking pakai membership tidak punya transaksi; statusnya langsung selesai.
export function bookingStatus(booking: Booking) {
    if (!booking.transaction) {
        return booking.status === "CANCELLED"
            ? TRANSACTION_STATUS.CANCELLED
            : { label: "Selesai (membership)", tone: "success" as Tone }
    }
    return TRANSACTION_STATUS[booking.transaction.status]
}

export function formatSchedule(startTime: string, endTime: string) {
    const start = new Date(startTime)
    return `${format(start, "EEEE, d MMMM yyyy", { locale: localeId })} · ${format(start, "HH:mm")}–${format(new Date(endTime), "HH:mm")}`
}
