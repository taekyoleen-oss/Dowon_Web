/**
 * schema.org JSON-LD builders.
 *
 * All functions return plain objects ready to JSON.stringify into a
 * <script type="application/ld+json"> tag (see components/seo/json-ld.tsx).
 *
 * `absoluteUrl` resolves a relative path against NEXT_PUBLIC_SITE_URL so
 * structured data stays valid in both dev and production.
 */
import { OFFICE } from "@/lib/data/office";
import { practiceAreaLabels, type Lawyer } from "@/lib/data/lawyers";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://www.dowonlaw.com";

function absoluteUrl(path: string): string {
  if (path.startsWith("http")) return path;
  return `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

export function legalServiceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LegalService",
    "@id": `${SITE_URL}#legalservice`,
    name: OFFICE.name,
    alternateName: OFFICE.nameEn,
    url: SITE_URL,
    telephone: OFFICE.phoneIntl,
    email: OFFICE.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: OFFICE.streetAddress,
      addressLocality: OFFICE.addressLocality,
      addressRegion: OFFICE.addressRegion,
      addressCountry: OFFICE.addressCountry,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: OFFICE.lat,
      longitude: OFFICE.lng,
    },
    openingHours: OFFICE.hoursSchema,
    areaServed: { "@type": "Country", name: "Korea, Republic of" },
    knowsAbout: [
      "보험 분쟁",
      "의료분쟁",
      "구상 청구",
      "민간조사",
      "기업 법률자문",
      "채권 회수",
    ],
  } satisfies Record<string, unknown>;
}

export function personSchema(lawyer: Lawyer) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: lawyer.nameKo,
    alternateName: lawyer.nameEn,
    jobTitle: lawyer.role,
    description: lawyer.bioShort,
    url: absoluteUrl(`/people/lawyers/${lawyer.slug}`),
    ...(lawyer.photoUrl ? { image: lawyer.photoUrl } : {}),
    ...(lawyer.email ? { email: lawyer.email } : {}),
    knowsAbout: lawyer.practiceAreas.map((p) => practiceAreaLabels[p]),
    worksFor: {
      "@type": "LegalService",
      "@id": `${SITE_URL}#legalservice`,
      name: OFFICE.name,
      url: SITE_URL,
    },
  } satisfies Record<string, unknown>;
}

export function articleSchema(opts: {
  type?: "Article" | "NewsArticle" | "LegalForceStatus";
  headline: string;
  description: string;
  url: string;
  datePublished: string;
  authorName?: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": opts.type ?? "Article",
    headline: opts.headline,
    description: opts.description,
    url: absoluteUrl(opts.url),
    datePublished: opts.datePublished,
    ...(opts.image ? { image: opts.image } : {}),
    ...(opts.authorName
      ? { author: { "@type": "Person", name: opts.authorName } }
      : {}),
    publisher: {
      "@type": "LegalService",
      "@id": `${SITE_URL}#legalservice`,
      name: OFFICE.name,
    },
  } satisfies Record<string, unknown>;
}
