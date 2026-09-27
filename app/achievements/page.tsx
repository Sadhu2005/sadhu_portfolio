import AchievementsView from "@/components/views/AchievementsView";
import { getSite } from "@/lib/api";

export async function generateMetadata() {
  try {
    const site = await getSite();
    return { title: `Achievements · ${site.title}`, description: site.description };
  } catch {
    return { title: "Achievements · Sadhu J" };
  }
}

export default function Page() {
  return <AchievementsView />;
}
