import { PracticeAreaDetail } from "@/components/practice/practice-area-detail";
import { practiceAreas } from "@/lib/data/practice-areas";

export const metadata = { title: "법률자문" };

export default function Page() {
  return <PracticeAreaDetail area={practiceAreas["advisory"]} />;
}
