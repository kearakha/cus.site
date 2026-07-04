import { NextRequest, NextResponse } from "next/server";

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
 *   kopisrawung.cus.site/        → rewrite → /t/kopisrawung        → tenant ✅
 *   kopisrawung.cus.site/about   → rewrite → /t/kopisrawung/about  → tenant ✅
 *   cus.site/                    → no rewrite → /                  → marketing ✅
 *   cus.site/buat                → no rewrite → /buat              → wizard ✅
 *   cus.site/t/kopisrawung       → no rewrite → /t/kopisrawung     → tenant 404
 *                                     (host header = cus.site, bukan subdomain)
 */

// Root domain bisa di-override via env. Default = production domain.
const ROOT_DOMAIN = (
  process.env.NEXT_PUBLIC_ROOT_DOMAIN || "cus.site"
).toLowerCase();

// Subdomain yang dicadangkan untuk app utama (marketing, dashboard, dll).
// Tidak boleh jadi subdomain klien.
const RESERVED_SUBDOMAINS = new Set([
  "www",
  "app",
  "dashboard",
  "admin",
  "api",
  "auth",
  "login",
  "signup",
  "buat", // route wizard onboarding
  "static",
  "assets",
  "cdn",
  "mail",
  "blog",
  "docs",
  "help",
  "status",
  "preview",
  "staging",
  "test",
  "demo",
  "cus", // anti self-loop
]);

// Pattern slug yang valid: lowercase, alphanumeric + dash, 3-32 char
const VALID_SLUG_PATTERN = /^[a-z0-9](?:[a-z0-9-]{1,30}[a-z0-9])?$/;

function extractSubdomain(host: string): string | null {
  if (!host) return null;

  // 1. Buang port kalau ada (localhost:3000, vercel.app tidak ada port)
  const hostname = host.split(":")[0].toLowerCase().trim();

  // 2. Local dev → *.localhost (browser resolve otomatis ke 127.0.0.1)
  //    Contoh: kopisrawung.localhost
  if (hostname.endsWith(".localhost")) {
    const sub = hostname.slice(0, -".localhost".length);
    return sub && !RESERVED_SUBDOMAINS.has(sub) ? sub : null;
  }

  // 3. Production root domain
  //    Contoh: cus.site, www.cus.site → return null (ke marketing)
  if (hostname === ROOT_DOMAIN) return null;
  if (hostname === `www.${ROOT_DOMAIN}`) return null;

  // 4. Production subdomain
  //    Contoh: kopisrawung.cus.site
  if (hostname.endsWith(`.${ROOT_DOMAIN}`)) {
    const sub = hostname.slice(0, -`.${ROOT_DOMAIN}`.length - 1);
    // Handle www.kopisrawung.cus.site (edge case)
    const clean = sub.startsWith("www.") ? sub.slice(4) : sub;
    if (!clean || RESERVED_SUBDOMAINS.has(clean)) return null;
    return clean;
  }

  // 5. Vercel preview / production deployment
  //    Contoh: cus-site.vercel.app, kopisrawung-git-main-rakha.vercel.app
  if (hostname.endsWith(".vercel.app")) {
    const parts = hostname.split(".");
    // Ambil segment pertama. Vercel format: <project>-git-<branch>-<user>.vercel.app
    const first = parts[0];
    // Kalau cuma project utama (no subdomain), biarkan
    if (first === hostname) return null;
    // Strip suffix khas Vercel ("-git-main-xxx")
    const sub = first.split("-git-")[0];
    if (!sub || RESERVED_SUBDOMAINS.has(sub)) return null;
    return sub;
  }

  // 6. Custom domain klien (kalau nanti ditambahin) — fallback
  //    Kita anggap hostname = subdomain kalau ia 2 segment (sub.tld)
  const segments = hostname.split(".");
  if (segments.length === 2) {
    const sub = segments[0];
    if (!sub || RESERVED_SUBDOMAINS.has(sub)) return null;
    return sub;
  }

  return null;
}

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
   * sitemap.xml sengaja tidak di-exclude supaya subdomain.cus.site/sitemap.xml bisa
   * di-rewrite ke /t/[subdomain]/sitemap.xml (tenant sitemap).
   */
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|robots\\.txt|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|css|js|map|woff|woff2)$).*)",
  ],
};
