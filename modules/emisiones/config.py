from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    database_url: str = "postgresql://cheyenne:cheyenne123@localhost:5432/cheyenne"
    secret_key: str = "supersecretkey"
    seguridad_url: str = "http://seguridad:8000"
    ingresos_publicos_url: str = "http://ingresos_publicos:8000"
    contabilidad_url: str = "http://contabilidad:8000"
    presupuesto_url: str = "http://presupuesto:8000"
    redis_url: str = "redis://localhost:6379"
    environment: str = "development"
    debug: bool = True
    pdf_output_dir: str = "/app/output/pdf"
    # Recargo por mora aplicado al pagar deuda vencida (cálculo simple, configurable).
    mora_tasa_mensual_pct: float = 3.0

    class Config:
        env_file = ".env"
        case_sensitive = False


@lru_cache()
def get_settings() -> Settings:
    return Settings()
