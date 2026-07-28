import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { presupuestoAPI } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Modal, Field, inputClass, btnPrimary, btnSecondary } from '../../components/common/CrudComponents';

const fmt = (v) => new Intl.NumberFormat('es-AR').format(Number(v || 0));

export default function MetasTab() {
  const qc = useQueryClient();
  const [anio, setAnio] = useState(null);
  const [modal, setModal] = useState(null);
  const [error, setError] = useState('');

  const { data: ejercicios } = useQuery({
    queryKey: ['presu-ejercicios'],
    queryFn: () => presupuestoAPI.ejercicios.list({ limit: 50 }).then((r) => r.data),
  });
  const anioSel = anio ?? ejercicios?.find((e) => e.estado === 'vigente')?.anio ?? ejercicios?.[0]?.anio ?? null;

  const { data: metas, isLoading } = useQuery({
    queryKey: ['presu-metas', anioSel],
    queryFn: () => presupuestoAPI.metas.list({ anio: anioSel, limit: 200 }).then((r) => r.data),
    enabled: !!anioSel,
  });
  const refetch = () => qc.invalidateQueries({ queryKey: ['presu-metas', anioSel] });

  const avanceMut = useMutation({
    mutationFn: ({ id, cantidad }) => presupuestoAPI.metas.ejecutado(id, cantidad),
    onSuccess: refetch,
    onError: (e) => setError(e.response?.data?.detail || 'Error'),
  });

  if (!ejercicios) return <LoadingSpinner />;
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
        <button className={`${btnPrimary} ml-auto`} onClick={() => setModal('nueva')}>Nueva meta</button>
      </div>

      {isLoading ? <LoadingSpinner /> : (
        <div className="space-y-2">
          {metas?.length ? metas.map((m) => (
            <div key={m.id} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-800">{m.descripcion}</p>
                  <p className="text-xs text-gray-500">{m.estructura?.codigo} — {m.estructura?.nombre} · {fmt(m.ejecutado)} / {fmt(m.meta_anual)} {m.unidad_medida}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-bold ${m.avance >= 100 ? 'text-green-700' : 'text-gray-700'}`}>{m.avance}%</span>
                  <button className={btnSecondary} onClick={() => {
                    const c = prompt(`Registrar avance de "${m.descripcion}" (${m.unidad_medida}, negativo corrige):`);
                    if (c !== null && Number(c)) avanceMut.mutate({ id: m.id, cantidad: Number(c) });
                  }}>+ Avance</button>
                  <button className={btnSecondary} onClick={() => setModal({ edit: m })}>Editar</button>
                </div>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 mt-2">
                <div className={`h-2 rounded-full ${m.avance >= 100 ? 'bg-green-500' : 'bg-primary-500'}`} style={{ width: `${Math.min(m.avance, 100)}%` }} />
              </div>
            </div>
          )) : <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">Sin metas en {anioSel}.</div>}
        </div>
      )}

      {(modal === 'nueva' || modal?.edit) && (
        <MetaModal anio={anioSel} meta={modal?.edit} onClose={() => setModal(null)} onDone={() => { setModal(null); refetch(); }} />
      )}
    </div>
  );
}

function MetaModal({ anio, meta, onClose, onDone }) {
  const { data: esprs } = useQuery({ queryKey: ['sel-p-espr'], queryFn: () => presupuestoAPI.estructuras.list({ limit: 200 }).then((r) => r.data) });
  const [f, setF] = useState({
    id_estructura: meta?.estructura?.id || '', descripcion: meta?.descripcion || '',
    unidad_medida: meta?.unidad_medida || '', meta_anual: meta?.meta_anual ?? '', observaciones: meta?.observaciones || '',
  });
  const [msg, setMsg] = useState('');
  const m = useMutation({
    mutationFn: () => {
      const payload = { anio, id_estructura: Number(f.id_estructura), descripcion: f.descripcion,
        unidad_medida: f.unidad_medida, meta_anual: Number(f.meta_anual || 0), observaciones: f.observaciones || null };
      return meta ? presupuestoAPI.metas.update(meta.id, payload) : presupuestoAPI.metas.create(payload);
    },
    onSuccess: onDone,
    onError: (e) => setMsg(e.response?.data?.detail || 'Error'),
  });
  return (
    <Modal title={meta ? 'Editar meta' : `Nueva meta — ${anio}`} onClose={onClose}>
      <div className="space-y-3">
        <Field label="Programa (estructura programática)">
          <select className={inputClass} value={f.id_estructura} onChange={(e) => setF({ ...f, id_estructura: e.target.value })}>
            <option value="">Seleccionar...</option>
            {esprs?.filter((x) => x.activo !== false).map((x) => <option key={x.id} value={x.id}>{x.codigo} — {x.nombre}</option>)}
          </select>
        </Field>
        <Field label="Descripción de la meta"><input className={inputClass} value={f.descripcion} onChange={(e) => setF({ ...f, descripcion: e.target.value })} placeholder="ej: Luminarias LED instaladas" /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Unidad de medida"><input className={inputClass} value={f.unidad_medida} onChange={(e) => setF({ ...f, unidad_medida: e.target.value })} placeholder="unidades / m2 / raciones" /></Field>
          <Field label="Meta anual"><input type="number" className={inputClass} value={f.meta_anual} onChange={(e) => setF({ ...f, meta_anual: e.target.value })} /></Field>
        </div>
        <Field label="Observaciones"><input className={inputClass} value={f.observaciones} onChange={(e) => setF({ ...f, observaciones: e.target.value })} /></Field>
        {msg && <p className="text-red-600 text-sm">⚠ {msg}</p>}
        <button className={`${btnPrimary} w-full`} disabled={m.isPending || !f.id_estructura || !f.descripcion.trim() || !f.unidad_medida.trim()} onClick={() => m.mutate()}>
          {m.isPending ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </Modal>
  );
}
