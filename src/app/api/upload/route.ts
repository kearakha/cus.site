import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { saveUpload, UploadError } from '@/lib/upload';
import { OWNER_COOKIE_NAME } from '@/lib/auth';
import { prisma } from '@/lib/db';

/**
 * POST /api/upload
 *
 * Upload 1 file image. Return JSON `{ url, bytes, mime }`.
 *
 * Auth: 2 mode (prioritas ke owner session jika ada):
 *   1. Owner session (cookie `cus_owner`) → upload untuk dirinya sendiri (dashboard edit)
 *   2. Anonymous + bisnisId di body → upload "draft" yang di-associate saat submit wizard
 *
 * Kenapa allow anonymous? Karena wizard onboarding harus bisa upload SEBELUM
 * Bisnis dibuat di DB. Workflow: user pilih gambar → upload ke folder
 * draft-{tempId} → submit wizard → bisnis dibuat → tempId di-relink ke bisnisId.
 *
 * Untuk MVP, simplified: kita pakai string "draft" sebagai folder untuk anonymous,
 * lalu saat submit kita move ke bisnisId. File lama di-cleanup periodik.
 *
 * NOTE: Folder strategy disederhanakan: anonymous pakai folder "draft", owner
 * pakai folder bisnisId. Pembersihan "draft" bisa ditambah cron nanti.
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const explicitBisnisId = formData.get('bisnisId');

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: 'Field "file" wajib diisi' },
        { status: 400 },
      );
    }

    // Tentukan folder target
    let targetId: string;
    const cookieToken = cookies().get(OWNER_COOKIE_NAME)?.value;

    if (typeof explicitBisnisId === 'string' && explicitBisnisId.length > 0) {
      // Explicit bisnisId → verify ownership kalau ada session
      if (cookieToken) {
        const bisnis = await prisma.bisnis.findUnique({
          where: { id: explicitBisnisId },
          select: { id: true, ownerToken: true },
        });
        if (!bisnis || bisnis.ownerToken !== cookieToken) {
          return NextResponse.json(
            { error: 'Tidak punya akses ke bisnis ini' },
            { status: 403 },
          );
        }
        targetId = bisnis.id;
      } else {
        // Tanpa session + explicit id = wizard mode → pakai folder draft
        targetId = 'draft';
      }
    } else if (cookieToken) {
      // Tanpa explicit id tapi ada session → gunakan draft (akan direlink)
      // Owner yang upload tanpa specify id = rare case, treat as draft
      targetId = 'draft';
    } else {
      // Anonymous wizard → draft
      targetId = 'draft';
    }

    const result = await saveUpload(file, targetId);

    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof UploadError) {
      const status = err.code === 'too_large' ? 413 : 400;
      return NextResponse.json({ error: err.message }, { status });
    }
    console.error('[api/upload] error:', err);
    return NextResponse.json(
      { error: 'Gagal upload file' },
      { status: 500 },
    );
  }
}
