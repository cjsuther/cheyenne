from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    database_url: str = "postgresql://cheyenne:cheyenne123@localhost:5432/cheyenne"
    secret_key: str = "supersecretkey"
    seguridad_url: str = "http://seguridad:8000"
    comunicacion_url: str = "http://comunicacion:8000"
    # destinatario por defecto para las alertas proactivas (canal email)
    alertas_destinatario: str = "seguridad@cheyenne.local"
    environment: str = "development"
    debug: bool = True

    class Config:
        env_file = ".env"
        case_sensitive = False


@lru_cache()
def get_settings() -> Settings:
    return Settings()
