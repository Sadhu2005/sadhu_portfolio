"""Add optional skills.level for current position labels."""

from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect

revision = "003_skill_level"
down_revision = "002_skill_icon"
branch_labels = None
depends_on = None


def upgrade() -> None:
    bind = op.get_bind()
    inspector = inspect(bind)
    if "skills" not in inspector.get_table_names():
        return
    columns = {column["name"] for column in inspector.get_columns("skills")}
    if "level" in columns:
        return
    op.add_column(
        "skills",
        sa.Column("level", sa.String(40), nullable=False, server_default=""),
    )


def downgrade() -> None:
    bind = op.get_bind()
    inspector = inspect(bind)
    if "skills" not in inspector.get_table_names():
        return
    columns = {column["name"] for column in inspector.get_columns("skills")}
    if "level" not in columns:
        return
    op.drop_column("skills", "level")
