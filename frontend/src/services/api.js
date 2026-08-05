import axios from 'axios';
import { useAuthStore } from '../store/auth';

const API_BASE = '/api';

export const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor: agregar token de autenticación
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor: manejar token expirado (refresh automático)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refreshToken = useAuthStore.getState().refreshToken;
        const { data } = await axios.post(`${API_BASE}/seguridad/auth/refresh`, {
          refresh_token: refreshToken,
        });
        useAuthStore.getState().setTokens(data.access_token, data.refresh_token);
        original.headers.Authorization = `Bearer ${data.access_token}`;
        return api(original);
      } catch {
        useAuthStore.getState().logout();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Helper para generar CRUD estándar
function crud(basePath) {
  return {
    list: (params) => api.get(basePath, { params }),
    get: (id) => api.get(`${basePath}/${id}`),
    create: (data) => api.post(basePath, data),
    update: (id, data) => api.put(`${basePath}/${id}`, data),
    delete: (id) => api.delete(`${basePath}/${id}`),
  };
}

// ── API por módulo ──────────────────────────────────────────────────
export const authAPI = {
  login: (username, password) =>
    api.post('/seguridad/auth/token', { username, password }),
  me: () => api.get('/seguridad/auth/me'),
  logout: () => api.post('/seguridad/auth/logout'),
  updateProfile: (data) => api.put('/seguridad/auth/profile', data),
  changeOwnPassword: (data) => api.post('/seguridad/auth/change-own-password', data),
  firmaConfig: {
    get: () => api.get('/seguridad/auth/firma-config'),
    set: (data) => api.post('/seguridad/auth/firma-config', data),
  },
};

export const seguridadAPI = {
  usuarios: crud('/seguridad/usuarios'),
  perfiles: crud('/seguridad/perfiles'),
  permisos: crud('/seguridad/permisos'),
  usuarioPerfiles: (id) => api.get(`/seguridad/usuarios/${id}/perfiles`),
  bindPerfiles: (id, perfil_ids) =>
    api.put(`/seguridad/usuarios/${id}/bind-perfiles`, { perfil_ids }),
  unbindPerfiles: (id, perfil_ids) =>
    api.put(`/seguridad/usuarios/${id}/unbind-perfiles`, { perfil_ids }),
  perfilPermisos: (id) => api.get(`/seguridad/perfiles/${id}/permisos`),
  bindPermisos: (id, permiso_ids) =>
    api.put(`/seguridad/perfiles/${id}/bind-permisos`, { permiso_ids }),
  unbindPermisos: (id, permiso_ids) =>
    api.put(`/seguridad/perfiles/${id}/unbind-permisos`, { permiso_ids }),
};

export const administracionAPI = {
  personas: {
    fisicas: crud('/administracion/personas/fisicas'),
    juridicas: crud('/administracion/personas/juridicas'),
  },
  expedientes: crud('/administracion/expedientes'),
  listas: crud('/administracion/listas'),
  entidades: crud('/administracion/entidades'),
  entidadDefiniciones: crud('/administracion/entidad-definiciones'),
  direcciones: crud('/administracion/direcciones'),
  contactos: crud('/administracion/contactos'),
  archivos: crud('/administracion/archivos'),
  observaciones: crud('/administracion/observaciones'),
  documentos: crud('/administracion/documentos'),
  mediosPago: crud('/administracion/medios-pago'),
  etiquetas: crud('/administracion/etiquetas'),
  paises: crud('/administracion/paises'),
  provincias: crud('/administracion/provincias'),
  localidades: crud('/administracion/localidades'),
  cuentasContables: crud('/administracion/cuentas-contables'),
  jurisdicciones: crud('/administracion/jurisdicciones'),
  recursosPorRubro: crud('/administracion/recursos-por-rubro'),
};

export const auditoriaAPI = {
  incidencias: {
    list: (params) => api.get('/auditoria/incidencias', { params }),
    get: (id) => api.get(`/auditoria/incidencias/${id}`),
  },
  eventos: {
    list: (params) => api.get('/auditoria/eventos', { params }),
  },
};

export const comunicacionAPI = {
  mensajes: crud('/comunicacion/mensajes'),
  listas: crud('/comunicacion/listas'),
};

export const ingresosPublicosAPI = {
  personas: {
    list: (params) => api.get('/ingresos-publicos/personas', { params }),
    get: (id) => api.get(`/ingresos-publicos/personas/${id}`),
  },
  contribuyentes: {
    ...crud('/ingresos-publicos/contribuyentes'),
    search: (q) => api.get('/ingresos-publicos/contribuyentes/search', { params: { q } }),
    objetos: (id) => api.get(`/ingresos-publicos/contribuyentes/${id}/objetos`),
  },
  cuentas: {
    ...crud('/ingresos-publicos/cuentas'),
    byContribuyente: (id) =>
      api.get(`/ingresos-publicos/cuentas/by-contribuyente/${id}`),
  },
  inmuebles: crud('/ingresos-publicos/inmuebles'),
  inmuebleValuaciones: {
    ...crud('/ingresos-publicos/inmueble-valuaciones'),
    byInmueble: (id) => api.get(`/ingresos-publicos/inmueble-valuaciones/by-inmueble/${id}`),
  },
  inmuebleSuperficies: {
    ...crud('/ingresos-publicos/inmueble-superficies'),
    byInmueble: (id) => api.get(`/ingresos-publicos/inmueble-superficies/by-inmueble/${id}`),
  },
  inmuebleFrentes: {
    ...crud('/ingresos-publicos/inmueble-frentes'),
    byInmueble: (id) => api.get(`/ingresos-publicos/inmueble-frentes/by-inmueble/${id}`),
  },
  vehiculos: crud('/ingresos-publicos/vehiculos'),
  vehiculoValuaciones: crud('/ingresos-publicos/vehiculo-valuaciones'),
  comercios: crud('/ingresos-publicos/comercios'),
  comercioRubros: crud('/ingresos-publicos/comercio-rubros'),
  comercioDdjj: crud('/ingresos-publicos/comercio-ddjj'),
  emisiones: {
    ...crud('/ingresos-publicos/emisiones'),
    byCuenta: (id) => api.get(`/ingresos-publicos/emisiones/by-cuenta/${id}`),
  },
  emisionDefiniciones: crud('/ingresos-publicos/emisiones/definiciones'),
  planesPago: {
    ...crud('/ingresos-publicos/planes-pago'),
    byCuenta: (id) => api.get(`/ingresos-publicos/planes-pago/by-cuenta/${id}`),
    byContribuyente: (id) => api.get(`/ingresos-publicos/planes-pago/by-contribuyente/${id}`),
    simular: (data) => api.post('/ingresos-publicos/planes-pago/simular', data),
    generarCuotas: (id) => api.post(`/ingresos-publicos/planes-pago/${id}/generar-cuotas`),
    cuotas: (id) => api.get(`/ingresos-publicos/planes-pago/${id}/cuotas`),
  },
  planPagoDefiniciones: crud('/ingresos-publicos/planes-pago/definiciones'),
  listas: crud('/ingresos-publicos/listas'),
  certificados: crud('/ingresos-publicos/certificados'),
  multas: {
    ...crud('/ingresos-publicos/multas'),
    byCuenta: (id) => api.get(`/ingresos-publicos/multas/by-cuenta/${id}`),
  },
  tasas: crud('/ingresos-publicos/tasas'),
  subTasas: crud('/ingresos-publicos/sub-tasas'),
};

export const tesoreriaAPI = {
  cajas: crud('/tesoreria/cajas'),
  cajaAsignaciones: {
    list: (idCaja, params) => api.get(`/tesoreria/cajas/${idCaja}/asignaciones`, { params }),
    create: (idCaja, data) => api.post(`/tesoreria/cajas/${idCaja}/asignaciones`, data),
    update: (id, data) => api.put(`/tesoreria/cajas/asignaciones/${id}`, data),
    delete: (id) => api.delete(`/tesoreria/cajas/asignaciones/${id}`),
  },
  dependencias: crud('/tesoreria/dependencias'),
  recaudadoras: crud('/tesoreria/recaudadoras'),
  recaudacionLotes: crud('/tesoreria/recaudacion-lotes'),
  recaudaciones: {
    list: (idLote, params) => api.get(`/tesoreria/recaudacion-lotes/${idLote}/recaudaciones`, { params }),
    create: (idLote, data) => api.post(`/tesoreria/recaudacion-lotes/${idLote}/recaudaciones`, data),
    update: (id, data) => api.put(`/tesoreria/recaudacion-lotes/recaudaciones/${id}`, data),
    delete: (id) => api.delete(`/tesoreria/recaudacion-lotes/recaudaciones/${id}`),
  },
  reciboPublicacionLotes: crud('/tesoreria/recibo-publicacion-lotes'),
  reciboPublicaciones: {
    list: (idLote, params) => api.get(`/tesoreria/recibo-publicacion-lotes/${idLote}/publicaciones`, { params }),
    create: (idLote, data) => api.post(`/tesoreria/recibo-publicacion-lotes/${idLote}/publicaciones`, data),
    update: (id, data) => api.put(`/tesoreria/recibo-publicacion-lotes/publicaciones/${id}`, data),
    delete: (id) => api.delete(`/tesoreria/recibo-publicacion-lotes/publicaciones/${id}`),
  },
  pagoRendicionLotes: crud('/tesoreria/pago-rendicion-lotes'),
  pagoRendiciones: {
    list: (idLote, params) => api.get(`/tesoreria/pago-rendicion-lotes/${idLote}/rendiciones`, { params }),
    create: (idLote, data) => api.post(`/tesoreria/pago-rendicion-lotes/${idLote}/rendiciones`, data),
    update: (id, data) => api.put(`/tesoreria/pago-rendicion-lotes/rendiciones/${id}`, data),
    delete: (id) => api.delete(`/tesoreria/pago-rendicion-lotes/rendiciones/${id}`),
  },
  registroContableLotes: crud('/tesoreria/registro-contable-lotes'),
  registroContables: {
    list: (idLote, params) => api.get(`/tesoreria/registro-contable-lotes/${idLote}/registros`, { params }),
    create: (idLote, data) => api.post(`/tesoreria/registro-contable-lotes/${idLote}/registros`, data),
    update: (id, data) => api.put(`/tesoreria/registro-contable-lotes/registros/${id}`, data),
    delete: (id) => api.delete(`/tesoreria/registro-contable-lotes/registros/${id}`),
  },
  entidades: crud('/tesoreria/entidades'),
  listas: crud('/tesoreria/listas'),
  beneficiarios: crud('/tesoreria/beneficiarios'),
  cuentasBancarias: crud('/tesoreria/cuentas-bancarias'),
  ordenesPago: {
    list: (params) => api.get('/tesoreria/ordenes-pago', { params }),
    create: (data) => api.post('/tesoreria/ordenes-pago', data),
    pagar: (id, data) => api.post(`/tesoreria/ordenes-pago/${id}/pagar`, data),
    anular: (id) => api.post(`/tesoreria/ordenes-pago/${id}/anular`, {}),
    enviarAFirma: (id, data) => api.post(`/tesoreria/ordenes-pago/${id}/enviar-a-firma`, data || {}),
  },
  parteEgresos: (fecha) => api.get('/tesoreria/egresos/parte-diario', { params: fecha ? { fecha } : {} }),
  chequeras: {
    list: (params) => api.get('/tesoreria/chequeras', { params }),
    create: (data) => api.post('/tesoreria/chequeras', data),
  },
  cheques: {
    list: (params) => api.get('/tesoreria/cheques', { params }),
    emitir: (data) => api.post('/tesoreria/cheques', data),
    entregar: (id) => api.post(`/tesoreria/cheques/${id}/entregar`, {}),
    cobrar: (id) => api.post(`/tesoreria/cheques/${id}/cobrar`, {}),
    anular: (id) => api.post(`/tesoreria/cheques/${id}/anular`, {}),
    rechazar: (id) => api.post(`/tesoreria/cheques/${id}/rechazar`, {}),
  },
  ordenesBancarias: {
    list: (params) => api.get('/tesoreria/ordenes-bancarias', { params }),
    get: (id) => api.get(`/tesoreria/ordenes-bancarias/${id}`),
    create: (data) => api.post('/tesoreria/ordenes-bancarias', data),
    archivo: (id) => api.get(`/tesoreria/ordenes-bancarias/${id}/archivo`, { responseType: 'text' }),
    confirmar: (id) => api.post(`/tesoreria/ordenes-bancarias/${id}/confirmar`, {}),
    anular: (id) => api.post(`/tesoreria/ordenes-bancarias/${id}/anular`, {}),
  },
  conciliacion: {
    extractos: (params) => api.get('/tesoreria/conciliacion/extractos', { params }),
    extracto: (id) => api.get(`/tesoreria/conciliacion/extractos/${id}`),
    crearExtracto: (data) => api.post('/tesoreria/conciliacion/extractos', data),
    egresosPendientes: (id) => api.get(`/tesoreria/conciliacion/extractos/${id}/egresos-pendientes`),
    resumen: (id) => api.get(`/tesoreria/conciliacion/extractos/${id}/resumen`),
    conciliar: (idMov, data) => api.post(`/tesoreria/conciliacion/movimientos/${idMov}/conciliar`, data),
    desconciliar: (idMov) => api.post(`/tesoreria/conciliacion/movimientos/${idMov}/desconciliar`, {}),
  },
};

export const emisionesAPI = {
  emisiones: {
    ...crud('/emisiones/emisiones'),
    estado: (id) => api.get(`/emisiones/emisiones/${id}/estado`),
    referencias: (id) => api.get(`/emisiones/emisiones/${id}/referencias`),
    ejecutarPaso: (id, numero, data) => api.post(`/emisiones/emisiones/${id}/pasos/${numero}/ejecutar`, data || {}),
    resumen: (id) => api.get(`/emisiones/emisiones/${id}/resumen`),
    recibosPdf: (id) => api.get(`/emisiones/emisiones/${id}/recibos-pdf`),
    descargarRecibo: (id, ambito, archivo) => api.get(`/emisiones/emisiones/${id}/recibos-pdf/archivo`, { params: { ambito, archivo }, responseType: 'blob' }),
    liquidaciones: (id, params) => api.get(`/emisiones/emisiones/${id}/liquidaciones`, { params }),
    cuentaCorriente: (id, params) => api.get(`/emisiones/emisiones/${id}/cuenta-corriente`, { params }),
    comprobantes: (id, params) => api.get(`/emisiones/emisiones/${id}/comprobantes`, { params }),
    // Workflow: 16 pasos
    paso1: (id) => api.post(`/emisiones/emisiones/${id}/pasos/1-validar-parametros`),
    paso2: (id, data) => api.post(`/emisiones/emisiones/${id}/pasos/2-cargar-padron`, data),
    paso3: (id) => api.post(`/emisiones/emisiones/${id}/pasos/3-validar-padron`),
    paso4: (id) => api.post(`/emisiones/emisiones/${id}/pasos/4-calcular-base-imponible`),
    paso5: (id) => api.post(`/emisiones/emisiones/${id}/pasos/5-aplicar-alicuotas`),
    paso6: (id) => api.post(`/emisiones/emisiones/${id}/pasos/6-calcular-bonificaciones`),
    paso7: (id) => api.post(`/emisiones/emisiones/${id}/pasos/7-calcular-recargos`),
    paso8: (id) => api.post(`/emisiones/emisiones/${id}/pasos/8-generar-liquidaciones`),
    paso9: (id, data) => api.post(`/emisiones/emisiones/${id}/pasos/9-validar-liquidaciones`, data),
    paso10: (id) => api.post(`/emisiones/emisiones/${id}/pasos/10-generar-ordenamiento`),
    paso11: (id) => api.post(`/emisiones/emisiones/${id}/pasos/11-generar-cuentas-corrientes`),
    paso12: (id) => api.post(`/emisiones/emisiones/${id}/pasos/12-generar-comprobantes`),
    paso13: (id) => api.post(`/emisiones/emisiones/${id}/pasos/13-imputacion-contable`),
    paso14: (id) => api.post(`/emisiones/emisiones/${id}/pasos/14-publicar-deuda`),
    paso15: (id) => api.post(`/emisiones/emisiones/${id}/pasos/15-solicitar-aprobacion`),
    paso16: (id, data) => api.post(`/emisiones/emisiones/${id}/pasos/16-aprobar-emision`, data),
  },
  formulas: {
    ...crud('/emisiones/formulas'),
    tasas: (params) => api.get('/emisiones/formulas/tasas', { params }),
    subtasas: (ttas_tasa) => api.get('/emisiones/formulas/subtasas', { params: { ttas_tasa } }),
    probar: (data) => api.post('/emisiones/formulas/probar', data),
    probarCatalogo: (id, data) => api.post(`/emisiones/formulas/${id}/probar-catalogo`, data),
  },
  // Vista 360 — operaciones a nivel contribuyente
  deudaPorContribuyente: (idContribuyente, params) =>
    api.get(`/emisiones/emisiones/cuenta-corriente/by-contribuyente/${idContribuyente}`, { params }),
  pagarConcepto: (idCc, data) =>
    api.post(`/emisiones/emisiones/cuenta-corriente/${idCc}/pagar`, data),
  pagosPorContribuyente: (idContribuyente) =>
    api.get(`/emisiones/emisiones/pagos/by-contribuyente/${idContribuyente}`),
  recibosPdfPorContribuyente: (idContribuyente) =>
    api.get(`/emisiones/emisiones/recibos-pdf/by-contribuyente/${idContribuyente}`),
  descargarRecibo: (idEmision, ambito, archivo) =>
    api.get(`/emisiones/emisiones/${idEmision}/recibos-pdf/archivo`, { params: { ambito, archivo }, responseType: 'blob' }),
};

export const contaduriaAPI = {
  gastos: {
    list: (params) => api.get('/contaduria/gastos', { params }),
    get: (id) => api.get(`/contaduria/gastos/${id}`),
    create: (data) => api.post('/contaduria/gastos', data),
    avanzar: (id, data) => api.post(`/contaduria/gastos/${id}/avanzar`, data),
    anular: (id, motivo) => api.post(`/contaduria/gastos/${id}/anular`, { motivo }),
  },
};

export const comprasAPI = {
  proveedores: crud('/compras/proveedores'),
  articulos: crud('/compras/articulos'),
  pedidos: {
    list: (params) => api.get('/compras/pedidos', { params }),
    create: (data) => api.post('/compras/pedidos', data),
    anular: (id) => api.delete(`/compras/pedidos/${id}`),
  },
  ordenesCompra: {
    list: (params) => api.get('/compras/ordenes-compra', { params }),
    get: (id) => api.get(`/compras/ordenes-compra/${id}`),
    create: (data) => api.post('/compras/ordenes-compra', data),
    anular: (id) => api.post(`/compras/ordenes-compra/${id}/anular`, {}),
    recibir: (id, data) => api.post(`/compras/ordenes-compra/${id}/recepciones`, data),
  },
  stock: () => api.get('/compras/stock'),
};

export const presupuestoAPI = {
  jurisdicciones: { ...crud('/presupuesto/jurisdicciones'), arbol: () => api.get('/presupuesto/jurisdicciones/arbol'), importar: () => api.post('/presupuesto/jurisdicciones/importar') },
  objetosGasto: { ...crud('/presupuesto/objetos-gasto'), arbol: () => api.get('/presupuesto/objetos-gasto/arbol') },
  fuentes: { ...crud('/presupuesto/fuentes'), arbol: () => api.get('/presupuesto/fuentes/arbol') },
  rubros: { ...crud('/presupuesto/rubros'), arbol: () => api.get('/presupuesto/rubros/arbol') },
  estructuras: crud('/presupuesto/estructuras'),
  partidas: {
    list: (params) => api.get('/presupuesto/partidas', { params }),
    create: (data) => api.post('/presupuesto/partidas', data),
    update: (id, data) => api.put(`/presupuesto/partidas/${id}`, data),
    delete: (id) => api.delete(`/presupuesto/partidas/${id}`),
    movimientos: (id) => api.get(`/presupuesto/partidas/${id}/movimientos`),
    importar: (data) => api.post('/presupuesto/partidas/importar', data),
    exportar: (anio) => api.get('/presupuesto/partidas/export', { params: { anio }, responseType: 'blob' }),
  },
  afectaciones: {
    list: (params) => api.get('/presupuesto/afectaciones', { params }),
    registrar: (data) => api.post('/presupuesto/afectaciones', data),
    liberar: (id, motivo) => api.post(`/presupuesto/afectaciones/${id}/liberar`, { motivo }),
  },
  recursos: {
    list: (params) => api.get('/presupuesto/recursos', { params }),
    create: (data) => api.post('/presupuesto/recursos', data),
    modificar: (id, data) => api.post(`/presupuesto/recursos/${id}/modificar`, data),
    movimientos: (id) => api.get(`/presupuesto/recursos/${id}/movimientos`),
  },
  resumen: (params) => api.get('/presupuesto/resumen', { params }),
  cuotas: {
    list: (params) => api.get('/presupuesto/cuotas', { params }),
    bulk: (data) => api.post('/presupuesto/cuotas/bulk', data),
  },
  cargos: crud('/presupuesto/cargos'),
  rrhh: {
    list: (params) => api.get('/presupuesto/rrhh', { params }),
    create: (data) => api.post('/presupuesto/rrhh', data),
    update: (id, data) => api.put(`/presupuesto/rrhh/${id}`, data),
    delete: (id) => api.delete(`/presupuesto/rrhh/${id}`),
    resumen: (params) => api.get('/presupuesto/rrhh/resumen', { params }),
  },
  reportePdf: (params) => api.get('/presupuesto/reportes/presupuesto-pdf', { params, responseType: 'blob' }),
  metas: {
    list: (params) => api.get('/presupuesto/metas', { params }),
    create: (data) => api.post('/presupuesto/metas', data),
    update: (id, data) => api.put(`/presupuesto/metas/${id}`, data),
    delete: (id) => api.delete(`/presupuesto/metas/${id}`),
    ejecutado: (id, cantidad) => api.post(`/presupuesto/metas/${id}/ejecutado`, { cantidad }),
  },
  proyectos: {
    list: (params) => api.get('/presupuesto/proyectos', { params }),
    create: (data) => api.post('/presupuesto/proyectos', data),
    update: (id, data) => api.put(`/presupuesto/proyectos/${id}`, data),
    delete: (id) => api.delete(`/presupuesto/proyectos/${id}`),
  },
  modificaciones: {
    list: (params) => api.get('/presupuesto/modificaciones', { params }),
    get: (id) => api.get(`/presupuesto/modificaciones/${id}`),
    create: (data) => api.post('/presupuesto/modificaciones', data),
    delete: (id) => api.delete(`/presupuesto/modificaciones/${id}`),
    aprobar: (id) => api.post(`/presupuesto/modificaciones/${id}/aprobar`),
    anular: (id, motivo) => api.post(`/presupuesto/modificaciones/${id}/anular`, { motivo }),
  },
  ejercicios: {
    list: (params) => api.get('/presupuesto/ejercicios', { params }),
    create: (data) => api.post('/presupuesto/ejercicios', data),
    transicionar: (anio, transicion, data) => api.post(`/presupuesto/ejercicios/${anio}/${transicion}`, data || {}),
    prorrogar: (anio, data) => api.post(`/presupuesto/ejercicios/${anio}/prorrogar`, data),
    configurar: (anio, data) => api.put(`/presupuesto/ejercicios/${anio}/configuracion`, data),
  },
};

export const wavAPI = {
  cuentas: {
    byContribuyente: (id) => api.get(`/wav/cuentas/by-contribuyente/${id}`),
    create: (data) => api.post('/wav/cuentas', data),
  },
  declaraciones: {
    byCuenta: (id) => api.get(`/wav/declaraciones/by-cuenta/${id}`),
    get: (id) => api.get(`/wav/declaraciones/${id}`),
    create: (data) => api.post('/wav/declaraciones', data),
  },
  pagos: {
    byCuenta: (id) => api.get(`/wav/pagos/by-cuenta/${id}`),
    pagoContado: (data) => api.post('/wav/pagos/contado', data),
    planPago: (data) => api.post('/wav/pagos/plan-pago', data),
  },
};


// ═══════════════ WORKFLOW GAPS — merges y modulos nuevos ═══════════════
function dmerge(t, s){for(const k of Object.keys(s)){const sv=s[k];if(sv&&typeof sv==='object'&&!Array.isArray(sv)&&t[k]&&typeof t[k]==='object'){dmerge(t[k],sv);}else{t[k]=sv;}}return t;}

export const contabilidadAPI = {
  cuentas: {
    ...crud('/contabilidad/cuentas'),
    arbol: () => api.get('/contabilidad/cuentas/arbol'),
  },
  ejercicios: {
    list: (params) => api.get('/contabilidad/ejercicios', { params }),
    create: (data) => api.post('/contabilidad/ejercicios', data),
    update: (anio, data) => api.put(`/contabilidad/ejercicios/${anio}`, data),
    abrir: (anio) => api.post(`/contabilidad/ejercicios/${anio}/abrir`, {}),
    cerrar: (anio) => api.post(`/contabilidad/ejercicios/${anio}/cerrar`, {}),
  },
  asientos: {
    list: (params) => api.get('/contabilidad/asientos', { params }),
    get: (id) => api.get(`/contabilidad/asientos/${id}`),
    create: (data) => api.post('/contabilidad/asientos', data),
    confirmar: (id) => api.post(`/contabilidad/asientos/${id}/confirmar`, {}),
    anular: (id) => api.post(`/contabilidad/asientos/${id}/anular`, {}),
    automatico: (data) => api.post('/contabilidad/asientos/automatico', data),
  },
  libros: {
    diario: (params) => api.get('/contabilidad/libros/libro-diario', { params }),
    mayor: (params) => api.get('/contabilidad/libros/libro-mayor', { params }),
    balance: (params) => api.get('/contabilidad/libros/balance', { params }),
  },
};

export const importacionAPI = {
  // ── Ingesta ──
  preview: (formData) => api.post('/importacion/ingesta/preview', formData),
  subir: (formData) => api.post('/importacion/ingesta/subir', formData),
  procesar: (idLote, data) => api.post(`/importacion/ingesta/${idLote}/procesar`, data || {}),
  lotes: (params) => api.get('/importacion/ingesta/lotes', { params }),
  detalles: (idLote, params) => api.get(`/importacion/ingesta/${idLote}/detalles`, { params }),
  // ── Exportación ──
  exportaciones: {
    list: (params) => api.get('/importacion/exportaciones/lotes', { params }),
    get: (id) => api.get(`/importacion/exportaciones/lotes/${id}`),
    create: (data) => api.post('/importacion/exportaciones/lotes', data),
    descargar: (id) => api.get(`/importacion/exportaciones/lotes/${id}/descargar`, { responseType: 'blob' }),
  },
};

export const interfaceAPI = {
  pagos: {
    list: (params) => api.get('/interface/pagos/notificaciones', { params }),
    // El webhook lo llama la pasarela con firma HMAC; no se usa desde el front.
  },
  boletas: {
    list: (params) => api.get('/interface/boletas', { params }),
    get: (id) => api.get(`/interface/boletas/${id}`),
    byCuenta: (numero, params) => api.get(`/interface/boletas/by-cuenta/${numero}`, { params }),
    create: (data) => api.post('/interface/boletas', data),
    pdf: (id) => api.get(`/interface/boletas/${id}/pdf`, { responseType: 'blob' }),
  },
  consultas: {
    list: (params) => api.get('/interface/consultas', { params }),
    create: (data) => api.post('/interface/consultas', data),
  },
  afip: {
    constancia: (cuit) => api.get('/interface/afip/constancia', { params: { cuit } }),
  },
};

dmerge(comprasAPI, {
  proveedores: {
    ...crud('/compras/proveedores'),
    preinscribir: (data) => api.post('/compras/proveedores/preinscripcion', data),
    aprobar: (id) => api.post(`/compras/proveedores/${id}/aprobar`, {}),
    suspender: (id) => api.post(`/compras/proveedores/${id}/suspender`, {}),
    reactivar: (id) => api.post(`/compras/proveedores/${id}/reactivar`, {}),
  },
  articulos: crud('/compras/articulos'),
  pedidos: {
    list: (params) => api.get('/compras/pedidos', { params }),
    create: (data) => api.post('/compras/pedidos', data),
    anular: (id) => api.delete(`/compras/pedidos/${id}`),
  },
  licitaciones: {
    list: (params) => api.get('/compras/pedidos-cotizacion', { params }),
    get: (id) => api.get(`/compras/pedidos-cotizacion/${id}`),
    create: (data) => api.post('/compras/pedidos-cotizacion', data),
    anular: (id) => api.delete(`/compras/pedidos-cotizacion/${id}`),
    cotizar: (id, data) => api.post(`/compras/pedidos-cotizacion/${id}/cotizaciones`, data),
    apertura: (id) => api.post(`/compras/pedidos-cotizacion/${id}/apertura`, {}),
    comparativa: (id) => api.get(`/compras/pedidos-cotizacion/${id}/comparativa`),
    adjudicar: (id, data) => api.post(`/compras/pedidos-cotizacion/${id}/adjudicar`, data),
  },
  ordenesCompra: {
    list: (params) => api.get('/compras/ordenes-compra', { params }),
    get: (id) => api.get(`/compras/ordenes-compra/${id}`),
    create: (data) => api.post('/compras/ordenes-compra', data),
    anular: (id) => api.post(`/compras/ordenes-compra/${id}/anular`, {}),
    recibir: (id, data) => api.post(`/compras/ordenes-compra/${id}/recepciones`, data), // data ahora acepta { id_deposito, items }
  },
  facturas: {
    list: (params) => api.get('/compras/facturas', { params }),
    get: (id) => api.get(`/compras/facturas/${id}`),
    create: (data) => api.post('/compras/facturas', data),
    conformar: (id) => api.post(`/compras/facturas/${id}/conformar`, {}),
    anular: (id) => api.post(`/compras/facturas/${id}/anular`, {}),
  },
  depositos: {
    ...crud('/compras/depositos'),
    stock: (params) => api.get('/compras/depositos/stock', { params }),
  },
  movimientosStock: {
    list: (params) => api.get('/compras/movimientos-stock', { params }),
    transferencia: (data) => api.post('/compras/movimientos-stock/transferencia', data),
    ajuste: (data) => api.post('/compras/movimientos-stock/ajuste', data),
    salida: (data) => api.post('/compras/movimientos-stock/salida', data),
  },
  stock: () => api.get('/compras/stock'),
});

dmerge(contaduriaAPI, {
  gastos: {
    list: (params) => api.get('/contaduria/gastos', { params }),
    get: (id) => api.get(`/contaduria/gastos/${id}`),
    create: (data) => api.post('/contaduria/gastos', data),
    avanzar: (id, data) => api.post(`/contaduria/gastos/${id}/avanzar`, data),
    anular: (id, motivo) => api.post(`/contaduria/gastos/${id}/anular`, { motivo }),
    retenciones: (id) => api.get(`/contaduria/gastos/${id}/retenciones`),
    aplicarRetenciones: (id, data) => api.post(`/contaduria/gastos/${id}/retenciones`, data),
  },
  tiposRetencion: crud('/contaduria/tipos-retencion'),
  retenciones: {
    list: (params) => api.get('/contaduria/retenciones', { params }),
    exportTxt: (params) => api.get('/contaduria/retenciones/export.txt', { params, responseType: 'text' }),
  },
  rendicion: (params) => api.get('/contaduria/rendicion', { params }),
  deudaFlotante: (params) => api.get('/contaduria/deuda-flotante', { params }),
  extracontables: {
    ...crud('/contaduria/extracontables'),
    saldos: () => api.get('/contaduria/extracontables/saldos'),
  },
});

dmerge(wavAPI, {
  cuentas: {
    byContribuyente: (id) => api.get(`/wav/cuentas/by-contribuyente/${id}`),
    create: (data) => api.post('/wav/cuentas', data),
  },
  declaraciones: {
    byCuenta: (id) => api.get(`/wav/declaraciones/by-cuenta/${id}`),
    get: (id) => api.get(`/wav/declaraciones/${id}`),
    create: (data) => api.post('/wav/declaraciones', data),
  },
  pagos: {
    byCuenta: (id) => api.get(`/wav/pagos/by-cuenta/${id}`),
    pagoContado: (data) => api.post('/wav/pagos/contado', data),
    planPago: (data) => api.post('/wav/pagos/plan-pago', data),
  },
  deuda: {
    byContribuyente: (id, soloDeuda = true) =>
      api.get(`/wav/deuda/by-contribuyente/${id}`, { params: { solo_deuda: soloDeuda } }),
    pagosByContribuyente: (id) => api.get(`/wav/deuda/pagos/by-contribuyente/${id}`),
    pagar: (idCc, data) => api.post(`/wav/deuda/pagar/${idCc}`, data),
  },
  recibos: {
    pagoContadoPdf: (idPago) =>
      api.get(`/wav/recibos/pago-contado/${idPago}/pdf`, { responseType: 'arraybuffer' }),
    emisionesByContribuyente: (id) =>
      api.get(`/wav/recibos/emisiones/by-contribuyente/${id}`),
  },
  planes: {
    simular: (data) => api.post('/wav/planes/simular', data),
  },
  debito: {
    list: (params) => api.get('/wav/planes/adhesiones-debito', { params }),
    byCuenta: (idCuenta) => api.get(`/wav/planes/adhesiones-debito/by-cuenta/${idCuenta}`),
    create: (data) => api.post('/wav/planes/adhesiones-debito', data),
    update: (id, data) => api.put(`/wav/planes/adhesiones-debito/${id}`, data),
    delete: (id) => api.delete(`/wav/planes/adhesiones-debito/${id}`),
  },
});

dmerge(auditoriaAPI, {
  incidencias: {
    list: (params) => api.get('/auditoria/incidencias', { params }),
    get: (id) => api.get(`/auditoria/incidencias/${id}`),
  },
  eventos: {
    list: (params) => api.get('/auditoria/eventos', { params }),
    verificarIntegridad: (params) => api.get('/auditoria/eventos/verificar-integridad', { params }),
    exportCsv: (params) => api.get('/auditoria/eventos/export.csv', { params, responseType: 'blob' }),
    purgar: (params) => api.post('/auditoria/eventos/purgar', null, { params }),
  },
});

dmerge(comunicacionAPI, {
  mensajes: {
    ...crud('/comunicacion/mensajes'),
    enviar: (id) => api.post(`/comunicacion/mensajes/${id}/enviar`, {}),
    enviarDirecto: (data) => api.post('/comunicacion/mensajes/enviar-directo', data), // {to, asunto, cuerpo}
    intentos: (id) => api.get(`/comunicacion/mensajes/${id}/intentos`),
    reintentarPendientes: (limite = 20) => api.post('/comunicacion/mensajes/reintentar-pendientes', {}, { params: { limite } }),
    desdePlantilla: (data) => api.post('/comunicacion/mensajes/desde-plantilla', data), // {codigo, destinatario, variables}
    masivo: (data) => api.post('/comunicacion/mensajes/masivo', data), // {id_plantilla, destinatarios:[{email, variables}]}
  },
  plantillas: crud('/comunicacion/plantillas'),
  listas: crud('/comunicacion/listas'),
});

dmerge(emisionesAPI, {
  ctacte: {
    movimientos: (idContribuyente, params) =>
      api.get(`/emisiones/emisiones/cuenta-corriente/by-contribuyente/${idContribuyente}/movimientos`, { params }),
    saldoCuenta: (idCc) =>
      api.get(`/emisiones/emisiones/cuenta-corriente/${idCc}/saldo`),
  },

  coeficientes: {
    ...crud('/emisiones/emisiones/coeficientes'),
    recalcularRecargo: (data) => api.post('/emisiones/emisiones/coeficientes/recalcular-recargo', data),
  },

  vencimientos: {
    list: (idComprobante) => api.get(`/emisiones/emisiones/comprobantes/${idComprobante}/vencimientos`),
    set: (idComprobante, vencimientos) => api.put(`/emisiones/emisiones/comprobantes/${idComprobante}/vencimientos`, vencimientos),
  },
});

dmerge(seguridadAPI, {
  desbloquearUsuario: (id) => api.post(`/seguridad/usuarios/${id}/desbloquear`),

  usuarioPermisosOverride: (id) => api.get(`/seguridad/usuarios/${id}/permisos-override`),
  setUsuarioPermisoOverride: (id, id_permiso, tipo) =>
    api.put(`/seguridad/usuarios/${id}/permisos-override`, { id_permiso, tipo }),
  clearUsuarioPermisoOverride: (id, id_permiso) =>
    api.delete(`/seguridad/usuarios/${id}/permisos-override/${id_permiso}`),

  sesiones: () => api.get('/seguridad/auth/sesiones'),
  revocarSesion: (id) => api.post(`/seguridad/auth/sesiones/${id}/revocar`),
});

dmerge(administracionAPI, {
  numeradores: {
    list: (params) => api.get('/administracion/numeradores', { params }),
    get: (clave) => api.get(`/administracion/numeradores/${clave}`),
    create: (data) => api.post('/administracion/numeradores', data),
    update: (id, data) => api.put(`/administracion/numeradores/id/${id}`, data),
    delete: (id) => api.delete(`/administracion/numeradores/id/${id}`),
    updateByClave: (clave, data) => api.put(`/administracion/numeradores/${clave}`, data),
    deleteByClave: (clave) => api.delete(`/administracion/numeradores/${clave}`),
    siguiente: (clave) => api.post(`/administracion/numeradores/${clave}/siguiente`),
  },
  parametros: {
    list: (params) => api.get('/administracion/parametros', { params }),
    get: (clave) => api.get(`/administracion/parametros/${clave}`),
    create: (data) => api.post('/administracion/parametros', data),
    update: (id, data) => api.put(`/administracion/parametros/id/${id}`, data),
    delete: (id) => api.delete(`/administracion/parametros/id/${id}`),
    updateByClave: (clave, data) => api.put(`/administracion/parametros/${clave}`, data),
  },
  feriados: {
    ...crud('/administracion/feriados'),
    esHabil: (fecha) => api.get('/administracion/feriados/es-habil', { params: { fecha } }),
    proximoHabil: (fecha, incluir_actual = true) =>
      api.get('/administracion/feriados/proximo-habil', { params: { fecha, incluir_actual } }),
  },
  funcionarios: crud('/administracion/funcionarios'),
});

dmerge(presupuestoAPI, {
  evaluacion: (params) => api.get('/presupuesto/evaluacion', { params }),
  crosstab: (params) => api.get('/presupuesto/consultas/crosstab', { params }),
});

dmerge(tesoreriaAPI, {
  retenciones: {
    list: (params) => api.get('/tesoreria/retenciones', { params }),
    aDepositar: () => api.get('/tesoreria/retenciones/a-depositar'),
    depositar: (data) => api.post('/tesoreria/retenciones/depositar', data),
  },
  pagarConRetenciones: (id, data) => api.post(`/tesoreria/ordenes-pago/${id}/pagar-con-retenciones`, data),
  programacionCaja: {
    list: (params) => api.get('/tesoreria/programacion-caja', { params }),
    create: (data) => api.post('/tesoreria/programacion-caja', data),
    update: (id, data) => api.put(`/tesoreria/programacion-caja/${id}`, data),
    delete: (id) => api.delete(`/tesoreria/programacion-caja/${id}`),
    flujo: (anio) => api.get('/tesoreria/programacion-caja/flujo', { params: { anio } }),
  },
  embargos: crud('/tesoreria/embargos'),
  poderes: crud('/tesoreria/poderes'),
});

dmerge(ingresosPublicosAPI, {
  certificados: {
    ...crud('/ingresos-publicos/certificados'),
    libreDeuda: (data) => api.post('/ingresos-publicos/certificados/libre-deuda', data),
  },
  planesPago: {
    simularMoratoria: (data) => api.post('/ingresos-publicos/planes-pago/simular-moratoria', data),
    generarMoratoria: (data) => api.post('/ingresos-publicos/planes-pago/generar', data),
  },
  exenciones: {
    ...crud('/ingresos-publicos/exenciones'),
    vigentes: (params) => api.get('/ingresos-publicos/exenciones/vigentes', { params }),
  },
  titulares: {
    ...crud('/ingresos-publicos/titulares'),
    byCuenta: (id) => api.get(`/ingresos-publicos/titulares/by-cuenta/${id}`),
  },
  regimenesMoratoria: crud('/ingresos-publicos/regimenes-moratoria'),
});

dmerge(contabilidadAPI, {
  transacciones: {
    list: (params) => api.get('/contabilidad/transacciones', { params }),
    get: (id) => api.get(`/contabilidad/transacciones/${id}`),
    pendientes: () => api.get('/contabilidad/transacciones/pendientes'),
    crear: (data) => api.post('/contabilidad/transacciones', data),
    reprocesar: (id) => api.post(`/contabilidad/transacciones/${id}/reprocesar`, {}),
    anular: (id) => api.post(`/contabilidad/transacciones/${id}/anular`, {}),
  },
  reglasImputacion: {
    list: () => api.get('/contabilidad/reglas-imputacion'),
    create: (data) => api.post('/contabilidad/reglas-imputacion', data),
    update: (id, data) => api.put(`/contabilidad/reglas-imputacion/${id}`, data),
    delete: (id) => api.delete(`/contabilidad/reglas-imputacion/${id}`),
    reprocesarPendientes: (id) => api.post(`/contabilidad/reglas-imputacion/${id}/reprocesar-pendientes`, {}),
  },
  mapeoCuentas: {
    list: (params) => api.get('/contabilidad/mapeo-cuentas', { params }),
    create: (data) => api.post('/contabilidad/mapeo-cuentas', data),
    update: (id, data) => api.put(`/contabilidad/mapeo-cuentas/${id}`, data),
    delete: (id) => api.delete(`/contabilidad/mapeo-cuentas/${id}`),
  },
});

// ═══════════════ DOMINIOS NUEVOS ═══════════════

export const cementerioAPI = {
  sepulturas: crud('/cementerio/sepulturas'),
  concesiones: {
    ...crud('/cementerio/concesiones'),
    get: (id) => api.get(`/cementerio/concesiones/${id}`),
  },
  difuntos: crud('/cementerio/difuntos'),
  inhumaciones: {
    list: (params) => api.get('/cementerio/inhumaciones', { params }),
    create: (data) => api.post('/cementerio/inhumaciones', data),
  },
  traslados: {
    list: (params) => api.get('/cementerio/traslados', { params }),
    create: (data) => api.post('/cementerio/traslados', data),
  },
  tasas: {
    list: (params) => api.get('/cementerio/tasas', { params }),
    liquidar: (data) => api.post('/cementerio/tasas/liquidar', data),
    pagar: (id) => api.post(`/cementerio/tasas/${id}/pagar`, {}),
  },
  ocupacion: () => api.get('/cementerio/ocupacion'),
};

export const apremiosAPI = {
  juicios: {
    list: (params) => api.get('/apremios/juicios', { params }),
    get: (id) => api.get(`/apremios/juicios/${id}`),
    create: (data) => api.post('/apremios/juicios', data),
    update: (id, data) => api.put(`/apremios/juicios/${id}`, data),
    avanzar: (id, data) => api.post(`/apremios/juicios/${id}/avanzar`, data),
    remove: (id) => api.delete(`/apremios/juicios/${id}`),
  },
  actos: {
    list: (idJuicio, params) => api.get(`/apremios/juicios/${idJuicio}/actos`, { params }),
    create: (idJuicio, data) => api.post(`/apremios/juicios/${idJuicio}/actos`, data),
    remove: (idJuicio, id) => api.delete(`/apremios/juicios/${idJuicio}/actos/${id}`),
  },
  embargos: {
    list: (idJuicio, params) => api.get(`/apremios/juicios/${idJuicio}/embargos`, { params }),
    create: (idJuicio, data) => api.post(`/apremios/juicios/${idJuicio}/embargos`, data),
    update: (idJuicio, id, data) => api.put(`/apremios/juicios/${idJuicio}/embargos/${id}`, data),
    remove: (idJuicio, id) => api.delete(`/apremios/juicios/${idJuicio}/embargos/${id}`),
  },
  honorarios: {
    list: (idJuicio, params) => api.get(`/apremios/juicios/${idJuicio}/honorarios`, { params }),
    create: (idJuicio, data) => api.post(`/apremios/juicios/${idJuicio}/honorarios`, data),
    update: (idJuicio, id, data) => api.put(`/apremios/juicios/${idJuicio}/honorarios/${id}`, data),
    remove: (idJuicio, id) => api.delete(`/apremios/juicios/${idJuicio}/honorarios/${id}`),
  },
  mandamientos: {
    list: (idJuicio, params) => api.get(`/apremios/juicios/${idJuicio}/mandamientos`, { params }),
    create: (idJuicio, data) => api.post(`/apremios/juicios/${idJuicio}/mandamientos`, data),
    update: (idJuicio, id, data) => api.put(`/apremios/juicios/${idJuicio}/mandamientos/${id}`, data),
    remove: (idJuicio, id) => api.delete(`/apremios/juicios/${idJuicio}/mandamientos/${id}`),
  },
};

export const reportesAPI = {
  tablero: (params) => api.get('/reportes/tablero', { params }),
  recaudacion: (params) => api.get('/reportes/recaudacion', { params }),
  cierreCaja: (params) => api.get('/reportes/cierre-caja', { params }),
  ejecucionPresupuestaria: (params) => api.get('/reportes/ejecucion-presupuestaria', { params }),
  cicloGasto: (params) => api.get('/reportes/ciclo-gasto', { params }),
};

dmerge(authAPI, {
  login: (username, password, totp_code) => api.post('/seguridad/auth/token', { username, password, totp_code }),
  twofaEstado: () => api.get('/seguridad/2fa/estado'),
  twofaSetup: () => api.post('/seguridad/2fa/setup'),
  twofaActivar: (codigo) => api.post('/seguridad/2fa/activar', { codigo }),
  twofaVerificar: (codigo) => api.post('/seguridad/2fa/verificar', { codigo }),
  twofaDesactivar: (codigo) => api.post('/seguridad/2fa/desactivar', { codigo }),
});

dmerge(auditoriaAPI, {
  estadisticas: {
    resumen:    (params) => api.get('/auditoria/estadisticas/resumen', { params }),
    porDia:     (params) => api.get('/auditoria/estadisticas/por-dia', { params }),
    porUsuario: (params) => api.get('/auditoria/estadisticas/por-usuario', { params }),
    errores:    (params) => api.get('/auditoria/estadisticas/errores', { params }),
  },
});

dmerge(wavAPI, { debito: { lotes: {
  list: (params) => api.get('/wav/debito/lotes', { params }),
  get: (id) => api.get(`/wav/debito/lotes/${id}`),
  generar: (data) => api.post('/wav/debito/generar-lote', data),
  archivo: (id) => api.get(`/wav/debito/lotes/${id}/archivo`, { responseType: 'arraybuffer' }),
  enviar: (id) => api.post(`/wav/debito/lotes/${id}/enviar`, {}),
  procesarRechazos: (id, data) => api.post(`/wav/debito/lotes/${id}/procesar-rechazos`, data),
} } });

dmerge(ingresosPublicosAPI, {
  fondeaderos: crud('/ingresos-publicos/fondeaderos'),
  puestosMercado: crud('/ingresos-publicos/puestos-mercado'),
  serviciosMedidos: {
    ...crud('/ingresos-publicos/servicios-medidos'),
    lecturas: (idServicio) => api.get(`/ingresos-publicos/servicios-medidos/${idServicio}/lecturas`),
    cargarLectura: (idServicio, data) => api.post(`/ingresos-publicos/servicios-medidos/${idServicio}/lecturas`, data),
  },
  derechosConstruccion: {
    ...crud('/ingresos-publicos/derechos-construccion'),
    liquidar: (id, data) => api.post(`/ingresos-publicos/derechos-construccion/${id}/liquidar`, data || {}),
  },
});

dmerge(tesoreriaAPI, {
  cuentasBancarias: {
    depositos: (id) => api.get(`/tesoreria/cuentas-bancarias/${id}/depositos`),
    crearDeposito: (id, data) => api.post(`/tesoreria/cuentas-bancarias/${id}/depositos`, data),
    acreditarRecaudacion: (id, data) => api.post(`/tesoreria/cuentas-bancarias/${id}/acreditar-recaudacion`, data),
  },
  conciliacion: {
    autoConciliar: (idExtracto) => api.post(`/tesoreria/conciliacion/extractos/${idExtracto}/auto-conciliar`, {}),
  },
});

export const patrimonioAPI = {
  bienes: {
    list: (params) => api.get('/patrimonio/bienes', { params }),
    get: (id) => api.get(`/patrimonio/bienes/${id}`),
    create: (data) => api.post('/patrimonio/bienes', data),
    update: (id, data) => api.put(`/patrimonio/bienes/${id}`, data),
    pase: (id, data) => api.post(`/patrimonio/bienes/${id}/pase`, data),
    baja: (id, data) => api.post(`/patrimonio/bienes/${id}/baja`, data),
    altaDesdeOc: (data) => api.post('/patrimonio/bienes/alta-desde-oc', data),
    inventario: () => api.get('/patrimonio/bienes/inventario'),
  },
  amortizacion: {
    preview: (periodo) => api.get('/patrimonio/amortizacion/preview', { params: { periodo } }),
    correr: (data) => api.post('/patrimonio/amortizacion/correr', data),
  },
};

export const creditoPublicoAPI = {
  emprestitos: {
    list: (params) => api.get('/credito-publico/emprestitos', { params }),
    get: (id) => api.get(`/credito-publico/emprestitos/${id}`),
    create: (data) => api.post('/credito-publico/emprestitos', data),
    generarPlan: (id) => api.post(`/credito-publico/emprestitos/${id}/plan-amortizacion`, {}),
    desembolsar: (id, data) => api.post(`/credito-publico/emprestitos/${id}/desembolso`, data),
    resumen: () => api.get('/credito-publico/emprestitos/resumen'),
  },
  cuotas: { pagar: (id) => api.post(`/credito-publico/cuotas/${id}/pagar`, {}) },
};

dmerge(contaduriaAPI, {
  retenciones: {
    sicore: (periodo) => api.get('/contaduria/retenciones/sicore.txt', { params: periodo ? { periodo } : {}, responseType: 'text' }),
    iibb: (periodo) => api.get('/contaduria/retenciones/iibb-arba.txt', { params: periodo ? { periodo } : {}, responseType: 'text' }),
  },
});
dmerge(reportesAPI, {
  rendicion: (params) => api.get('/reportes/rendicion', { params }),
  rendicionCsv: (params) => api.get('/reportes/rendicion', { params: { ...params, formato: 'csv' }, responseType: 'text' }),
  ejecucionCsv: (anio) => api.get('/reportes/ejecucion-presupuestaria', { params: { anio, formato: 'csv' }, responseType: 'text' }),
});

dmerge(ingresosPublicosAPI, {
  valorTierra: {
    list: (params) => api.get('/ingresos-publicos/valor-tierra', { params }),
    create: (data) => api.post('/ingresos-publicos/valor-tierra', data),
    delete: (id) => api.delete(`/ingresos-publicos/valor-tierra/${id}`),
  },
  alicuotaRubro: {
    list: (params) => api.get('/ingresos-publicos/alicuota-rubro', { params }),
    create: (data) => api.post('/ingresos-publicos/alicuota-rubro', data),
    delete: (id) => api.delete(`/ingresos-publicos/alicuota-rubro/${id}`),
  },
  motorValuacion: {
    valuarInmueble: (id, ejercicio, zona) => api.post(`/ingresos-publicos/valuacion/inmueble/${id}`, null, { params: { ejercicio, zona } }),
    valuarInmueblesMasiva: (ejercicio, zona) => api.post('/ingresos-publicos/valuacion/inmuebles/masiva', null, { params: { ejercicio, zona } }),
    valuarVehiculo: (id, ejercicio) => api.get(`/ingresos-publicos/valuacion/vehiculo/${id}`, { params: { ejercicio } }),
    liquidarDdjj: (id) => api.post(`/ingresos-publicos/valuacion/comercio-ddjj/${id}/liquidar`, {}),
  },
});

dmerge(administracionAPI, {
  personas: {
    ficha360: (tipo, id) => api.get(`/administracion/personas/${tipo}/${id}/ficha-360`),
  },
});

// ── Inciso C: percibido, prescripción, transferencias, saldos a favor, barcode/QR, PDF, alertas ──
dmerge(presupuestoAPI, {
  mapeoTributoRecurso: {
    list: (params) => api.get('/presupuesto/mapeo-tributo-recurso', { params }),
    create: (data) => api.post('/presupuesto/mapeo-tributo-recurso', data),
    delete: (id) => api.delete(`/presupuesto/mapeo-tributo-recurso/${id}`),
  },
  percibidoPorTributo: (data) => api.post('/presupuesto/percibido-por-tributo', data),
});

dmerge(emisionesAPI, {
  comprobantes: {
    codigoPago: (id) => api.get(`/emisiones/emisiones/comprobantes/${id}/codigo-pago`),
    barcodePng: (id) => api.get(`/emisiones/emisiones/comprobantes/${id}/barcode.png`, { responseType: 'blob' }),
    qrPng: (id) => api.get(`/emisiones/emisiones/comprobantes/${id}/qr.png`, { responseType: 'blob' }),
  },
  ctacte: {
    saldoAFavor: (idContribuyente) => api.get(`/emisiones/emisiones/cuenta-corriente/by-contribuyente/${idContribuyente}/saldo-a-favor`),
    compensar: (idCc, data) => api.post(`/emisiones/emisiones/cuenta-corriente/${idCc}/compensar`, data),
  },
});

dmerge(ingresosPublicosAPI, {
  prescripciones: {
    list: (params) => api.get('/ingresos-publicos/prescripciones', { params }),
    prescriptible: (params) => api.get('/ingresos-publicos/prescripciones/prescriptible', { params }),
    marcar: (data) => api.post('/ingresos-publicos/prescripciones', data),
    revertir: (id) => api.delete(`/ingresos-publicos/prescripciones/${id}`),
  },
  transferenciasDominio: {
    list: (params) => api.get('/ingresos-publicos/transferencias-dominio', { params }),
    transferir: (data) => api.post('/ingresos-publicos/transferencias-dominio', data),
  },
});

dmerge(reportesAPI, {
  rendicionPdf: (params) => api.get('/reportes/rendicion', { params: { ...params, formato: 'pdf' }, responseType: 'blob' }),
  ejecucionPdf: (anio) => api.get('/reportes/ejecucion-presupuestaria', { params: { anio, formato: 'pdf' }, responseType: 'blob' }),
});

dmerge(auditoriaAPI, {
  reglasAlerta: {
    list: (params) => api.get('/auditoria/alertas/reglas', { params }),
    get: (id) => api.get(`/auditoria/alertas/reglas/${id}`),
    create: (data) => api.post('/auditoria/alertas/reglas', data),
    update: (id, data) => api.put(`/auditoria/alertas/reglas/${id}`, data),
    delete: (id) => api.delete(`/auditoria/alertas/reglas/${id}`),
  },
  alertas: {
    list: (params) => api.get('/auditoria/alertas', { params }),
    evaluar: () => api.post('/auditoria/alertas/evaluar', {}),
  },
});

// Consulta inversa: objeto (vehículo/inmueble/comercio) -> titular(es)
dmerge(ingresosPublicosAPI, {
  objetos: {
    buscar: (q, tipo) => api.get('/ingresos-publicos/objetos/buscar', { params: { q, tipo: tipo || undefined } }),
  },
});

export const firmaAPI = {
  documentos: {
    list: (params) => api.get('/firma/documentos', { params }),
    get: (id) => api.get(`/firma/documentos/${id}`),
    registrar: (data) => api.post('/firma/documentos', data),
    firmar: (id, data) => api.post(`/firma/documentos/${id}/firmar`, data || {}),
    anular: (id) => api.post(`/firma/documentos/${id}/anular`, {}),
    verificar: (id) => api.get(`/firma/documentos/${id}/verificar`),
  },
  bandeja: (params) => api.get('/firma/bandeja', { params }),
};

// Firma digital: configuración de modo (sistema) + reset de credencial (admin)
dmerge(firmaAPI, {
  configuracion: {
    get: () => api.get('/firma/configuracion'),
    update: (data) => api.put('/firma/configuracion', data),
  },
});
dmerge(seguridadAPI, {
  usuarios: { firmaReset: (id) => api.post(`/seguridad/usuarios/${id}/firma-reset`, {}) },
});

export const rrhhAPI = {
  categorias: crud('/rrhh/categorias'),
  tiposCargo: crud('/rrhh/tipos-cargo'),
  cargosFunciones: crud('/rrhh/cargos-funciones'),
  nivelesLaboral: crud('/rrhh/niveles-laboral'),
  tiposRelacion: crud('/rrhh/tipos-relacion'),
  oficinas: crud('/rrhh/oficinas'),
  parentescos: crud('/rrhh/parentescos'),
  tiposAntiguedad: crud('/rrhh/tipos-antiguedad'),
  sindicatos: crud('/rrhh/sindicatos'),
  obrasSociales: crud('/rrhh/obras-sociales'),
  legajos: {
    ...crud('/rrhh/legajos'),
    ficha: (id) => api.get(`/rrhh/legajos/${id}/ficha`),
    cargos: (id) => api.get(`/rrhh/legajos/${id}/cargos`),
    antiguedades: (id) => api.get(`/rrhh/legajos/${id}/antiguedades`),
    familiares: (id) => api.get(`/rrhh/legajos/${id}/familiares`),
  },
  legajoCargos: crud('/rrhh/legajo-cargos'),
  antiguedades: crud('/rrhh/antiguedades'),
  familiares: crud('/rrhh/familiares'),
  presupuestoCargos: crud('/rrhh/presupuesto-cargos'),
};

// RRHH Fase 2: conceptos, tipos de liquidación, novedades, liquidar, procesos, recibo
dmerge(rrhhAPI, {
  conceptos: crud('/rrhh/conceptos'),
  tiposLiquidacion: crud('/rrhh/tipos-liquidacion'),
  novedades: crud('/rrhh/novedades'),
  liquidar: (data) => api.post('/rrhh/liquidar', data),
  procesos: {
    list: (params) => api.get('/rrhh/liquidacion-procesos', { params }),
    get: (id) => api.get(`/rrhh/liquidacion-procesos/${id}`),
  },
  legajos: {
    recibo: (id, params) => api.get(`/rrhh/legajos/${id}/recibo`, { params }),
  },
});

// RRHH Fase 3: ausencias/licencias, horas extra, embargos
dmerge(rrhhAPI, {
  motivosAusencia: crud('/rrhh/motivos-ausencia'),
  ausencias: crud('/rrhh/ausencias'),
  licenciasAnuales: crud('/rrhh/licencias-anuales'),
  horasExtra: crud('/rrhh/horas-extra'),
  embargos: { ...crud('/rrhh/embargos'), liquidados: (id) => api.get(`/rrhh/embargos/${id}/liquidados`) },
});
