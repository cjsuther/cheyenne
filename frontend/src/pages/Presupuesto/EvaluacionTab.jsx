import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { presupuestoAPI } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const fmt = (v) => new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(v || 0));

const SEM = {
  verde: { c: 'bg-green-500', t: 'text-green-700', b: 'bg-green-100' },
  amarillo: { c: 'bg-amber-400', t: 'text-amber-700', b: 'bg-amber-100' },
  rojo: { c: 'bg-red-500', t: 'text-red-700', b: 'bg-red-100' },
};

function Semaforo({ estado }) {
  const s = SEM[estado] || SEM.rojo;
  return <span className={`inline-block w-3 h-3 rounded-full ${s.c}`} title={estado} />;
}

function Pct({ valor, semaforo }) {
  const s = SEM[semaforo] || SEM.rojo;
  return <span className={`px-2 py-0.5 rounded text-xs font-semibold ${s.b} ${s.t}`}>{valor}%</span>;
}

export default function EvaluacionTab() {
  const [anio, setAnio] = useState(null);
  const [trimestre, setTrimestre] = useState('');

  const { data: ejercicios } = useQuery({
    queryKey: ['presu-ejercicios'],
    queryFn: () => presupuestoAPI.ejercicios.list({ limit: 50 }).then((r) => r.data),
  });
  const anioSel = anio ?? ejercicios?.find((e) => e.estado === 'vigente')?.anio ?? ejercicios?.[0]?.anio ?? null;

  const { data, isLoading } = useQuery({
    queryKey: ['presu-evaluacion', anioSel, trimestre],
    queryFn: () => presupuestoAPI.evaluacion({ anio: anioSel, ...(trimestre ? { trimestre: Number(trimestre) } : {}) }).then((r) => r.data),
    enabled: !!anioSel,
  });

  if (!ejercicios) return <LoadingSpinner />;
  const t = data?.totales;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        <select className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm" value={anioSel || ''} onChange={(e) => setAnio(Number(e.target.value))}>
          {ejercicios.map((e) => <option key={e.anio} value={e.anio}>{e.anio} — {e.estado}</option>)}
        </select>
        <select className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm" value={trimestre} onChange={(e) => setTrimestre(e.target.value)}>
          <option value="">Trimestre actual</option>
          {[1, 2, 3, 4].map((q) => <option key={q} value={q}>Corte T{q}</option>)}
        </select>
        {data && <span className="text-xs text-gray-500 ml-auto">Corte T{data.trimestre} · umbral verde ≥ {data.umbrales.verde}% · amarillo ≥ {data.umbrales.amarillo}%</span>}
      </div>

      {isLoading ? <LoadingSpinner /> : data && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[['Vigente', t.vigente, 'text-gray-800'], ['Programado', t.programado, 'text-blue-700'],
              ['Comprometido', t.comprometido, 'text-indigo-700'], ['Devengado', t.devengado, 'text-orange-700']].map(([l, v, c]) => (
              <div key={l} className="bg-white rounded-xl border border-gray-200 p-3 text-center">
                <p className="text-[10px] text-gray-500 uppercase">{l}</p>
                <p className={`text-sm font-bold ${c}`}>{fmt(v)}</p>
              </div>
            ))}
            <div className="bg-white rounded-xl border border-gray-200 p-3 text-center">
              <p className="text-[10px] text-gray-500 uppercase">Ejec. s/ vigente</p>
              <p className="text-sm font-bold text-gray-800">{t.porcentaje_ejecucion}%</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-3 text-center flex flex-col items-center justify-center gap-1">
              <p className="text-[10px] text-gray-500 uppercase">Ejec. s/ programado</p>
              <div className="flex items-center gap-2"><Semaforo estado={t.semaforo} /><span className="text-sm font-bold text-gray-800">{t.porcentaje_vs_programado}%</span></div>
            </div>
          </div>

          {/* Desvío financiero por jurisdicción */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Desvío financiero por jurisdicción</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-left text-gray-500 border-b">
                    <th className="py-1.5 pr-2"></th>
                    <th className="py-1.5 pr-2">Jurisdicción</th>
                    <th className="py-1.5 pr-2 text-right">Vigente</th>
                    <th className="py-1.5 pr-2 text-right">Programado</th>
                    <th className="py-1.5 pr-2 text-right">Devengado</th>
                    <th className="py-1.5 pr-2 text-right">% s/vig</th>
                    <th className="py-1.5 pr-2 text-right">% s/prog</th>
                    <th className="py-1.5 pr-2 text-right">Desvío</th>
                  </tr>
                </thead>
                <tbody>
                  {data.financiero.map((f) => (
                    <tr key={f.id_jurisdiccion} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-1.5 pr-2"><Semaforo estado={f.semaforo} /></td>
                      <td className="py-1.5 pr-2 text-gray-800">{f.jurisdiccion}</td>
                      <td className="py-1.5 pr-2 text-right">{fmt(f.vigente)}</td>
                      <td className="py-1.5 pr-2 text-right">{fmt(f.programado)} <span className="text-[9px] text-gray-400">({f.fuente_programado})</span></td>
                      <td className="py-1.5 pr-2 text-right">{fmt(f.devengado)}</td>
                      <td className="py-1.5 pr-2 text-right">{f.porcentaje_ejecucion}%</td>
                      <td className="py-1.5 pr-2 text-right"><Pct valor={f.porcentaje_vs_programado} semaforo={f.semaforo} /></td>
                      <td className={`py-1.5 pr-2 text-right ${f.desvio_financiero < 0 ? 'text-red-600' : 'text-green-700'}`}>{fmt(f.desvio_financiero)}</td>
                    </tr>
                  ))}
                  {!data.financiero.length && <tr><td colSpan={8} className="py-4 text-center text-gray-400">Sin partidas para el ejercicio.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>

          {/* Desvío operativo (metas físicas) */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Desvío operativo — metas físicas</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-left text-gray-500 border-b">
                    <th className="py-1.5 pr-2"></th>
                    <th className="py-1.5 pr-2">Meta</th>
                    <th className="py-1.5 pr-2">Unidad</th>
                    <th className="py-1.5 pr-2 text-right">Meta anual</th>
                    <th className="py-1.5 pr-2 text-right">Prevista al corte</th>
                    <th className="py-1.5 pr-2 text-right">Ejecutado</th>
                    <th className="py-1.5 pr-2 text-right">% cumpl.</th>
                    <th className="py-1.5 pr-2 text-right">Desvío</th>
                  </tr>
                </thead>
                <tbody>
                  {data.operativo.map((m) => (
                    <tr key={m.id_meta} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-1.5 pr-2"><Semaforo estado={m.semaforo} /></td>
                      <td className="py-1.5 pr-2 text-gray-800">{m.descripcion}</td>
                      <td className="py-1.5 pr-2 text-gray-500">{m.unidad_medida}</td>
                      <td className="py-1.5 pr-2 text-right">{fmt(m.meta_anual)}</td>
                      <td className="py-1.5 pr-2 text-right">{fmt(m.prevista_al_corte)}</td>
                      <td className="py-1.5 pr-2 text-right">{fmt(m.ejecutado)}</td>
                      <td className="py-1.5 pr-2 text-right"><Pct valor={m.porcentaje_cumplimiento} semaforo={m.semaforo} /></td>
                      <td className={`py-1.5 pr-2 text-right ${m.desvio_operativo < 0 ? 'text-red-600' : 'text-green-700'}`}>{fmt(m.desvio_operativo)}</td>
                    </tr>
                  ))}
                  {!data.operativo.length && <tr><td colSpan={8} className="py-4 text-center text-gray-400">Sin metas físicas cargadas.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>

          {/* Desvío técnico */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-gray-700">Desvío técnico — partidas con crédito sin ejecutar</h4>
              <span className="text-xs text-gray-400">{data.tecnico.length} partidas</span>
            </div>
            {data.tecnico.length ? (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-left text-gray-500 border-b">
                      <th className="py-1.5 pr-2">Jurisdicción</th>
                      <th className="py-1.5 pr-2">Objeto del gasto</th>
                      <th className="py-1.5 pr-2">Inciso</th>
                      <th className="py-1.5 pr-2 text-right">Vigente sin ejecutar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.tecnico.map((p) => (
                      <tr key={p.id_partida} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="py-1.5 pr-2 text-gray-800">{p.jurisdiccion}</td>
                        <td className="py-1.5 pr-2 text-gray-600">{p.objeto_gasto}</td>
                        <td className="py-1.5 pr-2 text-gray-500">{p.inciso}</td>
                        <td className="py-1.5 pr-2 text-right font-medium text-red-600">{fmt(p.vigente)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : <p className="text-xs text-gray-400">Sin desvíos técnicos: todas las partidas con crédito tienen ejecución o afectación.</p>}
          </div>
        </>
      )}
    </div>
  );
}
