import { Navbar } from "@/app/components/navbar";
import { Footer } from "@/app/components/footer";
import { AdminGuard } from "@/app/admin/AdminGuard";
import { TransactionList } from "./TransactionList";

export default function AdminTransactionsPage() {
  return (
    <>
      <Navbar />

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
        <h1 className="font-display text-3xl font-extrabold text-primary">Konfirmasi pembayaran</h1>
        <p className="mt-2 mb-8 text-muted">Terima atau tolak bukti bayar dalam 30 menit. Lewat dari itu, transaksi dibatalkan otomatis.</p>

        <AdminGuard>
          <TransactionList />
        </AdminGuard>
      </main>

      <Footer />
    </>
  );
}
