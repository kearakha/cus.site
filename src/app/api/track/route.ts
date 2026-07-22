import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

/**
 * POST /api/track
 *
 * Lightweight page view tracking endpoint.
 * Called from tenant templates via fire-and-forget fetch.
 *
 * Body: { bisnisId: string, path?: string, referrer?: string }
 *
 * No auth required — public endpoint, minimal data, no PII.
 * Responds quickly to not block client rendering.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { bisnisId, path, referrer } = body;

    if (!bisnisId || typeof bisnisId !== 'string') {
      return NextResponse.json({ error: 'bisnisId required' }, { status: 400 });
    }

    // Fire-and-forget — don't await, respond immediately
    // We still await here for serverless compatibility, but keep it fast
    await prisma.pageView.create({
      data: {
        bisnisId,
        path: typeof path === 'string' ? path.slice(0, 500) : '/',
        referrer: typeof referrer === 'string' ? referrer.slice(0, 500) : null,
      },
    });

    return NextResponse.json({ ok: true });
  } catch {
    // Swallow errors — tracking should never break the user experience
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
