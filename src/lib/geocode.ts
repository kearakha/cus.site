/**
 * Geocoding via Nominatim (OpenStreetMap).
 * - Gratis, tanpa API key
 * - Usage policy: max 1 req/s, harus ada User-Agent yang identifiable
 *   https://operations.osmfoundation.org/policies/nominatim/
 *
 * Untuk MVP cukup. Kalau traffic naik, pindah ke Mapbox / Google Geocoding.
 */

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";
const TIMEOUT_MS = 5000;

export type GeocodeResult = {
  latitude: number;
  longitude: number;
  /** Display name yang sudah dibersihkan Nominatim, untuk fallback konfirmasi */
  displayName: string;
};

/**
 * Geocode alamat string → koordinat.
 * Return null kalau tidak ketemu / error. Jangan throw — caller handle null gracefully.
 */
export async function geocodeAlamat(
  alamat: string,
): Promise<GeocodeResult | null> {
  if (!alamat || alamat.trim().length < 3) return null;

  // Tambahkan "Indonesia" supaya hasil lebih relevan (UMKM target pasar lokal)
  const q = `${alamat.trim()}, Indonesia`;

  const url = new URL(NOMINATIM_URL);
  url.searchParams.set("q", q);
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", "1");
  url.searchParams.set("countrycodes", "id"); // batasi ke Indonesia

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        // Wajib identifiable per usage policy Nominatim
        "User-Agent": "cus.site-generator/0.1 (https://cus.site)",
        "Accept-Language": "id",
      },
    });
    clearTimeout(timeout);

    if (!res.ok) return null;

    const results = (await res.json()) as Array<{
      lat: string;
      lon: string;
      display_name: string;
    }>;

    if (!Array.isArray(results) || results.length === 0) return null;

    const first = results[0];
    const lat = Number.parseFloat(first.lat);
    const lon = Number.parseFloat(first.lon);

    if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;

    return {
      latitude: lat,
      longitude: lon,
      displayName: first.display_name,
    };
  } catch (err) {
    if (
      err instanceof Error &&
      (err.name === "AbortError" || err.message.includes("aborted"))
    ) {
      console.warn(
        "[geocode] timeout setelah",
        TIMEOUT_MS,
        "ms untuk:",
        alamat,
      );
    }
    return null;
  }
}

/**
 * Bangun URL OpenStreetMap embed dari koordinat.
 * Format: https://www.openstreetmap.org/export/embed.html?bbox=...&marker=lat,lon
 *
 * bbox butuh padding supaya marker tidak tepat di pinggir.
 */
export function buildOsmEmbedUrl(
  lat: number,
  lon: number,
  paddingDeg = 0.005,
): string {
  const minLon = lon - paddingDeg;
  const minLat = lat - paddingDeg;
  const maxLon = lon + paddingDeg;
  const maxLat = lat + paddingDeg;

  const params = new URLSearchParams({
    bbox: `${minLon},${minLat},${maxLon},${maxLat}`,
    layer: "mapnik",
    marker: `${lat},${lon}`,
  });

  return `https://www.openstreetmap.org/export/embed.html?${params.toString()}`;
}

/**
 * URL untuk buka di tab baru (full OSM page, bukan embed).
 */
export function buildOsmExternalUrl(lat: number, lon: number): string {
  return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=17/${lat}/${lon}`;
}
