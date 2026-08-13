---
created: 2026-08-11
tags: [prd, cus-site, scope]
status: in-progress
---

# PRD — Cus.site

> Ditulis retroaktif (kode dulu, dokumen belakangan) dengan satu tujuan:
> menentukan **apakah MVP sudah selesai** dan **di mana batas project ini**.

---

## 1. Masalah

UMKM Indonesia butuh kehadiran online, tapi:

- Bikin website = mahal (jasa Rp 1–5 jt) atau ribet (Wix/WordPress butuh belajar).
- Instagram/WhatsApp saja tidak punya alamat permanen yang bisa dishare & di-Google.
- Yang paling bikin mandek bukan teknis — tapi **nulis konten**. "Isi 'Tentang Kami' apa ya?"

## 2. Solusi

Isi form 5 langkah → AI nulis semua copywriting → website langsung live di
`namabisnis.cus.site`. Tanpa login, tanpa bayar, tanpa mikir konten.

**One-liner:** Website UMKM jadi dalam 3 menit, kontennya ditulis AI.

## 3. Persona

| | Bu Sari (primary) | Rakha (secondary — pemilik repo) |
|---|---|---|
| Siapa | Pemilik warung kopi, 38 th, HP Android, non-teknis | Yang bikin |
| Butuh | Link buat dipasang di bio IG, biar pesanan masuk WA | Bukti kemampuan fullstack + AI integration |
| Sukses kalau | Punya link yang bisa dishare, pesanan WA naik | Project ini enak dilihat recruiter & bisa dijelaskan 5 menit |

Persona kedua ini **bukan basa-basi** — dia yang menentukan batas project (lihat §8).

## 4. MVP — Core Loop

Satu loop yang harus jalan tanpa putus:

```
Bu Sari buka cus.site
  → /buat, isi 5 step (nama, kontak, vibe, layanan, subdomain)
  → AI generate copy + geocode alamat  (parallel)
  → website live di sari-kopi.cus.site
  → email welcome masuk, ada link akses
  → klik link → /dashboard → bisa edit & regenerate
  → pengunjung datang → klik tombol WA → chat masuk
  → Bu Sari lihat jumlah view di dashboard
```

Kalau satu mata rantai putus, MVP tidak selesai. Kalau semua jalan, MVP selesai —
apa pun yang belum ada di backlog.

## 5. Requirement & Status

Skala: ✅ selesai · 🟡 sebagian · ❌ belum

### 5.1 Must-have (MVP tidak sah tanpa ini)

| # | Requirement | Status | Bukti / catatan |
|---|---|---|---|
| M1 | Wizard onboarding tanpa login | ✅ | `(marketing)/buat` — 5 step, draft ke sessionStorage, validasi Zod inline |
| M2 | AI generate copy dari input minimal | ✅ | `lib/openai.ts` — Structured Outputs + fallback JSON parse, post-validation anti-placeholder |
| M3 | Website live di subdomain sendiri | ✅ | `middleware.ts` → rewrite `/t/[domain]`, 5 security gate di tenant page |
| M4 | Owner bisa akses balik & edit | ✅ | Magic link (SHA-256 hash, 15 mnt) + owner claim one-time + rotate token |
| M5 | Tombol WhatsApp yang jalan | ✅ | `WaLink.tsx` — nomor dinormalisasi saat save |
| M6 | Tenant bisa dimatikan tanpa hapus data | ✅ | `published` boolean + toggle di dashboard + gate di render |
| M7 | Upload gambar (logo, cover, produk) | ✅ | Vercel Blob, validasi 5 MB |
| M8 | **Verifikasi produksi end-to-end** | ❌ | **Belum ada bukti satu orang asing berhasil sampai website live.** Ini satu-satunya must-have yang bolong. |

### 5.2 Should-have (bikin terasa produk, bukan demo)

| # | Requirement | Status | Catatan |
|---|---|---|---|
| S1 | SEO per tenant | ✅ | Metadata dinamis, OG image `/api/og`, sitemap per subdomain, robots.txt, JSON-LD LocalBusiness |
| S2 | Analytics per tenant | ✅ | `PageView` + `/api/track` (rate-limited, FK-validated) + widget views/referrer/klik-WA |
| S3 | Variasi template | ✅ | 5 vibe: Casual, Professional, Elegant, Bold, Minimal |
| S4 | Regenerate AI per section | ✅ | `regenerateAIContentAction` |
| S5 | Jam operasional + peta | ✅ | `OperatingHours`, `MapEmbed` (Nominatim) |
| S6 | Social links | ✅ | IG, TikTok, FB, YouTube |
| S7 | Polish UX | ✅ | Toast, skeleton, empty state, dark mode dashboard, 404/500, error boundary, a11y skip-link |
| S8 | Testimoni | ✅ | Generate AI, 3 item, disimpan JSON |

### 5.3 Backlog yang masih terbuka

| # | Item | Status | Verdict |
|---|---|---|---|
| B1 | Custom domain per tenant | ❌ | Field `customDomain` ada di schema tapi **nol pemakaian di `src/`**. Middleware punya fallback naif (hostname 2 segmen → segmen pertama dianggap subdomain), bukan lookup DB. → **dead code, harus dibereskan atau dibuang** |
| B2 | Draft vs Published sesungguhnya | 🟡 | Yang ada cuma publish/unpublish. Edit tetap langsung live. Draft content = fitur baru, bukan penyelesaian |
| B3 | AI tone selector | 🟡 | Sudah tercakup `vibe` — tone terpisah = duplikasi knob |
| B4 | AI streaming | ❌ | UX nicety. Generate sekali ~10 s, spinner cukup |
| B5 | AI alt-text | ❌ | **Tidak perlu** — alt sudah deterministik dari nama produk/bisnis, lebih akurat dari AI |
| B6 | AI product description per item | 🟡 | Sudah di-enhance saat generate awal; tombol per-produk = nicety |
| B7 | Monetisasi (paket, pembayaran) | ❌ | Belum ada sama sekali |
| B8 | Test otomatis | ❌ | **Nol test.** Tidak ada framework test terpasang |

## 6. Non-Goals (eksplisit TIDAK dikerjakan)

Ini bukan "nanti", ini "tidak".

- **Multi-halaman per tenant** — one-pager itu pilihan desain, bukan keterbatasan. UMKM tidak punya konten untuk 5 halaman.
- **Editor visual / drag-drop** — kalau owner mau atur layout, dia bukan target user.
- **Toko online (cart, checkout, stok)** — pesanan lewat WhatsApp. Ini bukan Shopify.
- **Multi-user per bisnis (role & permission)** — satu UMKM = satu owner.
- **Ganti template setelah live** — bisa saja, tapi tidak ada yang minta.
- **i18n** — pasar Indonesia, bahasa Indonesia.

## 7. Defect yang tersisa (bukan fitur — utang)

| | Defect | Dampak | Effort |
|---|---|---|---|
| D1 | `customDomain` dead field + middleware fallback 2-segmen yang bukan lookup DB | Schema bohong soal kemampuan app; fallback bisa salah-routing domain asing | S — hapus fallback + field, atau selesaikan B1 |
| D2 | `/t/[[...slug]]` tidak validasi panjang slug → `sari-kopi.cus.site/apa-aja` render homepage dengan status 200 | Seharusnya 404. Canonical sudah menunjuk root jadi SEO aman, tapi tetap salah | XS — `if (slug.length > 1) notFound()` |
| D3 | Branch `fix/track-endpoint-dan-next-image` belum di-merge; `main` terakhir 28 Jul | Fitur analytics terbaru belum live di produksi | XS — PR (manual) |
| D4 | 10 branch lokal `push-jul14..23` nyangkut | Noise | XS |
| D5 | Nol test — tidak ada satu pun pengaman untuk `middleware.extractSubdomain()`, padahal itu fungsi paling berbahaya di repo (security gate multi-tenant) | Refactor middleware = main tebak-tebakan | S — 1 file test buat `extractSubdomain` saja |

## 8. Batas Project — keputusan yang harus diambil

Pertanyaannya bukan "fiturnya sudah lengkap belum" (jawabannya: **lebih dari
lengkap**). Pertanyaannya: **project ini untuk apa?** Ada tiga jawaban dan
ketiganya saling mengunci.

### Kenyataan yang perlu diakui dulu

`plan/Github-Sustainability-Plan.md` menyatakan tujuan sebenarnya dari ~80 commit
terakhir: **1 commit bermakna per hari untuk streak GitHub**. Itu berhasil — dan
efek sampingnya kelihatan jelas di §5.2: 5 template (MVP butuh 1), dark mode
dashboard, widget top-referrer, OG image dinamis, testimoni AI, galeri 5 foto per
produk. Semuanya rapi. **Tidak satu pun berasal dari permintaan pengguna, karena
belum ada pengguna.**

Jadi status jujurnya: **kode sudah melewati garis MVP, tapi produk belum pernah
menyentuh garis start.** Satu-satunya must-have yang bolong (M8) justru satu-satunya
yang tidak bisa diselesaikan dengan nulis kode.

### Tiga jalur

**Jalur A — Portfolio piece. Selesaikan, lalu freeze.** ← rekomendasi

Anggap ini karya jadi, bukan produk hidup. Yang tersisa cuma:

1. D3 (merge branch) + D2 + D1 → repo tidak bohong lagi
2. D5 → satu file test untuk `extractSubdomain` (fungsi security multi-tenant)
3. M8 → deploy, bikin 1 tenant nyata dari nol di produksi, verifikasi email + AI + wildcard subdomain jalan, screenshot
4. README: screenshot hero + tenant + dashboard, dan **satu paragraf arsitektur** yang bisa dibaca recruiter 60 detik

**~2–3 hari kerja. Setelah itu STOP.** Tulis "Status: feature-complete for MVP
scope" di README. Project ini akan lebih meyakinkan sebagai sesuatu yang **selesai
dan berbatas** daripada sesuatu yang terus tumbuh tanpa arah.

**Jalur B — Produk nyata untuk UMKM.**

Kalau ini pilihannya, bagian tersulit belum dimulai, dan **bukan koding**: cari 5
UMKM yang mau pakai. Baru setelah ada pengguna, backlog jadi punya arti — dan
kemungkinan besar yang mereka minta bukan streaming AI atau custom domain, tapi
hal-hal yang belum kepikiran sama sekali. Monetisasi (B7) juga baru relevan di sini.

Jangan ambil jalur ini kalau tidak siap jualan. Menambah fitur "supaya siap
dipakai UMKM" tanpa UMKM = jalur C yang menyamar.

**Jalur C — Terus jadi mesin streak.**

Sah, tapi biayanya nyata: tiap fitur menambah permukaan bug pada kode yang tidak
punya test dan tidak punya pengguna. Kalau streak-nya yang penting (dan itu wajar),
**pindahkan ke Bagian B/C di plan** — `vesta` revive, atau project baru dari daftar.
Streak tetap hijau, cus-site tetap bersih dan selesai.

### Rekomendasi

**Jalur A.** Habiskan §7 (semuanya kecil), tuntaskan M8, freeze. Pindahkan streak
ke project lain. Kalau nanti benar-benar ada UMKM yang mau pakai, unfreeze — tapi
biarkan permintaan datang dari mereka, bukan dari backlog yang kita karang sendiri.

## 9. Definition of Done (Jalur A)

Ceklis. Kalau semua tercentang, project ini **selesai** dan boleh ditinggal.

- [ ] Branch analytics di-merge ke `main` (PR manual)
- [ ] D1: `customDomain` + fallback middleware dibuang (atau B1 diselesaikan penuh)
- [ ] D2: `slug.length > 1` → 404
- [ ] D5: satu file test untuk `extractSubdomain()`
- [ ] Cabang `push-jul*` dibersihkan
- [ ] Deploy produksi: bikin 1 tenant baru dari nol, verifikasi — website live di wildcard subdomain, welcome email masuk, AI generate berhasil, dashboard bisa edit, klik WA tercatat
- [ ] README: 3 screenshot + paragraf arsitektur
- [ ] README: badge/baris "Status: MVP feature-complete — scope dibekukan, lihat `.docs/PRD.md` §6 Non-Goals"

**Tidak masuk DoD:** monetisasi, custom domain, streaming, draft state, test coverage
menyeluruh. Itu Jalur B, dan Jalur B mulainya dari mencari pengguna — bukan dari sini.
