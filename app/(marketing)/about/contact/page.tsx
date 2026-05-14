import { Container } from "@/components/layout/container";
import { Eyebrow, Button } from "@/components/ui";
import { MapPin, ExternalLink } from "lucide-react";
import { OFFICE } from "@/lib/data/office";
import { NaverMap } from "@/components/contact/naver-map";

export const metadata = { title: "오시는 길" };

// Real Naver Map renders when this env var is set (free key from
// ncloud.com — see components/contact/naver-map.tsx for setup steps).
// Otherwise the iframe below falls back to Google Maps.
const NAVER_CLIENT_ID = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID ?? "";

// Road-name address — Korean geocoders (Naver, Kakao, Google) all resolve
// this to the exact building, so we don't depend on approximate lat/lng.
// The values in OFFICE.lat/lng are kept for structured-data only.
const SEARCH_QUERY = `${OFFICE.addressRegion} ${OFFICE.addressLocality} ${OFFICE.streetAddress.split(",")[0]}`;
//   → "서울특별시 서초구 서초대로55길 3"

// Inline embed = Google Maps. Their classic `output=embed` URL is the only
// no-auth iframe that renders a "real" coloured street map (Naver/Kakao
// block iframe via X-Frame-Options; OSM is allowed but visually plain).
// To swap in a real Naver/Kakao map later, register at ncloud.com or
// developers.kakao.com and replace this iframe with their JS SDK.
const googleEmbedUrl =
  `https://maps.google.com/maps?q=${encodeURIComponent(SEARCH_QUERY)}` +
  `&t=m&z=17&ie=UTF8&hl=ko&output=embed`;

// Deep links use the same address string — each service's geocoder will
// pin the precise building (was previously coordinate-based with stale
// lat/lng, which caused all three pins to land in the wrong spot).
const primaryMapLink = {
  label: "네이버지도에서 정확한 위치 보기",
  href: `https://map.naver.com/p/search/${encodeURIComponent(SEARCH_QUERY)}`,
};

const secondaryMapLinks = [
  {
    label: "카카오맵",
    href: `https://map.kakao.com/?q=${encodeURIComponent(SEARCH_QUERY)}`,
  },
  {
    label: "구글맵",
    href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      SEARCH_QUERY
    )}`,
  },
];

const directions = [
  {
    no: "01",
    title: "지하철",
    body: "2호선 강남역 11번 출구, 3호선 양재역 12번 출구. 도보 약 10분.",
  },
  {
    no: "02",
    title: "버스",
    body: "강남역 정류장 광역 9408, 간선 146·340, 지선 4435 하차.",
  },
  {
    no: "03",
    title: "자가용",
    body: "애니빌딩 지하 주차장. 상담 방문 시 2시간 무료 (사전 안내 필요).",
  },
];

export default function VisitPage() {
  return (
    <>
      <section className="section-y">
        <Container size="wide">
          <Eyebrow index={1}>VISIT · 오시는 길</Eyebrow>
          <h1 className="mt-4 font-display italic text-display text-ink leading-tight">
            Seocho, Seoul.
          </h1>
          <p className="mt-3 font-serif-ko text-h2 text-ink">서울 서초 본사</p>

          <div className="mt-14 grid gap-12 lg:grid-cols-12">
            <address className="not-italic lg:col-span-5">
              <p className="label-mono">주소</p>
              <p className="mt-3 font-serif-ko text-h3 text-ink leading-base">
                서울특별시 서초구<br />
                서초대로55길 3,<br />
                애니빌딩 4-5층
              </p>

              <dl className="mt-10 space-y-5">
                <div>
                  <dt className="label-mono">TEL</dt>
                  <dd className="mt-2 font-serif-ko text-body-lg text-ink">
                    <a href="tel:0234816540" className="hover:text-gold-deep">02-3481-6540</a>
                    <span className="mx-2 text-ink-mute">·</span>
                    <a href="tel:0264150071" className="hover:text-gold-deep">02-6415-0071</a>
                  </dd>
                </div>
                <div>
                  <dt className="label-mono">FAX</dt>
                  <dd className="mt-2 font-serif-ko text-body-lg text-ink-soft">
                    02-3481-6541 · 02-6415-0072
                  </dd>
                </div>
                <div>
                  <dt className="label-mono">E-MAIL</dt>
                  <dd className="mt-2 font-serif-ko text-body-lg text-ink">
                    <a href="mailto:dowonlaw@dowonlaw.com" className="hover:text-gold-deep">
                      dowonlaw@dowonlaw.com
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="label-mono">상담 시간</dt>
                  <dd className="mt-2 font-serif-ko text-body-lg text-ink-soft">
                    평일 09:00 – 18:00 (점심 12:00 – 13:00)
                  </dd>
                </div>
              </dl>

              <div className="mt-10 flex flex-wrap gap-3">
                <Button href="/contact/personal" variant="primary" size="md">상담 신청</Button>
                <Button href="/contact/insurer" variant="secondary" size="md">B2B 상담</Button>
              </div>
            </address>

            <div className="lg:col-span-7">
              <p className="label-mono">지도</p>
              <div className="mt-3 aspect-[4/3] w-full overflow-hidden rounded-md border border-paper-3 bg-paper-2 relative">
                {NAVER_CLIENT_ID ? (
                  <NaverMap clientId={NAVER_CLIENT_ID} />
                ) : (
                  <iframe
                    title={`${OFFICE.addressShort} 지도`}
                    src={googleEmbedUrl}
                    className="absolute inset-0 h-full w-full"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                )}
                <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-sm bg-paper/95 px-2.5 py-1.5 shadow-sm backdrop-blur">
                  <MapPin size={13} aria-hidden className="text-gold-deep" />
                  <span className="font-serif-ko text-[13px] text-ink">
                    {OFFICE.addressShort}
                  </span>
                </div>
              </div>

              {/* Primary CTA — Naver is the de-facto map for Korean users */}
              <a
                href={primaryMapLink.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex w-full items-center justify-between gap-2 rounded-sm bg-ink px-4 py-3 font-sans-ko text-[14px] font-medium text-paper hover:bg-night transition-colors"
              >
                <span className="inline-flex items-center gap-2">
                  <MapPin size={14} aria-hidden /> {primaryMapLink.label}
                </span>
                <ExternalLink size={13} aria-hidden className="text-paper-3" />
              </a>

              <div className="mt-3 flex flex-wrap gap-2">
                <span className="self-center mr-1 font-mono text-[11px] uppercase tracking-label text-ink-mute">
                  다른 지도 →
                </span>
                {secondaryMapLinks.map((m) => (
                  <a
                    key={m.label}
                    href={m.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-sm border border-paper-3 bg-paper px-3 py-2 font-sans-ko text-[13px] text-ink hover:border-ink hover:bg-paper-2 transition-colors"
                  >
                    {m.label}
                    <ExternalLink size={11} aria-hidden className="text-ink-mute" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="section-y bg-paper-2">
        <Container size="wide">
          <Eyebrow index={2}>DIRECTIONS</Eyebrow>
          <h2 className="mt-4 font-serif-ko text-h1 text-ink font-semibold">교통 안내</h2>

          <ol className="mt-12 grid gap-px bg-paper-3 border border-paper-3 md:grid-cols-3">
            {directions.map((d) => (
              <li key={d.no} className="bg-paper p-8 lg:p-10">
                <span className="label-mono text-gold">{d.no}</span>
                <h3 className="mt-5 font-serif-ko text-h3 font-semibold text-ink">{d.title}</h3>
                <p className="mt-4 font-serif-ko text-body-lg text-ink-soft leading-base">{d.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>
    </>
  );
}
