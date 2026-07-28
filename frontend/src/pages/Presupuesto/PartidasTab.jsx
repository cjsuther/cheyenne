import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { presupuestoAPI } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Modal, Field, inputClass, btnPrimary, btnSecondary } from '../../components/common/CrudComponents';

const fmt = (v) => new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(v || 0));
const dim = (d) => (d?.nombre ? `${d.nombre} (${d.codigo})` : d?.codigo || '—');

const TIPO_MOV = {
  inicial: 'bg-blue-100 text-blue-700', modificacion: 'bg-amber-100 text-amber-700',
  preventivo: 'bg-purple-100 text-purple-700', compromiso: 'bg-indigo-100 text-indigo-700',
  devengado: 'bg-orange-100 text-orange-700', pagado: 'bg-green-100 text-green-700',
  ajuste: 'bg-gray-200 text-gray-600',
};

export default function PartidasTab() {
  const qc = useQueryClient();
  const [anio, setAnio] = useState(null);
  const [modal, setModal] = useState(null); // 'nueva' | 'importar' | {ledger: partida}
  const [error, setError] = useState('');

  const { data: ejercicios } = useQuery({
    queryKey: ['presu-ejercicios'],
    queryFn: () => presupuestoAPI.ejercicios.list({ limit: 50 }).then((r) => r.data),
  });
  const anioSel = anio ?? ejercicios?.[0]?.anio ?? null;
  const ejercicio = ejercicios?.find((e) => e.anio === anioSel);
  const enFormulacion = ejercicio?.estado === 'formulacion';

  const { data: partidas, isLoading } = useQuery({
    queryKey: ['presu-partidas', anioSel],
    queryFn: () => presupuestoAPI.partidas.list({ anio: anioSel, limit: 200 }).then((r) => r.data),
    enabled: !!anioSel,
  });

  const refetch = () => qc.invalidateQueries({ queryKey: ['presu-partidas', anioSel] });

  const exportar = async () => {
    const { data } = await presupuestoAPI.partidas.exportar(anioSel);
    const url = URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url; a.download = `presupuesto_${anioSel}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const totales = useMemo(() => (partidas || []).reduce((acc, p) => {
    ['vigente', 'comprometido', 'devengado', 'pagado', 'disponible'].forEach((k) => { acc[k] = (acc[k] || 0) + Number(p[k] || 0); });
    return acc;
  }, {}), [partidas]);

  if (!ejercicios) return <LoadingSpinner />;
  if (!ejercicios.length) return <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">Primero creá un ejercicio en la solapa Ejercicios.</div>;

  return (
    <div>
      {error && (
        <div className="mb-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2 flex items-center justify-between">
          <span>⚠ {error}</span><button onClick={() => setError('')} className="text-red-500">✕</button>
        </div>
      )}
      <div className="mb-3 flex items-center gap-2 flex-wrap">
        <select className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm" value={anioSel || ''} onChange={(e) => setAnio(Number(e.target.value))}>
          {ejercicios.map((e) => <option key={e.anio} value={e.anio}>{e.anio} — {e.estado}</option>)}
        </select>
        {!enFormulacion && <span className="text-xs text-amber-600">El crédito solo cambia por modificación (RN-02)</span>}
        <span className="ml-auto flex gap-2">
          <button className={btnSecondary} onClick={exportar}>Exportar CSV</button>
          {enFormulacion && <button className={btnSecondary} onClick={() => setModal('importar')}>Importar planilla</button>}
          {enFormulacion && <button className={btnPrimary} onClick={() => setModal('nueva')}>Nueva partida</button>}
        </span>
      </div>

      {isLoading ? <LoadingSpinner /> : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
          <table className="min-w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/70 text-gray-500 uppercase tracking-wide">
                {['Jurisdicción', 'Estructura', 'Objeto', 'Fuente', 'Inicial', 'Modif.', 'Vigente', 'Prev.', 'Compr.', 'Deveng.', 'Pagado', 'Disponible'].map((h) => (
                  <th key={h} className="px-3 py-2.5 whitespace-nowrap font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {partidas?.length ? partidas.map((p) => (
                <tr key={p.id} className="hover:bg-primary-50/40 cursor-pointer" onClick={() => setModal({ ledger: p })}>
                  <td className="px-3 py-2 whitespace-nowrap">{dim(p.jurisdiccion)}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{dim(p.estructura)}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{dim(p.objeto_gasto)}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{dim(p.fuente)}</td>
                  <td className="px-3 py-2 text-right">{fmt(p.inicial)}</td>
                  <td className="px-3 py-2 text-right">{fmt(p.modificaciones)}</td>
                  <td className="px-3 py-2 text-right font-medium">{fmt(p.vigente)}</td>
                  <td className="px-3 py-2 text-right">{fmt(p.preventivo)}</td>
                  <td className="px-3 py-2 text-right">{fmt(p.comprometido)}</td>
                  <td className="px-3 py-2 text-right">{fmt(p.devengado)}</td>
                  <td className="px-3 py-2 text-right">{fmt(p.pagado)}</td>
                  <td className={`px-3 py-2 text-right font-bold ${Number(p.disponible) < 0 ? 'text-red-600' : 'text-green-700'}`}>{fmt(p.disponible)}</td>
                </tr>
              )) : (
                <tr><td colSpan={12} className="px-3 py-8 text-center text-gray-400">Sin partidas en {anioSel}.</td></tr>
              )}
            </tbody>
            {partidas?.length > 0 && (
              <tfoot>
                <tr className="border-t border-gray-200 bg-gray-50 font-semibold">
                  <td className="px-3 py-2" colSpan={6}>Totales ({partidas.length} partidas)</td>
                  <td className="px-3 py-2 text-right">{fmt(totales.vigente)}</td>
                  <td className="px-3 py-2" />
                  <td className="px-3 py-2 text-right">{fmt(totales.comprometido)}</td>
                  <td className="px-3 py-2 text-right">{fmt(totales.devengado)}</td>
                  <td className="px-3 py-2 text-right">{fmt(totales.pagado)}</td>
                  <td className="px-3 py-2 text-right text-green-700">{fmt(totales.disponible)}</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      )}

      {modal === 'nueva' && <NuevaPartidaModal anio={anioSel} onClose={() => setModal(null)} onDone={() => { setModal(null); refetch(); }} onError={(m) => setError(m)} />}
      {modal === 'importar' && <ImportarModal anio={anioSel} onClose={() => setModal(null)} onDone={() => { setModal(null); refetch(); }} />}
      {modal?.ledger && <LedgerDrawer partida={modal.ledger} onClose={() => setModal(null)} />}
    </div>
  );
}

function useNomencladores() {
  const q = (key, fn) => useQuery({ queryKey: [key], queryFn: () => fn({ limit: 200 }).then((r) => r.data), staleTime: 60000 });
  return {
    juris: q('sel-p-juri', presupuestoAPI.jurisdicciones.list).data || [],
    esprs: q('sel-p-espr', presupuestoAPI.estructuras.list).data || [],
    godgs: q('sel-p-godg', presupuestoAPI.objetosGasto.list).data || [],
    fufis: q('sel-p-fufi', presupuestoAPI.fuentes.list).data || [],
  };
}

function SelectNom({ label, items, value, onChange }) {
  return (
    <Field label={label}>
      <select className={inputClass} value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">Seleccionar...</option>
        {items.filter((i) => i.activo !== false).map((i) => (
          <option key={i.id} value={i.id}>{i.codigo} — {i.nombre}</option>
        ))}
      </select>
    </Field>
  );
}

function NuevaPartidaModal({ anio, onClose, onDone, onError }) {
  const { juris, esprs, godgs, fufis } = useNomencladores();
  const [f, setF] = useState({ id_jurisdiccion: '', id_estructura: '', id_objeto_gasto: '', id_fuente: '', credito_inicial: '', descripcion: '' });
  const set = (k) => (v) => setF((p) => ({ ...p, [k]: v }));
  const [msg, setMsg] = useState('');
  const m = useMutation({
    mutationFn: () => presupuestoAPI.partidas.create({
      anio, id_jurisdiccion: Number(f.id_jurisdiccion), id_estructura: Number(f.id_estructura),
      id_objeto_gasto: Number(f.id_objeto_gasto), id_fuente: Number(f.id_fuente),
      credito_inicial: Number(f.credito_inicial || 0), descripcion: f.descripcion || null,
    }),
    onSuccess: onDone,
    onError: (e) => setMsg(e.response?.data?.detail || 'Error al crear la partida'),
  });
  const completo = f.id_jurisdiccion && f.id_estructura && f.id_objeto_gasto && f.id_fuente;
  return (
    <Modal title={`Nueva partida — Ejercicio ${anio}`} onClose={onClose} wide>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <SelectNom label="Jurisdicción" items={juris} value={f.id_jurisdiccion} onChange={set('id_jurisdiccion')} />
        <SelectNom label="Estructura programática" items={esprs} value={f.id_estructura} onChange={set('id_estructura')} />
        <SelectNom label="Objeto del gasto" items={godgs} value={f.id_objeto_gasto} onChange={set('id_objeto_gasto')} />
        <SelectNom label="Fuente de financiamiento" items={fufis} value={f.id_fuente} onChange={set('id_fuente')} />
        <Field label="Crédito inicial"><input type="number" className={inputClass} value={f.credito_inicial} onChange={(e) => set('credito_inicial')(e.target.value)} /></Field>
        <Field label="Descripción"><input className={inputClass} value={f.descripcion} onChange={(e) => set('descripcion')(e.target.value)} /></Field>
      </div>
      {msg && <p className="text-red-600 text-sm mt-3">⚠ {msg}</p>}
      <button className={`${btnPrimary} w-full mt-4`} onClick={() => m.mutate()} disabled={m.isPending || !completo}>
        {m.isPending ? 'Creando...' : 'Crear partida'}
      </button>
    </Modal>
  );
}

function ImportarModal({ anio, onClose, onDone }) {
  const [csv, setCsv] = useState('');
  const [reporte, setReporte] = useState(null);
  const run = useMutation({
    mutationFn: (dry) => presupuestoAPI.partidas.importar({ anio, csv, dry_run: dry }).then((r) => ({ ...r.data })),
    onSuccess: (r) => { setReporte(r); if (!r.dry_run) setTimeout(onDone, 800); },
    onError: (e) => setReporte({ error: e.response?.data?.detail || 'Error al importar' }),
  });
  return (
    <Modal title={`Importar partidas — Ejercicio ${anio}`} onClose={onClose} wide>
      <p className="text-xs text-gray-500 mb-2">Formato (con o sin encabezado): <code>jurisdiccion;estructura;objeto_gasto;fuente;credito_inicial;descripcion</code> — códigos de nomencladores.</p>
      <textarea className={`${inputClass} font-mono text-xs`} rows={8} value={csv} onChange={(e) => setCsv(e.target.value)}
        placeholder={'MUN;01;1.1.1;1.1.0;1000000;Sueldos conducción\nMUN;01;2;1.1.0;250000;Insumos'} />
      {reporte && (
        <div className={`mt-3 rounded-lg px-3 py-2 text-sm ${reporte.error ? 'bg-red-50 text-red-700' : 'bg-slate-50 text-gray-700'}`}>
          {reporte.error ? `⚠ ${reporte.error}` : (
            <>
              <p><b>{reporte.dry_run ? 'Validación' : 'Importación'}:</b> {reporte.creadas} OK de {reporte.procesadas} filas{reporte.rechazadas?.length ? ` · ${reporte.rechazadas.length} rechazadas:` : ''}</p>
              {reporte.rechazadas?.map((r) => <p key={r.fila} className="text-xs text-red-600">fila {r.fila}: {r.detalle}</p>)}
            </>
          )}
        </div>
      )}
      <div className="flex gap-2 mt-4">
        <button className={`${btnSecondary} flex-1`} onClick={() => run.mutate(true)} disabled={run.isPending || !csv.trim()}>Validar (dry-run)</button>
        <button className={`${btnPrimary} flex-1`} onClick={() => run.mutate(false)} disabled={run.isPending || !csv.trim()}>Importar</button>
      </div>
    </Modal>
  );
}

function LedgerDrawer({ partida, onClose }) {
  const { data, isLoading } = useQuery({
    queryKey: ['presu-ledger', partida.id],
    queryFn: () => presupuestoAPI.partidas.movimientos(partida.id).then((r) => r.data),
  });
  return (
    <Modal title={`Ledger — ${dim(partida.jurisdiccion)} · ${dim(partida.objeto_gasto)}`} onClose={onClose} wide>
      <div className="grid grid-cols-4 gap-2 mb-4 text-center">
        {[['Vigente', partida.vigente], ['Comprometido', partida.comprometido], ['Pagado', partida.pagado], ['Disponible', partida.disponible]].map(([l, v]) => (
          <div key={l} className="bg-gray-50 rounded-lg p-2">
            <p className="text-[10px] text-gray-500 uppercase">{l}</p>
            <p className={`text-sm font-bold ${l === 'Disponible' ? (Number(v) < 0 ? 'text-red-600' : 'text-green-700') : 'text-gray-800'}`}>{fmt(v)}</p>
          </div>
        ))}
      </div>
      {isLoading ? <LoadingSpinner /> : (
        <div className="space-y-1 max-h-80 overflow-y-auto">
          {data?.length ? data.map((mv) => (
            <div key={mv.id} className="flex items-center gap-2 text-sm bg-gray-50 rounded px-3 py-1.5">
              <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${TIPO_MOV[mv.tipo] || 'bg-gray-100'}`}>{mv.tipo}</span>
              <span className="text-xs text-gray-500">{mv.fecha ? new Date(mv.fecha).toLocaleString() : ''}</span>
              <span className="text-xs text-gray-400 truncate flex-1">{mv.observaciones || mv.referencia || ''}</span>
              <span className="text-xs text-gray-400">{mv.usuario || ''}</span>
              <span className={`font-semibold ${mv.importe < 0 ? 'text-red-600' : 'text-gray-800'}`}>{fmt(mv.importe)}</span>
            </div>
          )) : <p className="text-sm text-gray-400 text-center py-4">Sin movimientos.</p>}
        </div>
      )}
    </Modal>
  );
}
