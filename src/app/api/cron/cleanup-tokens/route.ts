import { NextRequest, NextResponse } from "next/server";
import { cleanupLoginTokens } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/cron/cleanup-tokens
 * Hapus LoginToken yang sudah expired atau used. Dijadwalkan via Vercel Cron (03:00 UTC).
 * Dilindungi CRON_SECRET — Vercel inject header Authorization: Bearer <secret> otomatis.
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const deleted = await cleanupLoginTokens();
  return NextResponse.json({ deleted, timestamp: new Date().toISOString() });
}
