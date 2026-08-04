import sys, os
sys.path.insert(0, os.path.dirname(__file__))
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import get_settings
from database import engine
from shared.database import Base
from shared.audit_middleware import AuditMiddleware
from routers import firma_router
import models  # noqa: F401

settings = get_settings()
app = FastAPI(title="Cheyenne - Módulo Firma Digital",
              description="Firma múltiple y secuencial de documentos: bandeja, firma de registro y verificación",
              version="1.0.0", redirect_slashes=False)
app.add_middleware(CORSMiddleware, allow_origins=["*"] if settings.environment == "development" else [],
                   allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
app.add_middleware(AuditMiddleware, modulo="firma")
app.include_router(firma_router)


@app.on_event("startup")
async def startup():
    Base.metadata.create_all(bind=engine)


@app.get("/health")
def health():
    return {"status": "ok", "module": "firma"}
