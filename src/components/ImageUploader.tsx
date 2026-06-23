'use client';

import { useState, useRef } from 'react';
import { ImagePlus, X, Loader2, Upload as UploadIcon } from 'lucide-react';

type Props = {
  /** Label di atas */
  label: string;
  /** Path saat ini (kosong = belum ada). Disimpan oleh parent. */
  value: string;
  /** Dipanggil saat upload sukses dengan path baru */
  onChange: (url: string) => void;
  /** Aspect ratio untuk preview, contoh: "1/1" untuk logo, "16/9" untuk cover */
  aspect?: 'square' | 'wide' | 'tall';
  /** Class tambahan untuk container */
  className?: string;
  /** Helper text di bawah */
  hint?: string;
};

const ASPECT_CLASS: Record<NonNullable<Props['aspect']>, string> = {
  square: 'aspect-square',
  wide: 'aspect-[16/9]',
  tall: 'aspect-[3/4]',
};

/**
 * ImageUploader — input file dengan preview.
 * - Drag & drop atau click
 * - Upload ke /api/upload
 * - Show progress + error inline
 * - Tombol hapus untuk replace/remove
 *
 * Reusable untuk logo, cover, dan foto layanan.
 */
export function ImageUploader({
  label,
  value,
  onChange,
  aspect = 'square',
  className = '',
  hint,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const upload = async (file: File) => {
    setError(null);
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error || 'Upload gagal');
      }
      const data = (await res.json()) as { url: string };
      onChange(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload gagal');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const onSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) void upload(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) void upload(file);
  };

  const remove = () => {
    setError(null);
    onChange('');
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        {label}
      </label>

      {value ? (
        // === Preview state ===
        <div className={`relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50 ${ASPECT_CLASS[aspect]}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt={label}
            className="h-full w-full object-cover"
          />
          <div className="absolute top-2 right-2 flex gap-1.5">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="rounded-full bg-white/90 backdrop-blur p-2 text-slate-700 shadow hover:bg-white transition disabled:opacity-50"
              title="Ganti"
            >
              {uploading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <UploadIcon className="h-3.5 w-3.5" />
              )}
            </button>
            <button
              type="button"
              onClick={remove}
              disabled={uploading}
              className="rounded-full bg-white/90 backdrop-blur p-2 text-red-600 shadow hover:bg-white transition disabled:opacity-50"
              title="Hapus"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      ) : (
        // === Empty / upload state ===
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          disabled={uploading}
          className={`group relative w-full ${ASPECT_CLASS[aspect]} rounded-xl border-2 border-dashed transition flex flex-col items-center justify-center gap-2 text-center disabled:opacity-50 ${
            dragging
              ? 'border-slate-900 bg-slate-50'
              : 'border-slate-300 bg-white hover:border-slate-400 hover:bg-slate-50'
          }`}
        >
          {uploading ? (
            <>
              <Loader2 className="h-6 w-6 animate-spin text-slate-700" />
              <span className="text-xs text-slate-600">Mengupload...</span>
            </>
          ) : (
            <>
              <div className="rounded-full bg-slate-100 p-2.5 group-hover:bg-white transition">
                <ImagePlus className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700">
                  Klik atau drop gambar
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  JPG, PNG, WebP · maks 2MB
                </p>
              </div>
            </>
          )}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={onSelect}
        className="hidden"
      />

      {error && (
        <p className="mt-1.5 text-xs text-red-600">{error}</p>
      )}
      {hint && !error && (
        <p className="mt-1.5 text-xs text-slate-500">{hint}</p>
      )}
    </div>
  );
}
