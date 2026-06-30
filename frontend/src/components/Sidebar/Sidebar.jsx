import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../store/auth';
import {
  IconDashboard, IconAdministracion, IconSeguridad, IconAuditoria,
  IconIngresos, IconTesoreria, IconEmisiones, IconComunicacion,
} from '../common/icons';

const menuItems = [
  { path: '/', label: 'Dashboard', Icon: IconDashboard },
  { path: '/administracion', label: 'Administración', module: 'administracion', Icon: IconAdministracion },
  { path: '/ingresos-publicos', label: 'Ingresos Públicos', module: 'ingresos_publicos', Icon: IconIngresos },
  { path: '/emisiones', label: 'Emisiones', module: 'emisiones', Icon: IconEmisiones },
  { path: '/tesoreria', label: 'Tesorería', module: 'tesoreria', Icon: IconTesoreria },
  { path: '/comunicacion', label: 'Comunicación', module: 'comunicacion', Icon: IconComunicacion },
  { path: '/auditoria', label: 'Auditoría', module: 'auditoria', Icon: IconAuditoria },
  { path: '/seguridad', label: 'Seguridad', module: 'seguridad', Icon: IconSeguridad },
];

export default function Sidebar({ onNavigate }) {
  const hasPermission = useAuthStore((s) => s.hasPermission);
  const user = useAuthStore((s) => s.user);

  const visibleItems = menuItems.filter((item) => {
    if (!item.module) return true;
    if (user?.superuser) return true;
    return hasPermission(item.module, 'read');
  });

  return (
    <aside className="w-64 h-full bg-gradient-to-b from-slate-900 to-slate-800 text-slate-100 flex flex-col">
      {/* Marca */}
      <div className="px-5 py-5 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-900/40">
            <IconIngresos className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight leading-none">Cheyenne</h2>
            <p className="text-[11px] text-slate-400 mt-1">Ingresos Públicos</p>
          </div>
        </div>
        {/* Cerrar - solo mobile */}
        <button onClick={onNavigate} className="lg:hidden p-1 text-slate-400 hover:text-white">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Navegación */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {visibleItems.map(({ path, label, Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            onClick={onNavigate}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-900/30'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-primary-300'}`}
                />
                <span className="truncate">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-5 py-3 border-t border-white/10 text-[11px] text-slate-500">
        v1.0 · {user?.codigo || 'usuario'}
      </div>
    </aside>
  );
}
