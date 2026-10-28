export type Role = "ADMIN" | "USER";

// Data user dari backend (POST /login dan GET /profile). Password tidak pernah dikirim.
export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  profile_Image: string;
}
