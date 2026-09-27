"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import MediaFrame from "@/components/MediaFrame";
import PageState from "@/components/PageState";
import RevealSection from "@/components/RevealSection";
import { useApi } from "@/lib/useApi";
import type { Project } from "@/lib/types";
import { laneClass } from "@/lib/lanes";
import { statusTone } from "@/lib/utils";

const DOMAINS = ["all", "ml", "robotics", "mobile", "devops", "web"];

export default function WorkView() {
  const params = useSearchParams();
  const router = useRouter();
  const domain = params.get("domain") || "all";
  const skill = params.get("skill") || "";
  const query = new URLSearchParams();
  if (domain !== "all") query.set("domain", domain);
  if (skill) query.set("skill", skill);
  const suffix = query.toString() ? `?${query.toString()}` : "";
  const { data, loading, error } = useApi<Project[]>(`/api/projects${suffix}`);

  function setDomain(next: string) {
    const nextParams = new URLSearchParams(params.toString());
    if (next === "all") nextParams.delete("domain");
    else nextParams.set("domain", next);
    const value = nextParams.toString();
    router.replace(value ? `/work?${value}` : "/work");
  }

  return (
    <main className="wrap page-hero">
      <RevealSection>
        <p className="kicker">Work</p>
        <h1>Projects</h1>
        <p className="lede">Filter by the kind of system, or follow a skill from the skills page.</p>
      </RevealSection>
      <div className="filters" role="toolbar" aria-label="Project filters">
        {DOMAINS.map((item) => (
          <button key={item} type="button" className={`filter ${item === "all" ? "" : `filter-${item}`} ${domain === item ? "is-on" : ""}`} onClick={() => setDomain(item)}>
            {item}
          </button>
        ))}
      </div>
      {skill && <p className="muted">Showing work that uses {skill}.</p>}
      <PageState loading={loading} error={error} empty={!loading && !error && (data?.length ?? 0) === 0} emptyLabel="No projects match this filter.">
        <div className="grid-12">
          {data?.map((project, index) => (
            <RevealSection key={project.slug} className="span-4" index={index % 3}>
              <Link href={`/work/${project.slug}`} className="card-link">
                <article className={`surface ${laneClass(project.domain)}`}>
                  <MediaFrame media={project.cover} label="Cover" />
                  <p className={`kicker tone-${statusTone(project.status)}`}>{project.status}</p>
                  <h3>{project.title}</h3>
                  <p className="muted">{project.category}</p>
                </article>
              </Link>
            </RevealSection>
          ))}
        </div>
      </PageState>
    </main>
  );
}
