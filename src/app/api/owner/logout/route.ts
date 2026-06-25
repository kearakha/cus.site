import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { OWNER_COOKIE_NAME } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * POST /api/owner/logout
 *
 * Dipanggil via form submit dari:
 * - Floating Admin Bar (di tenant page)
 * - Top nav dashboard
 *
 * Hapus cookie owner, redirect ke landing page.
 */
export async function POST(request: NextRequest) {
  cookies().delete(OWNER_COOKIE_NAME);

  const origin = request.nextUrl.origin;
  return NextResponse.redirect(new URL("/", origin), {
    status: 303, // See Other (rekomendasi untuk POST → GET redirect)
  });
}
