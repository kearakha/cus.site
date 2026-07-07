"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { isOwner, getSessionEmail } from "@/lib/auth";
import { Prisma } from "@prisma/client";
import { geocodeAlamat } from "@/lib/geocode";
import { generateCusWebsite } from "@/lib/openai";
import type { LayananItem, WizardInput } from "@/lib/schemas/wizard";
import { aiRatelimit } from "@/lib/ratelimit";

// === Update konten schema ===

const serviceInputSchema = z.object({
  title: z.string().min(2).max(60),
  description: z.string().min(5).max(400),
  harga: z.string().max(50).optional().or(z.literal("")),
  imageUrl: z
    .string()
    .regex(
      /^https:\/\/[a-zA-Z0-9-]+\.public\.blob\.vercel-storage\.com\/[-\w./]+$/,
      "URL upload tidak valid",
    )
    .max(500)
    .optional()
    .or(z.literal("")),
});

const updateKontenSchema = z.object({
  subdomain: z.string().min(3).max(32),
  // Info dasar bisnis
  namaBisnis: z.string().min(2).max(80).optional(),
  lokasi: z.string().min(3).max(120).optional(),
  whatsapp: z
    .string()
    .min(8)
    .max(20)
    .transform((v) => v.replace(/[\s\-+()]/g, ""))
    .refine((v) => /^[0-9]+$/.test(v), "Hanya angka yang diperbolehkan"),
  // Branding
  logoUrl: z
    .string()
    .regex(
      /^https:\/\/[a-zA-Z0-9-]+\.public\.blob\.vercel-storage\.com\/[-\w./]+$/,
      "URL upload tidak valid",
    )
    .max(500)
    .optional()
    .or(z.literal("")),
  coverUrl: z
    .string()
    .regex(
      /^https:\/\/[a-zA-Z0-9-]+\.public\.blob\.vercel-storage\.com\/[-\w./]+$/,
      "URL upload tidak valid",
    )
    .max(500)
    .optional()
    .or(z.literal("")),
  // Social (opsional, boleh kosong)
  instagram: z
    .string()
    .max(30)
    .regex(/^[a-zA-Z0-9_.]*$/, "Hanya huruf, angka, underscore, dan titik")
    .optional()
    .or(z.literal("")),
  tiktok: z
    .string()
    .max(30)
    .regex(/^[a-zA-Z0-9_.]*$/, "Hanya huruf, angka, underscore, dan titik")
    .optional()
    .or(z.literal("")),
  facebook: z.string().max(120).optional().or(z.literal("")),
  // Operasional
  jamBuka: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Format harus HH:mm")
    .optional()
    .or(z.literal("")),
  jamTutup: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Format harus HH:mm")
    .optional()
    .or(z.literal("")),
  hariOperasional: z
    .enum([
      "Setiap Hari",
      "Senin - Sabtu",
      "Senin - Jumat",
      "Senin - Minggu",
      "Weekend Saja",
    ])
    .optional()
    .or(z.literal("")),
  // Konten
  heroHeadline: z.string().min(10).max(80),
  heroSubtext: z.string().min(15).max(150),
  aboutParagraph: z.string().min(80).max(500),
  ctaText: z.string().min(2).max(25),
  seoTitle: z.string().min(20).max(60),
  seoDescription: z.string().min(60).max(160),
  accentColor: z
    .string()
    .regex(/^[0-9a-fA-F]{6}$/, "Format hex color: 6 karakter (contoh: f59e0b)"),
  services: z.array(serviceInputSchema).min(1).max(8),
});

export type UpdateKontenInput = z.infer<typeof updateKontenSchema>;

export type UpdateResult =
  { success: true } | { success: false; error: string };

/**
 * Server action: update semua aspek bisnis untuk 1 website.
 * Owner-only: cek cookie ownerToken cocok dengan Bisnis.ownerToken.
 */
export async function updateKontenAction(
  input: UpdateKontenInput,
): Promise<UpdateResult> {
  // 1. Validasi input
  const parsed = updateKontenSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Input tidak valid",
    };
  }

  const data = parsed.data;

  // 2. Cari bisnis + verify ownership (session email ATAU ownerToken)
  const bisnis = await prisma.bisnis.findUnique({
    where: { subdomain: data.subdomain },
    select: { id: true, email: true, ownerToken: true, lokasi: true },
  });

  if (!bisnis) {
    return { success: false, error: "Bisnis tidak ditemukan." };
  }
  if (!isOwner(bisnis)) {
    return { success: false, error: "Kamu bukan owner bisnis ini." };
  }

  // 4. Re-geocode kalau lokasi berubah (best-effort)
  let latitude: number | null | undefined = undefined;
  let longitude: number | null | undefined = undefined;
  if (data.lokasi && data.lokasi !== bisnis.lokasi) {
    const geo = await geocodeAlamat(data.lokasi);
    if (geo) {
      latitude = geo.latitude;
      longitude = geo.longitude;
    }
  }

  // 5. Update dalam transaction
  try {
    await prisma.$transaction(async (tx) => {
      // Update Bisnis (field yang editable)
      const bisnisUpdate: Prisma.BisnisUpdateInput = {
        lokasi: data.lokasi,
        whatsapp: data.whatsapp.replace(/[\s\-().+]/g, "").replace(/^0/, "62"),
        logoUrl: data.logoUrl || null,
        coverUrl: data.coverUrl || null,
        instagram: data.instagram || null,
        tiktok: data.tiktok || null,
        facebook: data.facebook || null,
        jamBuka: data.jamBuka || null,
        jamTutup: data.jamTutup || null,
        hariOperasional: data.hariOperasional || null,
      };
      if (data.namaBisnis !== undefined) {
        bisnisUpdate.namaBisnis = data.namaBisnis;
      }
      if (latitude !== undefined) bisnisUpdate.latitude = latitude;
      if (longitude !== undefined) bisnisUpdate.longitude = longitude;
      await tx.bisnis.update({
        where: { id: bisnis.id },
        data: bisnisUpdate,
      });

      // Update KontenWebsite
      await tx.kontenWebsite.update({
        where: { bisnisId: bisnis.id },
        data: {
          heroHeadline: data.heroHeadline,
          heroSubtext: data.heroSubtext,
          aboutParagraph: data.aboutParagraph,
          ctaText: data.ctaText,
          seoTitle: data.seoTitle,
          seoDescription: data.seoDescription,
          accentColor: data.accentColor,
        },
      });

      // Replace layanan (preserves imageUrl per item)
      await tx.layanan.deleteMany({ where: { bisnisId: bisnis.id } });
      await tx.layanan.createMany({
        data: data.services.map((s, i) => ({
          bisnisId: bisnis.id,
          title: s.title,
          description: s.description,
          harga: s.harga || null,
          imageUrl: s.imageUrl || null,
          order: i,
        })),
      });
    });

    // 6. Invalidate cache
    revalidateTag(`bisnis-${data.subdomain}`);
    revalidatePath(`/t/${data.subdomain}`);
    revalidatePath(`/dashboard/${data.subdomain}`);
    revalidatePath("/dashboard");

    return { success: true };
  } catch (err) {
    console.error("[updateKontenAction] error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Gagal menyimpan perubahan",
    };
  }
}

// === Regenerate AI (section-scoped) ===

const regenerateSchema = z.object({
  subdomain: z.string().min(3).max(32),
  /** Section yang mau di-regenerate */
  section: z.enum(["hero", "about", "services", "all"]),
});

export type RegenerateSection = z.infer<typeof regenerateSchema>["section"];

export type RegenerateResult =
  | {
      success: true;
      section: RegenerateSection;
      /** Field yang di-update (caller replace form state) */
      data: {
        heroHeadline?: string;
        heroSubtext?: string;
        aboutParagraph?: string;
        services?: Array<{ title: string; description: string }>;
      };
    }
  | { success: false; error: string };

type RegenerateData = Extract<RegenerateResult, { success: true }>["data"];

/**
 * Regenerate copywriting untuk section tertentu via AI.
 * Owner-only (cek cookie ownerToken). Tidak replace form state —
 * return data baru, caller (EditForm) yang replace field-nya
 * supaya user bisa review sebelum save.
 */
export async function regenerateAIContentAction(
  input: z.infer<typeof regenerateSchema>,
): Promise<RegenerateResult> {
  const parsed = regenerateSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Input tidak valid" };
  }
  const { subdomain, section } = parsed.data;

  // 1. Verifikasi ownership — pakai isOwner (cek session email ATAU ownerToken)
  const bisnis = await prisma.bisnis.findUnique({
    where: { subdomain },
    include: {
      kontenAI: true,
      layanan: { orderBy: { order: "asc" } },
    },
  });

  if (!bisnis) {
    return { success: false, error: "Bisnis tidak ditemukan." };
  }
  if (!isOwner(bisnis)) {
    return { success: false, error: "Kamu bukan owner bisnis ini." };
  }
  if (!bisnis.kontenAI) {
    return { success: false, error: "Konten website belum ada." };
  }

  // 2. Build WizardInput shape dari data existing.
  //    Data di DB dipercaya valid (insert via wizard + Zod validation).
  const layanan: LayananItem[] = bisnis.layanan.map((l) => ({
    title: l.title,
    description: l.description,
  }));

  const wizardInput: WizardInput = {
    namaBisnis: bisnis.namaBisnis,
    jenisBisnis: bisnis.jenisBisnis as WizardInput["jenisBisnis"],
    lokasi: bisnis.lokasi,
    whatsapp: bisnis.whatsapp,
    email: bisnis.email,
    vibe: bisnis.vibe as WizardInput["vibe"],
    subdomain: bisnis.subdomain,
    layanan,
  };

  // 3. Rate limit AI per email/IP (5/jam)
  const sessionEmail = getSessionEmail();
  const ip =
    headers().get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  const rlId = sessionEmail ?? ip;
  const { success: rlOk } = await aiRatelimit.limit(rlId);
  if (!rlOk) {
    return {
      success: false,
      error: "Terlalu banyak regenerate. Coba lagi dalam 1 jam.",
    };
  }

  // 4. Call AI
  const ai = await generateCusWebsite(wizardInput);
  if (!ai.success) {
    return { success: false, error: `AI gagal: ${ai.error}` };
  }

  // 4. Return hanya field yang direquest
  const data: RegenerateData = {};
  if (section === "hero" || section === "all") {
    data.heroHeadline = ai.data.heroHeadline;
    data.heroSubtext = ai.data.heroSubtext;
  }
  if (section === "about" || section === "all") {
    data.aboutParagraph = ai.data.aboutParagraph;
  }
  if (section === "services" || section === "all") {
    data.services = ai.data.services.map((s) => ({
      title: s.title,
      description: s.description,
    }));
  }

  return {
    success: true,
    section,
    data,
  };
}

// === Toggle published ===

export type TogglePublishedResult =
  { success: true; published: boolean } | { success: false; error: string };

export async function togglePublishedAction(
  subdomain: string,
): Promise<TogglePublishedResult> {
  const subSchema = z.string().min(3).max(32);
  const subResult = subSchema.safeParse(subdomain);
  if (!subResult.success) {
    return { success: false, error: "Subdomain tidak valid" };
  }

  const bisnis = await prisma.bisnis.findUnique({
    where: { subdomain: subResult.data },
    select: { id: true, email: true, ownerToken: true, published: true },
  });

  if (!bisnis) return { success: false, error: "Bisnis tidak ditemukan." };
  if (!isOwner(bisnis))
    return { success: false, error: "Kamu bukan owner bisnis ini." };

  const next = !bisnis.published;
  await prisma.bisnis.update({
    where: { id: bisnis.id },
    data: { published: next },
  });

  revalidateTag(`bisnis-${subResult.data}`);
  revalidatePath(`/t/${subResult.data}`);
  revalidatePath(`/dashboard/${subResult.data}`);

  return { success: true, published: next };
}

// === Hapus bisnis ===

export type DeleteResult =
  { success: true } | { success: false; error: string };

/**
 * Hapus bisnis + relasi cascade (KontenWebsite, Layanan).
 * Owner-only.
 */
export async function hapusBisnisAction(
  subdomain: string,
): Promise<DeleteResult> {
  // Validasi subdomain
  const subSchema = z.string().min(3).max(32);
  const subResult = subSchema.safeParse(subdomain);
  if (!subResult.success) {
    return { success: false, error: "Subdomain tidak valid" };
  }

  // Verifikasi ownership
  const bisnis = await prisma.bisnis.findUnique({
    where: { subdomain: subResult.data },
    select: { id: true, email: true, ownerToken: true, namaBisnis: true },
  });

  if (!bisnis) {
    return { success: false, error: "Bisnis tidak ditemukan." };
  }
  if (!isOwner(bisnis)) {
    return { success: false, error: "Kamu bukan owner bisnis ini." };
  }

  try {
    // Cascade delete: Bisnis → KontenWebsite + Layanan (auto via onDelete: Cascade)
    await prisma.bisnis.delete({
      where: { id: bisnis.id },
    });

    // Hapus juga folder upload-nya
    const { deleteBisnisUploads } = await import("@/lib/upload");
    await deleteBisnisUploads(bisnis.id);

    // Invalidate cache
    revalidateTag(`bisnis-${subResult.data}`);
    revalidatePath(`/t/${subResult.data}`);
    revalidatePath("/dashboard");

    return { success: true };
  } catch (err) {
    console.error("[hapusBisnisAction] error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Gagal menghapus bisnis",
    };
  }
}
