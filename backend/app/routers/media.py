from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.database import get_db
from app.media_service import resolve_file
from app.models import Media

router = APIRouter()


@router.get("/{media_id}", tags=["media"])
def stream_media(media_id: int, variant: str = "original", db: Session = Depends(get_db)):
    media = db.get(Media, media_id)
    if media is None:
        raise HTTPException(status_code=404, detail="Media not found")
    use_thumb = variant == "thumb"
    path = resolve_file(media, "thumb" if use_thumb else "original")
    if path is None:
        raise HTTPException(status_code=404, detail="File is not on disk")
    media_type = "image/webp" if use_thumb else (media.mime or None)
    return FileResponse(path, media_type=media_type, filename=media.original_name or path.name)
