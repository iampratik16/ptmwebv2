import type { MetadataRoute } from "next";
import { NAV, SITE } from "@/lib/site";
import { getAllSlugs } from "@/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url;
  // Derived from NAV rather than hand-listed: the previous literal list silently
  // went stale the moment a page was added to the nav and not to this array.
  const staticRoutes = ["", ...NAV.map((item) => item.href)].map((path) => ({
    url: `${base}${path}`,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const caseRoutes = getAllSlugs().map((slug) => ({
    url: `${base}/work/${slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...caseRoutes];
}
