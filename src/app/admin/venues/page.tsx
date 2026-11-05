
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, MapPin, Loader2 } from "lucide-react";
import { getCourts, getErrorMessage } from "@/services/court.service";
import type { Court, CourtFilters } from "@/types/court";
import { toast } from "sonner";

export default function AdminVenuesPage() {
    const [courts, setCourts] = useState<Court[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCourts() {
            try {
                const filters: CourtFilters = {
                    search: "",
                    sportType: "",
                    date: "",
                };

                const data = await getCourts(filters);
                setCourts(data);
            } catch (error) {
                toast.error(getErrorMessage(error, "Gagal mengambil data lapangan"));
            } finally {
                setLoading(false);
            }
        }

        fetchCourts();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Venue Management
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Kelola daftar lapangan yang tersedia.
                    </p>
                </div>

                <Link
                    href="/admin/courts/new"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-semibold text-white hover:bg-primary/90"
                >
                    <Plus size={18} />
                    Create Venue
                </Link>
            </div>

            {loading ? (
                <div className="flex justify-center py-16">
                    <Loader2 className="animate-spin text-primary" size={28} />
                </div>
            ) : courts.length === 0 ? (
                <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center">
                    <MapPin className="mx-auto text-gray-400" size={32} />
                    <h2 className="mt-3 font-semibold text-gray-900">
                        Belum ada venue
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Tambahkan lapangan pertama untuk mulai mengelola venue.
                    </p>
                </div>
            ) : (
                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                           
<thead className="bg-gray-50 text-gray-600">
    <tr>
        <th className="px-5 py-4">Venue</th>
        <th className="px-5 py-4">Olahraga</th>
        <th className="px-5 py-4">Harga / Jam</th>
        <th className="px-5 py-4">Slot</th>
        <th className="px-5 py-4">Rating</th>
        <th className="px-5 py-4">Detail</th>
    </tr>
</thead>

<tbody className="divide-y divide-gray-100">
    {courts.map((court) => (
        <tr key={court.id}>
            <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                    {court.photos[0] && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={court.photos[0]}
                            alt={court.name}
                            className="h-12 w-12 rounded-lg object-cover"
                        />
                    )}
                    <span className="font-semibold text-gray-900">
                        {court.name}
                    </span>
                </div>
            </td>

            <td className="px-5 py-4 text-gray-600">
                {court.sportType ?? "-"}
            </td>

            <td className="px-5 py-4 text-gray-600">
                {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    maximumFractionDigits: 0,
                }).format(court.pricePerHour)}
            </td>

            <td className="px-5 py-4 text-gray-600">
                {court.availableSlots}/{court.totalSlots}
            </td>

            <td className="px-5 py-4 text-gray-600">
                {court.averageRating !== null
                    ? `${court.averageRating.toFixed(1)} (${court.reviewCount})`
                    : "Belum ada rating"}
            </td>

            <td className="px-5 py-4">
                <Link
                    href={`/courts/${court.id}`}
                    className="font-semibold text-primary hover:underline"
                >
                    Lihat
                </Link>
            </td>
        </tr>
    ))}
</tbody>

                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
