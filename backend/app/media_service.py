from __future__ import annotations

import mimetypes
import uuid
from pathlib import Path

from fastapi import HTTPException, UploadFile
from PIL import Image
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.config import settings
from app.models import (
    Achievement,
    AchievementMedia,
    Certificate,
    Contact,
    Media,
    Profile,
    ProjectMedia,
)

MAX_BYTES = 200 * 1024 * 1024
ALLOWED = {
    "image": {".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"},
    "video": {".mp4", ".webm", ".mov"},
    "audio": {".mp3", ".wav", ".ogg", ".m4a"},
    "pdf": {".pdf"},
}


def ensure_dirs() -> Path:
    root = settings.media_path()
    for kind in ("image", "video", "audio", "pdf"):
        (root / kind).mkdir(parents=True, exist_ok=True)
    return root


def kind_from_path(path: str) -> str:
    ext = Path(path).suffix.lower()
    for kind, exts in ALLOWED.items():
        if ext in exts:
            return kind
    return "image"


def mime_for(path: str, kind: str) -> str:
    guessed, _ = mimetypes.guess_type(path)
    if guessed:
        return guessed
    return {
        "image": "image/jpeg",
        "video": "video/mp4",
        "audio": "audio/mpeg",
        "pdf": "application/pdf",
    }.get(kind, "application/octet-stream")


def resolve_file(media: Media, variant: str = "original") -> Path | None:
    rel = media.thumb_path if variant == "thumb" and media.thumb_path else media.path
    if not rel:
        return None
    candidates = [
        settings.media_path() / rel,
        settings.public_path() / rel.lstrip("/"),
        Path(rel),
    ]
    for candidate in candidates:
        if candidate.is_file():
            return candidate
    return None


def media_is_missing(media: Media) -> bool:
    return resolve_file(media) is None


def _safe_unlink(rel: str) -> None:
    if not rel:
        return
    root = settings.media_path().resolve()
    path = (root / rel).resolve()
    if path.is_file() and root in path.parents:
        path.unlink()


def media_in_use(db: Session, media_id: int) -> bool:
    if db.query(Profile).filter(
        or_(Profile.photo_media_id == media_id, Profile.intro_video_media_id == media_id)
    ).first():
        return True
    if db.query(Contact).filter(Contact.resume_media_id == media_id).first():
        return True
    if db.query(ProjectMedia).filter(ProjectMedia.media_id == media_id).first():
        return True
    if db.query(Achievement).filter(Achievement.certificate_media_id == media_id).first():
        return True
    if db.query(AchievementMedia).filter(AchievementMedia.media_id == media_id).first():
        return True
    if db.query(Certificate).filter(Certificate.media_id == media_id).first():
        return True
    if db.query(Media).filter(Media.poster_id == media_id).first():
        return True
    return False


def delete_media(db: Session, media: Media) -> None:
    if media_in_use(db, media.id):
        raise HTTPException(status_code=409, detail="Media is still used")
    _safe_unlink(media.path)
    _safe_unlink(media.thumb_path)
    db.delete(media)


def save_upload(
    db: Session,
    upload: UploadFile,
    kind: str | None,
    caption: str,
    poster_media_id: int | None,
) -> Media:
    root = ensure_dirs()
    original = upload.filename or "upload"
    ext = Path(original).suffix.lower()
    resolved_kind = kind or kind_from_path(original)
    if resolved_kind not in ALLOWED or ext not in ALLOWED[resolved_kind]:
        raise HTTPException(status_code=400, detail="Only image, video, audio, and pdf uploads are accepted")

    uid = uuid.uuid4().hex
    rel = f"{resolved_kind}/{uid}{ext}"
    dest = root / rel
    size = 0
    with dest.open("wb") as handle:
        while True:
            chunk = upload.file.read(1024 * 1024)
            if not chunk:
                break
            size += len(chunk)
            if size > MAX_BYTES:
                handle.close()
                dest.unlink(missing_ok=True)
                raise HTTPException(status_code=413, detail="File too large (max 200MB)")
            handle.write(chunk)

    thumb_rel = ""
    if resolved_kind == "image" and ext != ".svg":
        thumb_rel = f"image/{uid}.webp"
        try:
            with Image.open(dest) as image:
                image.thumbnail((960, 960))
                image.convert("RGB").save(root / thumb_rel, "WEBP", quality=80)
        except Exception:
            thumb_rel = ""

    if poster_media_id is not None and not db.get(Media, poster_media_id):
        dest.unlink(missing_ok=True)
        if thumb_rel:
            _safe_unlink(thumb_rel)
        raise HTTPException(status_code=400, detail="Poster media was not found")

    row = Media(
        kind=resolved_kind,
        path=rel,
        mime=upload.content_type or mime_for(original, resolved_kind),
        poster_id=poster_media_id if resolved_kind == "video" else None,
        caption=caption or "",
        byte_size=size,
        original_name=Path(original).name,
        thumb_path=thumb_rel,
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return row
