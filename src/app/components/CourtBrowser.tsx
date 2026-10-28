'use client'
import { useState } from "react"
import { format } from "date-fns"
import { CalendarDays, CircleAlert, Search, SearchX } from "lucide-react"
import { useCourts } from "@/hooks/useCourts"
import { useDebounce } from "@/hooks/useDebounce"
import { SPORT_OPTIONS } from "@/lib/constants"
import { CourtCard } from "./CourtCard"
import { CourtCardSkeleton } from "./CourtCardSkeleton"
import { EmptyState } from "./EmptyState"

const todayString = () => format(new Date(), "yyyy-MM-dd")

export function CourtBrowser() {
    const [searchInput, setSearchInput] = useState("")
    const [sportType, setSportType] = useState("")
    const [date, setDate] = useState(todayString)
    const [today] = useState(todayString)
    const debouncedSearch = useDebounce(searchInput, 400)

    const { courts, isLoading, error, reload} = useCourts({
        search: debouncedSearch,
        sportType,
        date,
    });

    const hasActiveFilter = searchInput.trim() !== "" || sportType !== ""

    function resetFilters() {
        setSearchInput("")
        setSportType("")

    }

    let content;
    if (isLoading) {
        content = (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }, (_, i) => <CourtCardSkeleton key={i} />)}
            </div>
        )
    } else if (error) {
        content = (
            <EmptyState
                icon={<CircleAlert size={40} aria-hidden="true" />}
                title="Terjadi kesalahan"
                description={error}
                action={{ label: "Coba lagi", onClick: reload }}
            />
        )
    } else if (courts.length === 0) {
        content = (
            <EmptyState
                icon={<SearchX size={40} aria-hidden="true" />}
                title="Lapangan tidak ditemukan"
                description="Coba kata kunci lain atau ganti jenis olahraga."
                action={hasActiveFilter ? { label: "Hapus filter", onClick: resetFilters } : undefined}
            />
        )
    } else {
        content = (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {courts.map((court) => <CourtCard key={court.id} court={court} date={date} />)}
            </div>
        )
    }

    return (
        <section id="lapangan" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-14 sm:px-6">
            <h2 className="font-display text-3xl font-extrabold text-primary">Cari lapangan</h2>
            <p className="mt-2 text-muted">Pilih tanggal untuk melihat jam yang masih kosong.</p>

            <div className="mt-6 grid gap-3 md:grid-cols-[1fr_auto_auto]">
                <label className="relative block">
                    <span className="sr-only">Cari nama lapangan</span>
                    <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true" />
                    <input
                        type="search"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="Cari nama lapangan..."
                        className="w-full rounded-xl border border-line bg-white py-3 pl-10 pr-4 text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                </label>

                <label className="block">
                    <span className="sr-only">Jenis olahraga</span>
                    <select
                        value={sportType}
                        onChange={(e) => setSportType(e.target.value)}
                        className="w-full rounded-xl border border-line bg-white px-4 py-3 text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    >
                        <option value="">Semua olahraga</option>
                        {SPORT_OPTIONS.map((sport) => <option key={sport} value={sport}>{sport}</option>)}
                    </select>
                </label>

                <label className="relative block">
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
            </div>

            <div className="mt-8" aria-live="polite" aria-busy={isLoading}>
                {content}
            </div>
        </section>
    )
}
