// Registro central de los super-módulos (dashboard) y sus sub-menús.
import {
  IconContribuyente360, IconIngresos, IconSeguridad, IconContaduria, IconConfig, IconPresupuesto, IconTesoreria, IconCompras, IconContabilidad, IconPatrimonio, IconCredito, IconCementerio, IconApremios, IconReportes, IconFirma,
} from '../components/common/icons';

export const SUPER_MODULES = [
  {
    key: 'contribuyente', label: 'Contribuyente', desc: 'Personas humanas y jurídicas',
    Icon: IconContribuyente360, chip: 'bg-indigo-50 text-indigo-600',
    items: [
      { path: '/contribuyente-360', label: 'Vista 360', module: 'ingresos_publicos' },
      { path: '/contribuyente/personas', label: 'Personas', module: 'administracion' },
    ],
  },
  {
    key: 'ingresos', label: 'Ingresos Públicos', desc: 'Padrón, emisiones y recaudación',
    Icon: IconIngresos, chip: 'bg-emerald-50 text-emerald-600',
    items: [
      { path: '/ingresos-publicos', label: 'Padrón y tributos', module: 'ingresos_publicos' },
      { path: '/emisiones', label: 'Emisiones', module: 'emisiones' },
      { path: '/tasas-formulas', label: 'Tasas y Fórmulas', module: 'emisiones' },
      { path: '/wav', label: 'WAV — Autogestión', module: 'wav' },
      { path: '/comunicacion', label: 'Comunicación', module: 'comunicacion' },
      { path: '/importacion', label: 'Importación', module: 'importacion' },
      { path: '/interface', label: 'Interface', module: 'interface' },
    ],
  },
  {
    key: 'presupuesto', label: 'Presupuesto', desc: 'Formulación, modificaciones y ejecución',
    Icon: IconPresupuesto, chip: 'bg-amber-50 text-amber-700',
    items: [
      { path: '/presupuesto', label: 'Presupuesto', module: 'presupuesto' },
    ],
  },
  {
    key: 'contaduria', label: 'Contaduría', desc: 'Ciclo del gasto y contabilidad general',
    Icon: IconContaduria, chip: 'bg-blue-50 text-blue-700',
    items: [
      { path: '/contaduria', label: 'Ciclo del Gasto', module: 'contaduria' },
      { path: '/contabilidad', label: 'Contabilidad General', module: 'contabilidad' },
    ],
  },
  {
    key: 'compras', label: 'Compras', desc: 'Adquisiciones: pedidos, órdenes de compra y stock',
    Icon: IconCompras, chip: 'bg-orange-50 text-orange-700',
    items: [
      { path: '/compras', label: 'Adquisiciones', module: 'compras' },
    ],
  },
  {
    key: 'cementerio', label: 'Cementerio', desc: 'Sepulturas, concesiones, inhumaciones, traslados y tasas',
    Icon: IconCementerio, chip: 'bg-stone-100 text-stone-700',
    items: [ { path: '/cementerio', label: 'Cementerio', module: 'cementerio' } ],
  },
  {
    key: 'apremios', label: 'Apremios', desc: 'Gestión judicial de deuda: juicios, embargos y honorarios',
    Icon: IconApremios, chip: 'bg-red-50 text-red-700',
    items: [ { path: '/apremios', label: 'Juicios de Apremio', module: 'apremios' } ],
  },
  {
    key: 'reportes', label: 'Reportes', desc: 'Reportes consolidados: recaudación, cierre de caja y ejecución',
    Icon: IconReportes, chip: 'bg-indigo-50 text-indigo-700',
    items: [ { path: '/reportes', label: 'Reportes', module: 'reportes' } ],
  },
  {
    key: 'patrimonio', label: 'Patrimonio', desc: 'Bienes de uso: altas, amortización, pases y bajas',
    Icon: IconPatrimonio, chip: 'bg-lime-50 text-lime-700',
    items: [
      { path: '/patrimonio', label: 'Bienes de uso', module: 'patrimonio' },
    ],
  },
  {
    key: 'credito', label: 'Crédito Público', desc: 'Deuda pública: empréstitos, amortización e intereses',
    Icon: IconCredito, chip: 'bg-rose-50 text-rose-700',
    items: [
      { path: '/credito-publico', label: 'Empréstitos', module: 'credito_publico' },
    ],
  },
  {
    key: 'firma', label: 'Firma Digital', desc: 'Bandeja de firma y firma múltiple de órdenes de pago y documentos',
    Icon: IconFirma, chip: 'bg-violet-50 text-violet-700',
    items: [
      { path: '/firma', label: 'Firma Digital', module: 'firma' },
    ],
  },
  {
    key: 'tesoreria', label: 'Tesorería', desc: 'Recaudación, pagos y bancos',
    Icon: IconTesoreria, chip: 'bg-violet-50 text-violet-700',
    items: [
      { path: '/tesoreria', label: 'Tesorería', module: 'tesoreria' },
    ],
  },
  {
    key: 'configuracion', label: 'Configuración', desc: 'Maestros y datos del sistema',
    Icon: IconConfig, chip: 'bg-cyan-50 text-cyan-600',
    items: [
      { path: '/configuracion', label: 'Maestros', module: 'administracion' },
    ],
  },
  {
    key: 'seguridad', label: 'Seguridad', desc: 'Usuarios, permisos y auditoría',
    Icon: IconSeguridad, chip: 'bg-red-50 text-red-600',
    items: [
      { path: '/seguridad', label: 'Usuarios y permisos', module: 'seguridad' },
      { path: '/auditoria', label: 'Auditoría', module: 'auditoria' },
      { path: '/perfil', label: 'Mi Perfil', module: null },
    ],
  },
];

// Super-módulo que contiene una ruta dada (para el sidebar contextual).
export function superModuleForPath(pathname) {
  return SUPER_MODULES.find((sm) =>
    sm.items.some((it) => pathname === it.path || pathname.startsWith(it.path + '/'))
  );
}
