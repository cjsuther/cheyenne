import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tesoreriaAPI } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Modal, Field, inputClass, btnPrimary, btnSecondary } from '../../components/common/CrudComponents';

const fmt = (v) => new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(v || 0));
const ESTADO = { pendiente: 'bg-amber-100 text-amber-700', pagada: 'bg-green-100 text-green-700', anulada: 'bg-gray-200 text-gray-500' };
const MEDIOS = [['efectivo', 'Efectivo'], ['cheque', 'Cheque'], ['transferencia', 'Transferencia'], ['orden_bancaria', 'Orden bancaria']];

export function OrdenesPagoTab() {
  const qc = useQueryClient();
  const [modal, setModal] = useState(null);
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');
  const { data: ops, isLoading } = useQuery({
    queryKey: ['tes-op'],
    queryFn: () => tesoreriaAPI.ordenesPago.list({ limit: 100 }).then((r) => r.data),
  });
  const refetch = () => qc.invalidateQueries({ queryKey: ['tes-op'] });

  return (
    <div>
      {error && <div className="mb-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2 flex justify-between"><span>⚠ {error}</span><button onClick={() => setError('')} className="text-red-500">✕</button></div>}
      {ok && <div className="mb-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-2 flex justify-between"><span>✓ {ok}</span><button onClick={() => setOk('')} className="text-green-600">✕</button></div>}
      <div className="mb-3 flex justify-end"><button className={btnPrimary} onClick={() => setModal('nueva')}>Nueva orden de pago</button></div>
      {isLoading ? <LoadingSpinner /> : (
        <div className="space-y-2">
          {ops?.length ? ops.map((op) => (
            <div key={op.id} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-800">{op.orden_pago} — {op.beneficiario || 'sin beneficiario'}</p>
                  <p className="text-xs text-gray-500">{op.concepto || ''}{op.referencia_externa ? ` · ${op.referencia_externa}` : ''} · origen {op.origen}
                    {op.pagos?.[0] ? ` · ${op.pagos[0].medio}${op.pagos[0].numero_cheque ? ' ' + op.pagos[0].numero_cheque : ''}` : ''}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-800">{fmt(op.importe)}</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${ESTADO[op.estado]}`}>{op.estado}</span>
                  {op.estado === 'pendiente' && <button className={btnPrimary.replace('px-4 py-2', 'px-3 py-1.5')} onClick={() => setModal({ pagar: op })}>Pagar</button>}
                  {op.estado !== 'anulada' && <button className={btnSecondary} onClick={() => { setError(''); setOk(''); tesoreriaAPI.ordenesPago.enviarAFirma(op.id).then((r) => setOk(`${op.orden_pago} enviada a firma (requiere ${r.data?.documento?.cantidad_firmas || 2} firmas).`)).catch((e) => setError(e.response?.data?.detail || 'No se pudo enviar a firma')); }}>Enviar a firma</button>}
                  {op.estado !== 'anulada' && <button className={btnSecondary} onClick={() => { if (confirm('¿Anular la OP?')) tesoreriaAPI.ordenesPago.anular(op.id).then(refetch).catch((e) => setError(e.response?.data?.detail)); }}>Anular</button>}
                </div>
              </div>
            </div>
          )) : <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">Sin órdenes de pago.</div>}
        </div>
      )}
      {modal === 'nueva' && <NuevaOPModal onClose={() => setModal(null)} onDone={() => { setModal(null); refetch(); }} />}
      {modal?.pagar && <PagarModal op={modal.pagar} onClose={() => setModal(null)} onDone={() => { setModal(null); refetch(); }} onError={(m) => { setError(m); setModal(null); }} />}
    </div>
  );
}

function NuevaOPModal({ onClose, onDone }) {
  const { data: benef } = useQuery({ queryKey: ['tes-benef'], queryFn: () => tesoreriaAPI.beneficiarios.list({ limit: 200 }).then((r) => r.data) });
  const [f, setF] = useState({ anio: new Date().getFullYear(), id_beneficiario: '', importe: '', concepto: '' });
  const [msg, setMsg] = useState('');
  const m = useMutation({
    mutationFn: () => tesoreriaAPI.ordenesPago.create({ anio: Number(f.anio), id_beneficiario: f.id_beneficiario ? Number(f.id_beneficiario) : null, importe: Number(f.importe), concepto: f.concepto || null }),
    onSuccess: onDone, onError: (e) => setMsg(e.response?.data?.detail || 'Error'),
  });
  return (
    <Modal title="Nueva orden de pago" onClose={onClose}>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Año"><input type="number" className={inputClass} value={f.anio} onChange={(e) => setF({ ...f, anio: e.target.value })} /></Field>
          <Field label="Importe"><input type="number" className={inputClass} value={f.importe} onChange={(e) => setF({ ...f, importe: e.target.value })} /></Field>
        </div>
        <Field label="Beneficiario">
          <select className={inputClass} value={f.id_beneficiario} onChange={(e) => setF({ ...f, id_beneficiario: e.target.value })}>
            <option value="">Seleccionar...</option>
            {benef?.filter((b) => b.activo !== false).map((b) => <option key={b.id} value={b.id}>{b.codigo} — {b.nombre}</option>)}
          </select>
        </Field>
        <Field label="Concepto"><input className={inputClass} value={f.concepto} onChange={(e) => setF({ ...f, concepto: e.target.value })} /></Field>
        {msg && <p className="text-red-600 text-sm">⚠ {msg}</p>}
        <button className={`${btnPrimary} w-full`} disabled={m.isPending || !(Number(f.importe) > 0)} onClick={() => m.mutate()}>{m.isPending ? '...' : 'Crear OP'}</button>
      </div>
    </Modal>
  );
}

function PagarModal({ op, onClose, onDone, onError }) {
  const { data: cuentas } = useQuery({ queryKey: ['tes-ctas'], queryFn: () => tesoreriaAPI.cuentasBancarias.list({ limit: 200 }).then((r) => r.data) });
  const [medio, setMedio] = useState('transferencia');
  const [idCuenta, setIdCuenta] = useState('');
  const [numeroCheque, setNumeroCheque] = useState('');
  // retenciones pre-cargadas desde lo liquidado por Contaduría (op.retenciones_sugeridas)
  const [rets, setRets] = useState(() => (op.retenciones_sugeridas || []).map((r) => ({
    regimen: r.regimen || '', base: r.base ?? op.importe, alicuota: r.alicuota ?? 0,
    importe: r.importe ?? 0, comprobante: r.comprobante || '',
  })));
  const requiereCuenta = medio !== 'efectivo';
  const totalRet = rets.reduce((s, r) => s + Number(r.importe || 0), 0);
  const neto = Number(op.importe) - totalRet;
  const conRetenciones = rets.length > 0;
  const setRet = (i, k, v) => setRets((p) => p.map((r, x) => (x === i ? { ...r, [k]: v } : r)));

  const m = useMutation({
    mutationFn: () => {
      const base = { medio, id_cuenta_bancaria: idCuenta ? Number(idCuenta) : null, numero_cheque: numeroCheque || null };
      if (conRetenciones) {
        return tesoreriaAPI.pagarConRetenciones(op.id, {
          ...base,
          retenciones: rets.map((r) => ({
            regimen: r.regimen, base: Number(r.base || 0), alicuota: Number(r.alicuota || 0),
            importe: Number(r.importe || 0), comprobante: r.comprobante || null,
          })),
        });
      }
      return tesoreriaAPI.ordenesPago.pagar(op.id, base);
    },
    onSuccess: onDone, onError: (e) => onError(e.response?.data?.detail || 'Error'),
  });
  return (
    <Modal title={`Pagar ${op.orden_pago} — ${fmt(op.importe)}`} onClose={onClose} wide={conRetenciones}>
      <div className="space-y-3">
        <p className="text-sm text-gray-500">{op.beneficiario || ''} · {op.concepto || ''}</p>
        <Field label="Medio de pago">
          <select className={inputClass} value={medio} onChange={(e) => setMedio(e.target.value)}>
            {MEDIOS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </Field>
        {requiereCuenta && (
          <Field label="Cuenta bancaria">
            <select className={inputClass} value={idCuenta} onChange={(e) => setIdCuenta(e.target.value)}>
              <option value="">Seleccionar...</option>
              {cuentas?.filter((c) => c.activo !== false).map((c) => <option key={c.id} value={c.id}>{c.banco} {c.numero} (saldo {fmt(c.saldo_actual)})</option>)}
            </select>
          </Field>
        )}
        {medio === 'cheque' && <Field label="Número de cheque"><input className={inputClass} value={numeroCheque} onChange={(e) => setNumeroCheque(e.target.value)} /></Field>}

        {/* Retenciones (pre-cargadas de Contaduría, editables) */}
        <div className="border border-gray-200 rounded-lg p-3 bg-gray-50/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Retenciones {op.retenciones_sugeridas?.length ? <span className="text-xs text-blue-600">(sugeridas por Contaduría)</span> : ''}</span>
            <button type="button" className={btnSecondary} onClick={() => setRets((p) => [...p, { regimen: 'iibb', base: op.importe, alicuota: 0, importe: 0, comprobante: '' }])}>+ Retención</button>
          </div>
          {rets.length === 0 ? <p className="text-xs text-gray-400">Sin retenciones — se paga el importe completo.</p> : (
            <div className="space-y-1.5">
              {rets.map((r, i) => (
                <div key={i} className="grid grid-cols-12 gap-1.5 items-center">
                  <select className={`${inputClass} col-span-3 py-1`} value={r.regimen} onChange={(e) => setRet(i, 'regimen', e.target.value)}>
                    {['iibb', 'ganancias', 'iva', 'sijp', 'otros'].map((x) => <option key={x} value={x}>{x.toUpperCase()}</option>)}
                  </select>
                  <input type="number" className={`${inputClass} col-span-2 py-1`} placeholder="Base" value={r.base} onChange={(e) => setRet(i, 'base', e.target.value)} />
                  <input type="number" className={`${inputClass} col-span-2 py-1`} placeholder="Alíc%" value={r.alicuota} onChange={(e) => setRet(i, 'alicuota', e.target.value)} />
                  <input type="number" className={`${inputClass} col-span-2 py-1`} placeholder="Importe" value={r.importe} onChange={(e) => setRet(i, 'importe', e.target.value)} />
                  <input className={`${inputClass} col-span-2 py-1`} placeholder="Comprob." value={r.comprobante} onChange={(e) => setRet(i, 'comprobante', e.target.value)} />
                  <button type="button" className="col-span-1 text-red-500" onClick={() => setRets((p) => p.filter((_, x) => x !== i))}>✕</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {conRetenciones && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Retenciones: <b>{fmt(totalRet)}</b></span>
            <span className="text-gray-700">Neto a pagar: <b>{fmt(neto)}</b></span>
          </div>
        )}
        <p className="text-xs text-gray-400">El pago (neto) queda en el parte diario; las retenciones quedan como pasivo a depositar.</p>
        <button className={`${btnPrimary} w-full`} disabled={m.isPending || (requiereCuenta && !idCuenta) || (medio === 'cheque' && !numeroCheque) || neto < 0} onClick={() => m.mutate()}>
          {m.isPending ? 'Pagando...' : conRetenciones ? `Pagar neto ${fmt(neto)}` : 'Confirmar pago'}
        </button>
      </div>
    </Modal>
  );
}

export function ParteEgresosTab() {
  const [fecha, setFecha] = useState('');
  const { data, isLoading } = useQuery({
    queryKey: ['tes-parte', fecha],
    queryFn: () => tesoreriaAPI.parteEgresos(fecha || undefined).then((r) => r.data),
  });
  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <input type="date" className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm" value={fecha} onChange={(e) => setFecha(e.target.value)} />
        {data && <span className="text-sm text-gray-500 ml-2">Total del día: <b className="text-gray-800">{fmt(data.total)}</b></span>}
        {data?.por_medio && Object.entries(data.por_medio).map(([k, v]) => <span key={k} className="text-xs bg-gray-100 rounded px-2 py-0.5">{k}: {fmt(v)}</span>)}
      </div>
      {isLoading ? <LoadingSpinner /> : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
          <table className="min-w-full text-left text-xs">
            <thead><tr className="border-b border-gray-100 bg-gray-50/70 text-gray-500 uppercase tracking-wide">
              {['OP', 'Beneficiario', 'Medio', 'Cheque', 'Importe', 'Usuario', 'Hora'].map((h) => <th key={h} className="px-3 py-2.5 font-semibold whitespace-nowrap">{h}</th>)}
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {data?.egresos?.length ? data.egresos.map((e) => (
                <tr key={e.id} className="hover:bg-primary-50/40">
                  <td className="px-3 py-2">{e.orden_pago}</td>
                  <td className="px-3 py-2">{e.beneficiario || '—'}</td>
                  <td className="px-3 py-2 capitalize">{e.medio}</td>
                  <td className="px-3 py-2">{e.numero_cheque || '—'}</td>
                  <td className="px-3 py-2 text-right font-medium">{fmt(e.importe)}</td>
                  <td className="px-3 py-2">{e.usuario}</td>
                  <td className="px-3 py-2">{e.fecha ? new Date(e.fecha).toLocaleTimeString() : ''}</td>
                </tr>
              )) : <tr><td colSpan={7} className="px-3 py-8 text-center text-gray-400">Sin egresos en la fecha.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
