import ExperienceView from "@/components/views/ExperienceView";
import { getSite } from "@/lib/api";

export async function generateMetadata() {
  try {
    const site = await getSite();
    return { title: `Experience · ${site.title}`, description: site.description };
  } catch {
    return { title: "Experience · Sadhu J" };
  }
}

export default function Page() {
  return <ExperienceView />;
}
