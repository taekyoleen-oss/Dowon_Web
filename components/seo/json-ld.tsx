/**
 * Inline schema.org JSON-LD.
 *
 * Use one component per schema entity. Place in the page body — Next.js
 * App Router renders it on the server, so search engines see it on
 * first fetch (no client-side hydration required).
 *
 * Reference: https://developers.google.com/search/docs/appearance/structured-data
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
