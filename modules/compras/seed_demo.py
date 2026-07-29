"""
Seed de DEMO para el módulo Compras.
Puebla todo el circuito: proveedores, artículos, depósitos, pedidos, órdenes de
compra (con recepciones que suman stock coherente) y facturas.

    docker compose exec compras python seed_demo.py

Idempotente: si detecta proveedores DEMO ya cargados, no hace nada.
"""
import sys
import os
from datetime import datetime, timezone, timedelta
from decimal import Decimal

sys.path.insert(0, os.path.dirname(__file__))
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from database import SessionLocal, engine
from shared.database import Base

from models.compras import (
    Proveedor, Articulo, Pedido, PedidoItem, OrdenCompra, OrdenCompraItem,
    Recepcion, RecepcionItem, Stock,
    Deposito, StockPorDeposito, MovimientoStock,
    FacturaProveedor, FacturaItem,
)

ANIO = 2026
CERO = Decimal("0.00")


def D(x):
    return Decimal(str(x))


def _now(dias_atras=0):
    return datetime.now(timezone.utc) - timedelta(days=dias_atras)


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # ── Idempotencia ────────────────────────────────────────────────
    if db.query(Proveedor).filter(Proveedor.codigo.like("DEMO-%")).first():
        print("seed_demo compras: ya sembrado, omito")
        db.close()
        return

    resumen = {}

    # ── Proveedores (~8) ────────────────────────────────────────────
    provs_data = [
        ("DEMO-P001", "Distribuidora del Sur S.A.", "30-71234567-9", "Ferretería y construcción", "activo"),
        ("DEMO-P002", "Insumos Médicos Cheyenne SRL", "30-70998877-3", "Insumos hospitalarios", "activo"),
        ("DEMO-P003", "Papelera Central S.A.", "30-65443321-1", "Librería y papelería", "activo"),
        ("DEMO-P004", "Combustibles del Valle SRL", "30-71888444-6", "Combustibles y lubricantes", "activo"),
        ("DEMO-P005", "TecnoOffice S.A.", "30-70112233-8", "Informática y tecnología", "activo"),
        ("DEMO-P006", "Muebles y Equipamiento Norte SRL", "30-69554412-0", "Mobiliario", "activo"),
        ("DEMO-P007", "Limpieza Total S.A.", "30-71765432-2", "Artículos de limpieza", "activo"),
        ("DEMO-P008", "Vialidad Insumos SRL", "30-70334455-7", "Áridos y vialidad", "preinscripto"),
    ]
    provs = []
    for cod, nombre, cuit, rubro, estado in provs_data:
        p = Proveedor(
            codigo=cod, nombre=nombre, cuit=cuit, rubro=rubro, estado=estado,
            email=f"ventas@{cod.lower().replace('-', '')}.com.ar",
            telefono="+54 351 4" + cuit[3:9].replace("-", ""),
            domicilio="Av. San Martín 1234, Cheyenne",
            documentacion="Documentación DEMO presentada.",
            fecha_inscripcion=_now(120), aprobado_por="Sistema DEMO",
            activo=True,
        )
        db.add(p)
        provs.append(p)
    db.flush()
    resumen["compras_proveedores"] = len(provs)

    # ── Artículos (~15) ─────────────────────────────────────────────
    arts_data = [
        ("DEMO-A001", "Resma papel A4 75g", "resma", "3200.00"),
        ("DEMO-A002", "Cartucho tóner negro", "unidad", "45000.00"),
        ("DEMO-A003", "Birome azul", "unidad", "350.00"),
        ("DEMO-A004", "Cuaderno tapa dura", "unidad", "2800.00"),
        ("DEMO-A005", "Guantes de látex (caja x100)", "caja", "8500.00"),
        ("DEMO-A006", "Alcohol en gel 500ml", "unidad", "1900.00"),
        ("DEMO-A007", "Nafta súper", "litro", "1150.00"),
        ("DEMO-A008", "Gasoil", "litro", "1080.00"),
        ("DEMO-A009", "Notebook 15\"", "unidad", "1250000.00"),
        ("DEMO-A010", "Monitor 24\"", "unidad", "320000.00"),
        ("DEMO-A011", "Silla ergonómica", "unidad", "185000.00"),
        ("DEMO-A012", "Escritorio melamina", "unidad", "240000.00"),
        ("DEMO-A013", "Lavandina 5L", "unidad", "3400.00"),
        ("DEMO-A014", "Bolsa consorcio (paq x10)", "paquete", "2100.00"),
        ("DEMO-A015", "Cemento portland 50kg", "bolsa", "12500.00"),
    ]
    arts = []
    for cod, nombre, unidad, precio in arts_data:
        a = Articulo(codigo=cod, nombre=nombre, unidad=unidad,
                     precio_referencia=D(precio), activo=True)
        db.add(a)
        arts.append(a)
    db.flush()
    resumen["compras_articulos"] = len(arts)

    # ── Depósitos (asegurar central + 1 secundario) ─────────────────
    dep_central = db.query(Deposito).filter(Deposito.es_central == True).first()  # noqa: E712
    if not dep_central:
        dep_central = db.query(Deposito).filter(Deposito.codigo == "CENTRAL").first()
    if not dep_central:
        dep_central = Deposito(codigo="CENTRAL", nombre="Depósito Central",
                               es_central=True, activo=True)
        db.add(dep_central)
        db.flush()
    dep_sec = db.query(Deposito).filter(Deposito.codigo == "DEMO-DEP2").first()
    if not dep_sec:
        dep_sec = Deposito(codigo="DEMO-DEP2", nombre="Depósito Corralón Municipal",
                           es_central=False, activo=True)
        db.add(dep_sec)
        db.flush()
    depositos = [dep_central, dep_sec]
    resumen["compras_depositos(nuevos)"] = 1

    # ── Pedidos (~10) con items ─────────────────────────────────────
    areas = ["Secretaría de Hacienda", "Dirección de Salud", "Obras Públicas",
             "Mesa de Entradas", "Corralón Municipal", "Sistemas",
             "Recursos Humanos", "Dirección de Cultura", "Vialidad",
             "Intendencia"]
    pedidos = []
    for i in range(10):
        area = areas[i]
        p = Pedido(anio=ANIO, numero=i + 1, area=area,
                   descripcion=f"Pedido de insumos - {area}",
                   estado="solicitado", creado_por="Operador DEMO",
                   created_at=_now(60 - i * 3))
        db.add(p)
        db.flush()
        # 2-3 items por pedido
        base = (i * 3) % len(arts)
        for k in range(3):
            art = arts[(base + k) % len(arts)]
            db.add(PedidoItem(id_pedido=p.id, id_articulo=art.id,
                              cantidad=D(5 + (i + k) * 2)))
        pedidos.append(p)
    db.flush()
    resumen["compras_pedidos"] = len(pedidos)

    # ── Órdenes de compra (~8) con oc_items ─────────────────────────
    # 8 OCs; algunas se recibirán total, otras parcial, otras quedan emitidas.
    ocs = []
    for i in range(8):
        prov = provs[i % 7]          # evita el preinscripto (idx 7) como emisor
        pedido = pedidos[i]          # OC ligada a un pedido
        # 2 items tomados del pedido, con precio realista
        ped_items = db.query(PedidoItem).filter(PedidoItem.id_pedido == pedido.id).all()[:2]
        total = CERO
        oc = OrdenCompra(anio=ANIO, numero=i + 1, id_pedido=pedido.id,
                         id_proveedor=prov.id, proveedor_nombre=prov.nombre,
                         total=CERO, concepto=f"Compra {pedido.area}",
                         estado="emitida", comprometida=(i % 2 == 0),
                         creado_por="Compras DEMO", created_at=_now(50 - i * 3))
        db.add(oc)
        db.flush()
        oc_items = []
        for pi in ped_items:
            art = db.query(Articulo).filter(Articulo.id == pi.id_articulo).first()
            precio = D(art.precio_referencia)
            cant = D(pi.cantidad)
            oci = OrdenCompraItem(id_orden_compra=oc.id, id_articulo=art.id,
                                  cantidad=cant, precio=precio,
                                  cantidad_recibida=CERO)
            db.add(oci)
            oc_items.append(oci)
            total += cant * precio
        oc.total = total
        pedido.estado = "con_oc"
        db.flush()
        ocs.append((oc, oc_items))
    resumen["compras_ordenes_compra"] = len(ocs)

    # ── Recepciones (~5) que suman stock coherente ──────────────────
    # Recibimos las primeras 5 OCs: 4 totales, 1 parcial.
    n_recep = 0
    n_recep_items = 0

    def _sumar_stock(id_articulo, id_deposito, cantidad):
        fila = db.query(StockPorDeposito).filter(
            StockPorDeposito.id_articulo == id_articulo,
            StockPorDeposito.id_deposito == id_deposito).first()
        if fila:
            fila.cantidad = D(fila.cantidad) + D(cantidad)
        else:
            db.add(StockPorDeposito(id_articulo=id_articulo, id_deposito=id_deposito,
                                    cantidad=D(cantidad)))
        st = db.query(Stock).filter(Stock.id_articulo == id_articulo).first()
        if st:
            st.cantidad = D(st.cantidad) + D(cantidad)
        else:
            db.add(Stock(id_articulo=id_articulo, cantidad=D(cantidad)))

    for idx in range(5):
        oc, oc_items = ocs[idx]
        parcial = (idx == 4)  # la última recepción es parcial
        dep = depositos[idx % 2]
        rec = Recepcion(id_orden_compra=oc.id, id_deposito=dep.id,
                        remito=f"DEMO-R-{ANIO}-{idx + 1:04d}",
                        fecha=_now(40 - idx * 3), usuario_nombre="Depósito DEMO")
        db.add(rec)
        db.flush()
        n_recep += 1
        for oci in oc_items:
            pendiente = D(oci.cantidad) - D(oci.cantidad_recibida)
            if pendiente <= 0:
                continue
            recibir = pendiente if not parcial else (pendiente / 2).quantize(Decimal("0.01"))
            if recibir <= 0:
                continue
            oci.cantidad_recibida = D(oci.cantidad_recibida) + recibir
            db.add(RecepcionItem(id_recepcion=rec.id, id_oc_item=oci.id,
                                 id_articulo=oci.id_articulo, cantidad=recibir))
            n_recep_items += 1
            _sumar_stock(oci.id_articulo, dep.id, recibir)
            db.add(MovimientoStock(tipo="ingreso", id_articulo=oci.id_articulo,
                                   id_deposito_destino=dep.id, cantidad=recibir,
                                   motivo=f"Recepción OC-{oc.anio}-{oc.numero:04d}",
                                   usuario_nombre="Depósito DEMO",
                                   created_at=_now(40 - idx * 3)))
        # estado de la OC según pendientes
        items = db.query(OrdenCompraItem).filter(
            OrdenCompraItem.id_orden_compra == oc.id).all()
        total_pend = sum((D(i.cantidad) - D(i.cantidad_recibida) for i in items), CERO)
        oc.estado = "recibida" if total_pend <= 0 else "recibida_parcial"
        if oc.estado == "recibida" and oc.id_pedido:
            ped = db.query(Pedido).filter(Pedido.id == oc.id_pedido).first()
            if ped:
                ped.estado = "recibido"
    db.flush()
    resumen["compras_recepciones"] = n_recep
    resumen["compras_recepcion_items"] = n_recep_items

    # ── Facturas (~6) matcheadas contra OC ──────────────────────────
    # Facturamos las 5 OCs recibidas + 1 emitida más (anticipo).
    n_fact = 0
    n_fact_items = 0
    for idx in range(6):
        oc, oc_items = ocs[idx]
        prov = db.query(Proveedor).filter(Proveedor.id == oc.id_proveedor).first()
        estado = "conformada" if idx < 4 else "registrada"
        total = CERO
        fac = FacturaProveedor(
            id_proveedor=oc.id_proveedor, id_orden_compra=oc.id,
            numero=f"A-0001-{ANIO}{idx + 1:04d}",
            fecha=_now(35 - idx * 3), total=CERO, estado=estado,
            conformada_por="Contaduría DEMO" if estado == "conformada" else None,
            creado_por="Compras DEMO", created_at=_now(35 - idx * 3))
        db.add(fac)
        db.flush()
        n_fact += 1
        for oci in oc_items:
            cant = D(oci.cantidad)
            precio = D(oci.precio)
            db.add(FacturaItem(id_factura=fac.id, id_articulo=oci.id_articulo,
                               cantidad=cant, precio=precio))
            n_fact_items += 1
            total += cant * precio
        fac.total = total
    db.flush()
    resumen["compras_facturas"] = n_fact
    resumen["compras_factura_items"] = n_fact_items

    db.commit()
    db.close()

    partes = ", ".join(f"+{v} {k}" for k, v in resumen.items())
    print(f"seed_demo compras: {partes}")


if __name__ == "__main__":
    seed()
