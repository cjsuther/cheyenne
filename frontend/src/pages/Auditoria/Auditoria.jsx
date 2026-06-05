import { useQuery } from '@tanstack/react-query';
import { auditoriaAPI } from '../../services/api';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'origen', label: 'Origen' },
  { key: 'mensaje', label: 'Mensaje' },
  { key: 'id_nivel_criticidad', label: 'Criticidad' },
  { key: 'fecha', label: 'Fecha', render: (v) => v ? new Date(v).toLocaleString() : '' },
];

export default function Auditoria() {
  const { data, isLoading } = useQuery({
    queryKey: ['incidencias'],
    queryFn: () => auditoriaAPI.incidencias.list({ skip: 0, limit: 100 }).then((r) => r.data),
  });

  return (
    <div>
      <PageHeader title="Auditoria" subtitle="Registro de incidencias del sistema" />
      {isLoading ? <LoadingSpinner /> : <DataTable columns={columns} data={data} />}
    </div>
  );
}
