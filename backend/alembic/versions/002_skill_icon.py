"""Add skills.icon for react-icons keys."""

from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect

revision = "002_skill_icon"
down_revision = "001_initial"
branch_labels = None
depends_on = None


def upgrade() -> None:
    bind = op.get_bind()
    inspector = inspect(bind)
    if "skills" not in inspector.get_table_names():
        return
    columns = {column["name"] for column in inspector.get_columns("skills")}
    if "icon" in columns:
        return
    op.add_column(
        "skills",
        sa.Column("icon", sa.String(80), nullable=False, server_default="HiChip"),
    )


def downgrade() -> None:
    bind = op.get_bind()
    inspector = inspect(bind)
    if "skills" not in inspector.get_table_names():
        return
    columns = {column["name"] for column in inspector.get_columns("skills")}
    if "icon" not in columns:
        return
    op.drop_column("skills", "icon")
