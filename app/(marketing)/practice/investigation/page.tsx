import { PracticeAreaDetail } from "@/components/practice/practice-area-detail";
import { practiceAreas } from "@/lib/data/practice-areas";

export const metadata = { title: "민간조사·형사소송" };

export default function Page() {
  return <PracticeAreaDetail area={practiceAreas["investigation"]} />;
}
