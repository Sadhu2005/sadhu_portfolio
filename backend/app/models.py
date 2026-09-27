from __future__ import annotations

from datetime import datetime
from typing import Optional

from sqlalchemy import Boolean, DateTime, ForeignKey, Index, Integer, String, Text, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.types import JSON

from app.database import Base


class Media(Base):
    __tablename__ = "media"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    kind: Mapped[str] = mapped_column(String(16), index=True)
    path: Mapped[str] = mapped_column(String(500), unique=True)
    mime: Mapped[str] = mapped_column(String(120), default="")
    poster_id: Mapped[Optional[int]] = mapped_column(ForeignKey("media.id", ondelete="SET NULL"), nullable=True)
    caption: Mapped[str] = mapped_column(String(300), default="")
    byte_size: Mapped[int] = mapped_column(Integer, default=0)
    original_name: Mapped[str] = mapped_column(String(300), default="")
    thumb_path: Mapped[str] = mapped_column(String(500), default="")
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    poster: Mapped[Optional[Media]] = relationship(remote_side="Media.id")


class Profile(Base):
    __tablename__ = "profile"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(200), default="")
    tagline: Mapped[str] = mapped_column(Text, default="")
    photo_media_id: Mapped[Optional[int]] = mapped_column(ForeignKey("media.id", ondelete="SET NULL"), nullable=True)
    headline: Mapped[str] = mapped_column(Text, default="")
    paragraphs: Mapped[list] = mapped_column(JSON, default=list)
    highlights: Mapped[list] = mapped_column(JSON, default=list)
    goal: Mapped[str] = mapped_column(Text, default="")
    intro_video_media_id: Mapped[Optional[int]] = mapped_column(ForeignKey("media.id", ondelete="SET NULL"), nullable=True)

    photo: Mapped[Optional[Media]] = relationship(foreign_keys=[photo_media_id])
    intro_video: Mapped[Optional[Media]] = relationship(foreign_keys=[intro_video_media_id])


class Contact(Base):
    __tablename__ = "contact"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    email: Mapped[str] = mapped_column(String(200), default="")
    linkedin: Mapped[str] = mapped_column(String(500), default="")
    linkedin_label: Mapped[str] = mapped_column(String(200), default="")
    whatsapp: Mapped[str] = mapped_column(String(200), default="")
    whatsapp_display: Mapped[str] = mapped_column(String(80), default="")
    phone: Mapped[str] = mapped_column(String(80), default="")
    location: Mapped[str] = mapped_column(String(300), default="")
    github: Mapped[str] = mapped_column(String(500), default="")
    github_label: Mapped[str] = mapped_column(String(200), default="")
    resume_media_id: Mapped[Optional[int]] = mapped_column(ForeignKey("media.id", ondelete="SET NULL"), nullable=True)

    resume: Mapped[Optional[Media]] = relationship()


class Education(Base):
    __tablename__ = "education"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    degree: Mapped[str] = mapped_column(String(300), default="")
    institution: Mapped[str] = mapped_column(String(400), default="")
    university: Mapped[str] = mapped_column(String(400), default="")
    sort_order: Mapped[int] = mapped_column(Integer, default=0, index=True)


class Experience(Base):
    __tablename__ = "experience"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    title: Mapped[str] = mapped_column(String(300), default="")
    location: Mapped[str] = mapped_column(String(300), default="")
    period: Mapped[str] = mapped_column(String(200), default="")
    mode: Mapped[str] = mapped_column(String(80), default="")
    sort_order: Mapped[int] = mapped_column(Integer, default=0, index=True)

    bullets: Mapped[list["ExperienceBullet"]] = relationship(
        cascade="all, delete-orphan",
        order_by="ExperienceBullet.sort_order",
    )


class ExperienceBullet(Base):
    __tablename__ = "experience_bullets"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    experience_id: Mapped[int] = mapped_column(ForeignKey("experience.id", ondelete="CASCADE"), index=True)
    text: Mapped[str] = mapped_column(Text, default="")
    sort_order: Mapped[int] = mapped_column(Integer, default=0)


class Skill(Base):
    __tablename__ = "skills"
    __table_args__ = (Index("ix_skills_category_order", "category", "sort_order"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    category: Mapped[str] = mapped_column(String(200), default="")
    name: Mapped[str] = mapped_column(String(200), default="")
    icon: Mapped[str] = mapped_column(String(80), default="HiChip")
    level: Mapped[str] = mapped_column(String(40), default="")
    sort_order: Mapped[int] = mapped_column(Integer, default=0)

    links: Mapped[list["SkillProject"]] = relationship(cascade="all, delete-orphan")


class Project(Base):
    __tablename__ = "projects"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    slug: Mapped[str] = mapped_column(String(220), unique=True, index=True)
    title: Mapped[str] = mapped_column(String(300), default="")
    description: Mapped[str] = mapped_column(Text, default="")
    problem: Mapped[str] = mapped_column(Text, default="")
    role: Mapped[str] = mapped_column(String(300), default="")
    outcome: Mapped[str] = mapped_column(Text, default="")
    featured: Mapped[bool] = mapped_column(Boolean, default=False, index=True)
    status: Mapped[str] = mapped_column(String(80), default="")
    stage: Mapped[str] = mapped_column(String(120), default="")
    progress: Mapped[int] = mapped_column(Integer, default=0)
    category: Mapped[str] = mapped_column(String(120), default="")
    impact: Mapped[str] = mapped_column(String(200), default="")
    team: Mapped[str] = mapped_column(String(120), default="")
    sort_order: Mapped[int] = mapped_column(Integer, default=0, index=True)

    technologies: Mapped[list["ProjectTechnology"]] = relationship(
        cascade="all, delete-orphan",
        order_by="ProjectTechnology.sort_order",
    )
    links: Mapped[list["ProjectLink"]] = relationship(cascade="all, delete-orphan")
    media_items: Mapped[list["ProjectMedia"]] = relationship(cascade="all, delete-orphan")


class ProjectTechnology(Base):
    __tablename__ = "project_technologies"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    project_id: Mapped[int] = mapped_column(ForeignKey("projects.id", ondelete="CASCADE"), index=True)
    name: Mapped[str] = mapped_column(String(120), default="")
    sort_order: Mapped[int] = mapped_column(Integer, default=0)


class ProjectLink(Base):
    __tablename__ = "project_links"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    project_id: Mapped[int] = mapped_column(ForeignKey("projects.id", ondelete="CASCADE"), index=True)
    label: Mapped[str] = mapped_column(String(80), default="")
    url: Mapped[str] = mapped_column(String(500), default="")


class ProjectMedia(Base):
    __tablename__ = "project_media"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    project_id: Mapped[int] = mapped_column(ForeignKey("projects.id", ondelete="CASCADE"), index=True)
    media_id: Mapped[int] = mapped_column(ForeignKey("media.id", ondelete="CASCADE"), index=True)
    role: Mapped[str] = mapped_column(String(32), default="gallery")
    sort_order: Mapped[int] = mapped_column(Integer, default=0)

    media: Mapped[Media] = relationship()


class SkillProject(Base):
    __tablename__ = "skill_projects"
    __table_args__ = (UniqueConstraint("skill_id", "project_id", name="uq_skill_project"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    skill_id: Mapped[int] = mapped_column(ForeignKey("skills.id", ondelete="CASCADE"), index=True)
    project_id: Mapped[int] = mapped_column(ForeignKey("projects.id", ondelete="CASCADE"), index=True)

    project: Mapped[Project] = relationship()


class Tool(Base):
    __tablename__ = "tools"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    title: Mapped[str] = mapped_column(String(300), default="")
    description: Mapped[str] = mapped_column(Text, default="")
    features: Mapped[list] = mapped_column(JSON, default=list)
    status: Mapped[str] = mapped_column(String(80), default="")
    category: Mapped[str] = mapped_column(String(120), default="")
    demo_link: Mapped[str] = mapped_column(String(500), default="")
    github_link: Mapped[str] = mapped_column(String(500), default="")
    sort_order: Mapped[int] = mapped_column(Integer, default=0, index=True)


class Achievement(Base):
    __tablename__ = "achievements"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    event_name: Mapped[str] = mapped_column(String(300), default="")
    date: Mapped[str] = mapped_column(String(80), default="")
    outcome: Mapped[str] = mapped_column(String(200), default="")
    description: Mapped[str] = mapped_column(Text, default="")
    tech_used: Mapped[str] = mapped_column(String(400), default="")
    certificate_media_id: Mapped[Optional[int]] = mapped_column(ForeignKey("media.id", ondelete="SET NULL"), nullable=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, index=True)

    certificate: Mapped[Optional[Media]] = relationship()
    media_items: Mapped[list["AchievementMedia"]] = relationship(cascade="all, delete-orphan")


class AchievementMedia(Base):
    __tablename__ = "achievement_media"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    achievement_id: Mapped[int] = mapped_column(ForeignKey("achievements.id", ondelete="CASCADE"), index=True)
    media_id: Mapped[int] = mapped_column(ForeignKey("media.id", ondelete="CASCADE"), index=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0)

    media: Mapped[Media] = relationship()


class Certificate(Base):
    __tablename__ = "certificates"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    media_id: Mapped[Optional[int]] = mapped_column(ForeignKey("media.id", ondelete="SET NULL"), nullable=True)
    alt: Mapped[str] = mapped_column(String(300), default="")
    description: Mapped[str] = mapped_column(Text, default="")
    caption: Mapped[str] = mapped_column(String(300), default="")
    sort_order: Mapped[int] = mapped_column(Integer, default=0, index=True)

    image: Mapped[Optional[Media]] = relationship()


class SiteSettings(Base):
    __tablename__ = "site_settings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    title: Mapped[str] = mapped_column(String(200), default="")
    description: Mapped[str] = mapped_column(Text, default="")
    copyright: Mapped[str] = mapped_column(String(200), default="")
    color_background: Mapped[str] = mapped_column(String(32), default="#090b10")
    color_surface: Mapped[str] = mapped_column(String(32), default="#141820")
    color_text: Mapped[str] = mapped_column(String(32), default="#f3efe6")
    color_muted: Mapped[str] = mapped_column(String(32), default="#a39e93")
    color_copper: Mapped[str] = mapped_column(String(32), default="#d4894c")
    color_mint: Mapped[str] = mapped_column(String(32), default="#5ee0c3")


class NavItem(Base):
    __tablename__ = "nav_items"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    label: Mapped[str] = mapped_column(String(80), default="")
    href: Mapped[str] = mapped_column(String(200), default="")
    sort_order: Mapped[int] = mapped_column(Integer, default=0, index=True)


class WorkflowStep(Base):
    __tablename__ = "workflow_steps"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    step_number: Mapped[int] = mapped_column(Integer, default=1)
    title: Mapped[str] = mapped_column(String(200), default="")
    body: Mapped[str] = mapped_column(Text, default="")
    example_project_slug: Mapped[str] = mapped_column(String(220), default="")
    sort_order: Mapped[int] = mapped_column(Integer, default=0, index=True)
