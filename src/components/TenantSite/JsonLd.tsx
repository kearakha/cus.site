import type { TenantData } from './types';
import { buildSiteUrl, normalizeWhatsapp } from './types';

type JsonLdProps = {
  data: TenantData;
};

/**
 * JsonLd — generate structured data (schema.org) for tenant pages.
 *
 * Outputs:
 * - LocalBusiness schema with name, address, opening hours, services, etc.
 * - Embedded inside <script type="application/ld+json">
 *
 * SEO benefit: Google rich results, Knowledge Panel eligibility.
 */
export function JsonLd({ data }: JsonLdProps) {
  const siteUrl = buildSiteUrl(data);
  const phone = normalizeWhatsapp(data.whatsapp);

  // Build opening hours spec if available
  const openingHours = buildOpeningHoursSpec(
    data.hariOperasional,
    data.jamBuka,
    data.jamTutup,
  );

  // Build service offerings
  const hasService = data.layanan.length > 0;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: data.namaBisnis,
    description: data.kontenAI?.seoDescription || data.kontenAI?.heroSubtext,
    url: siteUrl,
    telephone: `+${phone}`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: data.lokasi,
      addressCountry: 'ID',
    },
    ...(data.logoUrl && { logo: data.logoUrl }),
    ...(data.coverUrl && { image: data.coverUrl }),
    ...(data.latitude != null &&
      data.longitude != null && {
        geo: {
          '@type': 'GeoCoordinates',
          latitude: data.latitude,
          longitude: data.longitude,
        },
      }),
    ...(openingHours && { openingHoursSpecification: openingHours }),
    ...(hasService && {
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Layanan',
        itemListElement: data.layanan.map((s, i) => ({
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: s.title,
            description: s.description,
            ...(s.imageUrl && { image: s.imageUrl }),
          },
          ...(s.harga && { price: s.harga }),
          position: i + 1,
        })),
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

/**
 * BreadcrumbJsonLd — for marketing pages.
 */
export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// === Helpers ===

const DAY_MAP: Record<string, string[]> = {
  'Setiap Hari': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  'Senin - Sabtu': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  'Senin - Jumat': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  'Senin - Minggu': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  'Weekend Saja': ['Saturday', 'Sunday'],
};

function buildOpeningHoursSpec(
  hariOperasional: string | null | undefined,
  jamBuka: string | null | undefined,
  jamTutup: string | null | undefined,
) {
  if (!hariOperasional || !jamBuka || !jamTutup) return null;
  const days = DAY_MAP[hariOperasional];
  if (!days) return null;

  return days.map((day) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: day,
    opens: jamBuka,
    closes: jamTutup,
  }));
}
