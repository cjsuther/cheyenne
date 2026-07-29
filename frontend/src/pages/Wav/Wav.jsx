import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ingresosPublicosAPI, wavAPI } from '../../services/api';
import PageHeader from '../../components/common/PageHeader';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const fmtMoney = (v) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(Number(v || 0));
const inputCls = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500';
const btn = 'bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50';
const btnSec = 'bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded text-xs font-medium';

// Descarga el recibo PDF autenticado (blob) y lo abre en una pestaña.
const descargarReciboPdf = async (idPago) => {
  try {
    const resp = await wavAPI.recibos.pagoContadoPdf(idPago);
    const url = URL.createObjectURL(new Blob([resp.data], { type: 'application/pdf' }));
    window.open(url, '_blank');
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  } catch {
    alert('No se pudo generar el recibo PDF.');
  }
};

export default function Wav() {
  const [tab, setTab] = useState('autogestion'); // 'autogestion' | 'debito'

  return (
    <div>
      <PageHeader title="WAV — Autogestión" subtitle="Portal ciudadano: cuentas, declaraciones juradas y pagos" />
      <div className="flex gap-1 mb-5 border-b border-gray-200">
        {[['autogestion', 'Autogestión'], ['debito', 'Débito automático']].map(([k, label]) => (
          <button key={k} onClick={() => setTab(k)}
            className={`px-4 py-2 text-sm font-medium -mb-px border-b-2 ${tab === k ? 'border-primary-600 text-primary-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            {label}
          </button>
        ))}
      </div>
      {tab === 'autogestion' ? <Autogestion /> : <DebitoAdmin />}
    </div>
  );
}

function Autogestion() {
  const [q, setQ] = useState('');
  const [dq, setDq] = useState('');
  const [selected, setSelected] = useState(null); // contribuyente
  const [cuentaSel, setCuentaSel] = useState(null);
  const qc = useQueryClient();

  // búsqueda de contribuyente (reusa ingresos_publicos)
  const onSearch = (e) => { e.preventDefault(); setDq(q.trim()); };
  const { data: resultados, isFetching } = useQuery({
    queryKey: ['wav-buscar', dq],
    queryFn: () => ingresosPublicosAPI.contribuyentes.search(dq).then((r) => r.data),
    enabled: dq.length >= 2,
  });

  const elegir = (c) => { setSelected(c); setCuentaSel(null); setDq(''); setQ(''); };

  // cuentas WAV del contribuyente
  const { data: cuentas, isLoading: cargandoCuentas } = useQuery({
    queryKey: ['wav-cuentas', selected?.id],
    queryFn: () => wavAPI.cuentas.byContribuyente(selected.id).then((r) => r.data),
    enabled: !!selected,
  });

  const [tipoTributo, setTipoTributo] = useState('1');
  const crearCuenta = useMutation({
    mutationFn: () => wavAPI.cuentas.create({ id_contribuyente: selected.id, id_tipo_tributo: Number(tipoTributo) || 1 }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['wav-cuentas', selected.id] }),
  });

  return (
    <div>
      {/* Buscar contribuyente */}
      <form onSubmit={onSearch} className="flex gap-2 mb-4 max-w-xl">
        <input className={inputCls} placeholder="Buscar contribuyente por CUIL, DNI o nombre..." value={q} onChange={(e) => setQ(e.target.value)} />
        <button className={btn} type="submit">Buscar</button>
      </form>

      {dq.length >= 2 && (
        <div className="bg-white rounded-lg border border-gray-200 divide-y mb-4 max-w-xl">
          {isFetching ? <div className="p-3 text-sm text-gray-500">Buscando...</div>
            : (resultados?.length ? resultados.map((c) => (
              <button key={c.id} onClick={() => elegir(c)} className="w-full text-left px-3 py-2 hover:bg-primary-50">
                <p className="text-sm font-medium text-gray-800">{c.nombre_completo}</p>
                <p className="text-xs text-gray-500">Doc: {c.numero_documento} · contrib. #{c.id}</p>
              </button>
            )) : <div className="p-3 text-sm text-gray-500">Sin resultados</div>)}
        </div>
      )}

      {!selected ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-500">
          Buscá un contribuyente para ver o crear sus cuentas de autogestión.
        </div>
      ) : (
        <div className="space-y-5">
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-gray-800">{selected.nombre_completo}</p>
              <p className="text-xs text-gray-500">Doc: {selected.numero_documento} · contrib. #{selected.id}</p>
            </div>
            <button className={btnSec} onClick={() => { setSelected(null); setCuentaSel(null); }}>Cambiar</button>
          </div>

          {/* Cuentas WAV */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700">Cuentas de autogestión</h3>
              <div className="flex items-center gap-2">
                <input className="w-28 border border-gray-300 rounded px-2 py-1 text-xs" type="number" value={tipoTributo}
                  onChange={(e) => setTipoTributo(e.target.value)} placeholder="Tipo tributo" title="ID tipo de tributo" />
                <button className={btnSec} onClick={() => crearCuenta.mutate()} disabled={crearCuenta.isPending}>+ Nueva cuenta</button>
              </div>
            </div>
            {cargandoCuentas ? <LoadingSpinner /> : (cuentas?.length ? (
              <div className="flex flex-wrap gap-2">
                {cuentas.map((c) => (
                  <button key={c.id} onClick={() => setCuentaSel(c)}
                    className={`px-3 py-2 rounded-lg text-sm border ${cuentaSel?.id === c.id ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}>
                    <span className="font-medium">{c.numero_cuenta}</span>
                    <span className="ml-2 text-xs opacity-80">tributo {c.id_tipo_tributo}</span>
                  </button>
                ))}
              </div>
            ) : <p className="text-sm text-gray-500">Sin cuentas. Creá una con "+ Nueva cuenta".</p>)}
          </div>

          {/* Deuda / cuenta corriente del contribuyente (emisiones) */}
          <DeudaPanel contribuyente={selected} />

          {cuentaSel && <CuentaPanel cuenta={cuentaSel} />}
        </div>
      )}
    </div>
  );
}

function DeudaPanel({ contribuyente }) {
  const qc = useQueryClient();
  const [pagando, setPagando] = useState(null); // concepto de deuda a pagar
  const { data: deuda, isLoading } = useQuery({
    queryKey: ['wav-deuda', contribuyente.id],
    queryFn: () => wavAPI.deuda.byContribuyente(contribuyente.id, true).then((r) => r.data),
    enabled: !!contribuyente,
  });

  const totalDeuda = (deuda || []).reduce((s, d) => s + Number(d.total_a_pagar ?? d.saldo ?? 0), 0);

  const abrirRecibo = (id_cc) => {
    // Los recibos oficiales de deuda pagada los genera emisiones; abrimos el listado del contribuyente
    wavAPI.recibos.emisionesByContribuyente(contribuyente.id).then((r) => {
      const rec = (r.data || []).find((x) => x.id_cuenta_corriente === id_cc) || (r.data || [])[0];
      if (rec?.url) window.open(rec.url, '_blank');
      else alert('El recibo aún no está disponible para descargar.');
    });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">Deuda / cuenta corriente</h3>
        <span className="text-sm">Total: <b className={totalDeuda > 0 ? 'text-red-600' : 'text-green-600'}>{fmtMoney(totalDeuda)}</b></span>
      </div>
      {isLoading ? <LoadingSpinner /> : (deuda?.length ? (
        <div className="space-y-1.5">
          {deuda.map((d) => (
            <div key={d.id} className="bg-gray-50 rounded-lg px-3 py-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="font-medium">{d.tipo_tributo} {d.periodo || ''}{d.cuota ? ` · cuota ${d.cuota}` : ''}</span>
                <span className="text-xs text-gray-500">{d.concepto || d.numero_comprobante || `CC #${d.id}`}</span>
              </div>
              <div className="flex items-center justify-between mt-1 text-xs text-gray-600">
                <span>
                  Saldo {fmtMoney(d.saldo)}
                  {Number(d.recargo) > 0 && <> · recargo {fmtMoney(d.recargo)} ({d.dias_mora}d)</>}
                  {' · '}<b>a pagar {fmtMoney(d.total_a_pagar ?? d.saldo)}</b>
                </span>
                <span className="flex gap-2">
                  <button className={btnSec} onClick={() => setPagando(d)}>Pagar</button>
                  <button className={btnSec} onClick={() => abrirRecibo(d.id)}>Recibo</button>
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : <p className="text-sm text-gray-400">Sin deuda registrada en emisiones.</p>)}

      {pagando && (
        <PagarDeudaModal
          concepto={pagando}
          onClose={() => setPagando(null)}
          onDone={() => { setPagando(null); qc.invalidateQueries({ queryKey: ['wav-deuda', contribuyente.id] }); }}
        />
      )}

      <DebitoAutomatico contribuyente={contribuyente} />
    </div>
  );
}

function PagarDeudaModal({ concepto, onClose, onDone }) {
  const aPagar = Number(concepto.total_a_pagar ?? concepto.saldo ?? 0);
  const [importe, setImporte] = useState(String(aPagar));
  const pagar = useMutation({
    mutationFn: () => wavAPI.deuda.pagar(concepto.id, { importe: Number(importe) }),
    onSuccess: onDone,
  });
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
        <div className="px-5 py-3 border-b flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">Pagar deuda — {concepto.tipo_tributo} {concepto.periodo || ''}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
        </div>
        <div className="p-5 space-y-3">
          <p className="text-sm text-gray-500">Total a pagar: <b>{fmtMoney(aPagar)}</b></p>
          <label className="text-xs text-gray-500">Importe</label>
          <input className={inputCls} type="number" value={importe} onChange={(e) => setImporte(e.target.value)} />
          <p className="text-xs text-gray-400">Baja el saldo de la cuenta corriente en emisiones.</p>
          <button className={`${btn} w-full`} disabled={pagar.isPending || Number(importe) <= 0} onClick={() => pagar.mutate()}>
            {pagar.isPending ? 'Procesando...' : 'Confirmar pago'}
          </button>
        </div>
      </div>
    </div>
  );
}

function DebitoAutomatico({ contribuyente }) {
  const qc = useQueryClient();
  const { data: cuentas } = useQuery({
    queryKey: ['wav-cuentas', contribuyente?.id],
    queryFn: () => wavAPI.cuentas.byContribuyente(contribuyente.id).then((r) => r.data),
    enabled: !!contribuyente,
  });
  const cuentaIds = (cuentas || []).map((c) => c.id);
  const [medio, setMedio] = useState('cbu');
  const [datos, setDatos] = useState('');
  const [titular, setTitular] = useState('');
  const [idCuenta, setIdCuenta] = useState('');

  const { data: adhesiones } = useQuery({
    queryKey: ['wav-adhesiones', cuentaIds.join(',')],
    queryFn: async () => {
      const all = await Promise.all(cuentaIds.map((id) => wavAPI.debito.byCuenta(id).then((r) => r.data)));
      return all.flat();
    },
    enabled: cuentaIds.length > 0,
  });

  const adherir = useMutation({
    mutationFn: () => wavAPI.debito.create({ id_cuenta: Number(idCuenta), medio, datos, titular }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['wav-adhesiones'] }); setDatos(''); setTitular(''); },
  });
  const bajar = useMutation({
    mutationFn: (id) => wavAPI.debito.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['wav-adhesiones'] }),
  });

  return (
    <div className="mt-5 pt-4 border-t border-gray-100">
      <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Débito automático</h4>
      <div className="space-y-1 mb-3">
        {adhesiones?.length ? adhesiones.map((a) => (
          <div key={a.id} className="flex items-center justify-between text-sm bg-emerald-50 rounded px-3 py-1.5">
            <span>Cuenta #{a.id_cuenta} · {a.medio.toUpperCase()} · {a.titular || a.datos || '—'}</span>
            <button className={btnSec} onClick={() => bajar.mutate(a.id)}>Dar de baja</button>
          </div>
        )) : <p className="text-sm text-gray-400">Sin adhesiones a débito automático.</p>}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-end">
        <div>
          <label className="text-xs text-gray-500">Cuenta</label>
          <select className={inputCls} value={idCuenta} onChange={(e) => setIdCuenta(e.target.value)}>
            <option value="">Elegir...</option>
            {(cuentas || []).map((c) => <option key={c.id} value={c.id}>{c.numero_cuenta}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-500">Medio</label>
          <select className={inputCls} value={medio} onChange={(e) => setMedio(e.target.value)}>
            <option value="cbu">CBU</option>
            <option value="tarjeta">Tarjeta</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-500">{medio === 'cbu' ? 'CBU' : 'Nro. tarjeta'}</label>
          <input className={inputCls} value={datos} onChange={(e) => setDatos(e.target.value)} placeholder={medio === 'cbu' ? '22 dígitos' : '****' } />
        </div>
        <button className={btn} disabled={adherir.isPending || !idCuenta || !datos} onClick={() => adherir.mutate()}>
          {adherir.isPending ? 'Adhiriendo...' : 'Adherir'}
        </button>
      </div>
      <input className={`${inputCls} mt-2`} value={titular} onChange={(e) => setTitular(e.target.value)} placeholder="Titular (opcional)" />
    </div>
  );
}

const ESTADO_DDJJ = {
  10: { t: 'Pendiente', c: 'bg-amber-100 text-amber-700' },
  20: { t: 'Parcial', c: 'bg-blue-100 text-blue-700' },
  30: { t: 'Pagada', c: 'bg-green-100 text-green-700' },
  40: { t: 'En plan', c: 'bg-purple-100 text-purple-700' },
};
const EstadoDDJJ = (id) => {
  const e = ESTADO_DDJJ[id] || { t: `#${id}`, c: 'bg-gray-100 text-gray-600' };
  return <span className={`px-2 py-0.5 rounded text-xs font-medium ${e.c}`}>{e.t}</span>;
};

function CuentaPanel({ cuenta }) {
  const qc = useQueryClient();
  const refetch = () => {
    qc.invalidateQueries({ queryKey: ['wav-ddjj', cuenta.id] });
    qc.invalidateQueries({ queryKey: ['wav-pagos', cuenta.id] });
  };
  const { data: ddjj } = useQuery({
    queryKey: ['wav-ddjj', cuenta.id],
    queryFn: () => wavAPI.declaraciones.byCuenta(cuenta.id).then((r) => r.data),
  });
  const { data: pagos } = useQuery({
    queryKey: ['wav-pagos', cuenta.id],
    queryFn: () => wavAPI.pagos.byCuenta(cuenta.id).then((r) => r.data),
  });

  // Presentar DDJJ
  const hoy = new Date();
  const [anio, setAnio] = useState(String(hoy.getFullYear()));
  const [mes, setMes] = useState(String(hoy.getMonth() + 1));
  const [items, setItems] = useState([{ descripcion: '', base_imponible: '', alicuota: '' }]);
  const totalDDJJ = items.reduce((s, it) => s + (Number(it.base_imponible || 0) * Number(it.alicuota || 0) / 100), 0);
  const setItem = (i, k, v) => setItems((prev) => prev.map((it, idx) => idx === i ? { ...it, [k]: v } : it));

  const crearDDJJ = useMutation({
    mutationFn: () => wavAPI.declaraciones.create({
      id_cuenta: cuenta.id, anio: Number(anio), mes: Number(mes),
      items: items.filter((it) => it.base_imponible || it.importe).map((it) => ({
        descripcion: it.descripcion, base_imponible: Number(it.base_imponible || 0), alicuota: Number(it.alicuota || 0),
      })),
    }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['wav-ddjj', cuenta.id] }); setItems([{ descripcion: '', base_imponible: '', alicuota: '' }]); },
  });

  const [accion, setAccion] = useState(null); // { modo: 'pago'|'plan', ddjj }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Presentar DDJJ */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Presentar declaración jurada — cuenta {cuenta.numero_cuenta}</h3>
        <div className="flex gap-2 mb-3">
          <div><label className="text-xs text-gray-500">Año</label><input className={inputCls} type="number" value={anio} onChange={(e) => setAnio(e.target.value)} /></div>
          <div><label className="text-xs text-gray-500">Mes</label><input className={inputCls} type="number" min="1" max="12" value={mes} onChange={(e) => setMes(e.target.value)} /></div>
        </div>
        <div className="space-y-2">
          {items.map((it, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 items-center">
              <input className={`${inputCls} col-span-5`} placeholder="Rubro / descripción" value={it.descripcion} onChange={(e) => setItem(i, 'descripcion', e.target.value)} />
              <input className={`${inputCls} col-span-3`} type="number" placeholder="Base imp." value={it.base_imponible} onChange={(e) => setItem(i, 'base_imponible', e.target.value)} />
              <input className={`${inputCls} col-span-2`} type="number" placeholder="Alíc.%" value={it.alicuota} onChange={(e) => setItem(i, 'alicuota', e.target.value)} />
              <div className="col-span-2 text-right text-xs text-gray-600">{fmtMoney(Number(it.base_imponible || 0) * Number(it.alicuota || 0) / 100)}</div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between mt-3">
          <button className={btnSec} onClick={() => setItems((p) => [...p, { descripcion: '', base_imponible: '', alicuota: '' }])}>+ Renglón</button>
          <span className="text-sm font-semibold">Total: {fmtMoney(totalDDJJ)}</span>
        </div>
        <button className={`${btn} w-full mt-3`} onClick={() => crearDDJJ.mutate()} disabled={crearDDJJ.isPending || totalDDJJ <= 0}>
          {crearDDJJ.isPending ? 'Presentando...' : 'Presentar DDJJ'}
        </button>
      </div>

      {/* DDJJ y su deuda */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Declaraciones y deuda</h3>
        <div className="space-y-1.5">
          {ddjj?.length ? ddjj.map((d) => (
            <div key={d.id} className="bg-gray-50 rounded-lg px-3 py-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="font-medium">{d.numero_declaracion || `DDJJ #${d.id}`} · {d.mes}/{d.anio}</span>
                {EstadoDDJJ(d.id_estado_declaracion)}
              </div>
              <div className="flex items-center justify-between mt-1 text-xs text-gray-600">
                <span>Total {fmtMoney(d.importe_total)} · Saldo <b className={Number(d.saldo) > 0 ? 'text-red-600' : 'text-green-600'}>{fmtMoney(d.saldo)}</b></span>
                {Number(d.saldo) > 0 && (
                  <span className="flex gap-2">
                    <button className={btnSec} onClick={() => setAccion({ modo: 'pago', ddjj: d })}>Pagar</button>
                    <button className={btnSec} onClick={() => setAccion({ modo: 'plan', ddjj: d })}>Plan</button>
                  </span>
                )}
              </div>
            </div>
          )) : <p className="text-sm text-gray-400">Sin declaraciones.</p>}
        </div>

        <h4 className="text-xs font-semibold text-gray-500 uppercase mt-5 mb-2">Pagos realizados</h4>
        <div className="space-y-1">
          {pagos?.pagos_contado?.length ? pagos.pagos_contado.map((p) => (
            <div key={p.id} className="flex items-center justify-between text-sm bg-gray-50 rounded px-3 py-1.5">
              <span>Pago #{p.id} · {p.fecha_pago ? new Date(p.fecha_pago).toLocaleDateString() : ''}</span>
              <span className="flex items-center gap-2">
                <span className="font-medium">{fmtMoney(p.importe)}</span>
                <button className={btnSec} onClick={() => descargarReciboPdf(p.id)}>Recibo PDF</button>
              </span>
            </div>
          )) : <p className="text-sm text-gray-400">Sin pagos.</p>}
          {pagos?.planes_pago?.map((pl) => (
            <div key={`pl${pl.id}`} className="flex items-center justify-between text-sm bg-purple-50 rounded px-3 py-1.5">
              <span>Plan #{pl.id} · {pl.cantidad_cuotas} cuotas de {fmtMoney(pl.importe_cuota)}</span>
              <span className="font-medium">{fmtMoney(pl.importe_total)}</span>
            </div>
          ))}
        </div>
      </div>

      {accion && (
        <AccionDeudaModal cuenta={cuenta} accion={accion} onClose={() => setAccion(null)} onDone={() => { setAccion(null); refetch(); }} />
      )}
    </div>
  );
}

function AccionDeudaModal({ cuenta, accion, onClose, onDone }) {
  const { modo, ddjj } = accion;
  const saldo = Number(ddjj.saldo || 0);
  const [importe, setImporte] = useState(String(saldo));
  const [cuotas, setCuotas] = useState('3');

  const pagar = useMutation({
    mutationFn: () => wavAPI.pagos.pagoContado({
      id_cuenta: cuenta.id, id_declaracion_jurada: ddjj.id, id_tipo_tributo: cuenta.id_tipo_tributo, importe: Number(importe),
    }),
    onSuccess: onDone,
  });
  const armarPlan = useMutation({
    mutationFn: () => wavAPI.pagos.planPago({
      id_cuenta: cuenta.id, id_declaracion_jurada: ddjj.id, cantidad_cuotas: Number(cuotas),
      importe_total: saldo, importe_cuota: Number((saldo / Math.max(Number(cuotas), 1)).toFixed(2)),
    }),
    onSuccess: onDone,
  });

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
        <div className="px-5 py-3 border-b flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">{modo === 'pago' ? 'Pagar' : 'Armar plan'} — {ddjj.numero_declaracion || `DDJJ #${ddjj.id}`}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
        </div>
        <div className="p-5 space-y-3">
          <p className="text-sm text-gray-500">Saldo de la declaración: <b>{fmtMoney(saldo)}</b></p>
          {modo === 'pago' ? (
            <>
              <label className="text-xs text-gray-500">Importe a pagar</label>
              <input className={inputCls} type="number" value={importe} onChange={(e) => setImporte(e.target.value)} />
              <p className="text-xs text-gray-400">Se registra como recaudación en Tesorería.</p>
              <button className={`${btn} w-full`} disabled={pagar.isPending || Number(importe) <= 0} onClick={() => pagar.mutate()}>
                {pagar.isPending ? 'Procesando...' : 'Confirmar pago'}
              </button>
            </>
          ) : (
            <>
              <label className="text-xs text-gray-500">Cantidad de cuotas</label>
              <input className={inputCls} type="number" min="1" value={cuotas} onChange={(e) => setCuotas(e.target.value)} />
              <p className="text-sm text-gray-600">{cuotas} cuotas de <b>{fmtMoney(saldo / Math.max(Number(cuotas), 1))}</b></p>
              <button className={`${btn} w-full`} disabled={armarPlan.isPending || Number(cuotas) < 1} onClick={() => armarPlan.mutate()}>
                {armarPlan.isPending ? 'Procesando...' : 'Confirmar plan'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════ Débito automático (gestión de lotes) ═══════════════

const ESTADO_LOTE = {
  generado: 'bg-amber-100 text-amber-700',
  enviado: 'bg-blue-100 text-blue-700',
  procesado: 'bg-green-100 text-green-700',
};
const ESTADO_ITEM = {
  pendiente: 'bg-gray-100 text-gray-600',
  debitado: 'bg-green-100 text-green-700',
  rechazado: 'bg-red-100 text-red-700',
};

// Descarga el archivo de texto de débito (formato CBU) autenticado y lo baja.
const descargarArchivoDebito = async (lote) => {
  try {
    const resp = await wavAPI.debito.lotes.archivo(lote.id);
    const url = URL.createObjectURL(new Blob([resp.data], { type: 'text/plain' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `debito_${lote.medio}_${lote.periodo}_${lote.id}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  } catch {
    alert('No se pudo generar el archivo de débito.');
  }
};

function DebitoAdmin() {
  const qc = useQueryClient();
  const hoy = new Date();
  const [periodo, setPeriodo] = useState(`${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}`);
  const [medio, setMedio] = useState('cbu');
  const [loteSel, setLoteSel] = useState(null);

  const { data: lotes, isLoading } = useQuery({
    queryKey: ['wav-lotes'],
    queryFn: () => wavAPI.debito.lotes.list().then((r) => r.data),
  });

  const generar = useMutation({
    mutationFn: () => wavAPI.debito.lotes.generar({ periodo, medio }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['wav-lotes'] }),
  });
  const enviar = useMutation({
    mutationFn: (id) => wavAPI.debito.lotes.enviar(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['wav-lotes'] }),
  });

  return (
    <div className="space-y-5">
      {/* Generar lote */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Generar lote de débito</h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-end">
          <div>
            <label className="text-xs text-gray-500">Período</label>
            <input className={inputCls} value={periodo} onChange={(e) => setPeriodo(e.target.value)} placeholder="AAAA-MM" />
          </div>
          <div>
            <label className="text-xs text-gray-500">Medio</label>
            <select className={inputCls} value={medio} onChange={(e) => setMedio(e.target.value)}>
              <option value="cbu">CBU</option>
              <option value="tarjeta">Tarjeta</option>
            </select>
          </div>
          <button className={btn} disabled={generar.isPending || !periodo} onClick={() => generar.mutate()}>
            {generar.isPending ? 'Generando...' : 'Generar lote'}
          </button>
          {generar.isSuccess && <p className="text-xs text-green-600 self-center">Lote #{generar.data?.data?.id} generado.</p>}
        </div>
        <p className="text-xs text-gray-400 mt-2">Toma las adhesiones activas del medio elegido y la deuda del período (consultada a emisiones).</p>
      </div>

      {/* Lotes */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Lotes generados</h3>
        {isLoading ? <LoadingSpinner /> : (lotes?.length ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-500 border-b">
                  <th className="py-2 pr-3">#</th>
                  <th className="py-2 pr-3">Período</th>
                  <th className="py-2 pr-3">Medio</th>
                  <th className="py-2 pr-3">Estado</th>
                  <th className="py-2 pr-3 text-right">Cant.</th>
                  <th className="py-2 pr-3 text-right">Total</th>
                  <th className="py-2 pr-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {lotes.map((l) => (
                  <tr key={l.id} className="border-b last:border-0">
                    <td className="py-2 pr-3 font-medium">{l.id}</td>
                    <td className="py-2 pr-3">{l.periodo}</td>
                    <td className="py-2 pr-3">{l.medio?.toUpperCase()}</td>
                    <td className="py-2 pr-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${ESTADO_LOTE[l.estado] || 'bg-gray-100 text-gray-600'}`}>{l.estado}</span>
                    </td>
                    <td className="py-2 pr-3 text-right">{l.cantidad}</td>
                    <td className="py-2 pr-3 text-right font-medium">{fmtMoney(l.total)}</td>
                    <td className="py-2 pr-3">
                      <div className="flex flex-wrap gap-1.5">
                        <button className={btnSec} onClick={() => setLoteSel(l)}>Detalle</button>
                        <button className={btnSec} onClick={() => descargarArchivoDebito(l)}>Archivo</button>
                        {l.estado === 'generado' && (
                          <button className={btnSec} onClick={() => enviar.mutate(l.id)} disabled={enviar.isPending}>Marcar enviado</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <p className="text-sm text-gray-400">Aún no hay lotes de débito. Generá uno arriba.</p>)}
      </div>

      {loteSel && (
        <LoteDetalleModal idLote={loteSel.id} onClose={() => setLoteSel(null)}
          onDone={() => qc.invalidateQueries({ queryKey: ['wav-lotes'] })} />
      )}
    </div>
  );
}

function LoteDetalleModal({ idLote, onClose, onDone }) {
  const qc = useQueryClient();
  const { data: lote, isLoading, refetch } = useQuery({
    queryKey: ['wav-lote', idLote],
    queryFn: () => wavAPI.debito.lotes.get(idLote).then((r) => r.data),
  });
  const [rechazos, setRechazos] = useState({}); // { [id_item]: motivo }

  const toggleRechazo = (id) => setRechazos((p) => {
    const n = { ...p };
    if (id in n) delete n[id]; else n[id] = '';
    return n;
  });

  const procesar = useMutation({
    mutationFn: () => wavAPI.debito.lotes.procesarRechazos(idLote, {
      rechazos: Object.entries(rechazos).map(([id_item, motivo]) => ({ id_item: Number(id_item), motivo })),
      marcar_resto_debitado: true,
    }),
    onSuccess: () => { refetch(); qc.invalidateQueries({ queryKey: ['wav-lotes'] }); onDone?.(); },
  });

  const procesado = lote?.estado === 'procesado';

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="px-5 py-3 border-b flex items-center justify-between sticky top-0 bg-white">
          <h3 className="font-semibold text-gray-800">
            Lote #{idLote}{lote ? ` · ${lote.periodo} · ${lote.medio?.toUpperCase()} · ${fmtMoney(lote.total)}` : ''}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
        </div>
        <div className="p-5 space-y-3">
          {isLoading ? <LoadingSpinner /> : (
            <>
              <p className="text-xs text-gray-500">
                Estado: <b>{lote?.estado}</b>. {procesado ? 'Lote ya procesado.' : 'Tildá los débitos rechazados y escribí el motivo; el resto se marcará como debitado.'}
              </p>
              <div className="space-y-1">
                {(lote?.items || []).map((it) => {
                  const marcado = it.id in rechazos;
                  return (
                    <div key={it.id} className={`rounded-lg px-3 py-2 text-sm ${marcado ? 'bg-red-50' : 'bg-gray-50'}`}>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Cuenta #{it.id_cuenta} · {it.titular || it.datos || '—'}</span>
                        <span className="flex items-center gap-2">
                          <span className="font-medium">{fmtMoney(it.importe)}</span>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${ESTADO_ITEM[it.estado] || 'bg-gray-100 text-gray-600'}`}>{it.estado}</span>
                        </span>
                      </div>
                      {!procesado && (
                        <div className="flex items-center gap-2 mt-1.5">
                          <label className="flex items-center gap-1 text-xs text-gray-600">
                            <input type="checkbox" checked={marcado} onChange={() => toggleRechazo(it.id)} /> Rechazado
                          </label>
                          {marcado && (
                            <input className="flex-1 border border-gray-300 rounded px-2 py-1 text-xs"
                              placeholder="Motivo del rechazo" value={rechazos[it.id]}
                              onChange={(e) => setRechazos((p) => ({ ...p, [it.id]: e.target.value }))} />
                          )}
                        </div>
                      )}
                      {procesado && it.motivo_rechazo && (
                        <p className="text-xs text-red-600 mt-1">Motivo: {it.motivo_rechazo}</p>
                      )}
                    </div>
                  );
                })}
                {!lote?.items?.length && <p className="text-sm text-gray-400">El lote no tiene renglones de débito.</p>}
              </div>
              {!procesado && (
                <button className={`${btn} w-full`} disabled={procesar.isPending} onClick={() => procesar.mutate()}>
                  {procesar.isPending ? 'Procesando...' : `Procesar rechazos (${Object.keys(rechazos).length}) y confirmar débitos`}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
