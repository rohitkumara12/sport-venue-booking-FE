import { Star } from "lucide-react"

// Bintang 1-5. Kalau onChange diisi, bintang bisa diklik untuk memberi rating.
export function Stars({ value, onChange, className = "" }: { value: number; onChange?: (rating: number) => void; className?: string }) {
    if (!onChange) {
        return (
            <span className={`flex gap-0.5 ${className}`} aria-label={`Rating ${value} dari 5`}>
                {[1, 2, 3, 4, 5].map((n) => (
                    <Star key={n} size={16} aria-hidden="true" className={n <= value ? "fill-amber-400 stroke-amber-500" : "stroke-gray-300"} />
                ))}
            </span>
        )
    }

    return (
        <span className={`flex gap-1 ${className}`} role="radiogroup" aria-label="Pilih rating">
            {[1, 2, 3, 4, 5].map((n) => (
                <button
                    key={n}
                    type="button"
                    role="radio"
                    aria-checked={value === n}
                    aria-label={`${n} bintang`}
                    onClick={() => onChange(n)}
                    className="rounded p-0.5">
                    <Star size={24} aria-hidden="true" className={n <= value ? "fill-amber-400 stroke-amber-500" : "stroke-gray-300"} />
                </button>
            ))}
        </span>
    )
}
