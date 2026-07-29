"""Cliente HTTP entre módulos con reintentos SEGUROS ante fallos transitorios.

Reintenta siempre ante errores de CONEXIÓN (la request nunca llegó al servidor, p.ej. el destino
está reiniciando): es seguro incluso para writes porque no hubo efecto colateral. Otros errores
transitorios (timeouts de lectura) solo se reintentan si retry_on_timeout=True, que debe usarse
únicamente en operaciones idempotentes/lecturas para no duplicar efectos en un write.
"""
import time
import httpx


def request_retry(method, url, *, json=None, headers=None, timeout=10.0,
                  retries=2, backoff=0.25, retry_on_timeout=False):
    """Ejecuta la request reintentando ante fallos transitorios. Devuelve el httpx.Response
    (2xx/4xx/5xx del servidor) o relanza la última excepción de red si se agotan los intentos."""
    ultimo = None
    for intento in range(retries + 1):
        try:
            with httpx.Client(timeout=timeout) as client:
                return client.request(method, url, json=json, headers=headers or {})
        except httpx.RequestError as e:
            es_conexion = isinstance(e, (httpx.ConnectError, httpx.ConnectTimeout))
            ultimo = e
            # write + no-conexión: no reintentar (la request pudo haberse procesado)
            if not (es_conexion or retry_on_timeout):
                raise
            if intento >= retries:
                raise
            time.sleep(backoff * (intento + 1))
    raise ultimo  # inalcanzable


def get_json_retry(url, *, headers=None, timeout=10.0, retries=2):
    """GET idempotente con reintentos amplios (incluye timeouts). Devuelve el Response."""
    return request_retry("GET", url, headers=headers, timeout=timeout, retries=retries,
                         retry_on_timeout=True)
