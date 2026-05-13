import { Container } from "@/components/layout/container";
import { Eyebrow, Button } from "@/components/ui";

export const metadata = { title: "오시는 길" };

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
              <div className="mt-3 aspect-[4/3] w-full bg-paper-2 border border-paper-3 rounded-md flex items-center justify-center">
                <p className="font-mono text-[12px] uppercase tracking-label text-ink-mute text-center px-6">
                  Map placeholder<br />
                  <span className="block mt-2 normal-case tracking-normal text-ink-soft font-serif-ko">
                    지도는 Phase 1 Week 2 후반에 Kakao/Naver Map으로 교체됩니다.
                  </span>
                </p>
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
