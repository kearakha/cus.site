import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { trackRatelimit } from "@/lib/ratelimit";

/**
 * POST /api/track
 *
 * Lightweight page view tracking endpoint.
 * Called from tenant templates via fire-and-forget fetch.
 *
 * Body: { bisnisId: string, path?: string, referrer?: string, type?: "view" | "wa_click" }
 *
 * No auth required — public endpoint, minimal data, no PII.
 * IP dipakai HANYA sebagai kunci rate limit, tidak pernah disimpan.
 *
 * Tiga lapis, karena endpoint ini terbuka untuk siapa pun:
 * 1. Rate limit per IP  → batasi volume
 * 2. Cek bentuk UUID    → tolak sampah tanpa nyentuh DB
 * 3. FK di DB (P2003)   → tolak bisnisId yang bentuknya benar tapi tidak ada
 */
export async function POST(req: NextRequest) {
  const ip = req.ip ?? req.headers.get("x-forwarded-for") ?? "unknown";

  // Fail-open: Redis tidak reachable (outage, env salah) jangan ikut mematikan
  // tracking. Sengaja beda dari login/verify/upload/AI yang fail-closed — di
  // sana gagal-terbuka berarti rate limit hilang di jalur sensitif. Di sini yang
  // hilang cuma perlindungan volume tabel analytics.
  const rlOk = await trackRatelimit
    .limit(ip)
    .then((r) => r.success)
    .catch(() => true);
  if (!rlOk) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const body = await req.json();
    const { bisnisId, path, referrer, type } = body;

    if (!z.string().uuid().safeParse(bisnisId).success) {
      return NextResponse.json({ error: "bisnisId required" }, { status: 400 });
    }

    await prisma.pageView.create({
      data: {
        bisnisId,
        path: typeof path === "string" ? path.slice(0, 500) : "/",
        referrer: typeof referrer === "string" ? referrer.slice(0, 500) : null,
        type: type === "wa_click" ? "wa_click" : "view",
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    // FK violation = bisnisId tidak ada. Salah client, bukan salah server.
    if ((err as { code?: string })?.code === "P2003") {
      return NextResponse.json({ error: "unknown bisnisId" }, { status: 400 });
    }
    // Sisanya ditelan — tracking tidak boleh merusak pengalaman pengunjung.
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
