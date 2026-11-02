import { api } from "@/lib/axios.instances.lib"
import type { ApiResponse } from "@/types/api.responses"
import type {
    AdminTransaction,
    AvailableMembership,
    Booking,
    CourtReview,
    CreateBookingPayload,
    TransactionStatus,
} from "@/types/booking"

// Fitur booking selalu memakai backend asli (tidak ada versi mock).

export async function createBooking(payload: CreateBookingPayload): Promise<Booking> {
    const { data } = await api.post<ApiResponse<Booking>>("/bookings", payload)
    return data.data
}

export async function getMyBookings(): Promise<Booking[]> {
    const { data } = await api.get<ApiResponse<Booking[]>>("/bookings/me")
    return data.data
}

export async function getBooking(id: string): Promise<Booking> {
    const { data } = await api.get<ApiResponse<Booking>>(`/bookings/${id}`)
    return data.data
}

export async function submitPaymentProof(bookingId: string, paymentProofUrl: string): Promise<Booking> {
    const { data } = await api.patch<ApiResponse<Booking>>(`/bookings/${bookingId}/payment-proof`, { paymentProofUrl })
    return data.data
}

export async function getAvailableMemberships(): Promise<AvailableMembership[]> {
    const { data } = await api.get<ApiResponse<AvailableMembership[]>>("/bookings/memberships")
    return data.data
}

export async function createReview(bookingId: string, rating: number, comment: string): Promise<void> {
    await api.post("/reviews", { bookingId, rating, comment: comment || undefined })
}

export async function getCourtReviews(courtId: string): Promise<CourtReview[]> {
    const { data } = await api.get<ApiResponse<CourtReview[]>>(`/courts/${courtId}/reviews`)
    return data.data
}

// ---------- Admin ----------

export async function getTransactions(status: TransactionStatus): Promise<AdminTransaction[]> {
    const { data } = await api.get<ApiResponse<AdminTransaction[]>>("/admin/transactions", { params: { status } })
    return data.data
}

export async function confirmTransaction(id: string): Promise<void> {
    await api.patch(`/admin/transactions/${id}/confirm`)
}

export async function rejectTransaction(id: string): Promise<void> {
    await api.patch(`/admin/transactions/${id}/reject`)
}
