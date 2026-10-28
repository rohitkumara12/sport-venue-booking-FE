import { Navbar } from "@/app/components/navbar";
import { Footer } from "@/app/components/footer";
import { AdminGuard } from "@/app/admin/AdminGuard";
import { CreateCourtForm } from "./CreateCourtForm";

export default function CreateCourtPage() {
  return (
    <>
      <Navbar />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
        <h1 className="font-display text-3xl font-extrabold text-primary">Tambah lapangan</h1>
        <p className="mt-2 mb-8 text-muted">Isi detail lapangan dan unggah fotonya. Lapangan langsung tampil di halaman utama.</p>

        <AdminGuard>
          <CreateCourtForm />
        </AdminGuard>
      </main>

      <Footer />
    </>
  );
}
