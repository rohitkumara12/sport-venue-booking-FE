
export interface Court {
  
  id: string;

  name: string;

  
  description: string | null;

  
  sportType: string | null;

  pricePerHour: number;

 
  photos: string[];

  totalSlots: number;


  availableSlots: number;

  
  averageRating: number | null;

  reviewCount: number;
}


export interface CourtSlot {
  start: string;
  end: string;
  // Jam mulai dalam format "HH:00", contoh "08:00".
  label: string;
  isAvailable: boolean;
}

export interface CourtDetail extends Court {
  slots: CourtSlot[];
}

export interface CreateCourtPayload {
  name: string;
  sportType: string;
  pricePerHour: number;
  description?: string;
  photos: string[];
}

export interface CourtFilters {
  search: string;

  sportType: string;

  date: string;
}
