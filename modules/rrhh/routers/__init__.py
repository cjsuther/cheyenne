from .maestros import (
    categorias_router, tipos_cargo_router, cargos_funciones_router, niveles_laboral_router,
    tipos_relacion_router, oficinas_router, parentescos_router, tipos_antiguedad_router,
    sindicatos_router, obras_sociales_router,
)
from .legajos import (
    legajos_router, legajo_cargos_router, antiguedades_router, familiares_router,
)
from .planta import presupuesto_cargos_router
from .liquidacion import (
    conceptos_router, tipos_liquidacion_router, novedades_router,
    liquidar_router, procesos_router,
)
