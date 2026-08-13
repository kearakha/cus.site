import { NextRequest, NextResponse } from "next/server";
import { extractSubdomain, VALID_SLUG_PATTERN } from "@/lib/domain";

/**
 * Cus.site — Multi-Tenant Subdomain Middleware
 *
 * Bertugas:
 * 1. Deteksi hostname dari request (production + local dev + Vercel preview)
 * 2. Extract subdomain (slug bisnis) — contoh: "kopisrawung"
 * 3. Forward info via header `x-cus-subdomain` & `x-cus-host`
 * 4. Skip reserved subdomains (www, app, dashboard, dll) — biarkan ke main app
 *
 * CATATAN PENTING — Next.js routing:
 * Folder dengan prefix `_` di App Router adalah **private folder** (di-exclude
 * dari routing). Jadi kita TIDAK pakai `_sites/[domain]`.
 *
 * Sebagai gantinya, struktur folder:
 *   app/page.tsx            → /          (marketing landing)
 *   app/buat/page.tsx       → /buat      (wizard onboarding)
 *   app/t/[domain]/page.tsx → /t/[domain] (tenant — INTERNAL route, rewrite target)
 *
 * Kenapa `/t/[domain]` dan bukan `[domain]` di root atau `_sites/[domain]`?
 * - `_sites/[domain]` TIDAK jalan: folder dengan prefix `_` di App Router =
 *   **private folder**, di-exclude dari routing.
 * - `[domain]/page.tsx` di root bentrok dengan `/`, `/buat` (static segment
 *   menang, tapi routing logic jadi kacau dan akses `/kopisrawung` dari root
 *   domain akan masuk ke tenant page — bocor).
 * - `/t/[domain]` adalah prefix path internal yang:
 *   ✓ Tidak bisa diakses user dari root domain tanpa middleware rewrite
 *     (tenant page cek host header, return 404 kalau bukan dari subdomain)
 *   ✓ Clean, easy to debug
 *
 * Contoh flow:
 *   kopisrawung.<root>/        → rewrite → /t/kopisrawung        → tenant ✅
 *   kopisrawung.<root>/about   → rewrite → /t/kopisrawung/about  → tenant ✅
 *   <root>/                    → no rewrite → /                  → marketing ✅
 *   <root>/buat                → no rewrite → /buat              → wizard ✅
 *   <root>/t/kopisrawung       → no rewrite → /t/kopisrawung     → tenant 404
 *                                     (host header = <root>, bukan subdomain)
 *
 * ROOT_DOMAIN + extractSubdomain hidup di `src/lib/domain.ts` (satu sumber,
 * nol import Next, ada testnya).
 */

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const subdomain = extractSubdomain(host);

  // === Claim access: ?claim=<ownerToken> ===
  // Redirect ke API route yang handle validasi + set cookie + rotate token.
  // Logic di /api/auth/claim (bukan di middleware) supaya bisa query DB
  // dan atomic update ownerTokenUsedAt.
  const claimToken = request.nextUrl.searchParams.get("claim");
  if (claimToken) {
    const claimUrl = request.nextUrl.clone();
    claimUrl.pathname = "/api/auth/claim";
    claimUrl.search = `?token=${encodeURIComponent(claimToken)}`;
    return NextResponse.redirect(claimUrl, { status: 303 });
  }

  // Request dari subdomain bisnis → rewrite ke internal route /t/[domain]
  if (subdomain && VALID_SLUG_PATTERN.test(subdomain)) {
    const url = request.nextUrl.clone();

    // Normalize trailing slash supaya /about/ dan /about resolve ke path yang sama
    const cleanPath =
      url.pathname !== "/" ? url.pathname.replace(/\/+$/, "") : "/";

    // === API route dari host tenant: JANGAN di-rewrite ===
    // `/t/[[...slug]]` itu optional catch-all, jadi /api/track dari host tenant
    // ikut kena rewrite jadi /t/{sub}/api/track dan match page component itu.
    // Akibatnya POST /api/track balas 200 + HTML tenant page (bukan 405 — page
    // route tetap render), route handler-nya tidak pernah jalan, dan tiap
    // request bayar satu full page render. Ini yang bikin PageView selalu kosong.
    //
    // Subdomain tetap diteruskan sebagai REQUEST header supaya API route bisa
    // tau tenant asal request-nya.
    if (cleanPath.startsWith("/api/")) {
      const apiHeaders = new Headers(request.headers);
      apiHeaders.set("x-cus-subdomain", subdomain);
      apiHeaders.set("x-cus-host", host);
      return NextResponse.next({ request: { headers: apiHeaders } });
    }

    // sitemap.xml per tenant → API route (tidak bisa masuk [[...slug]])
    if (cleanPath === "/sitemap.xml") {
      url.pathname = "/api/sitemap";
    } else {
      url.pathname =
        cleanPath === "/" ? `/t/${subdomain}` : `/t/${subdomain}${cleanPath}`;
    }

    const response = NextResponse.rewrite(url);
    response.headers.set("x-cus-subdomain", subdomain);
    response.headers.set("x-cus-host", host);
    return response;
  }

  // Bukan subdomain → lanjut normal, forward host header
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-cus-host", host);
  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  /**
   * Matcher: jalankan di SEMUA path KECUALI:
   * - _next/static, _next/image (aset Next.js)
   * - favicon, robots.txt (tapi BUKAN sitemap.xml — tenant perlu sitemap per subdomain)
   * - File dengan ekstensi (gambar, css, js) → biar Vercel CDN serve langsung
   *
   * PENTING: jangan exclude `/api`, karena nanti API kita butuh tau subdomain juga.
   * sitemap.xml sengaja tidak di-exclude supaya subdomain.<root>/sitemap.xml bisa
   * di-rewrite ke /t/[subdomain]/sitemap.xml (tenant sitemap).
   */
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|robots\\.txt|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|css|js|map|woff|woff2)$).*)",
  ],
};
