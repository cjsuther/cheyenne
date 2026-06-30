import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ingresosPublicosAPI, emisionesAPI } from '../../services/api';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Modal, Field, inputClass, btnPrimary, btnSecondary } from '../../components/common/CrudComponents';

const fmtMoney = (v) =>
  `$${Number(v || 0).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const fmtDate = (v) => (v ? new Date(v).toLocaleDateString('es-AR') : '-');

function Stat({ label, value, highlight }) {
  return (
    <div className={`rounded-xl border p-4 ${highlight ? 'bg-red-50 border-red-100' : 'bg-white border-gray-100'}`}>
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`text-xl font-bold mt-1 ${highlight ? 'text-red-700' : 'text-gray-800'}`}>{value}</p>
    </div>
  );
}

export default function Contribuyente360() {
  const [q, setQ] = useState('');
  const [dq, setDq] = useState('');
  const [selected, setSelected] = useState(null);

  // debounce de la búsqueda
  useEffect(() => {
    const t = setTimeout(() => setDq(q.trim()), 300);
    return () => clearTimeout(t);
  }, [q]);

  const { data: resultados, isFetching: buscando } = useQuery({
    queryKey: ['c360-search', dq],
    queryFn: () => ingresosPublicosAPI.contribuyentes.search(dq).then((r) => r.data),
    enabled: dq.length >= 2 && !selected,
  });

  const { data: deuda, isFetching: cargandoDeuda } = useQuery({
    queryKey: ['c360-deuda', selected?.id],
    queryFn: () => emisionesAPI.deudaPorContribuyente(selected.id, { solo_deuda: false }).then((r) => r.data),
    enabled: !!selected,
  });

  const queryClient = useQueryClient();
  const [pagando, setPagando] = useState(null); // concepto a pagar
  const [importe, setImporte] = useState('');
  const [pagoError, setPagoError] = useState('');
  const [guardando, setGuardando] = useState(false);

  const filas = deuda ?? [];
  const totalDeuda = filas.reduce((s, d) => s + Number(d.saldo || 0), 0);
  const conDeuda = filas.filter((d) => Number(d.saldo || 0) > 0);
  const totalAPagar = conDeuda.reduce((s, d) => s + Number(d.total_a_pagar || d.saldo || 0), 0);
  const porTributo = filas.reduce((acc, d) => {
    const k = d.tipo_tributo || 'otros';
    acc[k] = (acc[k] || 0) + Number(d.saldo || 0);
    return acc;
  }, {});

  const abrirPago = (cc) => {
    setPagando(cc);
    setImporte(String(cc.total_a_pagar ?? cc.saldo ?? ''));
    setPagoError('');
  };

  const confirmarPago = async () => {
    setGuardando(true);
    setPagoError('');
    try {
      await emisionesAPI.pagarConcepto(pagando.id, { importe: Number(importe) });
      await queryClient.invalidateQueries({ queryKey: ['c360-deuda', selected.id] });
      setPagando(null);
    } catch (e) {
      setPagoError(e?.response?.data?.detail || 'No se pudo registrar el pago');
    } finally {
      setGuardando(false);
    }
  };

  const cols = [
    { key: 'tipo_tributo', label: 'Tributo', render: (v) => <span className="capitalize">{v || '-'}</span> },
    { key: 'periodo', label: 'Período' },
    { key: 'concepto', label: 'Concepto' },
    { key: 'fecha_vencimiento', label: 'Vencimiento', render: fmtDate },
    { key: 'estado', label: 'Estado' },
    { key: 'saldo', label: 'Saldo', render: fmtMoney },
    { key: 'recargo', label: 'Recargo', render: (v) => (Number(v) > 0 ? <span className="text-amber-600">{fmtMoney(v)}</span> : '—') },
    { key: 'total_a_pagar', label: 'Total a pagar', render: (v, row) => <b>{fmtMoney(v ?? row.saldo)}</b> },
    {
      key: '_pagar', label: '',
      render: (_, row) =>
        Number(row.saldo) > 0 ? (
          <button onClick={() => abrirPago(row)} className="text-xs bg-primary-600 hover:bg-primary-700 text-white px-3 py-1 rounded-md font-medium">
            Pagar
          </button>
        ) : (
          <span className="text-xs text-green-600 font-medium">Pagado</span>
        ),
    },
  ];

  return (
    <div>
      <PageHeader title="Vista 360 del Contribuyente" subtitle="Buscá por CUIL, DNI o nombre y consultá toda su deuda" />

      {!selected ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="relative max-w-xl">
            <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="7" /><path strokeLinecap="round" d="m21 21-4.3-4.3" />
            </svg>
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="CUIL, DNI o nombre y apellido..."
              className="w-full border border-gray-200 rounded-lg pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          {dq.length >= 2 && (
            <div className="mt-3 max-w-xl divide-y divide-gray-100 border border-gray-100 rounded-lg overflow-hidden">
              {buscando ? (
                <div className="p-4 text-sm text-gray-500">Buscando…</div>
              ) : resultados?.length ? (
                resultados.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelected(c)}
                    className="w-full text-left px-4 py-3 hover:bg-primary-50/60 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{c.nombre_completo}</p>
                      <p className="text-xs text-gray-500">Doc: {c.numero_documento} · contrib. #{c.id}</p>
                    </div>
                    <span className="text-primary-600 text-xs shrink-0">Ver deuda →</span>
                  </button>
                ))
              ) : (
                <div className="p-4 text-sm text-gray-500">Sin resultados para “{dq}”.</div>
              )}
            </div>
          )}
          {dq.length < 2 && <p className="mt-3 text-xs text-gray-400">Escribí al menos 2 caracteres para buscar.</p>}
        </div>
      ) : (
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-lg font-bold text-gray-800 truncate">{selected.nombre_completo}</p>
              <p className="text-sm text-gray-500">Documento {selected.numero_documento} · Contribuyente #{selected.id}</p>
            </div>
            <button onClick={() => setSelected(null)} className="text-sm text-primary-600 hover:underline shrink-0">← Buscar otro</button>
          </div>

          {cargandoDeuda ? (
            <LoadingSpinner />
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Stat label="Deuda (capital)" value={fmtMoney(totalDeuda)} highlight />
                <Stat label="Total a pagar (c/ recargo)" value={fmtMoney(totalAPagar)} highlight />
                <Stat label="Conceptos con deuda" value={conDeuda.length} />
                <Stat label="Registros en cta. cte." value={filas.length} />
              </div>

              {Object.keys(porTributo).length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {Object.entries(porTributo).map(([k, v]) => (
                    <span key={k} className="text-xs bg-gray-100 text-gray-700 rounded-full px-3 py-1 capitalize">
                      {k}: <b>{fmtMoney(v)}</b>
                    </span>
                  ))}
                </div>
              )}

              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Detalle de deuda</h3>
                {filas.length > 0 ? (
                  <DataTable columns={cols} data={filas} />
                ) : (
                  <p className="text-sm text-gray-500 bg-gray-50 rounded-lg px-4 py-4">
                    Este contribuyente no tiene deuda registrada en cuenta corriente.
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {pagando && (
        <Modal title={`Registrar pago — ${pagando.concepto || 'concepto #' + pagando.id}`} onClose={() => setPagando(null)}>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <p className="text-xs text-gray-500">Saldo (capital)</p>
                <p className="text-sm font-semibold">{fmtMoney(pagando.saldo)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Recargo mora ({pagando.dias_mora || 0} d)</p>
                <p className="text-sm font-semibold text-amber-600">{fmtMoney(pagando.recargo)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Total a pagar</p>
                <p className="text-sm font-semibold text-primary-700">{fmtMoney(pagando.total_a_pagar ?? pagando.saldo)}</p>
              </div>
            </div>
            <Field label="Importe a pagar">
              <input className={inputClass} type="number" step="0.01" value={importe} onChange={(e) => setImporte(e.target.value)} autoFocus />
            </Field>
            <p className="text-xs text-gray-400">Un importe menor al total deja el concepto en estado “parcial”.</p>
            {pagoError && <div className="bg-red-50 text-red-700 text-sm rounded-lg px-3 py-2">{pagoError}</div>}
            <div className="flex justify-end gap-2 pt-1">
              <button className={btnSecondary} onClick={() => setPagando(null)} disabled={guardando}>Cancelar</button>
              <button className={btnPrimary} onClick={confirmarPago} disabled={guardando}>
                {guardando ? 'Registrando…' : 'Registrar pago'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
