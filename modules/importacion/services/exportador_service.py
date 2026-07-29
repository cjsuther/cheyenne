import io
import csv
import json
from typing import List

from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from models.exportacion_lote import ExportacionLote
from models.importacion_lote import ImportacionLote
from models.importacion_detalle import ImportacionDetalle


class ExportadorService:
    def __init__(self, db: Session):
        self.db = db

    def list_lotes(self, skip: int = 0, limit: int = 20) -> List[ExportacionLote]:
        return (
            self.db.query(ExportacionLote)
            .order_by(ExportacionLote.fecha_creacion.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    def find_lote_by_id(self, id: int) -> ExportacionLote:
        lote = self.db.query(ExportacionLote).filter(ExportacionLote.id == id).first()
        if not lote:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Lote de exportación {id} no encontrado",
            )
        return lote

    def create_lote(self, lote_data: dict) -> ExportacionLote:
        lote = ExportacionLote(**lote_data)
        self.db.add(lote)
        self.db.commit()
        self.db.refresh(lote)
        return lote

    # ── generacion real de datos ─────────────────────────────────────
    def _rows_desde_importacion(self, origen_lote_id: int):
        """Reconstruye headers + filas a partir de los detalles de un lote de importacion."""
        imp = self.db.query(ImportacionLote).filter(ImportacionLote.id == origen_lote_id).first()
        if not imp:
            raise HTTPException(status_code=404, detail=f"Lote de importacion {origen_lote_id} no encontrado")
        detalles = (
            self.db.query(ImportacionDetalle)
            .filter(ImportacionDetalle.id_importacion_lote == origen_lote_id)
            .order_by(ImportacionDetalle.numero_linea)
            .all()
        )
        headers: list = []
        filas = []
        for d in detalles:
            try:
                fila = json.loads(d.datos_originales)
            except Exception:
                fila = {"valor": d.datos_originales}
            if not isinstance(fila, dict):
                fila = {"valor": fila}
            for k in fila.keys():
                if k not in headers:
                    headers.append(k)
            estado = "OK" if d.id_estado_detalle == 20 else ("ERROR" if d.id_estado_detalle == 30 else "PENDIENTE")
            fila["_estado"] = estado
            fila["_error"] = d.detalle_error or ""
            filas.append(fila)
        headers += ["_estado", "_error"]
        return headers, filas

    def datos_para_exportar(self, lote: ExportacionLote):
        """Devuelve (headers, filas[dict]) segun el origen configurado del lote."""
        if lote.origen_lote_id:
            return self._rows_desde_importacion(lote.origen_lote_id)
        # sin origen: exporta el propio registro de metadatos del lote (fallback util)
        headers = ["id", "tipo_exportacion", "nombre_archivo", "casos", "fecha_creacion"]
        filas = [{
            "id": lote.id,
            "tipo_exportacion": lote.tipo_exportacion,
            "nombre_archivo": lote.nombre_archivo,
            "casos": lote.casos,
            "fecha_creacion": str(lote.fecha_creacion),
        }]
        return headers, filas

    def generar_csv(self, headers, filas) -> str:
        buf = io.StringIO()
        writer = csv.DictWriter(buf, fieldnames=headers, extrasaction="ignore")
        writer.writeheader()
        for f in filas:
            writer.writerow({h: f.get(h, "") for h in headers})
        return buf.getvalue()

    def generar_xlsx(self, headers, filas) -> bytes:
        from openpyxl import Workbook

        wb = Workbook()
        ws = wb.active
        ws.title = "export"
        ws.append(headers)
        for f in filas:
            ws.append([f.get(h, "") for h in headers])
        out = io.BytesIO()
        wb.save(out)
        return out.getvalue()
