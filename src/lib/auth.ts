import 'server-only';
import { cookies } from 'next/headers';
import { prisma } from './db';

/**
 * Dua cookies parallel untuk backward compat:
 * - `cus_session` (new): email-based, multi-bisnis friendly
 * - `cus_owner` (legacy): UUID ownerToken, 1-cookie-per-bisnis
 *
 * Production: pakai cus_session sebagai primary auth.
 * Legacy users yang onboard sebelum login ada tetap punya cus_owner
 * dan masih detected di Floating Admin Bar via isOwner fallback.
 */
const COOKIE_NAME = 'cus_owner';
const SESSION_COOKIE_NAME = 'cus_session';

/**
 * Bangun URL access link — kalau cookie hilang, owner bisa pake link ini
 * untuk recover akses. Format: https://cus.site/dashboard?claim=<token>
 */
export function buildAccessLink(ownerToken: string): string {
  const rootDomain = (process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'cus.site').toLowerCase();
  const isLocal =
    process.env.NODE_ENV !== 'production' ||
    rootDomain.endsWith('.localhost');
  const base = isLocal ? 'http://localhost:3000' : `https://${rootDomain}`;
  return `${base}/dashboard?claim=${ownerToken}`;
}

/**
 * Set kedua cookies: session email + legacy ownerToken.
 * Dipanggil saat onboarding selesai.
 */
export function setSessionCookies(email: string, ownerToken: string): void {
  const rootDomain = (process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'cus.site').toLowerCase();
  const isLocal =
    process.env.NODE_ENV !== 'production' ||
    rootDomain.endsWith('.localhost');

  const cookieOptions = {
    httpOnly: true,
    secure: !isLocal,
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 60 * 60 * 24 * 365, // 1 tahun
    domain: isLocal ? 'localhost' : `.${rootDomain}`,
  };

  cookies().set({ name: SESSION_COOKIE_NAME, value: email, ...cookieOptions });
  cookies().set({ name: COOKIE_NAME, value: ownerToken, ...cookieOptions });
}

/**
 * Set session email (untuk login flow). Tidak set ownerToken —
 * Floating Admin Bar detect via session email match.
 */
export function setSessionEmail(email: string): void {
  const rootDomain = (process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'cus.site').toLowerCase();
  const isLocal =
    process.env.NODE_ENV !== 'production' ||
    rootDomain.endsWith('.localhost');

  cookies().set({
    name: SESSION_COOKIE_NAME,
    value: email,
    httpOnly: true,
    secure: !isLocal,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    domain: isLocal ? 'localhost' : `.${rootDomain}`,
  });
}

/**
 * Set cookie owner — dipanggil dari layout dashboard kalau ada `?claim=<token>`
 * di URL.
 */
export async function claimAccessToken(token: string): Promise<boolean> {
  if (!token) return false;

  const bisnis = await prisma.bisnis.findFirst({
    where: { ownerToken: token },
    select: { id: true, email: true, ownerToken: true },
  });
  if (!bisnis) return false;

  // Set kedua cookies — session email + legacy ownerToken
  setSessionCookies(bisnis.email, bisnis.ownerToken);
  return true;
}

/**
 * Baca email dari session cookie. Return null kalau gak ada.
 */
export function getSessionEmail(): string | null {
  try {
    const c = cookies().get(SESSION_COOKIE_NAME);
    return c?.value ?? null;
  } catch {
    return null;
  }
}

/**
 * Baca ownerToken dari legacy cookie. Return null kalau gak ada.
 */
export function getOwnerTokenFromCookie(): string | null {
  try {
    const c = cookies().get(COOKIE_NAME);
    return c?.value ?? null;
  } catch {
    return null;
  }
}

/**
 * Cek apakah visitor adalah owner dari bisnis tertentu.
 * Multi-strategy: cek session email match ATAU legacy ownerToken match.
 */
export function isOwner(bisnis: { email: string; ownerToken: string }): boolean {
  const sessionEmail = getSessionEmail();
  if (sessionEmail && sessionEmail === bisnis.email) return true;

  const ownerToken = getOwnerTokenFromCookie();
  if (ownerToken && ownerToken === bisnis.ownerToken) return true;

  return false;
}

/**
 * Ambil SEMUA bisnis milik owner yang lagi login.
 *
 * Strategy:
 * 1. Cek session email → query by email (multi-bisnis friendly)
 * 2. Fallback legacy ownerToken → query by ownerToken (1 bisnis)
 * 3. Return null kalau gak ada keduanya
 */
export async function getOwnedBusinesses() {
  const sessionEmail = getSessionEmail();
  if (sessionEmail) {
    return prisma.bisnis.findMany({
      where: { email: sessionEmail },
      include: {
        kontenAI: { select: { heroHeadline: true, accentColor: true } },
        _count: { select: { layanan: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  const ownerToken = getOwnerTokenFromCookie();
  if (ownerToken) {
    return prisma.bisnis.findMany({
      where: { ownerToken },
      include: {
        kontenAI: { select: { heroHeadline: true, accentColor: true } },
        _count: { select: { layanan: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  return null;
}

export const OWNER_COOKIE_NAME = COOKIE_NAME;
export const SESSION_COOKIE_NAME_EXPORT = SESSION_COOKIE_NAME;
