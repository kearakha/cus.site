'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { OWNER_COOKIE_NAME } from '@/lib/auth';
import { Prisma } from '@prisma/client';

// === Update konten schema ===

const serviceInputSchema = z.object({
  title: z.string().min(2).max(60),
  description: z.string().min(5).max(400),
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
    .transform((v) => v.replace(/[\s\-+()]/g, ''))
    .refine((v) => /^[0-9]+$/.test(v), 'Hanya angka yang diperbolehkan'),
  // Konten
  heroHeadline: z.string().min(10).max(80),
  heroSubtext: z.string().min(15).max(150),
  aboutParagraph: z.string().min(80).max(500),
  ctaText: z.string().min(2).max(25),
  seoTitle: z.string().min(20).max(60),
  seoDescription: z.string().min(60).max(160),
  accentColor: z
    .string()
    .regex(/^[0-9a-fA-F]{6}$/, 'Format hex color: 6 karakter (contoh: f59e0b)'),
  services: z.array(serviceInputSchema).min(1).max(8),
});

export type UpdateKontenInput = z.infer<typeof updateKontenSchema>;

export type UpdateResult =
  | { success: true }
  | { success: false; error: string };

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
      error: parsed.error.issues[0]?.message ?? 'Input tidak valid',
    };
  }

  const data = parsed.data;

  // 2. Verifikasi ownership via cookie
  const cookieToken = cookies().get(OWNER_COOKIE_NAME)?.value;
  if (!cookieToken) {
    return { success: false, error: 'Kamu belum login sebagai owner.' };
  }

  // 3. Cari bisnis + verify token match
  const bisnis = await prisma.bisnis.findUnique({
    where: { subdomain: data.subdomain },
    select: { id: true, ownerToken: true },
  });

  if (!bisnis) {
    return { success: false, error: 'Bisnis tidak ditemukan.' };
  }
  if (bisnis.ownerToken !== cookieToken) {
    return { success: false, error: 'Kamu bukan owner bisnis ini.' };
  }

  // 4. Update dalam transaction
  try {
    await prisma.$transaction(async (tx) => {
      // Update Bisnis (field yang editable)
      const bisnisUpdate: Prisma.BisnisUpdateInput = {
        lokasi: data.lokasi,
        whatsapp: data.whatsapp,
      };
      if (data.namaBisnis !== undefined) {
        bisnisUpdate.namaBisnis = data.namaBisnis;
      }
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

      // Replace layanan
      await tx.layanan.deleteMany({ where: { bisnisId: bisnis.id } });
      await tx.layanan.createMany({
        data: data.services.map((s, i) => ({
          bisnisId: bisnis.id,
          title: s.title,
          description: s.description,
          order: i,
        })),
      });
    });

    // 5. Invalidate cache
    revalidatePath(`/t/${data.subdomain}`);
    revalidatePath(`/dashboard/${data.subdomain}`);
    revalidatePath('/dashboard');

    return { success: true };
  } catch (err) {
    console.error('[updateKontenAction] error:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Gagal menyimpan perubahan',
    };
  }
}

// === Hapus bisnis ===

export type DeleteResult =
  | { success: true }
  | { success: false; error: string };

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
    return { success: false, error: 'Subdomain tidak valid' };
  }

  // Verifikasi ownership
  const cookieToken = cookies().get(OWNER_COOKIE_NAME)?.value;
  if (!cookieToken) {
    return { success: false, error: 'Kamu belum login sebagai owner.' };
  }

  const bisnis = await prisma.bisnis.findUnique({
    where: { subdomain: subResult.data },
    select: { id: true, ownerToken: true, namaBisnis: true },
  });

  if (!bisnis) {
    return { success: false, error: 'Bisnis tidak ditemukan.' };
  }
  if (bisnis.ownerToken !== cookieToken) {
    return { success: false, error: 'Kamu bukan owner bisnis ini.' };
  }

  try {
    // Cascade delete: Bisnis → KontenWebsite + Layanan (auto via onDelete: Cascade)
    await prisma.bisnis.delete({
      where: { id: bisnis.id },
    });

    // Invalidate cache
    revalidatePath(`/t/${subResult.data}`);
    revalidatePath('/dashboard');

    return { success: true };
  } catch (err) {
    console.error('[hapusBisnisAction] error:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Gagal menghapus bisnis',
    };
  }
}
