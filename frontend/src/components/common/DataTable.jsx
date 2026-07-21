import { useState, useMemo } from 'react';

export default function DataTable({ columns, data, onRowClick, sort, onSort }) {
  // Modo cliente: si el contenedor no controla el orden (no pasa onSort),
  // DataTable ordena localmente los datos ya cargados. Default: por id ascendente.
  const [localSort, setLocalSort] = useState({ by: 'id', dir: 'asc' });
  const serverMode = !!onSort;
  const effSort = serverMode ? sort : localSort;
  const effOnSort = serverMode ? onSort : (key) => setLocalSort((prev) => prev.by === key
    ? { by: key, dir: prev.dir === 'asc' ? 'desc' : 'asc' }
    : { by: key, dir: 'asc' });

  const sortedData = useMemo(() => {
    if (serverMode || !data || !effSort?.by) return data;
    const { by, dir } = effSort;
    const arr = [...data];
    arr.sort((ra, rb) => {
      const a = ra[by], b = rb[by];
      if (a == null && b == null) return 0;
      if (a == null) return 1;
      if (b == null) return -1;
      const r = (typeof a === 'number' && typeof b === 'number')
        ? a - b
        : String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' });
      return dir === 'desc' ? -r : r;
    });
    return arr;
  }, [data, serverMode, effSort]);

  data = sortedData;

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
        <div className="w-12 h-12 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-3">
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7m16 0v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-5m16 0h-4l-2 3H10l-2-3H4" />
          </svg>
        </div>
        <p className="text-sm text-gray-500">No hay datos para mostrar</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
      <table className="min-w-full text-left">
        <thead>
          <tr className="border-b border-gray-100">
            {columns.map((col) => {
              const sortKey = col.sortKey || col.key;
              const sortable = col.sortable !== false && col.key !== '_actions';
              const active = effSort && effSort.by === sortKey;
              return (
                <th
                  key={col.key}
                  onClick={sortable ? () => effOnSort(sortKey) : undefined}
                  className={`px-4 sm:px-6 py-3 bg-gray-50/70 text-xs font-semibold uppercase tracking-wider whitespace-nowrap first:rounded-tl-2xl last:rounded-tr-2xl ${active ? 'text-primary-600' : 'text-gray-500'} ${sortable ? 'cursor-pointer select-none hover:bg-gray-100' : ''}`}
                  title={sortable ? 'Ordenar por esta columna' : undefined}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    {sortable && (
                      <span className={`text-[10px] ${active ? 'text-primary-600' : 'text-gray-300'}`}>
                        {active ? (effSort.dir === 'desc' ? '▼' : '▲') : '↕'}
                      </span>
                    )}
                  </span>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {data.map((row, idx) => (
            <tr
              key={row.id || idx}
              onClick={() => onRowClick?.(row)}
              className={`transition-colors hover:bg-primary-50/40 ${onRowClick ? 'cursor-pointer' : ''}`}
            >
              {columns.map((col) => (
                <td key={col.key} className="px-4 sm:px-6 py-3 sm:py-3.5 whitespace-nowrap text-xs sm:text-sm text-gray-700">
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
