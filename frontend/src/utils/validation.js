import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(8, 'Password minimal 8 karakter'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(8, 'Password minimal 8 karakter'),
});

export const profileSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  email: z.string().email('Format email tidak valid'),
  currentPassword: z.string().optional(),
  newPassword: z.string().optional(),
  confirmPassword: z.string().optional(),
}).refine(
  (data) => !data.newPassword || data.newPassword.length >= 8,
  { message: 'Password baru minimal 8 karakter', path: ['newPassword'] }
).refine(
  (data) => !data.newPassword || data.currentPassword,
  { message: 'Password saat ini wajib diisi untuk mengubah password', path: ['currentPassword'] }
).refine(
  (data) => !data.newPassword || data.newPassword === data.confirmPassword,
  { message: 'Konfirmasi password tidak cocok', path: ['confirmPassword'] }
);
