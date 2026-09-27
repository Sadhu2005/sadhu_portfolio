export interface MediaRef {
  id: number;
  kind: "image" | "video" | "audio" | "pdf" | string;
  url: string;
  thumbUrl: string | null;
  caption: string;
  missing: boolean;
  filename: string;
}

export interface Profile {
  name: string;
  tagline: string;
  photo: MediaRef | null;
  about: {
    headline: string;
    paragraphs: string[];
    highlights: string[];
    goal: string;
  };
  introVideo: MediaRef | null;
}

export interface Contact {
  email: string;
  linkedin: string;
  linkedinLabel: string;
  whatsapp: string;
  whatsappDisplay: string;
  phone: string;
  location: string;
  github: string;
  githubLabel: string;
  resume: MediaRef | null;
}

export interface Education {
  id: number;
  degree: string;
  institution: string;
  university: string;
}

export interface Experience {
  id: number;
  title: string;
  location: string;
  period: string;
  mode: string;
  bullets: string[];
}

export interface SkillLink {
  slug: string;
  title: string;
}

export interface SkillItem {
  id: number;
  name: string;
  icon: string;
  level: string;
  projects: SkillLink[];
}

export interface SkillGroup {
  category: string;
  skills: SkillItem[];
}

export interface ProjectLink {
  label: string;
  url: string;
}

export interface Project {
  id: number;
  slug: string;
  title: string;
  description: string;
  problem: string;
  role: string;
  outcome: string;
  featured: boolean;
  status: string;
  stage: string;
  progress: number;
  category: string;
  domain: string;
  impact: string;
  team: string;
  technologies: string[];
  links: ProjectLink[];
  cover: MediaRef | null;
  demoVideo: MediaRef | null;
  gallery: MediaRef[];
}

export interface Tool {
  id: number;
  title: string;
  description: string;
  features: string[];
  status: string;
  category: string;
  demoLink: string;
  githubLink: string;
}

export interface Achievement {
  id: number;
  eventName: string;
  date: string;
  outcome: string;
  description: string;
  techUsed: string;
  certificate: MediaRef | null;
  media: MediaRef[];
}

export interface Certificate {
  id: number;
  alt: string;
  desc: string;
  caption: string;
  image: MediaRef | null;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface SiteTheme {
  background: string;
  surface: string;
  text: string;
  muted: string;
  copper: string;
  mint: string;
}

export interface SiteConfig {
  title: string;
  description: string;
  copyright: string;
  nav: NavItem[];
  theme: SiteTheme;
}

export interface WorkflowStep {
  id: number;
  stepNumber: number;
  title: string;
  body: string;
  exampleProjectSlug: string;
  exampleProjectTitle: string;
}

export interface HomeStats {
  projects: number;
  achievements: number;
  certificates: number;
  currentRole: string;
}

export interface HomePayload {
  profile: Profile;
  contact: Contact | null;
  stats: HomeStats;
  featuredProjects: Project[];
  skillGroups: SkillGroup[];
  workflow: WorkflowStep[];
  experiencePreview: Experience[];
  certificates: Certificate[];
  site: SiteConfig | null;
}
