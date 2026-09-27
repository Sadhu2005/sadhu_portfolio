"use client";

import { useReducedMotion } from "framer-motion";
import { SkillIcon } from "@/lib/skillIcons";
import type { SkillGroup } from "@/lib/types";

export default function SkillMarquee({ groups }: { groups: SkillGroup[] }) {
  const reduce = useReducedMotion();
  const skills = groups.flatMap((group) => group.skills).slice(0, 28);
  if (skills.length === 0) return null;
  const loop = reduce ? skills : [...skills, ...skills];

  return (
    <div className={`marquee ${reduce ? "is-static" : ""}`} tabIndex={0} aria-label="Skill icons">
      <div className="marquee-track">
        {loop.map((skill, index) => (
          <span className="marquee-item" key={`${skill.id}-${index}`}>
            <SkillIcon name={skill.icon} />
            {skill.name}
          </span>
        ))}
      </div>
    </div>
  );
}
