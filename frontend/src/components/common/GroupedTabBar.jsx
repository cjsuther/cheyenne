// Barra de solapas en dos niveles: grupos (arriba) y, dentro del grupo activo, sus solapas.
// grupos: [{ label, keys: ['tab1','tab2'] }]   ·   tabsMeta: [{ key, label }]
export default function GroupedTabBar({ grupos, tabsMeta, tab, setTab }) {
  const label = (key) => tabsMeta.find((t) => t.key === key)?.label || key;
  const grupoActual = grupos.find((g) => g.keys.includes(tab)) || grupos[0];

  return (
    <div className="mb-4 space-y-2">
      <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
        {grupos.map((g) => {
          const activo = g === grupoActual;
          return (
            <button
              key={g.label}
              onClick={() => { if (!g.keys.includes(tab)) setTab(g.keys[0]); }}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold whitespace-nowrap shrink-0 transition-colors ${
                activo ? 'bg-slate-800 text-white shadow-sm' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {g.label}
            </button>
          );
        })}
      </div>
      <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
        {grupoActual.keys.map((key) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
              tab === key ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {label(key)}
          </button>
        ))}
      </div>
    </div>
  );
}
