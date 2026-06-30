import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Solapa activa de una página, abrible por URL (?tab=clave). Lo usa el buscador del menú
// para saltar directo a una solapa, incluso estando ya en la misma página.
export function useTabParam(defaultTab) {
  const location = useLocation();
  const [tab, setTab] = useState(
    () => new URLSearchParams(location.search).get('tab') || defaultTab
  );
  useEffect(() => {
    const t = new URLSearchParams(location.search).get('tab');
    if (t) setTab(t);
  }, [location.search]);
  return [tab, setTab];
}
