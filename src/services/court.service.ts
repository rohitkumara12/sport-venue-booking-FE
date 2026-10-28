import axios from "axios"
import { api } from "@/lib/axios.instances.lib"
import { createMockCourt, fetchMockCourtDetail, fetchMockCourts } from "@/lib/mock/courts.mock"
import type { ApiResponse } from "@/types/api.responses"
import type { Court, CourtDetail, CourtFilters, CreateCourtPayload } from "@/types/court"

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true'

export async function getCourts(filters: CourtFilters, signal?: AbortSignal): Promise<Court[]> {
    if (USE_MOCK) return fetchMockCourts(filters, signal)

    // Parameter kosong tidak dikirim, supaya backend menganggapnya "semua".
    const { data } = await api.get<ApiResponse<Court[]>>("/courts", {
        params: {
            search: filters.search || undefined,
            sportType: filters.sportType || undefined,
            date: filters.date || undefined,
        },
        signal,
    })
    return data.data
}

export async function getCourtDetail(id: string, date: string, signal?: AbortSignal): Promise<CourtDetail> {
    if (USE_MOCK) return fetchMockCourtDetail(id, date, signal)

    const { data } = await api.get<ApiResponse<CourtDetail>>(`/courts/${id}`, {
        params: { date },
        signal,
    })
    return data.data
}

export async function createCourt(payload: CreateCourtPayload): Promise<Court> {
    if (USE_MOCK) return createMockCourt(payload)

    const { data } = await api.post<ApiResponse<Court>>("/courts", payload)
    return data.data
}

// Pesan dari backend (mis. "Hanya admin yang boleh mengakses") lebih jelas daripada pesan axios.
export function getErrorMessage(err: unknown, fallback: string): string {
    if (axios.isAxiosError(err)) return err.response?.data?.message ?? fallback
    return err instanceof Error ? err.message : fallback
}

// Request yang dibatalkan (filter berubah sebelum respons datang) bukan error untuk pengguna.
export function isAbortError(err: unknown): boolean {
    return axios.isCancel(err) || (err instanceof DOMException && err.name === "AbortError")
}

export function isNotFoundError(err: unknown): boolean {
    return (axios.isAxiosError(err) && err.response?.status === 404) ||
        (err instanceof Error && err.message === "NOT_FOUND")
}
