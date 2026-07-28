import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { presupuestoAPI } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { btnPrimary } from '../../components/common/CrudComponents';

const fmt = (v) => new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(v || 0));

export default function CuotasTab() {
  const qc = useQueryClient();
  const [anio, setAnio] = useState(null);
  const [dim, setDim] = useState('jurisdiccion');
  const [filas, setFilas] = useState([]);
  const [msg, setMsg] = useState('');

  const { data: ejercicios } = useQuery({
    queryKey: ['presu-ejercicios'],
    queryFn: () => presupuestoAPI.ejercicios.list({ limit: 50 }).then((r) => r.data),
  });
  const anioSel = anio ?? ejercicios?.find((e) => e.estado === 'vigente')?.anio ?? ejercicios?.[0]?.anio ?? null;

  const { data, isLoading } = useQuery({
    queryKey: ['presu-cuotas', anioSel, dim],
    queryFn: () => presupuestoAPI.cuotas.list({ anio: anioSel, dimension_tipo: dim }).then((r) => r.data),
    enabled: !!anioSel,
  });

  useEffect(() => { if (data?.filas) setFilas(data.filas.map((f) => ({ ...f }))); }, [data]);

  const setVal = (i, k, v) => setFilas((prev) => prev.map((f, x) => (x === i ? { ...f, [k]: v } : f)));

  const guardar = useMutation({
    mutationFn: () => presupuestoAPI.cuotas.bulk({
      anio: anioSel, dimension_tipo: dim,
      filas: filas.map((f) => ({ dimension_ref: f.dimension_ref, t1: Number(f.t1 || 0), t2: Number(f.t2 || 0), t3: Number(f.t3 || 0), t4: Number(f.t4 || 0) })),
    }),
    onSuccess: () => { setMsg('Cuotas guardadas ✓'); qc.invalidateQueries({ queryKey: ['presu-cuotas', anioSel, dim] }); },
    onError: (e) => setMsg(e.response?.data?.detail || 'Error al guardar'),
  });

  if (!ejercicios) return <LoadingSpinner />;

  return (
    <div>
      <div className="mb-3 flex items-center gap-2 flex-wrap">
        <select className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm" value={anioSel || ''} onChange={(e) => setAnio(Number(e.target.value))}>
          {ejercicios.map((e) => <option key={e.anio} value={e.anio}>{e.anio} — {e.estado}</option>)}
        </select>
        <div className="flex gap-1">
          {[['jurisdiccion', 'Por jurisdicción'], ['fuente', 'Por fuente'], ['inciso', 'Por inciso']].map(([v, l]) => (
            <button key={v} onClick={() => setDim(v)} className={`px-3 py-1 rounded text-xs font-medium ${dim === v ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600'}`}>{l}</button>
          ))}
        </div>
        <span className="text-xs text-gray-400">Trimestre actual: T{data?.trimestre_actual}</span>
        <span className="ml-auto flex items-center gap-2">
          {msg && <span className="text-xs text-gray-500">{msg}</span>}
          <button className={btnPrimary} onClick={() => guardar.mutate()} disabled={guardar.isPending || !filas.length}>
            {guardar.isPending ? 'Guardando...' : 'Guardar cuotas'}
          </button>
        </span>
      </div>
      <p className="text-xs text-gray-400 mb-2">Tope acumulado de compromisos por trimestre. Sin cuota definida para un ámbito = sin restricción. Se valida al registrar compromisos (bloquear/advertir según el ejercicio).</p>

      {isLoading ? <LoadingSpinner /> : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
          <table className="min-w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/70 text-gray-500 uppercase tracking-wide">
                {['Ámbito', 'T1', 'T2', 'T3', 'T4', 'Autorizado acum.', 'Comprometido', 'Margen'].map((h) => (
                  <th key={h} className="px-3 py-2.5 whitespace-nowrap font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filas.length ? filas.map((f, i) => {
                const acum = [f.t1, f.t2, f.t3, f.t4].slice(0, data?.trimestre_actual || 4).reduce((s, v) => s + Number(v || 0), 0);
                const margen = acum - Number(f.comprometido || 0);
                return (
                  <tr key={f.dimension_ref} className="hover:bg-primary-50/40">
                    <td className="px-3 py-2 whitespace-nowrap">{f.etiqueta}</td>
                    {['t1', 't2', 't3', 't4'].map((k) => (
                      <td key={k} className="px-2 py-1">
                        <input type="number" className="w-28 border border-gray-200 rounded px-2 py-1 text-xs text-right"
                          value={f[k]} onChange={(e) => setVal(i, k, e.target.value)} />
                      </td>
                    ))}
                    <td className="px-3 py-2 text-right font-medium">{fmt(acum)}</td>
                    <td className="px-3 py-2 text-right">{fmt(f.comprometido)}</td>
                    <td className={`px-3 py-2 text-right font-bold ${margen < 0 ? 'text-red-600' : 'text-green-700'}`}>{fmt(margen)}</td>
                  </tr>
                );
              }) : (
                <tr><td colSpan={8} className="px-3 py-8 text-center text-gray-400">Sin partidas en {anioSel} para definir cuotas.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
