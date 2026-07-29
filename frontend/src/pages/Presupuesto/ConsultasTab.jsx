import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { presupuestoAPI } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const fmt = (v) => new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(v || 0));

const DIMENSIONES = [
  { key: 'jurisdiccion', label: 'Jurisdicción' },
  { key: 'objeto', label: 'Objeto del gasto' },
  { key: 'fuente', label: 'Fuente' },
  { key: 'programa', label: 'Programa (estructura)' },
];
const METRICAS = [
  { key: 'vigente', label: 'Vigente' },
  { key: 'ejecutado', label: 'Ejecutado (devengado)' },
  { key: 'comprometido', label: 'Comprometido' },
  { key: 'preventivo', label: 'Preventivo' },
  { key: 'disponible', label: 'Disponible' },
];

function FilaCrosstab({ fila, nivel, total }) {
  const [abierto, setAbierto] = useState(nivel === 0);
  const tieneHijos = fila.hijos?.length > 0;
  const pct = total ? (fila.valor / total) * 100 : 0;
  return (
    <>
      <tr className="border-b border-gray-50 hover:bg-gray-50">
        <td className="py-1.5 pr-2" style={{ paddingLeft: nivel * 20 + 8 }}>
          <div className="flex items-center gap-1.5">
            {tieneHijos ? (
              <button onClick={() => setAbierto(!abierto)} className="w-4 h-4 rounded bg-gray-100 text-gray-600 text-[10px] leading-none">{abierto ? '−' : '+'}</button>
            ) : <span className="w-4 h-4 inline-block" />}
            <span className="text-[9px] text-gray-400 uppercase">{fila.dimension}</span>
            <span className="text-gray-800">{fila.clave}</span>
          </div>
        </td>
        <td className="py-1.5 pr-2 text-right font-medium">{fmt(fila.valor)}</td>
        <td className="py-1.5 pr-2 text-right text-gray-400 w-24">
          <div className="flex items-center gap-1 justify-end">
            <div className="w-14 bg-gray-100 rounded h-1.5"><div className="bg-primary-500 h-1.5 rounded" style={{ width: `${Math.min(pct, 100)}%` }} /></div>
            <span>{pct.toFixed(1)}%</span>
          </div>
        </td>
      </tr>
      {abierto && tieneHijos && fila.hijos.map((h, i) => (
        <FilaCrosstab key={`${h.dimension}-${h.clave}-${i}`} fila={h} nivel={nivel + 1} total={total} />
      ))}
    </>
  );
}

export default function ConsultasTab() {
  const [anio, setAnio] = useState(null);
  const [dims, setDims] = useState(['jurisdiccion', 'objeto']);
  const [metrica, setMetrica] = useState('vigente');

  const { data: ejercicios } = useQuery({
    queryKey: ['presu-ejercicios'],
    queryFn: () => presupuestoAPI.ejercicios.list({ limit: 50 }).then((r) => r.data),
  });
  const anioSel = anio ?? ejercicios?.find((e) => e.estado === 'vigente')?.anio ?? ejercicios?.[0]?.anio ?? null;

  const dimsValidas = dims.filter(Boolean);
  const { data, isLoading } = useQuery({
    queryKey: ['presu-crosstab', anioSel, dimsValidas.join(','), metrica],
    queryFn: () => presupuestoAPI.crosstab({ anio: anioSel, dims: dimsValidas.join(','), metrica }).then((r) => r.data),
    enabled: !!anioSel && dimsValidas.length >= 2 && dimsValidas.length <= 3,
  });

  const setDim = (idx, val) => {
    const next = [...dims];
    if (val === '') next.splice(idx, 1);
    else next[idx] = val;
    setDims(next);
  };
  const addDim = () => {
    const usadas = new Set(dims);
    const libre = DIMENSIONES.find((d) => !usadas.has(d.key));
    if (libre && dims.length < 3) setDims([...dims, libre.key]);
  };

  if (!ejercicios) return <LoadingSpinner />;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        <select className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm" value={anioSel || ''} onChange={(e) => setAnio(Number(e.target.value))}>
          {ejercicios.map((e) => <option key={e.anio} value={e.anio}>{e.anio} — {e.estado}</option>)}
        </select>
        <select className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm" value={metrica} onChange={(e) => setMetrica(e.target.value)}>
          {METRICAS.map((m) => <option key={m.key} value={m.key}>{m.label}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-3 flex items-center gap-2 flex-wrap">
        <span className="text-xs text-gray-500 font-medium">Dimensiones (2 a 3):</span>
        {dims.map((d, idx) => (
          <select key={idx} className="border border-gray-300 rounded-lg px-2 py-1 text-xs" value={d} onChange={(e) => setDim(idx, e.target.value)}>
            {DIMENSIONES.map((opt) => (
              <option key={opt.key} value={opt.key} disabled={dims.includes(opt.key) && opt.key !== d}>{opt.label}</option>
            ))}
            {dims.length > 2 && <option value="">— quitar —</option>}
          </select>
        ))}
        {dims.length < 3 && (
          <button onClick={addDim} className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200">+ dimensión</button>
        )}
      </div>

      {dimsValidas.length < 2 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">Elegí al menos 2 dimensiones.</div>
      ) : isLoading ? <LoadingSpinner /> : data && (
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-gray-700">
              Crosstab — {data.dims.join(' › ')} · métrica: {METRICAS.find((m) => m.key === data.metrica)?.label}
            </h4>
            <span className="text-xs text-gray-500">Total: <b>{fmt(data.total_general)}</b></span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="py-1.5 pr-2">Dimensiones (drill-down)</th>
                  <th className="py-1.5 pr-2 text-right">{METRICAS.find((m) => m.key === data.metrica)?.label}</th>
                  <th className="py-1.5 pr-2 text-right">% del total</th>
                </tr>
              </thead>
              <tbody>
                {data.filas.map((f, i) => (
                  <FilaCrosstab key={`${f.dimension}-${f.clave}-${i}`} fila={f} nivel={0} total={data.total_general} />
                ))}
                {!data.filas.length && <tr><td colSpan={3} className="py-4 text-center text-gray-400">Sin datos para el ejercicio.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
