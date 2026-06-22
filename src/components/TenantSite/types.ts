import type { Bisnis, KontenWebsite, Layanan } from '@prisma/client';

/**
 * Shape data yang di-pass ke tenant template components.
 * Sudah include relasi kontenAI + layanan, sorted by order.
 */
export type TenantData = Bisnis & {
  kontenAI: KontenWebsite | null;
  layanan: Layanan[];
};

export type Vibe = 'casual' | 'professional' | 'elegant';

export type TemplateProps = {
  data: TenantData;
  /**
   * URL absolut ke tenant site ini. Untuk dibagikan di meta tag (og:url),
   * WhatsApp share, dll.
   */
  siteUrl: string;
};

/**
 * Bangun URL tenant site dari Bisnis object.
 * - Production: https://kopisrawung.cus.site
 * - Local dev: http://kopisrawung.localhost:3000
 */
export function buildSiteUrl(bisnis: Pick<Bisnis, 'subdomain'>): string {
  const rootDomain = (process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'cus.site').toLowerCase();
  const isLocal =
    process.env.NODE_ENV !== 'production' ||
    rootDomain.endsWith('.localhost');

  if (isLocal) {
    return `http://${bisnis.subdomain}.localhost:3000`;
  }

  return `https://${bisnis.subdomain}.${rootDomain}`;
}

/**
 * Normalisasi WhatsApp ke format wa.me (62xxx).
 * User input bisa 081234567890 atau 6281234567890 atau +62 ...
 */
export function normalizeWhatsapp(raw: string): string {
  const cleaned = raw.replace(/[\s\-+()]/g, '');
  if (cleaned.startsWith('0')) {
    return '62' + cleaned.slice(1);
  }
  return cleaned;
}

/**
 * Generate URL WhatsApp dengan pesan pre-filled.
 * Misal: https://wa.me/6281234567890?text=Halo%20Kopi%20Srawung...
 */
export function buildWhatsappUrl(raw: string, bisnisName: string, layanan?: string): string {
  const phone = normalizeWhatsapp(raw);
  const greeting = `Halo ${bisnisName}, saya tertarik`;
  const withService = layanan ? `${greeting} dengan layanan *${layanan}*.` : `${greeting}.`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(withService)}`;
}
