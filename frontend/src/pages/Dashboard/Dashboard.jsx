import { useAuthStore } from '../../store/auth';
import PageHeader from '../../components/common/PageHeader';

const modules = [
  { name: 'Administracion', path: '/administracion', color: 'bg-blue-500', desc: 'Personas, expedientes, entidades' },
  { name: 'Seguridad', path: '/seguridad', color: 'bg-red-500', desc: 'Usuarios, perfiles, permisos' },
  { name: 'Auditoria', path: '/auditoria', color: 'bg-yellow-500', desc: 'Incidencias y registros' },
  { name: 'Ingresos Publicos', path: '/ingresos-publicos', color: 'bg-green-500', desc: 'Contribuyentes, cuentas, emisiones' },
  { name: 'Tesoreria', path: '/tesoreria', color: 'bg-purple-500', desc: 'Cajas, recaudacion, contabilidad' },
  { name: 'Contaduria', path: '/contaduria', color: 'bg-indigo-500', desc: 'Registros contables' },
  { name: 'Comunicacion', path: '/comunicacion', color: 'bg-pink-500', desc: 'Mensajes y notificaciones' },
  { name: 'WAV', path: '/wav', color: 'bg-teal-500', desc: 'Portal ciudadano, declaraciones' },
];

export default function Dashboard() {
  const user = useAuthStore((s) => s.user);

  return (
    <div>
      <PageHeader
        title={`Bienvenido, ${user?.nombre_apellido || user?.codigo}`}
        subtitle="Panel principal del sistema Cheyenne"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {modules.map((mod) => (
          <a
            key={mod.path}
            href={mod.path}
            className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6"
          >
            <div className={`w-10 h-10 ${mod.color} rounded-lg mb-3`} />
            <h3 className="font-semibold text-gray-800">{mod.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{mod.desc}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
