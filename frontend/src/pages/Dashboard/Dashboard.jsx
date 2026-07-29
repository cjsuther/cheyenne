import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/auth';
import { SUPER_MODULES } from '../../config/superModules';

export default function Dashboard() {
  const user = useAuthStore((s) => s.user);
  const hasPermission = useAuthStore((s) => s.hasPermission);
  const canSee = (it) => !it.module || user?.superuser || hasPermission(it.module, 'read');

  const modulos = SUPER_MODULES
    .map((sm) => ({ ...sm, visibles: sm.items.filter(canSee) }))
    .filter((sm) => sm.visibles.length > 0);

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

      {/* Super-módulos */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Módulos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {modulos.map((sm) => {
            const destino = sm.visibles[0]?.path || '/';
            return (
              <Link
                key={sm.key}
                to={destino}
                className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-primary-200 transition-all p-5 flex flex-col"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-12 h-12 rounded-xl ${sm.chip} flex items-center justify-center`}>
                    <sm.Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-800 group-hover:text-primary-700 transition-colors">{sm.label}</h3>
                    <p className="text-xs text-gray-500">{sm.desc}</p>
                  </div>
                </div>
                <div className="mt-auto flex flex-wrap gap-1.5">
                  {sm.visibles.slice(0, 6).map((it) => (
                    <span key={it.path} className="text-[11px] bg-gray-50 text-gray-500 rounded px-2 py-0.5">{it.label}</span>
                  ))}
                  {sm.visibles.length > 6 && (
                    <span className="text-[11px] text-gray-400 px-1">+{sm.visibles.length - 6}</span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
