import type { MetadataRoute } from "next";
import { getAllGuides } from "@/lib/guides";

const SITE_URL = "https://ev-hanmune.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const guides = getAllGuides();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/guides`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/tools/ev-subsidy`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/tools/cost-calculator`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/tools/charging-rates`, changeFrequency: "monthly", priority: 0.7 },
  ];

  const guideRoutes: MetadataRoute.Sitemap = guides.map((guide) => ({
    url: `${SITE_URL}/guides/${guide.slug}`,
    lastModified: guide.publishedAt,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...guideRoutes];
}
