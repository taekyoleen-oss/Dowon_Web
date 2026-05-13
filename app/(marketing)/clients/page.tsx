import { Container } from "@/components/layout/container";
import { Eyebrow } from "@/components/ui";

export const metadata = { title: "고객사·협력사" };

const groups = [
  {
    title: "보험사",
    items: ["○○화재", "○○생명", "○○해상", "○○손해"],
  },
  {
    title: "기업·기관",
    items: ["○○그룹", "○○공사", "○○협회", "○○재단"],
  },
  {
    title: "전문가 네트워크",
    items: ["대한손해사정사회", "대한의학회 자문 네트워크", "○○ 디지털 포렌식"],
  },
];

export default function ClientsPage() {
  return (
    <section className="section-y">
      <Container size="wide">
        <Eyebrow index={1}>CLIENTS · 고객사·협력사</Eyebrow>
        <h1 className="mt-4 font-display italic text-display text-ink leading-tight">
          Clients & Partners
        </h1>
        <p className="mt-3 font-serif-ko text-h2 text-ink">함께하는 곳</p>
        <p className="mt-8 max-w-[36em] font-serif-ko text-body-lg text-ink-soft leading-base">
          도원과 자문·협업 관계를 맺어 온 보험사·기업·전문가 네트워크. 일부 정보는
          비밀유지의무에 따라 비공개입니다.
        </p>

        <div className="mt-14 space-y-14">
          {groups.map((g) => (
            <section key={g.title}>
              <p className="label-mono text-gold">{g.title}</p>
              <ul className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-px bg-paper-3 border border-paper-3">
                {g.items.map((item) => (
                  <li
                    key={item}
                    className="bg-paper p-6 lg:p-8 font-serif-ko text-body-lg text-ink-soft"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <p className="mt-12 font-mono text-[11px] uppercase tracking-label text-ink-mute">
          * 상호는 도원 내부 양해 하에 일부만 공개합니다.
        </p>
      </Container>
    </section>
  );
}
