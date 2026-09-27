from __future__ import annotations

import re
from datetime import datetime

from sqlalchemy.orm import Session

from app.media_service import media_is_missing, resolve_file
from app.models import (
    Achievement,
    Certificate,
    Contact,
    Education,
    Experience,
    Media,
    Profile,
    Project,
    SiteSettings,
    Skill,
    Tool,
    WorkflowStep,
)


def copyright_text(raw: str) -> str:
    return (raw or "").replace("{year}", str(datetime.now().year))


def media_dict(media: Media | None) -> dict | None:
    if media is None:
        return None
    missing = media_is_missing(media)
    thumb_ok = bool(media.thumb_path) and resolve_file(media, "thumb") is not None
    return {
        "id": media.id,
        "kind": media.kind,
        "url": f"/media/{media.id}",
        "thumbUrl": f"/media/{media.id}?variant=thumb" if thumb_ok else None,
        "caption": media.caption or "",
        "missing": missing,
        "filename": media.original_name or media.path.rsplit("/", 1)[-1],
    }


def domain_for(category: str, technologies: list[str]) -> str:
    cat = (category or "").lower()
    tech = " ".join(technologies).lower()
    if any(key in cat for key in ("robot", "iot")):
        return "robotics"
    if "devops" in cat or "monitor" in cat:
        return "devops"
    if any(key in cat for key in ("mobile", "android")):
        return "mobile"
    if any(key in cat for key in ("social", "web")):
        return "web"
    if any(key in tech for key in ("android", "kotlin", "flutter", "jetpack")):
        return "mobile"
    return "ml"


def project_dict(project: Project) -> dict:
    technologies = [item.name for item in project.technologies]
    cover = next((item.media for item in project.media_items if item.role == "cover"), None)
    demo = next((item.media for item in project.media_items if item.role == "demo"), None)
    gallery = [item.media for item in project.media_items if item.role == "gallery"]
    return {
        "id": project.id,
        "slug": project.slug,
        "title": project.title,
        "description": project.description,
        "problem": project.problem,
        "role": project.role,
        "outcome": project.outcome,
        "featured": project.featured,
        "status": project.status,
        "stage": project.stage,
        "progress": project.progress,
        "category": project.category,
        "domain": domain_for(project.category, technologies),
        "impact": project.impact,
        "team": project.team,
        "technologies": technologies,
        "links": [{"label": link.label, "url": link.url} for link in project.links if link.url],
        "cover": media_dict(cover),
        "demoVideo": media_dict(demo),
        "gallery": [item for item in (media_dict(media) for media in gallery) if item],
    }


def profile_dict(profile: Profile) -> dict:
    return {
        "name": profile.name,
        "tagline": profile.tagline,
        "photo": media_dict(profile.photo),
        "about": {
            "headline": profile.headline,
            "paragraphs": profile.paragraphs or [],
            "highlights": profile.highlights or [],
            "goal": profile.goal,
        },
        "introVideo": media_dict(profile.intro_video),
    }


def contact_dict(contact: Contact) -> dict:
    return {
        "email": contact.email,
        "linkedin": contact.linkedin,
        "linkedinLabel": contact.linkedin_label,
        "whatsapp": contact.whatsapp,
        "whatsappDisplay": contact.whatsapp_display,
        "phone": contact.phone,
        "location": contact.location,
        "github": contact.github,
        "githubLabel": contact.github_label,
        "resume": media_dict(contact.resume),
    }


def education_dict(row: Education) -> dict:
    return {
        "id": row.id,
        "degree": row.degree,
        "institution": row.institution,
        "university": row.university or "",
    }


def experience_dict(row: Experience) -> dict:
    return {
        "id": row.id,
        "title": row.title,
        "location": row.location,
        "period": row.period,
        "mode": row.mode,
        "bullets": [bullet.text for bullet in row.bullets],
    }


def skill_groups(skills: list[Skill]) -> list[dict]:
    groups: list[dict] = []
    index: dict[str, dict] = {}
    for skill in skills:
        bucket = index.get(skill.category)
        if bucket is None:
            bucket = {"category": skill.category, "skills": []}
            index[skill.category] = bucket
            groups.append(bucket)
        projects = []
        for link in skill.links:
            if link.project:
                projects.append({"slug": link.project.slug, "title": link.project.title})
        bucket["skills"].append(
            {
                "id": skill.id,
                "name": skill.name,
                "icon": skill.icon or "HiChip",
                "level": skill.level or "",
                "projects": projects,
            }
        )
    return groups


def tool_dict(tool: Tool) -> dict:
    return {
        "id": tool.id,
        "title": tool.title,
        "description": tool.description,
        "features": tool.features or [],
        "status": tool.status,
        "category": tool.category,
        "demoLink": tool.demo_link,
        "githubLink": tool.github_link,
    }


def achievement_dict(row: Achievement) -> dict:
    return {
        "id": row.id,
        "eventName": row.event_name,
        "date": row.date,
        "outcome": row.outcome,
        "description": row.description,
        "techUsed": row.tech_used,
        "certificate": media_dict(row.certificate),
        "media": [item for item in (media_dict(link.media) for link in row.media_items) if item],
    }


def certificate_dict(row: Certificate) -> dict:
    return {
        "id": row.id,
        "alt": row.alt,
        "desc": row.description,
        "caption": row.caption or "",
        "image": media_dict(row.image),
    }


def site_dict(site: SiteSettings, nav: list) -> dict:
    return {
        "title": site.title,
        "description": site.description,
        "copyright": copyright_text(site.copyright),
        "nav": [{"label": item.label, "href": item.href} for item in nav],
        "theme": {
            "background": site.color_background,
            "surface": site.color_surface,
            "text": site.color_text,
            "muted": site.color_muted,
            "copper": site.color_copper,
            "mint": site.color_mint,
        },
    }


def workflow_dict(step: WorkflowStep, titles: dict[str, str]) -> dict:
    return {
        "id": step.id,
        "stepNumber": step.step_number,
        "title": step.title,
        "body": step.body,
        "exampleProjectSlug": step.example_project_slug,
        "exampleProjectTitle": titles.get(step.example_project_slug, ""),
    }


def skill_matches(skill: str, tech: str) -> bool:
    left = skill.lower().strip()
    right = tech.lower().strip()
    if not left or not right:
        return False
    if left == right:
        return True
    if len(left) < 4 or len(right) < 4:
        return False
    pattern = re.compile(rf"(?<![a-z0-9]){re.escape(left)}(?![a-z0-9])")
    other = re.compile(rf"(?<![a-z0-9]){re.escape(right)}(?![a-z0-9])")
    return pattern.search(right) is not None or other.search(left) is not None


def project_matches_skill(project: Project, skill: str) -> bool:
    return any(skill_matches(skill, item.name) for item in project.technologies)


def stats(db: Session, experience: list[Experience]) -> dict:
    current = experience[0].title if experience else ""
    return {
        "projects": db.query(Project).count(),
        "achievements": db.query(Achievement).count(),
        "certificates": db.query(Certificate).count(),
        "currentRole": current,
    }
