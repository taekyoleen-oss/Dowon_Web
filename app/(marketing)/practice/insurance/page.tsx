import { PracticeAreaDetail } from "@/components/practice/practice-area-detail";
import { practiceAreas } from "@/lib/data/practice-areas";

export const metadata = { title: "손해보험·생명보험" };

export default function Page() {
  return <PracticeAreaDetail area={practiceAreas["insurance"]} />;
}
