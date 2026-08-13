import { MetadataRoute } from "next";
import { ROOT_DOMAIN } from "@/lib/domain";

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
