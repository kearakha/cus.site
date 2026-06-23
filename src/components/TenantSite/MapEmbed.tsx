import { buildOsmEmbedUrl, buildOsmExternalUrl } from '@/lib/geocode';

/**
 * Komponen map embed untuk tenant site.
 *
 * Sumber: OpenStreetMap iframe (gratis, tanpa API key).
 *
 * Behavior:
 * - Ada lat/lng → embed iframe dengan marker
 * - Tidak ada lat/lng (geocode gagal) → fallback "Lihat di Maps" link
 *   ke OpenStreetMap search query dengan alamat
 */
type Props = {
  latitude: number | null;
  longitude: number | null;
  lokasi: string;
  /** Class tambahan untuk container (untuk atur height di parent) */
  className?: string;
};

export function MapEmbed({ latitude, longitude, lokasi, className = '' }: Props) {
  if (latitude != null && longitude != null) {
    const embedUrl = buildOsmEmbedUrl(latitude, longitude);
    const externalUrl = buildOsmExternalUrl(latitude, longitude);
    return (
      <div className={`relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 ${className}`}>
        <iframe
          src={embedUrl}
          title={`Peta lokasi ${lokasi}`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="block w-full h-full border-0"
        />
        <a
          href={externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-3 right-3 rounded-full bg-white/95 backdrop-blur px-3 py-1.5 text-xs font-medium text-slate-700 shadow hover:bg-white transition"
        >
          Buka di Maps ↗
        </a>
      </div>
    );
  }

  // Fallback: link ke OSM search
  const searchUrl = `https://www.openstreetmap.org/search?query=${encodeURIComponent(lokasi)}`;
  return (
    <a
      href={searchUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 hover:border-slate-300 hover:bg-slate-50 transition ${className}`}
    >
      <div>
        <p className="text-sm font-semibold text-slate-900">Lihat lokasi di peta</p>
        <p className="text-xs text-slate-500 mt-0.5">{lokasi}</p>
      </div>
      <span className="text-slate-400 text-lg">→</span>
    </a>
  );
}
