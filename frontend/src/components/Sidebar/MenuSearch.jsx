import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth';
import { searchableDestinations, filterDestinations } from '../../config/navigation';

export default function MenuSearch({ onNavigate }) {
  const navigate = useNavigate();
  const hasPermission = useAuthStore((s) => s.hasPermission);
  const user = useAuthStore((s) => s.user);
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);

  // solo destinos a los que el usuario tiene permiso (módulo con read, o superuser)
  const all = useMemo(
    () => searchableDestinations((mod) => user?.superuser || hasPermission(mod, 'read')),
    [user, hasPermission]
  );
  const results = useMemo(() => filterDestinations(all, q), [all, q]);

  const go = (dest) => {
    if (!dest) return;
    navigate(dest.path);
    setQ('');
    setActive(0);
    onNavigate?.();
  };

  const onKey = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === 'Enter') { e.preventDefault(); go(results[active]); }
    else if (e.key === 'Escape') { setQ(''); setActive(0); }
  };

  return (
    <div className="px-3 pt-4 pb-1 relative">
      <div className="relative">
        <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="7" /><path strokeLinecap="round" d="m21 21-4.3-4.3" />
        </svg>
        <input
          value={q}
          onChange={(e) => { setQ(e.target.value); setActive(0); }}
          onKeyDown={onKey}
          placeholder="Buscar sección..."
          className="w-full bg-white/5 border border-white/10 text-slate-100 placeholder-slate-400 text-sm rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      {q && (
        <div className="absolute left-3 right-3 mt-1 bg-slate-800 border border-white/10 rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto">
          {results.length === 0 ? (
            <div className="px-3 py-3 text-xs text-slate-400">Sin resultados</div>
          ) : (
            results.map((r, i) => (
              <button
                key={r.key}
                onMouseEnter={() => setActive(i)}
                onClick={() => go(r)}
                className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 ${
                  i === active ? 'bg-primary-600 text-white' : 'text-slate-200 hover:bg-white/5'
                }`}
              >
                <span className="truncate">{r.label}</span>
                {r.context && (
                  <span className={`ml-auto text-[10px] shrink-0 ${i === active ? 'text-primary-100' : 'text-slate-400'}`}>{r.context}</span>
                )}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
