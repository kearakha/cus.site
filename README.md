# Cus.site

> Generator website instan untuk UMKM Indonesia. Multi-tenant via wildcard subdomain.

## Quick Start (Local Dev)

```bash
# 1. Install deps
npm install

# 2. Copy env
cp .env.local.example .env.local
# Wajib: DATABASE_URL, OPENAI_API_KEY
# Opsional: RESEND_API_KEY (kalau kosong, magic link ke-log ke terminal)

# 3. Generate Prisma client
npx prisma generate

# 4. Apply schema ke DB
npx prisma db push

# 5. (Opsional) Seed data demo
npx tsx prisma/seed.ts

# 6. Run dev server
npm run dev
```

## Test Multi-Tenant di Local

Buka beberapa URL di browser (Chrome/Firefox auto-resolve `*.localhost`):

| URL                                    | Yang Ditampilkan      |
| -------------------------------------- | --------------------- |
| `http://localhost:3000`                | Marketing landing     |
| `http://kopisrawung.localhost:3000`    | Tenant: kopisrawung   |
| `http://salon-makmur.localhost:3000`   | Tenant: salon-makmur  |

Catatan: jika pakai Safari/某些 browser yang tidak auto-resolve `*.localhost`,
tambah manual di `/etc/hosts`:

```
127.0.0.1   kopisrawung.localhost
127.0.0.1   salon-makmur.localhost
```

## Arsitektur Multi-Tenant

```
Request masuk
   ↓
src/middleware.ts
   ├─ Extract subdomain dari Host header
   ├─ Reserved subdomains (www, app, dashboard, dll) → skip
   └─ Rewrite ke /t/[domain]/...
        ↓
src/app/t/[[...slug]]/page.tsx
   ├─ Server component
   ├─ Query Prisma: Bisnis + KontenWebsite + Layanan
   └─ Render template sesuai `vibe`
```

## Struktur Folder

```
src/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Marketing landing (/)
│   ├── globals.css
│   ├── (marketing)/            # /buat (wizard), /login
│   ├── (dashboard)/            # /dashboard
│   ├── api/
│   │   ├── auth/
│   │   │   ├── verify/         # Magic link callback
│   │   │   └── claim/          # Owner claim (one-time, rotate token)
│   │   ├── upload/             # Image upload
│   │   └── owner/logout/
│   └── t/[[...slug]]/          # Tenant page (rewrite target)
├── lib/
│   ├── auth.ts                 # Cookies, magic link, owner claim
│   ├── email.ts                # Resend wrapper (dev fallback: console)
│   ├── openai.ts               # AI copywriting + regenerate
│   ├── geocode.ts              # Nominatim
│   ├── db.ts                   # Prisma singleton
│   ├── upload.ts               # File upload
│   └── schemas/wizard.ts       # Zod schemas
├── components/                 # Shared UI
└── middleware.ts               # Subdomain routing + claim redirect
```

## Auth Flow

**Login (magic link via email):**

```
User submit email di /login
   ↓
POST /login (server action) → generateLoginToken()
   ↓
Email dikirim (Resend) berisi https://cus.site/api/auth/verify?token=...
   ↓
User klik link → GET /api/auth/verify?token=...
   ↓
verifyLoginToken() → set cus_session cookie (email)
   ↓
Redirect ke /dashboard
```

**Claim (welcome email — one-time use, rotates token):**

```
Onboarding selesai → ownerToken di-generate, email welcome dikirim
   ↓
User klik link di email → middleware redirect ke /api/auth/claim?token=...
   ↓
claimOwnerToken() → atomic update (where ownerTokenUsedAt IS NULL)
   ├─ Set ownerTokenUsedAt = now()
   ├─ Generate ownerToken BARU
   ├─ Set cus_session + cus_owner cookies
   └─ Email link permanen BARU ke owner
   ↓
Redirect ke /dashboard?welcome=1

Token lama = INVALID permanent. Owner pakai token baru untuk next access.
```

**Dev mode:** kalau `RESEND_API_KEY` kosong, magic link + welcome email di-log
ke terminal (lihat console output server). Gampang test tanpa setup email.

## Scripts

```bash
npm run dev          # Dev server
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema ke DB
npm run db:migrate   # Create migration
npm run db:studio    # Prisma Studio GUI

# Test AI generation langsung
npx tsx scripts/test-ai.ts
```
