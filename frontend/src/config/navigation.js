// Registro central de navegación: módulos + solapas internas.
// Lo usa el buscador del menú para saltar directo a una solapa (deep-link con ?tab=).

export const NAV = [
  { label: 'Dashboard', path: '/', module: null, tabs: [] },

  // ── Contribuyente ──
  { label: 'Contribuyente 360', path: '/contribuyente-360', module: 'ingresos_publicos', tabs: [] },
  {
    label: 'Personas', path: '/contribuyente/personas', module: 'administracion', tabs: [
      { k: 'personasFisicas', l: 'Personas Físicas' }, { k: 'personasJuridicas', l: 'Personas Jurídicas' },
    ],
  },

  // ── Ingresos Públicos ──
  {
    label: 'Ingresos Públicos', path: '/ingresos-publicos', module: 'ingresos_publicos', tabs: [
      { k: 'contribuyentes', l: 'Contribuyentes' }, { k: 'cuentas', l: 'Cuentas' },
      { k: 'comercios', l: 'Comercios' }, { k: 'comercioRubros', l: 'Comercio - Rubros' },
      { k: 'comercioDdjj', l: 'Comercio - DD.JJ.' }, { k: 'inmuebles', l: 'Inmuebles' },
      { k: 'valuaciones', l: 'Valuaciones' }, { k: 'superficies', l: 'Superficies' }, { k: 'frentes', l: 'Frentes' },
      { k: 'vehiculos', l: 'Vehículos' }, { k: 'vehiculoVal', l: 'Valuación Vehicular' },
      { k: 'emisiones', l: 'Emisiones' }, { k: 'emisionDef', l: 'Definiciones de Emisión' },
      { k: 'planesPago', l: 'Planes de Pago' }, { k: 'simularPlan', l: 'Simular Plan' },
      { k: 'cuotasPlan', l: 'Cuotas de Plan' }, { k: 'planPagoDef', l: 'Definiciones de Plan' },
      { k: 'certificados', l: 'Certificados' }, { k: 'multas', l: 'Multas' },
      { k: 'tasas', l: 'Tasas' }, { k: 'subTasas', l: 'Sub-Tasas' }, { k: 'listas', l: 'Listas' },
    ],
  },
  { label: 'Emisiones', path: '/emisiones', module: 'emisiones', tabs: [] },
  { label: 'Tasas y Fórmulas', path: '/tasas-formulas', module: 'emisiones', tabs: [] },
  {
    label: 'Tesorería', path: '/tesoreria', module: 'tesoreria', tabs: [
      { k: 'ordenesPago', l: 'Órdenes de Pago' }, { k: 'parteEgresos', l: 'Parte de Egresos' }, { k: 'cheques', l: 'Cheques' }, { k: 'ordenesBanc', l: 'Órdenes Bancarias' }, { k: 'conciliacion', l: 'Conciliación' }, { k: 'beneficiarios', l: 'Beneficiarios' }, { k: 'cuentasBanc', l: 'Cuentas Bancarias' },
      { k: 'cajas', l: 'Cajas' }, { k: 'dependencias', l: 'Dependencias' }, { k: 'recaudadoras', l: 'Recaudadoras' },
      { k: 'recaudacionLotes', l: 'Recaudación' }, { k: 'reciboPubLotes', l: 'Recibos Publicación' },
      { k: 'pagoRendLotes', l: 'Pagos Rendición' }, { k: 'regContLotes', l: 'Registros Contables' },
      { k: 'entidades', l: 'Entidades' }, { k: 'listas', l: 'Listas' },
    ],
  },
  { label: 'WAV — Autogestión', path: '/wav', module: 'wav', tabs: [] },
  {
    label: 'Comunicación', path: '/comunicacion', module: 'comunicacion', tabs: [
      { k: 'mensajes', l: 'Mensajes' }, { k: 'listas', l: 'Listas' },
    ],
  },
  { label: 'Importación', path: '/importacion', module: 'importacion', tabs: [] },
  { label: 'Interface', path: '/interface', module: 'interface', tabs: [] },

  // ── Presupuesto ──
  {
    label: 'Presupuesto', path: '/presupuesto', module: 'presupuesto', tabs: [
      { k: 'partidas', l: 'Partidas' }, { k: 'modificaciones', l: 'Modificaciones Presupuestarias' }, { k: 'recursos', l: 'Recursos (Cálculo)' }, { k: 'cuotas', l: 'Cuotas de Compromiso' }, { k: 'rrhh', l: 'RRHH por Cargo' }, { k: 'metas', l: 'Metas Físicas' }, { k: 'proyectos', l: 'Proyectos de Inversión' }, { k: 'cargos', l: 'Cargos (Nomenclador)' }, { k: 'tablero', l: 'Tablero de Ejecución' }, { k: 'ejercicios', l: 'Ejercicios' }, { k: 'jurisdicciones', l: 'Jurisdicciones' },
      { k: 'estructuras', l: 'Estructuras Programáticas' }, { k: 'objetosGasto', l: 'Objetos del Gasto' },
      { k: 'fuentes', l: 'Fuentes de Financiamiento' }, { k: 'rubros', l: 'Rubros de Recursos' },
    ],
  },

  // ── Compras ──
  { label: 'Compras — Adquisiciones', path: '/compras', module: 'compras', tabs: [
    { k: 'pedidos', l: 'Pedidos de área' }, { k: 'oc', l: 'Órdenes de Compra' }, { k: 'stock', l: 'Stock' }, { k: 'proveedores', l: 'Proveedores' }, { k: 'articulos', l: 'Artículos' },
  ] },

  // ── Contaduría ──
  { label: 'Contaduría — Ciclo del Gasto', path: '/contaduria', module: 'contaduria', tabs: [] },

  // ── Configuración (maestros) ──
  {
    label: 'Configuración', path: '/configuracion', module: 'administracion', tabs: [
      { k: 'expedientes', l: 'Expedientes' }, { k: 'documentos', l: 'Documentos' }, { k: 'archivos', l: 'Archivos' },
      { k: 'paises', l: 'Países' }, { k: 'provincias', l: 'Provincias' }, { k: 'localidades', l: 'Localidades' },
      { k: 'jurisdicciones', l: 'Jurisdicciones' }, { k: 'cuentasContables', l: 'Cuentas Contables' },
      { k: 'recursosPorRubro', l: 'Recursos por Rubro' }, { k: 'mediosPago', l: 'Medios de Pago' },
      { k: 'direcciones', l: 'Direcciones' }, { k: 'contactos', l: 'Contactos' },
      { k: 'entidades', l: 'Entidades' }, { k: 'observaciones', l: 'Observaciones' },
      { k: 'etiquetas', l: 'Etiquetas' }, { k: 'listas', l: 'Listas' },
    ],
  },

  // ── Seguridad ──
  {
    label: 'Seguridad', path: '/seguridad', module: 'seguridad', tabs: [
      { k: 'usuarios', l: 'Usuarios' }, { k: 'perfiles', l: 'Perfiles' }, { k: 'permisos', l: 'Permisos' },
    ],
  },
  { label: 'Auditoría', path: '/auditoria', module: 'auditoria', tabs: [] },
  { label: 'Mi Perfil', path: '/perfil', module: null, tabs: [] },
];

const norm = (s) => (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

// Aplana módulos + solapas a destinos buscables, filtrando por permiso (canAccess(module)).
export function searchableDestinations(canAccess) {
  const items = [];
  for (const m of NAV) {
    if (m.module && !canAccess(m.module)) continue;
    items.push({ label: m.label, context: '', path: m.path, key: m.path });
    for (const t of m.tabs || []) {
      items.push({ label: t.l, context: m.label, path: `${m.path}?tab=${t.k}`, key: `${m.path}#${t.k}` });
    }
  }
  return items;
}

export function filterDestinations(items, query) {
  const q = norm(query).trim();
  if (!q) return [];
  const terms = q.split(/\s+/);
  return items
    .map((it) => {
      const hay = norm(`${it.label} ${it.context}`);
      const match = terms.every((t) => hay.includes(t));
      // ranking simple: empieza-con > contiene
      const score = match ? (norm(it.label).startsWith(terms[0]) ? 0 : 1) : 99;
      return { it, score, match };
    })
    .filter((x) => x.match)
    .sort((a, b) => a.score - b.score)
    .slice(0, 8)
    .map((x) => x.it);
}
