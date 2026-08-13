/**
 * Test untuk `extractSubdomain` — security gate multi-tenant.
 *
 * Jalankan: `npm test` (tsx, nol framework, nol dependency baru).
 *
 * Kenapa cuma fungsi ini yang dites: dia satu-satunya tempat di repo yang
 * memutuskan "request ini tenant siapa" dari input yang dikontrol penyerang
 * (Host header). Salah di sini = kebocoran antar-tenant. Sisanya bukan
 * prioritas — lihat `.docs/PRD.md` §6 Non-Goals.
 */
import assert from "node:assert/strict";
import { extractSubdomain, RESERVED_SUBDOMAINS } from "./domain";

const ROOT = "cus.kearakha.me"; // root nested — bentuk yang dipakai produksi
const cases: [string, string, string | null][] = [
  // --- root domain → marketing, bukan tenant ---
  ["root domain telanjang", ROOT, null],
  ["www di root domain", `www.${ROOT}`, null],

  // --- tenant normal ---
  ["subdomain tenant", `kopisrawung.${ROOT}`, "kopisrawung"],
  ["slug pakai dash", `sari-kopi.${ROOT}`, "sari-kopi"],
  // Regression: slice off-by-one dulu motong huruf terakhir slug
  // ("kopisrawung" → "kopisrawun"). Kasus di atas + ini yang jagain.
  ["huruf terakhir slug utuh", `abcdefghij.${ROOT}`, "abcdefghij"],
  ["www di depan tenant", `www.kopisrawung.${ROOT}`, "kopisrawung"],

  // --- reserved → nggak boleh jadi tenant ---
  ["reserved: dashboard", `dashboard.${ROOT}`, null],
  ["reserved: api", `api.${ROOT}`, null],
  ["reserved: buat", `buat.${ROOT}`, null],
  ["reserved: cus (anti self-loop)", `cus.${ROOT}`, null],

  // --- normalisasi input ---
  ["host uppercase", `KopiSrawung.${ROOT.toUpperCase()}`, "kopisrawung"],
  ["host dengan port", `kopisrawung.${ROOT}:3000`, "kopisrawung"],

  // --- local dev ---
  ["*.localhost", "kopisrawung.localhost", "kopisrawung"],
  ["*.localhost dengan port", "kopisrawung.localhost:3000", "kopisrawung"],
  ["localhost telanjang", "localhost:3000", null],
  ["reserved di localhost", "dashboard.localhost", null],

  // --- Vercel ---
  // Regression guard commit c2fc42b: domain default project BUKAN tenant.
  ["vercel.app tanpa -git-", "cus-gold.vercel.app", null],
  ["vercel.app root", "vercel.app", null],
  [
    "vercel preview dengan -git-",
    "kopisrawung-git-main-rakha.vercel.app",
    "kopisrawung",
  ],

  // --- host asing / kosong ---
  ["host kosong", "", null],
  // Regression guard Langkah 1: fallback host 2-segmen sudah dibuang, jadi
  // domain orang lain nggak boleh kebaca sebagai tenant.
  ["host 2-segmen asing", "kopisrawung.com", null],
  ["host asing 3-segmen", "kopisrawung.example.co", null],
];

let failed = 0;
for (const [name, host, expected] of cases) {
  try {
    assert.equal(extractSubdomain(host, ROOT), expected);
    console.log(`  ok   ${name}`);
  } catch (e) {
    failed++;
    console.error(`  FAIL ${name} — host=${JSON.stringify(host)}`);
    console.error(`       ${(e as Error).message.split("\n")[0]}`);
  }
}

// Root domain flat (cus.site / example.com) harus tetap jalan — parameter
// rootDomain memang dibikin supaya ganti domain nggak butuh ubah kode.
assert.equal(
  extractSubdomain("kopisrawung.example.com", "example.com"),
  "kopisrawung",
);
assert.equal(extractSubdomain("example.com", "example.com"), null);

// Reserved list nggak boleh kosong — kalau ke-drop waktu refactor, semua
// subdomain app (dashboard, api) bakal kebaca sebagai tenant.
assert.ok(RESERVED_SUBDOMAINS.size > 10);

if (failed > 0) {
  console.error(`\n${failed} test gagal`);
  process.exit(1);
}
console.log(`\n${cases.length} test lolos`);
