from typing import List, Optional
from datetime import datetime

from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from models.incidencia import Incidencia


class IncidenciaService:
    def __init__(self, db: Session):
        self.db = db

    def list(
        self,
        id_tipo_incidencia: Optional[int] = None,
        id_nivel_criticidad: Optional[int] = None,
        fecha_desde: Optional[datetime] = None,
        fecha_hasta: Optional[datetime] = None,
        skip: int = 0,
        limit: int = 20,
    ) -> List[Incidencia]:
        query = self.db.query(Incidencia)
        if id_tipo_incidencia is not None:
            query = query.filter(Incidencia.id_tipo_incidencia == id_tipo_incidencia)
        if id_nivel_criticidad is not None:
            query = query.filter(Incidencia.id_nivel_criticidad == id_nivel_criticidad)
        if fecha_desde is not None:
            query = query.filter(Incidencia.fecha >= fecha_desde)
        if fecha_hasta is not None:
            query = query.filter(Incidencia.fecha <= fecha_hasta)
        return query.order_by(Incidencia.fecha.desc()).offset(skip).limit(limit).all()

    def find_by_id(self, id: int) -> Incidencia:
        incidencia = self.db.query(Incidencia).filter(Incidencia.id == id).first()
        if not incidencia:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Incidencia {id} no encontrada",
            )
        return incidencia

    def add(self, incidencia_data: dict) -> Incidencia:
        incidencia = Incidencia(**incidencia_data)
        self.db.add(incidencia)
        self.db.commit()
        self.db.refresh(incidencia)
        return incidencia

    def count(
        self,
        id_tipo_incidencia: Optional[int] = None,
        id_nivel_criticidad: Optional[int] = None,
        fecha_desde: Optional[datetime] = None,
        fecha_hasta: Optional[datetime] = None,
    ) -> int:
        query = self.db.query(Incidencia)
        if id_tipo_incidencia is not None:
            query = query.filter(Incidencia.id_tipo_incidencia == id_tipo_incidencia)
        if id_nivel_criticidad is not None:
            query = query.filter(Incidencia.id_nivel_criticidad == id_nivel_criticidad)
        if fecha_desde is not None:
            query = query.filter(Incidencia.fecha >= fecha_desde)
        if fecha_hasta is not None:
            query = query.filter(Incidencia.fecha <= fecha_hasta)
        return query.count()
