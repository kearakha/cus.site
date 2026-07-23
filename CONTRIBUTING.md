# Contributing to Cus.site

Terima kasih sudah tertarik berkontribusi! 🎉

## Prerequisites

- **Node.js** ≥ 18
- **PostgreSQL** (local atau cloud: Supabase, Neon, dll)
- **npm** (bundled with Node.js)

## Setup Development

```bash
# 1. Clone repo
git clone https://github.com/yourusername/cus-site.git
cd cus-site

# 2. Install dependencies
npm install

# 3. Copy env dan isi konfigurasi
cp .env.local.example .env.local
# Wajib: DATABASE_URL, OPENAI_API_KEY
# Opsional: RESEND_API_KEY (kalau kosong, email di-log ke terminal)

# 4. Generate Prisma client
npx prisma generate

# 5. Push schema ke database
npx prisma db push

# 6. (Opsional) Seed data demo
npx tsx prisma/seed.ts

# 7. Jalankan dev server
npm run dev
```

## Multi-Tenant Testing Lokal

Browser modern (Chrome/Firefox) auto-resolve `*.localhost`:

| URL | Tampilan |
|-----|----------|
| `http://localhost:3000` | Marketing landing |
| `http://kopisrawung.localhost:3000` | Tenant: casual |
| `http://klinik-pratama.localhost:3000` | Tenant: professional |
| `http://spa-bali.localhost:3000` | Tenant: elegant |
| `http://ironcore-gym.localhost:3000` | Tenant: bold |
| `http://studio-rupa.localhost:3000` | Tenant: minimal |

## Code Style

- **TypeScript** wajib — no `any` tanpa alasan kuat.
- **Tailwind CSS** untuk styling. Pakai utility classes, hindari inline style kecuali dynamic values.
- **ESLint** — jalankan `npm run lint` sebelum commit.
- **Prisma** — selalu jalankan `npm run db:generate` setelah ubah `schema.prisma`.

## Commit Convention

Pakai format [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

feat(template): add BoldTemplate for high-energy vibe
fix(auth): handle expired token gracefully
chore(deps): bump openai to 4.104.0
docs: update README with new features
refactor(wizard): simplify AI error logging
perf(db): add index on LoginToken.expiresAt
```

**Types**: `feat`, `fix`, `chore`, `docs`, `refactor`, `perf`, `test`, `style`
**Scopes**: `template`, `auth`, `dashboard`, `wizard`, `seo`, `db`, `ai`, `ux`, `deps`

## Struktur Folder

```
src/
├── app/                    # Next.js App Router pages
│   ├── (marketing)/        # Public pages: /buat, /login
│   ├── (dashboard)/        # Protected: /dashboard
│   ├── api/                # API routes
│   └── t/[[...slug]]/      # Tenant pages (rewrite target)
├── components/             # Shared UI components
│   └── TenantSite/         # Template components per vibe
└── lib/                    # Shared utilities & business logic
    └── schemas/            # Zod validation schemas
```

## Membuat Template Baru

1. Buat file `src/components/TenantSite/NamaTemplate.tsx`
2. Export function component yang menerima `TemplateProps`
3. Tambahkan vibe ke `src/lib/schemas/wizard.ts` → constant `VIBE`
4. Register di `TemplateRenderer.tsx` → case switch baru
5. Tambahkan deskripsi di `steps.ts` → `VIBE_DESCRIPTIONS`
6. Update `step-schemas.ts` → `Step3` type
7. (Opsional) Tambahkan sample bisnis di `prisma/seed.ts`

## Menjalankan Tests

```bash
npm run lint          # ESLint
npm run build         # Type check + production build
```

## Pull Request

1. Buat branch dari `main`: `git checkout -b feat/nama-fitur`
2. Commit perubahan dengan conventional commit message
3. Push dan buat PR
4. Jelaskan perubahan di PR description
5. Pastikan build pass (`npm run build`)

## Pertanyaan?

Buka issue di GitHub atau hubungi via email.
