import { Suspense } from "react";
import { Navbar } from "./components/navbar";
import { Hero } from "./components/hero";
import { CourtBrowser } from "./components/CourtBrowser";
import { HowItWorks } from "./components/HowItWorks";
import { Footer } from "./components/footer";

import { CourtCardSkeleton } from "./components/CourtCardSkeleton";

export default function Home() {
  return (
    // <> ... </> = "fragment": pembungkus tak terlihat, karena React hanya boleh mengembalikan SATU elemen induk.
    <>
      {/* Menu atas, menempel saat di-scroll. */}
      <Navbar />

      {/* <main> = tag untuk isi utama halaman. flex-1 = mengisi sisa tinggi layar,
          sehingga Footer (yang memakai mt-auto) terdorong ke paling bawah. */}
      <main className="flex-1">
        {/* Bagian pembuka: judul, tombol, bola tenis. */}
        <Hero />

        {/* CourtBrowser sudah berisi pencarian, filter, daftar CourtCard, EmptyState, dan skeleton.
            Karena itu CourtCard / EmptyState TIDAK perlu ditulis lagi di halaman ini.
            fallback = tampilan sementara (3 skeleton) selagi CourtBrowser disiapkan. */}
        <Suspense
          fallback={
            <div className="mx-auto grid max-w-6xl gap-5 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
              <CourtCardSkeleton />
              <CourtCardSkeleton />
              <CourtCardSkeleton />
            </div>
          }
        >
          <CourtBrowser />
        </Suspense>

        {/* Tiga langkah cara memesan. */}
        <HowItWorks />
      </main>

      {/* Bagian bawah halaman. */}
      <Footer />
    </>
  );
}