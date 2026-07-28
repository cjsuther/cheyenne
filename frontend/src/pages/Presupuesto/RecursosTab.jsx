import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { presupuestoAPI } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Modal, Field, inputClass, btnPrimary, btnSecondary } from '../../components/common/CrudComponents';

const fmt = (v) => new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(v || 0));
const dim = (d) => (d?.nombre ? `${d.nombre} (${d.codigo})` : d?.codigo || '—');

export default function RecursosTab() {
  const qc = useQueryClient();
  const [anio, setAnio] = useState(null);
  const [modal, setModal] = useState(null); // 'nuevo' | {modif: recurso}
  const [error, setError] = useState('');

  const { data: ejercicios } = useQuery({
    queryKey: ['presu-ejercicios'],
    queryFn: () => presupuestoAPI.ejercicios.list({ limit: 50 }).then((r) => r.data),
  });
  const anioSel = anio ?? ejercicios?.[0]?.anio ?? null;
  const ejercicio = ejercicios?.find((e) => e.anio === anioSel);
  const enFormulacion = ejercicio?.estado === 'formulacion';
  const modificable = ['aprobado', 'vigente'].includes(ejercicio?.estado);

  const { data: recursos, isLoading } = useQuery({
    queryKey: ['presu-recursos', anioSel],
    queryFn: () => presupuestoAPI.recursos.list({ anio: anioSel, limit: 200 }).then((r) => r.data),
    enabled: !!anioSel,
  });
  const refetch = () => qc.invalidateQueries({ queryKey: ['presu-recursos', anioSel] });

  if (!ejercicios) return <LoadingSpinner />;
  const totales = (recursos || []).reduce((a, r) => ({
    vigente: a.vigente + Number(r.vigente || 0), percibido: a.percibido + Number(r.percibido || 0),
  }), { vigente: 0, percibido: 0 });

  return (
    <div>
      {error && (
        <div className="mb-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2 flex items-center justify-between">
          <span>⚠ {error}</span><button onClick={() => setError('')} className="text-red-500">✕</button>
        </div>
      )}
      <div className="mb-3 flex items-center gap-2">
        <select className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm" value={anioSel || ''} onChange={(e) => setAnio(Number(e.target.value))}>
          {ejercicios.map((e) => <option key={e.anio} value={e.anio}>{e.anio} — {e.estado}</option>)}
        </select>
        {enFormulacion && <button className={`${btnPrimary} ml-auto`} onClick={() => setModal('nuevo')}>Nuevo recurso</button>}
      </div>

      {isLoading ? <LoadingSpinner /> : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
          <table className="min-w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/70 text-gray-500 uppercase tracking-wide">
                {['Jurisdicción', 'Rubro', 'Estimado', 'Modif.', 'Vigente', 'Percibido', '% Percep.', ''].map((h) => (
                  <th key={h} className="px-3 py-2.5 whitespace-nowrap font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recursos?.length ? recursos.map((r) => (
                <tr key={r.id} className="hover:bg-primary-50/40">
                  <td className="px-3 py-2 whitespace-nowrap">{dim(r.jurisdiccion)}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{dim(r.rubro)}</td>
                  <td className="px-3 py-2 text-right">{fmt(r.inicial)}</td>
                  <td className="px-3 py-2 text-right">{fmt(r.modificaciones)}</td>
                  <td className="px-3 py-2 text-right font-medium">{fmt(r.vigente)}</td>
                  <td className="px-3 py-2 text-right text-green-700">{fmt(r.percibido)}</td>
                  <td className="px-3 py-2 text-right">{r.vigente ? `${((r.percibido / r.vigente) * 100).toFixed(1)}%` : '—'}</td>
                  <td className="px-3 py-2">
                    {modificable && <button className={btnSecondary} onClick={() => setModal({ modif: r })}>Modificar</button>}
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={8} className="px-3 py-8 text-center text-gray-400">Sin recursos en {anioSel}.{enFormulacion ? ' Cargá el estimado.' : ''}</td></tr>
              )}
            </tbody>
            {recursos?.length > 0 && (
              <tfoot><tr className="border-t border-gray-200 bg-gray-50 font-semibold">
                <td className="px-3 py-2" colSpan={4}>Totales</td>
                <td className="px-3 py-2 text-right">{fmt(totales.vigente)}</td>
                <td className="px-3 py-2 text-right text-green-700">{fmt(totales.percibido)}</td>
                <td className="px-3 py-2" colSpan={2} />
              </tr></tfoot>
            )}
          </table>
        </div>
      )}

      {modal === 'nuevo' && <NuevoRecursoModal anio={anioSel} onClose={() => setModal(null)} onDone={() => { setModal(null); refetch(); }} />}
      {modal?.modif && <ModificarRecursoModal recurso={modal.modif} onClose={() => setModal(null)} onDone={() => { setModal(null); refetch(); }} onError={(m) => { setError(m); setModal(null); }} />}
    </div>
  );
}

function NuevoRecursoModal({ anio, onClose, onDone }) {
  const { data: juris } = useQuery({ queryKey: ['sel-p-juri'], queryFn: () => presupuestoAPI.jurisdicciones.list({ limit: 200 }).then((r) => r.data) });
  const { data: rubros } = useQuery({ queryKey: ['sel-p-rubro'], queryFn: () => presupuestoAPI.rubros.list({ limit: 200 }).then((r) => r.data) });
  const [f, setF] = useState({ id_jurisdiccion: '', id_rubro: '', estimado_inicial: '', metodologia: '' });
  const [msg, setMsg] = useState('');
  const m = useMutation({
    mutationFn: () => presupuestoAPI.recursos.create({
      anio, id_jurisdiccion: Number(f.id_jurisdiccion), id_rubro: Number(f.id_rubro),
      estimado_inicial: Number(f.estimado_inicial || 0), metodologia: f.metodologia || null,
    }),
    onSuccess: onDone,
    onError: (e) => setMsg(e.response?.data?.detail || 'Error al crear'),
  });
  return (
    <Modal title={`Nuevo recurso — Ejercicio ${anio}`} onClose={onClose}>
      <div className="space-y-3">
        <Field label="Jurisdicción">
          <select className={inputClass} value={f.id_jurisdiccion} onChange={(e) => setF({ ...f, id_jurisdiccion: e.target.value })}>
            <option value="">Seleccionar...</option>
            {juris?.map((j) => <option key={j.id} value={j.id}>{j.codigo} — {j.nombre}</option>)}
          </select>
        </Field>
        <Field label="Rubro">
          <select className={inputClass} value={f.id_rubro} onChange={(e) => setF({ ...f, id_rubro: e.target.value })}>
            <option value="">Seleccionar...</option>
            {rubros?.map((r) => <option key={r.id} value={r.id}>{r.codigo} — {r.nombre}</option>)}
          </select>
        </Field>
        <Field label="Estimado inicial"><input type="number" className={inputClass} value={f.estimado_inicial} onChange={(e) => setF({ ...f, estimado_inicial: e.target.value })} /></Field>
        <Field label="Metodología (opcional)"><input className={inputClass} value={f.metodologia} onChange={(e) => setF({ ...f, metodologia: e.target.value })} /></Field>
        {msg && <p className="text-red-600 text-sm">⚠ {msg}</p>}
        <button className={`${btnPrimary} w-full`} disabled={m.isPending || !f.id_jurisdiccion || !f.id_rubro} onClick={() => m.mutate()}>
          {m.isPending ? 'Creando...' : 'Crear recurso'}
        </button>
      </div>
    </Modal>
  );
}

function ModificarRecursoModal({ recurso, onClose, onDone, onError }) {
  const [importe, setImporte] = useState('');
  const [acto, setActo] = useState('');
  const [obs, setObs] = useState('');
  const m = useMutation({
    mutationFn: () => presupuestoAPI.recursos.modificar(recurso.id, {
      importe: Number(importe), acto_administrativo: acto, observaciones: obs || null,
    }),
    onSuccess: onDone,
    onError: (e) => onError(e.response?.data?.detail || 'Error al modificar'),
  });
  return (
    <Modal title={`Modificar recurso — ${dim(recurso.rubro)}`} onClose={onClose}>
      <div className="space-y-3">
        <p className="text-sm text-gray-500">Vigente actual: <b>{fmt(recurso.vigente)}</b></p>
        <Field label="Importe (± delta)"><input type="number" className={inputClass} value={importe} onChange={(e) => setImporte(e.target.value)} placeholder="ej: 50000 o -20000" /></Field>
        <Field label="Acto administrativo — obligatorio"><input className={inputClass} value={acto} onChange={(e) => setActo(e.target.value)} placeholder="ej: Decreto 5/2027" /></Field>
        <Field label="Observaciones"><input className={inputClass} value={obs} onChange={(e) => setObs(e.target.value)} /></Field>
        <button className={`${btnPrimary} w-full`} disabled={m.isPending || !Number(importe) || !acto.trim()} onClick={() => m.mutate()}>
          {m.isPending ? 'Aplicando...' : 'Aplicar modificación'}
        </button>
      </div>
    </Modal>
  );
}
