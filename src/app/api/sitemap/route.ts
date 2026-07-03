import { NextRequest, NextResponse } from "next/server";
import { getBisnisBySubdomain } from "@/lib/db";
import { buildSiteUrl } from "@/components/TenantSite/types";

export async function GET(request: NextRequest) {
  const subdomain = request.headers.get("x-cus-subdomain");

  if (!subdomain) {
    return new NextResponse("Not found", { status: 404 });
  }

  const bisnis = await getBisnisBySubdomain(subdomain);
  if (!bisnis || !bisnis.published) {
    return new NextResponse("Not found", { status: 404 });
  }

  const siteUrl = buildSiteUrl(bisnis);
  const lastModDate =
    bisnis.kontenAI?.updatedAt && bisnis.kontenAI.updatedAt > bisnis.updatedAt
      ? bisnis.kontenAI.updatedAt
      : bisnis.updatedAt;
  const lastMod = lastModDate.toISOString().split("T")[0];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
