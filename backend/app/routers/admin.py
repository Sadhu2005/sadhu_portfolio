from __future__ import annotations

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import require_admin
from app.media_service import delete_media, save_upload
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
from app.queries import load_contact, load_profile, load_site
from app.serialize import media_dict

router = APIRouter(dependencies=[Depends(require_admin)])


class ProfileIn(BaseModel):
    name: str | None = None
    tagline: str | None = None
    headline: str | None = None
    paragraphs: list[str] | None = None
    highlights: list[str] | None = None
    goal: str | None = None
    photo_media_id: int | None = None
    intro_video_media_id: int | None = None


class ContactIn(BaseModel):
    email: str | None = None
    linkedin: str | None = None
    linkedin_label: str | None = None
    whatsapp: str | None = None
    whatsapp_display: str | None = None
    phone: str | None = None
    location: str | None = None
    github: str | None = None
    github_label: str | None = None
    resume_media_id: int | None = None


class EducationIn(BaseModel):
    degree: str
    institution: str = ""
    university: str = ""
    sort_order: int | None = None


class ExperienceIn(BaseModel):
    title: str
    location: str = ""
    period: str = ""
    mode: str = ""
    bullets: list[str] = []
    sort_order: int | None = None


class SkillIn(BaseModel):
    category: str
    name: str
    icon: str = ""
    level: str | None = None
    project_ids: list[int] | None = None
    sort_order: int | None = None


class LinkIn(BaseModel):
    label: str
    url: str


class ProjectIn(BaseModel):
    title: str
    slug: str | None = None
    description: str = ""
    problem: str = ""
    role: str = ""
    outcome: str = ""
    featured: bool = False
    status: str = ""
    stage: str = ""
    progress: int = 0
    category: str = ""
    impact: str = ""
    team: str = ""
    technologies: list[str] = []
    links: list[LinkIn] = []
    cover_media_id: int | None = None
    demo_media_id: int | None = None
    gallery_media_ids: list[int] = []
    sort_order: int | None = None


class ToolIn(BaseModel):
    title: str
    description: str = ""
    features: list[str] = []
    status: str = ""
    category: str = ""
    demo_link: str = ""
    github_link: str = ""
    sort_order: int | None = None


class AchievementIn(BaseModel):
    event_name: str
    date: str = ""
    outcome: str = ""
    description: str = ""
    tech_used: str = ""
    certificate_media_id: int | None = None
    media_ids: list[int] = []
    sort_order: int | None = None


class CertificateIn(BaseModel):
    media_id: int | None = None
    alt: str = ""
    description: str = ""
    caption: str = ""
    sort_order: int | None = None


class NavIn(BaseModel):
    label: str
    href: str


class SiteIn(BaseModel):
    title: str | None = None
    description: str | None = None
    copyright: str | None = None
    color_background: str | None = None
    color_surface: str | None = None
    color_text: str | None = None
    color_muted: str | None = None
    color_copper: str | None = None
    color_mint: str | None = None
    nav: list[NavIn] | None = None


class WorkflowIn(BaseModel):
    step_number: int = 1
    title: str
    body: str = ""
    example_project_slug: str = ""
    sort_order: int | None = None


class ReorderIn(BaseModel):
    entity: str
    ids: list[int]


def _slugify(value: str) -> str:
    import re

    slug = re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")
    return slug or "item"


def _unique_slug(db: Session, title: str, current_id: int | None = None) -> str:
    base = _slugify(title)
    slug = base
    index = 2
    while True:
        found = db.query(Project).filter(Project.slug == slug).first()
        if found is None or found.id == current_id:
            return slug
        slug = f"{base}-{index}"
        index += 1


def _set_bullets(row: Experience, bullets: list[str]) -> None:
    row.bullets.clear()
    for index, text in enumerate(bullets):
        row.bullets.append(ExperienceBullet(text=text, sort_order=index))


def _set_skill_links(db: Session, row: Skill, project_ids: list[int]) -> None:
    row.links.clear()
    db.flush()
    for project_id in project_ids:
        if db.get(Project, project_id):
            row.links.append(SkillProject(project_id=project_id))


def _set_project_children(db: Session, row: Project, body: ProjectIn) -> None:
    row.technologies.clear()
    row.links.clear()
    row.media_items.clear()
    db.flush()
    for index, name in enumerate(body.technologies):
        if name.strip():
            row.technologies.append(ProjectTechnology(name=name.strip(), sort_order=index))
    for link in body.links:
        if link.url.strip():
            row.links.append(ProjectLink(label=link.label or "Link", url=link.url.strip()))
    if body.cover_media_id and db.get(Media, body.cover_media_id):
        row.media_items.append(ProjectMedia(media_id=body.cover_media_id, role="cover", sort_order=0))
    if body.demo_media_id and db.get(Media, body.demo_media_id):
        row.media_items.append(ProjectMedia(media_id=body.demo_media_id, role="demo", sort_order=0))
    for index, media_id in enumerate(body.gallery_media_ids):
        if db.get(Media, media_id):
            row.media_items.append(ProjectMedia(media_id=media_id, role="gallery", sort_order=index))


def _apply_achievement(row: Achievement, body: AchievementIn, db: Session) -> None:
    row.event_name = body.event_name
    row.date = body.date
    row.outcome = body.outcome
    row.description = body.description
    row.tech_used = body.tech_used
    row.certificate_media_id = body.certificate_media_id
    if body.sort_order is not None:
        row.sort_order = body.sort_order
    row.media_items.clear()
    db.flush()
    for index, media_id in enumerate(body.media_ids):
        if db.get(Media, media_id):
            row.media_items.append(AchievementMedia(media_id=media_id, sort_order=index))


@router.get("/session", tags=["admin"])
def session():
    return {"ok": True}


@router.put("/profile", tags=["admin"])
def update_profile(body: ProfileIn, db: Session = Depends(get_db)):
    row = load_profile(db)
    if row is None:
        raise HTTPException(status_code=404, detail="Profile missing")
    for field in ("name", "tagline", "headline", "paragraphs", "highlights", "goal", "photo_media_id", "intro_video_media_id"):
        value = getattr(body, field)
        if value is not None:
            setattr(row, field, value)
    db.commit()
    return {"ok": True}


@router.put("/contact", tags=["admin"])
def update_contact(body: ContactIn, db: Session = Depends(get_db)):
    row = load_contact(db)
    if row is None:
        raise HTTPException(status_code=404, detail="Contact missing")
    data = body.model_dump(exclude_unset=True)
    for key, value in data.items():
        setattr(row, key, value)
    db.commit()
    return {"ok": True}


@router.post("/education", tags=["admin"])
def create_education(body: EducationIn, db: Session = Depends(get_db)):
    row = Education(
        degree=body.degree,
        institution=body.institution,
        university=body.university,
        sort_order=body.sort_order if body.sort_order is not None else db.query(Education).count(),
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return {"id": row.id}


@router.put("/education/{row_id}", tags=["admin"])
def update_education(row_id: int, body: EducationIn, db: Session = Depends(get_db)):
    row = db.get(Education, row_id)
    if row is None:
        raise HTTPException(status_code=404, detail="Education not found")
    row.degree = body.degree
    row.institution = body.institution
    row.university = body.university
    if body.sort_order is not None:
        row.sort_order = body.sort_order
    db.commit()
    return {"ok": True}


@router.delete("/education/{row_id}", tags=["admin"])
def delete_education(row_id: int, db: Session = Depends(get_db)):
    row = db.get(Education, row_id)
    if row is None:
        raise HTTPException(status_code=404, detail="Education not found")
    db.delete(row)
    db.commit()
    return {"ok": True}


@router.post("/experience", tags=["admin"])
def create_experience(body: ExperienceIn, db: Session = Depends(get_db)):
    row = Experience(
        title=body.title,
        location=body.location,
        period=body.period,
        mode=body.mode,
        sort_order=body.sort_order if body.sort_order is not None else db.query(Experience).count(),
    )
    _set_bullets(row, body.bullets)
    db.add(row)
    db.commit()
    db.refresh(row)
    return {"id": row.id}


@router.put("/experience/{row_id}", tags=["admin"])
def update_experience(row_id: int, body: ExperienceIn, db: Session = Depends(get_db)):
    row = db.get(Experience, row_id)
    if row is None:
        raise HTTPException(status_code=404, detail="Experience not found")
    row.title = body.title
    row.location = body.location
    row.period = body.period
    row.mode = body.mode
    if body.sort_order is not None:
        row.sort_order = body.sort_order
    _set_bullets(row, body.bullets)
    db.commit()
    return {"ok": True}


@router.delete("/experience/{row_id}", tags=["admin"])
def delete_experience(row_id: int, db: Session = Depends(get_db)):
    row = db.get(Experience, row_id)
    if row is None:
        raise HTTPException(status_code=404, detail="Experience not found")
    db.delete(row)
    db.commit()
    return {"ok": True}


@router.post("/skills", tags=["admin"])
def create_skill(body: SkillIn, db: Session = Depends(get_db)):
    from app.icons import icon_for

    row = Skill(
        category=body.category,
        name=body.name,
        icon=body.icon.strip() or icon_for(body.name, body.category),
        level=body.level or "",
        sort_order=body.sort_order if body.sort_order is not None else db.query(Skill).count(),
    )
    db.add(row)
    db.flush()
    if body.project_ids:
        _set_skill_links(db, row, body.project_ids)
    db.commit()
    db.refresh(row)
    return {"id": row.id}


@router.put("/skills/{row_id}", tags=["admin"])
def update_skill(row_id: int, body: SkillIn, db: Session = Depends(get_db)):
    row = db.get(Skill, row_id)
    if row is None:
        raise HTTPException(status_code=404, detail="Skill not found")
    from app.icons import icon_for

    row.category = body.category
    row.name = body.name
    row.icon = body.icon.strip() or icon_for(body.name, body.category)
    if body.level is not None:
        row.level = body.level
    if body.sort_order is not None:
        row.sort_order = body.sort_order
    if body.project_ids is not None:
        _set_skill_links(db, row, body.project_ids)
    db.commit()
    return {"ok": True}


@router.delete("/skills/{row_id}", tags=["admin"])
def delete_skill(row_id: int, db: Session = Depends(get_db)):
    row = db.get(Skill, row_id)
    if row is None:
        raise HTTPException(status_code=404, detail="Skill not found")
    db.delete(row)
    db.commit()
    return {"ok": True}


@router.post("/projects", tags=["admin"])
def create_project(body: ProjectIn, db: Session = Depends(get_db)):
    row = Project(
        title=body.title,
        slug=_unique_slug(db, body.slug or body.title),
        description=body.description,
        problem=body.problem,
        role=body.role,
        outcome=body.outcome,
        featured=body.featured,
        status=body.status,
        stage=body.stage,
        progress=body.progress,
        category=body.category,
        impact=body.impact,
        team=body.team,
        sort_order=body.sort_order if body.sort_order is not None else db.query(Project).count(),
    )
    db.add(row)
    db.flush()
    _set_project_children(db, row, body)
    db.commit()
    db.refresh(row)
    return {"id": row.id, "slug": row.slug}


@router.put("/projects/{row_id}", tags=["admin"])
def update_project(row_id: int, body: ProjectIn, db: Session = Depends(get_db)):
    row = db.get(Project, row_id)
    if row is None:
        raise HTTPException(status_code=404, detail="Project not found")
    row.title = body.title
    row.slug = _unique_slug(db, body.slug or body.title, row.id)
    row.description = body.description
    row.problem = body.problem
    row.role = body.role
    row.outcome = body.outcome
    row.featured = body.featured
    row.status = body.status
    row.stage = body.stage
    row.progress = body.progress
    row.category = body.category
    row.impact = body.impact
    row.team = body.team
    if body.sort_order is not None:
        row.sort_order = body.sort_order
    _set_project_children(db, row, body)
    db.commit()
    return {"ok": True, "slug": row.slug}


@router.delete("/projects/{row_id}", tags=["admin"])
def delete_project(row_id: int, db: Session = Depends(get_db)):
    row = db.get(Project, row_id)
    if row is None:
        raise HTTPException(status_code=404, detail="Project not found")
    db.query(SkillProject).filter(SkillProject.project_id == row_id).delete()
    db.delete(row)
    db.commit()
    return {"ok": True}


@router.post("/tools", tags=["admin"])
def create_tool(body: ToolIn, db: Session = Depends(get_db)):
    row = Tool(**body.model_dump())
    if row.sort_order is None:
        row.sort_order = db.query(Tool).count()
    db.add(row)
    db.commit()
    db.refresh(row)
    return {"id": row.id}


@router.put("/tools/{row_id}", tags=["admin"])
def update_tool(row_id: int, body: ToolIn, db: Session = Depends(get_db)):
    row = db.get(Tool, row_id)
    if row is None:
        raise HTTPException(status_code=404, detail="Tool not found")
    for key, value in body.model_dump().items():
        if key == "sort_order" and value is None:
            continue
        setattr(row, key, value)
    db.commit()
    return {"ok": True}


@router.delete("/tools/{row_id}", tags=["admin"])
def delete_tool(row_id: int, db: Session = Depends(get_db)):
    row = db.get(Tool, row_id)
    if row is None:
        raise HTTPException(status_code=404, detail="Tool not found")
    db.delete(row)
    db.commit()
    return {"ok": True}


@router.post("/achievements", tags=["admin"])
def create_achievement(body: AchievementIn, db: Session = Depends(get_db)):
    row = Achievement(sort_order=body.sort_order if body.sort_order is not None else db.query(Achievement).count())
    db.add(row)
    db.flush()
    _apply_achievement(row, body, db)
    db.commit()
    db.refresh(row)
    return {"id": row.id}


@router.put("/achievements/{row_id}", tags=["admin"])
def update_achievement(row_id: int, body: AchievementIn, db: Session = Depends(get_db)):
    row = db.get(Achievement, row_id)
    if row is None:
        raise HTTPException(status_code=404, detail="Achievement not found")
    _apply_achievement(row, body, db)
    db.commit()
    return {"ok": True}


@router.delete("/achievements/{row_id}", tags=["admin"])
def delete_achievement(row_id: int, db: Session = Depends(get_db)):
    row = db.get(Achievement, row_id)
    if row is None:
        raise HTTPException(status_code=404, detail="Achievement not found")
    db.delete(row)
    db.commit()
    return {"ok": True}


@router.post("/certificates", tags=["admin"])
def create_certificate(body: CertificateIn, db: Session = Depends(get_db)):
    row = Certificate(
        media_id=body.media_id,
        alt=body.alt,
        description=body.description,
        caption=body.caption,
        sort_order=body.sort_order if body.sort_order is not None else db.query(Certificate).count(),
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return {"id": row.id}


@router.put("/certificates/{row_id}", tags=["admin"])
def update_certificate(row_id: int, body: CertificateIn, db: Session = Depends(get_db)):
    row = db.get(Certificate, row_id)
    if row is None:
        raise HTTPException(status_code=404, detail="Certificate not found")
    row.media_id = body.media_id
    row.alt = body.alt
    row.description = body.description
    row.caption = body.caption
    if body.sort_order is not None:
        row.sort_order = body.sort_order
    db.commit()
    return {"ok": True}


@router.delete("/certificates/{row_id}", tags=["admin"])
def delete_certificate(row_id: int, db: Session = Depends(get_db)):
    row = db.get(Certificate, row_id)
    if row is None:
        raise HTTPException(status_code=404, detail="Certificate not found")
    db.delete(row)
    db.commit()
    return {"ok": True}


@router.put("/site", tags=["admin"])
def update_site(body: SiteIn, db: Session = Depends(get_db)):
    row = load_site(db)
    if row is None:
        raise HTTPException(status_code=404, detail="Site settings missing")
    data = body.model_dump(exclude_unset=True)
    nav = data.pop("nav", None)
    for key, value in data.items():
        setattr(row, key, value)
    if nav is not None:
        db.query(NavItem).delete()
        for index, item in enumerate(nav):
            db.add(NavItem(label=item["label"], href=item["href"], sort_order=index))
    db.commit()
    return {"ok": True}


@router.post("/workflow", tags=["admin"])
def create_workflow(body: WorkflowIn, db: Session = Depends(get_db)):
    row = WorkflowStep(
        step_number=body.step_number,
        title=body.title,
        body=body.body,
        example_project_slug=body.example_project_slug,
        sort_order=body.sort_order if body.sort_order is not None else db.query(WorkflowStep).count(),
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return {"id": row.id}


@router.put("/workflow/{row_id}", tags=["admin"])
def update_workflow(row_id: int, body: WorkflowIn, db: Session = Depends(get_db)):
    row = db.get(WorkflowStep, row_id)
    if row is None:
        raise HTTPException(status_code=404, detail="Workflow step not found")
    row.step_number = body.step_number
    row.title = body.title
    row.body = body.body
    row.example_project_slug = body.example_project_slug
    if body.sort_order is not None:
        row.sort_order = body.sort_order
    db.commit()
    return {"ok": True}


@router.delete("/workflow/{row_id}", tags=["admin"])
def delete_workflow(row_id: int, db: Session = Depends(get_db)):
    row = db.get(WorkflowStep, row_id)
    if row is None:
        raise HTTPException(status_code=404, detail="Workflow step not found")
    db.delete(row)
    db.commit()
    return {"ok": True}


@router.post("/reorder", tags=["admin"])
def reorder(body: ReorderIn, db: Session = Depends(get_db)):
    models = {
        "projects": Project,
        "skills": Skill,
        "education": Education,
        "experience": Experience,
    }
    model = models.get(body.entity)
    if model is None:
        raise HTTPException(status_code=400, detail="Unknown entity")
    for index, row_id in enumerate(body.ids):
        row = db.get(model, row_id)
        if row is not None:
            row.sort_order = index
    db.commit()
    return {"ok": True}


@router.post("/upload", tags=["admin"])
def upload(
    file: UploadFile = File(...),
    caption: str = Form(""),
    kind: str | None = Form(None),
    poster_media_id: int | None = Form(None),
    db: Session = Depends(get_db),
):
    if kind == "":
        kind = None
    row = save_upload(db, file, kind, caption, poster_media_id)
    return media_dict(row)


@router.delete("/media/{media_id}", tags=["admin"])
def remove_media(media_id: int, db: Session = Depends(get_db)):
    row = db.get(Media, media_id)
    if row is None:
        raise HTTPException(status_code=404, detail="Media not found")
    delete_media(db, row)
    db.commit()
    return {"ok": True}
