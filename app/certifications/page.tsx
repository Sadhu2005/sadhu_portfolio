import CertificatesView from "@/components/views/CertificatesView";
import { getSite } from "@/lib/api";

export async function generateMetadata() {
  try {
    const site = await getSite();
    return { title: `Certifications · ${site.title}`, description: site.description };
  } catch {
    return { title: "Certifications · Sadhu J" };
  }
}

export default function Page() {
  return <CertificatesView />;
}
