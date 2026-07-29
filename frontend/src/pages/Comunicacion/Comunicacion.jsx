import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTabParam } from '../../hooks/useTabParam';
import { comunicacionAPI } from '../../services/api';
import PageHeader from '../../components/common/PageHeader';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { CrudTab, Modal, Field, inputClass, btnPrimary, btnSecondary } from '../../components/common/CrudComponents';

const listaQuery = (tipo) => () => comunicacionAPI.listas.list({ tipo }).then((r) => r.data);

const TABS = [
  { key: 'bandeja', label: 'Bandeja' },
  { key: 'directo', label: 'Envío directo' },
  { key: 'plantillas', label: 'Plantillas' },
  { key: 'masivo', label: 'Envío masivo' },
  { key: 'mensajes', label: 'Mensajes (ABM)' },
  { key: 'listas', label: 'Listas' },
];

export default function Comunicacion() {
  const [tab, setTab] = useTabParam('bandeja');
  return (
    <div>
      <PageHeader title="Comunicación" subtitle="Mensajería, envío por email y plantillas" />
      <div className="flex gap-1.5 mb-4 overflow-x-auto pb-2 -mx-1 px-1">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
              tab === t.key ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tab === 'bandeja' && <BandejaTab />}
      {tab === 'directo' && <EnvioDirectoTab />}
      {tab === 'plantillas' && <PlantillasTab />}
      {tab === 'masivo' && <MasivoTab />}
      {tab === 'mensajes' && <MensajesTab />}
      {tab === 'listas' && <ListasTab />}
    </div>
  );
}

// ── Bandeja: estado + reintentar + ver intentos ────────────────────
const ESTADO_BADGE = {
  EST_ENVIADO: 'bg-green-100 text-green-700',
  EST_RECIBIDO: 'bg-green-100 text-green-700',
  EST_LEIDO: 'bg-green-100 text-green-700',
  EST_PENDIENTE: 'bg-amber-100 text-amber-700',
  EST_BORRADOR: 'bg-gray-100 text-gray-600',
  EST_ERROR: 'bg-red-100 text-red-700',
};

function BandejaTab() {
  const qc = useQueryClient();
  const [verIntentos, setVerIntentos] = useState(null);
  const [msg, setMsg] = useState('');
  const { data: mensajes, isLoading } = useQuery({ queryKey: ['com-bandeja'], queryFn: () => comunicacionAPI.mensajes.list({ limit: 100 }).then((r) => r.data) });
  const { data: estados } = useQuery({ queryKey: ['com-estado'], queryFn: listaQuery('estado_mensaje') });
  const estadoMap = Object.fromEntries((estados || []).map((e) => [e.id, e]));
  const refetch = () => qc.invalidateQueries({ queryKey: ['com-bandeja'] });

  const enviarUno = useMutation({
    mutationFn: (id) => comunicacionAPI.mensajes.enviar(id),
    onSuccess: (r) => { setMsg(r.data.enviado ? 'Enviado.' : `Error: ${r.data.detalle_error || ''}`); refetch(); },
    onError: (e) => setMsg(e.response?.data?.detail || 'Error'),
  });
  const reintentar = useMutation({
    mutationFn: () => comunicacionAPI.mensajes.reintentarPendientes(50),
    onSuccess: (r) => { setMsg(`Reintentados ${r.data.reintentados}: ${r.data.enviados} enviados, ${r.data.errores} errores.`); refetch(); },
    onError: (e) => setMsg(e.response?.data?.detail || 'Error'),
  });

  return (
    <div>
      {msg && <div className="mb-3 bg-blue-50 border border-blue-200 text-blue-700 text-sm rounded-lg px-4 py-2 flex justify-between"><span>{msg}</span><button onClick={() => setMsg('')} className="text-blue-500">✕</button></div>}
      <div className="mb-3 flex justify-end">
        <button className={btnPrimary} disabled={reintentar.isPending} onClick={() => reintentar.mutate()}>{reintentar.isPending ? '...' : 'Reintentar pendientes/errores'}</button>
      </div>
      {isLoading ? <LoadingSpinner /> : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
          <table className="min-w-full text-left text-xs">
            <thead><tr className="border-b border-gray-100 bg-gray-50/70 text-gray-500 uppercase tracking-wide">
              {['Destinatario', 'Título', 'Estado', 'Envío', 'Acciones'].map((h) => <th key={h} className="px-3 py-2.5 font-semibold">{h}</th>)}
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {mensajes?.length ? mensajes.map((m) => {
                const est = estadoMap[m.id_estado_mensaje];
                const cls = ESTADO_BADGE[est?.codigo] || 'bg-gray-100 text-gray-600';
                return (
                  <tr key={m.id} className="hover:bg-primary-50/40">
                    <td className="px-3 py-2">{m.identificador}</td>
                    <td className="px-3 py-2">{m.titulo}</td>
                    <td className="px-3 py-2"><span className={`px-2 py-0.5 rounded text-[11px] font-medium ${cls}`}>{est?.nombre || m.id_estado_mensaje}</span></td>
                    <td className="px-3 py-2 text-gray-500">{m.fecha_envio ? new Date(m.fecha_envio).toLocaleString() : '—'}</td>
                    <td className="px-3 py-2">
                      <div className="flex gap-2">
                        <button className={btnSecondary} disabled={enviarUno.isPending} onClick={() => enviarUno.mutate(m.id)}>Enviar</button>
                        <button className={btnSecondary} onClick={() => setVerIntentos(m.id)}>Intentos</button>
                      </div>
                    </td>
                  </tr>
                );
              }) : <tr><td colSpan={5} className="px-3 py-8 text-center text-gray-400">Sin mensajes.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
      {verIntentos && <IntentosModal id={verIntentos} onClose={() => setVerIntentos(null)} />}
    </div>
  );
}

function IntentosModal({ id, onClose }) {
  const { data, isLoading } = useQuery({ queryKey: ['com-intentos', id], queryFn: () => comunicacionAPI.mensajes.intentos(id).then((r) => r.data) });
  return (
    <Modal title={`Intentos de envío — mensaje #${id}`} onClose={onClose} wide>
      {isLoading ? <LoadingSpinner /> : (
        <div className="space-y-2">
          {data?.length ? data.map((it) => (
            <div key={it.id} className="border border-gray-100 rounded-lg p-3 text-sm">
              <div className="flex justify-between">
                <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${it.resultado === 'enviado' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{it.resultado}</span>
                <span className="text-xs text-gray-500">{new Date(it.fecha).toLocaleString()}</span>
              </div>
              {it.detalle_error && <p className="mt-1 text-xs text-red-600 font-mono break-all">{it.detalle_error}</p>}
            </div>
          )) : <p className="text-gray-500 text-sm">Sin intentos registrados.</p>}
        </div>
      )}
    </Modal>
  );
}

// ── Envío directo ──────────────────────────────────────────────────
function EnvioDirectoTab() {
  const [f, setF] = useState({ to: '', asunto: '', cuerpo: '' });
  const [res, setRes] = useState(null);
  const m = useMutation({
    mutationFn: () => comunicacionAPI.mensajes.enviarDirecto(f),
    onSuccess: (r) => setRes(r.data), onError: (e) => setRes({ error: e.response?.data?.detail || 'Error' }),
  });
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 max-w-2xl">
      <div className="space-y-3">
        <Field label="Destinatario (email)"><input className={inputClass} value={f.to} onChange={(e) => setF({ ...f, to: e.target.value })} placeholder="alguien@dominio.com" /></Field>
        <Field label="Asunto"><input className={inputClass} value={f.asunto} onChange={(e) => setF({ ...f, asunto: e.target.value })} /></Field>
        <Field label="Cuerpo"><textarea className={inputClass} rows={5} value={f.cuerpo} onChange={(e) => setF({ ...f, cuerpo: e.target.value })} /></Field>
      </div>
      <button className={`${btnPrimary} mt-4`} disabled={m.isPending || !f.to || !f.asunto} onClick={() => m.mutate()}>{m.isPending ? 'Enviando...' : 'Crear y enviar'}</button>
      {res && (
        <div className={`mt-3 text-sm rounded-lg px-4 py-2 ${res.error || res.enviado === false ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
          {res.error ? `⚠ ${res.error}` : res.enviado ? `Enviado (mensaje #${res.id_mensaje}).` : `No enviado: ${res.detalle_error}`}
        </div>
      )}
    </div>
  );
}

// ── Plantillas ABM ─────────────────────────────────────────────────
function PlantillasTab() {
  return (
    <CrudTab
      queryKey="com-plantillas"
      apiFns={comunicacionAPI.plantillas}
      entityName="Plantilla"
      wide
      columns={[
        { key: 'codigo', label: 'Código' },
        { key: 'nombre', label: 'Nombre' },
        { key: 'asunto', label: 'Asunto' },
        { key: 'canal', label: 'Canal' },
        { key: 'activo', label: 'Estado', render: (v) => (v ? 'Activa' : 'Baja') },
      ]}
      formFields={[
        { key: 'codigo', label: 'Código', required: true },
        { key: 'nombre', label: 'Nombre' },
        { key: 'asunto', label: 'Asunto (admite {{variables}})', required: true },
        { key: 'cuerpo', label: 'Cuerpo (admite {{variables}})', type: 'textarea', rows: 6, required: true, placeholder: 'Hola {{nombre}}, su deuda es {{importe}}.' },
        { key: 'canal', label: 'Canal', type: 'select', defaultValue: 'email', options: [{ value: 'email', label: 'Email' }, { value: 'sms', label: 'SMS' }, { value: 'interno', label: 'Interno' }] },
        { key: 'activo', label: 'Activa', type: 'boolean', defaultValue: true },
      ]}
    />
  );
}

// ── Envío masivo ───────────────────────────────────────────────────
function MasivoTab() {
  const { data: plantillas } = useQuery({ queryKey: ['com-plantillas-sel'], queryFn: () => comunicacionAPI.plantillas.list({ limit: 200 }).then((r) => r.data) });
  const [idPlantilla, setIdPlantilla] = useState('');
  const [rows, setRows] = useState([{ email: '', vars: '' }]);
  const [res, setRes] = useState(null);
  const [err, setErr] = useState('');
  const setRow = (i, k, v) => setRows((p) => p.map((r, x) => (x === i ? { ...r, [k]: v } : r)));

  const parseVars = (s) => {
    if (!s.trim()) return {};
    try { return JSON.parse(s); } catch { return null; }
  };

  const m = useMutation({
    mutationFn: () => {
      const destinatarios = rows.filter((r) => r.email.trim()).map((r) => ({ email: r.email.trim(), variables: parseVars(r.vars) || {} }));
      return comunicacionAPI.mensajes.masivo({ id_plantilla: Number(idPlantilla), destinatarios });
    },
    onSuccess: (r) => { setRes(r.data); setErr(''); }, onError: (e) => setErr(e.response?.data?.detail || 'Error'),
  });

  const badVars = rows.some((r) => r.vars.trim() && parseVars(r.vars) === null);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 max-w-3xl">
      <Field label="Plantilla">
        <select className={inputClass} value={idPlantilla} onChange={(e) => setIdPlantilla(e.target.value)}>
          <option value="">Seleccionar...</option>
          {plantillas?.filter((p) => p.activo).map((p) => <option key={p.id} value={p.id}>{p.codigo} — {p.nombre || p.asunto}</option>)}
        </select>
      </Field>
      <p className="text-xs text-gray-500 mt-3 mb-1">Destinatarios (variables en JSON, ej: {'{"nombre":"Ana","importe":"$100"}'})</p>
      <div className="space-y-2">
        {rows.map((r, i) => (
          <div key={i} className="grid grid-cols-12 gap-2 items-center">
            <input className={`${inputClass} col-span-5`} placeholder="email@dominio.com" value={r.email} onChange={(e) => setRow(i, 'email', e.target.value)} />
            <input className={`${inputClass} col-span-6 font-mono text-xs`} placeholder='{"nombre":"..."}' value={r.vars} onChange={(e) => setRow(i, 'vars', e.target.value)} />
            <button className="col-span-1 text-red-500" onClick={() => setRows((p) => p.filter((_, x) => x !== i))}>✕</button>
          </div>
        ))}
      </div>
      <button className={`${btnSecondary} mt-2`} onClick={() => setRows((p) => [...p, { email: '', vars: '' }])}>+ Destinatario</button>
      {badVars && <p className="text-red-600 text-sm mt-2">⚠ Hay variables con JSON inválido.</p>}
      {err && <p className="text-red-600 text-sm mt-2">⚠ {err}</p>}
      <button className={`${btnPrimary} w-full mt-3`} disabled={m.isPending || !idPlantilla || badVars || !rows.some((r) => r.email.trim())} onClick={() => m.mutate()}>{m.isPending ? 'Enviando...' : 'Enviar masivo'}</button>
      {res && (
        <div className="mt-4 border border-gray-100 rounded-lg p-3">
          <p className="text-sm font-semibold mb-2">Resumen: {res.enviados} enviados / {res.errores} errores (de {res.total})</p>
          <div className="space-y-1 max-h-64 overflow-y-auto">
            {res.resultados?.map((x, i) => (
              <div key={i} className="text-xs flex justify-between border-b border-gray-50 py-1">
                <span>{x.email}</span>
                <span className={x.enviado ? 'text-green-600' : 'text-red-600'}>{x.enviado ? 'enviado' : (x.detalle_error || 'error')}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── ABM crudo de Mensajes (existente) ──────────────────────────────
function MensajesTab() {
  return (
    <CrudTab
      queryKey="com-mensajes"
      apiFns={comunicacionAPI.mensajes}
      entityName="Mensaje"
      wide
      columns={[
        { key: 'id', label: 'ID' },
        { key: 'titulo', label: 'Título' },
        { key: 'identificador', label: 'Identificador' },
        { key: 'id_tipo_mensaje', label: 'Tipo' },
        { key: 'id_canal', label: 'Canal' },
        { key: 'id_prioridad', label: 'Prioridad' },
        { key: 'id_estado_mensaje', label: 'Estado' },
        { key: 'fecha_creacion', label: 'Fecha', render: (v) => (v ? new Date(v).toLocaleString() : '') },
      ]}
      formFields={[
        { key: 'identificador', label: 'Identificador', required: true },
        { key: 'titulo', label: 'Título', required: true },
        { key: 'cuerpo', label: 'Cuerpo', required: true },
        { key: 'id_tipo_mensaje', label: 'Tipo', type: 'remote_select', required: true, queryKey: 'com-tipo', queryFn: listaQuery('tipo_mensaje'), optionValue: 'id', optionLabel: 'nombre' },
        { key: 'id_canal', label: 'Canal', type: 'remote_select', required: true, queryKey: 'com-canal', queryFn: listaQuery('canal'), optionValue: 'id', optionLabel: 'nombre' },
        { key: 'id_prioridad', label: 'Prioridad', type: 'remote_select', required: true, queryKey: 'com-prio', queryFn: listaQuery('prioridad'), optionValue: 'id', optionLabel: 'nombre' },
        { key: 'id_estado_mensaje', label: 'Estado', type: 'remote_select', queryKey: 'com-estado', queryFn: listaQuery('estado_mensaje'), optionValue: 'id', optionLabel: 'nombre' },
      ]}
    />
  );
}

function ListasTab() {
  return (
    <CrudTab
      queryKey="com-listas"
      apiFns={comunicacionAPI.listas}
      entityName="Lista"
      columns={[
        { key: 'id', label: 'ID' },
        { key: 'codigo', label: 'Código' },
        { key: 'tipo', label: 'Tipo' },
        { key: 'nombre', label: 'Nombre' },
        { key: 'orden', label: 'Orden' },
      ]}
      formFields={[
        { key: 'codigo', label: 'Código', required: true },
        { key: 'tipo', label: 'Tipo', required: true },
        { key: 'nombre', label: 'Nombre', required: true },
        { key: 'orden', label: 'Orden', type: 'int', defaultValue: 0 },
      ]}
    />
  );
}
