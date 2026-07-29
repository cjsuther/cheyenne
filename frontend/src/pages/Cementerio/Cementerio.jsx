import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cementerioAPI } from '../../services/api';
import { useTabParam } from '../../hooks/useTabParam';
import PageHeader from '../../components/common/PageHeader';
import GroupedTabBar from '../../components/common/GroupedTabBar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { CrudTab, Modal, Field, inputClass, btnPrimary, btnSecondary } from '../../components/common/CrudComponents';

const fmt = (v) => new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(v || 0));
const hoy = () => new Date().toISOString().slice(0, 10);

const TIPOS_SEP = [
  { value: 'nicho', label: 'Nicho' }, { value: 'parcela', label: 'Parcela' },
  { value: 'boveda', label: 'Bóveda' }, { value: 'tierra', label: 'Tierra' },
];
const ESTADOS_SEP = [
  { value: 'libre', label: 'Libre' }, { value: 'ocupada', label: 'Ocupada' }, { value: 'reservada', label: 'Reservada' },
];

const TABS = [
  { key: 'sepulturas', label: 'Sepulturas' },
  { key: 'concesiones', label: 'Concesiones' },
  { key: 'circuito', label: 'Inhumaciones/Traslados' },
  { key: 'tasas', label: 'Tasas' },
  { key: 'difuntos', label: 'Difuntos' },
  { key: 'ocupacion', label: 'Ocupación' },
];
const GRUPOS = [
  { label: 'Gestión', keys: ['sepulturas', 'concesiones', 'circuito', 'tasas'] },
  { label: 'Consulta', keys: ['difuntos', 'ocupacion'] },
];

export default function Cementerio() {
  const [tab, setTab] = useTabParam('sepulturas');
  return (
    <div>
      <PageHeader title="Cementerio Municipal" subtitle="Sepulturas, concesiones, inhumaciones, traslados y tasas de mantenimiento" />
      <GroupedTabBar grupos={GRUPOS} tabsMeta={TABS} tab={tab} setTab={setTab} />
      {tab === 'sepulturas' && (
        <CrudTab queryKey="cem-sep" apiFns={cementerioAPI.sepulturas} entityName="Sepultura"
          columns={[
            { key: 'tipo', label: 'Tipo' }, { key: 'seccion', label: 'Sección' }, { key: 'fila', label: 'Fila' },
            { key: 'numero', label: 'Número' },
            { key: 'estado', label: 'Estado', render: (v) => <EstadoBadge estado={v} mapa={ESTADO_SEP_CHIP} /> },
            { key: 'activo', label: 'Activa', render: (v) => (v ? 'Sí' : 'Baja') },
          ]}
          formFields={[
            { key: 'tipo', label: 'Tipo', type: 'select', options: TIPOS_SEP, required: true, defaultValue: 'nicho' },
            { key: 'seccion', label: 'Sección' }, { key: 'fila', label: 'Fila' },
            { key: 'numero', label: 'Número', required: true },
            { key: 'estado', label: 'Estado', type: 'select', options: ESTADOS_SEP, defaultValue: 'libre' },
            { key: 'observaciones', label: 'Observaciones', type: 'textarea' },
            { key: 'activo', label: 'Activa', type: 'boolean', defaultValue: true },
          ]} />
      )}
      {tab === 'concesiones' && <ConcesionesTab />}
      {tab === 'circuito' && <CircuitoTab />}
      {tab === 'tasas' && <TasasTab />}
      {tab === 'difuntos' && (
        <CrudTab queryKey="cem-dif" apiFns={cementerioAPI.difuntos} entityName="Difunto"
          columns={[
            { key: 'nombre', label: 'Nombre' }, { key: 'documento', label: 'Documento' },
            { key: 'fecha_fallecimiento', label: 'Fallecimiento' }, { key: 'fecha_inhumacion', label: 'Inhumación' },
            { key: 'activo', label: 'Estado', render: (v) => (v ? 'Activo' : 'Baja') },
          ]}
          formFields={[
            { key: 'nombre', label: 'Nombre', required: true }, { key: 'documento', label: 'Documento' },
            { key: 'fecha_fallecimiento', label: 'Fecha de fallecimiento', type: 'date' },
            { key: 'fecha_inhumacion', label: 'Fecha de inhumación', type: 'date' },
            { key: 'observaciones', label: 'Observaciones', type: 'textarea' },
            { key: 'activo', label: 'Activo', type: 'boolean', defaultValue: true },
          ]} />
      )}
      {tab === 'ocupacion' && <OcupacionTab />}
    </div>
  );
}

const ESTADO_SEP_CHIP = { libre: 'bg-green-100 text-green-700', ocupada: 'bg-red-100 text-red-700', reservada: 'bg-amber-100 text-amber-700' };
const ESTADO_CON_CHIP = { vigente: 'bg-green-100 text-green-700', vencida: 'bg-amber-100 text-amber-700', caduca: 'bg-gray-200 text-gray-500' };
const ESTADO_TASA_CHIP = { pendiente: 'bg-amber-100 text-amber-700', pagada: 'bg-green-100 text-green-700' };

function EstadoBadge({ estado, mapa }) {
  return <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${mapa[estado] || 'bg-gray-100'}`}>{estado}</span>;
}

const sepLabel = (s) => `${s.numero}${s.seccion ? ` · Sec ${s.seccion}` : ''}${s.fila ? ` · F ${s.fila}` : ''} (${s.tipo})`;

// ═══════════════════════════ CONCESIONES ═══════════════════════════
function ConcesionesTab() {
  const qc = useQueryClient();
  const [modal, setModal] = useState(null);
  const [error, setError] = useState('');
  const { data: cons, isLoading } = useQuery({ queryKey: ['cem-con'], queryFn: () => cementerioAPI.concesiones.list({ limit: 200 }).then((r) => r.data) });
  const refetch = () => { qc.invalidateQueries({ queryKey: ['cem-con'] }); qc.invalidateQueries({ queryKey: ['cem-sep'] }); };
  return (
    <div>
      {error && <div className="mb-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2 flex justify-between"><span>⚠ {error}</span><button onClick={() => setError('')} className="text-red-500">✕</button></div>}
      <div className="mb-3 flex justify-end"><button className={btnPrimary} onClick={() => setModal('nueva')}>Nueva concesión</button></div>
      {isLoading ? <LoadingSpinner /> : (
        <div className="space-y-2">
          {cons?.length ? cons.map((c) => (
            <div key={c.id} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <p className="text-sm font-semibold text-gray-800">{c.titular_nombre}</p>
                  <p className="text-xs text-gray-500">{c.sepultura ? sepLabel(c.sepultura) : `sepultura #${c.id_sepultura}`}{c.anios ? ` · ${c.anios} años` : ''}{c.acto ? ` · ${c.acto}` : ''}</p>
                </div>
                <EstadoBadge estado={c.estado} mapa={ESTADO_CON_CHIP} />
              </div>
            </div>
          )) : <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">Sin concesiones.</div>}
        </div>
      )}
      {modal === 'nueva' && <ConcesionModal onClose={() => setModal(null)} onDone={() => { setModal(null); refetch(); }} onError={setError} />}
    </div>
  );
}

function ConcesionModal({ onClose, onDone, onError }) {
  const { data: seps } = useQuery({ queryKey: ['cem-sep-sel'], queryFn: () => cementerioAPI.sepulturas.list({ limit: 200 }).then((r) => r.data) });
  const [f, setF] = useState({ id_sepultura: '', titular_nombre: '', titular_documento: '', id_contribuyente: '', fecha_desde: hoy(), anios: '', acto: '' });
  const [msg, setMsg] = useState('');
  const libres = (seps || []).filter((s) => s.activo && s.estado !== 'ocupada');
  const m = useMutation({
    mutationFn: () => cementerioAPI.concesiones.create({
      id_sepultura: Number(f.id_sepultura), titular_nombre: f.titular_nombre, titular_documento: f.titular_documento || null,
      id_contribuyente: f.id_contribuyente ? Number(f.id_contribuyente) : null,
      fecha_desde: f.fecha_desde || null, anios: f.anios ? Number(f.anios) : null, acto: f.acto || null, estado: 'vigente',
    }),
    onSuccess: onDone, onError: (e) => setMsg(e.response?.data?.detail || 'Error'),
  });
  return (
    <Modal title="Nueva concesión" onClose={onClose} wide>
      <Field label="Sepultura (solo libres/reservadas)"><select className={inputClass} value={f.id_sepultura} onChange={(e) => setF({ ...f, id_sepultura: e.target.value })}><option value="">Seleccionar...</option>{libres.map((s) => <option key={s.id} value={s.id}>{sepLabel(s)} — {s.estado}</option>)}</select></Field>
      <div className="grid grid-cols-2 gap-3 mt-2">
        <Field label="Titular"><input className={inputClass} value={f.titular_nombre} onChange={(e) => setF({ ...f, titular_nombre: e.target.value })} /></Field>
        <Field label="Documento titular"><input className={inputClass} value={f.titular_documento} onChange={(e) => setF({ ...f, titular_documento: e.target.value })} /></Field>
        <Field label="ID contribuyente (opcional)"><input type="number" className={inputClass} value={f.id_contribuyente} onChange={(e) => setF({ ...f, id_contribuyente: e.target.value })} /></Field>
        <Field label="Acto (resolución/decreto)"><input className={inputClass} value={f.acto} onChange={(e) => setF({ ...f, acto: e.target.value })} /></Field>
        <Field label="Fecha desde"><input type="date" className={inputClass} value={f.fecha_desde} onChange={(e) => setF({ ...f, fecha_desde: e.target.value })} /></Field>
        <Field label="Años"><input type="number" className={inputClass} value={f.anios} onChange={(e) => setF({ ...f, anios: e.target.value })} /></Field>
      </div>
      {msg && <p className="text-red-600 text-sm mt-2">⚠ {msg}</p>}
      <button className={`${btnPrimary} w-full mt-3`} disabled={m.isPending || !f.id_sepultura || !f.titular_nombre.trim()} onClick={() => m.mutate()}>{m.isPending ? '...' : 'Otorgar concesión'}</button>
    </Modal>
  );
}

// ═══════════════════════════ CIRCUITO (INHUMACIONES / TRASLADOS) ═══════════════════════════
function CircuitoTab() {
  const qc = useQueryClient();
  const [modal, setModal] = useState(null);
  const [error, setError] = useState('');
  const { data: inhums, isLoading } = useQuery({ queryKey: ['cem-inh'], queryFn: () => cementerioAPI.inhumaciones.list({ limit: 100 }).then((r) => r.data) });
  const { data: trasl } = useQuery({ queryKey: ['cem-tra'], queryFn: () => cementerioAPI.traslados.list({ limit: 100 }).then((r) => r.data) });
  const refetch = () => { qc.invalidateQueries({ queryKey: ['cem-inh'] }); qc.invalidateQueries({ queryKey: ['cem-tra'] }); qc.invalidateQueries({ queryKey: ['cem-sep'] }); qc.invalidateQueries({ queryKey: ['cem-dif'] }); qc.invalidateQueries({ queryKey: ['cem-ocup'] }); };
  return (
    <div>
      {error && <div className="mb-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2 flex justify-between"><span>⚠ {error}</span><button onClick={() => setError('')} className="text-red-500">✕</button></div>}
      <div className="mb-3 flex justify-end gap-2">
        <button className={btnSecondary} onClick={() => setModal('traslado')}>Registrar traslado</button>
        <button className={btnPrimary} onClick={() => setModal('inhumacion')}>Registrar inhumación</button>
      </div>
      {isLoading ? <LoadingSpinner /> : (
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-1">Inhumaciones / Exhumaciones</p>
            <div className="space-y-1.5">
              {inhums?.length ? inhums.map((i) => (
                <div key={i.id} className="bg-white rounded-xl border border-gray-200 p-3">
                  <p className="text-sm font-semibold">{i.difunto?.nombre || `difunto #${i.id_difunto}`}</p>
                  <p className="text-xs text-gray-500">{i.tipo} · {i.sepultura ? sepLabel(i.sepultura) : `sep #${i.id_sepultura}`}{i.fecha ? ` · ${i.fecha}` : ''}</p>
                </div>
              )) : <div className="bg-white rounded-xl border border-gray-200 p-6 text-center text-gray-400 text-sm">Sin inhumaciones.</div>}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-1">Traslados</p>
            <div className="space-y-1.5">
              {trasl?.length ? trasl.map((t) => (
                <div key={t.id} className="bg-white rounded-xl border border-gray-200 p-3">
                  <p className="text-sm font-semibold">{t.difunto?.nombre || `difunto #${t.id_difunto}`}</p>
                  <p className="text-xs text-gray-500">{t.origen ? t.origen.numero : '—'} → {t.destino?.numero}{t.motivo ? ` · ${t.motivo}` : ''}{t.fecha ? ` · ${t.fecha}` : ''}</p>
                </div>
              )) : <div className="bg-white rounded-xl border border-gray-200 p-6 text-center text-gray-400 text-sm">Sin traslados.</div>}
            </div>
          </div>
        </div>
      )}
      {modal === 'inhumacion' && <InhumacionModal onClose={() => setModal(null)} onDone={() => { setModal(null); refetch(); }} />}
      {modal === 'traslado' && <TrasladoModal onClose={() => setModal(null)} onDone={() => { setModal(null); refetch(); }} />}
    </div>
  );
}

function InhumacionModal({ onClose, onDone }) {
  const { data: difs } = useQuery({ queryKey: ['cem-dif-sel'], queryFn: () => cementerioAPI.difuntos.list({ limit: 200 }).then((r) => r.data) });
  const { data: seps } = useQuery({ queryKey: ['cem-sep-sel'], queryFn: () => cementerioAPI.sepulturas.list({ limit: 200 }).then((r) => r.data) });
  const [f, setF] = useState({ id_difunto: '', id_sepultura: '', fecha: hoy(), tipo: 'inhumacion' });
  const [msg, setMsg] = useState('');
  const libres = (seps || []).filter((s) => s.activo && s.estado !== 'ocupada');
  const m = useMutation({
    mutationFn: () => cementerioAPI.inhumaciones.create({ id_difunto: Number(f.id_difunto), id_sepultura: Number(f.id_sepultura), fecha: f.fecha || null, tipo: f.tipo }),
    onSuccess: onDone, onError: (e) => setMsg(e.response?.data?.detail || 'Error'),
  });
  const listaSep = f.tipo === 'inhumacion' ? libres : (seps || []).filter((s) => s.activo);
  return (
    <Modal title="Registrar inhumación" onClose={onClose}>
      <Field label="Difunto"><select className={inputClass} value={f.id_difunto} onChange={(e) => setF({ ...f, id_difunto: e.target.value })}><option value="">Seleccionar...</option>{(difs || []).filter((d) => d.activo).map((d) => <option key={d.id} value={d.id}>{d.nombre}{d.documento ? ` (${d.documento})` : ''}</option>)}</select></Field>
      <Field label="Tipo"><select className={inputClass} value={f.tipo} onChange={(e) => setF({ ...f, tipo: e.target.value, id_sepultura: '' })}><option value="inhumacion">Inhumación</option><option value="exhumacion">Exhumación</option><option value="reduccion">Reducción</option></select></Field>
      <Field label="Sepultura"><select className={inputClass} value={f.id_sepultura} onChange={(e) => setF({ ...f, id_sepultura: e.target.value })}><option value="">Seleccionar...</option>{listaSep.map((s) => <option key={s.id} value={s.id}>{sepLabel(s)} — {s.estado}</option>)}</select></Field>
      <Field label="Fecha"><input type="date" className={inputClass} value={f.fecha} onChange={(e) => setF({ ...f, fecha: e.target.value })} /></Field>
      {msg && <p className="text-red-600 text-sm mt-2">⚠ {msg}</p>}
      <button className={`${btnPrimary} w-full mt-3`} disabled={m.isPending || !f.id_difunto || !f.id_sepultura} onClick={() => m.mutate()}>{m.isPending ? '...' : 'Registrar'}</button>
    </Modal>
  );
}

function TrasladoModal({ onClose, onDone }) {
  const { data: difs } = useQuery({ queryKey: ['cem-dif-sel'], queryFn: () => cementerioAPI.difuntos.list({ limit: 200 }).then((r) => r.data) });
  const { data: seps } = useQuery({ queryKey: ['cem-sep-sel'], queryFn: () => cementerioAPI.sepulturas.list({ limit: 200 }).then((r) => r.data) });
  const [f, setF] = useState({ id_difunto: '', id_sepultura_destino: '', fecha: hoy(), motivo: '' });
  const [msg, setMsg] = useState('');
  const destinos = (seps || []).filter((s) => s.activo && s.estado !== 'ocupada');
  const m = useMutation({
    mutationFn: () => cementerioAPI.traslados.create({ id_difunto: Number(f.id_difunto), id_sepultura_destino: Number(f.id_sepultura_destino), fecha: f.fecha || null, motivo: f.motivo || null }),
    onSuccess: onDone, onError: (e) => setMsg(e.response?.data?.detail || 'Error'),
  });
  return (
    <Modal title="Registrar traslado" onClose={onClose}>
      <Field label="Difunto"><select className={inputClass} value={f.id_difunto} onChange={(e) => setF({ ...f, id_difunto: e.target.value })}><option value="">Seleccionar...</option>{(difs || []).filter((d) => d.activo).map((d) => <option key={d.id} value={d.id}>{d.nombre}{d.documento ? ` (${d.documento})` : ''}</option>)}</select></Field>
      <Field label="Sepultura destino (libre)"><select className={inputClass} value={f.id_sepultura_destino} onChange={(e) => setF({ ...f, id_sepultura_destino: e.target.value })}><option value="">Seleccionar...</option>{destinos.map((s) => <option key={s.id} value={s.id}>{sepLabel(s)} — {s.estado}</option>)}</select></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Fecha"><input type="date" className={inputClass} value={f.fecha} onChange={(e) => setF({ ...f, fecha: e.target.value })} /></Field>
        <Field label="Motivo"><input className={inputClass} value={f.motivo} onChange={(e) => setF({ ...f, motivo: e.target.value })} /></Field>
      </div>
      {msg && <p className="text-red-600 text-sm mt-2">⚠ {msg}</p>}
      <button className={`${btnPrimary} w-full mt-3`} disabled={m.isPending || !f.id_difunto || !f.id_sepultura_destino} onClick={() => m.mutate()}>{m.isPending ? '...' : 'Trasladar'}</button>
    </Modal>
  );
}

// ═══════════════════════════ TASAS ═══════════════════════════
function TasasTab() {
  const qc = useQueryClient();
  const [modal, setModal] = useState(null);
  const [error, setError] = useState('');
  const { data: tasas, isLoading } = useQuery({ queryKey: ['cem-tasa'], queryFn: () => cementerioAPI.tasas.list({ limit: 200 }).then((r) => r.data) });
  const refetch = () => qc.invalidateQueries({ queryKey: ['cem-tasa'] });
  const pagarMut = useMutation({ mutationFn: (id) => cementerioAPI.tasas.pagar(id), onSuccess: refetch, onError: (e) => setError(e.response?.data?.detail || 'Error') });
  return (
    <div>
      {error && <div className="mb-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2 flex justify-between"><span>⚠ {error}</span><button onClick={() => setError('')} className="text-red-500">✕</button></div>}
      <div className="mb-3 flex justify-end"><button className={btnPrimary} onClick={() => setModal('liquidar')}>Liquidar tasa</button></div>
      {isLoading ? <LoadingSpinner /> : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
          <table className="min-w-full text-left text-xs">
            <thead><tr className="border-b bg-gray-50/70 text-gray-500 uppercase">{['Concesión', 'Período', 'Concepto', 'Importe', 'Vencimiento', 'Estado', 'Acciones'].map((h) => <th key={h} className="px-3 py-2.5 font-semibold">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-gray-50">
              {tasas?.length ? tasas.map((t) => (
                <tr key={t.id} className="hover:bg-primary-50/40">
                  <td className="px-3 py-2">#{t.id_concesion}</td><td className="px-3 py-2">{t.periodo}</td><td className="px-3 py-2">{t.concepto}</td>
                  <td className="px-3 py-2 text-right pr-6 font-semibold">{fmt(t.importe)}</td><td className="px-3 py-2">{t.vencimiento || '—'}</td>
                  <td className="px-3 py-2"><EstadoBadge estado={t.estado} mapa={ESTADO_TASA_CHIP} /></td>
                  <td className="px-3 py-2">{t.estado === 'pendiente' && <button className="text-green-600 border border-green-200 rounded px-2 py-0.5" onClick={() => pagarMut.mutate(t.id)}>Marcar pagada</button>}</td>
                </tr>
              )) : <tr><td colSpan={7} className="px-3 py-8 text-center text-gray-400">Sin tasas liquidadas.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
      {modal === 'liquidar' && <LiquidarTasaModal onClose={() => setModal(null)} onDone={() => { setModal(null); refetch(); }} />}
    </div>
  );
}

function LiquidarTasaModal({ onClose, onDone }) {
  const { data: cons } = useQuery({ queryKey: ['cem-con'], queryFn: () => cementerioAPI.concesiones.list({ limit: 200 }).then((r) => r.data) });
  const [f, setF] = useState({ id_concesion: '', periodo: String(new Date().getFullYear()), concepto: 'Tasa de mantenimiento de cementerio', importe: '', vencimiento: '' });
  const [msg, setMsg] = useState('');
  const m = useMutation({
    mutationFn: () => cementerioAPI.tasas.liquidar({ id_concesion: Number(f.id_concesion), periodo: f.periodo, concepto: f.concepto || null, importe: Number(f.importe), vencimiento: f.vencimiento || null }),
    onSuccess: onDone, onError: (e) => setMsg(e.response?.data?.detail || 'Error'),
  });
  return (
    <Modal title="Liquidar tasa de cementerio" onClose={onClose}>
      <Field label="Concesión"><select className={inputClass} value={f.id_concesion} onChange={(e) => setF({ ...f, id_concesion: e.target.value })}><option value="">Seleccionar...</option>{(cons || []).filter((c) => c.activo).map((c) => <option key={c.id} value={c.id}>#{c.id} — {c.titular_nombre}{c.sepultura ? ` (${c.sepultura.numero})` : ''}</option>)}</select></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Período"><input className={inputClass} value={f.periodo} onChange={(e) => setF({ ...f, periodo: e.target.value })} placeholder="2026" /></Field>
        <Field label="Importe"><input type="number" className={inputClass} value={f.importe} onChange={(e) => setF({ ...f, importe: e.target.value })} /></Field>
      </div>
      <Field label="Concepto"><input className={inputClass} value={f.concepto} onChange={(e) => setF({ ...f, concepto: e.target.value })} /></Field>
      <Field label="Vencimiento"><input type="date" className={inputClass} value={f.vencimiento} onChange={(e) => setF({ ...f, vencimiento: e.target.value })} /></Field>
      {msg && <p className="text-red-600 text-sm mt-2">⚠ {msg}</p>}
      <button className={`${btnPrimary} w-full mt-3`} disabled={m.isPending || !f.id_concesion || !f.periodo.trim() || !(Number(f.importe) > 0)} onClick={() => m.mutate()}>{m.isPending ? '...' : 'Liquidar'}</button>
    </Modal>
  );
}

// ═══════════════════════════ OCUPACIÓN ═══════════════════════════
function OcupacionTab() {
  const { data, isLoading } = useQuery({ queryKey: ['cem-ocup'], queryFn: () => cementerioAPI.ocupacion().then((r) => r.data) });
  if (isLoading) return <LoadingSpinner />;
  if (!data) return null;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { l: 'Total', v: data.total, c: 'text-gray-800' },
          { l: 'Libres', v: data.libres, c: 'text-green-700' },
          { l: 'Ocupadas', v: data.ocupadas, c: 'text-red-700' },
          { l: 'Reservadas', v: data.reservadas, c: 'text-amber-700' },
        ].map((k) => (
          <div key={k.l} className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500">{k.l}</p>
            <p className={`text-2xl font-bold ${k.c}`}>{k.v}</p>
          </div>
        ))}
      </div>
      <div>
        <p className="text-xs font-semibold text-gray-500 mb-1">Ocupación por sección</p>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
          <table className="min-w-full text-left text-xs">
            <thead><tr className="border-b bg-gray-50/70 text-gray-500 uppercase">{['Sección', 'Libres', 'Ocupadas', 'Reservadas', 'Total'].map((h) => <th key={h} className="px-3 py-2.5 font-semibold">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-gray-50">
              {data.por_seccion?.length ? data.por_seccion.map((s) => (
                <tr key={s.seccion} className="hover:bg-primary-50/40">
                  <td className="px-3 py-2 font-medium">{s.seccion}</td>
                  <td className="px-3 py-2 text-green-700">{s.libre || 0}</td>
                  <td className="px-3 py-2 text-red-700">{s.ocupada || 0}</td>
                  <td className="px-3 py-2 text-amber-700">{s.reservada || 0}</td>
                  <td className="px-3 py-2 font-semibold">{s.total}</td>
                </tr>
              )) : <tr><td colSpan={5} className="px-3 py-8 text-center text-gray-400">Sin sepulturas cargadas.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
