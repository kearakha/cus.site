"use server";

import { randomUUID } from "node:crypto";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { generateCusWebsite } from "@/lib/openai";
import { wizardInputSchema } from "@/lib/schemas/wizard";
import { Prisma } from "@prisma/client";
import { buildAccessLink, setSessionCookies } from "@/lib/auth";
import { sendWelcomeEmail } from "@/lib/email";
import { geocodeAlamat } from "@/lib/geocode";
import { aiRatelimit } from "@/lib/ratelimit";

export type SubmitResult =
  | { success: true; subdomain: string; accessLink: string }
  | { success: false; error: string };

export async function submitBisnisAction(
  input: unknown,
): Promise<SubmitResult> {
  // 1. Validasi input
  const parsed = wizardInputSchema.safeParse(input);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return {
      success: false,
      error: `Input tidak valid: ${firstIssue?.message ?? "unknown"}`,
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

    // 3. Rate limit AI per email (5/jam) — cegah spam generate yang mahal
    const ip =
      headers().get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
    const rlId = data.email || ip;
    const { success: rlOk } = await aiRatelimit.limit(rlId);
    if (!rlOk) {
      return {
        success: false,
        error: "Terlalu banyak percobaan. Coba lagi dalam 1 jam.",
      };
    }

    // 4. Geocode + AI generate berjalan parallel (keduanya independent)
    const [geo, ai] = await Promise.all([
      geocodeAlamat(data.lokasi),
      generateCusWebsite(data),
    ]);

    if (!ai.success) {
      // Log raw response untuk debugging (server side)
      if (ai.rawResponse) {
        console.error(
          "[submitBisnisAction] AI raw response:",
          ai.rawResponse.slice(0, 500),
        );
      }
      return {
        success: false,
        error: `Gagal generate copywriting: ${ai.error}`,
      };
    }

    const konten = ai.data;

    // 5. Simpan ke DB dalam transaction
    const ownerToken = randomUUID();
    let bisnisId = "";

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
          logoUrl: data.logoUrl || null,
          coverUrl: data.coverUrl || null,
          instagram: data.instagram || null,
          tiktok: data.tiktok || null,
          facebook: data.facebook || null,
          jamBuka: data.jamBuka || null,
          jamTutup: data.jamTutup || null,
          hariOperasional: data.hariOperasional || null,
          latitude: geo?.latitude ?? null,
          longitude: geo?.longitude ?? null,
          ownerToken,
        },
      });
      bisnisId = bisnis.id;

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
          testimoni: konten.testimoni,
        },
      });

      // Pakai services dari AI output, BUKAN input user mentah.
      // AI sudah enhance copy-nya (1:1 length guaranteed).
      await tx.layanan.createMany({
        data: konten.services.map((s, i) => {
          // imageUrl: ambil dari input user sesuai index, kalau ada.
          // (input mungkin < output kalau AI tambah layanan; ambil sebanyak input.length)
          const userImage = data.layanan[i]?.imageUrl || null;
          const userHarga = data.layanan[i]?.harga || null;
          return {
            bisnisId: bisnis.id,
            title: s.title,
            description: s.description,
            harga: userHarga,
            imageUrl: userImage,
            order: i,
          };
        }),
      });
    });

    // 6. Set httpOnly cookies:
    //    - cus_session = email (multi-bisnis friendly, untuk dashboard list)
    //    - cus_owner = ownerToken (legacy, untuk Floating Admin Bar)
    //    Domain di-set ke parent domain supaya subdomain bisa baca
    //    (misal: cookie di cus.site, bisa diakses dari kopisrawung.cus.site)
    setSessionCookies(data.email, ownerToken);

    // 8. Kirim welcome email dengan claim link (one-time) + link permanen.
    //    Fire-and-forget — kalo email gagal, user tetap punya cookies + accessLink.
    //    Dev mode: email.log akan print link ke terminal.
    const accessLink = buildAccessLink(ownerToken);
    sendWelcomeEmail({
      to: data.email,
      businessName: data.namaBisnis,
      subdomain: data.subdomain,
      claimUrl: accessLink,
      permanentAccessUrl: accessLink, // sama untuk first claim
    }).catch((err) => {
      console.error("[submitBisnisAction] Gagal kirim welcome email:", err);
    });

    return {
      success: true,
      subdomain: data.subdomain,
      accessLink,
    };
  } catch (err) {
    console.error("[submitBisnisAction] error:", err);

    // Handle unique constraint violation (race condition: 2 user pakai subdomain sama)
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      return {
        success: false,
        error: `Subdomain "${data.subdomain}" sudah dipakai. Pilih yang lain.`,
      };
    }

    return {
      success: false,
      error:
        err instanceof Error ? err.message : "Terjadi kesalahan tidak terduga",
    };
  }
}
