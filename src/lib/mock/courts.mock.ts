import type { Court, CourtDetail, CourtFilters, CreateCourtPayload } from "@/types/court";

// Data contoh selama API court di backend belum dibuat.
// Aktifkan dengan NEXT_PUBLIC_USE_MOCK=true di .env.
const MOCK_COURTS: Court[] = [
  {
    id: "c1",
    name: "Arena Futsal Senayan",
    description: "Lapangan futsal indoor dengan rumput sintetis dan pencahayaan LED.",
    sportType: "Futsal",
    pricePerHour: 150000,
    photos: [],
    totalSlots: 14,
    availableSlots: 6,
    averageRating: 4.6,
    reviewCount: 38,
  },
  {
    id: "c2",
    name: "GOR Badminton Kemang",
    description: "Lantai karpet standar BWF, tersedia raket sewaan.",
    sportType: "Badminton",
    pricePerHour: 80000,
    photos: [],
    totalSlots: 14,
    availableSlots: 0,
    averageRating: 4.3,
    reviewCount: 21,
  },
  {
    id: "c3",
    name: "Basket Court Tebet",
    description: "Lapangan outdoor full court dengan ring standar FIBA.",
    sportType: "Basket",
    pricePerHour: 120000,
    photos: [],
    totalSlots: 12,
    availableSlots: 9,
    averageRating: null,
    reviewCount: 0,
  },
  {
    id: "c4",
    name: "Tenis Hardcourt Cilandak",
    description: "Hardcourt dengan tribun kecil, cocok untuk latihan malam.",
    sportType: "Tenis",
    pricePerHour: 200000,
    photos: [],
    totalSlots: 12,
    availableSlots: 3,
    averageRating: 4.8,
    reviewCount: 12,
  },
  {
    id: "c5",
    name: "Mini Soccer Pondok Indah",
    description: "Lapangan 7 lawan 7 dengan rumput sintetis premium.",
    sportType: "Mini Soccer",
    pricePerHour: 450000,
    photos: [],
    totalSlots: 10,
    availableSlots: 5,
    averageRating: 4.5,
    reviewCount: 27,
  },
  {
    id: "c6",
    name: "Futsal Kuningan Center",
    description: null,
    sportType: "Futsal",
    pricePerHour: 130000,
    photos: [],
    totalSlots: 14,
    availableSlots: 11,
    averageRating: 4.1,
    reviewCount: 9,
  },
];

export function fetchMockCourts(
  { search, sportType }: CourtFilters,
  signal?: AbortSignal,
): Promise<Court[]> {
  return new Promise((resolve, reject) => {
    // Jeda kecil supaya skeleton loading terlihat seperti request sungguhan.
    const timer = setTimeout(() => {
      const keyword = search.trim().toLowerCase();
      resolve(
        MOCK_COURTS.filter(
          (court) =>
            (!keyword || court.name.toLowerCase().includes(keyword)) &&
            (!sportType || court.sportType === sportType),
        ),
      );
    }, 500);

    signal?.addEventListener("abort", () => {
      clearTimeout(timer);
      reject(new DOMException("Aborted", "AbortError"));
    });
  });
}

const OPEN_HOUR = 8;

export function fetchMockCourtDetail(id: string, date: string, signal?: AbortSignal): Promise<CourtDetail> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      const court = MOCK_COURTS.find((c) => c.id === id);
      if (!court) return reject(new Error("NOT_FOUND"));

      // Slot terisi dibuat acak tapi tetap sama untuk tanggal yang sama.
      // Pengali 11 tidak punya faktor bersama dengan 10/12/14, jadi jumlah slot terisi = bookedCount.
      const day = Number(date.slice(-2)) || 1;
      const bookedCount = court.totalSlots - court.availableSlots;
      const slots = Array.from({ length: court.totalSlots }, (_, i) => {
        const hour = String(OPEN_HOUR + i).padStart(2, "0");
        const next = String(OPEN_HOUR + i + 1).padStart(2, "0");
        return {
          start: `${date}T${hour}:00:00`,
          end: `${date}T${next}:00:00`,
          label: `${hour}:00`,
          isAvailable: (i * 11 + day) % court.totalSlots >= bookedCount,
        };
      });

      resolve({ ...court, slots });
    }, 500);

    signal?.addEventListener("abort", () => {
      clearTimeout(timer);
      reject(new DOMException("Aborted", "AbortError"));
    });
  });
}

// Court baru hanya tersimpan selama tab browser belum di-refresh.
export function createMockCourt(payload: CreateCourtPayload): Promise<Court> {
  const court: Court = {
    id: `c${Date.now()}`,
    name: payload.name,
    description: payload.description || null,
    sportType: payload.sportType,
    pricePerHour: payload.pricePerHour,
    photos: payload.photos,
    totalSlots: 14,
    availableSlots: 14,
    averageRating: null,
    reviewCount: 0,
  };
  MOCK_COURTS.unshift(court);
  return new Promise((resolve) => setTimeout(() => resolve(court), 500));
}
