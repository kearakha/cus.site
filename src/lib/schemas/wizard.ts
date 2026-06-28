import { z } from "zod";

/**
 * Zod schemas untuk validasi form input wizard onboarding.
 * Dipakai di:
 * - Client component (react-hook-form + @hookform/resolvers/zod)
 * - Server action (validasi ulang sebelum generate AI & save DB)
 *
 * Semua schema di-infer ke TypeScript type via z.infer<>.
 */

// === Preset enum ===

export const JENIS_BISNIS = [
  "Kafe / Restoran",
  "Salon / Barbershop",
  "Laundry",
  "Bimbel / Kursus",
  "Klinik / Praktik",
  "Toko Retail",
  "Jasa Profesional",
  "Lainnya",
] as const;

export const VIBE = ["casual", "professional", "elegant"] as const;

export const HARI_OPERASIONAL = [
  "Setiap Hari",
  "Senin - Sabtu",
  "Senin - Jumat",
  "Senin - Minggu",
  "Weekend Saja",
] as const;

// === Field schemas (reusable) ===

export const slugSchema = z
  .string()
  .min(3, "Minimal 3 karakter")
  .max(32, "Maksimal 32 karakter")
  .regex(
    /^[a-z0-9](?:[a-z0-9-]{1,30}[a-z0-9])?$/,
    "Hanya huruf kecil, angka, dan tanda strip (-). Tidak boleh diawali/diakhiri strip.",
  )
  .refine((s) => !s.includes("--"), "Tidak boleh ada dua strip berturut-turut");

export const whatsappSchema = z
  .string()
  .min(8, "Nomor WhatsApp tidak valid")
  .max(20)
  .transform((v) => v.replace(/[\s\-+()]/g, "")) // normalisasi
  .refine((v) => /^[0-9]+$/.test(v), "Hanya angka yang diperbolehkan");

export const emailSchema = z
  .string()
  .min(1, "Email wajib diisi")
  .email("Format email tidak valid")
  .max(120)
  .transform((v) => v.toLowerCase().trim());

/**
 * Validasi username social media (tanpa URL, tanpa @).
 * Boleh kosong. Kalau ada, harus alphanumeric + underscore + dot, 1-30 char.
 */
export const socialHandleSchema = z
  .string()
  .max(30)
  .regex(/^[a-zA-Z0-9_.]*$/, "Hanya huruf, angka, underscore, dan titik")
  .optional()
  .or(z.literal(""));

/**
 * Validasi format jam "HH:mm". Boleh kosong.
 */
export const jamSchema = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Format harus HH:mm, contoh: 08:00")
  .optional()
  .or(z.literal(""));

/** Validasi Vercel Blob URL. Boleh kosong. */
export const uploadPathSchema = z
  .string()
  .regex(
    /^https:\/\/[a-zA-Z0-9-]+\.public\.blob\.vercel-storage\.com\/[-\w./]+$/,
    "URL upload tidak valid",
  )
  .max(500)
  .optional()
  .or(z.literal(""));

// === Step schemas ===

export const step1Schema = z.object({
  namaBisnis: z.string().min(2, "Nama bisnis minimal 2 karakter").max(80),
  jenisBisnis: z.enum(JENIS_BISNIS, {
    errorMap: () => ({ message: "Pilih jenis bisnis" }),
  }),
  logoUrl: uploadPathSchema,
  coverUrl: uploadPathSchema,
});

export const step2Schema = z.object({
  lokasi: z.string().min(3, "Lokasi minimal 3 karakter").max(120),
  whatsapp: whatsappSchema,
  email: emailSchema,
  // Social (opsional)
  instagram: socialHandleSchema,
  tiktok: socialHandleSchema,
  facebook: socialHandleSchema,
  // Operasional (opsional)
  jamBuka: jamSchema,
  jamTutup: jamSchema,
  hariOperasional: z.enum(HARI_OPERASIONAL).optional().or(z.literal("")),
});

export const step3Schema = z.object({
  vibe: z.enum(VIBE, {
    errorMap: () => ({ message: "Pilih vibe" }),
  }),
});

export const layananItemSchema = z.object({
  title: z.string().min(2, "Judul layanan minimal 2 karakter").max(60),
  description: z.string().min(5, "Deskripsi minimal 5 karakter").max(200),
  imageUrl: uploadPathSchema,
  harga: z.string().max(50).optional().or(z.literal("")),
});

export const step4Schema = z.object({
  layanan: z
    .array(layananItemSchema)
    .min(1, "Minimal 1 layanan")
    .max(8, "Maksimal 8 layanan"),
});

export const step5Schema = z.object({
  subdomain: slugSchema,
});

// === Combined schema (final payload) ===

export const wizardInputSchema = step1Schema
  .merge(step2Schema)
  .merge(step3Schema)
  .merge(step4Schema)
  .merge(step5Schema);

export type WizardInput = z.infer<typeof wizardInputSchema>;
export type LayananItem = z.infer<typeof layananItemSchema>;
