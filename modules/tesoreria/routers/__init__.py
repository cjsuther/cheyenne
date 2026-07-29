from .cajas import router as cajas_router
from .recaudacion_lotes import router as recaudacion_lotes_router
from .recibo_publicacion_lotes import router as recibo_publicacion_lotes_router
from .pago_rendicion_lotes import router as pago_rendicion_lotes_router
from .registro_contable_lotes import router as registro_contable_lotes_router
from .listas import router as listas_router
from .entidades import router as entidades_router
from .dependencias import router as dependencias_router
from .recaudadoras import router as recaudadoras_router
from .archivos import router as archivos_router
from .observaciones import router as observaciones_router
from .egresos import beneficiarios_router, cuentas_router, op_router, egresos_router
from .banca import (
    cheques_router, chequeras_router, ob_router, conc_router,
)
