import { useQuery } from '@tanstack/react-query';
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

function EventosTab() {
  const { data, isLoading } = useQuery({
    queryKey: ['auditoria-eventos'],
    queryFn: () => auditoriaAPI.eventos.list({ skip: 0, limit: 100 }).then((r) => r.data),
    refetchInterval: 15000,
  });
  return isLoading ? <LoadingSpinner /> : <DataTable columns={eventosCols} data={data} />;
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
