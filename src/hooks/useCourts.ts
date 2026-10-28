import { useEffect, useState } from "react";
import { getCourts, isAbortError } from "@/services/court.service";
import type { Court, CourtFilters } from "@/types/court";

interface Result {
  key: string;
  courts: Court[];
  error: string | null;
}
export function useCourts({ search, sportType, date }: CourtFilters) {
  
  const [result, setResult] = useState<Result | null>(null);

  
  const [reloadCount, setReloadCount] = useState(0);

  const requestKey = `${search}|${sportType}|${date}|${reloadCount}`;

 
  useEffect(() => {
   
    const controller = new AbortController();

   
    getCourts({ search, sportType, date }, controller.signal)
     
      .then((courts) => setResult({ key: requestKey, courts, error: null }))
   
      .catch((err: unknown) => {
       
        if (isAbortError(err)) return;
       
        setResult({
          key: requestKey,
          courts: [],
          error: "Daftar lapangan gagal dimuat. Periksa koneksi, lalu coba lagi.",
        });
      });

    
    return () => controller.abort();
    
  }, [search, sportType, date, requestKey]);


  const isLoading = result === null || result.key !== requestKey;

  
  return {
    courts: isLoading ? [] : result.courts,
    error: isLoading ? null : result.error,
    isLoading,

    reload: () => setReloadCount((count) => count + 1),
  };
}
