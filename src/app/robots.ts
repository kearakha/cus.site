import { MetadataRoute } from "next";

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "cus.site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/dashboard/"],
      },
    ],
    sitemap: `https://${ROOT_DOMAIN}/sitemap.xml`,
    host: `https://${ROOT_DOMAIN}`,
  };
}
