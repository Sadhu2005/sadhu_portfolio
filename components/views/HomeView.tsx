"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import MediaFrame from "@/components/MediaFrame";
import PageState from "@/components/PageState";
import RevealSection, { stagger } from "@/components/RevealSection";
import ScrollRail from "@/components/ScrollRail";
import SkillMarquee from "@/components/SkillMarquee";
import { mediaSrc } from "@/lib/api";
import { laneAt, laneClass, WORKFLOW_ICONS } from "@/lib/lanes";
import { SkillIcon } from "@/lib/skillIcons";
import { useApi } from "@/lib/useApi";
import type { HomePayload } from "@/lib/types";

const SECTIONS = [
  { id: "about", label: "About" },
  { id: "direction", label: "Direction" },
  { id: "workflow", label: "Workflow" },
  { id: "work", label: "Work" },
  { id: "skills", label: "Skills" },
  { id: "proof", label: "Proof" },
];

function heroDelay(seconds: number): CSSProperties {
  return { "--d": `${seconds}s` } as CSSProperties;
}

export default function HomeView() {
  const { data, loading, error } = useApi<HomePayload>("/api/home");
  const [current, setCurrent] = useState("about");
  const [pastHero, setPastHero] = useState(false);
  const hero = useRef<HTMLElement>(null);

  useEffect(() => {
    const nodes = SECTIONS.map((section) => document.getElementById(section.id)).filter(Boolean) as HTMLElement[];
    if (nodes.length === 0) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setCurrent(visible.target.id);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0.15, 0.4] },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [data]);

  useEffect(() => {
    function onScroll() {
      const el = hero.current;
      if (!el) return;
      setPastHero(window.scrollY > Math.min(160, el.offsetHeight / 3));
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [data]);

  return (
    <PageState loading={loading} error={error}>
      {data && (
        <main>
          <section ref={hero} className="hero wrap">
            <div className="hero-grid">
              <div className="portrait-wrap hero-photo">
                <MediaFrame media={data.profile.photo} label="Portrait" priority />
              </div>
              <div>
                <p className="kicker hero-step" style={heroDelay(0.08)}>AI systems</p>
                <h1 className="hero-name" style={heroDelay(0.08)}>{data.profile.name}</h1>
                <p className="lede hero-step" style={heroDelay(0.16)}>{data.profile.tagline}</p>
                <div className="actions hero-step" style={heroDelay(0.24)}>
                  {data.contact?.resume && !data.contact.resume.missing && (
                    <a className="btn" href={mediaSrc(data.contact.resume.url)} download={data.contact.resume.filename}>
                      Download resume
                    </a>
                  )}
                  <a className="btn-secondary" href="#work">
                    Selected work
                  </a>
                </div>
              </div>
            </div>
            {data.stats.currentRole && (
              <p className="now-strip hero-step" style={heroDelay(0.32)}>
                <span>Now</span>
                {data.stats.currentRole}
              </p>
            )}
            <SkillMarquee groups={data.skillGroups} />
            {data.profile.introVideo && !data.profile.introVideo.missing && (
              <div className="section" style={{ paddingTop: "2rem" }}>
                <video className="media-frame" src={mediaSrc(data.profile.introVideo.url)} controls playsInline preload="metadata" />
              </div>
            )}
            <div className="metrics">
              <div className="metric metric-copper hero-step" style={heroDelay(0.36)}><strong>{data.stats.projects}</strong><span>Projects</span></div>
              <div className="metric metric-mint hero-step" style={heroDelay(0.44)}><strong>{data.stats.achievements}</strong><span>Achievements</span></div>
              <div className="metric metric-ml hero-step" style={heroDelay(0.52)}><strong>{data.stats.certificates}</strong><span>Certificates</span></div>
              <div className="metric metric-devops hero-step" style={heroDelay(0.6)}><strong>{data.stats.currentRole || "—"}</strong><span>Current role</span></div>
            </div>
            <div className="scroll-cue-wrap hero-step" style={heroDelay(0.6)}>
              <a
                href="#about"
                className={`scroll-cue ${pastHero ? "is-hidden" : ""}`}
                aria-hidden={pastHero || undefined}
                tabIndex={pastHero ? -1 : undefined}
              >
                Scroll
                <span className="scroll-cue-arrow" aria-hidden>↓</span>
              </a>
            </div>
          </section>

          <nav className="section-index wrap" aria-label="On this page">
            {SECTIONS.map((section) => (
              <a key={section.id} href={`#${section.id}`} className={current === section.id ? "is-on" : ""}>
                {section.label}
              </a>
            ))}
          </nav>

          <section id="about" className="section wrap">
            <RevealSection>
              <p className="kicker">About</p>
              <h2>{data.profile.about.headline}</h2>
              {data.profile.about.paragraphs.map((paragraph) => (
                <p key={paragraph} className="muted">{paragraph}</p>
              ))}
              <ul>
                {data.profile.about.highlights.map((item, index) => (
                  <li key={item} className="reveal-item" style={stagger(index + 1)}>{item}</li>
                ))}
              </ul>
              <p><strong>Goal. </strong>{data.profile.about.goal}</p>
            </RevealSection>
          </section>

          <section id="direction" className="section wrap">
            <RevealSection>
              <p className="kicker">Direction</p>
              <h2>Where the work is going</h2>
              <div className="direction-grid">
                <article className="surface reveal-item" style={stagger(1)}>
                  <h3>Now</h3>
                  <ul>
                    <li>Software at ODEE: React Native, web, and CI/CD</li>
                    <li>Computer vision and local LLMs</li>
                    <li>Docker, GitHub Actions, and DigitalOcean</li>
                    <li>Raspberry Pi and the ANU humanoid work</li>
                  </ul>
                </article>
                <article className="surface direction-next reveal-item" style={stagger(2)}>
                  <h3>Next</h3>
                  <ul>
                    <li>Agent loop: reason, plan, memory, tools, then multi-step execution</li>
                    <li>ROS 2, SLAM, and C++ for robots</li>
                    <li>Operating systems, kernel, and hardware interaction</li>
                  </ul>
                </article>
              </div>
              <p className="muted direction-star reveal-item" style={stagger(3)}>
                North star: build intelligent autonomous systems end to end, from the model and agent through software and infrastructure to physical robots.
              </p>
            </RevealSection>
          </section>

          <section id="workflow" className="section wrap">
            <RevealSection>
              <p className="kicker">Workflow</p>
              <h2>How the work gets built</h2>
            </RevealSection>
            <ScrollRail label="Workflow" variant="card" fit rise emptyLabel="Workflow steps will show up here.">
              {data.workflow.map((step, index) => (
                <article key={step.id} className={`workflow-step ${laneAt(index)} ${index === 0 ? "is-active" : ""}`}>
                  <div className="step-no">
                    <SkillIcon name={WORKFLOW_ICONS[index % WORKFLOW_ICONS.length]} />
                    0{step.stepNumber}
                  </div>
                  <h3>{step.title}</h3>
                  <p className="muted">{step.body}</p>
                  {step.exampleProjectSlug && (
                    <Link href={`/work/${step.exampleProjectSlug}`}>{step.exampleProjectTitle || "Example"}</Link>
                  )}
                </article>
              ))}
            </ScrollRail>
          </section>

          <section id="work" className="section wrap">
            <RevealSection>
              <p className="kicker">Selected work</p>
              <h2>Case studies</h2>
            </RevealSection>
            <ScrollRail label="Featured work" variant="half" rise emptyLabel="No featured projects yet.">
              {data.featuredProjects.map((project) => (
                <Link key={project.slug} href={`/work/${project.slug}`} className="card-link">
                  <article className={`surface ${laneClass(project.domain)}`}>
                    <MediaFrame media={project.cover} label="Cover" />
                    <p className="kicker" style={{ marginTop: "1rem" }}>{project.category}</p>
                    <h3>{project.title}</h3>
                    <p className="muted">{project.problem}</p>
                  </article>
                </Link>
              ))}
            </ScrollRail>
          </section>

          <section id="skills" className="section wrap">
            <RevealSection>
              <p className="kicker">Skills</p>
              <h2>What the projects are built with</h2>
            </RevealSection>
            <ScrollRail label="Skill categories" rise emptyLabel="No skills yet.">
              {data.skillGroups.map((group) => (
                <div key={group.category} className={`surface ${laneClass(group.category)}`}>
                  <h3>{group.category}</h3>
                  <div className="chips">
                    {group.skills.map((skill) => (
                      <Link key={skill.id} className="chip" href={`/work?skill=${encodeURIComponent(skill.name)}`}>
                        <SkillIcon name={skill.icon} />
                        {skill.name}
                        {skill.level ? <span className="chip-level">{skill.level}</span> : null}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </ScrollRail>
          </section>

          <section className="section wrap">
            <RevealSection>
              <p className="kicker">Experience</p>
              <h2>Recent roles</h2>
              <div className="timeline">
                {data.experiencePreview.map((role, index) => (
                  <article key={role.id} className="surface reveal-item" style={stagger(index + 1)}>
                    <h3>{role.title}</h3>
                    <p className="muted">{[role.period, role.mode].filter(Boolean).join(" · ")}</p>
                  </article>
                ))}
              </div>
              <p><Link href="/experience">Full timeline</Link></p>
            </RevealSection>
          </section>

          <section id="proof" className="section wrap">
            <RevealSection>
              <p className="kicker">Proof</p>
              <h2>Latest credentials</h2>
            </RevealSection>
            <ScrollRail label="Certificates" variant="card" rise emptyLabel="No certificates yet.">
              {(data.certificates || []).map((item, index) => (
                <Link key={item.id} href="/certifications" className={`card-link cert-card ${laneAt(index)}`}>
                  <MediaFrame media={item.image} label={item.alt || "Certificate"} />
                  <span className="muted cert-caption">{item.desc}</span>
                </Link>
              ))}
            </ScrollRail>
          </section>

          <section id="contact" className="section wrap">
            <RevealSection>
              <p className="kicker">Contact</p>
              <h2>Start a conversation</h2>
              {data.contact && (
                <div className="actions">
                  <a className="btn reveal-item" style={stagger(1)} href={`mailto:${data.contact.email}`}>{data.contact.email}</a>
                  <a className="btn-secondary reveal-item" style={stagger(2)} href={data.contact.github}>{data.contact.githubLabel}</a>
                  <a className="btn-secondary reveal-item" style={stagger(3)} href={data.contact.linkedin}>{data.contact.linkedinLabel}</a>
                  <a className="btn-secondary reveal-item" style={stagger(4)} href={data.contact.whatsapp}>{data.contact.whatsappDisplay}</a>
                </div>
              )}
              <p className="muted">{data.contact?.phone} · {data.contact?.location}</p>
              {data.contact?.resume && !data.contact.resume.missing && (
                <p><a href={mediaSrc(data.contact.resume.url)}>Resume</a></p>
              )}
            </RevealSection>
          </section>
        </main>
      )}
    </PageState>
  );
}
