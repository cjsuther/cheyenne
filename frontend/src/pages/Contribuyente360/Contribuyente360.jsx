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
const nomenclatura = (i) => [i.circuito, i.sector, i.fraccion, i.parcela].filter(Boolean).join('-') || '—';

const CUENTAS_COLS = [
  { key: 'numero_cuenta', label: 'N° Cuenta' },
  { key: 'codigo_delegacion', label: 'Delegación' },
  { key: 'id_tipo_tributo', label: 'Tributo' },
  { key: 'activo', label: 'Estado', render: (v) => (v ? 'Activa' : 'Baja') },
];
const INMUEBLES_COLS = [
  { key: 'id', label: 'ID' },
  { key: '_nom', label: 'Nomenclatura', render: (_, r) => nomenclatura(r) },
];
const COMERCIOS_COLS = [
  { key: 'id', label: 'ID' },
  { key: 'nombre_fantasia', label: 'Nombre de fantasía' },
  { key: 'cuit', label: 'CUIT' },
];
const VEHICULOS_COLS = [
  { key: 'dominio', label: 'Dominio' },
  { key: 'modelo', label: 'Modelo' },
  { key: 'anio', label: 'Año' },
];
const PLANES_COLS = [
  { key: 'numero_plan', label: 'N° Plan' },
  { key: 'cantidad_cuotas', label: 'Cuotas' },
  { key: 'importe_total', label: 'Importe total', render: fmtMoney },
  { key: 'id_estado_plan', label: 'Estado' },
];

function Seccion({ titulo, cols, data }) {
  if (!data?.length) return null;
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-700 mb-2">{titulo} ({data.length})</h3>
      <DataTable columns={cols} data={data} />
    </div>
  );
}

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

  const { data: deuda, isFetching: cargandoDeuda, isError: deudaError, error: deudaErrObj, refetch: refetchDeuda } = useQuery({
    queryKey: ['c360-deuda', selected?.id],
    queryFn: () => emisionesAPI.deudaPorContribuyente(selected.id, { solo_deuda: false }).then((r) => r.data),
    enabled: !!selected,
    retry: 1,
  });

  const { data: pagos } = useQuery({
    queryKey: ['c360-pagos', selected?.id],
    queryFn: () => emisionesAPI.pagosPorContribuyente(selected.id).then((r) => r.data),
    enabled: !!selected,
  });

  const { data: recibos } = useQuery({
    queryKey: ['c360-recibos', selected?.id],
    queryFn: () => emisionesAPI.recibosPdfPorContribuyente(selected.id).then((r) => r.data),
    enabled: !!selected,
  });

  const descargarRecibo = async (r) => {
    const { data } = await emisionesAPI.descargarRecibo(r.id_emision, r.ambito, r.archivo);
    const url = URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url; a.download = r.archivo; a.click();
    URL.revokeObjectURL(url);
  };

  const { data: objetos } = useQuery({
    queryKey: ['c360-objetos', selected?.id],
    queryFn: () => ingresosPublicosAPI.contribuyentes.objetos(selected.id).then((r) => r.data),
    enabled: !!selected,
  });

  const { data: planes } = useQuery({
    queryKey: ['c360-planes', selected?.id],
    queryFn: () => ingresosPublicosAPI.planesPago.byContribuyente(selected.id).then((r) => r.data),
    enabled: !!selected,
  });

  const queryClient = useQueryClient();
  const [pagando, setPagando] = useState(null); // concepto a pagar
  const [importe, setImporte] = useState('');
  const [pagoError, setPagoError] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [ultimoRecibo, setUltimoRecibo] = useState(null);

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
      const { data } = await emisionesAPI.pagarConcepto(pagando.id, { importe: Number(importe) });
      await queryClient.invalidateQueries({ queryKey: ['c360-deuda', selected.id] });
      await queryClient.invalidateQueries({ queryKey: ['c360-pagos', selected.id] });
      setUltimoRecibo({ numero: data.numero_recibo, total: data.total_pagado });
      setPagando(null);
    } catch (e) {
      setPagoError(e?.response?.data?.detail || 'No se pudo registrar el pago');
    } finally {
      setGuardando(false);
    }
  };

  const imprimirRecibo = (r) => {
    const win = window.open('', '_blank', 'width=440,height=640');
    if (!win) return;
    win.document.write(`<html><head><title>${r.numero_recibo}</title>
      <style>body{font-family:system-ui,Arial,sans-serif;padding:28px;color:#1f2937}
      h1{font-size:18px;margin:0}.muted{color:#6b7280;font-size:12px;margin:2px 0}
      table{width:100%;border-collapse:collapse;margin-top:18px;font-size:13px}
      td{padding:7px 0;border-bottom:1px solid #eee}.r{text-align:right}
      .tot td{font-weight:700;font-size:15px;border-bottom:none;padding-top:12px}</style></head>
      <body>
        <h1>Recibo de pago</h1>
        <p class="muted">${r.numero_recibo} · ${r.fecha_pago ? new Date(r.fecha_pago).toLocaleDateString('es-AR') : ''}</p>
        <p class="muted">Contribuyente: ${selected.nombre_completo} (doc ${selected.numero_documento})</p>
        <table>
          <tr><td>Concepto</td><td class="r">${r.concepto || '-'}</td></tr>
          <tr><td>Tributo / Período</td><td class="r">${(r.tipo_tributo || '-')} ${r.periodo || ''}</td></tr>
          <tr><td>Capital</td><td class="r">${fmtMoney(r.capital_pagado)}</td></tr>
          <tr><td>Recargo por mora (${r.dias_mora || 0} d)</td><td class="r">${fmtMoney(r.recargo_mora)}</td></tr>
          <tr class="tot"><td>Total pagado</td><td class="r">${fmtMoney(r.total_pagado)}</td></tr>
        </table>
        <p class="muted" style="margin-top:28px">Cheyenne · Ingresos Públicos</p>
      </body></html>`);
    win.document.close();
    win.focus();
    win.print();
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

  const pagosCols = [
    { key: 'numero_recibo', label: 'Recibo', render: (v) => <span className="font-mono">{v}</span> },
    { key: 'fecha_pago', label: 'Fecha', render: fmtDate },
    { key: 'concepto', label: 'Concepto' },
    { key: 'capital_pagado', label: 'Capital', render: fmtMoney },
    { key: 'recargo_mora', label: 'Recargo', render: fmtMoney },
    { key: 'total_pagado', label: 'Total', render: (v) => <b>{fmtMoney(v)}</b> },
    {
      key: '_print', label: '',
      render: (_, row) => (
        <button onClick={() => imprimirRecibo(row)} className="text-xs text-primary-600 hover:underline">Imprimir</button>
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
            <button onClick={() => { setSelected(null); setUltimoRecibo(null); }} className="text-sm text-primary-600 hover:underline shrink-0">← Buscar otro</button>
          </div>

          {ultimoRecibo && (
            <div className="bg-green-50 border border-green-100 text-green-800 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
              <span className="text-sm">✓ Pago registrado · recibo <b>{ultimoRecibo.numero}</b> por {fmtMoney(ultimoRecibo.total)}</span>
              <button onClick={() => setUltimoRecibo(null)} className="text-green-700 text-xs hover:underline">Cerrar</button>
            </div>
          )}

          {cargandoDeuda ? (
            <LoadingSpinner />
          ) : deudaError ? (
            <div className="bg-red-50 border border-red-100 text-red-700 rounded-xl px-4 py-3 text-sm space-y-1">
              <div className="flex items-center justify-between gap-3">
                <span className="font-medium">No se pudo cargar la deuda. Probá de nuevo.</span>
                <button onClick={() => refetchDeuda()} className="text-red-700 underline text-xs shrink-0">Reintentar</button>
              </div>
              <p className="text-xs font-mono text-red-500">
                {deudaErrObj?.response?.status
                  ? `HTTP ${deudaErrObj.response.status}`
                  : `${deudaErrObj?.code || 'sin-codigo'} · ${deudaErrObj?.message || 'error'}`}
              </p>
            </div>
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

              {(pagos?.length ?? 0) > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Pagos realizados ({pagos.length})</h3>
                  <DataTable columns={pagosCols} data={pagos} />
                </div>
              )}

              {(recibos?.length ?? 0) > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Recibos / comprobantes ({recibos.length})</h3>
                  <div className="space-y-1.5">
                    {recibos.map((r) => (
                      <div key={`${r.id_emision}-${r.archivo}`} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 text-sm">
                        <div className="min-w-0">
                          <span className="font-medium text-gray-800">{r.numero_comprobante}</span>
                          <span className="text-gray-500 ml-2 capitalize">{r.tipo_tributo} {r.periodo}</span>
                          <span className="text-[11px] text-gray-400 ml-2">({r.ambito})</span>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-gray-600">{fmtMoney(r.importe_total)}</span>
                          <button onClick={() => descargarRecibo(r)} className="text-primary-600 hover:underline">Descargar PDF</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(objetos?.cuentas?.length || objetos?.inmuebles?.length || objetos?.comercios?.length || objetos?.vehiculos?.length || planes?.length) ? (
                <div className="pt-2 border-t border-gray-100 space-y-5">
                  <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Bienes, cuentas y planes</h2>
                  <Seccion titulo="Cuentas" cols={CUENTAS_COLS} data={objetos?.cuentas} />
                  <Seccion titulo="Inmuebles" cols={INMUEBLES_COLS} data={objetos?.inmuebles} />
                  <Seccion titulo="Comercios" cols={COMERCIOS_COLS} data={objetos?.comercios} />
                  <Seccion titulo="Vehículos" cols={VEHICULOS_COLS} data={objetos?.vehiculos} />
                  <Seccion titulo="Planes de pago" cols={PLANES_COLS} data={planes} />
                </div>
              ) : null}
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
