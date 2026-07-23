# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Cus.site** — Generator website instan untuk UMKM Indonesia. Multi-tenant via wildcard subdomain (`*.cus.site`). Stack: Next.js 14 App Router + Prisma + PostgreSQL + OpenAI-compatible API.

## Commands

```bash
npm run dev           # Dev server
npm run build         # Production build
npm run lint          # ESLint

npm run db:generate   # npx prisma generate
npm run db:push       # Push schema ke DB (dev)
npm run db:migrate    # Create migration
npm run db:studio     # Prisma Studio GUI

npx tsx scripts/test-ai.ts  # Test AI generation langsung
```

## Architecture

### Multi-Tenant Routing

```
Request → src/middleware.ts
  ├─ Extract subdomain dari Host header
  ├─ Reserved subdomains → skip (marketing/dashboard tetap jalan)
  └─ Rewrite ke /t/[domain]/... (internal route, bukan folder _sites)
       ↓
src/app/t/[[...slug]]/page.tsx
  ├─ Server component
  ├─ Query Prisma: Bisnis + KontenWebsite + Layanan
  └─ Render via TemplateRenderer (pilih template sesuai `vibe`)
```

**Kenapa `/t/[domain]` bukan `_sites/[domain]`?** Folder prefix `_` di App Router = private, di-exclude dari routing. Route `/t/[domain]` tidak bisa diakses user dari root domain tanpa middleware rewrite — tenant page cek host header, return 404 kalau bukan dari subdomain.

### Data Model (Prisma)

- `Bisnis` — akun utama UMKM. `subdomain` = unique identifier.
- `KontenWebsite` — hasil generate AI (1:1 dengan `Bisnis`). Field: `heroHeadline`, `heroSubtext`, `aboutParagraph`, `ctaText`, `seoTitle`, `seoDescription`, `accentColor`, dan services (via `Layanan`).
- `Layanan` — produk/layanan yang ditampilkan. Multiple per `Bisnis`, ordered by `order`.
- `LoginToken` — magic link token. SHA-256 hash disimpan di DB, raw token hanya di email. Expiry 15 menit.

### Auth (src/lib/auth.ts)

Dua alur auth:
1. **Magic link login** → `/login` → POST server action → `generateLoginToken()` → email → `/api/auth/verify?token=...` → set `cus_session` cookie → `/dashboard`
2. **Owner claim** (one-time) → link di welcome email → middleware redirect ke `/api/auth/claim?token=...` → `claimOwnerToken()` atomic update (check `ownerTokenUsedAt IS NULL`) → rotate token → set cookies → `/dashboard?welcome=1`

Token lama permanent invalid setelah claim. Dev mode tanpa `RESEND_API_KEY`: magic link di-log ke terminal.

### AI Generation (src/lib/openai.ts)

OpenAI-compatible client. Default model: `MiniMax-M3` (override via `OPENAI_MODEL`). Base URL override via `OPENAI_BASE_URL` (support TokenRouter, OpenRouter, dll).

Dua mode dengan auto-fallback:
1. **Structured Outputs** (preferred) — `response_format: zodSchema`, output dijamin match Zod schema
2. **JSON prompt + manual parse** (fallback) — aktif jika model gak support Structured Outputs (400 error) atau response bukan JSON valid

Output schema (`kontenAISchema`): heroHeadline, heroSubtext, aboutParagraph, ctaText, seoTitle, seoDescription, accentColor (hex 6 char), services[] (1:1 dengan input layanan).

Post-validation: cek placeholder (`lorem ipsum`, `[alamat]`, dll) dan jumlah `services` harus PERSIS sama dengan input `layanan`.

### Tenant Templates (src/components/TenantSite/)

Tiga template berdasarkan `vibe`:
- `CasualTemplate` — warm, santai
- `ProfessionalTemplate` — sopan, terpercaya  
- `ElegantTemplate` — premium, eksklusif

`TemplateRenderer` pilih template berdasarkan `bisnis.vibe`. Semua template shared: `OperatingHours`, `MapEmbed` (Nominatim geocode hasil dari `latitude`/`longitude`), `social.ts` (URL builder untuk Instagram/TikTok/Facebook).

### App Structure

```
src/app/
├── page.tsx                    # Marketing landing
├── (marketing)/
│   ├── buat/                   # Wizard onboarding (5 steps)
│   │   └── _components/        # Step1-5 + Wizard.tsx
│   └── login/
├── (dashboard)/
│   └── dashboard/
│       ├── page.tsx            # List semua bisnis by email
│       └── [subdomain]/        # Edit form + server actions
├── api/
│   ├── auth/verify/            # Magic link callback
│   ├── auth/claim/             # Owner claim + token rotation
│   ├── owner/logout/
│   └── upload/                 # Image upload → public/uploads/
└── t/[[...slug]]/              # Tenant page (rewrite target)
```

## Environment Variables

```bash
DATABASE_URL=          # Wajib: PostgreSQL connection string
OPENAI_API_KEY=        # Wajib: OpenAI-compatible API key
OPENAI_BASE_URL=       # Opsional: override endpoint (TokenRouter, OpenRouter, dll)
OPENAI_MODEL=          # Opsional: default MiniMax-M3
RESEND_API_KEY=        # Opsional: kalau kosong, email di-log ke terminal
NEXT_PUBLIC_ROOT_DOMAIN=  # Opsional: default cus.site
```

## Local Multi-Tenant Testing

Browser modern (Chrome/Firefox) auto-resolve `*.localhost`. Akses:
- `http://localhost:3000` → marketing landing
- `http://kopisrawung.localhost:3000` → tenant kopisrawung

Safari perlu tambah manual di `/etc/hosts`.

## Konteks Tambahan
Baca ~/Documents/Nexus/CLAUDE.md dan folder terkait di 01-Projects/ atau 02-Areas/ untuk konteks personal & riwayat kerja. Kalau note project ini belum ada di Nexus, buatkan.
