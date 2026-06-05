import { useQuery } from '@tanstack/react-query';
import { comunicacionAPI } from '../../services/api';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'titulo', label: 'Titulo' },
  { key: 'identificador', label: 'Identificador' },
  { key: 'id_estado_mensaje', label: 'Estado' },
  { key: 'fecha_creacion', label: 'Fecha', render: (v) => v ? new Date(v).toLocaleString() : '' },
];

export default function Comunicacion() {
  const { data, isLoading } = useQuery({
    queryKey: ['mensajes'],
    queryFn: () => comunicacionAPI.mensajes.list({ skip: 0, limit: 100 }).then((r) => r.data),
  });

  return (
    <div>
      <PageHeader title="Comunicacion" subtitle="Mensajes y notificaciones del sistema" />
      {isLoading ? <LoadingSpinner /> : <DataTable columns={columns} data={data} />}
    </div>
  );
}
