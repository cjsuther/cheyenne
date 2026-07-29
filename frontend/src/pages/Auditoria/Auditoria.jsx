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

// ── Dashboard ────────────────────────────────────────────────────────
function KpiCard({ label, value, tone = 'gray' }) {
  const tones = {
    gray: 'text-gray-900',
    red: 'text-red-600',
    green: 'text-green-600',
    blue: 'text-primary-600',
  };
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="text-xs uppercase tracking-wide text-gray-500">{label}</div>
      <div className={`mt-1 text-3xl font-semibold ${tones[tone] || tones.gray}`}>
        {value == null ? '—' : value.toLocaleString()}
      </div>
    </div>
  );
}

// Barras horizontales simples con divs (sin librería de charts).
function BarList({ title, rows, labelKey, valueKey, tone = 'bg-primary-500' }) {
  const max = Math.max(1, ...(rows || []).map((r) => r[valueKey] || 0));
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">{title}</h3>
      {(!rows || rows.length === 0) ? (
        <p className="text-sm text-gray-400">Sin datos</p>
      ) : (
        <div className="space-y-2">
          {rows.map((r, i) => (
            <div key={i}>
              <div className="flex justify-between text-xs text-gray-600 mb-0.5">
                <span className="truncate pr-2">{r[labelKey]}</span>
                <span className="font-medium tabular-nums">{(r[valueKey] || 0).toLocaleString()}</span>
              </div>
              <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                <div className={`h-full rounded-full ${tone}`} style={{ width: `${((r[valueKey] || 0) / max) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const statusTone = (clase) =>
  clase === '2xx' ? 'bg-green-500'
    : clase === '3xx' ? 'bg-blue-500'
    : clase === '4xx' ? 'bg-amber-500'
    : clase === '5xx' ? 'bg-red-500'
    : 'bg-gray-400';

function DashboardTab() {
  const { data: resumen, isLoading: loadingResumen } = useQuery({
    queryKey: ['auditoria-resumen'],
    queryFn: () => auditoriaAPI.estadisticas.resumen().then((r) => r.data),
    refetchInterval: 30000,
  });
  const { data: porDia } = useQuery({
    queryKey: ['auditoria-por-dia'],
    queryFn: () => auditoriaAPI.estadisticas.porDia({ dias: 30 }).then((r) => r.data),
    refetchInterval: 30000,
  });
  const { data: porUsuario } = useQuery({
    queryKey: ['auditoria-por-usuario'],
    queryFn: () => auditoriaAPI.estadisticas.porUsuario({ limit: 10 }).then((r) => r.data),
    refetchInterval: 30000,
  });

  if (loadingResumen) return <LoadingSpinner />;

  const serie = porDia?.serie || [];
  const maxSerie = Math.max(1, ...serie.map((d) => d.total || 0));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard label="Eventos totales" value={resumen?.total_eventos} tone="blue" />
        <KpiCard label="Errores (4xx/5xx)" value={resumen?.total_errores} tone="red" />
        <KpiCard label="Usuarios activos" value={resumen?.usuarios_activos} tone="green" />
        <KpiCard label="Módulos con actividad" value={resumen?.por_modulo?.length} />
      </div>

      {/* Serie temporal por día */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Eventos por día (últimos 30 días)</h3>
        {serie.length === 0 ? (
          <p className="text-sm text-gray-400">Sin datos</p>
        ) : (
          <div className="flex items-end gap-1 h-40">
            {serie.map((d) => (
              <div key={d.dia} className="flex-1 flex flex-col justify-end items-center group relative" title={`${d.dia}: ${d.total} eventos, ${d.errores} errores`}>
                <div className="w-full rounded-t bg-primary-500/80 hover:bg-primary-600" style={{ height: `${(d.total / maxSerie) * 100}%` }}>
                  {d.errores > 0 && (
                    <div className="w-full rounded-t bg-red-500" style={{ height: `${(d.errores / Math.max(1, d.total)) * 100}%` }} />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="flex justify-between text-[10px] text-gray-400 mt-1">
          <span>{serie[0]?.dia}</span>
          <span>{serie[serie.length - 1]?.dia}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BarList title="Actividad por módulo" rows={resumen?.por_modulo} labelKey="modulo" valueKey="total" />
        <BarList title="Actividad por método HTTP" rows={resumen?.por_metodo} labelKey="metodo" valueKey="total" tone="bg-indigo-500" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Distribución por clase de status con color por clase */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Distribución por status</h3>
          {(resumen?.por_status || []).length === 0 ? (
            <p className="text-sm text-gray-400">Sin datos</p>
          ) : (
            <div className="space-y-2">
              {resumen.por_status.map((s) => {
                const max = Math.max(1, ...resumen.por_status.map((x) => x.total));
                return (
                  <div key={s.clase}>
                    <div className="flex justify-between text-xs text-gray-600 mb-0.5">
                      <span>{s.clase}</span>
                      <span className="font-medium tabular-nums">{s.total.toLocaleString()}</span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                      <div className={`h-full rounded-full ${statusTone(s.clase)}`} style={{ width: `${(s.total / max) * 100}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <BarList title="Top usuarios por actividad" rows={porUsuario} labelKey="usuario" valueKey="total" tone="bg-emerald-500" />
      </div>
    </div>
  );
}

function ErroresTab() {
  const { data, isLoading } = useQuery({
    queryKey: ['auditoria-errores'],
    queryFn: () => auditoriaAPI.estadisticas.errores({ limit: 50 }).then((r) => r.data),
    refetchInterval: 20000,
  });
  const cols = [
    { key: 'id', label: 'ID' },
    { key: 'fecha', label: 'Fecha', render: fmtDateTime },
    { key: 'modulo', label: 'Módulo' },
    { key: 'metodo', label: 'Método' },
    { key: 'path', label: 'Ruta' },
    { key: 'status_code', label: 'Status', render: StatusBadge },
    { key: 'usuario', label: 'Usuario', render: (v, r) => v || (r.id_usuario ? `#${r.id_usuario}` : 'anónimo') },
    { key: 'ip', label: 'IP' },
  ];
  return isLoading ? <LoadingSpinner /> : <DataTable columns={cols} data={data} />;
}

function IncidenciasTab() {
  const { data, isLoading } = useQuery({
    queryKey: ['auditoria-incidencias'],
    queryFn: () => auditoriaAPI.incidencias.list({ skip: 0, limit: 100 }).then((r) => r.data),
  });
  return isLoading ? <LoadingSpinner /> : <DataTable columns={incidenciasCols} data={data} />;
}

const TABS = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'eventos', label: 'Rastro de accesos' },
  { key: 'errores', label: 'Errores' },
  { key: 'incidencias', label: 'Incidencias' },
];

export default function Auditoria() {
  const [tab, setTab] = useTabParam('dashboard');
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
      {tab === 'dashboard' && <DashboardTab />}
      {tab === 'eventos' && <EventosTab />}
      {tab === 'errores' && <ErroresTab />}
      {tab === 'incidencias' && <IncidenciasTab />}
    </div>
  );
}
