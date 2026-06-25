import { put, del, list } from "@vercel/blob";
import { randomUUID } from "node:crypto";

/**
 * Upload utility — Vercel Blob (production-safe, CDN-served).
 *
 * Kontrak publik tidak berubah. Return URL sekarang absolute CDN URL
 * dari Vercel Blob, bukan relative path ke local filesystem.
 */

const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);

const MAX_BYTES = 2 * 1024 * 1024; // 2MB

export class UploadError extends Error {
  constructor(
    public code: "too_large" | "wrong_type" | "write_failed",
    message: string,
  ) {
    super(message);
    this.name = "UploadError";
  }
}

function sanitizeFilename(name: string): string {
  return (
    name
      .replace(/[^a-zA-Z0-9._-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 80) || "file"
  );
}

export type SaveUploadResult = {
  /** Absolute CDN URL dari Vercel Blob */
  url: string;
  bytes: number;
  mime: string;
};

/**
 * Upload file ke Vercel Blob.
 * Path: `uploads/{bisnisId}/{timestamp}-{uuid8}-{filename}`
 * Wizard (sebelum bisnisId ada) pakai `uploads/draft/{...}`.
 */
export async function saveUpload(
  file: File,
  bisnisId: string,
): Promise<SaveUploadResult> {
  if (!ALLOWED_MIME.has(file.type)) {
    throw new UploadError(
      "wrong_type",
      `Tipe file tidak didukung: ${file.type}. Gunakan JPG, PNG, WebP, atau GIF.`,
    );
  }
  if (file.size > MAX_BYTES) {
    throw new UploadError(
      "too_large",
      `File terlalu besar (${(file.size / 1024 / 1024).toFixed(1)}MB). Maksimal 2MB.`,
    );
  }

  const safeBisnis =
    bisnisId.replace(/[^a-zA-Z0-9-]/g, "").slice(0, 64) || "draft";
  const filename = `${Date.now()}-${randomUUID().slice(0, 8)}-${sanitizeFilename(file.name)}`;
  const pathname = `uploads/${safeBisnis}/${filename}`;

  try {
    const blob = await put(pathname, file, {
      access: "public",
      contentType: file.type,
    });

    return { url: blob.url, bytes: file.size, mime: file.type };
  } catch (err) {
    throw new UploadError(
      "write_failed",
      err instanceof Error ? err.message : "Gagal upload ke Vercel Blob",
    );
  }
}

/** Hapus satu file dari Vercel Blob via URL. Silent-fail. */
export async function deleteUpload(publicUrl: string): Promise<void> {
  if (!publicUrl) return;
  try {
    await del(publicUrl);
  } catch {
    // ignore
  }
}

/** Hapus seluruh file upload milik 1 bisnis. Dipanggil saat hapusBisnisAction. */
export async function deleteBisnisUploads(bisnisId: string): Promise<void> {
  const safeBisnis = bisnisId.replace(/[^a-zA-Z0-9-]/g, "").slice(0, 64);
  if (!safeBisnis) return;
  try {
    const { blobs } = await list({ prefix: `uploads/${safeBisnis}/` });
    if (blobs.length === 0) return;
    await del(blobs.map((b) => b.url));
  } catch {
    // ignore
  }
}
