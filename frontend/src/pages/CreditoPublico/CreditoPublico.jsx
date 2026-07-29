import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { creditoPublicoAPI } from '../../services/api';
import { useTabParam } from '../../hooks/useTabParam';
import PageHeader from '../../components/common/PageHeader';
import GroupedTabBar from '../../components/common/GroupedTabBar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Modal, Field, inputClass, btnPrimary, btnSecondary } from '../../components/common/CrudComponents';

const fmt = (v) => new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(v || 0));
const EST = { vigente: 'bg-green-100 text-green-700', cancelado: 'bg-gray-200 text-gray-500', en_mora: 'bg-red-100 text-red-700' };

const TABS = [{ key: 'emprestitos', label: 'Empréstitos' }, { key: 'resumen', label: 'Resumen de deuda' }];
const GRUPOS = [{ label: 'Crédito Público', keys: ['emprestitos', 'resumen'] }];

export default function CreditoPublico() {
  const [tab, setTab] = useTabParam('emprestitos');
  return (
    <div>
      <PageHeader title="Crédito Público — Deuda" subtitle="Empréstitos, amortización, intereses y desembolsos" />
      <GroupedTabBar grupos={GRUPOS} tabsMeta={TABS} tab={tab} setTab={setTab} />
      {tab === 'emprestitos' && <EmprestitosTab />}
      {tab === 'resumen' && <ResumenTab />}
    </div>
  );
}

function EmprestitosTab() {
  const qc = useQueryClient();
  const [modal, setModal] = useState(null);
  const [sel, setSel] = useState(null);
  const [error, setError] = useState('');
  const { data: emps, isLoading } = useQuery({ queryKey: ['cred-emp'], queryFn: () => creditoPublicoAPI.emprestitos.list({ limit: 100 }).then((r) => r.data) });
  const refetch = () => { qc.invalidateQueries({ queryKey: ['cred-emp'] }); if (sel) qc.invalidateQueries({ queryKey: ['cred-emp', sel] }); };
  return (
    <div>
      {error && <div className="mb-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2 flex justify-between"><span>⚠ {error}</span><button onClick={() => setError('')} className="text-red-500">✕</button></div>}
      <div className="mb-3 flex justify-end"><button className={btnPrimary} onClick={() => setModal('nuevo')}>Nuevo empréstito</button></div>
      {isLoading ? <LoadingSpinner /> : sel ? (
        <EmprestitoDetalle id={sel} onBack={() => setSel(null)} onChange={refetch} onError={setError} />
      ) : (
        <div className="space-y-2">
          {emps?.length ? emps.map((e) => (
            <div key={e.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between cursor-pointer hover:border-primary-200" onClick={() => setSel(e.id)}>
              <div><p className="text-sm font-semibold text-gray-800">{e.codigo} — {e.denominacion}</p><p className="text-xs text-gray-500">{e.acreedor || ''} · {e.tasa_anual}% · {e.plazo_meses}m · {e.sistema}</p></div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-gray-800">saldo {fmt(e.saldo_capital)}</span>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${EST[e.estado]}`}>{e.estado}</span>
              </div>
            </div>
          )) : <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">Sin empréstitos.</div>}
        </div>
      )}
      {modal === 'nuevo' && <NuevoEmprestitoModal onClose={() => setModal(null)} onDone={() => { setModal(null); refetch(); }} />}
    </div>
  );
}

function NuevoEmprestitoModal({ onClose, onDone }) {
  const [f, setF] = useState({ codigo: '', denominacion: '', acreedor: '', tipo: 'prestamo', monto_original: '', tasa_anual: '', plazo_meses: '12', sistema: 'frances' });
  const [msg, setMsg] = useState('');
  const m = useMutation({
    mutationFn: () => creditoPublicoAPI.emprestitos.create({ ...f, monto_original: Number(f.monto_original), tasa_anual: Number(f.tasa_anual || 0), plazo_meses: Number(f.plazo_meses) }),
    onSuccess: onDone, onError: (e) => setMsg(e.response?.data?.detail || 'Error'),
  });
  return (
    <Modal title="Nuevo empréstito" onClose={onClose} wide>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Código"><input className={inputClass} value={f.codigo} onChange={(e) => setF({ ...f, codigo: e.target.value })} /></Field>
        <Field label="Denominación"><input className={inputClass} value={f.denominacion} onChange={(e) => setF({ ...f, denominacion: e.target.value })} /></Field>
        <Field label="Acreedor"><input className={inputClass} value={f.acreedor} onChange={(e) => setF({ ...f, acreedor: e.target.value })} /></Field>
        <Field label="Tipo"><select className={inputClass} value={f.tipo} onChange={(e) => setF({ ...f, tipo: e.target.value })}>{['prestamo', 'bono', 'adelanto', 'otro'].map((t) => <option key={t} value={t}>{t}</option>)}</select></Field>
        <Field label="Monto"><input type="number" className={inputClass} value={f.monto_original} onChange={(e) => setF({ ...f, monto_original: e.target.value })} /></Field>
        <Field label="Tasa anual %"><input type="number" className={inputClass} value={f.tasa_anual} onChange={(e) => setF({ ...f, tasa_anual: e.target.value })} /></Field>
        <Field label="Plazo (meses)"><input type="number" className={inputClass} value={f.plazo_meses} onChange={(e) => setF({ ...f, plazo_meses: e.target.value })} /></Field>
        <Field label="Sistema"><select className={inputClass} value={f.sistema} onChange={(e) => setF({ ...f, sistema: e.target.value })}><option value="frances">Francés (cuota fija)</option><option value="aleman">Alemán (capital fijo)</option></select></Field>
      </div>
      {msg && <p className="text-red-600 text-sm mt-2">⚠ {msg}</p>}
      <button className={`${btnPrimary} w-full mt-3`} disabled={m.isPending || !f.codigo.trim() || !(Number(f.monto_original) > 0) || !(Number(f.plazo_meses) > 0)} onClick={() => m.mutate()}>{m.isPending ? '...' : 'Crear'}</button>
    </Modal>
  );
}

function EmprestitoDetalle({ id, onBack, onChange, onError }) {
  const qc = useQueryClient();
  const { data: e } = useQuery({ queryKey: ['cred-emp', id], queryFn: () => creditoPublicoAPI.emprestitos.get(id).then((r) => r.data) });
  const [desem, setDesem] = useState('');
  const refetch = () => { qc.invalidateQueries({ queryKey: ['cred-emp', id] }); onChange(); };
  const gen = () => creditoPublicoAPI.emprestitos.generarPlan(id).then(refetch).catch((x) => onError(x.response?.data?.detail || 'Error'));
  const desembolsar = () => creditoPublicoAPI.emprestitos.desembolsar(id, { importe: Number(desem), estado: 'real' }).then(() => { setDesem(''); refetch(); }).catch((x) => onError(x.response?.data?.detail || 'Error'));
  const pagar = (idc) => creditoPublicoAPI.cuotas.pagar(idc).then(refetch).catch((x) => onError(x.response?.data?.detail || 'Error'));
  if (!e) return <LoadingSpinner />;
  return (
    <div>
      <button className="text-sm text-primary-600 mb-3 hover:underline" onClick={onBack}>← Volver</button>
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div><p className="font-semibold text-gray-800">{e.codigo} — {e.denominacion}</p><p className="text-xs text-gray-500">{e.acreedor} · {e.tasa_anual}% · {e.plazo_meses}m · {e.sistema} · saldo {fmt(e.saldo_capital)} · desembolsado {fmt(e.desembolsado)}</p></div>
          <div className="flex items-center gap-2">
            {!e.cuotas?.length && <button className={btnSecondary} onClick={gen}>Generar cronograma</button>}
            <input type="number" className="w-32 border border-gray-300 rounded-lg px-2 py-1.5 text-sm" placeholder="Desembolso" value={desem} onChange={(ev) => setDesem(ev.target.value)} />
            <button className={btnPrimary} disabled={!(Number(desem) > 0)} onClick={desembolsar}>Desembolsar</button>
          </div>
        </div>
      </div>
      {e.cuotas?.length ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
          <table className="min-w-full text-left text-xs">
            <thead><tr className="border-b border-gray-100 bg-gray-50/70 text-gray-500 uppercase">
              {['#', 'Vencimiento', 'Capital', 'Interés', 'Total', 'Saldo post.', 'Estado', ''].map((h) => <th key={h} className="px-3 py-2 font-semibold">{h}</th>)}
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {e.cuotas.map((c) => (
                <tr key={c.id} className={c.estado === 'pagada' ? 'bg-green-50/40' : 'hover:bg-primary-50/40'}>
                  <td className="px-3 py-2">{c.numero}</td>
                  <td className="px-3 py-2">{c.fecha_vencimiento}</td>
                  <td className="px-3 py-2 text-right">{fmt(c.capital)}</td>
                  <td className="px-3 py-2 text-right">{fmt(c.interes)}</td>
                  <td className="px-3 py-2 text-right font-medium">{fmt(c.total)}</td>
                  <td className="px-3 py-2 text-right text-gray-500">{fmt(c.saldo_posterior)}</td>
                  <td className="px-3 py-2">{c.estado === 'pagada' ? <span className="text-green-700">✓ pagada</span> : <span className="text-amber-600">pendiente</span>}</td>
                  <td className="px-3 py-2">{c.estado === 'pendiente' && <button className="text-primary-600 hover:underline" onClick={() => pagar(c.id)}>pagar servicio</button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : <p className="text-sm text-gray-400">Sin cronograma. Generalo con el botón de arriba.</p>}
    </div>
  );
}

function ResumenTab() {
  const { data, isLoading } = useQuery({ queryKey: ['cred-resumen'], queryFn: () => creditoPublicoAPI.emprestitos.resumen().then((r) => r.data) });
  if (isLoading) return <LoadingSpinner />;
  if (!data) return null;
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
      {[
        ['Empréstitos vigentes', data.emprestitos_vigentes],
        ['Saldo de capital', fmt(data.saldo_capital_total)],
        ['Servicio pendiente (capital)', fmt(data.servicio_pendiente_capital)],
        ['Servicio pendiente (interés)', fmt(data.servicio_pendiente_interes)],
        ['Servicio pendiente total', fmt(data.servicio_pendiente_total)],
      ].map(([l, v]) => (
        <div key={l} className="bg-white rounded-xl border border-gray-200 p-3"><p className="text-xs text-gray-500">{l}</p><p className="text-lg font-bold text-gray-800">{v}</p></div>
      ))}
    </div>
  );
}
