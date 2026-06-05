import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../store/auth';

const menuItems = [
  { path: '/', label: 'Dashboard', icon: 'D' },
  { path: '/administracion', label: 'Administracion', module: 'administracion', icon: 'A' },
  { path: '/seguridad', label: 'Seguridad', module: 'seguridad', icon: 'S' },
  { path: '/auditoria', label: 'Auditoria', module: 'auditoria', icon: 'Au' },
  { path: '/ingresos-publicos', label: 'Ingresos Publicos', module: 'ingresos_publicos', icon: 'IP' },
  { path: '/tesoreria', label: 'Tesoreria', module: 'tesoreria', icon: 'T' },
  { path: '/emisiones', label: 'Emisiones', module: 'emisiones', icon: 'E' },
  { path: '/contaduria', label: 'Contaduria', module: 'contaduria', icon: 'C' },
  { path: '/comunicacion', label: 'Comunicacion', module: 'comunicacion', icon: 'Co' },
  { path: '/wav', label: 'WAV', module: 'wav', icon: 'W' },
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
    <aside className="w-64 h-full bg-gray-900 text-white flex flex-col">
      <div className="px-4 sm:px-6 py-4 border-b border-gray-700 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-wide">Cheyenne</h2>
          <p className="text-xs text-gray-400 mt-1">Sistema de Administracion</p>
        </div>
        {/* Close button - mobile only */}
        <button onClick={onNavigate} className="lg:hidden p-1 text-gray-400 hover:text-white">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <nav className="flex-1 py-4 overflow-y-auto">
        {visibleItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 sm:px-6 py-3 text-sm transition-colors ${
                isActive
                  ? 'bg-primary-700 text-white border-r-4 border-primary-400'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            <span className="w-8 h-8 rounded-lg bg-gray-700 flex items-center justify-center text-xs font-bold shrink-0">
              {item.icon}
            </span>
            <span className="truncate">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
