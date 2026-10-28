import { api } from "@/lib/axios.instances.lib"
import type { ApiResponse } from "@/types/api.responses"
import type { User } from "@/types/user"

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true'

const MOCK_ADMIN: User = { id: "admin-1", name: "Admin Mock", email: "admin@mock.dev", role: "ADMIN", profile_Image: "" }

// Mengecek siapa yang sedang login lewat cookie "token" dari backend. Gagal dengan 401 kalau belum login.
// Halaman login sendiri dikerjakan di fitur autentikasi.
export async function getProfile(): Promise<User> {
    if (USE_MOCK) return MOCK_ADMIN

    const { data } = await api.get<ApiResponse<User>>("/profile")
    return data.data
}
