"use client";

import PageState from "@/components/PageState";
import RevealSection from "@/components/RevealSection";
import { useApi } from "@/lib/useApi";
import type { Education, Experience } from "@/lib/types";

export default function ExperienceView() {
  const experience = useApi<Experience[]>("/api/experience");
  const education = useApi<Education[]>("/api/education");
  const loading = experience.loading || education.loading;
  const error = experience.error || education.error;

  return (
    <main className="wrap page-hero">
      <p className="kicker">Experience</p>
      <h1>Timeline</h1>
      <PageState loading={loading} error={error} empty={!loading && !error && (experience.data?.length ?? 0) === 0} emptyLabel="No experience yet.">
        <div className="timeline">
          {experience.data?.map((role, index) => (
            <RevealSection as="article" key={role.id} className="surface" index={Math.min(index, 3)}>
              <h2>{role.title}</h2>
              <p className="muted">{[role.period, role.mode, role.location].filter(Boolean).join(" · ")}</p>
              <ul>
                {role.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </RevealSection>
          ))}
        </div>
        <section className="section">
          <h2>Education</h2>
          <div className="timeline">
            {education.data?.map((item, index) => (
              <RevealSection as="article" key={item.id} className="surface" index={Math.min(index, 3)}>
                <h3>{item.degree}</h3>
                <p>{item.institution}</p>
                {item.university && <p className="muted">{item.university}</p>}
              </RevealSection>
            ))}
          </div>
        </section>
      </PageState>
    </main>
  );
}
