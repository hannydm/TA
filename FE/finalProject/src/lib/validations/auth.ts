import { z } from 'zod';

export const loginSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, { message: "Username wajib diisi" })
    .max(150, { message: "Username terlalu panjang" }),
  password: z
    .string()
    .min(8, { message: "Password minimal 8 karakter" })
    .max(100, { message: "Password maksimal 100 karakter" }),
});

export const registerSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, { message: "Username minimal 3 karakter" })
    .max(30, { message: "Username maksimal 30 karakter" })
    .regex(/^[a-zA-Z0-9_]+$/, { message: "Username hanya boleh huruf, angka, dan underscore" }),
  email: z
    .string()
    .trim()
    .min(1, { message: "Email wajib diisi" })
    .email({ message: "Format email tidak valid" })
    .max(255, { message: "Email terlalu panjang" }),
  password: z
    .string()
    .min(8, { message: "Password minimal 8 karakter" })
    .max(100, { message: "Password maksimal 100 karakter" })
    .regex(/[A-Z]/, { message: "Password harus mengandung huruf besar (A-Z)" })
    .regex(/[0-9]/, { message: "Password harus mengandung angka (0-9)" })
    .regex(/[^A-Za-z0-9]/, { message: "Password harus mengandung simbol (contoh: ! @ # $ %)" }),
  confirmPassword: z
    .string()
    .min(1, { message: "Konfirmasi password wajib diisi" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password dan konfirmasi tidak sama",
  path: ["confirmPassword"],
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: "Email wajib diisi" })
    .email({ message: "Format email tidak valid" })
    .max(255, { message: "Email terlalu panjang" }),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
