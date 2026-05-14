import { Container } from "@/components/layout/container";
import { Eyebrow, Button } from "@/components/ui";
import { MapPin, ExternalLink } from "lucide-react";
import { OFFICE } from "@/lib/data/office";

export const metadata = { title: "오시는 길" };

// Default visible map = Naver. Mobile search URL is iframe-friendlier
// than the desktop variant. Falls back to a search-by-name view; the
// marker appears once the page renders.
const naverEmbedUrl =
  `https://m.map.naver.com/search2/search.naver?query=${encodeURIComponent(
    OFFICE.name + " " + OFFICE.addressShort
  )}`;

// Native-app deep links — all coordinate-based so each service pins the
// exact building rather than fuzzy-searching by name.
const mapLinks = [
  {
    label: "네이버지도",
    // p=<lng>,<lat>,<zoom> centers the desktop map on the precise point.
    href: `https://map.naver.com/p/search/${encodeURIComponent(
      OFFICE.name
    )}?c=15.00,0,0,0,dh&p=${OFFICE.lng},${OFFICE.lat},15`,
  },
  {
    label: "카카오맵",
    // Kakao's documented deep link: /link/map/<name>,<lat>,<lng>
    href: `https://map.kakao.com/link/map/${encodeURIComponent(
      OFFICE.name
    )},${OFFICE.lat},${OFFICE.lng}`,
  },
  {
    label: "구글맵",
    href: `https://www.google.com/maps?q=${OFFICE.lat},${OFFICE.lng}`,
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
                <iframe
                  title={`${OFFICE.addressShort} 지도 — 네이버지도`}
                  src={naverEmbedUrl}
                  className="absolute inset-0 h-full w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-sm bg-paper/95 px-2.5 py-1.5 shadow-sm backdrop-blur">
                  <MapPin size={13} aria-hidden className="text-gold-deep" />
                  <span className="font-serif-ko text-[13px] text-ink">
                    {OFFICE.addressShort}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="font-mono text-[11px] uppercase tracking-label text-ink-mute self-center mr-1">
                  앱으로 열기 →
                </span>
                {mapLinks.map((m) => (
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
