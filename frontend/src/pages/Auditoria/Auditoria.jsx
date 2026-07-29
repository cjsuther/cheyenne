import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { auditoriaAPI } from '../../services/api';
import { useTabParam } from '../../hooks/useTabParam';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const fmtDateTime = (v) => (v ? new Date(v).toLocaleString() : '');

const StatusBadge = (v) => {
  if (v == null) return '';
  const color = v >= 500 ? 'bg-red-100 text-red-700'
    : v >= 400 ? 'bg-amber-100 text-amber-700'
    : 'bg-green-100 text-green-700';
  return <span className={`px-2 py-0.5 rounded text-xs font-medium ${color}`}>{v}</span>;
};

const eventosCols = [
  { key: 'id', label: 'ID' },
  { key: 'fecha', label: 'Fecha', render: fmtDateTime },
  { key: 'modulo', label: 'Módulo' },
  { key: 'metodo', label: 'Método' },
  { key: 'path', label: 'Ruta' },
  { key: 'status_code', label: 'Status', render: StatusBadge },
  { key: 'usuario', label: 'Usuario', render: (v, r) => v || (r.id_usuario ? `#${r.id_usuario}` : 'anónimo') },
  { key: 'ip', label: 'IP' },
  { key: 'duracion_ms', label: 'ms' },
];

const incidenciasCols = [
  { key: 'id', label: 'ID' },
  { key: 'origen', label: 'Origen' },
  { key: 'mensaje', label: 'Mensaje' },
  { key: 'id_nivel_criticidad', label: 'Criticidad' },
  { key: 'fecha', label: 'Fecha', render: fmtDateTime },
];

const inputCls = 'border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500';
const btnPrimary = 'px-4 py-1.5 rounded-lg text-sm font-medium bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50';
const btnSecondary = 'px-4 py-1.5 rounded-lg text-sm font-medium bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50';

const EMPTY = { usuario: '', modulo: '', desde: '', hasta: '', status_code: '', metodo: '', path: '' };

// Limpia claves vacías para no mandarlas como filtros.
const clean = (f) => Object.fromEntries(Object.entries(f).filter(([, v]) => v !== '' && v != null));

function IntegrityIndicator() {
  const [result, setResult] = useState(null);
  const verificar = useMutation({
    mutationFn: () => auditoriaAPI.eventos.verificarIntegridad().then((r) => r.data),
    onSuccess: (data) => setResult(data),
  });

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4 flex items-center gap-4">
      <button className={btnSecondary} onClick={() => verificar.mutate()} disabled={verificar.isPending}>
        {verificar.isPending ? 'Verificando…' : 'Verificar integridad de la cadena'}
      </button>
      {result && (
        <div className="flex items-center gap-2 text-sm">
          {result.integro ? (
            <span className="px-2.5 py-1 rounded-full bg-green-100 text-green-700 font-medium">
              Cadena íntegra · {result.total_eventos} eventos verificados
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full bg-red-100 text-red-700 font-medium">
              Integridad comprometida · {result.eventos_alterados.length} alterados,
              {' '}{result.eslabones_rotos.length} eslabones rotos
            </span>
          )}
          {result.sin_hash > 0 && (
            <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
              {result.sin_hash} sin hash
            </span>
          )}
        </div>
      )}
      {verificar.isError && <span className="text-sm text-red-600">Error al verificar</span>}
    </div>
  );
}

function EventosTab() {
  const [form, setForm] = useState(EMPTY);
  const [filtros, setFiltros] = useState({});

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['auditoria-eventos', filtros],
    queryFn: () => auditoriaAPI.eventos.list({ skip: 0, limit: 100, ...filtros }).then((r) => r.data),
    refetchInterval: 15000,
  });

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const aplicar = () => setFiltros(clean(form));
  const limpiar = () => { setForm(EMPTY); setFiltros({}); };

  const exportar = async () => {
    const { data: blob } = await auditoriaAPI.eventos.exportCsv(clean(form));
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `auditoria_eventos_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <IntegrityIndicator />

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <input className={inputCls} placeholder="Usuario" value={form.usuario} onChange={set('usuario')} />
          <input className={inputCls} placeholder="Módulo" value={form.modulo} onChange={set('modulo')} />
          <input className={inputCls} placeholder="Ruta (path)" value={form.path} onChange={set('path')} />
          <select className={inputCls} value={form.metodo} onChange={set('metodo')}>
            <option value="">Método (todos)</option>
            {['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
          <input className={inputCls} type="number" placeholder="Status code" value={form.status_code} onChange={set('status_code')} />
          <div>
            <label className="block text-xs text-gray-500 mb-0.5">Desde</label>
            <input className={inputCls + ' w-full'} type="datetime-local" value={form.desde} onChange={set('desde')} />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-0.5">Hasta</label>
            <input className={inputCls + ' w-full'} type="datetime-local" value={form.hasta} onChange={set('hasta')} />
          </div>
        </div>
        <div className="flex gap-2 mt-3">
          <button className={btnPrimary} onClick={aplicar}>Buscar</button>
          <button className={btnSecondary} onClick={limpiar}>Limpiar</button>
          <button className={btnSecondary} onClick={exportar}>Exportar CSV</button>
          {isFetching && <span className="text-sm text-gray-400 self-center">Actualizando…</span>}
        </div>
      </div>

      {isLoading ? <LoadingSpinner /> : <DataTable columns={eventosCols} data={data} />}
    </div>
  );
}

function IncidenciasTab() {
  const { data, isLoading } = useQuery({
    queryKey: ['auditoria-incidencias'],
    queryFn: () => auditoriaAPI.incidencias.list({ skip: 0, limit: 100 }).then((r) => r.data),
  });
  return isLoading ? <LoadingSpinner /> : <DataTable columns={incidenciasCols} data={data} />;
}

const TABS = [
  { key: 'eventos', label: 'Rastro de accesos' },
  { key: 'incidencias', label: 'Incidencias' },
];

export default function Auditoria() {
  const [tab, setTab] = useTabParam('eventos');
  return (
    <div>
      <PageHeader title="Auditoría" subtitle="Rastro de accesos e incidencias del sistema" />
      <div className="flex gap-2 mb-4">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === t.key ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tab === 'eventos' ? <EventosTab /> : <IncidenciasTab />}
    </div>
  );
}
