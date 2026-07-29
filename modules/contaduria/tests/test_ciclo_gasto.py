"""Tests de la máquina de estados del ciclo del gasto (routers/gastos.py).

    preventivado → comprometido → devengado → pagado   (+ estados terminales: pagado, anulado)

Se prueba la función `avanzar` pasando `db` a mano (sin FastAPI/HTTP/auth). Las llamadas
salientes por httpx (presupuesto, compras, tesorería, contabilidad) se neutralizan:
`_presupuesto` se mockea para devolver una afectación falsa y `httpx.Client` se stubea
para que las integraciones best-effort no toquen la red. Así aislamos la LÓGICA de
transición (validación de etapa, mutación de estado, historial, documento/importe).
"""
from decimal import Decimal

import pytest
from fastapi import HTTPException

from conftest import gastos as G
from models.gasto import GastoExpediente


# ── helpers ──────────────────────────────────────────────────────────────
SUPER = {"superuser": True, "nombre_apellido": "Tester", "permisos": []}


class _FakeRequest:
    def __init__(self, token="Bearer tok"):
        self.headers = {"authorization": token} if token else {}


class _NoHTTP:
    """Context manager que reemplaza httpx.Client: cualquier request revienta.
    Sirve para asegurar que las integraciones best-effort están envueltas en try/except
    y NUNCA rompen el flujo de la transición."""
    def __enter__(self):
        return self

    def __exit__(self, *a):
        return False

    def get(self, *a, **k):
        raise RuntimeError("sin red en tests")

    def post(self, *a, **k):
        raise RuntimeError("sin red en tests")


@pytest.fixture(autouse=True)
def _mock_integraciones(monkeypatch):
    """Neutraliza todas las llamadas salientes de gastos.py.
    - _presupuesto: devuelve una afectación falsa con id incremental.
    - httpx.Client: revienta (best-effort ⇒ el flujo debe seguir igual)."""
    contador = {"n": 100}

    def fake_presupuesto(metodo, path, token, json_body=None):
        contador["n"] += 1
        return {"id": contador["n"]}

    monkeypatch.setattr(G, "_presupuesto", fake_presupuesto)
    monkeypatch.setattr(G.httpx, "Client", lambda *a, **k: _NoHTTP())
    return contador


def _gasto(db, estado="preventivado", importe="1000.00"):
    g = GastoExpediente(
        anio=2026, numero=1, descripcion="Compra de insumos",
        proveedor="ACME SA", id_partida=5, importe=Decimal(importe),
        estado=estado, id_afectacion_actual=1, historial=[], activo=True,
    )
    db.add(g)
    db.commit()
    db.refresh(g)
    return g


def _avanzar(db, g, documento, importe=None):
    data = {"documento": documento}
    if importe is not None:
        data["importe"] = importe
    return G.avanzar(g.id, _FakeRequest(), data, db, SUPER)


# ═══ transiciones VÁLIDAS ═════════════════════════════════════════════════
def test_ciclo_completo_preventivado_a_pagado(db):
    g = _gasto(db, "preventivado")

    _avanzar(db, g, "OC-77")
    assert g.estado == "comprometido"
    assert g.oc_numero == "OC-77"

    _avanzar(db, g, "FC-A-0001-123")
    assert g.estado == "devengado"
    assert g.factura_numero == "FC-A-0001-123"

    _avanzar(db, g, "OP-2026-9")
    assert g.estado == "pagado"
    assert g.op_numero == "OP-2026-9"

    # el historial acumuló una entrada por cada etapa avanzada
    etapas = [h["etapa"] for h in g.historial]
    assert etapas == ["compromiso", "devengado", "pagado"]


def test_comprometer_registra_afectacion_y_documento(db):
    g = _gasto(db, "preventivado")
    afect_previa = g.id_afectacion_actual

    _avanzar(db, g, "OC-1")

    assert g.estado == "comprometido"
    # la afectación se encadenó (nueva afectación devuelta por el mock)
    assert g.id_afectacion_actual != afect_previa
    ult = g.historial[-1]
    assert ult["referencia"] == "OC-1"
    assert ult["etapa"] == "compromiso"


def test_avanzar_actualiza_importe_desde_documento(db):
    g = _gasto(db, "comprometido", importe="1000.00")
    _avanzar(db, g, "FC-1", importe="1500.50")
    assert g.estado == "devengado"
    assert g.importe == Decimal("1500.50")


# ═══ transiciones INVÁLIDAS ═══════════════════════════════════════════════
def test_pagado_no_tiene_etapa_siguiente(db):
    g = _gasto(db, "pagado")
    with pytest.raises(HTTPException) as exc:
        _avanzar(db, g, "X")
    assert exc.value.status_code == 409
    assert "no tiene etapa siguiente" in exc.value.detail


def test_anulado_no_avanza(db):
    g = _gasto(db, "anulado")
    with pytest.raises(HTTPException) as exc:
        _avanzar(db, g, "X")
    assert exc.value.status_code == 409


def test_estado_desconocido_no_avanza(db):
    g = _gasto(db, "preventivado")
    g.estado = "estado_raro"
    db.commit()
    with pytest.raises(HTTPException) as exc:
        _avanzar(db, g, "X")
    assert exc.value.status_code == 409


def test_no_se_saltan_etapas(db):
    """Desde preventivado la única transición posible es a comprometido (no directo a devengado)."""
    g = _gasto(db, "preventivado")
    _avanzar(db, g, "OC-1")
    assert g.estado == "comprometido"   # no saltó a devengado ni pagado


def test_expediente_inexistente_404(db):
    with pytest.raises(HTTPException) as exc:
        G.avanzar(999999, _FakeRequest(), {"documento": "X"}, db, SUPER)
    assert exc.value.status_code == 404


# ═══ validaciones de la etapa ═════════════════════════════════════════════
def test_documento_obligatorio_para_avanzar(db):
    g = _gasto(db, "preventivado")
    with pytest.raises(HTTPException) as exc:
        G.avanzar(g.id, _FakeRequest(), {}, db, SUPER)  # sin documento
    assert exc.value.status_code == 400
    assert "documento" in exc.value.detail.lower()
    # el estado NO cambió
    db.refresh(g)
    assert g.estado == "preventivado"


def test_importe_debe_ser_positivo(db):
    g = _gasto(db, "preventivado")
    with pytest.raises(HTTPException) as exc:
        _avanzar(db, g, "OC-1", importe="0")
    assert exc.value.status_code == 400
    assert "mayor a cero" in exc.value.detail


def test_permiso_requerido_por_etapa(db):
    """Un usuario sin superuser ni el permiso de la etapa recibe 403 antes de mutar nada."""
    g = _gasto(db, "preventivado")
    sin_permiso = {"superuser": False, "nombre_apellido": "Pepe", "permisos": []}
    with pytest.raises(HTTPException) as exc:
        G.avanzar(g.id, _FakeRequest(), {"documento": "OC-1"}, db, sin_permiso)
    assert exc.value.status_code == 403
    db.refresh(g)
    assert g.estado == "preventivado"


def test_permiso_correcto_de_la_etapa_permite_avanzar(db):
    """Con exactamente el permiso 'contaduria_comprometer' se puede comprometer."""
    g = _gasto(db, "preventivado")
    cu = {"superuser": False, "nombre_apellido": "Ana",
          "permisos": [{"codigo": "contaduria_comprometer"}]}
    G.avanzar(g.id, _FakeRequest(), {"documento": "OC-1"}, db, cu)
    assert g.estado == "comprometido"


# ═══ el mapa SIGUIENTE es coherente con el ciclo ══════════════════════════
def test_mapa_siguiente_cubre_solo_estados_avanzables(db):
    assert set(G.SIGUIENTE.keys()) == {"preventivado", "comprometido", "devengado"}
    assert G.SIGUIENTE["preventivado"][1] == "compromiso"
    assert G.SIGUIENTE["comprometido"][1] == "devengado"
    assert G.SIGUIENTE["devengado"][1] == "pagado"
    # los estados terminales no están
    assert "pagado" not in G.SIGUIENTE
    assert "anulado" not in G.SIGUIENTE
