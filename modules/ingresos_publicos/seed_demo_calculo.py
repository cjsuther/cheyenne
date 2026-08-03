"""Seed de base imponible para que las emisiones CALCULEN (demo end-to-end).
Poba valuaciones de vehículos (con su codigo_modelo), valuaciones+superficies de inmuebles
y DD.JJ. de comercios. Idempotente. Ejecutar: docker compose exec ingresos_publicos python seed_demo_calculo.py
"""
import sys
import os
from decimal import Decimal

sys.path.insert(0, os.path.dirname(__file__))
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from database import SessionLocal, engine
from shared.database import Base

from models.vehiculo import Vehiculo
from models.vehiculo_valuacion import VehiculoValuacion
from models.inmueble import Inmueble
from models.inmueble_valuacion import InmuebleValuacion
from models.inmueble_superficie import InmuebleSuperficie
from models.comercio import Comercio
from models.comercio_ddjj import ComercioDDJJ

EJ = 2026


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    nv = ni = nc = 0

    # --- Vehículos: codigo_modelo + valuación DNRPA (base imponible de patente) ---
    valores_veh = [3500000, 5200000, 6800000, 2900000, 4100000, 7300000]
    for i, v in enumerate(db.query(Vehiculo).filter(Vehiculo.activo == True).order_by(Vehiculo.id).all()):
        cod = v.codigo_modelo or f"VMOD{v.id:03d}"
        v.codigo_modelo = cod
        if not v.anio:
            v.anio = 2020
        ya = db.query(VehiculoValuacion).filter(
            VehiculoValuacion.codigo_modelo == cod, VehiculoValuacion.anio == v.anio,
            VehiculoValuacion.activo == True,
        ).first()
        if not ya:
            db.add(VehiculoValuacion(codigo_modelo=cod, anio=v.anio, ejercicio=EJ,
                                     valor=Decimal(str(valores_veh[i % len(valores_veh)])), activo=True))
            nv += 1

    # --- Inmuebles: asegurar valuación (id_tipo_valuacion=1) + superficie (tipo 1, clase 1) para todos ---
    for j, inm in enumerate(db.query(Inmueble).filter(Inmueble.activo == True).order_by(Inmueble.id).all()):
        if not db.query(InmuebleValuacion).filter(
            InmuebleValuacion.id_inmueble == inm.id, InmuebleValuacion.activo == True
        ).first():
            db.add(InmuebleValuacion(id_inmueble=inm.id, id_tipo_valuacion=1, ejercicio=EJ,
                                     valor=Decimal(str(300000 + j * 45000)), activo=True))
            ni += 1
        if not db.query(InmuebleSuperficie).filter(
            InmuebleSuperficie.id_inmueble == inm.id, InmuebleSuperficie.activo == True
        ).first():
            db.add(InmuebleSuperficie(id_inmueble=inm.id, id_tipo_superficie=1, clase=1,
                                      superficie=Decimal(str(60 + j * 12)), activo=True))

    # --- Comercios: DD.JJ. de ingresos (base imponible de Seguridad e Higiene / IIBB) ---
    ingresos = [1800000, 950000, 3200000, 600000, 2400000]
    for k, com in enumerate(db.query(Comercio).filter(Comercio.activo == True).order_by(Comercio.id).all()):
        if not db.query(ComercioDDJJ).filter(ComercioDDJJ.id_comercio == com.id).first():
            db.add(ComercioDDJJ(id_comercio=com.id, periodo=202512, mes=12,
                                ingresos_declarados=Decimal(str(ingresos[k % len(ingresos)]))))
            nc += 1

    db.commit()
    print(f"seed_demo_calculo: +{nv} valuaciones vehiculos, +{ni} valuaciones inmuebles, +{nc} DDJJ comercios")
    db.close()


if __name__ == "__main__":
    seed()
