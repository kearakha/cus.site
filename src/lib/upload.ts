import { promises as fs } from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';

/**
 * Upload utility — local filesystem (dev / single-VM production).
 *
 * Kontrak publik (return value + error shape) stabil, jadi kalau nanti migrasi
 * ke UploadThing / Vercel Blob / S3, hanya implementasi di file ini yang berubah.
 *
 * Path hasil: `/uploads/{bisnisId}/{timestamp}-{random}-{filename}`
 *   - `bisnisId` scoping: gampang cleanup kalau bisnis dihapus
 *   - `timestamp-random` prefix: anti tabrakan + bisa sort by upload time
 *   - filename asli dipertahankan (sanitized) untuk readability
 */

const UPLOAD_ROOT = path.join(process.cwd(), 'public', 'uploads');
const PUBLIC_PREFIX = '/uploads';

const ALLOWED_MIME = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
]);

const MAX_BYTES = 2 * 1024 * 1024; // 2MB

export class UploadError extends Error {
  constructor(public code: 'too_large' | 'wrong_type' | 'write_failed', message: string) {
    super(message);
    this.name = 'UploadError';
  }
}

function sanitizeFilename(name: string): string {
  // Buang path traversal, sisakan alphanumeric + dash + dot + underscore
  return name
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80) || 'file';
}

export type SaveUploadResult = {
  /** Path relatif yang bisa dipakai di <img src>, contoh: "/uploads/abc/123-uuid-foo.jpg" */
  url: string;
  /** Ukuran file dalam bytes */
  bytes: number;
  /** MIME type */
  mime: string;
};

/**
 * Simpan file ke /public/uploads/{bisnisId}/.
 *
 * @param file      File dari FormData (Web API)
 * @param bisnisId  UUID bisnis pemilik. Pakai string generic kalau belum ada (misal draft).
 */
export async function saveUpload(
  file: File,
  bisnisId: string,
): Promise<SaveUploadResult> {
  if (!ALLOWED_MIME.has(file.type)) {
    throw new UploadError(
      'wrong_type',
      `Tipe file tidak didukung: ${file.type}. Gunakan JPG, PNG, WebP, atau GIF.`,
    );
  }
  if (file.size > MAX_BYTES) {
    throw new UploadError(
      'too_large',
      `File terlalu besar (${(file.size / 1024 / 1024).toFixed(1)}MB). Maksimal 2MB.`,
    );
  }

  const safeBisnis = bisnisId.replace(/[^a-zA-Z0-9-]/g, '').slice(0, 64) || 'draft';
  const dir = path.join(UPLOAD_ROOT, safeBisnis);

  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (err) {
    throw new UploadError('write_failed', 'Gagal membuat direktori upload');
  }

  const filename = `${Date.now()}-${randomUUID().slice(0, 8)}-${sanitizeFilename(file.name)}`;
  const fullPath = path.join(dir, filename);

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(fullPath, buffer);
  } catch (err) {
    throw new UploadError('write_failed', 'Gagal menulis file ke disk');
  }

  return {
    url: `${PUBLIC_PREFIX}/${safeBisnis}/${filename}`,
    bytes: file.size,
    mime: file.type,
  };
}

/**
 * Hapus file upload dari URL public.
 * Silent-fail kalau file sudah tidak ada (idempotent).
 */
export async function deleteUpload(publicUrl: string): Promise<void> {
  if (!publicUrl.startsWith(PUBLIC_PREFIX + '/')) return;
  const rel = publicUrl.slice(PUBLIC_PREFIX.length);
  // Cegah path traversal
  if (rel.includes('..')) return;
  const fullPath = path.join(UPLOAD_ROOT, rel);
  try {
    await fs.unlink(fullPath);
  } catch {
    // ignore
  }
}

/**
 * Hapus seluruh folder upload milik 1 bisnis.
 * Dipanggil saat hapusBisnisAction.
 */
export async function deleteBisnisUploads(bisnisId: string): Promise<void> {
  const safeBisnis = bisnisId.replace(/[^a-zA-Z0-9-]/g, '').slice(0, 64);
  if (!safeBisnis) return;
  const dir = path.join(UPLOAD_ROOT, safeBisnis);
  try {
    await fs.rm(dir, { recursive: true, force: true });
  } catch {
    // ignore
  }
}
