---
created: 2026-09-12
tags: [design-system, cus-site, landing]
status: active
---

# Design System — Landing Cus.site

> Sumber kebenaran visual untuk landing (`src/app/page.tsx`). Tenant site punya
> branding sendiri per-bisnis dan **tidak** tunduk ke file ini. Token di sini
> dipetakan 1:1 ke `tailwind.config.ts` — kalau beda, file ini yang benar.

Preview interaktif thesis: https://claude.ai/code/artifact/b0e5be53-a65a-49a6-b971-5df4204cc7c2

---

## Thesis

**Visual.** Terang dan editorial ala Stripe/Resend: body cream hangat dengan
whitespace lega, tipografi sans tebal-kontras, orange sebagai permukaan penuh di
minimal satu section, navy sebagai section gelap penyeimbang, komponen rounded
sedang ber-border tipis, dan mockup browser mac ber-shadow dalam sebagai bintang
tiap section — bukan icon.

**Interaction.** Motion medium (250–400ms) dengan ease-out tajam tanpa
overshoot; hover = lift 4px + shadow naik; scroll = reveal fade-up 24px dengan
stagger 80ms, dipicu sekali lalu diam; template switcher crossfade 300ms.

**Dilarang:** bounce / spring overshoot · loop tanpa henti (floating, pulsing,
marquee) · parallax ikut mouse · animasi `width`/`height` (cuma `transform` +
`opacity`).

---

## Warna

| Token | Hex | Tailwind | Peran |
|---|---|---|---|
| cream | `#FBF7F0` | `bg-cream` | Ground body landing |
| white | `#FFFFFF` | `bg-white` | Surface kartu, mockup |
| navy | `#0F172A` | `text-navy` `bg-navy` | Ink utama, section gelap, footer |
| navy-2 | `#1E293B` | `bg-navy-2` | Surface di atas navy |
| orange | `#F59E0B` | `bg-orange` | Brand. **Dikunci ke titik logo** (`amber-500`). CTA primary, blok permukaan |
| orange-deep | `#D97706` | `text-orange-deep` | Hover CTA, teks aksen **besar** (≥24px bold) di cream — 3.0:1, gagal untuk teks kecil |
| orange-tint | `#FEF3C7` | `bg-orange-tint` | Badge, highlight lembut |
| ink-2 | `#5C5548` | `text-ink-2` | Body muted (warm, bukan slate) |
| ink-3 | `#8A8275` | `text-ink-3` | Caption, label mono |
| line | `#E8E0D2` | `border-line` | Border 1px warm |
| on-navy-muted | `#CBD5E1` | `text-slate-300` | Body di atas navy |

**Pasangan yang lolos (WCAG AA 4.5:1):** navy/cream 16.7 · ink-2/cream 6.9 ·
orange-deep/cream 3.0 (**large text only**) · navy/orange 8.3 · white/navy 17.9 ·
slate-300/navy 12.0 · orange/navy 8.3. ink-3/cream 3.6 → **cuma untuk caption ≥18px atau label mono non-esensial**.

**Pasangan yang gagal — jangan dipakai:** putih di atas orange (2.1:1). Teks di
blok orange selalu navy.

---

## Tipografi

Dua-duanya sudah ada di project (dipakai tenant), tidak ada font baru.

| Peran | Font | Tailwind | Weight | Size / LH | Tracking |
|---|---|---|---|---|---|
| display (h1) | Plus Jakarta Sans | `font-display` | 800 | `clamp(2.5rem, 4vw + 1rem, 4rem)` / 1.05 | -0.02em |
| h2 | Plus Jakarta Sans | `font-display` | 700 | 36px / 1.15 | -0.02em |
| h3 | Plus Jakarta Sans | `font-display` | 700 | 20px / 1.3 | -0.01em |
| lead | Inter | `font-body` | 400 | 20px / 1.5 | 0 |
| body | Inter | `font-body` | 400 | 16px / 1.6 | 0 |
| small | Inter | `font-body` | 400 | 14px / 1.5 | 0 |
| eyebrow | Inter | `font-body` | 600 | 12px caps | +0.08em |
| mono | ui-monospace | `font-mono` | 400 | 13px | 0 |

Lebar baris body maks ~60ch. Heading pakai `text-wrap: balance`.

---

## Spacing

Base 4px. Skala: 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128.

- Section vertical: 96px (`py-24`), hero dan CTA 128px (`py-32`)
- Container: `max-w-6xl` (1152px), gutter `px-6`
- Gap grid: 24px (`gap-6`), gap bento 16px (`gap-4`)
- Kartu padding: 24px (`p-6`), band besar 56px (`p-14`)

---

## Radius

| Token | px | Tailwind | Dipakai di |
|---|---|---|---|
| sm | 8 | `rounded-lg` | Chip, thumbnail kecil |
| md | 12 | `rounded-xl` | Mockup browser |
| lg | 16 | `rounded-2xl` | Kartu |
| xl | 24 | `rounded-3xl` | Band orange / navy |
| full | — | `rounded-full` | Tombol, badge, tab |

---

## Shadow

| Token | Tailwind | Value |
|---|---|---|
| card (rest) | `shadow-card` | `0 1px 2px rgba(15,23,42,.04)` |
| card (hover) | `shadow-card-hover` | `0 12px 32px -8px rgba(15,23,42,.16)` |
| mockup | `shadow-mockup` | 3 lapis: `0 1px 2px .06` + `0 12px 32px -8px .12` + `0 40px 80px -24px .28` |

Kartu saat diam nyaris tanpa shadow — border yang memisahkan. Shadow baru
muncul saat hover. Mockup selalu shadow penuh.

---

## Komponen

**Tombol primary** — `bg-orange text-navy rounded-full font-semibold px-6 py-3`.
Hover: `translateY(-4px)` + shadow orange, 200ms. Active: `bg-orange-deep`,
translate 0. Focus: ring navy 2px offset 3px. Disabled: `bg-line text-ink-3`.

**Tombol secondary** — `border border-navy text-navy rounded-full`. Hover: fill
navy, teks putih, lift 4px.

**Tombol di blok orange** — `bg-navy text-white`. Hover lift + shadow navy.

**Kartu** — `bg-white border border-line rounded-2xl p-6 shadow-card`. Hover:
lift 4px + `shadow-card-hover`. Kalau kartu bisa diklik: `cursor-pointer`.

**Mockup browser** — `bg-white rounded-xl overflow-hidden shadow-mockup`, bar
34px `#F3EEE5` dengan 3 titik (`#FF5F57` `#FEBC2E` `#28C840`) + URL bar mono.
Isi: `next/image` screenshot tenant asli, bukan ilustrasi.

**Tab switcher** — container `bg-cream border border-line rounded-full p-1`, tab
aktif `bg-navy text-white`, `role="tablist"` + `aria-selected`.

Semua elemen interaktif: 5 state (default, hover, focus, active, disabled), target
sentuh min 44px, `cursor-pointer`.

---

## Motion

| Token | Value | Tailwind |
|---|---|---|
| easing | `cubic-bezier(0.22, 1, 0.36, 1)` | `ease-out` (override) · Framer `ease: [0.22, 1, 0.36, 1]` |
| hover | 200ms | `duration-200` |
| reveal | 350ms | `transition={{ duration: 0.35 }}` |
| crossfade | 300ms | `duration: 0.3` |
| hero entrance | 450ms | `duration: 0.45` |
| stagger | 80ms | `staggerChildren: 0.08` |
| reveal distance | 24px ↑ | `initial={{ y: 24 }}` |
| hover lift | 4px ↑ | `hover:-translate-y-1` |
| trigger | sekali, 20% masuk viewport | `viewport={{ once: true, amount: 0.2 }}` |

**Reduced motion** (`prefers-reduced-motion: reduce` via `useReducedMotion()`):
tanpa translate, tanpa stagger, cuma fade 150ms. Hover lift jadi 0.

Halaman **tidak boleh** parkir di `opacity: 0` menunggu observer untuk konten
above-the-fold — hero animate dari state terlihat.

---

## Struktur landing

Pola: *Product Demo + Features* — hero → mockup produk → fitur per section → CTA.

1. Header — logo (tidak diubah), nav, CTA orange pill
2. Hero — teks kiri, mockup mac tenant asli kanan, entrance stagger
3. 3 langkah — baris bergantian kiri/kanan, tiap baris ada visual
4. Template switcher — tab vibe → crossfade mockup
5. Features — bento, 1 besar + 5 kecil
6. CTA — blok orange, teks navy
7. Footer — navy

Nomor urut (01/02/03) hanya di "3 langkah" karena itu memang urutan. Tidak ada
emoji sebagai icon; icon dari `lucide-react`.
