# Cus.site

> Generator website instan untuk UMKM Indonesia. Multi-tenant via wildcard subdomain.

## Quick Start (Local Dev)

```bash
# 1. Install deps
npm install

# 2. Copy env
cp .env.local.example .env.local
# Isi DATABASE_URL & OPENAI_API_KEY

# 3. Generate Prisma client
npx prisma generate

# 4. Run dev server
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
   └─ Rewrite ke /_sites/[domain]/...
        ↓
src/app/_sites/[domain]/page.tsx
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
│   ├── (marketing)/            # TODO: /buat (wizard), /pricing
│   ├── (dashboard)/            # TODO: /dashboard (CMS mini)
│   └── _sites/
│       └── [domain]/           # Tenant page (rewrite target)
│           └── page.tsx
├── middleware.ts               # ⭐ Subdomain detection & rewrite
└── lib/                        # TODO: db.ts, openai.ts
```
