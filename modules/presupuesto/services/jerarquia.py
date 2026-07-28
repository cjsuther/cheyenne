"""Jerarquía de nomencladores por código punteado (estilo RAFAM: '1.1.4.02')."""
from typing import Optional


def normalizar_codigo(codigo: str) -> str:
    return ".".join(seg.strip() for seg in (codigo or "").strip().strip(".").split(".") if seg.strip())


def nivel_de(codigo: str) -> int:
    c = normalizar_codigo(codigo)
    return c.count(".") + 1 if c else 0


def codigo_padre(codigo: str) -> Optional[str]:
    c = normalizar_codigo(codigo)
    return c.rsplit(".", 1)[0] if "." in c else None


def resolver_jerarquia(db, modelo, codigo: str):
    """Devuelve (codigo_normalizado, nivel, id_padre) buscando el padre por código.
    El padre puede no existir (se permite cargar hojas primero); id_padre queda nulo."""
    c = normalizar_codigo(codigo)
    nivel = nivel_de(c)
    id_padre = None
    cp = codigo_padre(c)
    if cp:
        padre = db.query(modelo).filter(modelo.codigo == cp, modelo.activo == True).first()
        if padre:
            id_padre = padre.id
    return c, nivel, id_padre


def armar_arbol(filas) -> list:
    """Lista plana (con codigo) → árbol anidado [{...fila, hijos: []}] ordenado por código."""
    nodos = {f["codigo"]: {**f, "hijos": []} for f in filas}
    raices = []
    for cod in sorted(nodos.keys(), key=lambda c: [s.zfill(6) for s in c.split(".")]):
        n = nodos[cod]
        cp = codigo_padre(cod)
        if cp and cp in nodos:
            nodos[cp]["hijos"].append(n)
        else:
            raices.append(n)
    return raices
