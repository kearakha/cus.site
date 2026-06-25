import { NextRequest, NextResponse } from "next/server";
import { verifyLoginToken, setSessionEmail } from "@/lib/auth";
import { verifyRatelimit } from "@/lib/ratelimit";

/**
 * GET /api/auth/verify?token=<raw>
 *
 * Magic link callback. User klik link dari email → masuk sini.
 *
 * Flow:
 * 1. Ambil token dari query
 * 2. Hash → lookup di LoginToken table
 * 3. Validasi: not used, not expired
 * 4. Set session cookie (cus_session = email)
 * 5. Mark token as used
 * 6. Redirect ke /dashboard
 *
 * Kalau token invalid → redirect ke /login?error=invalid
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const ip = request.ip ?? request.headers.get("x-forwarded-for") ?? "unknown";
  const { success: rlOk } = await verifyRatelimit.limit(ip);
  if (!rlOk) {
    return NextResponse.redirect(
      new URL("/login?error=too_many_requests", request.url),
    );
  }

  const token = request.nextUrl.searchParams.get("token");
  const redirectTo =
    request.nextUrl.searchParams.get("redirect") || "/dashboard";

  if (!token) {
    return NextResponse.redirect(
      new URL("/login?error=missing_token", request.url),
    );
  }

  const result = await verifyLoginToken(token);

  if (!result) {
    return NextResponse.redirect(
      new URL("/login?error=invalid_or_expired", request.url),
    );
  }

  setSessionEmail(result.email);

  // Sanitize redirect target — pastikan path internal saja
  const safePath =
    redirectTo.startsWith("/") && !redirectTo.startsWith("//")
      ? redirectTo
      : "/dashboard";

  return NextResponse.redirect(new URL(safePath, request.url), { status: 303 });
}
