import { useEffect, useState } from "react";
import { getCourtDetail, isAbortError, isNotFoundError } from "@/services/court.service";
import type { CourtDetail } from "@/types/court";

interface Result {
  key: string;
  court: CourtDetail | null;
  error: string | null;
  notFound: boolean;
}

// Pola yang sama dengan useCourts: hasil disimpan bersama "key" request-nya,
// jadi data lama tidak ditampilkan saat tanggal berubah.
export function useCourtDetail(id: string, date: string) {
  const [result, setResult] = useState<Result | null>(null);
  const [reloadCount, setReloadCount] = useState(0);

  const requestKey = `${id}|${date}|${reloadCount}`;

  useEffect(() => {
    const controller = new AbortController();

    getCourtDetail(id, date, controller.signal)
      .then((court) => setResult({ key: requestKey, court, error: null, notFound: false }))
      .catch((err: unknown) => {
        if (isAbortError(err)) return;
        setResult({
          key: requestKey,
          court: null,
          error: "Detail lapangan gagal dimuat. Periksa koneksi, lalu coba lagi.",
          notFound: isNotFoundError(err),
        });
      });

    return () => controller.abort();
  }, [id, date, requestKey]);

  const isLoading = result === null || result.key !== requestKey;

  return {
    court: isLoading ? null : result.court,
    error: isLoading ? null : result.error,
    notFound: !isLoading && result.notFound,
    isLoading,
    reload: () => setReloadCount((count) => count + 1),
  };
}
