from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    database_url: str = "postgresql://cheyenne:cheyenne123@localhost:5432/cheyenne"
    secret_key: str = "supersecretkey"
    seguridad_url: str = "http://seguridad:8000"
    environment: str = "development"
    debug: bool = True

    # Defaults del modo de firma por si se prefiere configurar por entorno.
    # OJO: la fila de DB (firma_configuracion) MANDA sobre estos valores; estos
    # solo se usan para inicializar la fila la primera vez.
    firma_modo: str = "hmac"   # hmac|pades|gendoc
    gendoc_url: str = ""
    tsa_url: str = ""

    class Config:
        env_file = ".env"
        case_sensitive = False


@lru_cache()
def get_settings() -> Settings:
    return Settings()
