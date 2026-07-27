import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ingresosPublicosAPI, wavAPI } from '../../services/api';
import PageHeader from '../../components/common/PageHeader';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const fmtMoney = (v) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(Number(v || 0));
const inputCls = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500';
const btn = 'bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50';
const btnSec = 'bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded text-xs font-medium';

export default function Wav() {
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
      <PageHeader title="WAV — Autogestión" subtitle="Portal ciudadano: cuentas, declaraciones juradas y pagos" />

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

          {cuentaSel && <CuentaPanel cuenta={cuentaSel} />}
        </div>
      )}
    </div>
  );
}

function CuentaPanel({ cuenta }) {
  const qc = useQueryClient();
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

  // Registrar pago contado (se integra a Tesorería)
  const [importe, setImporte] = useState('');
  const pagar = useMutation({
    mutationFn: () => wavAPI.pagos.pagoContado({ id_cuenta: cuenta.id, id_tipo_tributo: cuenta.id_tipo_tributo, importe: Number(importe) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['wav-pagos', cuenta.id] }); setImporte(''); },
  });

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

        <h4 className="text-xs font-semibold text-gray-500 uppercase mt-5 mb-2">Declaraciones presentadas</h4>
        <div className="space-y-1">
          {ddjj?.length ? ddjj.map((d) => (
            <div key={d.id} className="flex items-center justify-between text-sm bg-gray-50 rounded px-3 py-1.5">
              <span>{d.numero_declaracion || `DDJJ #${d.id}`} · {d.mes}/{d.anio}</span>
              <span className="font-medium">{fmtMoney(d.importe_total)}</span>
            </div>
          )) : <p className="text-sm text-gray-400">Sin declaraciones.</p>}
        </div>
      </div>

      {/* Pagos */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Registrar pago (al contado)</h3>
        <div className="flex gap-2">
          <input className={inputCls} type="number" placeholder="Importe" value={importe} onChange={(e) => setImporte(e.target.value)} />
          <button className={btn} onClick={() => pagar.mutate()} disabled={pagar.isPending || Number(importe) <= 0}>{pagar.isPending ? '...' : 'Pagar'}</button>
        </div>
        <p className="text-xs text-gray-400 mt-1">El pago se registra como recaudación en Tesorería.</p>

        <h4 className="text-xs font-semibold text-gray-500 uppercase mt-5 mb-2">Pagos realizados</h4>
        <div className="space-y-1">
          {pagos?.pagos_contado?.length ? pagos.pagos_contado.map((p) => (
            <div key={p.id} className="flex items-center justify-between text-sm bg-gray-50 rounded px-3 py-1.5">
              <span>Pago #{p.id} · {p.fecha_pago ? new Date(p.fecha_pago).toLocaleDateString() : ''}</span>
              <span className="font-medium">{fmtMoney(p.importe)}</span>
            </div>
          )) : <p className="text-sm text-gray-400">Sin pagos.</p>}
        </div>
        {pagos?.planes_pago?.length > 0 && (
          <>
            <h4 className="text-xs font-semibold text-gray-500 uppercase mt-4 mb-2">Planes de pago</h4>
            {pagos.planes_pago.map((pl) => (
              <div key={pl.id} className="flex items-center justify-between text-sm bg-gray-50 rounded px-3 py-1.5">
                <span>Plan #{pl.id} · {pl.cantidad_cuotas} cuotas</span>
                <span className="font-medium">{fmtMoney(pl.importe_total)}</span>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
