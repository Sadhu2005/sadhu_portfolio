from __future__ import annotations

import json
import re
import shutil
from pathlib import Path

from sqlalchemy.orm import Session

from app.config import settings
from app.icons import icon_for
from app.database import SessionLocal
from app.media_service import ensure_dirs, kind_from_path, mime_for
from app.models import (
    Achievement,
    AchievementMedia,
    Certificate,
    Contact,
    Education,
    Experience,
    ExperienceBullet,
    Media,
    NavItem,
    Profile,
    Project,
    ProjectLink,
    ProjectMedia,
    ProjectTechnology,
    SiteSettings,
    Skill,
    SkillProject,
    Tool,
    WorkflowStep,
)
from app.serialize import skill_matches

FEATURED = ("forgeos", "self-evolving", "genzspace", "anu 6.0", "kavya", "genzflow")


def slugify(value: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")
    return slug or "item"


def first_sentence(text: str) -> str:
    cleaned = " ".join((text or "").split())
    if not cleaned:
        return ""
    piece = cleaned.split(". ")[0].strip()
    if piece and not piece.endswith("."):
        piece += "."
    return piece


def load_json(name: str):
    return json.loads((settings.data_path() / name).read_text(encoding="utf-8"))


def skill_entries(group: dict) -> list[tuple[str, str]]:
    skills = group.get("skills")
    if isinstance(skills, list):
        entries: list[tuple[str, str]] = []
        for item in skills:
            if isinstance(item, str) and item.strip():
                entries.append((item.strip(), ""))
            elif isinstance(item, dict) and str(item.get("name", "")).strip():
                entries.append((str(item["name"]).strip(), str(item.get("level") or "").strip()))
        return entries
    return [(name, "") for name in split_skills(group.get("items", ""))]


def split_skills(raw: str) -> list[str]:
    parts: list[str] = []
    for chunk in raw.split(","):
        if "|" in chunk:
            parts.extend(piece.strip() for piece in chunk.split("|"))
        else:
            parts.append(chunk.strip())
    return [part for part in parts if part]


def media_for_path(db: Session, raw_path: str, caption: str = "") -> Media | None:
    if not raw_path:
        return None
    rel = raw_path.lstrip("/")
    found = db.query(Media).filter(Media.path == rel).one_or_none()
    if found:
        return found
    kind = kind_from_path(rel)
    public_file = settings.public_path() / rel
    size = public_file.stat().st_size if public_file.is_file() else 0
    row = Media(
        kind=kind,
        path=rel,
        mime=mime_for(rel, kind),
        caption=caption,
        byte_size=size,
        original_name=Path(rel).name,
    )
    db.add(row)
    db.flush()
    return row


def register_resume(db: Session) -> Media:
    source = settings.public_path() / "SadhuJ_Resume.pdf"
    rel = "pdf/SadhuJ_Resume.pdf"
    root = ensure_dirs()
    dest = root / rel
    if source.is_file():
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(source, dest)
    found = db.query(Media).filter(Media.path == rel).one_or_none()
    if found:
        return found
    row = Media(
        kind="pdf",
        path=rel,
        mime="application/pdf",
        caption="Resume",
        byte_size=dest.stat().st_size if dest.is_file() else 0,
        original_name="SadhuJ_Resume.pdf",
    )
    db.add(row)
    db.flush()
    return row


def backfill_icons(db: Session) -> None:
    from app.icons import icon_for

    changed = False
    for skill in db.query(Skill).all():
        wanted = icon_for(skill.name, skill.category)
        current = (skill.icon or "").strip()
        if current in ("", "HiChip") and current != wanted:
            skill.icon = wanted
            changed = True
    if changed:
        db.commit()


def seed(db: Session) -> dict:
    if db.query(Profile).first():
        backfill_icons(db)
        return {"status": "already-seeded"}

    site_json = load_json("site.json")
    profile_json = load_json("profile.json")
    contact_json = load_json("contact.json")

    site = SiteSettings(
        title=site_json.get("title", ""),
        description=site_json.get("description", ""),
        copyright="© {year} Sadhu J. All rights reserved.",
        color_background="#090b10",
        color_surface="#141820",
        color_text="#f3efe6",
        color_muted="#a39e93",
        color_copper="#d4894c",
        color_mint="#5ee0c3",
    )
    db.add(site)
    nav = [
        ("About", "/#about"),
        ("Workflow", "/#workflow"),
        ("Work", "/work"),
        ("Skills", "/skills"),
        ("Experience", "/experience"),
        ("Tools", "/tools"),
        ("Achievements", "/achievements"),
        ("Certifications", "/certifications"),
        ("Contact", "/#contact"),
    ]
    for index, (label, href) in enumerate(nav):
        db.add(NavItem(label=label, href=href, sort_order=index))

    about = profile_json.get("about", {})
    intro = profile_json.get("introVideo") or {}
    profile = Profile(
        name=profile_json.get("name", ""),
        tagline=profile_json.get("tagline", ""),
        headline=about.get("headline", ""),
        paragraphs=about.get("paragraphs", []),
        highlights=about.get("highlights", []),
        goal=about.get("goal", ""),
        photo=media_for_path(db, profile_json.get("photo", "")),
        intro_video=media_for_path(db, intro.get("src", ""), "Intro video"),
    )
    db.add(profile)

    contact = Contact(
        email=contact_json.get("email", ""),
        linkedin=contact_json.get("linkedin", ""),
        linkedin_label=contact_json.get("linkedinLabel", ""),
        whatsapp=contact_json.get("whatsapp", ""),
        whatsapp_display=contact_json.get("whatsappDisplay", ""),
        phone=contact_json.get("phone", ""),
        location=contact_json.get("location", ""),
        github=contact_json.get("github", ""),
        github_label=contact_json.get("githubLabel", ""),
        resume=register_resume(db),
    )
    db.add(contact)

    for index, item in enumerate(load_json("education.json")):
        db.add(
            Education(
                degree=item.get("degree", ""),
                institution=item.get("institution", ""),
                university=item.get("university", ""),
                sort_order=index,
            )
        )

    for index, item in enumerate(load_json("experience.json")):
        row = Experience(
            title=item.get("title", ""),
            location=item.get("location", ""),
            period=item.get("period", ""),
            mode=item.get("mode", ""),
            sort_order=index,
        )
        for bullet_index, text in enumerate(item.get("bullets", [])):
            row.bullets.append(ExperienceBullet(text=text, sort_order=bullet_index))
        db.add(row)

    projects: list[Project] = []
    for index, item in enumerate(load_json("projects.json")):
        title = item.get("title", "")
        row = Project(
            slug=slugify(title),
            title=title,
            description=item.get("description", ""),
            problem=first_sentence(item.get("description", "")),
            role="",
            outcome="",
            featured=any(key in title.lower() for key in FEATURED),
            status=item.get("status", ""),
            stage=item.get("stage", ""),
            progress=int(item.get("progress") or 0),
            category=item.get("category", ""),
            impact=item.get("impact", ""),
            team=item.get("team", ""),
            sort_order=index,
        )
        for tech_index, name in enumerate(item.get("technologies", [])):
            row.technologies.append(ProjectTechnology(name=name, sort_order=tech_index))
        if item.get("projectLink"):
            row.links.append(ProjectLink(label="GitHub", url=item["projectLink"]))
        if item.get("websiteLink"):
            row.links.append(ProjectLink(label="Live", url=item["websiteLink"]))
        cover = media_for_path(db, item.get("imageUrl") or "")
        if cover:
            row.media_items.append(ProjectMedia(media=cover, role="cover", sort_order=0))
        db.add(row)
        projects.append(row)
    db.flush()

    for index, item in enumerate(load_json("tools.json")):
        db.add(
            Tool(
                title=item.get("title", ""),
                description=item.get("description", ""),
                features=item.get("features", []),
                status=item.get("status", ""),
                category=item.get("category", ""),
                demo_link=item.get("demoLink", ""),
                github_link=item.get("githubLink", ""),
                sort_order=index,
            )
        )

    for index, item in enumerate(load_json("achievements.json")):
        certificate = media_for_path(db, item.get("certificateUrl") or "")
        row = Achievement(
            event_name=item.get("eventName", ""),
            date=item.get("date", ""),
            outcome=item.get("outcome", ""),
            description=item.get("description", ""),
            tech_used=item.get("techUsed", ""),
            certificate=certificate,
            sort_order=index,
        )
        for media_index, path in enumerate(item.get("media", [])):
            media = media_for_path(db, path)
            if media:
                row.media_items.append(AchievementMedia(media=media, sort_order=media_index))
        db.add(row)

    for index, item in enumerate(load_json("certificates.json")):
        image = media_for_path(db, item.get("src") or "", item.get("caption") or item.get("alt") or "")
        db.add(
            Certificate(
                image=image,
                alt=item.get("alt", ""),
                description=item.get("desc", ""),
                caption=item.get("caption") or "",
                sort_order=index,
            )
        )

    skill_rows: list[Skill] = []
    order = 0
    for group in load_json("skills.json"):
        category = group.get("category", "")
        for name, level in skill_entries(group):
            skill = Skill(
                category=category,
                name=name,
                level=level,
                icon=icon_for(name, category),
                sort_order=order,
            )
            order += 1
            db.add(skill)
            skill_rows.append(skill)
    db.flush()

    for skill in skill_rows:
        linked: set[int] = set()
        for project in projects:
            if any(skill_matches(skill.name, tech.name) for tech in project.technologies):
                if project.id not in linked:
                    skill.links.append(SkillProject(project_id=project.id))
                    linked.add(project.id)

    def find_slug(*needles: str) -> str:
        for project in projects:
            title = project.title.lower()
            if all(needle in title for needle in needles):
                return project.slug
        return ""

    steps = [
        (1, "Frame the problem", "Name the user, the constraint, and what done looks like before writing a model.", find_slug("anu 6.0")),
        (2, "Research the data and constraints", "Look at the signals you actually have: labels, sensors, logs, or offline hardware.", find_slug("fraud")),
        (3, "Model or algorithm", "Pick a model that fits the data and the device, then measure it against a simple baseline.", find_slug("flowmind")),
        (4, "Product surface", "Wrap the model in an API, an Android app, or a web UI a person can use.", find_slug("personal ai")),
        (5, "Ship", "Containerize it, add a pipeline, and run it somewhere you can restart.", find_slug("healthcheckr")),
    ]
    for index, (number, title, body, slug) in enumerate(steps):
        db.add(
            WorkflowStep(
                step_number=number,
                title=title,
                body=body,
                example_project_slug=slug,
                sort_order=index,
            )
        )

    db.commit()
    return {
        "status": "seeded",
        "projects": len(projects),
        "tools": len(load_json("tools.json")),
        "achievements": len(load_json("achievements.json")),
        "certificates": len(load_json("certificates.json")),
        "skills": len(skill_rows),
    }


def main() -> None:
    db = SessionLocal()
    try:
        print(seed(db))
    finally:
        db.close()


if __name__ == "__main__":
    main()
