from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    database_url: str = "postgresql://cheyenne:cheyenne123@localhost:5432/cheyenne"
    secret_key: str = "supersecretkey"
    seguridad_url: str = "http://seguridad:8000"
    # Fase 5: integración con contabilidad (devengado), tesorería (OP) y firma (recibos)
    contabilidad_url: str = "http://contabilidad:8000"
    tesoreria_url: str = "http://tesoreria:8000"
    firma_url: str = "http://firma:8000"
    environment: str = "development"
    debug: bool = True

    class Config:
        env_file = ".env"
        case_sensitive = False


@lru_cache()
def get_settings() -> Settings:
    return Settings()
