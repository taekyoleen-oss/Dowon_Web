import { Hero } from "@/components/home/hero";
import { IntegratedModel } from "@/components/home/integrated-model";
import { PersonaGateway } from "@/components/home/persona-gateway";
import { AiToolsStrip } from "@/components/home/ai-tools-strip";
import { ProofPoints } from "@/components/home/proof-points";
import { RecentInsights } from "@/components/home/recent-insights";
import { CtaStrip } from "@/components/home/cta-strip";
import { JsonLd } from "@/components/seo/json-ld";
import { legalServiceSchema } from "@/lib/seo/schemas";

export default function HomePage() {
  return (
    <>
      <JsonLd data={legalServiceSchema()} />
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
