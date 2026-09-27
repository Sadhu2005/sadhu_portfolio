import ToolsView from "@/components/views/ToolsView";
import { getSite } from "@/lib/api";

export async function generateMetadata() {
  try {
    const site = await getSite();
    return { title: `Tools · ${site.title}`, description: site.description };
  } catch {
    return { title: "Tools · Sadhu J" };
  }
}

export default function Page() {
  return <ToolsView />;
}
