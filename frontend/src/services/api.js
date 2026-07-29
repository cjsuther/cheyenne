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
    ...crud('/emisiones/coeficientes'),
    recalcularRecargo: (data) => api.post('/emisiones/coeficientes/recalcular-recargo', data),
  },

  vencimientos: {
    list: (idComprobante) => api.get(`/emisiones/comprobantes/${idComprobante}/vencimientos`),
    set: (idComprobante, vencimientos) => api.put(`/emisiones/comprobantes/${idComprobante}/vencimientos`, vencimientos),
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
