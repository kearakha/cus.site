import 'server-only';
import { cookies } from 'next/headers';
import { createHash, randomBytes, randomUUID } from 'node:crypto';
import { prisma } from './db';
import { sendWelcomeEmail } from './email';

/**
 * Auth model — 2 cookies parallel:
 *
 * 1. `cus_session` = email owner (setelah magic link login)
 *    - Multi-bisnis friendly (1 email = banyak Bisnis)
 *    - Dipakai di dashboard list + isOwner() detection
 *
 * 2. `cus_owner` = ownerToken (legacy, one-time-use)
 *    - Diset saat onboarding (welcome email link)
 *    - Bookmarked oleh owner sebagai "permanent access link"
 *    - Dirotate setiap kali dipakai untuk claim
 *
 * Flow login:
 * 1. User submit email di /login → server kirim magic link via email
 * 2. User klik link → /api/auth/verify?token=xxx
 * 3. Server hash token → lookup di LoginToken table → validasi expiry/used
 * 4. Set cus_session cookie (email)
 *
 * Flow claim (welcome email link):
 * 1. User klik link `?claim=<ownerToken>`
 * 2. Middleware redirect ke /api/auth/claim?token=xxx
 * 3. Server validate: token cocok Bisnis + ownerTokenUsedAt IS NULL
 * 4. Set cus_session + cus_owner cookie
 * 5. ROTATE ownerToken → email link permanen baru ke owner
 * 6. Mark ownerTokenUsedAt = now() → link lama invalid permanent
 */
const COOKIE_NAME = 'cus_owner';
const SESSION_COOKIE_NAME = 'cus_session';

const LOGIN_TOKEN_TTL_MS = 15 * 60 * 1000; // 15 menit

// === Cookie helpers (shared config) ===

function getRootDomain(): string {
  return (process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'cus.site').toLowerCase();
}

function isLocalEnv(): boolean {
  const root = getRootDomain();
  return process.env.NODE_ENV !== 'production' || root.endsWith('.localhost');
}

function getCookieDomain(): string {
  return isLocalEnv() ? 'localhost' : `.${getRootDomain()}`;
}

function getBaseUrl(): string {
  return isLocalEnv() ? 'http://localhost:3000' : `https://${getRootDomain()}`;
}

function cookieOptions(maxAgeSeconds: number) {
  return {
    httpOnly: true,
    secure: !isLocalEnv(),
    sameSite: 'lax' as const,
    path: '/',
    maxAge: maxAgeSeconds,
    domain: getCookieDomain(),
  };
}

/**
 * Bangun URL access link permanen (bookmark-able) — ownerToken based.
 * Setelah claim, token di-rotate jadi URL baru. Yang lama akan invalid.
 */
export function buildAccessLink(ownerToken: string): string {
  return `${getBaseUrl()}/api/auth/claim?token=${ownerToken}`;
}

/**
 * Set kedua cookies: session email + ownerToken.
 * Dipakai setelah claim / magic link verify.
 */
export function setSessionCookies(email: string, ownerToken: string): void {
  const oneYear = 60 * 60 * 24 * 365;
  cookies().set({
    name: SESSION_COOKIE_NAME,
    value: email,
    ...cookieOptions(oneYear),
  });
  cookies().set({
    name: COOKIE_NAME,
    value: ownerToken,
    ...cookieOptions(oneYear),
  });
}

/**
 * Set session email only (untuk flow magic link — ownerToken belum tentu ada).
 * Untuk dashboard list, ini cukup. Floating Admin Bar detection tetap work
 * via email match.
 */
export function setSessionEmail(email: string): void {
  const oneYear = 60 * 60 * 24 * 365;
  cookies().set({
    name: SESSION_COOKIE_NAME,
    value: email,
    ...cookieOptions(oneYear),
  });
}

export function clearSessionCookies(): void {
  cookies().delete(SESSION_COOKIE_NAME);
  cookies().delete(COOKIE_NAME);
}

// === Login Token (magic link) ===

function sha256(input: string): string {
  return createHash('sha256').update(input).digest('hex');
}

/**
 * Generate magic link token untuk email.
 * Returns raw token (untuk di-embed di email) + expiry date.
 * Raw token HANYA dikembalikan di sini — DB hanya simpan hash.
 */
export async function generateLoginToken(email: string): Promise<{
  rawToken: string;
  expiresAt: Date;
}> {
  const rawToken = randomBytes(32).toString('base64url');
  const tokenHash = sha256(rawToken);
  const expiresAt = new Date(Date.now() + LOGIN_TOKEN_TTL_MS);

  await prisma.loginToken.create({
    data: {
      email: email.toLowerCase().trim(),
      tokenHash,
      expiresAt,
    },
  });

  return { rawToken, expiresAt };
}

/**
 * Verify magic link token. Sekaligus mark sebagai used.
 * Return email kalau valid, null kalau invalid/expired/used.
 */
export async function verifyLoginToken(
  rawToken: string,
): Promise<{ email: string } | null> {
  if (!rawToken) return null;

  const tokenHash = sha256(rawToken);

  const record = await prisma.loginToken.findUnique({
    where: { tokenHash },
  });

  if (!record) return null;
  if (record.usedAt) return null;
  if (record.expiresAt < new Date()) return null;

  // Mark as used (atomic update — kalau 2 request barengan, cuma 1 yang menang)
  const updated = await prisma.loginToken.updateMany({
    where: { id: record.id, usedAt: null },
    data: { usedAt: new Date() },
  });

  if (updated.count === 0) return null; // race: sudah dipakai

  return { email: record.email };
}

/**
 * Cleanup token yang sudah expired + used (untuk cron / manual).
 * Bisa dijadwalkan di Vercel Cron atau GitHub Action nanti.
 */
export async function cleanupLoginTokens(): Promise<number> {
  const result = await prisma.loginToken.deleteMany({
    where: {
      OR: [
        { usedAt: { not: null } },
        { expiresAt: { lt: new Date() } },
      ],
    },
  });
  return result.count;
}

// === Owner Token (claim flow) ===

/**
 * Claim ownerToken (one-time use). Validasi, set session cookies,
 * rotate ownerToken, return new ownerToken (untuk dikirim via email
 * sebagai link permanen baru).
 *
 * Return null kalau token invalid / sudah pernah dipakai.
 */
export type ClaimResult = {
  email: string;
  subdomain: string;
  businessName: string;
  newOwnerToken: string;
};

export async function claimOwnerToken(rawToken: string): Promise<ClaimResult | null> {
  if (!rawToken) return null;

  // Atomic claim: hanya update kalau ownerTokenUsedAt masih null
  // (race condition safe — 2 klik barengan, cuma 1 yang dapat)
  const newOwnerToken = randomUUID();

  const updated = await prisma.bisnis.updateMany({
    where: {
      ownerToken: rawToken,
      ownerTokenUsedAt: null,
    },
    data: {
      ownerToken: newOwnerToken,
      ownerTokenUsedAt: new Date(),
    },
  });

  if (updated.count === 0) {
    // Token sudah pernah dipakai atau invalid
    return null;
  }

  // Ambil data bisnis untuk return + setup cookies
  const bisnis = await prisma.bisnis.findUnique({
    where: { ownerToken: newOwnerToken },
    select: { email: true, subdomain: true, namaBisnis: true },
  });

  if (!bisnis) return null;

  setSessionCookies(bisnis.email, newOwnerToken);

  return {
    email: bisnis.email,
    subdomain: bisnis.subdomain,
    businessName: bisnis.namaBisnis,
    newOwnerToken,
  };
}

/**
 * Generate ownerToken baru tanpa claim (untuk admin tool / recovery).
 * Token lama di-invalidate.
 */
export async function rotateOwnerToken(bisnisId: string): Promise<string> {
  const newToken = randomUUID();
  await prisma.bisnis.update({
    where: { id: bisnisId },
    data: { ownerToken: newToken },
  });
  return newToken;
}

/**
 * Kirim link akses permanen ke email owner.
 * Dipakai setelah claim selesai — link baru sudah ter-rotate.
 */
export async function emailPermanentAccessLink(
  bisnisId: string,
): Promise<{ ok: boolean; error?: string }> {
  const bisnis = await prisma.bisnis.findUnique({
    where: { id: bisnisId },
    select: { ownerToken: true, email: true, subdomain: true, namaBisnis: true },
  });
  if (!bisnis) return { ok: false, error: 'Bisnis tidak ditemukan' };

  const accessLink = buildAccessLink(bisnis.ownerToken);

  try {
    await sendWelcomeEmail({
      to: bisnis.email,
      businessName: bisnis.namaBisnis,
      subdomain: bisnis.subdomain,
      claimUrl: accessLink, // link permanen — bisa di-bookmark, gak expire
      permanentAccessUrl: accessLink,
    });
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Gagal kirim email',
    };
  }
}

// === Cookie readers ===

export function getSessionEmail(): string | null {
  try {
    const c = cookies().get(SESSION_COOKIE_NAME);
    return c?.value ?? null;
  } catch {
    return null;
  }
}

export function getOwnerTokenFromCookie(): string | null {
  try {
    const c = cookies().get(COOKIE_NAME);
    return c?.value ?? null;
  } catch {
    return null;
  }
}

// === Ownership check ===

/**
 * Cek apakah visitor adalah owner dari bisnis tertentu.
 * Multi-strategy: cek session email match ATAU ownerToken match.
 */
export function isOwner(bisnis: { email: string; ownerToken: string }): boolean {
  const sessionEmail = getSessionEmail();
  if (sessionEmail && sessionEmail.toLowerCase() === bisnis.email.toLowerCase()) {
    return true;
  }

  const ownerToken = getOwnerTokenFromCookie();
  if (ownerToken && ownerToken === bisnis.ownerToken) {
    return true;
  }

  return false;
}

// === Get businesses for logged-in owner ===

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
      where: { email: sessionEmail.toLowerCase() },
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
