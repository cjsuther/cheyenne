import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tesoreriaAPI } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Modal, Field, inputClass, btnPrimary, btnSecondary } from '../../components/common/CrudComponents';

const fmt = (v) => new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(v || 0));
const cuentasQuery = () => tesoreriaAPI.cuentasBancarias.list({ limit: 200 }).then((r) => r.data);
const btnSm = btnPrimary.replace('px-4 py-2', 'px-3 py-1.5');

// ═══ CHEQUES ═════════════════════════════════════════════════════════
const EST_CK = { emitido: 'bg-amber-100 text-amber-700', entregado: 'bg-blue-100 text-blue-700', cobrado: 'bg-green-100 text-green-700', anulado: 'bg-gray-200 text-gray-500', rechazado: 'bg-red-100 text-red-700' };

export function ChequesTab() {
  const qc = useQueryClient();
  const [modal, setModal] = useState(null);
  const [error, setError] = useState('');
  const { data: cheques, isLoading } = useQuery({ queryKey: ['tes-cheques'], queryFn: () => tesoreriaAPI.cheques.list({ limit: 100 }).then((r) => r.data) });
  const refetch = () => { qc.invalidateQueries({ queryKey: ['tes-cheques'] }); qc.invalidateQueries({ queryKey: ['tes-op'] }); };
  const accion = (fn, id) => fn(id).then(refetch).catch((e) => setError(e.response?.data?.detail || 'Error'));
  return (
    <div>
      {error && <div className="mb-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2 flex justify-between"><span>⚠ {error}</span><button onClick={() => setError('')} className="text-red-500">✕</button></div>}
      <div className="mb-3 flex justify-end gap-2">
        <button className={btnSecondary} onClick={() => setModal('chequera')}>Nueva chequera</button>
        <button className={btnPrimary} onClick={() => setModal('emitir')}>Emitir cheque</button>
      </div>
      {isLoading ? <LoadingSpinner /> : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
          <table className="min-w-full text-left text-xs">
            <thead><tr className="border-b border-gray-100 bg-gray-50/70 text-gray-500 uppercase tracking-wide">
              {['Número', 'Beneficiario', 'Importe', 'Tipo', 'Fecha pago', 'Estado', 'Acciones'].map((h) => <th key={h} className="px-3 py-2.5 font-semibold whitespace-nowrap">{h}</th>)}
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {cheques?.length ? cheques.map((c) => (
                <tr key={c.id} className="hover:bg-primary-50/40">
                  <td className="px-3 py-2 font-medium">{c.numero}</td>
                  <td className="px-3 py-2">{c.beneficiario || '—'}</td>
                  <td className="px-3 py-2 text-right">{fmt(c.importe)}</td>
                  <td className="px-3 py-2">{c.diferido ? 'Diferido' : 'Común'}</td>
                  <td className="px-3 py-2">{c.fecha_pago || '—'}</td>
                  <td className="px-3 py-2"><span className={`px-2 py-0.5 rounded text-xs font-medium ${EST_CK[c.estado]}`}>{c.estado}</span></td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {c.estado === 'emitido' && <button className="text-blue-600 hover:underline mr-2" onClick={() => accion(tesoreriaAPI.cheques.entregar, c.id)}>Entregar</button>}
                    {['emitido', 'entregado'].includes(c.estado) && <button className="text-green-600 hover:underline mr-2" onClick={() => accion(tesoreriaAPI.cheques.cobrar, c.id)}>Cobrar</button>}
                    {['emitido', 'entregado'].includes(c.estado) && <button className="text-red-500 hover:underline mr-2" onClick={() => { if (confirm('¿Anular el cheque? Se revierte el pago de la OP.')) accion(tesoreriaAPI.cheques.anular, c.id); }}>Anular</button>}
                    {['emitido', 'entregado'].includes(c.estado) && <button className="text-red-500 hover:underline" onClick={() => { if (confirm('¿Marcar rechazado? Se revierte el pago.')) accion(tesoreriaAPI.cheques.rechazar, c.id); }}>Rechazar</button>}
                  </td>
                </tr>
              )) : <tr><td colSpan={7} className="px-3 py-8 text-center text-gray-400">Sin cheques emitidos.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
      {modal === 'emitir' && <EmitirChequeModal onClose={() => setModal(null)} onDone={() => { setModal(null); refetch(); }} />}
      {modal === 'chequera' && <NuevaChequeraModal onClose={() => setModal(null)} onDone={() => setModal(null)} />}
    </div>
  );
}

function EmitirChequeModal({ onClose, onDone }) {
  const { data: cuentas } = useQuery({ queryKey: ['tes-ctas'], queryFn: cuentasQuery });
  const [f, setF] = useState({ id_cuenta_bancaria: '', origen: 'op', id_orden_pago: '', importe: '', beneficiario_nombre: '', numero: '', id_chequera: '', diferido: false, fecha_pago: '' });
  const [msg, setMsg] = useState('');
  const { data: ops } = useQuery({ queryKey: ['tes-op-pend'], queryFn: () => tesoreriaAPI.ordenesPago.list({ limit: 100 }).then((r) => r.data) });
  const { data: chequeras } = useQuery({ queryKey: ['tes-chequeras', f.id_cuenta_bancaria], enabled: !!f.id_cuenta_bancaria, queryFn: () => tesoreriaAPI.chequeras.list({ id_cuenta_bancaria: f.id_cuenta_bancaria }).then((r) => r.data) });
  const desdeOP = f.origen === 'op';
  const m = useMutation({
    mutationFn: () => tesoreriaAPI.cheques.emitir({
      id_cuenta_bancaria: Number(f.id_cuenta_bancaria),
      id_orden_pago: desdeOP && f.id_orden_pago ? Number(f.id_orden_pago) : null,
      importe: !desdeOP && f.importe ? Number(f.importe) : null,
      beneficiario_nombre: f.beneficiario_nombre || null,
      numero: f.numero || null,
      id_chequera: f.id_chequera ? Number(f.id_chequera) : null,
      diferido: f.diferido, fecha_pago: f.diferido && f.fecha_pago ? f.fecha_pago : null,
    }),
    onSuccess: onDone, onError: (e) => setMsg(e.response?.data?.detail || 'Error'),
  });
  const ok = f.id_cuenta_bancaria && (f.numero || f.id_chequera) && (desdeOP ? f.id_orden_pago : Number(f.importe) > 0) && (!f.diferido || f.fecha_pago);
  return (
    <Modal title="Emitir cheque" onClose={onClose}>
      <div className="space-y-3">
        <Field label="Cuenta bancaria">
          <select className={inputClass} value={f.id_cuenta_bancaria} onChange={(e) => setF({ ...f, id_cuenta_bancaria: e.target.value, id_chequera: '' })}>
            <option value="">Seleccionar...</option>
            {cuentas?.filter((c) => c.activo !== false).map((c) => <option key={c.id} value={c.id}>{c.banco} {c.numero}</option>)}
          </select>
        </Field>
        <Field label="Origen">
          <select className={inputClass} value={f.origen} onChange={(e) => setF({ ...f, origen: e.target.value })}>
            <option value="op">Pagar una orden de pago</option>
            <option value="manual">Cheque suelto (importe manual)</option>
          </select>
        </Field>
        {desdeOP ? (
          <Field label="Orden de pago pendiente">
            <select className={inputClass} value={f.id_orden_pago} onChange={(e) => setF({ ...f, id_orden_pago: e.target.value })}>
              <option value="">Seleccionar...</option>
              {ops?.filter((o) => o.estado === 'pendiente').map((o) => <option key={o.id} value={o.id}>{o.orden_pago} · {o.beneficiario || 's/benef'} · {fmt(o.importe)}</option>)}
            </select>
          </Field>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <Field label="Importe"><input type="number" className={inputClass} value={f.importe} onChange={(e) => setF({ ...f, importe: e.target.value })} /></Field>
            <Field label="Beneficiario"><input className={inputClass} value={f.beneficiario_nombre} onChange={(e) => setF({ ...f, beneficiario_nombre: e.target.value })} /></Field>
          </div>
        )}
        <div className="grid grid-cols-2 gap-3">
          <Field label="Chequera (autonumera)">
            <select className={inputClass} value={f.id_chequera} onChange={(e) => setF({ ...f, id_chequera: e.target.value })}>
              <option value="">— manual —</option>
              {chequeras?.map((ch) => <option key={ch.id} value={ch.id}>{ch.descripcion || 'Chequera'} (próx {ch.proximo_numero}, {ch.disponibles} disp.)</option>)}
            </select>
          </Field>
          <Field label="N° cheque (si no usa chequera)"><input className={inputClass} value={f.numero} onChange={(e) => setF({ ...f, numero: e.target.value })} disabled={!!f.id_chequera} /></Field>
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={f.diferido} onChange={(e) => setF({ ...f, diferido: e.target.checked })} className="w-4 h-4 rounded" /> Cheque diferido
        </label>
        {f.diferido && <Field label="Fecha de pago"><input type="date" className={inputClass} value={f.fecha_pago} onChange={(e) => setF({ ...f, fecha_pago: e.target.value })} /></Field>}
        {msg && <p className="text-red-600 text-sm">⚠ {msg}</p>}
        <button className={`${btnPrimary} w-full`} disabled={m.isPending || !ok} onClick={() => m.mutate()}>{m.isPending ? '...' : 'Emitir cheque'}</button>
      </div>
    </Modal>
  );
}

function NuevaChequeraModal({ onClose, onDone }) {
  const { data: cuentas } = useQuery({ queryKey: ['tes-ctas'], queryFn: cuentasQuery });
  const [f, setF] = useState({ id_cuenta_bancaria: '', descripcion: '', numero_desde: '', numero_hasta: '' });
  const [msg, setMsg] = useState('');
  const m = useMutation({
    mutationFn: () => tesoreriaAPI.chequeras.create({ id_cuenta_bancaria: Number(f.id_cuenta_bancaria), descripcion: f.descripcion || null, numero_desde: Number(f.numero_desde), numero_hasta: Number(f.numero_hasta) }),
    onSuccess: onDone, onError: (e) => setMsg(e.response?.data?.detail || 'Error'),
  });
  const ok = f.id_cuenta_bancaria && Number(f.numero_hasta) >= Number(f.numero_desde) && f.numero_desde;
  return (
    <Modal title="Nueva chequera" onClose={onClose}>
      <div className="space-y-3">
        <Field label="Cuenta bancaria">
          <select className={inputClass} value={f.id_cuenta_bancaria} onChange={(e) => setF({ ...f, id_cuenta_bancaria: e.target.value })}>
            <option value="">Seleccionar...</option>
            {cuentas?.filter((c) => c.activo !== false).map((c) => <option key={c.id} value={c.id}>{c.banco} {c.numero}</option>)}
          </select>
        </Field>
        <Field label="Descripción"><input className={inputClass} value={f.descripcion} onChange={(e) => setF({ ...f, descripcion: e.target.value })} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Número desde"><input type="number" className={inputClass} value={f.numero_desde} onChange={(e) => setF({ ...f, numero_desde: e.target.value })} /></Field>
          <Field label="Número hasta"><input type="number" className={inputClass} value={f.numero_hasta} onChange={(e) => setF({ ...f, numero_hasta: e.target.value })} /></Field>
        </div>
        {msg && <p className="text-red-600 text-sm">⚠ {msg}</p>}
        <button className={`${btnPrimary} w-full`} disabled={m.isPending || !ok} onClick={() => m.mutate()}>{m.isPending ? '...' : 'Crear chequera'}</button>
      </div>
    </Modal>
  );
}

// ═══ ÓRDENES BANCARIAS ═══════════════════════════════════════════════
const EST_OB = { preparada: 'bg-amber-100 text-amber-700', enviada: 'bg-blue-100 text-blue-700', confirmada: 'bg-green-100 text-green-700', anulada: 'bg-gray-200 text-gray-500' };

export function OrdenesBancariasTab() {
  const qc = useQueryClient();
  const [modal, setModal] = useState(null);
  const [error, setError] = useState('');
  const { data: obs, isLoading } = useQuery({ queryKey: ['tes-ob'], queryFn: () => tesoreriaAPI.ordenesBancarias.list({ limit: 100 }).then((r) => r.data) });
  const refetch = () => { qc.invalidateQueries({ queryKey: ['tes-ob'] }); qc.invalidateQueries({ queryKey: ['tes-op'] }); };
  const descargarArchivo = (ob) => tesoreriaAPI.ordenesBancarias.archivo(ob.id).then((r) => {
    const blob = new Blob([r.data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a');
    a.href = url; a.download = `orden-bancaria-${ob.id}.txt`; a.click(); URL.revokeObjectURL(url);
  });
  return (
    <div>
      {error && <div className="mb-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2 flex justify-between"><span>⚠ {error}</span><button onClick={() => setError('')} className="text-red-500">✕</button></div>}
      <div className="mb-3 flex justify-end"><button className={btnPrimary} onClick={() => setModal('nueva')}>Nueva orden bancaria</button></div>
      {isLoading ? <LoadingSpinner /> : (
        <div className="space-y-2">
          {obs?.length ? obs.map((ob) => (
            <div key={ob.id} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div><p className="text-sm font-semibold text-gray-800">Orden bancaria #{ob.id}</p><p className="text-xs text-gray-500">{ob.descripcion || ''} · {fmt(ob.total)}</p></div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${EST_OB[ob.estado]}`}>{ob.estado}</span>
                  <button className="text-primary-600 text-xs hover:underline" onClick={() => descargarArchivo(ob)}>Archivo</button>
                  {ob.estado === 'preparada' && <button className={btnSm} onClick={() => { if (confirm('¿Confirmar envío? Paga las OP del lote.')) tesoreriaAPI.ordenesBancarias.confirmar(ob.id).then(refetch).catch((e) => setError(e.response?.data?.detail)); }}>Confirmar</button>}
                  {ob.estado !== 'confirmada' && ob.estado !== 'anulada' && <button className={btnSecondary} onClick={() => { if (confirm('¿Anular?')) tesoreriaAPI.ordenesBancarias.anular(ob.id).then(refetch).catch((e) => setError(e.response?.data?.detail)); }}>Anular</button>}
                </div>
              </div>
            </div>
          )) : <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">Sin órdenes bancarias.</div>}
        </div>
      )}
      {modal === 'nueva' && <NuevaOBModal onClose={() => setModal(null)} onDone={() => { setModal(null); refetch(); }} />}
    </div>
  );
}

function NuevaOBModal({ onClose, onDone }) {
  const { data: cuentas } = useQuery({ queryKey: ['tes-ctas'], queryFn: cuentasQuery });
  const { data: ops } = useQuery({ queryKey: ['tes-op-pend'], queryFn: () => tesoreriaAPI.ordenesPago.list({ limit: 100 }).then((r) => r.data) });
  const [idCuenta, setIdCuenta] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [sel, setSel] = useState({});
  const [msg, setMsg] = useState('');
  const pendientes = ops?.filter((o) => o.estado === 'pendiente') || [];
  const elegidas = Object.entries(sel).filter(([, v]) => v).map(([k]) => Number(k));
  const total = pendientes.filter((o) => sel[o.id]).reduce((s, o) => s + Number(o.importe), 0);
  const m = useMutation({
    mutationFn: () => tesoreriaAPI.ordenesBancarias.create({ id_cuenta_bancaria: Number(idCuenta), descripcion: descripcion || null, ordenes_pago: elegidas }),
    onSuccess: onDone, onError: (e) => setMsg(e.response?.data?.detail || 'Error'),
  });
  return (
    <Modal title="Nueva orden bancaria" onClose={onClose} wide>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Cuenta bancaria débito">
            <select className={inputClass} value={idCuenta} onChange={(e) => setIdCuenta(e.target.value)}>
              <option value="">Seleccionar...</option>
              {cuentas?.filter((c) => c.activo !== false).map((c) => <option key={c.id} value={c.id}>{c.banco} {c.numero}</option>)}
            </select>
          </Field>
          <Field label="Descripción"><input className={inputClass} value={descripcion} onChange={(e) => setDescripcion(e.target.value)} /></Field>
        </div>
        <div className="border border-gray-200 rounded-lg max-h-64 overflow-y-auto">
          {pendientes.length ? pendientes.map((o) => (
            <label key={o.id} className="flex items-center gap-2 px-3 py-2 border-b border-gray-50 last:border-0 hover:bg-gray-50 cursor-pointer">
              <input type="checkbox" checked={!!sel[o.id]} onChange={(e) => setSel({ ...sel, [o.id]: e.target.checked })} className="w-4 h-4 rounded" />
              <span className="text-sm flex-1">{o.orden_pago} · {o.beneficiario || 's/benef'}</span>
              <span className="text-sm font-medium">{fmt(o.importe)}</span>
            </label>
          )) : <p className="px-3 py-6 text-center text-sm text-gray-400">No hay órdenes de pago pendientes.</p>}
        </div>
        <div className="flex justify-between text-sm"><span className="text-gray-500">{elegidas.length} seleccionadas</span><span className="font-semibold">Total: {fmt(total)}</span></div>
        {msg && <p className="text-red-600 text-sm">⚠ {msg}</p>}
        <button className={`${btnPrimary} w-full`} disabled={m.isPending || !idCuenta || !elegidas.length} onClick={() => m.mutate()}>{m.isPending ? '...' : 'Crear orden bancaria'}</button>
      </div>
    </Modal>
  );
}

// ═══ CONCILIACIÓN BANCARIA ═══════════════════════════════════════════
export function ConciliacionTab() {
  const qc = useQueryClient();
  const [sel, setSel] = useState(null);
  const [modal, setModal] = useState(false);
  const [error, setError] = useState('');
  const { data: extractos, isLoading } = useQuery({ queryKey: ['tes-extractos'], queryFn: () => tesoreriaAPI.conciliacion.extractos().then((r) => r.data) });
  const refetch = () => qc.invalidateQueries({ queryKey: ['tes-extractos'] });
  return (
    <div>
      {error && <div className="mb-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2 flex justify-between"><span>⚠ {error}</span><button onClick={() => setError('')} className="text-red-500">✕</button></div>}
      <div className="mb-3 flex justify-end"><button className={btnPrimary} onClick={() => setModal(true)}>Cargar extracto</button></div>
      {isLoading ? <LoadingSpinner /> : sel ? (
        <ExtractoDetalle id={sel} onBack={() => setSel(null)} onError={setError} />
      ) : (
        <div className="space-y-2">
          {extractos?.length ? extractos.map((ex) => (
            <div key={ex.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between cursor-pointer hover:border-primary-200" onClick={() => setSel(ex.id)}>
              <div><p className="text-sm font-semibold text-gray-800">Extracto {ex.periodo}</p><p className="text-xs text-gray-500">Saldo final {fmt(ex.saldo_final)}</p></div>
              <span className="text-primary-600 text-sm">Conciliar →</span>
            </div>
          )) : <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">Sin extractos cargados.</div>}
        </div>
      )}
      {modal && <NuevoExtractoModal onClose={() => setModal(false)} onDone={() => { setModal(false); refetch(); }} />}
    </div>
  );
}

function ExtractoDetalle({ id, onBack, onError }) {
  const qc = useQueryClient();
  const { data: ex } = useQuery({ queryKey: ['tes-extracto', id], queryFn: () => tesoreriaAPI.conciliacion.extracto(id).then((r) => r.data) });
  const { data: resumen } = useQuery({ queryKey: ['tes-extracto-res', id], queryFn: () => tesoreriaAPI.conciliacion.resumen(id).then((r) => r.data) });
  const { data: egresos } = useQuery({ queryKey: ['tes-extracto-eg', id], queryFn: () => tesoreriaAPI.conciliacion.egresosPendientes(id).then((r) => r.data) });
  const refetch = () => { qc.invalidateQueries({ queryKey: ['tes-extracto', id] }); qc.invalidateQueries({ queryKey: ['tes-extracto-res', id] }); qc.invalidateQueries({ queryKey: ['tes-extracto-eg', id] }); };
  const [pick, setPick] = useState({});
  const conciliar = (mov) => tesoreriaAPI.conciliacion.conciliar(mov.id, { id_egreso: pick[mov.id] ? Number(pick[mov.id]) : null }).then(refetch).catch((e) => onError(e.response?.data?.detail || 'Error'));
  const desconciliar = (mov) => tesoreriaAPI.conciliacion.desconciliar(mov.id).then(refetch).catch((e) => onError(e.response?.data?.detail || 'Error'));
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <button className="text-sm text-primary-600 hover:underline" onClick={onBack}>← Volver a extractos</button>
        <button className={btnSecondary} onClick={() => tesoreriaAPI.conciliacion.autoConciliar(id).then((r) => { alert(`Auto-conciliados: ${r.data.conciliados} · pendientes: ${r.data.movimientos_pendientes}`); refetch(); }).catch((e) => onError(e.response?.data?.detail || 'Error'))}>⚡ Auto-conciliar por importe/fecha</button>
      </div>
      {resumen && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
          {[['Saldo extracto', fmt(resumen.saldo_extracto)], ['Saldo contable', fmt(resumen.saldo_contable)], ['Diferencia', fmt(resumen.diferencia)], ['Conciliados', `${resumen.movimientos_conciliados}/${resumen.movimientos_total}`]].map(([l, v]) => (
            <div key={l} className="bg-white rounded-xl border border-gray-200 p-3"><p className="text-xs text-gray-500">{l}</p><p className="text-sm font-bold text-gray-800">{v}</p></div>
          ))}
          {resumen.conciliado && <div className="col-span-full text-green-700 text-sm font-medium">✓ Extracto totalmente conciliado</div>}
          {resumen.egresos_no_debitados > 0 && <div className="col-span-full text-xs text-gray-500">{resumen.egresos_no_debitados} egreso(s) del sistema aún no debitados en el banco (p.ej. cheques diferidos en cartera)</div>}
        </div>
      )}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="min-w-full text-left text-xs">
          <thead><tr className="border-b border-gray-100 bg-gray-50/70 text-gray-500 uppercase tracking-wide">
            {['Fecha', 'Descripción', 'Importe', 'Estado', 'Conciliar con'].map((h) => <th key={h} className="px-3 py-2.5 font-semibold whitespace-nowrap">{h}</th>)}
          </tr></thead>
          <tbody className="divide-y divide-gray-50">
            {ex?.movimientos?.length ? ex.movimientos.map((m) => (
              <tr key={m.id} className={m.conciliado ? 'bg-green-50/40' : 'hover:bg-primary-50/40'}>
                <td className="px-3 py-2">{m.fecha || '—'}</td>
                <td className="px-3 py-2">{m.descripcion || '—'}</td>
                <td className={`px-3 py-2 text-right font-medium ${Number(m.importe) < 0 ? 'text-red-600' : 'text-green-700'}`}>{fmt(m.importe)}</td>
                <td className="px-3 py-2">{m.conciliado ? <span className="text-green-700">✓ conciliado</span> : <span className="text-gray-400">pendiente</span>}</td>
                <td className="px-3 py-2">
                  {m.conciliado ? (
                    <button className="text-red-500 hover:underline" onClick={() => desconciliar(m)}>Desconciliar</button>
                  ) : (
                    <div className="flex items-center gap-1">
                      <select className="border border-gray-200 rounded px-1 py-0.5 text-xs" value={pick[m.id] || ''} onChange={(e) => setPick({ ...pick, [m.id]: e.target.value })}>
                        <option value="">(solo banco)</option>
                        {egresos?.map((e) => <option key={e.id} value={e.id}>{e.medio}{e.numero_cheque ? ' ' + e.numero_cheque : ''} · {fmt(e.importe)} · {e.beneficiario || ''}</option>)}
                      </select>
                      <button className="text-primary-600 hover:underline" onClick={() => conciliar(m)}>Conciliar</button>
                    </div>
                  )}
                </td>
              </tr>
            )) : <tr><td colSpan={5} className="px-3 py-8 text-center text-gray-400">El extracto no tiene movimientos.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function NuevoExtractoModal({ onClose, onDone }) {
  const { data: cuentas } = useQuery({ queryKey: ['tes-ctas'], queryFn: cuentasQuery });
  const [f, setF] = useState({ id_cuenta_bancaria: '', periodo: '', saldo_inicial: '', saldo_final: '' });
  const [movs, setMovs] = useState([{ fecha: '', descripcion: '', importe: '' }]);
  const [msg, setMsg] = useState('');
  const setMov = (i, k, v) => setMovs((p) => p.map((m, x) => (x === i ? { ...m, [k]: v } : m)));
  const validos = movs.filter((m) => m.importe !== '' && !isNaN(Number(m.importe)));
  const m = useMutation({
    mutationFn: () => tesoreriaAPI.conciliacion.crearExtracto({
      id_cuenta_bancaria: Number(f.id_cuenta_bancaria), periodo: f.periodo,
      saldo_inicial: Number(f.saldo_inicial || 0), saldo_final: Number(f.saldo_final || 0),
      movimientos: validos.map((x) => ({ fecha: x.fecha || null, descripcion: x.descripcion || null, importe: Number(x.importe) })),
    }),
    onSuccess: onDone, onError: (e) => setMsg(e.response?.data?.detail || 'Error'),
  });
  return (
    <Modal title="Cargar extracto bancario" onClose={onClose} wide>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Cuenta bancaria">
            <select className={inputClass} value={f.id_cuenta_bancaria} onChange={(e) => setF({ ...f, id_cuenta_bancaria: e.target.value })}>
              <option value="">Seleccionar...</option>
              {cuentas?.filter((c) => c.activo !== false).map((c) => <option key={c.id} value={c.id}>{c.banco} {c.numero}</option>)}
            </select>
          </Field>
          <Field label="Período (YYYY-MM)"><input className={inputClass} value={f.periodo} onChange={(e) => setF({ ...f, periodo: e.target.value })} placeholder="2026-06" /></Field>
          <Field label="Saldo inicial"><input type="number" className={inputClass} value={f.saldo_inicial} onChange={(e) => setF({ ...f, saldo_inicial: e.target.value })} /></Field>
          <Field label="Saldo final"><input type="number" className={inputClass} value={f.saldo_final} onChange={(e) => setF({ ...f, saldo_final: e.target.value })} /></Field>
        </div>
        <p className="text-xs text-gray-500">Movimientos (importe negativo = débito, positivo = crédito):</p>
        <div className="space-y-2 max-h-56 overflow-y-auto">
          {movs.map((mv, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 items-center">
              <input type="date" className={`${inputClass} col-span-3`} value={mv.fecha} onChange={(e) => setMov(i, 'fecha', e.target.value)} />
              <input className={`${inputClass} col-span-6`} placeholder="Descripción" value={mv.descripcion} onChange={(e) => setMov(i, 'descripcion', e.target.value)} />
              <input type="number" className={`${inputClass} col-span-2`} placeholder="Importe" value={mv.importe} onChange={(e) => setMov(i, 'importe', e.target.value)} />
              <button className="col-span-1 text-red-500" onClick={() => setMovs((p) => p.filter((_, x) => x !== i))}>✕</button>
            </div>
          ))}
        </div>
        <button className={btnSecondary} onClick={() => setMovs((p) => [...p, { fecha: '', descripcion: '', importe: '' }])}>+ Movimiento</button>
        {msg && <p className="text-red-600 text-sm">⚠ {msg}</p>}
        <button className={`${btnPrimary} w-full`} disabled={m.isPending || !f.id_cuenta_bancaria || !f.periodo.trim()} onClick={() => m.mutate()}>{m.isPending ? '...' : 'Guardar extracto'}</button>
      </div>
    </Modal>
  );
}
