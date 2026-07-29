import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apremiosAPI } from '../../services/api';
import PageHeader from '../../components/common/PageHeader';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Modal, Field, inputClass, btnPrimary, btnSecondary } from '../../components/common/CrudComponents';

const fmt = (v) => new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(v || 0));
const fdate = (v) => (v ? new Date(v).toLocaleDateString('es-AR') : '—');

const ESTADOS = ['iniciado', 'mandamiento', 'embargo', 'sentencia', 'cobrado', 'archivado'];
const ESTADO_COLOR = {
  iniciado: 'bg-gray-100 text-gray-700',
  mandamiento: 'bg-amber-100 text-amber-700',
  embargo: 'bg-orange-100 text-orange-700',
  sentencia: 'bg-blue-100 text-blue-700',
  cobrado: 'bg-green-100 text-green-700',
  archivado: 'bg-gray-200 text-gray-500',
};
// Transiciones válidas (espejo del backend)
const TRANSICIONES = {
  iniciado: ['mandamiento', 'archivado'],
  mandamiento: ['embargo', 'sentencia', 'archivado'],
  embargo: ['sentencia', 'cobrado', 'archivado'],
  sentencia: ['cobrado', 'embargo', 'archivado'],
  cobrado: ['archivado'],
  archivado: [],
};
const TIPOS_EMBARGO = ['inmueble', 'vehiculo', 'cuenta', 'sueldo'];

export default function Apremios() {
  const [selId, setSelId] = useState(null);
  return (
    <div>
      <PageHeader title="Apremios — Gestión Judicial de Deuda" subtitle="Juicios de apremio: mandamiento → embargo → sentencia → cobro" />
      {selId ? (
        <DetalleJuicio id={selId} onBack={() => setSelId(null)} />
      ) : (
        <ListaJuicios onSelect={setSelId} />
      )}
    </div>
  );
}

function ListaJuicios({ onSelect }) {
  const qc = useQueryClient();
  const [modal, setModal] = useState(false);
  const [fEstado, setFEstado] = useState('');
  const [fJuzgado, setFJuzgado] = useState('');
  const { data: juicios, isLoading } = useQuery({
    queryKey: ['apr-juicios', fEstado, fJuzgado],
    queryFn: () => apremiosAPI.juicios.list({ limit: 100, estado: fEstado || undefined, juzgado: fJuzgado || undefined }).then((r) => r.data),
  });
  const refetch = () => qc.invalidateQueries({ queryKey: ['apr-juicios'] });
  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2 justify-between">
        <div className="flex flex-wrap gap-2">
          <select className={`${inputClass} !mt-0 w-44`} value={fEstado} onChange={(e) => setFEstado(e.target.value)}>
            <option value="">Todos los estados</option>
            {ESTADOS.map((e) => <option key={e} value={e}>{e}</option>)}
          </select>
          <input className={`${inputClass} !mt-0 w-52`} placeholder="Filtrar por juzgado" value={fJuzgado} onChange={(e) => setFJuzgado(e.target.value)} />
        </div>
        <button className={btnPrimary} onClick={() => setModal(true)}>Nuevo juicio</button>
      </div>
      {isLoading ? <LoadingSpinner /> : (
        <div className="space-y-2">
          {juicios?.length ? juicios.map((j) => (
            <button key={j.id} onClick={() => onSelect(j.id)} className="w-full text-left bg-white rounded-xl border border-gray-200 p-4 hover:border-primary-400 transition">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <p className="text-sm font-semibold text-gray-800">{j.caratula}</p>
                  <p className="text-xs text-gray-500">{j.contribuyente_nombre || 's/nombre'} · {j.juzgado || 's/juzgado'} · Exp. {j.expediente_judicial || '—'}</p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${ESTADO_COLOR[j.estado] || ''}`}>{j.estado}</span>
                  <p className="text-xs text-gray-600 mt-1">Deuda: $ {fmt(j.deuda_actualizada || j.deuda_capital)}</p>
                </div>
              </div>
            </button>
          )) : <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">Sin juicios.</div>}
        </div>
      )}
      {modal && <JuicioModal onClose={() => setModal(false)} onDone={() => { setModal(false); refetch(); }} />}
    </div>
  );
}

function JuicioModal({ onClose, onDone }) {
  const [f, setF] = useState({ caratula: '', id_contribuyente: '', contribuyente_nombre: '', juzgado: '', expediente_judicial: '', deuda_capital: '' });
  const [msg, setMsg] = useState('');
  const m = useMutation({
    mutationFn: () => apremiosAPI.juicios.create({
      caratula: f.caratula,
      id_contribuyente: f.id_contribuyente ? Number(f.id_contribuyente) : null,
      contribuyente_nombre: f.contribuyente_nombre || null,
      juzgado: f.juzgado || null,
      expediente_judicial: f.expediente_judicial || null,
      deuda_capital: f.deuda_capital ? Number(f.deuda_capital) : 0,
    }),
    onSuccess: onDone,
    onError: (e) => setMsg(e.response?.data?.detail || 'Error'),
  });
  return (
    <Modal title="Nuevo juicio de apremio" onClose={onClose} wide>
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2"><Field label="Carátula"><input className={inputClass} value={f.caratula} onChange={(e) => setF({ ...f, caratula: e.target.value })} placeholder="Municipalidad c/ Pérez Juan s/ Apremio" /></Field></div>
        <Field label="ID Contribuyente"><input type="number" className={inputClass} value={f.id_contribuyente} onChange={(e) => setF({ ...f, id_contribuyente: e.target.value })} placeholder="para consultar deuda" /></Field>
        <Field label="Nombre contribuyente"><input className={inputClass} value={f.contribuyente_nombre} onChange={(e) => setF({ ...f, contribuyente_nombre: e.target.value })} /></Field>
        <Field label="Juzgado"><input className={inputClass} value={f.juzgado} onChange={(e) => setF({ ...f, juzgado: e.target.value })} /></Field>
        <Field label="Expediente judicial"><input className={inputClass} value={f.expediente_judicial} onChange={(e) => setF({ ...f, expediente_judicial: e.target.value })} /></Field>
        <Field label="Deuda capital (opc.)"><input type="number" className={inputClass} value={f.deuda_capital} onChange={(e) => setF({ ...f, deuda_capital: e.target.value })} placeholder="se consulta si se deja vacío" /></Field>
      </div>
      {msg && <p className="text-red-600 text-sm mt-2">⚠ {msg}</p>}
      <button className={`${btnPrimary} w-full mt-3`} disabled={m.isPending || !f.caratula.trim()} onClick={() => m.mutate()}>{m.isPending ? '...' : 'Iniciar juicio'}</button>
    </Modal>
  );
}

function DetalleJuicio({ id, onBack }) {
  const qc = useQueryClient();
  const [avanzar, setAvanzar] = useState(false);
  const [subModal, setSubModal] = useState(null); // 'embargo' | 'honorario' | 'mandamiento'
  const j = useQuery({ queryKey: ['apr-juicio', id], queryFn: () => apremiosAPI.juicios.get(id).then((r) => r.data) });
  const actos = useQuery({ queryKey: ['apr-actos', id], queryFn: () => apremiosAPI.actos.list(id).then((r) => r.data) });
  const embargos = useQuery({ queryKey: ['apr-embargos', id], queryFn: () => apremiosAPI.embargos.list(id).then((r) => r.data) });
  const honorarios = useQuery({ queryKey: ['apr-honorarios', id], queryFn: () => apremiosAPI.honorarios.list(id).then((r) => r.data) });
  const mandamientos = useQuery({ queryKey: ['apr-mandamientos', id], queryFn: () => apremiosAPI.mandamientos.list(id).then((r) => r.data) });
  const refetchAll = () => ['apr-juicio', 'apr-actos', 'apr-embargos', 'apr-honorarios', 'apr-mandamientos'].forEach((k) => qc.invalidateQueries({ queryKey: [k, id] }));

  if (j.isLoading) return <LoadingSpinner />;
  const juicio = j.data;
  const transiciones = TRANSICIONES[juicio.estado] || [];

  return (
    <div>
      <button className={`${btnSecondary} mb-3`} onClick={onBack}>← Volver al listado</button>
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
        <div className="flex items-start justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{juicio.caratula}</h3>
            <p className="text-sm text-gray-500">{juicio.contribuyente_nombre || 's/nombre'} · {juicio.juzgado || 's/juzgado'} · Exp. {juicio.expediente_judicial || '—'}</p>
            <p className="text-xs text-gray-500 mt-1">Inicio: {fdate(juicio.fecha_inicio)} · Capital: $ {fmt(juicio.deuda_capital)} · Actualizada: $ {fmt(juicio.deuda_actualizada)}</p>
          </div>
          <div className="text-right">
            <span className={`px-2 py-1 rounded text-xs font-medium ${ESTADO_COLOR[juicio.estado] || ''}`}>{juicio.estado}</span>
            {transiciones.length > 0 && <div className="mt-2"><button className={btnPrimary} onClick={() => setAvanzar(true)}>Avanzar estado</button></div>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Panel title="Actos procesales (timeline)">
          {actos.isLoading ? <LoadingSpinner /> : (
            <ol className="relative border-l border-gray-200 ml-2">
              {actos.data?.length ? actos.data.map((a) => (
                <li key={a.id} className="mb-4 ml-4">
                  <span className="absolute w-2.5 h-2.5 bg-primary-400 rounded-full -left-[6px] mt-1.5" />
                  <p className="text-sm font-medium text-gray-800">{a.tipo}</p>
                  <p className="text-xs text-gray-400">{fdate(a.fecha)}</p>
                  {a.detalle && <p className="text-xs text-gray-600">{a.detalle}</p>}
                </li>
              )) : <p className="text-sm text-gray-400 ml-4">Sin actos.</p>}
            </ol>
          )}
        </Panel>

        <Panel title="Embargos" onAdd={() => setSubModal('embargo')}>
          {embargos.data?.length ? embargos.data.map((e) => (
            <div key={e.id} className="flex justify-between text-sm border-b border-gray-100 py-1.5">
              <span><b className="capitalize">{e.tipo}</b> — {e.bien_descripcion || '—'} <span className="text-xs text-gray-400">({e.estado})</span></span>
              <span className="text-gray-700">$ {fmt(e.importe)}</span>
            </div>
          )) : <p className="text-sm text-gray-400">Sin embargos.</p>}
        </Panel>

        <Panel title="Honorarios" onAdd={() => setSubModal('honorario')}>
          {honorarios.data?.length ? honorarios.data.map((h) => (
            <div key={h.id} className="flex justify-between text-sm border-b border-gray-100 py-1.5">
              <span>{h.profesional} <span className="text-xs text-gray-400">({fmt(h.porcentaje)}%)</span></span>
              <span className={h.pagado ? 'text-green-600' : 'text-gray-700'}>$ {fmt(h.importe)} {h.pagado ? '✓' : ''}</span>
            </div>
          )) : <p className="text-sm text-gray-400">Sin honorarios.</p>}
        </Panel>

        <Panel title="Mandamientos" onAdd={() => setSubModal('mandamiento')}>
          {mandamientos.data?.length ? mandamientos.data.map((mm) => (
            <div key={mm.id} className="text-sm border-b border-gray-100 py-1.5">
              <div className="flex justify-between"><span>{mm.oficial || 'Oficial s/dato'}</span><span className="text-xs text-gray-400">{fdate(mm.fecha)}</span></div>
              {mm.resultado && <p className="text-xs text-gray-600">{mm.resultado}</p>}
            </div>
          )) : <p className="text-sm text-gray-400">Sin mandamientos.</p>}
        </Panel>
      </div>

      {avanzar && <AvanzarModal id={id} estado={juicio.estado} transiciones={transiciones} onClose={() => setAvanzar(false)} onDone={() => { setAvanzar(false); refetchAll(); }} />}
      {subModal === 'embargo' && <EmbargoModal id={id} onClose={() => setSubModal(null)} onDone={() => { setSubModal(null); refetchAll(); }} />}
      {subModal === 'honorario' && <HonorarioModal id={id} onClose={() => setSubModal(null)} onDone={() => { setSubModal(null); refetchAll(); }} />}
      {subModal === 'mandamiento' && <MandamientoModal id={id} onClose={() => setSubModal(null)} onDone={() => { setSubModal(null); refetchAll(); }} />}
    </div>
  );
}

function Panel({ title, children, onAdd }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-semibold text-gray-700">{title}</h4>
        {onAdd && <button className={btnSecondary} onClick={onAdd}>+ Agregar</button>}
      </div>
      {children}
    </div>
  );
}

function AvanzarModal({ id, estado, transiciones, onClose, onDone }) {
  const [f, setF] = useState({ estado: transiciones[0] || '', detalle: '' });
  const [msg, setMsg] = useState('');
  const m = useMutation({
    mutationFn: () => apremiosAPI.juicios.avanzar(id, { estado: f.estado, detalle: f.detalle || null }),
    onSuccess: onDone,
    onError: (e) => setMsg(e.response?.data?.detail || 'Error'),
  });
  return (
    <Modal title={`Avanzar juicio (desde '${estado}')`} onClose={onClose}>
      <Field label="Nuevo estado">
        <select className={inputClass} value={f.estado} onChange={(e) => setF({ ...f, estado: e.target.value })}>
          {transiciones.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </Field>
      <div className="mt-3"><Field label="Detalle del acto"><input className={inputClass} value={f.detalle} onChange={(e) => setF({ ...f, detalle: e.target.value })} /></Field></div>
      {msg && <p className="text-red-600 text-sm mt-2">⚠ {msg}</p>}
      <button className={`${btnPrimary} w-full mt-3`} disabled={m.isPending || !f.estado} onClick={() => m.mutate()}>{m.isPending ? '...' : 'Avanzar'}</button>
    </Modal>
  );
}

function EmbargoModal({ id, onClose, onDone }) {
  const [f, setF] = useState({ tipo: 'inmueble', bien_descripcion: '', importe: '', estado: 'trabado' });
  const [msg, setMsg] = useState('');
  const m = useMutation({
    mutationFn: () => apremiosAPI.embargos.create(id, { tipo: f.tipo, bien_descripcion: f.bien_descripcion || null, importe: Number(f.importe) || 0, estado: f.estado }),
    onSuccess: onDone, onError: (e) => setMsg(e.response?.data?.detail || 'Error'),
  });
  return (
    <Modal title="Nuevo embargo" onClose={onClose}>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Tipo"><select className={inputClass} value={f.tipo} onChange={(e) => setF({ ...f, tipo: e.target.value })}>{TIPOS_EMBARGO.map((t) => <option key={t} value={t}>{t}</option>)}</select></Field>
        <Field label="Importe"><input type="number" className={inputClass} value={f.importe} onChange={(e) => setF({ ...f, importe: e.target.value })} /></Field>
        <div className="col-span-2"><Field label="Bien / descripción"><input className={inputClass} value={f.bien_descripcion} onChange={(e) => setF({ ...f, bien_descripcion: e.target.value })} /></Field></div>
        <Field label="Estado"><input className={inputClass} value={f.estado} onChange={(e) => setF({ ...f, estado: e.target.value })} /></Field>
      </div>
      {msg && <p className="text-red-600 text-sm mt-2">⚠ {msg}</p>}
      <button className={`${btnPrimary} w-full mt-3`} disabled={m.isPending} onClick={() => m.mutate()}>{m.isPending ? '...' : 'Registrar embargo'}</button>
    </Modal>
  );
}

function HonorarioModal({ id, onClose, onDone }) {
  const [f, setF] = useState({ profesional: '', porcentaje: '', importe: '', pagado: false });
  const [msg, setMsg] = useState('');
  const m = useMutation({
    mutationFn: () => apremiosAPI.honorarios.create(id, { profesional: f.profesional, porcentaje: Number(f.porcentaje) || 0, importe: Number(f.importe) || 0, pagado: f.pagado }),
    onSuccess: onDone, onError: (e) => setMsg(e.response?.data?.detail || 'Error'),
  });
  return (
    <Modal title="Nuevo honorario" onClose={onClose}>
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2"><Field label="Profesional"><input className={inputClass} value={f.profesional} onChange={(e) => setF({ ...f, profesional: e.target.value })} /></Field></div>
        <Field label="Porcentaje %"><input type="number" className={inputClass} value={f.porcentaje} onChange={(e) => setF({ ...f, porcentaje: e.target.value })} /></Field>
        <Field label="Importe"><input type="number" className={inputClass} value={f.importe} onChange={(e) => setF({ ...f, importe: e.target.value })} /></Field>
        <label className="col-span-2 flex items-center gap-2 text-sm"><input type="checkbox" checked={f.pagado} onChange={(e) => setF({ ...f, pagado: e.target.checked })} /> Pagado</label>
      </div>
      {msg && <p className="text-red-600 text-sm mt-2">⚠ {msg}</p>}
      <button className={`${btnPrimary} w-full mt-3`} disabled={m.isPending || !f.profesional.trim()} onClick={() => m.mutate()}>{m.isPending ? '...' : 'Registrar honorario'}</button>
    </Modal>
  );
}

function MandamientoModal({ id, onClose, onDone }) {
  const [f, setF] = useState({ oficial: '', resultado: '' });
  const [msg, setMsg] = useState('');
  const m = useMutation({
    mutationFn: () => apremiosAPI.mandamientos.create(id, { oficial: f.oficial || null, resultado: f.resultado || null }),
    onSuccess: onDone, onError: (e) => setMsg(e.response?.data?.detail || 'Error'),
  });
  return (
    <Modal title="Nuevo mandamiento" onClose={onClose}>
      <Field label="Oficial de justicia"><input className={inputClass} value={f.oficial} onChange={(e) => setF({ ...f, oficial: e.target.value })} /></Field>
      <div className="mt-3"><Field label="Resultado del diligenciamiento"><input className={inputClass} value={f.resultado} onChange={(e) => setF({ ...f, resultado: e.target.value })} /></Field></div>
      {msg && <p className="text-red-600 text-sm mt-2">⚠ {msg}</p>}
      <button className={`${btnPrimary} w-full mt-3`} disabled={m.isPending} onClick={() => m.mutate()}>{m.isPending ? '...' : 'Registrar mandamiento'}</button>
    </Modal>
  );
}
