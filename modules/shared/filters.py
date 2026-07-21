"""
Utilidad genérica de filtrado por columna para endpoints de listado.
Aplica ILIKE para strings, match exacto para numéricos/booleanos.

Uso en routers:
    from starlette.requests import Request
    from shared.filters import filtered_query

    @router.get("")
    def list_items(request: Request, skip=..., limit=..., db=...):
        query = db.query(Model)
        # aplicar filtros propios del endpoint (tipo, ejercicio, etc.)
        ...
        query = filtered_query(query, Model, dict(request.query_params), exclude={'skip', 'limit', 'tipo'})
        return query.offset(skip).limit(limit).all()
"""

from sqlalchemy import String, Integer, BigInteger, Numeric, Boolean

# Claves de control que nunca son filtros de columna
_CONTROL_KEYS = {'skip', 'limit', 'sort_by', 'sort_dir'}


def _valid_column(model, name):
    """Devuelve la columna del modelo si `name` es una columna real, si no None."""
    if not name:
        return None
    col = getattr(model, name, None)
    if col is None or not hasattr(col, 'type'):
        return None
    return col


def apply_order(query, model, params: dict, default_sort: str = 'id', default_dir: str = 'asc'):
    """Ordena el query según `sort_by`/`sort_dir` de los query params.

    Si `sort_by` no es una columna válida, cae al `default_sort` del endpoint y,
    en última instancia, a `id`. Resetea cualquier orden previo para ser autoritativo.
    """
    p = params or {}
    sort_by = p.get('sort_by')
    sort_dir = (p.get('sort_dir') or default_dir or 'asc').lower()
    col = _valid_column(model, sort_by) or _valid_column(model, default_sort) or _valid_column(model, 'id')
    if col is None:
        return query
    query = query.order_by(None)
    return query.order_by(col.desc() if sort_dir == 'desc' else col.asc())


def filtered_query(query, model, params: dict, exclude: set = None,
                   default_sort: str = 'id', default_dir: str = 'asc'):
    """Aplica filtros genéricos por columna + ordenamiento desde query params.

    Ordena por `sort_by`/`sort_dir` si vienen; si no, por `default_sort` (por defecto `id`).
    """
    skip_keys = _CONTROL_KEYS | (exclude or set())
    for key, value in params.items():
        if key in skip_keys or not value:
            continue
        col = getattr(model, key, None)
        if col is None or not hasattr(col, 'type'):
            continue
        col_type = col.type
        if isinstance(col_type, String):
            query = query.filter(col.ilike(f"%{value}%"))
        elif isinstance(col_type, (Integer, BigInteger)):
            try:
                query = query.filter(col == int(value))
            except (ValueError, TypeError):
                pass
        elif isinstance(col_type, Numeric):
            try:
                from decimal import Decimal
                query = query.filter(col == Decimal(value))
            except Exception:
                pass
        elif isinstance(col_type, Boolean):
            query = query.filter(col == (value.lower() in ('true', '1', 'si')))
    return apply_order(query, model, params, default_sort, default_dir)
