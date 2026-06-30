import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/auth';
import {
  IconAdministracion, IconSeguridad, IconAuditoria, IconIngresos,
  IconTesoreria, IconEmisiones, IconComunicacion, IconContribuyente360,
} from '../../components/common/icons';

const modules = [
  { name: 'Contribuyente 360', path: '/contribuyente-360', desc: 'Buscar contribuyente y ver su deuda', Icon: IconContribuyente360, chip: 'bg-indigo-50 text-indigo-600' },
  { name: 'Administración', path: '/administracion', desc: 'Personas, expedientes, entidades', Icon: IconAdministracion, chip: 'bg-blue-50 text-blue-600' },
  { name: 'Ingresos Públicos', path: '/ingresos-publicos', desc: 'Contribuyentes, cuentas, tributos', Icon: IconIngresos, chip: 'bg-emerald-50 text-emerald-600' },
  { name: 'Emisiones', path: '/emisiones', desc: 'Cálculo y emisión de tasas', Icon: IconEmisiones, chip: 'bg-amber-50 text-amber-600' },
  { name: 'Tesorería', path: '/tesoreria', desc: 'Cajas, recaudación, recibos', Icon: IconTesoreria, chip: 'bg-violet-50 text-violet-600' },
  { name: 'Comunicación', path: '/comunicacion', desc: 'Mensajes y notificaciones', Icon: IconComunicacion, chip: 'bg-pink-50 text-pink-600' },
  { name: 'Auditoría', path: '/auditoria', desc: 'Incidencias y registros', Icon: IconAuditoria, chip: 'bg-yellow-50 text-yellow-700' },
  { name: 'Seguridad', path: '/seguridad', desc: 'Usuarios, perfiles, permisos', Icon: IconSeguridad, chip: 'bg-red-50 text-red-600' },
];

export default function Dashboard() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="space-y-6">
      {/* Banner de bienvenida */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 to-primary-800 px-6 py-7 text-white shadow-lg">
        <p className="text-sm text-primary-200">Panel principal</p>
        <h1 className="text-2xl font-bold mt-1">
          Bienvenido, {user?.nombre_apellido || user?.codigo}
        </h1>
        <p className="text-sm text-slate-300 mt-2">
          Sistema de finanzas y administración pública · Cheyenne
        </p>
      </div>

      {/* Accesos a módulos */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Módulos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {modules.map(({ name, path, desc, Icon, chip }) => (
            <Link
              key={path}
              to={path}
              className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all p-5 flex flex-col"
            >
              <div className={`w-11 h-11 rounded-xl ${chip} flex items-center justify-center mb-4`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-gray-800 group-hover:text-primary-700 transition-colors">{name}</h3>
              <p className="text-sm text-gray-500 mt-1 flex-1">{desc}</p>
              <span className="text-xs font-medium text-primary-600 mt-3 inline-flex items-center gap-1">
                Abrir
                <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
