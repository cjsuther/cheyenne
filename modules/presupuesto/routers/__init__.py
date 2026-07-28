from .info import router as info_router
from .nomencladores import (
    jurisdicciones_router, objetos_gasto_router, fuentes_router, rubros_router, estructuras_router,
)
from .ejercicios import router as ejercicios_router
from .partidas import router as partidas_router
from .modificaciones import router as modificaciones_router
from .afectaciones import router as afectaciones_router
from .recursos import router as recursos_router
from .tablero import router as tablero_router
from .cuotas import router as cuotas_router
from .rrhh import cargos_router, rrhh_router
from .reportes import router as reportes_router
