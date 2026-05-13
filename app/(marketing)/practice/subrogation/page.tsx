import { PracticeAreaDetail } from "@/components/practice/practice-area-detail";
import { practiceAreas } from "@/lib/data/practice-areas";

export const metadata = { title: "구상·고액보상·합의절충" };

export default function Page() {
  return <PracticeAreaDetail area={practiceAreas["subrogation"]} />;
}
