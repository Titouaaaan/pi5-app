import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://titouanguerin.com",
      lastModified: process.env.NEXT_PUBLIC_DEPLOY_AT
        ? new Date(process.env.NEXT_PUBLIC_DEPLOY_AT)
        : new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: "https://titouanguerin.com/PhINODE",
      lastModified: process.env.NEXT_PUBLIC_DEPLOY_AT
        ? new Date(process.env.NEXT_PUBLIC_DEPLOY_AT)
        : new Date(),
      changeFrequency: "yearly",
      priority: 0.8,
    },
    {
      url: "https://titouanguerin.com/colophon",
      lastModified: process.env.NEXT_PUBLIC_DEPLOY_AT
        ? new Date(process.env.NEXT_PUBLIC_DEPLOY_AT)
        : new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];
}
