from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from typing import Generator


class Base(DeclarativeBase):
    pass


def create_db_engine(database_url: str):
    return create_engine(
        database_url,
        pool_pre_ping=True,
        pool_size=10,
        max_overflow=20,
    )


def create_session_factory(engine):
    return sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db_dependency(session_factory) -> Generator:
    def get_db():
        db = session_factory()
        try:
            yield db
        finally:
            db.close()
    return get_db
