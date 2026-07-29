from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    database_url: str = "postgresql://cheyenne:cheyenne123@localhost:5432/cheyenne"
    secret_key: str = "supersecretkey"
    seguridad_url: str = "http://seguridad:8000"
    emisiones_url: str = "http://emisiones:8000"
    webhook_secret: str = "cheyenne-webhook-secret"
    afip_padron_url: str = ""
    afip_padron_token: str = ""
    environment: str = "development"
    debug: bool = True

    class Config:
        env_file = ".env"
        case_sensitive = False


@lru_cache()
def get_settings() -> Settings:
    return Settings()
