'use server';

import { z } from 'zod';
import { prisma } from '@/lib/db';
import { generateLoginToken, buildAccessLink } from '@/lib/auth';
import { sendLoginLink } from '@/lib/email';

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email wajib diisi')
    .email('Format email tidak valid')
    .max(120)
    .transform((v) => v.toLowerCase().trim()),
});

export type LoginResult =
  | {
      success: true;
      /** Email yang di-submit (untuk UI "cek email" state) */
      email: string;
      /** Dev mode: link magic ada di sini (kalau RESEND_API_KEY belum di-set) */
      devMagicLink?: string;
    }
  | { success: false; error: string };

/**
 * Submit email → server generate magic link token, kirim via email.
 *
 * Return success SELALU (asalkan email format valid), supaya gak bocorin
 * apakah email terdaftar atau tidak (anti-enumeration). Kalau email gak
 * ada di DB, kita tetap kirim "fake" link — tapi untuk MVP kita skip
 * fake email (hemat Resend quota) dan return success juga.
 *
 * Link expire 15 menit, one-time use.
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

  const email = parsed.data.email;

  // Cek apakah email terdaftar — tapi return success regardless supaya
  // attacker gak bisa enumerate email yang punya akun.
  const bisnis = await prisma.bisnis.findFirst({
    where: { email, published: true },
    select: { subdomain: true, namaBisnis: true },
  });

  // Always return success — kalau email gak ada, gak kirim email
  // (tapi user gak tau). Untuk MVP sederhana; production idealnya
  // selalu kirim email dengan generic "kalo kamu belum daftar, abaikan".
  if (!bisnis) {
    return { success: true, email };
  }

  const { rawToken } = await generateLoginToken(email);
  const magicLink = `${getBaseUrl()}/api/auth/verify?token=${rawToken}`;

  try {
    const result = await sendLoginLink({
      to: email,
      loginUrl: magicLink,
      businessName: bisnis.namaBisnis,
    });

    return {
      success: true,
      email,
      // Dev mode: kasih link langsung biar lo bisa test tanpa email
      ...(result.dev ? { devMagicLink: magicLink } : {}),
    };
  } catch (err) {
    console.error('[loginWithEmailAction] send error:', err);
    return {
      success: false,
      error: 'Gagal kirim email. Coba lagi nanti.',
    };
  }
}

/**
 * Bangun URL access link permanen — versi public untuk email welcome.
 * Import dari auth.ts aja, tapi re-export di sini biar import lebih clean
 * dari komponen.
 */
export { buildAccessLink };

function getBaseUrl(): string {
  const root = (process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'cus.site').toLowerCase();
  const isLocal =
    process.env.NODE_ENV !== 'production' || root.endsWith('.localhost');
  return isLocal ? 'http://localhost:3000' : `https://${root}`;
}
