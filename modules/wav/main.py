import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import get_settings
from database import engine
from shared.database import Base
from routers import cuentas_router, declaraciones_router, pagos_router, listas_router

settings = get_settings()

app = FastAPI(
    title="Cheyenne - Módulo WAV",
    description="Web de Autogestión Virtual - Pagos de tributos y declaraciones juradas",
    version="1.0.0",
    redirect_slashes=False,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if settings.environment == "development" else [],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(cuentas_router)
app.include_router(declaraciones_router)
app.include_router(pagos_router)
app.include_router(listas_router)


@app.on_event("startup")
async def startup():
    Base.metadata.create_all(bind=engine)


@app.get("/health")
def health():
    return {"status": "ok", "module": "wav"}
