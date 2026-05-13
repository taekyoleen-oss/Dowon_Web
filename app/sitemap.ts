import type { MetadataRoute } from "next";
import { lawyers } from "@/lib/data/lawyers";
import { libraryItems } from "@/lib/data/library";
import { practiceAreas } from "@/lib/data/practice-areas";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.dowonlaw.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes = [
    "/",
    "/about",
    "/about/philosophy",
    "/about/capability",
    "/about/history",
    "/about/contact",
    "/practice",
    "/people",
    "/people/lawyers",
    "/people/fellows",
    "/people/recovery",
    "/people/management",
    "/centers/investigation",
    "/centers/medical",
    "/library",
    "/library/cases",
    "/library/columns",
    "/library/media",
    "/library/search",
    "/clients",
    "/contact",
    "/contact/insurer",
    "/contact/enterprise",
    "/contact/medical",
    "/contact/personal",
    "/tools/triage",
    "/tools/subrogation-check",
  ];

  const entries: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : 0.7,
  }));

  for (const slug of Object.keys(practiceAreas)) {
    entries.push({
      url: `${BASE}/practice/${slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  for (const l of lawyers) {
    entries.push({
      url: `${BASE}/people/lawyers/${l.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  for (const it of libraryItems) {
    const base =
      it.type === "case" ? "library/cases" : it.type === "column" ? "library/columns" : "library/media";
    entries.push({
      url: `${BASE}/${base}/${it.slug}`,
      lastModified: new Date(it.publishedAt),
      changeFrequency: "yearly",
      priority: 0.5,
    });
  }

  return entries;
}
