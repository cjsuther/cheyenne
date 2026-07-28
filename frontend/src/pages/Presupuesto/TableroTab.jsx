import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { presupuestoAPI } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const fmt = (v) => new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(v || 0));

export default function TableroTab() {
  const [anio, setAnio] = useState(null);
  const [por, setPor] = useState('inciso');

  const { data: ejercicios } = useQuery({
    queryKey: ['presu-ejercicios'],
    queryFn: () => presupuestoAPI.ejercicios.list({ limit: 50 }).then((r) => r.data),
  });
  const anioSel = anio ?? ejercicios?.find((e) => e.estado === 'vigente')?.anio ?? ejercicios?.[0]?.anio ?? null;

  const { data, isLoading } = useQuery({
    queryKey: ['presu-resumen', anioSel, por],
    queryFn: () => presupuestoAPI.resumen({ anio: anioSel, por }).then((r) => r.data),
    enabled: !!anioSel,
  });

  if (!ejercicios) return <LoadingSpinner />;
  const t = data?.totales || {};
  const maxV = Math.max(...(data?.apertura?.filas || []).map((f) => f.vigente), 1);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        <select className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm" value={anioSel || ''} onChange={(e) => setAnio(Number(e.target.value))}>
          {ejercicios.map((e) => <option key={e.anio} value={e.anio}>{e.anio} — {e.estado}</option>)}
        </select>
        <div className="flex gap-1 ml-auto">
          {[['inciso', 'Por inciso'], ['jurisdiccion', 'Por jurisdicción'], ['fuente', 'Por fuente']].map(([v, l]) => (
            <button key={v} onClick={() => setPor(v)}
              className={`px-3 py-1 rounded text-xs font-medium ${por === v ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600'}`}>{l}</button>
          ))}
        </div>
      </div>

      {isLoading ? <LoadingSpinner /> : data && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[['Vigente', t.vigente, 'text-gray-800'], ['Preventivo', t.preventivo, 'text-purple-700'],
              ['Comprometido', t.comprometido, 'text-indigo-700'], ['Devengado', t.devengado, 'text-orange-700'],
              ['Pagado', t.pagado, 'text-green-700'], ['Disponible', t.disponible, Number(t.disponible) < 0 ? 'text-red-600' : 'text-green-700']].map(([l, v, c]) => (
              <div key={l} className="bg-white rounded-xl border border-gray-200 p-3 text-center">
                <p className="text-[10px] text-gray-500 uppercase">{l}</p>
                <p className={`text-sm font-bold ${c}`}>{fmt(v)}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-gray-700">Ejecución del gasto ({data.cantidad_partidas} partidas)</h4>
              <span className="text-xs text-gray-500">{data.porcentaje_ejecucion}% devengado</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
              <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${Math.min(data.porcentaje_ejecucion, 100)}%` }} />
            </div>
            <div className="space-y-2">
              {data.apertura.filas.map((f) => (
                <div key={f.clave}>
                  <div className="flex justify-between text-xs mb-0.5">
                    <span className="text-gray-700 truncate">{f.clave}</span>
                    <span className="text-gray-500">{fmt(f.vigente)} · disp. {fmt(f.disponible)}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded h-3 relative overflow-hidden">
                    <div className="bg-primary-200 h-3 absolute" style={{ width: `${(f.vigente / maxV) * 100}%` }} />
                    <div className="bg-indigo-500 h-3 absolute" style={{ width: `${(f.comprometido / maxV) * 100}%` }} />
                    <div className="bg-orange-500 h-3 absolute" style={{ width: `${(f.devengado / maxV) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-gray-400 mt-2">■ vigente <span className="text-indigo-500">■ comprometido</span> <span className="text-orange-500">■ devengado</span></p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Recursos vs. Gastos</h4>
              <div className="text-sm space-y-1">
                <p className="flex justify-between"><span className="text-gray-500">Recursos vigentes</span><b>{fmt(data.recursos.vigente)}</b></p>
                <p className="flex justify-between"><span className="text-gray-500">Percibido</span><b className="text-green-700">{fmt(data.recursos.percibido)}</b></p>
                <p className="flex justify-between"><span className="text-gray-500">Gastos vigentes</span><b>{fmt(t.vigente)}</b></p>
                <p className="flex justify-between border-t pt-1"><span className="text-gray-500">Equilibrio</span>
                  <b className={data.equilibrio < 0 ? 'text-red-600' : 'text-green-700'}>{fmt(data.equilibrio)}</b></p>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Últimas modificaciones</h4>
              {data.ultimas_modificaciones.length ? data.ultimas_modificaciones.map((m) => (
                <p key={m.id} className="text-xs text-gray-600 py-0.5">
                  {m.numero ? `MOD-${anioSel}-${String(m.numero).padStart(4, '0')}` : 'Borrador'} · <span className="capitalize">{m.tipo}</span> · {m.acto_administrativo} · <span className="text-gray-400">{m.estado}</span>
                </p>
              )) : <p className="text-xs text-gray-400">Sin modificaciones.</p>}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
