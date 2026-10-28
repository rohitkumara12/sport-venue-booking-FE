'use client'
import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import { Check, Inbox, Loader2, X } from "lucide-react"
import { useCountdown } from "@/hooks/useCountdown"
import { formatRupiah } from "@/lib/format"
import { TONE_CLASS, TRANSACTION_STATUS, formatSchedule } from "@/lib/booking-status"
import { confirmTransaction, getTransactions, rejectTransaction } from "@/services/booking.service"
import { getErrorMessage } from "@/services/court.service"
import type { AdminTransaction, TransactionStatus } from "@/types/booking"

const POLL_INTERVAL_MS = 15000
const TABS: TransactionStatus[] = ["PROOF_SUBMITTED", "PENDING", "PAID", "REJECTED", "EXPIRED", "CANCELLED"]

export function TransactionList() {
    const [status, setStatus] = useState<TransactionStatus>("PROOF_SUBMITTED")
    const [result, setResult] = useState<{ status: TransactionStatus; items: AdminTransaction[] } | null>(null)

    const load = useCallback(() => {
        getTransactions(status)
            .then((items) => setResult({ status, items }))
            .catch((err) => toast.error(getErrorMessage(err, "Transaksi gagal dimuat")))
    }, [status])

    // Muat ulang tiap 15 detik supaya transaksi baru dan yang otomatis dibatalkan langsung terlihat.
    useEffect(() => {
        load()
        const timer = setInterval(load, POLL_INTERVAL_MS)
        return () => clearInterval(timer)
    }, [load])

    const items = result?.status === status ? result.items : null

    return (
        <div>
            <div className="mb-6 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Status transaksi">
                {TABS.map((tab) => (
                    <button
                        key={tab}
                        type="button"
                        role="tab"
                        aria-selected={tab === status}
                        onClick={() => setStatus(tab)}
                        className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${tab === status ? "bg-primary text-white" : "border border-line bg-white text-foreground hover:bg-primary/5"}`}>
                        {TRANSACTION_STATUS[tab].label}
                    </button>
                ))}
            </div>

            {items === null ? (
                <div className="h-40 animate-pulse rounded-2xl bg-line" aria-hidden="true" />
            ) : items.length === 0 ? (
                <div className="flex flex-col items-center rounded-2xl border border-dashed border-line bg-surface px-6 py-14 text-center text-muted">
                    <Inbox size={36} className="mb-3" aria-hidden="true" />
                    Tidak ada transaksi dengan status ini.
                </div>
            ) : (
                <ul className="space-y-4">
                    {items.map((t) => <TransactionRow key={t.id} transaction={t} onDecided={load} />)}
                </ul>
            )}
        </div>
    )
}

function TransactionRow({ transaction: t, onDecided }: { transaction: AdminTransaction; onDecided: () => void }) {
    const [busy, setBusy] = useState<"confirm" | "reject" | null>(null)
    const awaiting = t.status === "PROOF_SUBMITTED"
    const countdown = useCountdown(awaiting ? t.expiresAt : null, onDecided)
    const status = TRANSACTION_STATUS[t.status]

    async function decide(action: "confirm" | "reject") {
        if (action === "reject" && !window.confirm("Tolak pembayaran ini? Slot akan dilepas untuk customer lain.")) return
        setBusy(action)
        try {
            await (action === "confirm" ? confirmTransaction(t.id) : rejectTransaction(t.id))
            toast.success(action === "confirm" ? "Pembayaran diterima" : "Pembayaran ditolak")
            onDecided()
        } catch (err) {
            toast.error(getErrorMessage(err, "Gagal memproses transaksi"))
            onDecided()
        } finally {
            setBusy(null)
        }
    }

    return (
        <li className="grid gap-4 rounded-2xl border border-line bg-surface p-4 sm:grid-cols-[1fr_auto] sm:p-5">
            <div className="space-y-1 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                    <span className="font-display text-lg font-bold text-primary">{t.booking?.court.name ?? "-"}</span>
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${TONE_CLASS[status.tone]}`}>{status.label}</span>
                </div>
                {t.booking && <p className="text-muted">{formatSchedule(t.booking.startTime, t.booking.endTime)}</p>}
                <p>{t.user.name} · <span className="text-muted">{t.user.email}</span></p>
                <p className="text-base font-bold text-foreground">{formatRupiah(t.amount)}</p>
                {awaiting && <p className="font-semibold text-amber-700">Sisa waktu konfirmasi: <span className="tabular-nums">{countdown.label}</span></p>}
                {t.paymentProofUrl && (
                    <a href={t.paymentProofUrl} target="_blank" rel="noreferrer" className="inline-block font-semibold text-primary hover:underline">
                        Lihat bukti bayar
                    </a>
                )}
            </div>

            {awaiting && (
                <div className="flex gap-2 sm:flex-col">
                    <button
                        type="button"
                        onClick={() => decide("confirm")}
                        disabled={busy !== null}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-60">
                        {busy === "confirm" ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <Check size={16} aria-hidden="true" />}
                        Terima
                    </button>
                    <button
                        type="button"
                        onClick={() => decide("reject")}
                        disabled={busy !== null}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-danger px-4 py-2 text-sm font-semibold text-danger hover:bg-red-50 disabled:opacity-60">
                        {busy === "reject" ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <X size={16} aria-hidden="true" />}
                        Tolak
                    </button>
                </div>
            )}
        </li>
    )
}
