import { useEffect, useRef, useState } from "react";

// Sisa detik sampai `deadline`, diperbarui setiap detik. onExpire dipanggil sekali saat waktu habis.
export function useCountdown(deadline: string | null, onExpire?: () => void) {
  const [now, setNow] = useState(() => Date.now());
  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    if (!deadline) return;
    const end = new Date(deadline).getTime();
    const timer = setInterval(() => {
      const current = Date.now();
      setNow(current);
      if (current >= end) {
        clearInterval(timer);
        onExpireRef.current?.();
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [deadline]);

  const secondsLeft = deadline ? Math.max(0, Math.floor((new Date(deadline).getTime() - now) / 1000)) : 0;
  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  return { secondsLeft, label: `${mm}:${ss}` };
}
