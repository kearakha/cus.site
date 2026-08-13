/**
 * Cus.site — satu sumber kebenaran untuk root domain & parsing subdomain.
 *
 * File ini SENGAJA nol import (termasuk `next/*`) supaya:
 * - bisa dites di luar runtime Next (`tsx src/lib/domain.test.ts`)
 * - aman diimport client component (`NEXT_PUBLIC_*` di-inline saat build)
 *
 * Nama produk tetap "Cus.site" — yang tinggal di sini cuma HOST-nya.
 */

/**
 * Root domain app. Override via `NEXT_PUBLIC_ROOT_DOMAIN`.
 * Contoh nilai: "cus.kearakha.me" (prod), "localhost:3000" (dev).
 */
export const ROOT_DOMAIN = (
  process.env.NEXT_PUBLIC_ROOT_DOMAIN || "cus.kearakha.me"
).toLowerCase();

/**
 * True kalau kita nggak jalan di produksi beneran — dipakai untuk milih
 * `http://sub.localhost:3000` vs `https://sub.<root>`, dan cookie domain.
 */
export const IS_LOCAL =
  process.env.NODE_ENV !== "production" || ROOT_DOMAIN.endsWith(".localhost");

/**
 * Subdomain yang dicadangkan untuk app utama (marketing, dashboard, dll).
 * Tidak boleh jadi subdomain klien.
 */
export const RESERVED_SUBDOMAINS = new Set([
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

/** Pattern slug yang valid: lowercase, alphanumeric + dash, 3-32 char */
export const VALID_SLUG_PATTERN = /^[a-z0-9](?:[a-z0-9-]{1,30}[a-z0-9])?$/;

/**
 * Ambil slug tenant dari Host header. `null` = bukan tenant (marketing/dashboard).
 *
 * Ini security gate multi-tenant paling berbahaya di repo — `null` yang salah
 * jadi slug artinya request root domain kebaca sebagai tenant. Testnya ada di
 * `domain.test.ts`, jalanin `npm test` kalau nyentuh fungsi ini.
 *
 * `rootDomain` sengaja jadi parameter supaya test bisa uji beberapa root
 * (termasuk root nested seperti `cus.kearakha.me`) tanpa mock env.
 */
export function extractSubdomain(
  host: string,
  rootDomain: string = ROOT_DOMAIN,
): string | null {
  if (!host) return null;

  // 1. Buang port kalau ada (localhost:3000, vercel.app tidak ada port)
  const hostname = host.split(":")[0].toLowerCase().trim();
  const root = rootDomain.split(":")[0].toLowerCase().trim();

  // 2. Local dev → *.localhost (browser resolve otomatis ke 127.0.0.1)
  //    Contoh: kopisrawung.localhost
  if (hostname.endsWith(".localhost")) {
    const sub = hostname.slice(0, -".localhost".length);
    return sub && !RESERVED_SUBDOMAINS.has(sub) ? sub : null;
  }

  // 3. Production root domain
  //    Contoh: cus.kearakha.me, www.cus.kearakha.me → null (ke marketing)
  if (hostname === root) return null;
  if (hostname === `www.${root}`) return null;

  // 4. Production subdomain
  //    Contoh: kopisrawung.cus.kearakha.me
  if (hostname.endsWith(`.${root}`)) {
    const sub = hostname.slice(0, -root.length - 1);
    // Handle www.kopisrawung.cus.kearakha.me (edge case)
    const clean = sub.startsWith("www.") ? sub.slice(4) : sub;
    if (!clean || RESERVED_SUBDOMAINS.has(clean)) return null;
    return clean;
  }

  // 5. Vercel preview deployment
  //    Format preview: <project>-git-<branch>-<user>.vercel.app
  //    Domain default project sendiri (mis. cus-gold.vercel.app) BUKAN tenant
  //    — harus mengandung "-git-".
  if (hostname.endsWith(".vercel.app")) {
    const first = hostname.split(".")[0];
    if (!first.includes("-git-")) return null;
    const sub = first.split("-git-")[0];
    if (!sub || RESERVED_SUBDOMAINS.has(sub)) return null;
    return sub;
  }

  // Host asing (domain yang bukan milik kita) → bukan tenant.
  return null;
}

/**
 * URL publik root app. Dev → localhost:3000, prod → https://<root>.
 */
export function rootUrl(): string {
  return IS_LOCAL ? "http://localhost:3000" : `https://${ROOT_DOMAIN}`;
}

/**
 * URL publik satu tenant. Dev → http://<sub>.localhost:3000.
 */
export function tenantUrl(subdomain: string): string {
  return IS_LOCAL
    ? `http://${subdomain}.localhost:3000`
    : `https://${subdomain}.${ROOT_DOMAIN}`;
}

/**
 * Host tenant tanpa skema — buat label URL di UI ("kopisrawung.cus.kearakha.me").
 * Di dev ikut localhost supaya label yang kelihatan sama dengan link yang diklik.
 */
export function tenantHost(subdomain: string): string {
  return IS_LOCAL
    ? `${subdomain}.localhost:3000`
    : `${subdomain}.${ROOT_DOMAIN}`;
}
