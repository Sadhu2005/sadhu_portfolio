import type {
  Achievement,
  Certificate,
  Contact,
  Education,
  Experience,
  HomePayload,
  Profile,
  Project,
  SiteConfig,
  SkillGroup,
  Tool,
  WorkflowStep,
} from "@/lib/types";

export function apiBase(): string {
  if (typeof window === "undefined") {
    return process.env.API_URL || "http://localhost:8000";
  }
  return process.env.NEXT_PUBLIC_API_URL || "";
}

export function mediaSrc(url: string | null | undefined): string {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${apiBase()}${url}`;
}

export async function getJson<T>(path: string): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(`${apiBase()}${path}`, {
      signal: controller.signal,
      cache: "no-store",
    });
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }
    return (await response.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}

export const getHome = () => getJson<HomePayload>("/api/home");
export const getSite = () => getJson<SiteConfig>("/api/site");
export const getProfile = () => getJson<Profile>("/api/profile");
export const getContact = () => getJson<Contact>("/api/contact");
export const getEducation = () => getJson<Education[]>("/api/education");
export const getExperience = () => getJson<Experience[]>("/api/experience");
export const getSkills = () => getJson<SkillGroup[]>("/api/skills");
export const getProjects = (query = "") => getJson<Project[]>(`/api/projects${query}`);
export const getProject = (slug: string) => getJson<Project>(`/api/projects/${slug}`);
export const getTools = () => getJson<Tool[]>("/api/tools");
export const getAchievements = () => getJson<Achievement[]>("/api/achievements");
export const getCertificates = () => getJson<Certificate[]>("/api/certificates");
export const getWorkflow = () => getJson<WorkflowStep[]>("/api/workflow");
