import profileData from '@/data/profile.json';
import contactData from '@/data/contact.json';
import educationData from '@/data/education.json';
import experienceData from '@/data/experience.json';
import skillsData from '@/data/skills.json';
import projectsData from '@/data/projects.json';
import toolsData from '@/data/tools.json';
import achievementsData from '@/data/achievements.json';
import certificatesData from '@/data/certificates.json';
import siteData from '@/data/site.json';

import type {
  Profile,
  Contact,
  Education,
  Experience,
  Skill,
  Project,
  Tool,
  Achievement,
  Certificate,
  SiteConfig,
} from '@/lib/types';

export const profile = profileData as Profile;
export const contact = contactData as Contact;
export const education = educationData as Education[];
export const experience = experienceData as Experience[];
export const skills = skillsData as Skill[];
export const projects = projectsData as Project[];
export const tools = toolsData as Tool[];
export const achievements = achievementsData as Achievement[];
export const certificates = certificatesData as Certificate[];
export const site = siteData as SiteConfig;
