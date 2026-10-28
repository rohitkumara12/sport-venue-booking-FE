// Bentuk respons standar dari backend, sama dengan /health: { success, message, data }.
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
