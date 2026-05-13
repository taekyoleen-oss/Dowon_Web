import { PracticeAreaDetail } from "@/components/practice/practice-area-detail";
import { practiceAreas } from "@/lib/data/practice-areas";

export const metadata = { title: "의료분쟁" };

export default function Page() {
  return <PracticeAreaDetail area={practiceAreas["medical"]} />;
}
