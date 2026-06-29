from typing import Any, Dict, Optional

from pydantic import BaseModel


class PadronCalculoItem(BaseModel):
    id_inmueble: int
    id_cuenta: Optional[int] = None
    id_contribuyente: Optional[int] = None
    numero_cuenta: Optional[str] = None
    datos_calculo: Dict[str, Any]
