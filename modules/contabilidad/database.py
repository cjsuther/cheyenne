import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from shared.database import Base, create_db_engine, create_session_factory, get_db_dependency
from config import get_settings
settings = get_settings()
engine = create_db_engine(settings.database_url)
SessionLocal = create_session_factory(engine)
get_db = get_db_dependency(SessionLocal)
