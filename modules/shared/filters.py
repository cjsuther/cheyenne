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


def filtered_query(query, model, params: dict, exclude: set = None):
    """Aplica filtros genéricos por columna desde query params a un query SQLAlchemy."""
    skip_keys = {'skip', 'limit'} | (exclude or set())
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
    return query
