import axios from "axios";

// Satu instance axios untuk semua request ke backend. Alamatnya diatur lewat NEXT_PUBLIC_API_URL di .env.
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1",
  timeout: 10000,
  // Login backend menyimpan JWT di cookie "token"; cookie itu ikut terkirim hanya kalau ini true.
  withCredentials: true,
});
