
import axios from "axios";


const API_URL = process.env.NEXT_PUBLIC_API_URL;
console.log("API BASE URL:", API_URL);

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

export async function loginRequest(data: {
  email: string;
  password: string;
}) {
  const response = await api.post("/login", data);
  return response.data;
}

export async function registerRequest(data:{
    name : string;
    email : string;
    password : string;
    confirmPassword: string;
}) {
    const response = await api.post("/register",data);
    return response.data
}

export  async function GetProfile(){
    const response = await api.get('/profile');
    return response.data
}