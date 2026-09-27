import { Suspense } from "react";
import WorkView from "@/components/views/WorkView";
import { getSite } from "@/lib/api";

export async function generateMetadata() {
  try {
    const site = await getSite();
    return { title: `Work · ${site.title}`, description: site.description };
  } catch {
    return { title: "Work · Sadhu J" };
  }
}

export default function Page() {
  return (
    <Suspense fallback={<p className="state wrap">Loading…</p>}>
      <WorkView />
    </Suspense>
  );
}
