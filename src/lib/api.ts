
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

console.log("API BASE URL:", API_URL);

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});
export default api;

export async function loginRequest(data: {
  email: string;
  password: string;
}) {
  const response = await api.post("/login", data);
  return response.data;
}

export async function registerRequest(data: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}) {
  const response = await api.post("/register", data);
  return response.data;
}

export async function GetProfile() {
  const response = await api.get("/profile");
  return response.data;
}

export async function forgotPasswordRequest(email : string){
  const response = await api.post("/forgot-password", {
    email,
  });
  return response.data
    
  
}

export async function ResetPasswordRequest(data:{

  token : string,
  newPassword : string,
  confirmPassword : string
}) {
  const response = await api.post("/reset-password",data)
  return response.data
}

export async function logoutRequest() {
  const response = await api.post("/logout");
  return response.data;
}