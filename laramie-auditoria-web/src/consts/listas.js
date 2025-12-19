const LISTAS = {
    MODULO: {
        30: { tipo: 'Modulo', nombre: 'Ingresos Públicos' },
        31: { tipo: 'Modulo', nombre: 'Administración' },
        32: { tipo: 'Modulo', nombre: 'Seguridad' },
        33: { tipo: 'Modulo', nombre: 'Auditoria' },
        34: { tipo: 'Modulo', nombre: 'Comunicación' },
        35: { tipo: 'Modulo', nombre: 'Tesorería' },
    },
    TIPO_INCIDENCIA: {
        1: { tipo: 'TipoIncidencia', nombre: 'Log' },
        2: { tipo: 'TipoIncidencia', nombre: 'Warning' },
        3: { tipo: 'TipoIncidencia', nombre: 'Error' },
    },
    NIVEL_CRITICIDAD: {
        10: { tipo: 'NivelCriticidad', nombre: 'Bajo' },
        11: { tipo: 'NivelCriticidad', nombre: 'Medio' },
        12: { tipo: 'NivelCriticidad', nombre: 'Alto' },
    },
    TIPO_EVENTO: {
        20: { tipo: 'TipoEvento', nombre: 'Login' },
        21: { tipo: 'TipoEvento', nombre: 'Actualización' },
        22: { tipo: 'TipoEvento', nombre: 'Importación' },
        23: { tipo: 'TipoEvento', nombre: 'Notificacion Pago' },
        24: { tipo: 'TipoEvento', nombre: 'Solicitud Interfaz' },
    },
    TIPO_ALERTA: {
        30: { tipo: 'TipoAlerta', nombre: 'Importación' },
        31: { tipo: 'TipoAlerta', nombre: 'Emisión' },
        32: { tipo: 'TipoAlerta', nombre: 'Cuenta Corriente' },
        33: { tipo: 'TipoAlerta', nombre: 'Envío Novedades' },
        34: { tipo: 'TipoAlerta', nombre: 'Pasarela Pago' },
    },
    TIPO_COLECCION: {
        1: { tipo: 'TipoColeccion', nombre: 'Eventos' },
        2: { tipo: 'TipoColeccion', nombre: 'Alertas' },
        3: { tipo: 'TipoColeccion', nombre: 'Incidencias' },
    },
}

Object.keys(LISTAS).forEach(key => {
    Object.keys(LISTAS[key]).forEach(id => LISTAS[key][id].id = id)
    LISTAS[key].getValues = () => Object.keys(LISTAS[key]).filter(id => !isNaN(id)).map(id => LISTAS[key][id])
    LISTAS[key].getNombre = id => LISTAS[key][id]?.nombre ?? ''
    LISTAS[key].getCell = () => ({ value }) => LISTAS[key][value]?.nombre ?? ''
    LISTAS[key].map = f => LISTAS[key].getValues().map(f)
})

export { LISTAS }
