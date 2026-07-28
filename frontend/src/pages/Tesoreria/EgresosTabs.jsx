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
  const { data: ops, isLoading } = useQuery({
    queryKey: ['tes-op'],
    queryFn: () => tesoreriaAPI.ordenesPago.list({ limit: 100 }).then((r) => r.data),
  });
  const refetch = () => qc.invalidateQueries({ queryKey: ['tes-op'] });

  return (
    <div>
      {error && <div className="mb-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2 flex justify-between"><span>⚠ {error}</span><button onClick={() => setError('')} className="text-red-500">✕</button></div>}
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
  const requiereCuenta = medio !== 'efectivo';
  const m = useMutation({
    mutationFn: () => tesoreriaAPI.ordenesPago.pagar(op.id, { medio, id_cuenta_bancaria: idCuenta ? Number(idCuenta) : null, numero_cheque: numeroCheque || null }),
    onSuccess: onDone, onError: (e) => onError(e.response?.data?.detail || 'Error'),
  });
  return (
    <Modal title={`Pagar ${op.orden_pago} — ${fmt(op.importe)}`} onClose={onClose}>
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
        <p className="text-xs text-gray-400">El pago queda en el parte diario de egresos.</p>
        <button className={`${btnPrimary} w-full`} disabled={m.isPending || (requiereCuenta && !idCuenta) || (medio === 'cheque' && !numeroCheque)} onClick={() => m.mutate()}>{m.isPending ? 'Pagando...' : 'Confirmar pago'}</button>
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
