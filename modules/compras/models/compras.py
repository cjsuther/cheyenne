from sqlalchemy import (
    Column, BigInteger, Integer, String, Boolean, DateTime, Numeric, Text, UniqueConstraint,
)
from datetime import datetime, timezone

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


ESTADOS_PROVEEDOR = ("preinscripto", "activo", "suspendido")


class Proveedor(Base):
    __tablename__ = "compras_proveedores"
    __table_args__ = (UniqueConstraint("codigo", name="uq_comp_prov_codigo"),)
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    codigo = Column(String(30), nullable=False)
    nombre = Column(String(250), nullable=False)
    cuit = Column(String(20), nullable=True)
    rubro = Column(String(120), nullable=True)
    # Registro / preinscripción
    estado = Column(String(15), nullable=False, default="activo")   # preinscripto|activo|suspendido
    email = Column(String(150), nullable=True)
    telefono = Column(String(60), nullable=True)
    domicilio = Column(String(250), nullable=True)
    documentacion = Column(Text, nullable=True)                     # notas / links de docs presentada
    fecha_inscripcion = Column(DateTime(timezone=True), nullable=True)
    aprobado_por = Column(String(150), nullable=True)
    activo = Column(Boolean, nullable=False, default=True)


class Articulo(Base):
    __tablename__ = "compras_articulos"
    __table_args__ = (UniqueConstraint("codigo", name="uq_comp_art_codigo"),)
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    codigo = Column(String(30), nullable=False)
    nombre = Column(String(250), nullable=False)
    unidad = Column(String(30), nullable=True)          # unidad / kg / litro
    precio_referencia = Column(Numeric(18, 2), nullable=False, default=0)
    activo = Column(Boolean, nullable=False, default=True)


ESTADOS_PEDIDO = ("borrador", "solicitado", "con_oc", "recibido", "anulado")


class Pedido(Base):
    """Pedido de área (Solicitante): el origen del circuito de compra."""
    __tablename__ = "compras_pedidos"
    __table_args__ = (UniqueConstraint("anio", "numero", name="uq_comp_pedido_numero"),)
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    anio = Column(Integer, nullable=False, index=True)
    numero = Column(Integer, nullable=False)
    area = Column(String(150), nullable=False)
    descripcion = Column(String(250), nullable=True)
    estado = Column(String(15), nullable=False, default="borrador")
    creado_por = Column(String(150), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    activo = Column(Boolean, nullable=False, default=True)


class PedidoItem(Base):
    __tablename__ = "compras_pedido_items"
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_pedido = Column(BigInteger, nullable=False, index=True)
    id_articulo = Column(BigInteger, nullable=False)
    cantidad = Column(Numeric(18, 2), nullable=False, default=1)


ESTADOS_OC = ("emitida", "recibida_parcial", "recibida", "anulada")


class OrdenCompra(Base):
    """Orden de compra: adjudica un pedido a un proveedor. Alimenta el compromiso de Contaduría."""
    __tablename__ = "compras_ordenes_compra"
    __table_args__ = (UniqueConstraint("anio", "numero", name="uq_comp_oc_numero"),)
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    anio = Column(Integer, nullable=False, index=True)
    numero = Column(Integer, nullable=False)
    id_pedido = Column(BigInteger, nullable=True)
    id_proveedor = Column(BigInteger, nullable=False)
    proveedor_nombre = Column(String(250), nullable=True)
    total = Column(Numeric(18, 2), nullable=False, default=0)
    concepto = Column(String(250), nullable=True)
    estado = Column(String(20), nullable=False, default="emitida")
    comprometida = Column(Boolean, nullable=False, default=False)  # tomada por Contaduría
    creado_por = Column(String(150), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    activo = Column(Boolean, nullable=False, default=True)


class OrdenCompraItem(Base):
    __tablename__ = "compras_oc_items"
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_orden_compra = Column(BigInteger, nullable=False, index=True)
    id_articulo = Column(BigInteger, nullable=False)
    cantidad = Column(Numeric(18, 2), nullable=False, default=1)
    precio = Column(Numeric(18, 2), nullable=False, default=0)
    cantidad_recibida = Column(Numeric(18, 2), nullable=False, default=0)


class Recepcion(Base):
    __tablename__ = "compras_recepciones"
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_orden_compra = Column(BigInteger, nullable=False, index=True)
    id_deposito = Column(BigInteger, nullable=True)   # depósito donde ingresó la mercadería
    remito = Column(String(60), nullable=True)
    fecha = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    usuario_nombre = Column(String(150), nullable=True)
    activo = Column(Boolean, nullable=False, default=True)


class RecepcionItem(Base):
    __tablename__ = "compras_recepcion_items"
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_recepcion = Column(BigInteger, nullable=False, index=True)
    id_oc_item = Column(BigInteger, nullable=False)
    id_articulo = Column(BigInteger, nullable=False)
    cantidad = Column(Numeric(18, 2), nullable=False)


class Stock(Base):
    """Stock global (compatibilidad histórica). El stock real por depósito vive en StockPorDeposito."""
    __tablename__ = "compras_stock"
    __table_args__ = (UniqueConstraint("id_articulo", name="uq_comp_stock_art"),)
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_articulo = Column(BigInteger, nullable=False)
    cantidad = Column(Numeric(18, 2), nullable=False, default=0)


# ═══ Depósitos y stock por depósito ══════════════════════════════════
class Deposito(Base):
    __tablename__ = "compras_depositos"
    __table_args__ = (UniqueConstraint("codigo", name="uq_comp_deposito_codigo"),)
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    codigo = Column(String(30), nullable=False)
    nombre = Column(String(150), nullable=False)
    es_central = Column(Boolean, nullable=False, default=False)
    activo = Column(Boolean, nullable=False, default=True)


class StockPorDeposito(Base):
    __tablename__ = "compras_stock_deposito"
    __table_args__ = (UniqueConstraint("id_articulo", "id_deposito", name="uq_comp_stockdep"),)
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_articulo = Column(BigInteger, nullable=False, index=True)
    id_deposito = Column(BigInteger, nullable=False, index=True)
    cantidad = Column(Numeric(18, 2), nullable=False, default=0)


ESTADOS_MOV_STOCK = ("ingreso", "transferencia", "ajuste", "salida")


class MovimientoStock(Base):
    """Historial de movimientos de stock por depósito (auditoría de altas/bajas/transferencias)."""
    __tablename__ = "compras_movimientos_stock"
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    tipo = Column(String(15), nullable=False)                      # ingreso|transferencia|ajuste|salida
    id_articulo = Column(BigInteger, nullable=False, index=True)
    id_deposito_origen = Column(BigInteger, nullable=True)
    id_deposito_destino = Column(BigInteger, nullable=True)
    cantidad = Column(Numeric(18, 2), nullable=False)
    motivo = Column(String(250), nullable=True)
    usuario_nombre = Column(String(150), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))


# ═══ Circuito licitatorio (pedido de cotización → cotizaciones → adjudicación) ═══
ESTADOS_PEDCOT = ("abierto", "cerrado", "adjudicado", "desierto")


class PedidoCotizacion(Base):
    __tablename__ = "compras_pedidos_cotizacion"
    __table_args__ = (UniqueConstraint("anio", "numero", name="uq_comp_pedcot_numero"),)
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    anio = Column(Integer, nullable=False, index=True)
    numero = Column(Integer, nullable=False)
    concepto = Column(String(250), nullable=True)
    estado = Column(String(15), nullable=False, default="abierto")   # abierto|cerrado|adjudicado|desierto
    fecha_apertura = Column(DateTime(timezone=True), nullable=True)   # acta de apertura
    creado_por = Column(String(150), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    activo = Column(Boolean, nullable=False, default=True)


class PedidoCotizacionItem(Base):
    __tablename__ = "compras_pedcot_items"
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_pedido_cotizacion = Column(BigInteger, nullable=False, index=True)
    id_articulo = Column(BigInteger, nullable=False)
    cantidad = Column(Numeric(18, 2), nullable=False, default=1)


class Cotizacion(Base):
    __tablename__ = "compras_cotizaciones"
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_pedido_cotizacion = Column(BigInteger, nullable=False, index=True)
    id_proveedor = Column(BigInteger, nullable=False)
    fecha = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    observaciones = Column(Text, nullable=True)
    total = Column(Numeric(18, 2), nullable=False, default=0)
    activo = Column(Boolean, nullable=False, default=True)


class CotizacionItem(Base):
    __tablename__ = "compras_cotizacion_items"
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_cotizacion = Column(BigInteger, nullable=False, index=True)
    id_articulo = Column(BigInteger, nullable=False)
    precio = Column(Numeric(18, 2), nullable=False, default=0)
    cantidad = Column(Numeric(18, 2), nullable=False, default=1)


# ═══ Facturas de proveedor ═══════════════════════════════════════════
ESTADOS_FACTURA = ("registrada", "conformada", "anulada")


class FacturaProveedor(Base):
    __tablename__ = "compras_facturas"
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_proveedor = Column(BigInteger, nullable=False, index=True)
    id_orden_compra = Column(BigInteger, nullable=True, index=True)
    numero = Column(String(60), nullable=False)
    fecha = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    total = Column(Numeric(18, 2), nullable=False, default=0)
    estado = Column(String(15), nullable=False, default="registrada")   # registrada|conformada|anulada
    conformada_por = Column(String(150), nullable=True)
    creado_por = Column(String(150), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    activo = Column(Boolean, nullable=False, default=True)


class FacturaItem(Base):
    __tablename__ = "compras_factura_items"
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_factura = Column(BigInteger, nullable=False, index=True)
    id_articulo = Column(BigInteger, nullable=False)
    cantidad = Column(Numeric(18, 2), nullable=False, default=1)
    precio = Column(Numeric(18, 2), nullable=False, default=0)
