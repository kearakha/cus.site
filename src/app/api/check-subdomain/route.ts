import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

/**
 * GET /api/check-subdomain?slug=xxx
 *
 * Cek apakah subdomain sudah dipakai. Digunakan oleh wizard Step 5
 * untuk memberikan feedback realtime ke user sebelum submit.
 *
 * Response:
 * - { available: true }  → subdomain belum dipakai
 * - { available: false } → subdomain sudah dipakai
 * - 400 jika slug kosong atau kurang dari 3 karakter
 */
export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug');

  if (!slug || slug.length < 3) {
    return NextResponse.json(
      { error: 'Slug minimal 3 karakter' },
      { status: 400 },
    );
  }

  const existing = await prisma.bisnis.findUnique({
    where: { subdomain: slug.toLowerCase() },
    select: { id: true },
  });

  return NextResponse.json({
    available: !existing,
    slug: slug.toLowerCase(),
  });
}
