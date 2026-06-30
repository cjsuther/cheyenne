// Registro central de navegación: módulos + solapas internas.
// Lo usa el buscador del menú para saltar directo a una solapa (deep-link con ?tab=).

export const NAV = [
  { label: 'Dashboard', path: '/', module: null, tabs: [] },
  { label: 'Contribuyente 360', path: '/contribuyente-360', module: 'ingresos_publicos', tabs: [] },
  {
    label: 'Administración', path: '/administracion', module: 'administracion', tabs: [
      { k: 'personasFisicas', l: 'Personas Físicas' }, { k: 'personasJuridicas', l: 'Personas Jurídicas' },
      { k: 'expedientes', l: 'Expedientes' }, { k: 'entidades', l: 'Entidades' }, { k: 'listas', l: 'Listas' },
      { k: 'paises', l: 'Países' }, { k: 'provincias', l: 'Provincias' }, { k: 'localidades', l: 'Localidades' },
      { k: 'cuentasContables', l: 'Cuentas Contables' }, { k: 'jurisdicciones', l: 'Jurisdicciones' },
      { k: 'recursosPorRubro', l: 'Recursos por Rubro' }, { k: 'documentos', l: 'Documentos' },
      { k: 'mediosPago', l: 'Medios de Pago' }, { k: 'direcciones', l: 'Direcciones' },
      { k: 'contactos', l: 'Contactos' }, { k: 'archivos', l: 'Archivos' },
      { k: 'observaciones', l: 'Observaciones' }, { k: 'etiquetas', l: 'Etiquetas' },
    ],
  },
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
  {
    label: 'Tesorería', path: '/tesoreria', module: 'tesoreria', tabs: [
      { k: 'cajas', l: 'Cajas' }, { k: 'dependencias', l: 'Dependencias' }, { k: 'recaudadoras', l: 'Recaudadoras' },
      { k: 'recaudacionLotes', l: 'Recaudación' }, { k: 'reciboPubLotes', l: 'Recibos Publicación' },
      { k: 'pagoRendLotes', l: 'Pagos Rendición' }, { k: 'regContLotes', l: 'Registros Contables' },
      { k: 'entidades', l: 'Entidades' }, { k: 'listas', l: 'Listas' },
    ],
  },
  {
    label: 'Comunicación', path: '/comunicacion', module: 'comunicacion', tabs: [
      { k: 'mensajes', l: 'Mensajes' }, { k: 'listas', l: 'Listas' },
    ],
  },
  { label: 'Auditoría', path: '/auditoria', module: 'auditoria', tabs: [] },
  {
    label: 'Seguridad', path: '/seguridad', module: 'seguridad', tabs: [
      { k: 'usuarios', l: 'Usuarios' }, { k: 'perfiles', l: 'Perfiles' }, { k: 'permisos', l: 'Permisos' },
    ],
  },
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
