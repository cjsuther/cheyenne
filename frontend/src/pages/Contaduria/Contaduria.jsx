import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contaduriaAPI, presupuestoAPI } from '../../services/api';
import PageHeader from '../../components/common/PageHeader';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Modal, Field, inputClass, btnPrimary, btnSecondary } from '../../components/common/CrudComponents';

const fmt = (v) => new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(v || 0));

const ETAPAS = ['preventivado', 'comprometido', 'devengado', 'pagado'];
const ESTADO = {
  preventivado: 'bg-purple-100 text-purple-700', comprometido: 'bg-indigo-100 text-indigo-700',
  devengado: 'bg-orange-100 text-orange-700', pagado: 'bg-green-100 text-green-700',
  anulado: 'bg-gray-200 text-gray-500',
};
const ACCION = {
  preventivado: { label: 'Comprometer', doc: 'N° de orden de compra' },
  comprometido: { label: 'Devengar', doc: 'N° de factura' },
  devengado: { label: 'Pagar', doc: 'N° de orden de pago' },
};

export default function Contaduria() {
  const qc = useQueryClient();
  const [modal, setModal] = useState(null); // 'nuevo' | {avanzar: g} | {anular: g}
  const [error, setError] = useState('');
  const [adv, setAdv] = useState('');

  const { data: gastos, isLoading } = useQuery({
    queryKey: ['conta-gastos'],
    queryFn: () => contaduriaAPI.gastos.list({ limit: 100 }).then((r) => r.data),
  });
  const refetch = () => {
    qc.invalidateQueries({ queryKey: ['conta-gastos'] });
    qc.invalidateQueries({ queryKey: ['presu-partidas'] });
  };

  return (
    <div>
      <PageHeader title="Contaduría — Ciclo del Gasto" subtitle="Preventivo → Compromiso → Devengado → Pagado, afectando el presupuesto en línea" />
      {error && (
        <div className="mb-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2 flex items-center justify-between">
          <span>⚠ {error}</span><button onClick={() => setError('')} className="text-red-500">✕</button>
        </div>
      )}
      {adv && (
        <div className="mb-3 bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-lg px-4 py-2 flex items-center justify-between">
          <span>⚠ {adv}</span><button onClick={() => setAdv('')} className="text-amber-600">✕</button>
        </div>
      )}
      <div className="mb-3 flex justify-end">
        <button className={btnPrimary} onClick={() => setModal('nuevo')}>Nuevo gasto (reserva preventivo)</button>
      </div>

      {isLoading ? <LoadingSpinner /> : (
        <div className="space-y-2">
          {gastos?.length ? gastos.map((g) => (
            <div key={g.id} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-800">{g.expediente} — {g.descripcion}</p>
                  <p className="text-xs text-gray-500">
                    {g.partida || `partida ${g.id_partida}`}{g.proveedor ? ` · ${g.proveedor}` : ''}
                    {g.oc_numero ? ` · OC ${g.oc_numero}` : ''}{g.factura_numero ? ` · FC ${g.factura_numero}` : ''}{g.op_numero ? ` · OP ${g.op_numero}` : ''}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-800">{fmt(g.importe)}</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${ESTADO[g.estado]}`}>{g.estado}</span>
                  {ACCION[g.estado] && (
                    <button className={btnPrimary.replace('px-4 py-2', 'px-3 py-1.5')} onClick={() => setModal({ avanzar: g })}>{ACCION[g.estado].label}</button>
                  )}
                  {['preventivado', 'comprometido'].includes(g.estado) && (
                    <button className={btnSecondary} onClick={() => setModal({ anular: g })}>Anular</button>
                  )}
                </div>
              </div>
              {/* stepper */}
              <div className="flex items-center gap-1 mt-3">
                {ETAPAS.map((e, i) => {
                  const idx = ETAPAS.indexOf(g.estado);
                  const done = g.estado !== 'anulado' && idx >= i;
                  return (
                    <div key={e} className="flex items-center flex-1 min-w-0">
                      <div className={`w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold ${done ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'}`}>{i + 1}</div>
                      <span className={`ml-1 text-[10px] truncate ${done ? 'text-primary-700 font-medium' : 'text-gray-400'}`}>{e}</span>
                      {i < ETAPAS.length - 1 && <div className={`flex-1 h-0.5 mx-1 ${done && idx > i ? 'bg-primary-400' : 'bg-gray-200'}`} />}
                    </div>
                  );
                })}
              </div>
              {g.historial?.length > 0 && (
                <p className="text-[10px] text-gray-400 mt-2">
                  {g.historial.map((h, i) => `${h.etapa} · ${h.usuario} · ${h.fecha ? new Date(h.fecha).toLocaleString() : ''}`).join('  →  ')}
                </p>
              )}
            </div>
          )) : <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">Sin expedientes de gasto. Creá el primero.</div>}
        </div>
      )}

      {modal === 'nuevo' && <NuevoGastoModal onClose={() => setModal(null)} onDone={(r) => { setModal(null); refetch(); if (r?.advertencia) setAdv(r.advertencia); }} />}
      {modal?.avanzar && <AvanzarModal gasto={modal.avanzar} onClose={() => setModal(null)}
        onDone={(r) => { setModal(null); refetch(); const a = r?.advertencia || (r?.advertencias_cuota || []).join('; '); if (a) setAdv(a); }}
        onError={(m) => { setError(m); setModal(null); }} />}
      {modal?.anular && <AnularModal gasto={modal.anular} onClose={() => setModal(null)}
        onDone={() => { setModal(null); refetch(); }} onError={(m) => { setError(m); setModal(null); }} />}
    </div>
  );
}

function NuevoGastoModal({ onClose, onDone }) {
  const { data: ejercicios } = useQuery({
    queryKey: ['presu-ejercicios'],
    queryFn: () => presupuestoAPI.ejercicios.list({ limit: 50 }).then((r) => r.data),
  });
  const vigentes = (ejercicios || []).filter((e) => e.estado === 'vigente');
  const [anio, setAnio] = useState(null);
  const anioSel = anio ?? vigentes[0]?.anio ?? null;
  const { data: partidas } = useQuery({
    queryKey: ['conta-partidas', anioSel],
    queryFn: () => presupuestoAPI.partidas.list({ anio: anioSel, limit: 200 }).then((r) => r.data),
    enabled: !!anioSel,
  });
  const [f, setF] = useState({ id_partida: '', importe: '', descripcion: '', proveedor: '' });
  const [msg, setMsg] = useState('');
  const partidaSel = partidas?.find((p) => p.id === Number(f.id_partida));
  const m = useMutation({
    mutationFn: () => contaduriaAPI.gastos.create({
      anio: anioSel, id_partida: Number(f.id_partida), importe: Number(f.importe),
      descripcion: f.descripcion, proveedor: f.proveedor || null,
    }),
    onSuccess: (r) => onDone(r.data),
    onError: (e) => setMsg(e.response?.data?.detail || 'Error al crear el gasto'),
  });
  return (
    <Modal title="Nuevo gasto — reserva el preventivo en Presupuesto" onClose={onClose} wide>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field label="Ejercicio (vigente)">
          <select className={inputClass} value={anioSel || ''} onChange={(e) => setAnio(Number(e.target.value))}>
            {vigentes.map((e) => <option key={e.anio} value={e.anio}>{e.anio}</option>)}
          </select>
        </Field>
        <Field label="Partida presupuestaria">
          <select className={inputClass} value={f.id_partida} onChange={(e) => setF({ ...f, id_partida: e.target.value })}>
            <option value="">Seleccionar...</option>
            {partidas?.map((p) => (
              <option key={p.id} value={p.id}>
                {p.jurisdiccion?.codigo} · {p.estructura?.codigo} · {p.objeto_gasto?.codigo} · {p.fuente?.codigo} (disp. {fmt(p.disponible)})
              </option>
            ))}
          </select>
        </Field>
        <Field label="Descripción del gasto"><input className={inputClass} value={f.descripcion} onChange={(e) => setF({ ...f, descripcion: e.target.value })} placeholder="ej: Compra de insumos de oficina" /></Field>
        <Field label="Proveedor (opcional)"><input className={inputClass} value={f.proveedor} onChange={(e) => setF({ ...f, proveedor: e.target.value })} /></Field>
        <Field label="Importe"><input type="number" className={inputClass} value={f.importe} onChange={(e) => setF({ ...f, importe: e.target.value })} /></Field>
      </div>
      {partidaSel && (
        <p className={`text-xs mt-2 ${Number(f.importe) > partidaSel.disponible ? 'text-red-600' : 'text-gray-500'}`}>
          Disponible de la partida: {fmt(partidaSel.disponible)}{Number(f.importe) > partidaSel.disponible ? ' — el importe lo supera' : ''}
        </p>
      )}
      {msg && <p className="text-red-600 text-sm mt-2">⚠ {msg}</p>}
      <button className={`${btnPrimary} w-full mt-3`} disabled={m.isPending || !f.id_partida || !f.descripcion.trim() || !(Number(f.importe) > 0)} onClick={() => m.mutate()}>
        {m.isPending ? 'Reservando crédito...' : 'Crear y reservar preventivo'}
      </button>
    </Modal>
  );
}

function AvanzarModal({ gasto, onClose, onDone, onError }) {
  const acc = ACCION[gasto.estado];
  const [documento, setDocumento] = useState('');
  const [importe, setImporte] = useState(String(gasto.importe));
  const m = useMutation({
    mutationFn: () => contaduriaAPI.gastos.avanzar(gasto.id, { documento, importe: Number(importe) }),
    onSuccess: (r) => onDone(r.data),
    onError: (e) => onError(e.response?.data?.detail || 'Error'),
  });
  return (
    <Modal title={`${acc.label} — ${gasto.expediente}`} onClose={onClose}>
      <div className="space-y-3">
        <p className="text-sm text-gray-500">{gasto.descripcion} · {fmt(gasto.importe)}</p>
        <Field label={acc.doc}><input className={inputClass} value={documento} onChange={(e) => setDocumento(e.target.value)} /></Field>
        <Field label="Importe de la etapa"><input type="number" className={inputClass} value={importe} onChange={(e) => setImporte(e.target.value)} /></Field>
        <button className={`${btnPrimary} w-full`} disabled={m.isPending || !documento.trim() || !(Number(importe) > 0)} onClick={() => m.mutate()}>
          {m.isPending ? 'Registrando en presupuesto...' : `Confirmar: ${acc.label}`}
        </button>
      </div>
    </Modal>
  );
}

function AnularModal({ gasto, onClose, onDone, onError }) {
  const [motivo, setMotivo] = useState('');
  const m = useMutation({
    mutationFn: () => contaduriaAPI.gastos.anular(gasto.id, motivo),
    onSuccess: onDone,
    onError: (e) => onError(e.response?.data?.detail || 'Error'),
  });
  return (
    <Modal title={`Anular ${gasto.expediente}`} onClose={onClose}>
      <div className="space-y-3">
        <p className="text-sm text-gray-500">Libera la reserva de crédito en Presupuesto (contra-movimiento).</p>
        <Field label="Motivo"><input className={inputClass} value={motivo} onChange={(e) => setMotivo(e.target.value)} /></Field>
        <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium w-full" disabled={m.isPending} onClick={() => m.mutate()}>
          {m.isPending ? 'Anulando...' : 'Anular y liberar crédito'}
        </button>
      </div>
    </Modal>
  );
}
