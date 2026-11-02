import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/app/components/navbar";
import { Footer } from "@/app/components/footer";
import { BookingDetail } from "./BookingDetail";

export default function BookingDetailPage() {
  return (
    <>
      <Navbar />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
        <Link href="/bookings" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
          <ArrowLeft size={16} aria-hidden="true" />
          Pesanan saya
        </Link>

        {/* BookingDetail membaca id dari URL, jadi dibungkus Suspense. */}
        <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-line" aria-hidden="true" />}>
          <BookingDetail />
        </Suspense>
      </main>

      <Footer />
    </>
  );
}
