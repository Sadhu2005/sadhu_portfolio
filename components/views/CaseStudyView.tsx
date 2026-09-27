"use client";

import Link from "next/link";
import MediaFrame from "@/components/MediaFrame";
import PageState from "@/components/PageState";
import RevealSection, { stagger } from "@/components/RevealSection";
import { useApi } from "@/lib/useApi";
import type { Project } from "@/lib/types";
import { laneClass } from "@/lib/lanes";
import { iconKeyFor, SkillIcon } from "@/lib/skillIcons";
import { getProgressColor, statusTone } from "@/lib/utils";

export default function CaseStudyView({ slug }: { slug: string }) {
  const { data, loading, error } = useApi<Project>(`/api/projects/${slug}`);
  const sameCopy = data && data.description.trim() === data.problem.trim();

  return (
    <main className="wrap page-hero">
      <p className="kicker">Case study</p>
      <PageState loading={loading} error={error}>
        {data && (
          <>
            <RevealSection as="header" className={`surface case-head ${laneClass(data.domain)}`}>
              <h1>{data.title}</h1>
              <p className={`tone-${statusTone(data.status)}`}>{data.status} · {data.stage}</p>
            </RevealSection>
            <RevealSection index={1}>
              <MediaFrame media={data.cover} label="Cover" priority />
              <div className="facts">
                <div className="metric"><span>Category</span><strong>{data.category}</strong></div>
                <div className="metric"><span>Impact</span><strong>{data.impact}</strong></div>
                <div className="metric"><span>Team</span><strong>{data.team}</strong></div>
                <div className="metric"><span>Progress</span><strong style={{ color: getProgressColor(data.progress) }}>{data.progress}%</strong></div>
              </div>
              <div className="progress" aria-hidden><span style={{ width: `${data.progress}%`, background: getProgressColor(data.progress) }} /></div>
            </RevealSection>
            {data.problem && (
              <RevealSection as="section" className="section">
                <h2>Problem</h2>
                <p>{data.problem}</p>
              </RevealSection>
            )}
            <RevealSection>
              {data.description && !sameCopy && (
                <section>
                  <h2>What I built</h2>
                  <p>{data.description}</p>
                </section>
              )}
              {data.role && <p><strong>Role. </strong>{data.role}</p>}
              {data.outcome && <p><strong>Outcome. </strong>{data.outcome}</p>}
              <div className="chips">
                {data.technologies.map((tech, techIndex) => (
                  <Link key={tech} className="chip reveal-item" style={stagger(techIndex, 8)} href={`/work?skill=${encodeURIComponent(tech)}`}>
                    {iconKeyFor(tech) && <SkillIcon name={iconKeyFor(tech)} />}
                    {tech}
                  </Link>
                ))}
              </div>
              <div className="actions">
                {data.links.map((link) => (
                  <a key={link.url} className="btn" href={link.url} target="_blank" rel="noopener noreferrer">{link.label}</a>
                ))}
              </div>
            </RevealSection>
            {data.demoVideo && (
              <RevealSection as="section" className="section">
                <h2>Demo</h2>
                <MediaFrame media={data.demoVideo} label="Demo video" />
              </RevealSection>
            )}
            {data.gallery.length > 0 && (
              <RevealSection as="section" className="section">
                <h2>Gallery</h2>
                <div className="media-grid">
                  {data.gallery.map((item, itemIndex) => (
                    <div key={item.id} className="reveal-item" style={stagger(itemIndex % 3)}>
                      <MediaFrame media={item} label="Project image" />
                    </div>
                  ))}
                </div>
              </RevealSection>
            )}
          </>
        )}
      </PageState>
    </main>
  );
}
