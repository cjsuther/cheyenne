import PageHeader from './PageHeader';

// Página informativa de un módulo cuyo backend existe pero aún no tiene UI operativa.
// Explica para qué sirve, qué capacidades expone y cómo se integra.
export default function ModuleInfoPage({ title, subtitle, descripcion, capacidades = [], endpoints = [], integra = [], nota }) {
  return (
    <div>
      <PageHeader title={title} subtitle={subtitle} />

      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">¿Qué hace este módulo?</h3>
        <p className="text-sm text-gray-600 leading-relaxed">{descripcion}</p>
      </div>

      {capacidades.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {capacidades.map((c) => (
            <div key={c.titulo} className="bg-white rounded-xl border border-gray-200 p-4">
              <h4 className="text-sm font-semibold text-gray-800 mb-1">{c.titulo}</h4>
              <p className="text-xs text-gray-500 leading-relaxed">{c.detalle}</p>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {integra.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Integración</h4>
            <ul className="space-y-1.5">
              {integra.map((i) => (
                <li key={i} className="text-sm text-gray-600 flex gap-2"><span className="text-primary-500">→</span>{i}</li>
              ))}
            </ul>
          </div>
        )}

        {endpoints.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">API disponible</h4>
            <ul className="space-y-1 font-mono text-xs text-gray-600">
              {endpoints.map((e) => (
                <li key={e} className="bg-gray-50 rounded px-2 py-1">{e}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {nota && (
        <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-800">
          {nota}
        </div>
      )}
    </div>
  );
}
