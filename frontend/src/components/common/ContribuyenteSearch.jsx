import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ingresosPublicosAPI } from '../../services/api';
import { inputClass } from './CrudComponents';

// Buscador de UN contribuyente (single-select), reutilizable en todo el sistema.
// Usa el endpoint contribuyentes.search (nombre/apellido/documento).
// Props: seleccionado ({id, nombre_completo, numero_documento} | null), onSelect(contribuyente|null), placeholder.
export default function ContribuyenteSearch({ seleccionado, onSelect, placeholder }) {
  const [q, setQ] = useState('');
  const [abierto, setAbierto] = useState(false);
  const { data: resultados, isFetching } = useQuery({
    queryKey: ['contrib-search', q],
    queryFn: () => ingresosPublicosAPI.contribuyentes.search(q).then((r) => r.data),
    enabled: q.trim().length >= 2,
    staleTime: 60000,
  });

  if (seleccionado) {
    return (
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center bg-primary-50 text-primary-700 border border-primary-200 rounded-lg px-3 py-2 text-sm min-w-0">
          <span className="truncate">#{seleccionado.id} · {seleccionado.nombre_completo || seleccionado.numero_documento}
            {seleccionado.numero_documento ? <span className="text-primary-400"> · Doc {seleccionado.numero_documento}</span> : null}</span>
        </span>
        <button type="button" onClick={() => onSelect(null)} className="text-xs text-gray-500 hover:text-gray-700 underline shrink-0">Cambiar</button>
      </div>
    );
  }

  return (
    <div className="relative">
      <input type="text" value={q} onChange={(e) => { setQ(e.target.value); setAbierto(true); }} onFocus={() => setAbierto(true)}
        placeholder={placeholder || 'Buscar por nombre, apellido o documento (mín. 2)…'} className={inputClass} />
      {abierto && q.trim().length >= 2 && (
        <div className="absolute z-30 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-56 overflow-y-auto divide-y divide-gray-50">
          {isFetching && <p className="px-3 py-2 text-xs text-gray-400">Buscando…</p>}
          {!isFetching && resultados?.length === 0 && <p className="px-3 py-2 text-xs text-gray-400">Sin resultados</p>}
          {resultados?.map((c) => (
            <button type="button" key={c.id} onClick={() => { onSelect(c); setQ(''); setAbierto(false); }}
              className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50">
              #{c.id} · {c.nombre_completo} <span className="text-gray-400">· {c.numero_documento}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
