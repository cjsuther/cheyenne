import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { interfaceAPI } from '../../services/api';
import { useTabParam } from '../../hooks/useTabParam';
import PageHeader from '../../components/common/PageHeader';
import GroupedTabBar from '../../components/common/GroupedTabBar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Modal, Field, inputClass, btnPrimary, btnSecondary } from '../../components/common/CrudComponents';

const fmt = (v) => new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(v || 0));
const fmtDate = (v) => (v ? new Date(v).toLocaleString('es-AR') : '—');

const TABS = [
  { key: 'pagos', label: 'Notificaciones de pago' },
  { key: 'boletas', label: 'Boletas / PDF' },
  { key: 'afip', label: 'Consulta AFIP' },
];
const GRUPOS = [
  { label: 'Portal ciudadano', keys: ['pagos', 'boletas', 'afip'] },
];

export default function Interface() {
  const [tab, setTab] = useTabParam('pagos');
  return (
    <div>
      <PageHeader title="Interface — Portal ciudadano" subtitle="Pasarela de pago, boletas con código de barras e integración AFIP/ARBA" />
      <GroupedTabBar grupos={GRUPOS} tabsMeta={TABS} tab={tab} setTab={setTab} />
      {tab === 'pagos' && <PagosTab />}
      {tab === 'boletas' && <BoletasTab />}
      {tab === 'afip' && <AfipTab />}
    </div>
  );
}

// ── Notificaciones de pago ─────────────────────────────────────────
function PagosTab() {
  const { data, isLoading } = useQuery({ queryKey: ['iface-pagos'], queryFn: () => interfaceAPI.pagos.list({ limit: 100 }).then((r) => r.data) });
  if (isLoading) return <LoadingSpinner />;
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
      <table className="min-w-full text-left text-xs">
        <thead><tr className="border-b border-gray-100 bg-gray-50/70 text-gray-500 uppercase tracking-wide">
          {['Fecha', 'Transacción', 'Comprobante', 'Importe', 'Estado', 'Impacto deuda'].map((h) => <th key={h} className="px-3 py-2.5 font-semibold">{h}</th>)}
        </tr></thead>
        <tbody className="divide-y divide-gray-50">
          {data?.length ? data.map((n) => (
            <tr key={n.id} className="hover:bg-primary-50/40">
              <td className="px-3 py-2 whitespace-nowrap">{fmtDate(n.fecha_notificacion)}</td>
              <td className="px-3 py-2 font-mono">{n.id_transaccion_externa}</td>
              <td className="px-3 py-2">{n.comprobante_ref || '—'}</td>
              <td className="px-3 py-2 text-right font-semibold">{fmt(n.importe)}</td>
              <td className="px-3 py-2"><span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700">{n.estado}</span></td>
              <td className="px-3 py-2">
                {n.procesado
                  ? <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${n.impacto_ok ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`} title={n.impacto_detalle || ''}>{n.impacto_ok ? 'Impactado' : 'Pendiente'}</span>
                  : <span className="px-2 py-0.5 rounded text-[11px] bg-gray-100 text-gray-500">Sin procesar</span>}
              </td>
            </tr>
          )) : <tr><td colSpan={6} className="px-3 py-8 text-center text-gray-400">Sin notificaciones. Las pasarelas las envían por webhook firmado (HMAC).</td></tr>}
        </tbody>
      </table>
    </div>
  );
}

// ── Boletas + PDF ──────────────────────────────────────────────────
function BoletasTab() {
  const qc = useQueryClient();
  const [modal, setModal] = useState(false);
  const [dl, setDl] = useState(null);
  const { data, isLoading } = useQuery({ queryKey: ['iface-boletas'], queryFn: () => interfaceAPI.boletas.list({ limit: 100 }).then((r) => r.data) });

  const descargar = async (id) => {
    setDl(id);
    try {
      const r = await interfaceAPI.boletas.pdf(id);
      const url = URL.createObjectURL(new Blob([r.data], { type: 'application/pdf' }));
      window.open(url, '_blank');
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch (e) {
      alert('No se pudo generar el PDF: ' + (e.response?.status || e.message));
    } finally { setDl(null); }
  };

  return (
    <div>
      <div className="mb-3 flex justify-end"><button className={btnPrimary} onClick={() => setModal(true)}>Nueva boleta</button></div>
      {isLoading ? <LoadingSpinner /> : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
          <table className="min-w-full text-left text-xs">
            <thead><tr className="border-b border-gray-100 bg-gray-50/70 text-gray-500 uppercase tracking-wide">
              {['N°', 'Cuenta', 'Recibo', 'Importe', 'Vence', 'Código de pago', ''].map((h) => <th key={h} className="px-3 py-2.5 font-semibold">{h}</th>)}
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {data?.length ? data.map((b) => (
                <tr key={b.id} className="hover:bg-primary-50/40">
                  <td className="px-3 py-2">{b.id}</td>
                  <td className="px-3 py-2">{b.numero_cuenta || '—'}</td>
                  <td className="px-3 py-2">{b.numero_recibo || '—'}</td>
                  <td className="px-3 py-2 text-right font-semibold">{fmt(b.importe)}</td>
                  <td className="px-3 py-2">{b.fecha_vencimiento || '—'}</td>
                  <td className="px-3 py-2 font-mono text-[11px]">{b.codigo_barras || '—'}</td>
                  <td className="px-3 py-2 text-right"><button className={btnSecondary} disabled={dl === b.id} onClick={() => descargar(b.id)}>{dl === b.id ? '...' : 'PDF'}</button></td>
                </tr>
              )) : <tr><td colSpan={7} className="px-3 py-8 text-center text-gray-400">Sin boletas.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
      {modal && <BoletaModal onClose={() => setModal(false)} onDone={() => { setModal(false); qc.invalidateQueries({ queryKey: ['iface-boletas'] }); }} />}
    </div>
  );
}

function BoletaModal({ onClose, onDone }) {
  const [f, setF] = useState({ numero_cuenta: '', numero_recibo: '', importe: '', fecha_vencimiento: '', codigo_barras: '' });
  const [msg, setMsg] = useState('');
  const m = useMutation({
    mutationFn: () => interfaceAPI.boletas.create({
      numero_cuenta: f.numero_cuenta || null,
      numero_recibo: f.numero_recibo || null,
      importe: Number(f.importe),
      fecha_vencimiento: f.fecha_vencimiento || null,
      codigo_barras: f.codigo_barras || null,
    }),
    onSuccess: onDone, onError: (e) => setMsg(e.response?.data?.detail || 'Error'),
  });
  return (
    <Modal title="Nueva boleta" onClose={onClose}>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Cuenta"><input className={inputClass} value={f.numero_cuenta} onChange={(e) => setF({ ...f, numero_cuenta: e.target.value })} /></Field>
        <Field label="Recibo"><input className={inputClass} value={f.numero_recibo} onChange={(e) => setF({ ...f, numero_recibo: e.target.value })} /></Field>
        <Field label="Importe"><input type="number" className={inputClass} value={f.importe} onChange={(e) => setF({ ...f, importe: e.target.value })} /></Field>
        <Field label="Vencimiento"><input type="date" className={inputClass} value={f.fecha_vencimiento} onChange={(e) => setF({ ...f, fecha_vencimiento: e.target.value })} /></Field>
        <Field label="Código de pago (opcional, se autogenera)"><input className={inputClass} value={f.codigo_barras} onChange={(e) => setF({ ...f, codigo_barras: e.target.value })} /></Field>
      </div>
      {msg && <p className="text-red-600 text-sm mt-2">⚠ {msg}</p>}
      <button className={`${btnPrimary} w-full mt-3`} disabled={m.isPending || !(Number(f.importe) > 0)} onClick={() => m.mutate()}>{m.isPending ? '...' : 'Generar boleta'}</button>
    </Modal>
  );
}

// ── Consulta AFIP ──────────────────────────────────────────────────
function AfipTab() {
  const [cuit, setCuit] = useState('');
  const [res, setRes] = useState(null);
  const m = useMutation({
    mutationFn: () => interfaceAPI.afip.constancia(cuit).then((r) => r.data),
    onSuccess: setRes, onError: (e) => setRes({ ok: false, error: e.response?.data?.detail || 'Error' }),
  });
  return (
    <div className="max-w-2xl">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex gap-2 items-end">
          <div className="flex-1"><Field label="CUIT (11 dígitos)"><input className={inputClass} value={cuit} onChange={(e) => setCuit(e.target.value)} placeholder="20123456783" /></Field></div>
          <button className={btnPrimary} disabled={m.isPending || cuit.replace(/\D/g, '').length !== 11} onClick={() => m.mutate()}>{m.isPending ? '...' : 'Consultar padrón'}</button>
        </div>
      </div>
      {res && (
        <div className="mt-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          {res.simulado && <div className="mb-3 text-xs bg-amber-50 border border-amber-200 text-amber-700 rounded-lg px-3 py-2">Resultado SIMULADO (sin credenciales AFIP configuradas).</div>}
          {res.ok
            ? <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                {Object.entries(res).filter(([k]) => !['ok', 'simulado', 'nota'].includes(k)).map(([k, v]) => (
                  <div key={k}><dt className="text-gray-400 text-xs uppercase">{k}</dt><dd className="font-medium">{String(v)}</dd></div>
                ))}
              </dl>
            : <p className="text-red-600 text-sm">⚠ {res.error}</p>}
        </div>
      )}
    </div>
  );
}
