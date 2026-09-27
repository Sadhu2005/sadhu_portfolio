"use client";

import PageState from "@/components/PageState";
import RevealSection from "@/components/RevealSection";
import { useApi } from "@/lib/useApi";
import type { Tool } from "@/lib/types";
import { laneClass } from "@/lib/lanes";
import { statusTone } from "@/lib/utils";

export default function ToolsView() {
  const { data, loading, error } = useApi<Tool[]>("/api/tools");

  return (
    <main className="wrap page-hero">
      <RevealSection>
        <p className="kicker">Tools</p>
        <h1>Utilities</h1>
        <p className="lede">Smaller tools that sit beside the featured case studies.</p>
      </RevealSection>
      <PageState loading={loading} error={error} empty={!loading && !error && (data?.length ?? 0) === 0} emptyLabel="No tools yet.">
        <div className="grid-12">
          {data?.map((tool, index) => (
            <RevealSection as="article" key={tool.id} className={`surface span-6 ${laneClass(tool.category)}`} index={index % 2}>
              <p className={`kicker tone-${statusTone(tool.status)}`}>{tool.status}</p>
              <h2>{tool.title}</h2>
              <p className="muted">{tool.category}</p>
              <p>{tool.description}</p>
              <div className="chips">
                {tool.features.map((feature) => (
                  <span key={feature} className="chip">{feature}</span>
                ))}
              </div>
              <div className="actions">
                {tool.demoLink && <a className="btn" href={tool.demoLink}>Demo</a>}
                {tool.githubLink && <a className="btn-secondary" href={tool.githubLink}>Source</a>}
              </div>
            </RevealSection>
          ))}
        </div>
      </PageState>
    </main>
  );
}
