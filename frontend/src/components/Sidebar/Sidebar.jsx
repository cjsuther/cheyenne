import { NavLink, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/auth';
import MenuSearch from './MenuSearch';
import { IconMunicipio } from '../common/icons';
import { SUPER_MODULES, superModuleForPath } from '../../config/superModules';

export default function Sidebar({ onNavigate }) {
  const hasPermission = useAuthStore((s) => s.hasPermission);
  const user = useAuthStore((s) => s.user);
  const { pathname } = useLocation();

  const canSee = (it) => !it.module || user?.superuser || hasPermission(it.module, 'read');
  const actual = superModuleForPath(pathname);

  const itemClass = ({ isActive }) =>
    `group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
      isActive ? 'bg-primary-600 text-white shadow-md shadow-primary-900/30' : 'text-slate-300 hover:bg-white/5 hover:text-white'
    }`;

  return (
    <aside className="w-64 h-full bg-gradient-to-b from-slate-900 to-slate-800 text-slate-100 flex flex-col">
      {/* Marca */}
      <div className="px-5 py-5 border-b border-white/10 flex items-center justify-between">
        <Link to="/" onClick={onNavigate} className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-900/40">
            <IconMunicipio className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight leading-none">Cheyenne</h2>
            <p className="text-[11px] text-slate-400 mt-1">{actual ? actual.label : 'Ingresos Públicos'}</p>
          </div>
        </Link>
        <button onClick={onNavigate} className="lg:hidden p-1 text-slate-400 hover:text-white">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <MenuSearch onNavigate={onNavigate} />

      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {actual ? (
          <>
            {/* Volver al dashboard */}
            <Link to="/" onClick={onNavigate}
              className="flex items-center gap-2 px-3 py-2 mb-1 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
              Módulos
            </Link>
            <p className="px-3 pt-1 pb-2 text-[11px] uppercase tracking-wide text-slate-500">{actual.label}</p>
            {actual.items.filter(canSee).map(({ path, label }) => (
              <NavLink key={path} to={path} onClick={onNavigate} className={itemClass}>
                <span className="truncate">{label}</span>
              </NavLink>
            ))}
          </>
        ) : (
          <>
            <p className="px-3 pb-2 text-[11px] uppercase tracking-wide text-slate-500">Módulos</p>
            {SUPER_MODULES.filter((sm) => sm.items.some(canSee)).map((sm) => {
              const destino = sm.items.filter(canSee)[0]?.path || '/';
              return (
                <NavLink key={sm.key} to={destino} onClick={onNavigate} className={itemClass}>
                  {({ isActive }) => (
                    <>
                      <sm.Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-primary-300'}`} />
                      <span className="truncate">{sm.label}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </>
        )}
      </nav>

      <div className="px-5 py-3 border-t border-white/10 text-[11px] text-slate-500">
        v1.0 · {user?.codigo || 'usuario'}
      </div>
    </aside>
  );
}
