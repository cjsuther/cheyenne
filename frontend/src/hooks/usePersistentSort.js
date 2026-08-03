import { useState, useCallback } from 'react';

const PREFIX = 'grid-sort:';

// Primer campo ordenable de la grilla (ignora acciones y columnas no ordenables).
function firstSortableKey(columns) {
  const c = (columns || []).find(
    (col) => col && col.key && col.key !== '_actions' && col.sortable !== false,
  );
  return (c && (c.sortKey || c.key)) || 'id';
}

// Orden persistente por grilla.
// - Default: PRIMER campo en forma DESCENDENTE.
// - Si el usuario cambia el orden, se recuerda en localStorage y se reusa la próxima vez.
// `storageKey` identifica la grilla (ej. el queryKey de CrudTab, o un fingerprint de la pantalla).
// Si `storageKey` es null/undefined, no persiste (solo default).
export function usePersistentSort(storageKey, columns) {
  const [sort, setSortState] = useState(() => {
    try {
      const raw = storageKey ? localStorage.getItem(PREFIX + storageKey) : null;
      if (raw) {
        const s = JSON.parse(raw);
        if (s && s.by && s.dir) return s;
      }
    } catch { /* localStorage no disponible: ignorar */ }
    return { by: firstSortableKey(columns), dir: 'desc' };
  });

  const setSort = useCallback((next) => {
    setSortState((prev) => {
      const val = typeof next === 'function' ? next(prev) : next;
      try {
        if (storageKey) localStorage.setItem(PREFIX + storageKey, JSON.stringify(val));
      } catch { /* ignorar */ }
      return val;
    });
  }, [storageKey]);

  return [sort, setSort];
}
