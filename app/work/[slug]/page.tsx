import CaseStudyView from "@/components/views/CaseStudyView";
import { getProject } from "@/lib/api";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const project = await getProject(slug);
    return { title: `${project.title} · Sadhu J`, description: project.problem || project.description };
  } catch {
    return { title: "Work · Sadhu J" };
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <CaseStudyView slug={slug} />;
}
