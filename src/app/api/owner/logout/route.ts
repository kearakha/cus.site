import { NextRequest, NextResponse } from "next/server";
import { clearSessionCookies } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * POST /api/owner/logout
 *
 * Dipanggil via form submit dari:
 * - Floating Admin Bar (di tenant page)
 * - Top nav dashboard
 *
 * Hapus cookie owner + session, redirect ke landing page.
 */
export async function POST(request: NextRequest) {
  clearSessionCookies();

  const origin = request.nextUrl.origin;
  return NextResponse.redirect(new URL("/", origin), {
    status: 303, // See Other (rekomendasi untuk POST → GET redirect)
  });
}
