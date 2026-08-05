from sqlalchemy import (
    Column, BigInteger, Integer, String, Boolean, DateTime, Date, Numeric, Text, UniqueConstraint,
)
from datetime import datetime, timezone

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


def _now():
    return datetime.now(timezone.utc)


ESTADOS_LEGAJO = ("activo", "baja", "licencia")
REGIMENES_ANTIG = ("municipal", "publica", "no_liquida")


# ─── CATÁLOGOS ────────────────────────────────────────────────────────
class Categoria(Base):
    """Categoría del escalafón (por módulos)."""
    __tablename__ = "rrhh_categorias"
    __table_args__ = (UniqueConstraint("codigo", name="uq_rrhh_categoria_codigo"),)
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    codigo = Column(String(20), nullable=False)
    descripcion = Column(String(200), nullable=False)
    cantidad_modulos = Column(Numeric(12, 4), nullable=False, default=0)
    activo = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), default=_now)


class TipoCargo(Base):
    """Tipo de cargo del escalafón: superior / jerárquico / profesional / técnico."""
    __tablename__ = "rrhh_tipos_cargo"
    __table_args__ = (UniqueConstraint("codigo", name="uq_rrhh_tipo_cargo_codigo"),)
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    codigo = Column(String(20), nullable=False)
    descripcion = Column(String(200), nullable=False)
    activo = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), default=_now)


class CargoFuncion(Base):
    """Cargo o función."""
    __tablename__ = "rrhh_cargos_funciones"
    __table_args__ = (UniqueConstraint("codigo", name="uq_rrhh_cargo_funcion_codigo"),)
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    codigo = Column(String(20), nullable=False)
    descripcion = Column(String(200), nullable=False)
    cantidad_modulos = Column(Numeric(12, 4), nullable=False, default=0)
    es_cargo = Column(Boolean, nullable=False, default=True)
    es_funcion = Column(Boolean, nullable=False, default=False)
    activo = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), default=_now)


class NivelLaboral(Base):
    """Nivel laboral."""
    __tablename__ = "rrhh_niveles_laboral"
    __table_args__ = (UniqueConstraint("codigo", name="uq_rrhh_nivel_laboral_codigo"),)
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    codigo = Column(String(20), nullable=False)
    descripcion = Column(String(200), nullable=False)
    activo = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), default=_now)


class TipoRelacion(Base):
    """Situación de revista: titular / mensualizado / jornalizado / planta permanente / temporaria / contratado."""
    __tablename__ = "rrhh_tipos_relacion"
    __table_args__ = (UniqueConstraint("codigo", name="uq_rrhh_tipo_relacion_codigo"),)
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    codigo = Column(String(20), nullable=False)
    descripcion = Column(String(200), nullable=False)
    activo = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), default=_now)


class Oficina(Base):
    """Unidad organizativa / oficina."""
    __tablename__ = "rrhh_oficinas"
    __table_args__ = (UniqueConstraint("codigo", name="uq_rrhh_oficina_codigo"),)
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    codigo = Column(String(20), nullable=False)
    descripcion = Column(String(200), nullable=False)
    activo = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), default=_now)


class Parentesco(Base):
    """Parentesco: esposo/a, hijo/a, familiar a cargo…"""
    __tablename__ = "rrhh_parentescos"
    __table_args__ = (UniqueConstraint("codigo", name="uq_rrhh_parentesco_codigo"),)
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    codigo = Column(String(20), nullable=False)
    descripcion = Column(String(200), nullable=False)
    activo = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), default=_now)


class TipoAntiguedad(Base):
    """Tipo de antigüedad y su régimen de cómputo."""
    __tablename__ = "rrhh_tipos_antiguedad"
    __table_args__ = (UniqueConstraint("codigo", name="uq_rrhh_tipo_antiguedad_codigo"),)
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    codigo = Column(String(20), nullable=False)
    descripcion = Column(String(200), nullable=False)
    regimen = Column(String(20), nullable=False, default="municipal")  # municipal | publica | no_liquida
    computa = Column(Boolean, nullable=False, default=True)
    activo = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), default=_now)


class Sindicato(Base):
    """Sindicato / gremio."""
    __tablename__ = "rrhh_sindicatos"
    __table_args__ = (UniqueConstraint("codigo", name="uq_rrhh_sindicato_codigo"),)
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    codigo = Column(String(20), nullable=False)
    nombre = Column(String(200), nullable=False)
    cuit = Column(String(20), nullable=True)
    porcentaje_aporte = Column(Numeric(8, 4), nullable=False, default=0)
    activo = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), default=_now)


class ObraSocial(Base):
    """Obra social."""
    __tablename__ = "rrhh_obras_sociales"
    __table_args__ = (UniqueConstraint("codigo", name="uq_rrhh_obra_social_codigo"),)
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    codigo = Column(String(20), nullable=False)
    nombre = Column(String(200), nullable=False)
    cuit = Column(String(20), nullable=True)
    porcentaje_aporte = Column(Numeric(8, 4), nullable=False, default=0)
    activo = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), default=_now)


# ─── NÚCLEO LEGAJO ────────────────────────────────────────────────────
class Legajo(Base):
    """Legajo del agente."""
    __tablename__ = "rrhh_legajos"
    __table_args__ = (UniqueConstraint("numero_legajo", name="uq_rrhh_legajo_numero"),)
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    numero_legajo = Column(String(20), nullable=False, index=True)
    id_persona = Column(BigInteger, nullable=True)  # referencia a administración, no FK física
    apellido_nombre = Column(String(250), nullable=False)
    cuil = Column(String(20), nullable=True)
    id_tipo_relacion = Column(BigInteger, nullable=True)
    id_obra_social = Column(BigInteger, nullable=True)
    id_sindicato = Column(BigInteger, nullable=True)
    fecha_ingreso = Column(Date, nullable=True)
    fecha_egreso = Column(Date, nullable=True)
    estado = Column(String(20), nullable=False, default="activo")  # activo | baja | licencia
    cbu = Column(String(30), nullable=True)
    banco = Column(String(100), nullable=True)
    created_at = Column(DateTime(timezone=True), default=_now)
    activo = Column(Boolean, nullable=False, default=True)


class LegajoCargo(Base):
    """Cargo/nombramiento del legajo, con su imputación presupuestaria."""
    __tablename__ = "rrhh_legajo_cargos"
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_legajo = Column(BigInteger, nullable=False, index=True)
    id_categoria = Column(BigInteger, nullable=True)
    id_tipo_cargo = Column(BigInteger, nullable=True)
    id_cargo_funcion = Column(BigInteger, nullable=True)
    id_oficina = Column(BigInteger, nullable=True)
    fecha_ingreso_cargo = Column(Date, nullable=True)
    fecha_egreso_cargo = Column(Date, nullable=True)
    letra_nombramiento = Column(String(10), nullable=True)
    anio_nombramiento = Column(Integer, nullable=True)
    numero_nombramiento = Column(String(30), nullable=True)
    fecha_nombramiento = Column(Date, nullable=True)
    expediente = Column(String(50), nullable=True)
    id_partida = Column(BigInteger, nullable=True)  # ref presupuesto, no FK física
    jurisdiccion = Column(String(30), nullable=True)
    estructura = Column(String(30), nullable=True)
    fuente = Column(String(30), nullable=True)
    objeto_gasto = Column(String(30), nullable=True)
    activo = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), default=_now)


class Antiguedad(Base):
    """Período de antigüedad reconocido al legajo."""
    __tablename__ = "rrhh_antiguedades"
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_legajo = Column(BigInteger, nullable=False, index=True)
    fecha_desde = Column(Date, nullable=True)
    fecha_hasta = Column(Date, nullable=True)
    lugar = Column(String(200), nullable=True)
    id_tipo_antiguedad = Column(BigInteger, nullable=True)
    activo = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), default=_now)


class Familiar(Base):
    """Familiar declarado del legajo (cargas de familia / deducciones)."""
    __tablename__ = "rrhh_familiares"
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_legajo = Column(BigInteger, nullable=False, index=True)
    apellido_nombre = Column(String(250), nullable=False)
    documento = Column(String(20), nullable=True)
    id_parentesco = Column(BigInteger, nullable=True)
    a_cargo = Column(Boolean, nullable=False, default=True)
    deduce_ganancias = Column(Boolean, nullable=False, default=False)
    discapacitado = Column(Boolean, nullable=False, default=False)
    porcentaje_deduccion = Column(Numeric(8, 4), nullable=False, default=0)
    activo = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), default=_now)


class PresupuestoCargo(Base):
    """Planta presupuestaria: cargos previstos por categoría/tipo y su costo anual."""
    __tablename__ = "rrhh_presupuesto_cargos"
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    anio = Column(Integer, nullable=False, index=True)
    id_categoria = Column(BigInteger, nullable=True)
    id_tipo_cargo = Column(BigInteger, nullable=True)
    objeto_gasto = Column(String(30), nullable=True)
    cantidad_cargos = Column(Integer, nullable=False, default=0)
    costo_anual = Column(Numeric(18, 2), nullable=False, default=0)
    activo = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), default=_now)


# ─── FASE 2: MOTOR DE CONCEPTOS + LIQUIDACIÓN ─────────────────────────
TIPOS_CONCEPTO = ("H", "A", "E", "D", "R", "P")  # Haber, Asig.Familiar, Exento, Descuento, Retención/aporte, Aporte patronal
ESTADOS_PROCESO = ("procesada", "anulada")


class Concepto(Base):
    """Concepto liquidable con fórmulas de texto (condicion/cantidad/base/porcentaje/formula)."""
    __tablename__ = "rrhh_conceptos"
    __table_args__ = (UniqueConstraint("codigo", name="uq_rrhh_concepto_codigo"),)
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    codigo = Column(String(20), nullable=False, index=True)
    descripcion = Column(String(200), nullable=False)
    tipo = Column(String(1), nullable=False, default="H")  # H|A|E|D|R|P
    orden = Column(Numeric(8, 2), nullable=False, default=0)
    condicion = Column(Text, nullable=True)
    cantidad = Column(Text, nullable=True)
    base = Column(Text, nullable=True)
    porcentaje = Column(Text, nullable=True)
    formula = Column(Text, nullable=True)
    aguinaldo = Column(Boolean, nullable=False, default=False)
    activo = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), default=_now)


class TipoLiquidacion(Base):
    """Tipo de liquidación: Mensual, Aguinaldo, etc."""
    __tablename__ = "rrhh_tipos_liquidacion"
    __table_args__ = (UniqueConstraint("codigo", name="uq_rrhh_tipo_liquidacion_codigo"),)
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    codigo = Column(String(10), nullable=False)
    descripcion = Column(String(200), nullable=False)
    activo = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), default=_now)


class LiquidacionProceso(Base):
    """Proceso de liquidación de un período (idempotente por anio/mes/tipo_liq activo)."""
    __tablename__ = "rrhh_liquidacion_procesos"
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    anio = Column(Integer, nullable=False, index=True)
    mes = Column(Integer, nullable=False, index=True)
    id_tipo_liquidacion = Column(BigInteger, nullable=True)
    tipo_liq = Column(String(10), nullable=True)
    valor_modulo = Column(Numeric(18, 4), nullable=False, default=0)
    estado = Column(String(20), nullable=False, default="procesada")  # procesada | anulada
    cantidad_legajos = Column(Integer, nullable=False, default=0)
    total_haberes = Column(Numeric(18, 2), nullable=False, default=0)
    total_retenciones = Column(Numeric(18, 2), nullable=False, default=0)
    total_neto = Column(Numeric(18, 2), nullable=False, default=0)
    creado_por = Column(String(100), nullable=True)
    created_at = Column(DateTime(timezone=True), default=_now)
    activo = Column(Boolean, nullable=False, default=True)


class LiquidacionRenglon(Base):
    """Renglón de liquidación: un concepto calculado para un legajo dentro de un proceso."""
    __tablename__ = "rrhh_liquidacion"
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_proceso = Column(BigInteger, nullable=False, index=True)
    id_legajo = Column(BigInteger, nullable=False, index=True)
    id_cargo = Column(BigInteger, nullable=True)
    concepto_codigo = Column(String(20), nullable=True)
    concepto_descripcion = Column(String(200), nullable=True)
    orden = Column(Numeric(8, 2), nullable=False, default=0)
    tipo_concepto = Column(String(1), nullable=True)
    cantidad = Column(Numeric(18, 4), nullable=False, default=0)
    base = Column(Numeric(18, 2), nullable=False, default=0)
    porcentaje = Column(Numeric(12, 4), nullable=False, default=0)
    importe = Column(Numeric(18, 2), nullable=False, default=0)
    created_at = Column(DateTime(timezone=True), default=_now)


class TotalesLiquidacion(Base):
    """Totales por legajo dentro de un proceso de liquidación (recibo)."""
    __tablename__ = "rrhh_totales_liquidacion"
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_proceso = Column(BigInteger, nullable=False, index=True)
    id_legajo = Column(BigInteger, nullable=False, index=True)
    legajo_numero = Column(String(20), nullable=True)
    apellido_nombre = Column(String(250), nullable=True)
    haberes = Column(Numeric(18, 2), nullable=False, default=0)
    asig_familiar = Column(Numeric(18, 2), nullable=False, default=0)
    exentos = Column(Numeric(18, 2), nullable=False, default=0)
    retenciones = Column(Numeric(18, 2), nullable=False, default=0)
    descuentos = Column(Numeric(18, 2), nullable=False, default=0)
    aportes_patronales = Column(Numeric(18, 2), nullable=False, default=0)
    neto = Column(Numeric(18, 2), nullable=False, default=0)
    numero_recibo = Column(String(30), nullable=True)
    created_at = Column(DateTime(timezone=True), default=_now)


class Novedad(Base):
    """Novedad de liquidación: variable que el motor inyecta al contexto del legajo/período.
    id_legajo null = aplica a todos; anio/mes null = aplica a todo período."""
    __tablename__ = "rrhh_novedades"
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_legajo = Column(BigInteger, nullable=True, index=True)
    variable = Column(String(20), nullable=False)  # ej '@TIENE_TITULO'
    valor = Column(Numeric(18, 4), nullable=False, default=0)
    anio = Column(Integer, nullable=True)
    mes = Column(Integer, nullable=True)
    descripcion = Column(String(200), nullable=True)
    activo = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), default=_now)


# ─── FASE 3: AUSENCIAS / LICENCIAS, HORAS EXTRA y EMBARGOS ────────────
TIPOS_HORA_EXTRA = ("50", "100")
TIPOS_EMBARGO = ("alimentos", "comun")
RETIENE_EMBARGO = ("porcentaje", "importe")
ESTADOS_EMBARGO = ("autorizado", "anulado", "finalizado")


class MotivoAusencia(Base):
    """Motivo de ausencia/licencia y su impacto sobre la liquidación."""
    __tablename__ = "rrhh_motivos_ausencia"
    __table_args__ = (UniqueConstraint("codigo", name="uq_rrhh_motivo_ausencia_codigo"),)
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    codigo = Column(String(20), nullable=False, index=True)
    descripcion = Column(String(200), nullable=False)
    porcentaje_descuento = Column(Numeric(6, 2), nullable=False, default=0)
    descuenta_dias = Column(Boolean, nullable=False, default=False)
    descuenta_aguinaldo = Column(Boolean, nullable=False, default=False)
    afecta_presentismo = Column(Boolean, nullable=False, default=False)
    es_licencia_anual = Column(Boolean, nullable=False, default=False)
    requiere_certificado = Column(Boolean, nullable=False, default=False)
    activo = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), default=_now)


class Ausencia(Base):
    """Ausencia/licencia de un legajo en un rango de fechas."""
    __tablename__ = "rrhh_ausencias"
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_legajo = Column(BigInteger, nullable=False, index=True)
    id_motivo = Column(BigInteger, nullable=True)
    fecha_inicio = Column(Date, nullable=False)
    fecha_fin = Column(Date, nullable=False)
    dias_habiles = Column(Integer, nullable=False, default=0)
    certificado = Column(Boolean, nullable=False, default=False)
    observaciones = Column(String(300), nullable=True)
    activo = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), default=_now)


class LicenciaAnual(Base):
    """Cupo de licencia anual (vacaciones) de un legajo por año."""
    __tablename__ = "rrhh_licencias_anuales"
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_legajo = Column(BigInteger, nullable=False, index=True)
    anio = Column(Integer, nullable=False)
    cant_dias = Column(Integer, nullable=False, default=0)
    dias_tomados = Column(Integer, nullable=False, default=0)
    activo = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), default=_now)


class HoraExtra(Base):
    """Horas extra de un legajo en un período, por tipo (50% / 100%)."""
    __tablename__ = "rrhh_horas_extra"
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_legajo = Column(BigInteger, nullable=False, index=True)
    anio = Column(Integer, nullable=False)
    mes = Column(Integer, nullable=False)
    tipo = Column(String(10), nullable=False, default="50")  # 50 | 100
    cantidad = Column(Numeric(8, 2), nullable=False, default=0)
    valor_hora = Column(Numeric(18, 4), nullable=False, default=0)
    activo = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), default=_now)


class Embargo(Base):
    """Embargo judicial sobre el sueldo de un legajo."""
    __tablename__ = "rrhh_embargos"
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_legajo = Column(BigInteger, nullable=False, index=True)
    numero = Column(String(30), nullable=True)
    tipo = Column(String(20), nullable=False, default="comun")  # alimentos | comun
    retiene = Column(String(10), nullable=False, default="porcentaje")  # porcentaje | importe
    cuota_valor = Column(Numeric(18, 4), nullable=False, default=0)  # % si porcentaje, importe fijo si importe
    monto_total = Column(Numeric(18, 2), nullable=False, default=0)  # tope total (0 = sin tope)
    respeta_salario_familiar = Column(Boolean, nullable=False, default=True)
    fecha = Column(Date, nullable=True)
    fecha_vencimiento = Column(Date, nullable=True)
    caratula = Column(String(300), nullable=True)
    juzgado = Column(String(200), nullable=True)
    estado = Column(String(20), nullable=False, default="autorizado")  # autorizado | anulado | finalizado
    banco_destino = Column(String(100), nullable=True)
    activo = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), default=_now)


class EmbargoLiquidado(Base):
    """Cuota de embargo efectivamente retenida en un proceso de liquidación."""
    __tablename__ = "rrhh_embargos_liquidados"
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_embargo = Column(BigInteger, nullable=False, index=True)
    id_proceso = Column(BigInteger, nullable=False, index=True)
    id_legajo = Column(BigInteger, nullable=True)
    anio = Column(Integer, nullable=True)
    mes = Column(Integer, nullable=True)
    monto = Column(Numeric(18, 2), nullable=False, default=0)
    created_at = Column(DateTime(timezone=True), default=_now)


# ─── FASE 4: IMPUESTO A LAS GANANCIAS (4ta categoría) y SAC ───────────
CONCEPTOS_DEDUCCION = (
    "minimo_no_imponible", "deduccion_especial", "conyuge", "hijo", "hijo_incapacitado",
)


class GananciasDeduccion(Base):
    """Deducciones personales anuales del impuesto a las ganancias por año fiscal."""
    __tablename__ = "rrhh_ganancias_deducciones"
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    anio = Column(Integer, nullable=False, index=True)
    concepto = Column(String(40), nullable=False)  # ver CONCEPTOS_DEDUCCION
    importe_anual = Column(Numeric(18, 2), nullable=False, default=0)
    activo = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), default=_now)


class GananciasEscala(Base):
    """Escala progresiva del art. 94 (Ganancias) por año fiscal."""
    __tablename__ = "rrhh_ganancias_escala"
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    anio = Column(Integer, nullable=False, index=True)
    tramo = Column(Integer, nullable=False, default=0)
    desde = Column(Numeric(18, 2), nullable=False, default=0)
    hasta = Column(Numeric(18, 2), nullable=True)  # null = sin tope (último tramo)
    fijo = Column(Numeric(18, 2), nullable=False, default=0)
    porcentaje = Column(Numeric(6, 2), nullable=False, default=0)
    excedente_sobre = Column(Numeric(18, 2), nullable=False, default=0)
    activo = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), default=_now)


class GananciasResumen(Base):
    """Liquidación mensual acumulada del impuesto a las ganancias por legajo/período."""
    __tablename__ = "rrhh_ganancias_resumen"
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_legajo = Column(BigInteger, nullable=False, index=True)
    anio = Column(Integer, nullable=False, index=True)
    mes = Column(Integer, nullable=False)
    id_proceso = Column(BigInteger, nullable=True, index=True)
    rem_neta_gravada = Column(Numeric(18, 2), nullable=False, default=0)
    deducciones = Column(Numeric(18, 2), nullable=False, default=0)
    ganancia_neta_acum = Column(Numeric(18, 2), nullable=False, default=0)
    impuesto_acum = Column(Numeric(18, 2), nullable=False, default=0)
    retencion_mes = Column(Numeric(18, 2), nullable=False, default=0)
    es_sac = Column(Boolean, nullable=False, default=False)  # fila del aguinaldo (SAC)
    created_at = Column(DateTime(timezone=True), default=_now)
