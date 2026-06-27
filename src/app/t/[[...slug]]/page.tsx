import { headers } from "next/headers";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { getBisnisBySubdomain } from "@/lib/db";
import { isOwner } from "@/lib/auth";
import { TemplateRenderer } from "@/components/TenantSite/TemplateRenderer";
import { buildSiteUrl } from "@/components/TenantSite/types";
import { FloatingAdminBar } from "@/components/FloatingAdminBar";

type Props = {
  params: { slug?: string[] };
};

// === Metadata SEO dari KontenWebsite ===

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const subdomain = params.slug?.[0];
  if (!subdomain) return {};

  const bisnis = await getBisnisBySubdomain(subdomain);
  if (!bisnis || !bisnis.kontenAI || !bisnis.published) return {};

  const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "cus.site";
  const ogImageUrl = `https://${ROOT_DOMAIN}/api/og?subdomain=${subdomain}`;

  return {
    title: bisnis.kontenAI.seoTitle,
    description: bisnis.kontenAI.seoDescription,
    openGraph: {
      title: bisnis.kontenAI.heroHeadline,
      description: bisnis.kontenAI.heroSubtext,
      url: buildSiteUrl(bisnis),
      siteName: bisnis.namaBisnis,
      type: "website",
      locale: "id_ID",
      images: [{ url: ogImageUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: bisnis.kontenAI.heroHeadline,
      description: bisnis.kontenAI.heroSubtext,
      images: [ogImageUrl],
    },
    robots: { index: true, follow: true },
  };
}

// === Page ===

export default async function TenantSitePage({ params }: Props) {
  const slug = params.slug;
  const h = headers();

  // === Security gates ===

  // Gate #1: minimal 1 segment (domain)
  if (!slug || slug.length === 0) notFound();

  const subdomain = slug[0];
  const headerSub = h.get("x-cus-subdomain");
  const host = h.get("x-cus-host");

  // Gate #2: subdomain dari middleware harus match path domain
  if (!headerSub || headerSub !== subdomain) notFound();

  // Gate #3: host harus prefix subdomain (anti host header injection)
  if (!host || !host.startsWith(`${subdomain}.`)) notFound();

  // === Query data bisnis (1 round-trip, include relasi) ===

  const bisnis = await getBisnisBySubdomain(subdomain);

  // Gate #4: bisnis harus exist & published
  if (!bisnis || !bisnis.published) notFound();

  // Gate #5: KontenWebsite harus ada (kalau AI generate gagal atau di-pause)
  if (!bisnis.kontenAI) notFound();

  // === Owner detection (untuk Floating Admin Bar) ===

  const isOwnerRequest = isOwner(bisnis);

  // === Render template sesuai vibe ===

  return (
    <>
      <TemplateRenderer data={bisnis} siteUrl={buildSiteUrl(bisnis)} />
      {isOwnerRequest && (
        <FloatingAdminBar
          subdomain={subdomain}
          siteUrl={buildSiteUrl(bisnis)}
        />
      )}
    </>
  );
}
