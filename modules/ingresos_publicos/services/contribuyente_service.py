from typing import List, Optional

from sqlalchemy.orm import Session
from sqlalchemy import or_, func
from fastapi import HTTPException, status

from models.contribuyente import Contribuyente
from models.persona import Persona
from models.cuenta import Cuenta
from models.inmueble import Inmueble
from models.comercio import Comercio
from models.vehiculo import Vehiculo
from models.titular_cuenta import TitularCuenta


class ContribuyenteService:
    def __init__(self, db: Session):
        self.db = db

    def list(self, skip: int = 0, limit: int = 100) -> List[Contribuyente]:
        return self.db.query(Contribuyente).offset(skip).limit(limit).all()

    def search(self, q: str, limit: int = 20) -> List[dict]:
        """Busca contribuyentes por CUIL/DNI (numero_documento) o nombre/apellido/denominación.
        Insensible a acentos y mayúsculas (vía unaccent + ilike)."""
        term = f"%{q}%"

        def like(col):
            # unaccent en ambos lados => 'garcia' matchea 'García'
            return func.unaccent(col).ilike(func.unaccent(term))

        rows = (
            self.db.query(Contribuyente, Persona)
            .join(Persona, Persona.id == Contribuyente.id_persona)
            .filter(Contribuyente.activo == True)
            .filter(or_(
                like(Persona.nombre),
                like(Persona.apellido),
                like(Persona.denominacion),
                Persona.numero_documento.ilike(term),
                Contribuyente.numero_documento.ilike(term),
            ))
            .limit(limit)
            .all()
        )
        result = []
        for c, p in rows:
            nombre_completo = (
                p.denominacion
                or " ".join(x for x in [p.nombre, p.apellido] if x)
                or c.numero_documento
            )
            result.append({
                "id": c.id,
                "id_persona": p.id,
                "id_tipo_persona": c.id_tipo_persona,
                "numero_documento": c.numero_documento,
                "nombre": p.nombre,
                "apellido": p.apellido,
                "denominacion": p.denominacion,
                "nombre_completo": nombre_completo,
            })
        return result

    def count(self) -> int:
        return self.db.query(Contribuyente).count()

    # ── Búsqueda inversa: objeto (vehículo/inmueble/comercio) -> titular(es) ──
    def _nombre_contribuyente(self, id_contrib: int) -> dict:
        row = (
            self.db.query(Contribuyente, Persona)
            .join(Persona, Persona.id == Contribuyente.id_persona)
            .filter(Contribuyente.id == id_contrib).first()
        )
        if not row:
            return {"id": id_contrib, "nombre_completo": f"#{id_contrib}", "numero_documento": None}
        c, p = row
        nombre = p.denominacion or " ".join(x for x in [p.nombre, p.apellido] if x) or c.numero_documento
        return {"id": c.id, "nombre_completo": nombre, "numero_documento": c.numero_documento}

    def _titulares_de_cuenta(self, cuenta) -> list:
        if not cuenta:
            return []
        tit = (
            self.db.query(TitularCuenta)
            .filter(TitularCuenta.id_cuenta == cuenta.id, TitularCuenta.activo == True).all()
        )
        if tit:
            out = []
            for t in tit:
                info = self._nombre_contribuyente(t.id_contribuyente)
                info["porcentaje"] = float(t.porcentaje) if t.porcentaje is not None else None
                info["rol"] = t.tipo
                out.append(info)
            return out
        if cuenta.id_contribuyente:  # sin titularidad explícita: titular principal de la cuenta
            info = self._nombre_contribuyente(cuenta.id_contribuyente)
            info["porcentaje"] = 100.0
            info["rol"] = "titular"
            return [info]
        return []

    def buscar_objetos(self, q: str, tipo: Optional[str] = None, limit: int = 30) -> list:
        """Consulta inversa: dado un dominio, nomenclatura, nombre de comercio, CUIT o número de
        cuenta, devuelve el/los objetos que matchean con su cuenta y titular(es)."""
        term = f"%{q}%"

        def like(col):
            return func.unaccent(col).ilike(func.unaccent(term))

        encontrados = {}  # (tipo, id) -> base

        def add(t, oid, desc, id_cuenta):
            encontrados[(t, oid)] = {"tipo": t, "id_objeto": oid, "descripcion": desc, "id_cuenta": id_cuenta}

        def desc_vehiculo(v):
            return v.dominio + (f" · {v.modelo}" if v.modelo else "") + (f" ({v.anio})" if v.anio else "")

        def desc_comercio(c):
            return (c.nombre_fantasia or "s/nombre") + (f" · CUIT {c.cuit}" if c.cuit else "")

        def desc_inmueble(i):
            return "-".join(x for x in [i.circuito, i.sector, i.fraccion, i.parcela] if x) or f"inmueble #{i.id}"

        if tipo in (None, "vehiculos"):
            for v in self.db.query(Vehiculo).filter(Vehiculo.activo == True, Vehiculo.dominio.ilike(term)).limit(limit):
                add("vehiculo", v.id, desc_vehiculo(v), v.id_cuenta)
        if tipo in (None, "comercios"):
            for c in self.db.query(Comercio).filter(Comercio.activo == True, or_(like(Comercio.nombre_fantasia), Comercio.cuit.ilike(term))).limit(limit):
                add("comercio", c.id, desc_comercio(c), c.id_cuenta)
        if tipo in (None, "inmuebles"):
            for i in self.db.query(Inmueble).filter(
                Inmueble.activo == True,
                or_(like(Inmueble.circuito), like(Inmueble.sector), like(Inmueble.fraccion), like(Inmueble.parcela)),
            ).limit(limit):
                add("inmueble", i.id, desc_inmueble(i), i.id_cuenta)
        # por número de cuenta: trae todos los objetos de las cuentas que matchean
        for cu in self.db.query(Cuenta).filter(Cuenta.activo == True, Cuenta.numero_cuenta.ilike(term)).limit(limit):
            for v in self.db.query(Vehiculo).filter(Vehiculo.id_cuenta == cu.id, Vehiculo.activo == True):
                add("vehiculo", v.id, desc_vehiculo(v), v.id_cuenta)
            for c in self.db.query(Comercio).filter(Comercio.id_cuenta == cu.id, Comercio.activo == True):
                add("comercio", c.id, desc_comercio(c), c.id_cuenta)
            for i in self.db.query(Inmueble).filter(Inmueble.id_cuenta == cu.id, Inmueble.activo == True):
                add("inmueble", i.id, desc_inmueble(i), i.id_cuenta)

        cache_cuenta = {}
        resultados = []
        for base in list(encontrados.values())[:limit]:
            idc = base.pop("id_cuenta")
            if idc not in cache_cuenta:
                cache_cuenta[idc] = self.db.query(Cuenta).filter(Cuenta.id == idc).first()
            cuenta = cache_cuenta[idc]
            base["cuenta"] = {"id": cuenta.id, "numero_cuenta": cuenta.numero_cuenta,
                              "id_tipo_tributo": cuenta.id_tipo_tributo} if cuenta else None
            base["titulares"] = self._titulares_de_cuenta(cuenta)
            resultados.append(base)
        return resultados

    @staticmethod
    def _row(obj) -> dict:
        return {c.name: getattr(obj, c.name) for c in obj.__table__.columns}

    def objetos(self, id_contribuyente: int) -> dict:
        """Cuentas del contribuyente + sus objetos imponibles (inmuebles/comercios/vehículos)."""
        cuentas = (
            self.db.query(Cuenta)
            .filter(Cuenta.id_contribuyente == id_contribuyente, Cuenta.activo == True)
            .all()
        )
        ids = [c.id for c in cuentas]

        def by_cuenta(Model):
            if not ids:
                return []
            return self.db.query(Model).filter(Model.id_cuenta.in_(ids), Model.activo == True).all()

        return {
            "cuentas": [self._row(c) for c in cuentas],
            "inmuebles": [self._row(x) for x in by_cuenta(Inmueble)],
            "comercios": [self._row(x) for x in by_cuenta(Comercio)],
            "vehiculos": [self._row(x) for x in by_cuenta(Vehiculo)],
        }

    def find_by_id(self, id: int) -> Contribuyente:
        contribuyente = self.db.query(Contribuyente).filter(Contribuyente.id == id).first()
        if not contribuyente:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Contribuyente {id} no encontrado",
            )
        return contribuyente

    def find_by_documento(self, id_tipo_documento: int, numero_documento: str) -> Optional[Contribuyente]:
        return (
            self.db.query(Contribuyente)
            .filter(
                Contribuyente.id_tipo_documento == id_tipo_documento,
                Contribuyente.numero_documento == numero_documento,
            )
            .first()
        )

    def add(self, data: dict) -> Contribuyente:
        contribuyente = Contribuyente(**data)
        self.db.add(contribuyente)
        self.db.commit()
        self.db.refresh(contribuyente)
        return contribuyente

    def modify(self, id: int, update_data: dict) -> Contribuyente:
        contribuyente = self.find_by_id(id)
        for key, value in update_data.items():
            if value is not None:
                setattr(contribuyente, key, value)
        self.db.commit()
        self.db.refresh(contribuyente)
        return contribuyente

    def remove(self, id: int):
        contribuyente = self.find_by_id(id)
        contribuyente.activo = False
        from datetime import datetime, timezone
        contribuyente.fecha_baja = datetime.now(timezone.utc)
        self.db.commit()
