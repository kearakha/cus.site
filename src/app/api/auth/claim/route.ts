import { NextRequest, NextResponse } from 'next/server';
import { claimOwnerToken, emailPermanentAccessLink } from '@/lib/auth';

/**
 * GET /api/auth/claim?token=<ownerToken>
 *
 * One-time claim flow. Dipanggil dari:
 * 1. Welcome email link (setelah onboarding)
 * 2. Bookmark access link di dashboard
 *
 * Flow:
 * 1. Lookup Bisnis by ownerToken + ownerTokenUsedAt IS NULL
 * 2. Atomic rotate: set ownerTokenUsedAt = now(), generate ownerToken baru
 * 3. Set cookies (cus_session + cus_owner)
 * 4. Email link permanen baru ke owner
 * 5. Redirect ke /dashboard?welcome=1 (kalau first claim) atau /dashboard
 *
 * Kalau token sudah pernah dipakai → ke /login?error=claim_used
 * (owner bisa login via email magic link untuk recover)
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');

  if (!token) {
    return NextResponse.redirect(new URL('/login?error=missing_token', request.url));
  }

  const result = await claimOwnerToken(token);

  if (!result) {
    return NextResponse.redirect(new URL('/login?error=claim_used', request.url));
  }

  // Kirim link permanen baru ke email (fire-and-forget — kalo gagal,
  // user tetap bisa akses via magic link login)
  emailPermanentAccessLink(result.subdomain).catch((err) => {
    console.error('[api/auth/claim] Gagal kirim email link permanen:', err);
  });

  return NextResponse.redirect(
    new URL('/dashboard?welcome=1', request.url),
    { status: 303 },
  );
}
