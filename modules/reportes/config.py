from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    database_url: str = "postgresql://cheyenne:cheyenne123@localhost:5432/cheyenne"
    secret_key: str = "supersecretkey"
    seguridad_url: str = "http://seguridad:8000"
    # URLs de los módulos que consolidamos (solo por HTTP)
    tesoreria_url: str = "http://tesoreria:8000"
    emisiones_url: str = "http://emisiones:8000"
    contaduria_url: str = "http://contaduria:8000"
    presupuesto_url: str = "http://presupuesto:8000"
    environment: str = "development"
    debug: bool = True

    class Config:
        env_file = ".env"
        case_sensitive = False


@lru_cache()
def get_settings() -> Settings:
    return Settings()
