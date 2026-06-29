"""Constructor del padrón de cálculo (productor para el módulo de emisiones).

Arma, por cada inmueble, el `datos_calculo` que consume el motor de cálculo de `emisiones`
(intérprete de fórmulas): variables de la cuenta + valuaciones + superficies. Es el contrato
de datos entre `ingresos_publicos` (dueño del padrón) y `emisiones` (dueño del cálculo).

La función `build_datos_calculo` es pura (opera sobre filas ORM) y por eso testeable; el
servicio sólo agrega las consultas a la base.
"""
from typing import Any, Dict, List, Optional

from sqlalchemy.orm import Session

from models.inmueble import Inmueble
from models.cuenta import Cuenta
from models.inmueble_valuacion import InmuebleValuacion
from models.inmueble_superficie import InmuebleSuperficie
from models.inmueble_frente import InmuebleFrente
from models.comercio import Comercio
from models.comercio_rubro import ComercioRubro
from models.comercio_ddjj import ComercioDDJJ
from models.vehiculo import Vehiculo
from models.vehiculo_valuacion import VehiculoValuacion


def _aaaammdd(d) -> Optional[int]:
    return None if d is None else d.year * 10000 + d.month * 100 + d.day


def build_datos_calculo(inmueble, cuenta, valuaciones, superficies, frentes) -> Dict[str, Any]:
    """Construye el `datos_calculo` (variables + valuaciones + superficies) de un inmueble.

    Nota: las variables catastrales completas del legacy (zona tarifaria `@I_ZONATARI`,
    tipo de vivienda `@I_TIPOVIV`, etc.) requieren modelar la nomenclatura/zona del inmueble
    (gap documentado). Por ahora se exponen las disponibles + valuaciones/superficies, que es
    lo que necesitan las fórmulas que ponderan por valuación y superficie.
    """
    metros_frente = sum((f.metros for f in frentes), 0)
    variables = {
        "I_CIRCUITO": inmueble.circuito or "",
        "I_SECTOR": inmueble.sector or "",
        "I_FRACCION": inmueble.fraccion or "",
        "I_PARCELA": inmueble.parcela or "",
        "I_METROS_FRENTE": float(metros_frente),
    }
    return {
        "variables": variables,
        "valuaciones": [
            {"tval_Codigo": v.id_tipo_valuacion or 0, "valu_Valor": float(v.valor)}
            for v in valuaciones
        ],
        "superficies": [
            {
                "tips_Codigo": s.id_tipo_superficie or 0,
                "tips_Clase": s.clase or 0,
                "supe_Superficie": float(s.superficie),
                "supe_FechaVigencia": _aaaammdd(s.fecha_vigencia) or 0,
            }
            for s in superficies
        ],
    }


def build_datos_calculo_comercio(comercio, cuenta, rubros, ultima_ddjj) -> Dict[str, Any]:
    """Base imponible de un comercio: ingresos declarados (última DD.JJ.) + rubros.

    La alícuota por rubro es parametrización de la tasa (FormulaTasa), no viaja acá.
    """
    ingresos = float(ultima_ddjj.ingresos_declarados) if ultima_ddjj is not None else 0.0
    variables = {
        "C_INGRESOS": ingresos,
        "C_PERIODO_DDJJ": ultima_ddjj.periodo if ultima_ddjj is not None else 0,
        "C_RUBROS": "/".join(str(r.id_rubro) for r in rubros),
        "C_GRAN_CONTRIBUYENTE": 1 if getattr(comercio, "gran_contribuyente", False) else 0,
        "C_CUIT": comercio.cuit or "",
    }
    return {"variables": variables, "valuaciones": [], "superficies": []}


def build_datos_calculo_vehiculo(vehiculo, cuenta, valuacion) -> Dict[str, Any]:
    """Base imponible de un vehículo: valuación DNRPA del modelo/año."""
    variables = {
        "V_VALUACION": float(valuacion.valor) if valuacion is not None else 0.0,
        "V_ANIO": vehiculo.anio or 0,
        "V_MODELO": vehiculo.anio or 0,        # en el legacy @V_MODELO = año/modelo
        "V_DOMINIO": vehiculo.dominio or "",
        "V_TIENE_VALUACION": 1 if valuacion is not None else 0,
    }
    return {"variables": variables, "valuaciones": [], "superficies": []}


class PadronService:
    def __init__(self, db: Session):
        self.db = db

    def build_padron_inmuebles(self, skip: int = 0, limit: int = 100) -> List[Dict[str, Any]]:
        inmuebles = (
            self.db.query(Inmueble)
            .filter(Inmueble.activo == True)
            .offset(skip).limit(limit).all()
        )
        salida: List[Dict[str, Any]] = []
        for inm in inmuebles:
            cuenta = self.db.query(Cuenta).filter(Cuenta.id == inm.id_cuenta).first()
            vals = self.db.query(InmuebleValuacion).filter(
                InmuebleValuacion.id_inmueble == inm.id, InmuebleValuacion.activo == True
            ).all()
            sups = self.db.query(InmuebleSuperficie).filter(
                InmuebleSuperficie.id_inmueble == inm.id, InmuebleSuperficie.activo == True
            ).all()
            frentes = self.db.query(InmuebleFrente).filter(
                InmuebleFrente.id_inmueble == inm.id, InmuebleFrente.activo == True
            ).all()
            salida.append({
                "id_inmueble": inm.id,
                "id_cuenta": inm.id_cuenta,
                "id_contribuyente": cuenta.id_contribuyente if cuenta else None,
                "numero_cuenta": cuenta.numero_cuenta if cuenta else None,
                "datos_calculo": build_datos_calculo(inm, cuenta, vals, sups, frentes),
            })
        return salida

    def build_padron_comercios(self, skip: int = 0, limit: int = 100) -> List[Dict[str, Any]]:
        comercios = (
            self.db.query(Comercio).filter(Comercio.activo == True)
            .offset(skip).limit(limit).all()
        )
        salida: List[Dict[str, Any]] = []
        for com in comercios:
            cuenta = self.db.query(Cuenta).filter(Cuenta.id == com.id_cuenta).first()
            rubros = self.db.query(ComercioRubro).filter(
                ComercioRubro.id_comercio == com.id, ComercioRubro.activo == True
            ).all()
            ultima = (
                self.db.query(ComercioDDJJ)
                .filter(ComercioDDJJ.id_comercio == com.id, ComercioDDJJ.activo == True)
                .order_by(ComercioDDJJ.periodo.desc(), ComercioDDJJ.mes.desc())
                .first()
            )
            salida.append({
                "id_inmueble": com.id,   # id del objeto imponible (clave genérica del padrón)
                "id_cuenta": com.id_cuenta,
                "id_contribuyente": cuenta.id_contribuyente if cuenta else None,
                "numero_cuenta": cuenta.numero_cuenta if cuenta else None,
                "datos_calculo": build_datos_calculo_comercio(com, cuenta, rubros, ultima),
            })
        return salida

    def build_padron_vehiculos(self, skip: int = 0, limit: int = 100) -> List[Dict[str, Any]]:
        vehiculos = (
            self.db.query(Vehiculo).filter(Vehiculo.activo == True)
            .offset(skip).limit(limit).all()
        )
        salida: List[Dict[str, Any]] = []
        for veh in vehiculos:
            cuenta = self.db.query(Cuenta).filter(Cuenta.id == veh.id_cuenta).first()
            valuacion = None
            if veh.codigo_modelo and veh.anio:
                valuacion = (
                    self.db.query(VehiculoValuacion)
                    .filter(
                        VehiculoValuacion.codigo_modelo == veh.codigo_modelo,
                        VehiculoValuacion.anio == veh.anio,
                        VehiculoValuacion.activo == True,
                    )
                    .order_by(VehiculoValuacion.ejercicio.desc())
                    .first()
                )
            salida.append({
                "id_inmueble": veh.id,
                "id_cuenta": veh.id_cuenta,
                "id_contribuyente": cuenta.id_contribuyente if cuenta else None,
                "numero_cuenta": cuenta.numero_cuenta if cuenta else None,
                "datos_calculo": build_datos_calculo_vehiculo(veh, cuenta, valuacion),
            })
        return salida
