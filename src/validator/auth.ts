
import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Nama minimal 2 karakter"),

  email: z
    .email("Format email tidak valid")
    .trim(),

  password: z
    .string()
    .min(8, "Password minimal 8 karakter"),

confirmPassword : z
.string()
.min(1,'Confirm password is required field')
});

export const loginSchema = z.object({
  email: z
    .email("Format email tidak valid")
    .trim(),

  password: z
    .string()
    .min(8, "Password minimal 8 karakter"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegistrasiFromValues = z.infer<typeof registerSchema>;
