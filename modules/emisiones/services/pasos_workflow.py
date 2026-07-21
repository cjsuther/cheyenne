"""Registro del workflow de emisión (16 pasos) y sus permisos de ejecución.

Cada paso tiene:
  - numero      : orden en el workflow (1..16)
  - key         : slug estable
  - nombre      : título visible
  - descripcion : qué hace / qué controla el operador
  - tipo        : 'ejecucion' | 'aprobacion' | 'edicion'
  - permiso     : código de permiso requerido (se siembra en seguridad y se asigna por rol)

El permiso de cada paso se verifica en el endpoint genérico de ejecución.
"""

PASOS = [
    {"numero": 1, "key": "importar_calculo", "tipo": "ejecucion",
     "nombre": "Importar cálculo anterior",
     "descripcion": "Recupera los parámetros de la emisión de referencia. El operador solo observa que se hayan recuperado.",
     "permiso": "emisiones_paso01_importar_calculo"},
    {"numero": 2, "key": "editar_calculo", "tipo": "edicion",
     "nombre": "Editar cálculo anterior",
     "descripcion": "Modifica los parámetros: fechas desde/hasta, vencimientos, número de cuota, tasas/sub-tasas, criterios de selección y demás atributos.",
     "permiso": "emisiones_paso02_editar_calculo"},
    {"numero": 3, "key": "calculo_prueba", "tipo": "ejecucion",
     "nombre": "Generar cálculo de prueba",
     "descripcion": "El operador carga cuentas de prueba y genera el cálculo para ellas.",
     "permiso": "emisiones_paso03_calculo_prueba"},
    {"numero": 4, "key": "aprobar_calculo_prueba", "tipo": "aprobacion",
     "nombre": "Aprobación del cálculo de prueba",
     "descripcion": "El operador controla que el cálculo de esas cuentas sea correcto (importes a cobrar en las distintas fechas).",
     "permiso": "emisiones_paso04_aprob_calculo_prueba"},
    {"numero": 5, "key": "calculo_general", "tipo": "ejecucion",
     "nombre": "Generar cálculo general",
     "descripcion": "Igual al cálculo de prueba pero sobre todo el padrón.",
     "permiso": "emisiones_paso05_calculo_general"},
    {"numero": 6, "key": "aprobar_calculo_general", "tipo": "aprobacion",
     "nombre": "Aprobación del cálculo general",
     "descripcion": "Muestra totalizador (cantidad de cuentas e importes) y el detalle de los cálculos por cuenta/tributo.",
     "permiso": "emisiones_paso06_aprob_calculo_general"},
    {"numero": 7, "key": "ordenamiento_prueba", "tipo": "ejecucion",
     "nombre": "Ordenamiento de prueba",
     "descripcion": "Aplica sobre cuentas de prueba el ordenamiento para reparto eficiente (código postal, barrio, calle, número).",
     "permiso": "emisiones_paso07_ordenamiento_prueba"},
    {"numero": 8, "key": "impresion_prueba", "tipo": "ejecucion",
     "nombre": "Impresión de los recibos de prueba",
     "descripcion": "Imprime los recibos en el orden establecido dentro de un directorio de prueba.",
     "permiso": "emisiones_paso08_impresion_prueba"},
    {"numero": 9, "key": "aprobar_ordenamiento_prueba", "tipo": "aprobacion",
     "nombre": "Aprobación del ordenamiento de prueba",
     "descripcion": "El operador controla que el ordenamiento se haya hecho según el criterio fijado y lo aprueba.",
     "permiso": "emisiones_paso09_aprob_ordenamiento_prueba"},
    {"numero": 10, "key": "aprobar_impresion_prueba", "tipo": "aprobacion",
     "nombre": "Aprobación de la impresión de prueba",
     "descripcion": "El operador controla las impresiones de prueba y, si son satisfactorias, las aprueba.",
     "permiso": "emisiones_paso10_aprob_impresion_prueba"},
    {"numero": 11, "key": "aprobar_codigo_barras", "tipo": "aprobacion",
     "nombre": "Aprobación del código de barras",
     "descripcion": "El operador controla que los códigos de barras sean correctos y legibles por lectora, y los aprueba.",
     "permiso": "emisiones_paso11_aprob_codigo_barras"},
    {"numero": 12, "key": "ordenamiento_general", "tipo": "ejecucion",
     "nombre": "Ordenamiento general",
     "descripcion": "Si el paso anterior fue satisfactorio, lanza el ordenamiento general.",
     "permiso": "emisiones_paso12_ordenamiento_general"},
    {"numero": 13, "key": "aprobar_ordenamiento_general", "tipo": "aprobacion",
     "nombre": "Aprobación del ordenamiento general",
     "descripcion": "El operador controla en tabla que el ordenamiento esté acorde a los criterios establecidos.",
     "permiso": "emisiones_paso13_aprob_ordenamiento_general"},
    {"numero": 14, "key": "impresion_general", "tipo": "ejecucion",
     "nombre": "Impresión de los recibos general",
     "descripcion": "Imprime los recibos en el orden establecido dentro de un directorio final.",
     "permiso": "emisiones_paso14_impresion_general"},
    {"numero": 15, "key": "aprobar_impresion_general", "tipo": "aprobacion",
     "nombre": "Aprobación de la impresión general",
     "descripcion": "El operador controla por muestreo algunas impresiones y los totales, y aprueba la impresión general.",
     "permiso": "emisiones_paso15_aprob_impresion_general"},
    {"numero": 16, "key": "generar_cuenta_corriente", "tipo": "ejecucion",
     "nombre": "Generación de la cuenta corriente",
     "descripcion": "Impacta en cada cuenta el saldo pendiente de cobro; el saldo queda visible en la cuenta.",
     "permiso": "emisiones_paso16_cuenta_corriente"},
]

PASOS_POR_NUMERO = {p["numero"]: p for p in PASOS}
TOTAL_PASOS = len(PASOS)


def permisos_workflow():
    """Definición de los permisos de los pasos, para sembrar en seguridad."""
    return [
        {"codigo": p["permiso"], "nombre": f"Emisiones · {p['nombre']}",
         "descripcion": f"Ejecutar el paso {p['numero']}: {p['nombre']}", "sistema": "emisiones"}
        for p in PASOS
    ]
