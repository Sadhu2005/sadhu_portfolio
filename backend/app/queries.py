from __future__ import annotations

from sqlalchemy.orm import Session, selectinload

from app.models import (
    Achievement,
    AchievementMedia,
    Certificate,
    Contact,
    Education,
    Experience,
    NavItem,
    Profile,
    Project,
    ProjectMedia,
    SiteSettings,
    Skill,
    SkillProject,
    Tool,
    WorkflowStep,
)


def load_profile(db: Session) -> Profile | None:
    return db.query(Profile).options(
        selectinload(Profile.photo),
        selectinload(Profile.intro_video),
    ).first()


def load_contact(db: Session) -> Contact | None:
    return db.query(Contact).options(selectinload(Contact.resume)).first()


def load_education(db: Session) -> list[Education]:
    return db.query(Education).order_by(Education.sort_order, Education.id).all()


def load_experience(db: Session) -> list[Experience]:
    return (
        db.query(Experience)
        .options(selectinload(Experience.bullets))
        .order_by(Experience.sort_order, Experience.id)
        .all()
    )


def load_skills(db: Session) -> list[Skill]:
    return (
        db.query(Skill)
        .options(selectinload(Skill.links).selectinload(SkillProject.project))
        .order_by(Skill.sort_order, Skill.id)
        .all()
    )


def load_projects(db: Session) -> list[Project]:
    return (
        db.query(Project)
        .options(
            selectinload(Project.technologies),
            selectinload(Project.links),
            selectinload(Project.media_items).selectinload(ProjectMedia.media),
        )
        .order_by(Project.sort_order, Project.id)
        .all()
    )


def load_tools(db: Session) -> list[Tool]:
    return db.query(Tool).order_by(Tool.sort_order, Tool.id).all()


def load_achievements(db: Session) -> list[Achievement]:
    return (
        db.query(Achievement)
        .options(
            selectinload(Achievement.certificate),
            selectinload(Achievement.media_items).selectinload(AchievementMedia.media),
        )
        .order_by(Achievement.sort_order, Achievement.id)
        .all()
    )


def load_certificates(db: Session) -> list[Certificate]:
    return (
        db.query(Certificate)
        .options(selectinload(Certificate.image))
        .order_by(Certificate.sort_order, Certificate.id)
        .all()
    )


def load_site(db: Session) -> SiteSettings | None:
    return db.query(SiteSettings).first()


def load_nav(db: Session) -> list[NavItem]:
    return db.query(NavItem).order_by(NavItem.sort_order, NavItem.id).all()


def load_workflow(db: Session) -> list[WorkflowStep]:
    return db.query(WorkflowStep).order_by(WorkflowStep.sort_order, WorkflowStep.id).all()
