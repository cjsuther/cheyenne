import sys
import os
from decimal import Decimal

from fastapi import HTTPException, status
from sqlalchemy import func

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.base_module import create_auth_dependency

from config import get_settings
from models.contabilidad import Asiento, AsientoItem, PlanCuenta

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

CERO = Decimal("0.00")


def _requiere(cu, permiso):
    if cu.get("superuser"):
        return
    if permiso not in [p["codigo"] for p in cu.get("permisos", [])]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"No tiene el permiso '{permiso}'")


def _quien(cu):
    return cu.get("nombre_apellido") or cu.get("codigo") or "?"


def _dec(v):
    return Decimal(str(v or 0)).quantize(Decimal("0.01"))


def _proximo_numero(db, anio):
    ultimo = db.query(func.max(Asiento.numero)).filter(Asiento.anio == anio).scalar() or 0
    return ultimo + 1


def _cuenta_por_codigo(db, codigo, crear=True):
    """Resuelve un código a PlanCuenta; si no existe y crear=True, lo crea imputable placeholder."""
    c = db.query(PlanCuenta).filter(PlanCuenta.codigo == str(codigo).strip()).first()
    if not c and crear:
        c = PlanCuenta(codigo=str(codigo).strip(), nombre=f"(auto) {str(codigo).strip()}",
                       tipo="orden", imputable=True, nivel=3, activo=True)
        db.add(c); db.flush()
    return c


def _crear_asiento(db, anio, fecha, concepto, tipo, origen_modulo, origen_ref, lineas_cod, creado_por,
                   libro="patrimonial"):
    """Crea un asiento CONFIRMADO balanceado a partir de líneas con cuenta_codigo, en el LIBRO dado.
    lineas_cod: [{cuenta_codigo, debe, haber, detalle}]. Devuelve (asiento, None) o (None, motivo)."""
    td = th = CERO
    resueltas = []
    for ln in lineas_cod:
        d, h = _dec(ln.get("debe")), _dec(ln.get("haber"))
        if d < 0 or h < 0:
            return None, "Debe/haber no pueden ser negativos"
        c = _cuenta_por_codigo(db, ln["cuenta_codigo"])
        resueltas.append((c.id, d, h, ln.get("detalle")))
        td += d; th += h
    if td != th:
        return None, f"No balancea: debe {td} ≠ haber {th}"
    numero = _proximo_numero(db, anio)
    a = Asiento(anio=anio, numero=numero, fecha=fecha, tipo=tipo, libro=libro, concepto=concepto,
                origen_modulo=origen_modulo, origen_ref=origen_ref, estado="confirmado",
                total_debe=td, total_haber=th, creado_por=creado_por)
    db.add(a); db.flush()
    for id_cuenta, d, h, det in resueltas:
        db.add(AsientoItem(id_asiento=a.id, id_cuenta=id_cuenta, debe=d, haber=h, detalle=det))
    return a, None


def _cuentas_map(db, ids):
    if not ids:
        return {}
    return {c.id: c for c in db.query(PlanCuenta).filter(PlanCuenta.id.in_(list(ids))).all()}


def _ser_cuenta(c: PlanCuenta):
    return {"id": c.id, "codigo": c.codigo, "nombre": c.nombre, "tipo": c.tipo,
            "imputable": c.imputable, "id_padre": c.id_padre, "nivel": c.nivel, "activo": c.activo}


def _ser_asiento(a: Asiento, db, con_items=True):
    out = {
        "id": a.id, "anio": a.anio, "numero": a.numero,
        "asiento": f"AS-{a.anio}-{a.numero:05d}",
        "fecha": a.fecha, "tipo": a.tipo, "libro": a.libro, "concepto": a.concepto,
        "origen_modulo": a.origen_modulo, "origen_ref": a.origen_ref,
        "estado": a.estado, "total_debe": float(a.total_debe), "total_haber": float(a.total_haber),
        "creado_por": a.creado_por, "created_at": a.created_at,
    }
    if con_items:
        items = db.query(AsientoItem).filter(AsientoItem.id_asiento == a.id).order_by(AsientoItem.id).all()
        cuentas = _cuentas_map(db, {i.id_cuenta for i in items})
        out["items"] = [{
            "id": i.id, "id_cuenta": i.id_cuenta,
            "cuenta": (lambda c: {"id": c.id, "codigo": c.codigo, "nombre": c.nombre} if c else None)(cuentas.get(i.id_cuenta)),
            "debe": float(i.debe), "haber": float(i.haber), "detalle": i.detalle,
        } for i in items]
    return out
