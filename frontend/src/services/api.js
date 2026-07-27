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
