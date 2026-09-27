import SkillsView from "@/components/views/SkillsView";
import { getSite } from "@/lib/api";

export async function generateMetadata() {
  try {
    const site = await getSite();
    return { title: `Skills · ${site.title}`, description: site.description };
  } catch {
    return { title: "Skills · Sadhu J" };
  }
}

export default function Page() {
  return <SkillsView />;
}
