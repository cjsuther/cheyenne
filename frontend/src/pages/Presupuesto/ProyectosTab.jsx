import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { presupuestoAPI } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Modal, Field, inputClass, btnPrimary, btnSecondary } from '../../components/common/CrudComponents';

const fmt = (v) => new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(v || 0));
const ESTADO = {
  formulacion: 'bg-amber-100 text-amber-700', ejecucion: 'bg-blue-100 text-blue-700',
  terminado: 'bg-green-100 text-green-700', cancelado: 'bg-gray-200 text-gray-500',
};

export default function ProyectosTab() {
  const qc = useQueryClient();
  const [modal, setModal] = useState(null);
  const { data: proyectos, isLoading } = useQuery({
    queryKey: ['presu-proyectos'],
    queryFn: () => presupuestoAPI.proyectos.list({ limit: 200 }).then((r) => r.data),
  });
  const refetch = () => qc.invalidateQueries({ queryKey: ['presu-proyectos'] });

  return (
    <div>
      <div className="mb-3 flex justify-end">
        <button className={btnPrimary} onClick={() => setModal('nuevo')}>Nuevo proyecto</button>
      </div>
      {isLoading ? <LoadingSpinner /> : (
        <div className="space-y-2">
          {proyectos?.length ? proyectos.map((p) => (
            <div key={p.id} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-800">{p.codigo} — {p.nombre}</p>
                  <p className="text-xs text-gray-500">
                    {p.jurisdiccion ? `${p.jurisdiccion.nombre} · ` : ''}{p.estructura ? `${p.estructura.codigo} ${p.estructura.nombre} · ` : ''}
                    desde {p.anio_inicio}{p.etapa ? ` · ${p.etapa}` : ''}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${ESTADO[p.estado]}`}>{p.estado}</span>
                  <span className="text-sm font-bold text-gray-800">{fmt(p.monto_total)}</span>
                  <button className={btnSecondary} onClick={() => setModal({ edit: p })}>Editar</button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-2">
                {[['Avance físico', p.avance_fisico, 'bg-primary-500'], ['Avance financiero', p.avance_financiero, 'bg-orange-500']].map(([l, v, c]) => (
                  <div key={l}>
                    <div className="flex justify-between text-[11px] text-gray-500 mb-0.5"><span>{l}</span><span>{v}%</span></div>
                    <div className="w-full bg-gray-100 rounded-full h-2"><div className={`${c} h-2 rounded-full`} style={{ width: `${Math.min(v, 100)}%` }} /></div>
                  </div>
                ))}
              </div>
            </div>
          )) : <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">Sin proyectos.</div>}
        </div>
      )}
      {(modal === 'nuevo' || modal?.edit) && (
        <ProyectoModal proyecto={modal?.edit} onClose={() => setModal(null)} onDone={() => { setModal(null); refetch(); }} />
      )}
    </div>
  );
}

function ProyectoModal({ proyecto, onClose, onDone }) {
  const { data: juris } = useQuery({ queryKey: ['sel-p-juri'], queryFn: () => presupuestoAPI.jurisdicciones.list({ limit: 200 }).then((r) => r.data) });
  const { data: esprs } = useQuery({ queryKey: ['sel-p-espr'], queryFn: () => presupuestoAPI.estructuras.list({ limit: 200 }).then((r) => r.data) });
  const [f, setF] = useState({
    codigo: proyecto?.codigo || '', nombre: proyecto?.nombre || '', anio_inicio: proyecto?.anio_inicio || new Date().getFullYear(),
    id_jurisdiccion: proyecto?.jurisdiccion?.id || '', id_estructura: proyecto?.estructura?.id || '',
    monto_total: proyecto?.monto_total ?? '', estado: proyecto?.estado || 'formulacion', etapa: proyecto?.etapa || '',
    avance_fisico: proyecto?.avance_fisico ?? 0, avance_financiero: proyecto?.avance_financiero ?? 0,
    descripcion: proyecto?.descripcion || '',
  });
  const [msg, setMsg] = useState('');
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const m = useMutation({
    mutationFn: () => {
      const payload = { ...f, anio_inicio: Number(f.anio_inicio), monto_total: Number(f.monto_total || 0),
        id_jurisdiccion: f.id_jurisdiccion ? Number(f.id_jurisdiccion) : null,
        id_estructura: f.id_estructura ? Number(f.id_estructura) : null,
        avance_fisico: Number(f.avance_fisico), avance_financiero: Number(f.avance_financiero),
        etapa: f.etapa || null, descripcion: f.descripcion || null };
      return proyecto ? presupuestoAPI.proyectos.update(proyecto.id, payload) : presupuestoAPI.proyectos.create(payload);
    },
    onSuccess: onDone,
    onError: (e) => setMsg(e.response?.data?.detail || 'Error'),
  });
  return (
    <Modal title={proyecto ? `Editar ${proyecto.codigo}` : 'Nuevo proyecto'} onClose={onClose} wide>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field label="Código"><input className={inputClass} value={f.codigo} onChange={set('codigo')} placeholder="ej: OBRA-2027-01" /></Field>
        <Field label="Nombre"><input className={inputClass} value={f.nombre} onChange={set('nombre')} /></Field>
        <Field label="Año de inicio"><input type="number" className={inputClass} value={f.anio_inicio} onChange={set('anio_inicio')} /></Field>
        <Field label="Monto total"><input type="number" className={inputClass} value={f.monto_total} onChange={set('monto_total')} /></Field>
        <Field label="Jurisdicción (opcional)">
          <select className={inputClass} value={f.id_jurisdiccion} onChange={set('id_jurisdiccion')}>
            <option value="">—</option>
            {juris?.map((j) => <option key={j.id} value={j.id}>{j.codigo} — {j.nombre}</option>)}
          </select>
        </Field>
        <Field label="Estructura (actividad/obra, opcional)">
          <select className={inputClass} value={f.id_estructura} onChange={set('id_estructura')}>
            <option value="">—</option>
            {esprs?.map((x) => <option key={x.id} value={x.id}>{x.codigo} — {x.nombre}</option>)}
          </select>
        </Field>
        <Field label="Estado">
          <select className={inputClass} value={f.estado} onChange={set('estado')}>
            {['formulacion', 'ejecucion', 'terminado', 'cancelado'].map((e) => <option key={e} value={e}>{e}</option>)}
          </select>
        </Field>
        <Field label="Etapa actual (texto libre)"><input className={inputClass} value={f.etapa} onChange={set('etapa')} placeholder="ej: Licitación en curso" /></Field>
        <Field label="Avance físico (%)"><input type="number" min="0" max="100" className={inputClass} value={f.avance_fisico} onChange={set('avance_fisico')} /></Field>
        <Field label="Avance financiero (%)"><input type="number" min="0" max="100" className={inputClass} value={f.avance_financiero} onChange={set('avance_financiero')} /></Field>
      </div>
      <Field label="Descripción"><input className={inputClass} value={f.descripcion} onChange={set('descripcion')} /></Field>
      {msg && <p className="text-red-600 text-sm mt-2">⚠ {msg}</p>}
      <button className={`${btnPrimary} w-full mt-3`} disabled={m.isPending || !f.codigo.trim() || !f.nombre.trim()} onClick={() => m.mutate()}>
        {m.isPending ? 'Guardando...' : 'Guardar'}
      </button>
    </Modal>
  );
}
