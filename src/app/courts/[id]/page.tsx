import { Suspense } from "react";
import { Navbar } from "@/app/components/navbar";
import { Footer } from "@/app/components/footer";
import { BackLink, CourtDetail, CourtDetailSkeleton } from "./CourtDetail";

export default function CourtDetailPage() {
  return (
    <>
      <Navbar />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
        <BackLink />

        {/* CourtDetail membaca id dan ?date= dari URL, jadi harus dibungkus Suspense. */}
        <Suspense fallback={<CourtDetailSkeleton />}>
          <CourtDetail />
        </Suspense>
      </main>

      <Footer />
    </>
  );
}
