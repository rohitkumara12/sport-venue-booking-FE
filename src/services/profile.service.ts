import api from "@/lib/api"
import { ApiResponse } from "@/types/api.responses";
import { User } from "@/types/user";

export async function getProfile(): Promise<User> {
    const {data} = await api.get<ApiResponse<User>>("/profile");
    return data.data
}

export async function updateProfilImage(file : File): Promise<User> {
    const formData = new FormData();

    formData.append("profile_Image",file)

    const {data} = await api.patch<ApiResponse<User>>(
        "/profile/image",
        formData
    )
    return data.data
}
