'use client'
import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { ImagePlus, Loader2, X } from "lucide-react"
import { SPORT_OPTIONS } from "@/lib/constants"
import { uploadImage } from "@/lib/cloudinary.lib"
import { createCourt, getErrorMessage } from "@/services/court.service"

const MAX_PHOTOS = 5
const MAX_PHOTO_MB = 5

const courtSchema = z.object({
    name: z.string().trim().min(3, "Nama minimal 3 karakter").max(125, "Nama maksimal 125 karakter"),
    sportType: z.string().min(1, "Pilih jenis olahraga"),
    // Disimpan sebagai teks di form, diubah ke angka saat dikirim.
    pricePerHour: z.string().regex(/^\d+$/, "Harga harus angka tanpa titik/koma")
        .refine((v) => Number(v) >= 1000, "Harga minimal Rp1.000"),
    description: z.string().trim().max(1000, "Deskripsi maksimal 1000 karakter"),
})

type CourtFormValues = z.infer<typeof courtSchema>

const EMPTY_FORM: CourtFormValues = { name: "", sportType: "", pricePerHour: "", description: "" }

interface PhotoItem {
    file: File
    preview: string
}

export function CreateCourtForm() {
    const [photos, setPhotos] = useState<PhotoItem[]>([])
    const [photoError, setPhotoError] = useState<string | null>(null)
    const [created, setCreated] = useState<{ id: string; name: string }[]>([])

    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<CourtFormValues>({
        resolver: zodResolver(courtSchema),
        defaultValues: EMPTY_FORM,
    })

    // Lepas URL preview dari memori saat halaman ditutup.
    const photosRef = useRef(photos)
    useEffect(() => {
        photosRef.current = photos
    }, [photos])
    useEffect(() => () => photosRef.current.forEach((p) => URL.revokeObjectURL(p.preview)), [])

    function clearPhotos() {
        photos.forEach((p) => URL.revokeObjectURL(p.preview))
        setPhotos([])
    }

    function addPhotos(files: FileList | null) {
        if (!files) return
        setPhotoError(null)

        const valid: PhotoItem[] = []
        for (const file of Array.from(files)) {
            if (!file.type.startsWith("image/")) {
                setPhotoError(`"${file.name}" bukan file gambar`)
                continue
            }
            if (file.size > MAX_PHOTO_MB * 1024 * 1024) {
                setPhotoError(`"${file.name}" lebih dari ${MAX_PHOTO_MB}MB`)
                continue
            }
            valid.push({ file, preview: URL.createObjectURL(file) })
        }

        setPhotos((prev) => {
            const next = [...prev, ...valid]
            if (next.length > MAX_PHOTOS) {
                setPhotoError(`Maksimal ${MAX_PHOTOS} foto`)
                next.slice(MAX_PHOTOS).forEach((p) => URL.revokeObjectURL(p.preview))
            }
            return next.slice(0, MAX_PHOTOS)
        })
    }

    function removePhoto(index: number) {
        URL.revokeObjectURL(photos[index].preview)
        setPhotos((prev) => prev.filter((_, i) => i !== index))
    }

    async function onSubmit(values: CourtFormValues) {
        if (photos.length === 0) {
            setPhotoError("Tambahkan minimal 1 foto")
            return
        }

        try {
            const photoUrls = await Promise.all(photos.map((p) => uploadImage(p.file)))
            const court = await createCourt({
                name: values.name,
                sportType: values.sportType,
                pricePerHour: Number(values.pricePerHour),
                description: values.description || undefined,
                photos: photoUrls,
            })

            toast.success(`"${court.name}" berhasil dibuat`)
            setCreated((prev) => [{ id: court.id, name: court.name }, ...prev])
            // Form dikosongkan supaya admin bisa langsung membuat court berikutnya.
            reset(EMPTY_FORM)
            clearPhotos()
        } catch (err) {
            toast.error(getErrorMessage(err, "Lapangan gagal dibuat. Coba lagi."))
        }
    }

    const inputClass = "w-full rounded-xl border border-line bg-white px-4 py-3 text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 aria-invalid:border-danger"

    return (
        <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5 rounded-2xl border border-line bg-surface p-5 sm:p-6">
                <Field label="Nama lapangan" error={errors.name?.message} htmlFor="name">
                    <input id="name" {...register("name")} aria-invalid={!!errors.name} placeholder="Contoh: Arena Futsal Senayan" className={inputClass} />
                </Field>

                <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Jenis olahraga" error={errors.sportType?.message} htmlFor="sportType">
                        <select id="sportType" {...register("sportType")} aria-invalid={!!errors.sportType} className={inputClass}>
                            <option value="">Pilih olahraga</option>
                            {SPORT_OPTIONS.map((sport) => <option key={sport} value={sport}>{sport}</option>)}
                        </select>
                    </Field>

                    <Field label="Harga per jam (Rp)" error={errors.pricePerHour?.message} htmlFor="pricePerHour">
                        <input id="pricePerHour" inputMode="numeric" {...register("pricePerHour")} aria-invalid={!!errors.pricePerHour} placeholder="150000" className={inputClass} />
                    </Field>
                </div>

                <Field label="Deskripsi (opsional)" error={errors.description?.message} htmlFor="description">
                    <textarea id="description" rows={4} {...register("description")} aria-invalid={!!errors.description} placeholder="Fasilitas, jenis lantai, lokasi..." className={inputClass} />
                </Field>

                <fieldset>
                    <legend className="mb-1.5 text-sm font-semibold text-foreground">Foto lapangan</legend>
                    <p className="mb-3 text-xs text-muted">Maksimal {MAX_PHOTOS} foto, masing-masing {MAX_PHOTO_MB}MB. Foto pertama jadi foto utama.</p>

                    <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
                        {photos.map((photo, i) => (
                            <div key={photo.preview} className="relative aspect-square overflow-hidden rounded-lg border border-line">
                                {/* Preview lokal (blob:), jadi pakai <img> biasa, bukan next/image. */}
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={photo.preview} alt={`Foto ${i + 1}`} className="h-full w-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => removePhoto(i)}
                                    disabled={isSubmitting}
                                    aria-label={`Hapus foto ${i + 1}`}
                                    className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white hover:bg-black/80">
                                    <X size={14} aria-hidden="true" />
                                </button>
                            </div>
                        ))}

                        {photos.length < MAX_PHOTOS && (
                            <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-line text-muted hover:border-primary hover:text-primary">
                                <ImagePlus size={22} aria-hidden="true" />
                                <span className="text-xs font-semibold">Tambah</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    disabled={isSubmitting}
                                    className="sr-only"
                                    onChange={(e) => {
                                        addPhotos(e.target.files)
                                        e.target.value = ""
                                    }}
                                />
                            </label>
                        )}
                    </div>
                    {photoError && <p className="mt-2 text-sm text-danger" role="alert">{photoError}</p>}
                </fieldset>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-white hover:bg-primary/90 disabled:opacity-60 sm:w-auto">
                    {isSubmitting && <Loader2 size={18} className="animate-spin" aria-hidden="true" />}
                    {isSubmitting ? "Menyimpan..." : "Simpan lapangan"}
                </button>
            </form>

            <aside className="h-fit rounded-2xl border border-line bg-surface p-5">
                <h2 className="font-display text-lg font-bold text-primary">Dibuat di sesi ini</h2>
                {created.length === 0 ? (
                    <p className="mt-2 text-sm text-muted">Belum ada. Setelah disimpan, form dikosongkan supaya kamu bisa langsung menambah lapangan berikutnya.</p>
                ) : (
                    <ul className="mt-3 space-y-2">
                        {created.map((court) => (
                            <li key={court.id}>
                                <Link href={`/courts/${court.id}`} className="text-sm font-semibold text-primary hover:underline">
                                    {court.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </aside>
        </div>
    )
}

function Field({ label, error, htmlFor, children }: { label: string; error?: string; htmlFor: string; children: React.ReactNode }) {
    return (
        <div>
            <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-semibold text-foreground">{label}</label>
            {children}
            {error && <p className="mt-1.5 text-sm text-danger" role="alert">{error}</p>}
        </div>
    )
}
