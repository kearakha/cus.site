'use server';

import { randomUUID } from 'node:crypto';
import { prisma } from '@/lib/db';
import { generateCusWebsite } from '@/lib/openai';
import { wizardInputSchema } from '@/lib/schemas/wizard';
import { Prisma } from '@prisma/client';
import { buildAccessLink, setSessionCookies } from '@/lib/auth';

export type SubmitResult =
  | { success: true; subdomain: string; accessLink: string }
  | { success: false; error: string };

export async function submitBisnisAction(input: unknown): Promise<SubmitResult> {
  // 1. Validasi input
  const parsed = wizardInputSchema.safeParse(input);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return {
      success: false,
      error: `Input tidak valid: ${firstIssue?.message ?? 'unknown'}`,
    };
  }

  const data = parsed.data;

  try {
    // 2. Cek apakah subdomain sudah dipakai
    const existing = await prisma.bisnis.findUnique({
      where: { subdomain: data.subdomain },
      select: { id: true },
    });

    if (existing) {
      return {
        success: false,
        error: `Subdomain "${data.subdomain}" sudah dipakai orang lain. Pilih yang lain.`,
      };
    }

    // 3. Generate konten via OpenAI (paling lama, ~10-30 detik)
    const ai = await generateCusWebsite(data);

    if (!ai.success) {
      // Log raw response untuk debugging (server side)
      if (ai.rawResponse) {
        console.error('[submitBisnisAction] AI raw response:', ai.rawResponse.slice(0, 500));
      }
      return {
        success: false,
        error: `Gagal generate copywriting: ${ai.error}`,
      };
    }

    const konten = ai.data;

    // 4. Simpan ke DB dalam transaction
    const ownerToken = randomUUID();

    await prisma.$transaction(async (tx) => {
      const bisnis = await tx.bisnis.create({
        data: {
          subdomain: data.subdomain,
          namaBisnis: data.namaBisnis,
          jenisBisnis: data.jenisBisnis,
          lokasi: data.lokasi,
          whatsapp: data.whatsapp,
          email: data.email,
          vibe: data.vibe,
          ownerToken,
        },
      });

      await tx.kontenWebsite.create({
        data: {
          bisnisId: bisnis.id,
          heroHeadline: konten.heroHeadline,
          heroSubtext: konten.heroSubtext,
          aboutParagraph: konten.aboutParagraph,
          ctaText: konten.ctaText,
          seoTitle: konten.seoTitle,
          seoDescription: konten.seoDescription,
          accentColor: konten.accentColor,
        },
      });

      // Pakai services dari AI output, BUKAN input user mentah.
      // AI sudah enhance copy-nya (1:1 length guaranteed).
      await tx.layanan.createMany({
        data: konten.services.map((s, i) => ({
          bisnisId: bisnis.id,
          title: s.title,
          description: s.description,
          order: i,
        })),
      });
    });

    // 5. Set httpOnly cookies:
    //    - cus_session = email (multi-bisnis friendly, untuk dashboard list)
    //    - cus_owner = ownerToken (legacy, untuk Floating Admin Bar)
    //    Domain di-set ke parent domain supaya subdomain bisa baca
    //    (misal: cookie di cus.site, bisa diakses dari kopisrawung.cus.site)
    setSessionCookies(data.email, ownerToken);

    return {
      success: true,
      subdomain: data.subdomain,
      accessLink: buildAccessLink(ownerToken),
    };
  } catch (err) {
    console.error('[submitBisnisAction] error:', err);

    // Handle unique constraint violation (race condition: 2 user pakai subdomain sama)
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      return {
        success: false,
        error: `Subdomain "${data.subdomain}" sudah dipakai. Pilih yang lain.`,
      };
    }

    return {
      success: false,
      error: err instanceof Error ? err.message : 'Terjadi kesalahan tidak terduga',
    };
  }
}
