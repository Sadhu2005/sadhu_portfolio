from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.database import get_db
from app.queries import (
    load_achievements,
    load_certificates,
    load_contact,
    load_education,
    load_experience,
    load_nav,
    load_profile,
    load_projects,
    load_site,
    load_skills,
    load_tools,
    load_workflow,
)
from app.serialize import (
    achievement_dict,
    certificate_dict,
    contact_dict,
    education_dict,
    experience_dict,
    profile_dict,
    project_dict,
    project_matches_skill,
    site_dict,
    skill_groups,
    stats,
    tool_dict,
    workflow_dict,
)

router = APIRouter()


def _require_seed(db: Session):
    if load_profile(db) is None:
        raise HTTPException(status_code=503, detail="Portfolio is not seeded")


@router.get("/health", tags=["health"])
def health(db: Session = Depends(get_db)):
    db.execute(text("SELECT 1"))
    return {"status": "ok"}


@router.get("/profile", tags=["profile"])
def profile(db: Session = Depends(get_db)):
    _require_seed(db)
    return profile_dict(load_profile(db))


@router.get("/contact", tags=["contact"])
def contact(db: Session = Depends(get_db)):
    _require_seed(db)
    row = load_contact(db)
    if row is None:
        raise HTTPException(status_code=404, detail="Contact missing")
    return contact_dict(row)


@router.get("/education", tags=["education"])
def education(db: Session = Depends(get_db)):
    _require_seed(db)
    return [education_dict(row) for row in load_education(db)]


@router.get("/experience", tags=["experience"])
def experience(db: Session = Depends(get_db)):
    _require_seed(db)
    return [experience_dict(row) for row in load_experience(db)]


@router.get("/skills", tags=["skills"])
def skills(db: Session = Depends(get_db)):
    _require_seed(db)
    return skill_groups(load_skills(db))


@router.get("/projects", tags=["projects"])
def projects(
    featured: bool | None = None,
    category: str | None = None,
    skill: str | None = None,
    domain: str | None = None,
    db: Session = Depends(get_db),
):
    _require_seed(db)
    rows = []
    for project in load_projects(db):
        payload = project_dict(project)
        if featured is not None and project.featured != featured:
            continue
        if category and payload["category"].lower() != category.lower() and payload["domain"] != category.lower():
            continue
        if domain and payload["domain"] != domain.lower():
            continue
        if skill and not project_matches_skill(project, skill):
            continue
        rows.append(payload)
    return rows


@router.get("/projects/{slug}", tags=["projects"])
def project_detail(slug: str, db: Session = Depends(get_db)):
    _require_seed(db)
    for project in load_projects(db):
        if project.slug == slug:
            return project_dict(project)
    raise HTTPException(status_code=404, detail="Project not found")


@router.get("/tools", tags=["tools"])
def tools(db: Session = Depends(get_db)):
    _require_seed(db)
    return [tool_dict(row) for row in load_tools(db)]


@router.get("/achievements", tags=["achievements"])
def achievements(db: Session = Depends(get_db)):
    _require_seed(db)
    return [achievement_dict(row) for row in load_achievements(db)]


@router.get("/certificates", tags=["certificates"])
def certificates(db: Session = Depends(get_db)):
    _require_seed(db)
    return [certificate_dict(row) for row in load_certificates(db)]


@router.get("/site", tags=["site"])
def site(db: Session = Depends(get_db)):
    _require_seed(db)
    row = load_site(db)
    if row is None:
        raise HTTPException(status_code=404, detail="Site settings missing")
    return site_dict(row, load_nav(db))


@router.get("/workflow", tags=["workflow"])
def workflow(db: Session = Depends(get_db)):
    _require_seed(db)
    titles = {project.slug: project.title for project in load_projects(db)}
    return [workflow_dict(step, titles) for step in load_workflow(db)]


@router.get("/home", tags=["home"])
def home(db: Session = Depends(get_db)):
    _require_seed(db)
    profile_row = load_profile(db)
    contact_row = load_contact(db)
    site_row = load_site(db)
    experience_rows = load_experience(db)
    project_rows = load_projects(db)
    titles = {project.slug: project.title for project in project_rows}
    featured = [project_dict(project) for project in project_rows if project.featured]
    return {
        "profile": profile_dict(profile_row),
        "contact": contact_dict(contact_row) if contact_row else None,
        "stats": stats(db, experience_rows),
        "featuredProjects": featured,
        "skillGroups": skill_groups(load_skills(db)),
        "workflow": [workflow_dict(step, titles) for step in load_workflow(db)],
        "experiencePreview": [experience_dict(row) for row in experience_rows[:2]],
        "certificates": [certificate_dict(row) for row in list(reversed(load_certificates(db)))[:12]],
        "site": site_dict(site_row, load_nav(db)) if site_row else None,
    }
