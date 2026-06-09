export interface Profile {
  name: string;
  tagline: string;
  photo: string;
  about: {
    headline: string;
    paragraphs: string[];
    highlights: string[];
    goal: string;
  };
  introVideo?: {
    src: string;
    poster: string;
  };
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
  resume: string;
  resumeFilename: string;
}

export interface Education {
  degree: string;
  institution: string;
  university?: string;
}

export interface Experience {
  title: string;
  location: string;
  period: string;
  mode: string;
  bullets: string[];
}

export interface Skill {
  category: string;
  items: string;
}

export interface Project {
  title: string;
  description: string;
  imageUrl?: string;
  projectLink: string;
  websiteLink?: string;
  technologies: string[];
  status: string;
  stage: string;
  progress: number;
  category: string;
  impact: string;
  team: string;
  icon: string;
}

export interface Tool {
  title: string;
  description: string;
  features: string[];
  status: string;
  category: string;
  icon: string;
  demoLink: string;
  githubLink: string;
}

export interface Achievement {
  eventName: string;
  date: string;
  outcome: string;
  description: string;
  techUsed: string;
  certificateUrl: string;
  media: string[];
}

export interface Certificate {
  src: string;
  alt: string;
  desc: string;
  caption?: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface SiteConfig {
  title: string;
  description: string;
  copyright: string;
  nav: NavItem[];
  theme: {
    primary: string;
    secondary: string;
    background: string;
  };
}
