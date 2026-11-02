export type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED" | "EXPIRED";

export type TransactionStatus =
  | "PENDING" // menunggu pembayaran
  | "PROOF_SUBMITTED" // menunggu konfirmasi admin
  | "PAID" // selesai
  | "REJECTED" // ditolak admin
  | "EXPIRED" // tidak upload bukti dalam 30 menit
  | "CANCELLED" // admin tidak merespons dalam 30 menit
  | "REFUNDED";

export interface BookingTransaction {
  id: string;
  status: TransactionStatus;
  amount: number;
  paymentProofUrl: string | null;
  // Batas waktu tahap sekarang: upload bukti (PENDING) atau konfirmasi admin (PROOF_SUBMITTED).
  expiresAt: string | null;
  confirmedAt: string | null;
}

export interface Booking {
  id: string;
  status: BookingStatus;
  startTime: string;
  endTime: string;
  totalPrice: number;
  createdAt: string;
  court: { id: string; name: string; sportType: string | null; photos: string[]; pricePerHour: number };
  membership: { id: string; planName: string } | null;
  transaction: BookingTransaction | null;
  review: { id: string; rating: number; comment: string | null; createdAt: string } | null;
  canReview: boolean;
}

export interface CreateBookingPayload {
  courtId: string;
  date: string;
  startHour: number;
  hours: number;
  customerMembershipId?: string;
}

export interface AvailableMembership {
  id: string;
  planName: string;
  remainingSessions: number;
  startsAt: string | null;
  expiresAt: string | null;
}

export interface AdminTransaction {
  id: string;
  status: TransactionStatus;
  amount: number;
  paymentProofUrl: string | null;
  expiresAt: string | null;
  updatedAt: string;
  user: { name: string; email: string };
  booking: { id: string; startTime: string; endTime: string; court: { id: string; name: string } } | null;
}

export interface CourtReview {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: { name: string; profile_Image: string };
}
