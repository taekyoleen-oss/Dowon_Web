import { Hero } from "@/components/home/hero";
import { IntegratedModel } from "@/components/home/integrated-model";
import { PersonaGateway } from "@/components/home/persona-gateway";
import { AiToolsStrip } from "@/components/home/ai-tools-strip";
import { ProofPoints } from "@/components/home/proof-points";
import { RecentInsights } from "@/components/home/recent-insights";
import { CtaStrip } from "@/components/home/cta-strip";

export default function HomePage() {
  return (
    <>
      <Hero />
      <IntegratedModel />
      <PersonaGateway />
      <AiToolsStrip />
      <ProofPoints />
      <RecentInsights />
      <CtaStrip />
    </>
  );
}
