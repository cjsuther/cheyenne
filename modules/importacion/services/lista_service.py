from typing import List

from sqlalchemy.orm import Session

from models.lista import Lista


class ListaService:
    def __init__(self, db: Session):
        self.db = db

    def list(self, tipo: str = None) -> List[Lista]:
        query = self.db.query(Lista)
        if tipo:
            query = query.filter(Lista.tipo == tipo)
        return query.order_by(Lista.orden).all()
