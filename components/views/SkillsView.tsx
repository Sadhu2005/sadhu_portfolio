"use client";

import Link from "next/link";
import PageState from "@/components/PageState";
import RevealSection, { stagger } from "@/components/RevealSection";
import { laneClass } from "@/lib/lanes";
import { SkillIcon } from "@/lib/skillIcons";
import { useApi } from "@/lib/useApi";
import type { SkillGroup } from "@/lib/types";

export default function SkillsView() {
  const { data, loading, error } = useApi<SkillGroup[]>("/api/skills");
  const empty = !loading && !error && (data?.length ?? 0) === 0;

  return (
    <main className="wrap page-hero">
      <p className="kicker">Skills</p>
      <h1>Grouped by the work</h1>
      <p className="lede">
        Each chip opens the projects that already list that technology. The word on a chip is the current position.
        ROS 2, SLAM, navigation, and kernel work are the next target, not skills already held.
      </p>
      <PageState loading={loading} error={error} empty={empty} emptyLabel="No skills yet.">
        <div className="skill-columns">
          {data?.map((group, groupIndex) => (
            <RevealSection as="section" key={group.category} className={`surface ${laneClass(group.category)}`} index={groupIndex % 2}>
              <h2>{group.category}</h2>
              <div className="chips">
                {group.skills.map((skill, skillIndex) => (
                  <Link key={skill.id} className="chip reveal-item" style={stagger(skillIndex + 1, 8)} href={`/work?skill=${encodeURIComponent(skill.name)}`}>
                    <SkillIcon name={skill.icon} />
                    {skill.name}
                    {skill.level ? <span className="chip-level">{skill.level}</span> : null}
                  </Link>
                ))}
              </div>
            </RevealSection>
          ))}
        </div>
      </PageState>
    </main>
  );
}
