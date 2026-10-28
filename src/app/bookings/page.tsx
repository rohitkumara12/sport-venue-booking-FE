import { Navbar } from "@/app/components/navbar";
import { Footer } from "@/app/components/footer";
import { MyBookings } from "./MyBookings";

export default function MyBookingsPage() {
  return (
    <>
      <Navbar />

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
        <h1 className="font-display text-3xl font-extrabold text-primary">Pesanan saya</h1>
        <p className="mt-2 mb-8 text-muted">Status pembayaran, jadwal main, dan ulasan untuk lapangan yang sudah kamu pakai.</p>
        <MyBookings />
      </main>

      <Footer />
    </>
  );
}
