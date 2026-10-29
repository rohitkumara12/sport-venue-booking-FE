'use client'
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { formatRupiah } from "@/lib/format"
import { formatSchedule } from "@/lib/booking-status"
import { createBooking, getAvailableMemberships } from "@/services/booking.service"
import { getErrorMessage } from "@/services/court.service"
import type { AvailableMembership } from "@/types/booking"
import type { CourtDetail } from "@/types/court"

export const MAX_BOOKING_HOURS = 4

export interface SlotSelection {
    // Index slot pertama di court.slots dan jumlah jam berurutan.
    start: number
    hours: number
}

interface BookingPanelProps {
    court: CourtDetail
    date: string
    selection: SlotSelection | null
    onClear: () => void
}

export function BookingPanel({ court, date, selection, onClear }: BookingPanelProps) {
    const router = useRouter()
    const [memberships, setMemberships] = useState<AvailableMembership[]>([])
    // "" = bayar dengan transfer, selain itu = id membership yang dipakai.
    const [membershipId, setMembershipId] = useState("")
    const [submitting, setSubmitting] = useState(false)

    // Membership hanya bisa diambil kalau sudah login; kalau belum, daftar dibiarkan kosong.
    useEffect(() => {
        getAvailableMemberships().then(setMemberships).catch(() => setMemberships([]))
    }, [])

    if (!selection) {
        return <p className="mt-5 rounded-xl bg-primary/5 px-4 py-3 text-sm text-primary">Pilih jam main di atas untuk memesan.</p>
    }

    const first = court.slots[selection.start]
    const last = court.slots[selection.start + selection.hours - 1]
    const total = court.pricePerHour * selection.hours

    // Membership bisa dipakai kalau sisa sesinya cukup (1 sesi = 1 jam) dan jadwalnya dalam masa berlaku.
    const usable = memberships.filter((m) =>
        m.remainingSessions >= selection.hours &&
        (!m.startsAt || new Date(first.start) >= new Date(m.startsAt)) &&
        (!m.expiresAt || new Date(last.end) <= new Date(m.expiresAt)))
    const chosenMembership = usable.find((m) => m.id === membershipId)

    async function handleBook() {
        if (!selection) return
        setSubmitting(true)
        try {
            const booking = await createBooking({
                courtId: court.id,
                date,
                startHour: Number(first.label.slice(0, 2)),
                hours: selection.hours,
                customerMembershipId: chosenMembership?.id,
            })
            toast.success(chosenMembership ? "Booking berhasil memakai membership" : "Booking dibuat. Selesaikan pembayaran dalam 30 menit.")
            router.push(`/bookings/${booking.id}`)
        } catch (err) {
            const status = axios.isAxiosError(err) ? err.response?.status : undefined
            if (status === 401) {
                toast.error("Masuk dulu untuk memesan lapangan")
                router.push("/login")
                return
            }
            toast.error(getErrorMessage(err, "Booking gagal. Coba lagi."))
            if (status === 409) onClear()
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="mt-5 space-y-4 border-t border-line pt-5">
            <div>
                <p className="text-sm text-muted">Jadwal dipilih</p>
                <p className="font-semibold text-foreground">{formatSchedule(first.start, last.end)}</p>
                <p className="text-sm text-muted">{selection.hours} jam × {formatRupiah(court.pricePerHour)}</p>
            </div>

            {usable.length > 0 && (
                <fieldset className="space-y-2">
                    <legend className="mb-1 text-sm font-semibold text-foreground">Cara bayar</legend>
                    <label className="flex items-center gap-2 text-sm">
                        <input type="radio" name="payment" checked={membershipId === ""} onChange={() => setMembershipId("")} />
                        Transfer ({formatRupiah(total)})
                    </label>
                    {usable.map((m) => (
                        <label key={m.id} className="flex items-center gap-2 text-sm">
                            <input type="radio" name="payment" checked={membershipId === m.id} onChange={() => setMembershipId(m.id)} />
                            Pakai {m.planName} (sisa {m.remainingSessions} sesi, terpakai {selection.hours})
                        </label>
                    ))}
                </fieldset>
            )}

            <div className="flex items-center justify-between">
                <span className="text-sm text-muted">Total</span>
                <span className="text-xl font-bold text-foreground">{chosenMembership ? formatRupiah(0) : formatRupiah(total)}</span>
            </div>

            <button
                type="button"
                onClick={handleBook}
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-white hover:bg-primary/90 disabled:opacity-60">
                {submitting && <Loader2 size={18} className="animate-spin" aria-hidden="true" />}
                {submitting ? "Memesan..." : "Pesan sekarang"}
            </button>
        </div>
    )
}
