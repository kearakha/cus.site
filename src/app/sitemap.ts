import { MetadataRoute } from "next";

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "cus.site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `https://${ROOT_DOMAIN}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `https://${ROOT_DOMAIN}/buat`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `https://${ROOT_DOMAIN}/login`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
