'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { setSessionEmail, setSessionCookies } from '@/lib/auth';

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email wajib diisi')
    .email('Format email tidak valid')
    .max(120)
    .transform((v) => v.toLowerCase().trim()),
});

export type LoginResult =
  | { success: true; subdomain: string }
  | { success: false; error: string };

/**
 * Login pakai email — cari Bisnis dengan email itu, set session cookie,
 * return subdomain untuk redirect.
 */
export async function loginWithEmailAction(
  formData: FormData,
): Promise<LoginResult> {
  const raw = formData.get('email');
  const parsed = loginSchema.safeParse({ email: raw });

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? 'Input tidak valid',
    };
  }

  // Cari Bisnis dengan email ini
  const bisnisList = await prisma.bisnis.findMany({
    where: {
      email: parsed.data.email,
      published: true,
    },
    orderBy: { createdAt: 'desc' },
    select: { id: true, subdomain: true, ownerToken: true, email: true },
  });

  if (bisnisList.length === 0) {
    return {
      success: false,
      error: 'Email tidak terdaftar. Pastikan kamu sudah pernah bikin website.',
    };
  }

  // Set session email cookie + ownerToken dari bisnis terbaru
  // (untuk Floating Admin Bar di subdomain bisnis manapun dengan email ini)
  const bisnis = bisnisList[0];
  setSessionCookies(bisnis.email, bisnis.ownerToken);

  return { success: true, subdomain: bisnis.subdomain };
}

/**
 * Server action untuk form HTML biasa (no JS).
 */
export async function loginFormAction(formData: FormData) {
  const result = await loginWithEmailAction(formData);
  if (!result.success) {
    redirect(`/login?error=${encodeURIComponent(result.error)}`);
  }
  redirect('/dashboard');
}
