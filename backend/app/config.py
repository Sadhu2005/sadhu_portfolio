from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

_REPO = Path(__file__).resolve().parents[2]
_ENV = _REPO / ".env"


class Settings(BaseSettings):
    database_url: str = "postgresql+psycopg://portfolio:portfolio@localhost:5432/portfolio"
    media_root: str = ""
    admin_token: str = "dev-admin-token"
    cors_origins: str = "http://localhost:3000,http://localhost"
    public_dir: str = ""
    data_dir: str = ""
    portfolio_root: str = ""

    model_config = SettingsConfigDict(
        env_file=str(_ENV) if _ENV.is_file() else None,
        extra="ignore",
    )

    def root(self) -> Path:
        if self.portfolio_root:
            return Path(self.portfolio_root)
        return _REPO

    def media_path(self) -> Path:
        if self.media_root:
            path = Path(self.media_root)
            return path if path.is_absolute() else self.root() / path
        return self.root() / "backend" / "media"

    def public_path(self) -> Path:
        if self.public_dir:
            path = Path(self.public_dir)
            return path if path.is_absolute() else self.root() / path
        return self.root() / "public"

    def data_path(self) -> Path:
        if self.data_dir:
            path = Path(self.data_dir)
            return path if path.is_absolute() else self.root() / path
        return self.root() / "data"

    def cors_list(self) -> list[str]:
        return [item.strip() for item in self.cors_origins.split(",") if item.strip()]


settings = Settings()
