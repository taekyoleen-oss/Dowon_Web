import { Container } from "@/components/layout/container";
import { Eyebrow } from "@/components/ui";
import { OFFICE } from "@/lib/data/office";

export const metadata = {
  title: "개인정보처리방침",
  description:
    "법무법인 도원은 『개인정보 보호법』 제30조에 따라 정보주체의 개인정보 및 권익을 보호합니다.",
  robots: { index: true, follow: true },
};

// Mirror of dowonlaw.com/inform/policy/ — content sourced from the
// official policy effective 2024-05-01. Update the EFFECTIVE_DATE and
// the officers' contact info if/when the live policy changes.
const EFFECTIVE_DATE = "2024년 05월 01일";

const officers = [
  {
    role: "개인정보 보호책임자",
    dept: "경영업무총괄 · 국장",
    name: "송재일",
    phone: "070-8706-5982",
  },
  {
    role: "개인정보 보호담당자",
    dept: "총무팀 · 과장",
    name: "채은진",
    phone: "070-7835-0315",
  },
];

const remedies = [
  {
    name: "개인정보 침해신고센터",
    site: "privacy.kisa.or.kr",
    href: "https://privacy.kisa.or.kr",
    tel: "118",
  },
  {
    name: "개인정보분쟁조정위원회",
    site: "kopico.go.kr",
    href: "https://www.kopico.go.kr",
    tel: "1833-6972",
  },
  {
    name: "대검찰청 사이버수사과",
    site: "spo.go.kr",
    href: "https://www.spo.go.kr",
    tel: "1301",
  },
  {
    name: "경찰청 사이버안전국",
    site: "cyberbureau.police.go.kr",
    href: "https://cyberbureau.police.go.kr",
    tel: "182",
  },
];

export default function PrivacyPage() {
  return (
    <section className="section-y">
      <Container size="base">
        <Eyebrow index={1}>PRIVACY · 개인정보처리방침</Eyebrow>
        <h1 className="mt-4 font-display italic text-display text-ink leading-tight">
          Privacy Policy
        </h1>
        <p className="mt-3 font-serif-ko text-h2 text-ink">개인정보처리방침</p>
        <p className="mt-6 font-mono text-[11px] uppercase tracking-label text-ink-mute">
          시행일 · {EFFECTIVE_DATE}부터
        </p>

        <p className="mt-10 font-serif-ko text-body-lg text-ink leading-loose">
          법무법인 도원(이하 “회사”)은 『개인정보 보호법』 제30조에 따라
          정보주체의 개인정보 및 권익을 보호하고 개인정보와 관련한 정보주체의 고충을
          원활하게 처리할 수 있도록 다음과 같이 개인정보처리방침을 수립·공개합니다.
        </p>

        <Article num="제1조" title="처리하는 개인정보의 항목, 처리 목적, 처리 및 보유 기간">
          <SubH>가. 고객개인정보</SubH>
          <Table
            rows={[
              ["수집 항목", "성명, 생년월일, 연락처, 주소, 이메일 주소, 회사 내 직급, 의뢰사항"],
              ["수집·이용 목적", "사건의 수임·처리 및 그에 따른 연락, 세무 신고, 의뢰인 관리"],
              ["보유 기간", "수집·이용 목적 달성 시 또는 정보주체의 동의 철회 시까지"],
            ]}
          />

          <SubH>나. 변호사 등 전문직 지원자 개인정보</SubH>
          <Table
            rows={[
              [
                "수집 항목",
                "이메일, 사진, 성명, 생년월일, 성별, 주소, 연락처, 학력, 사법시험 정보, 병역사항, 자기소개서, 경력사항(선택: 외국어·해외연수·자격증 등)",
              ],
              ["수집·이용 목적", "변호사 등 전문직 영입을 위한 본인 확인 및 영입 요건 구비 여부 확인"],
              ["보유 기간", "본인의 퇴직 시까지 (영입 거절 시 즉시 파기)"],
            ]}
          />

          <SubH>다. 일반직 지원자 개인정보</SubH>
          <Table
            rows={[
              [
                "수집 항목",
                "이메일, 사진, 성명, 생년월일, 성별, 주소, 연락처, 학력, 자기소개서, 경력사항(선택: 외국어·해외연수·자격증 등)",
              ],
              ["수집·이용 목적", "일반직 채용을 위한 본인 확인 및 채용 요건 구비 여부 확인"],
              ["보유 기간", "본인의 퇴직 시까지 (채용 거절 시 즉시 파기)"],
            ]}
          />

          <p className="mt-6 font-serif-ko text-body text-ink leading-loose">
            <strong>수집 방법:</strong> 회사는 소송 의뢰 및 전화 또는 별도의
            시스템(보험사)을 통하여 개인정보를 수집합니다.
          </p>
        </Article>

        <Article num="제2조" title="개인정보의 파기 절차 및 파기 방법">
          <List
            items={[
              "보유 기간이 경과되었거나 처리 목적이 달성된 경우에는 지체 없이 해당 개인정보를 파기합니다.",
              "파기 대상이 되는 개인정보는 개인정보 보호책임자의 승인을 받아 지정합니다.",
              "종이에 출력된 개인정보는 분쇄기로 분쇄하거나 소각 전문업체를 통해 소각합니다.",
              "전자 파일 형태의 개인정보는 기록을 재생할 수 없는 기술적 방법으로 영구 삭제합니다.",
            ]}
          />
        </Article>

        <Article num="제3조" title="개인정보의 안전성 확보 조치">
          <List
            items={[
              "처리 직원 최소화 및 정기 교육: 개인정보 처리 직원을 최소한으로 제한하고 정기적인 교육을 실시합니다.",
              "내부 관리 계획 수립·시행: 개인정보의 안전한 처리를 위한 내부 관리 계획을 수립하고 시행하고 있습니다.",
              "기술적 보호 조치: 보안 프로그램을 설치하고 주기적으로 갱신·점검하며, 접근 통제 구역을 운영합니다.",
              "접근 권한 관리: 개인정보 처리 시스템에 대한 접근 권한의 부여·변경·말소를 통해 권한을 관리합니다.",
              "문서 보안: 개인정보가 포함된 서류·보조 저장매체 등을 잠금장치가 있는 안전한 장소에 보관합니다.",
              "물리적 접근 통제: 별도의 보관 장소를 두고 출입 통제 절차를 운영합니다.",
            ]}
          />
        </Article>

        <Article num="제4조" title="개인정보의 안전성 확보 조치 (보호 체계)">
          <p className="font-serif-ko text-body text-ink leading-loose">
            회사는 정보주체의 개인정보를 안전하게 처리하기 위해 다음과 같이 3중
            보호 체계를 운영합니다.
          </p>
          <List
            items={[
              "물리적 보호조치 — 데이터센터·서고 등 시설에 대한 접근을 제한합니다.",
              "관리적 보호조치 — 내부 관리 계획 수립 및 정기 교육을 실시합니다.",
              "기술적 보호조치 — 접근 통제·권한 관리·보안 프로그램·암호화 등을 적용합니다.",
            ]}
          />
        </Article>

        <Article num="제5조" title="개인정보 처리방침의 변경">
          <p className="font-serif-ko text-body text-ink leading-loose">
            본 개인정보처리방침은 법령·정책 또는 보안 기술의 변경에 따라 내용의
            추가·삭제 및 수정이 있을 수 있으며, 변경 시 변경된 사항은 시행 전
            본 페이지를 통해 고지합니다.
          </p>
        </Article>

        <Article num="제6조" title="권익 침해 구제 방법">
          <p className="font-serif-ko text-body text-ink leading-loose">
            정보주체는 개인정보 침해로 인한 구제를 받기 위하여 아래 기관에 분쟁
            해결이나 상담 등을 신청할 수 있습니다.
          </p>
          <ul className="mt-6 grid gap-px bg-paper-3 border border-paper-3 sm:grid-cols-2">
            {remedies.map((r) => (
              <li key={r.name} className="bg-paper p-5">
                <p className="font-serif-ko text-body font-semibold text-ink">
                  {r.name}
                </p>
                <p className="mt-2 font-mono text-[12px] text-ink-soft">
                  Tel <span className="text-ink">{r.tel}</span>
                </p>
                <a
                  href={r.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex font-mono text-[11px] text-ink-mute hover:text-ink underline underline-offset-2"
                >
                  {r.site}
                </a>
              </li>
            ))}
          </ul>
        </Article>

        <Article num="제7조" title="개인정보 보호책임자">
          <p className="font-serif-ko text-body text-ink leading-loose">
            회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와
            관련한 정보주체의 불만 처리 및 피해 구제를 위하여 아래와 같이 개인정보
            보호책임자를 지정합니다.
          </p>
          <ul className="mt-6 grid gap-px bg-paper-3 border border-paper-3 sm:grid-cols-2">
            {officers.map((o) => (
              <li key={o.role} className="bg-paper p-5">
                <p className="font-mono text-[11px] uppercase tracking-label text-gold">
                  {o.role}
                </p>
                <p className="mt-2 font-serif-ko text-body text-ink-soft">{o.dept}</p>
                <p className="mt-2 font-serif-ko text-h3 font-semibold text-ink">
                  {o.name}
                </p>
                <p className="mt-1 font-mono text-[12px] text-ink-soft">
                  Tel{" "}
                  <a
                    href={`tel:${o.phone.replace(/-/g, "")}`}
                    className="text-ink hover:text-gold-deep"
                  >
                    {o.phone}
                  </a>
                </p>
              </li>
            ))}
          </ul>
        </Article>

        <div className="mt-16 border-t border-paper-3 pt-6 font-mono text-[11px] uppercase tracking-label text-ink-mute">
          시행일 · {EFFECTIVE_DATE}부터 · {OFFICE.name}
        </div>
      </Container>
    </section>
  );
}

function Article({
  num,
  title,
  children,
}: {
  num: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-14 border-t border-paper-3 pt-10">
      <p className="font-mono text-[11px] uppercase tracking-label text-gold">
        {num}
      </p>
      <h2 className="mt-3 font-serif-ko text-h2 font-semibold text-ink">
        {title}
      </h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function SubH({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mt-7 font-serif-ko text-h3 font-semibold text-ink">
      {children}
    </h3>
  );
}

function Table({ rows }: { rows: Array<[string, string]> }) {
  return (
    <dl className="mt-4 border border-paper-3 rounded-sm overflow-hidden">
      {rows.map(([label, value], i) => (
        <div
          key={label}
          className={
            "grid grid-cols-[140px_1fr] gap-4 px-4 py-3 font-serif-ko text-[14.5px]" +
            (i > 0 ? " border-t border-paper-3" : "") +
            " bg-paper"
          }
        >
          <dt className="font-mono text-[11px] uppercase tracking-label text-ink-mute self-start mt-0.5">
            {label}
          </dt>
          <dd className="text-ink leading-relaxed">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3 font-serif-ko text-body text-ink leading-loose">
      {items.map((it, i) => (
        <li key={i} className="flex gap-3">
          <span aria-hidden className="mt-3 h-px w-3 shrink-0 bg-gold" />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}
