import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contabilidadAPI } from '../../services/api';
import { useTabParam } from '../../hooks/useTabParam';
import PageHeader from '../../components/common/PageHeader';
import GroupedTabBar from '../../components/common/GroupedTabBar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { CrudTab, Modal, Field, inputClass, btnPrimary, btnSecondary } from '../../components/common/CrudComponents';

const fmt = (v) => new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(v || 0));
const hoy = () => new Date().toISOString().slice(0, 10);
const anioActual = new Date().getFullYear();

const TABS = [
  { key: 'asientos', label: 'Asientos' },
  { key: 'diario', label: 'Libro Diario' },
  { key: 'mayor', label: 'Libro Mayor' },
  { key: 'balance', label: 'Balance' },
  { key: 'plan', label: 'Plan de Cuentas' },
  { key: 'ejercicios', label: 'Ejercicios' },
];
const GRUPOS = [
  { label: 'Registración', keys: ['asientos', 'diario', 'mayor', 'balance'] },
  { label: 'Configuración', keys: ['plan', 'ejercicios'] },
];

const TIPOS_CUENTA = ['activo', 'pasivo', 'patrimonio', 'recurso', 'gasto', 'orden'];

export default function Contabilidad() {
  const [tab, setTab] = useTabParam('asientos');
  return (
    <div>
      <PageHeader title="Contabilidad — Partida Doble" subtitle="Plan de cuentas, ejercicios, asientos y libros contables" />
      <GroupedTabBar grupos={GRUPOS} tabsMeta={TABS} tab={tab} setTab={setTab} />
      {tab === 'asientos' && <AsientosTab />}
      {tab === 'diario' && <LibroDiarioTab />}
      {tab === 'mayor' && <LibroMayorTab />}
      {tab === 'balance' && <BalanceTab />}
      {tab === 'ejercicios' && <EjerciciosTab />}
      {tab === 'plan' && (
        <CrudTab queryKey="cont-plan" apiFns={contabilidadAPI.cuentas} entityName="Cuenta"
          columns={[
            { key: 'codigo', label: 'Código' },
            { key: 'nombre', label: 'Nombre' },
            { key: 'tipo', label: 'Tipo' },
            { key: 'imputable', label: 'Imputable', render: (v) => (v ? 'Sí' : 'No') },
            { key: 'nivel', label: 'Nivel' },
            { key: 'activo', label: 'Estado', render: (v) => (v ? 'Activa' : 'Baja') },
          ]}
          formFields={[
            { key: 'codigo', label: 'Código', required: true },
            { key: 'nombre', label: 'Nombre', required: true },
            { key: 'tipo', label: 'Tipo', type: 'select', options: TIPOS_CUENTA.map((t) => ({ value: t, label: t })), required: true, defaultValue: 'activo' },
            { key: 'imputable', label: 'Imputable', type: 'boolean', defaultValue: true },
            { key: 'nivel', label: 'Nivel', type: 'number', defaultValue: 3 },
            { key: 'activo', label: 'Activa', type: 'boolean', defaultValue: true },
          ]} />
      )}
    </div>
  );
}

const ESTADO_AS = { borrador: 'bg-amber-100 text-amber-700', confirmado: 'bg-green-100 text-green-700', anulado: 'bg-gray-200 text-gray-500' };

// ═══ Asientos ════════════════════════════════════════════════════════
function AsientosTab() {
  const qc = useQueryClient();
  const [modal, setModal] = useState(null);
  const [error, setError] = useState('');
  const { data: asientos, isLoading } = useQuery({ queryKey: ['cont-asientos'], queryFn: () => contabilidadAPI.asientos.list({ limit: 100 }).then((r) => r.data) });
  const refetch = () => qc.invalidateQueries({ queryKey: ['cont-asientos'] });
  return (
    <div>
      {error && <div className="mb-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2 flex justify-between"><span>⚠ {error}</span><button onClick={() => setError('')} className="text-red-500">✕</button></div>}
      <div className="mb-3 flex justify-end"><button className={btnPrimary} onClick={() => setModal('nuevo')}>Nuevo asiento manual</button></div>
      {isLoading ? <LoadingSpinner /> : (
        <div className="space-y-2">
          {asientos?.length ? asientos.map((a) => (
            <div key={a.id} className="bg-white rounded-xl border border-gray-200 p-4 cursor-pointer hover:border-primary-200" onClick={() => setModal({ det: a.id })}>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div><p className="text-sm font-semibold text-gray-800">{a.asiento} — {a.concepto}</p><p className="text-xs text-gray-500">{a.fecha} · {a.tipo}{a.origen_modulo ? ` · ${a.origen_modulo}/${a.origen_ref}` : ''}</p></div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-800">{fmt(a.total_debe)}</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${ESTADO_AS[a.estado]}`}>{a.estado}</span>
                </div>
              </div>
            </div>
          )) : <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">Sin asientos.</div>}
        </div>
      )}
      {modal === 'nuevo' && <AsientoModal onClose={() => setModal(null)} onDone={() => { setModal(null); refetch(); }} onError={setError} />}
      {modal?.det && <AsientoDetalle id={modal.det} onClose={() => setModal(null)} onChange={refetch} onError={setError} />}
    </div>
  );
}

function AsientoModal({ onClose, onDone, onError }) {
  const { data: cuentas } = useQuery({ queryKey: ['cont-cuentas-imp'], queryFn: () => contabilidadAPI.cuentas.list({ limit: 200 }).then((r) => r.data) });
  const imputables = useMemo(() => (cuentas || []).filter((c) => c.imputable && c.activo), [cuentas]);
  const [f, setF] = useState({ fecha: hoy(), concepto: '' });
  const [lineas, setLineas] = useState([{ id_cuenta: '', debe: '', haber: '' }, { id_cuenta: '', debe: '', haber: '' }]);
  const [msg, setMsg] = useState('');
  const setLinea = (i, k, v) => setLineas((p) => p.map((l, x) => (x === i ? { ...l, [k]: v } : l)));
  const totDebe = lineas.reduce((s, l) => s + Number(l.debe || 0), 0);
  const totHaber = lineas.reduce((s, l) => s + Number(l.haber || 0), 0);
  const balanceado = totDebe > 0 && Math.abs(totDebe - totHaber) < 0.005;
  const validas = lineas.filter((l) => l.id_cuenta && (Number(l.debe) > 0 || Number(l.haber) > 0));
  const m = useMutation({
    mutationFn: () => contabilidadAPI.asientos.create({
      fecha: f.fecha, anio: Number(f.fecha.slice(0, 4)), concepto: f.concepto,
      lineas: validas.map((l) => ({ id_cuenta: Number(l.id_cuenta), debe: Number(l.debe || 0), haber: Number(l.haber || 0), detalle: l.detalle || null })),
    }),
    onSuccess: onDone, onError: (e) => setMsg(e.response?.data?.detail || 'Error'),
  });
  return (
    <Modal title="Nuevo asiento manual" onClose={onClose} wide>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <Field label="Fecha"><input type="date" className={inputClass} value={f.fecha} onChange={(e) => setF({ ...f, fecha: e.target.value })} /></Field>
        <Field label="Concepto"><input className={inputClass} value={f.concepto} onChange={(e) => setF({ ...f, concepto: e.target.value })} /></Field>
      </div>
      <div className="space-y-2">
        <div className="grid grid-cols-12 gap-2 text-xs text-gray-500 font-medium px-1"><span className="col-span-6">Cuenta</span><span className="col-span-2 text-right">Debe</span><span className="col-span-3 text-right">Haber</span><span className="col-span-1" /></div>
        {lineas.map((l, i) => (
          <div key={i} className="grid grid-cols-12 gap-2 items-center">
            <select className={`${inputClass} col-span-6`} value={l.id_cuenta} onChange={(e) => setLinea(i, 'id_cuenta', e.target.value)}>
              <option value="">Cuenta imputable...</option>
              {imputables.map((c) => <option key={c.id} value={c.id}>{c.codigo} — {c.nombre}</option>)}
            </select>
            <input type="number" className={`${inputClass} col-span-2 text-right`} placeholder="0" value={l.debe} onChange={(e) => setLinea(i, 'debe', e.target.value)} />
            <input type="number" className={`${inputClass} col-span-3 text-right`} placeholder="0" value={l.haber} onChange={(e) => setLinea(i, 'haber', e.target.value)} />
            <button className="col-span-1 text-red-500" onClick={() => setLineas((p) => p.filter((_, x) => x !== i))}>✕</button>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between mt-2">
        <button className={btnSecondary} onClick={() => setLineas((p) => [...p, { id_cuenta: '', debe: '', haber: '' }])}>+ Línea</button>
        <div className="text-sm">
          <span className="mr-4">Debe: <b>{fmt(totDebe)}</b></span>
          <span className="mr-4">Haber: <b>{fmt(totHaber)}</b></span>
          <span className={balanceado ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>{balanceado ? '✓ Balanceado' : `Diferencia: ${fmt(totDebe - totHaber)}`}</span>
        </div>
      </div>
      {msg && <p className="text-red-600 text-sm mt-2">⚠ {msg}</p>}
      <button className={`${btnPrimary} w-full mt-3`} disabled={m.isPending || !f.concepto.trim() || !balanceado || validas.length < 2} onClick={() => m.mutate()}>{m.isPending ? '...' : 'Crear asiento (borrador)'}</button>
    </Modal>
  );
}

function AsientoDetalle({ id, onClose, onChange, onError }) {
  const qc = useQueryClient();
  const { data: a, isLoading } = useQuery({ queryKey: ['cont-asiento', id], queryFn: () => contabilidadAPI.asientos.get(id).then((r) => r.data) });
  const refetch = () => { qc.invalidateQueries({ queryKey: ['cont-asiento', id] }); onChange(); };
  const confirmar = useMutation({ mutationFn: () => contabilidadAPI.asientos.confirmar(id), onSuccess: refetch, onError: (e) => onError(e.response?.data?.detail || 'Error') });
  const anular = useMutation({ mutationFn: () => contabilidadAPI.asientos.anular(id), onSuccess: () => { onChange(); onClose(); }, onError: (e) => { onError(e.response?.data?.detail || 'Error'); onClose(); } });
  if (isLoading || !a) return null;
  return (
    <Modal title={`${a.asiento} — ${a.concepto}`} onClose={onClose} wide>
      <div className="flex items-center gap-2 mb-3 text-sm">
        <span className={`px-2 py-0.5 rounded text-xs font-medium ${ESTADO_AS[a.estado]}`}>{a.estado}</span>
        <span className="text-gray-500">{a.fecha} · {a.tipo}</span>
        {a.origen_modulo && <span className="text-xs text-blue-600">{a.origen_modulo}/{a.origen_ref}</span>}
      </div>
      <table className="w-full text-xs mb-3">
        <thead><tr className="text-gray-500 border-b"><th className="text-left py-1">Cuenta</th><th className="text-left">Detalle</th><th className="text-right">Debe</th><th className="text-right">Haber</th></tr></thead>
        <tbody>
          {a.items?.map((it) => (
            <tr key={it.id} className="border-b border-gray-50">
              <td className="py-1">{it.cuenta?.codigo} {it.cuenta?.nombre}</td>
              <td className="text-gray-500">{it.detalle || ''}</td>
              <td className="text-right">{it.debe ? fmt(it.debe) : ''}</td>
              <td className="text-right">{it.haber ? fmt(it.haber) : ''}</td>
            </tr>
          ))}
          <tr className="font-bold"><td colSpan={2} className="py-1 text-right pr-2">Totales</td><td className="text-right">{fmt(a.total_debe)}</td><td className="text-right">{fmt(a.total_haber)}</td></tr>
        </tbody>
      </table>
      <div className="flex gap-2">
        {a.estado === 'borrador' && <button className={`${btnPrimary} flex-1`} disabled={confirmar.isPending} onClick={() => confirmar.mutate()}>Confirmar</button>}
        {a.estado !== 'anulado' && a.tipo !== 'cierre' && a.tipo !== 'apertura' && <button className={btnSecondary} onClick={() => { if (confirm('¿Anular el asiento?')) anular.mutate(); }}>Anular</button>}
      </div>
    </Modal>
  );
}

// ═══ Libro Diario ════════════════════════════════════════════════════
function LibroDiarioTab() {
  const [rango, setRango] = useState({ desde: `${anioActual}-01-01`, hasta: hoy() });
  const { data, isLoading } = useQuery({ queryKey: ['cont-diario', rango], queryFn: () => contabilidadAPI.libros.diario(rango).then((r) => r.data) });
  return (
    <div>
      <div className="mb-3 flex gap-3 items-end">
        <Field label="Desde"><input type="date" className={inputClass} value={rango.desde} onChange={(e) => setRango({ ...rango, desde: e.target.value })} /></Field>
        <Field label="Hasta"><input type="date" className={inputClass} value={rango.hasta} onChange={(e) => setRango({ ...rango, hasta: e.target.value })} /></Field>
      </div>
      {isLoading ? <LoadingSpinner /> : (
        <div className="space-y-3">
          {data?.length ? data.map((a) => (
            <div key={a.id} className="bg-white rounded-xl border border-gray-200 p-3">
              <div className="flex justify-between text-sm font-semibold mb-1"><span>{a.asiento} — {a.concepto}</span><span className="text-gray-500 font-normal">{a.fecha} · {a.tipo}</span></div>
              <table className="w-full text-xs">
                <tbody>
                  {a.items.map((it, i) => (
                    <tr key={i} className="border-b border-gray-50">
                      <td className="py-0.5 w-40">{it.cuenta_codigo}</td>
                      <td>{it.cuenta_nombre}</td>
                      <td className="text-right w-28">{it.debe ? fmt(it.debe) : ''}</td>
                      <td className="text-right w-28">{it.haber ? fmt(it.haber) : ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )) : <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">Sin asientos confirmados en el rango.</div>}
        </div>
      )}
    </div>
  );
}

// ═══ Libro Mayor ═════════════════════════════════════════════════════
function LibroMayorTab() {
  const { data: cuentas } = useQuery({ queryKey: ['cont-cuentas-imp'], queryFn: () => contabilidadAPI.cuentas.list({ limit: 200 }).then((r) => r.data) });
  const imputables = useMemo(() => (cuentas || []).filter((c) => c.imputable), [cuentas]);
  const [idCuenta, setIdCuenta] = useState('');
  const { data, isLoading } = useQuery({
    queryKey: ['cont-mayor', idCuenta], enabled: !!idCuenta,
    queryFn: () => contabilidadAPI.libros.mayor({ id_cuenta: idCuenta }).then((r) => r.data),
  });
  return (
    <div>
      <div className="mb-3">
        <Field label="Cuenta">
          <select className={inputClass} value={idCuenta} onChange={(e) => setIdCuenta(e.target.value)}>
            <option value="">Seleccioná una cuenta...</option>
            {imputables.map((c) => <option key={c.id} value={c.id}>{c.codigo} — {c.nombre}</option>)}
          </select>
        </Field>
      </div>
      {!idCuenta ? <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">Elegí una cuenta para ver su mayor.</div>
        : isLoading ? <LoadingSpinner /> : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
            <div className="px-4 py-2 border-b bg-gray-50/70 text-sm font-semibold">{data?.cuenta?.codigo} — {data?.cuenta?.nombre} · Saldo: {fmt(data?.saldo)}</div>
            <table className="min-w-full text-left text-xs">
              <thead><tr className="border-b border-gray-100 text-gray-500 uppercase tracking-wide">{['Fecha', 'Asiento', 'Concepto', 'Debe', 'Haber', 'Saldo'].map((h) => <th key={h} className="px-3 py-2 font-semibold">{h}</th>)}</tr></thead>
              <tbody className="divide-y divide-gray-50">
                {data?.movimientos?.length ? data.movimientos.map((m, i) => (
                  <tr key={i} className="hover:bg-primary-50/40">
                    <td className="px-3 py-1.5">{m.fecha}</td>
                    <td className="px-3 py-1.5">{m.asiento}</td>
                    <td className="px-3 py-1.5">{m.concepto}{m.detalle ? ` · ${m.detalle}` : ''}</td>
                    <td className="px-3 py-1.5 text-right">{m.debe ? fmt(m.debe) : ''}</td>
                    <td className="px-3 py-1.5 text-right">{m.haber ? fmt(m.haber) : ''}</td>
                    <td className="px-3 py-1.5 text-right font-medium">{fmt(m.saldo)}</td>
                  </tr>
                )) : <tr><td colSpan={6} className="px-3 py-8 text-center text-gray-400">Sin movimientos.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
    </div>
  );
}

// ═══ Balance ═════════════════════════════════════════════════════════
function BalanceTab() {
  const [anio, setAnio] = useState(anioActual);
  const { data, isLoading } = useQuery({ queryKey: ['cont-balance', anio], queryFn: () => contabilidadAPI.libros.balance({ anio }).then((r) => r.data) });
  return (
    <div>
      <div className="mb-3"><Field label="Ejercicio"><input type="number" className={`${inputClass} w-32`} value={anio} onChange={(e) => setAnio(Number(e.target.value))} /></Field></div>
      {isLoading ? <LoadingSpinner /> : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
          <table className="min-w-full text-left text-xs">
            <thead><tr className="border-b border-gray-100 bg-gray-50/70 text-gray-500 uppercase tracking-wide">{['Código', 'Cuenta', 'Tipo', 'Suma Debe', 'Suma Haber', 'Saldo Deudor', 'Saldo Acreedor'].map((h) => <th key={h} className="px-3 py-2 font-semibold">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-gray-50">
              {data?.cuentas?.length ? data.cuentas.map((c) => (
                <tr key={c.id_cuenta} className="hover:bg-primary-50/40">
                  <td className="px-3 py-1.5">{c.codigo}</td>
                  <td className="px-3 py-1.5">{c.nombre}</td>
                  <td className="px-3 py-1.5">{c.tipo}</td>
                  <td className="px-3 py-1.5 text-right">{fmt(c.suma_debe)}</td>
                  <td className="px-3 py-1.5 text-right">{fmt(c.suma_haber)}</td>
                  <td className="px-3 py-1.5 text-right">{c.saldo_deudor ? fmt(c.saldo_deudor) : ''}</td>
                  <td className="px-3 py-1.5 text-right">{c.saldo_acreedor ? fmt(c.saldo_acreedor) : ''}</td>
                </tr>
              )) : <tr><td colSpan={7} className="px-3 py-8 text-center text-gray-400">Sin movimientos confirmados en {anio}.</td></tr>}
            </tbody>
            {data?.totales && (
              <tfoot><tr className="font-bold border-t bg-gray-50/70">
                <td className="px-3 py-2" colSpan={3}>Totales</td>
                <td className="px-3 py-2 text-right">{fmt(data.totales.suma_debe)}</td>
                <td className="px-3 py-2 text-right">{fmt(data.totales.suma_haber)}</td>
                <td className="px-3 py-2 text-right">{fmt(data.totales.saldo_deudor)}</td>
                <td className="px-3 py-2 text-right">{fmt(data.totales.saldo_acreedor)}</td>
              </tr></tfoot>
            )}
          </table>
        </div>
      )}
    </div>
  );
}

// ═══ Ejercicios ══════════════════════════════════════════════════════
function EjerciciosTab() {
  const qc = useQueryClient();
  const [nuevo, setNuevo] = useState('');
  const [error, setError] = useState('');
  const { data: ejercicios, isLoading } = useQuery({ queryKey: ['cont-ejercicios'], queryFn: () => contabilidadAPI.ejercicios.list({ limit: 100 }).then((r) => r.data) });
  const refetch = () => qc.invalidateQueries({ queryKey: ['cont-ejercicios'] });
  const abrir = useMutation({ mutationFn: (anio) => contabilidadAPI.ejercicios.abrir(anio), onSuccess: () => { setNuevo(''); refetch(); }, onError: (e) => setError(e.response?.data?.detail || 'Error') });
  const cerrar = useMutation({ mutationFn: (anio) => contabilidadAPI.ejercicios.cerrar(anio), onSuccess: refetch, onError: (e) => setError(e.response?.data?.detail || 'Error') });
  return (
    <div>
      {error && <div className="mb-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2 flex justify-between"><span>⚠ {error}</span><button onClick={() => setError('')} className="text-red-500">✕</button></div>}
      <div className="mb-3 flex gap-2 items-end">
        <Field label="Abrir ejercicio (año)"><input type="number" className={`${inputClass} w-32`} placeholder={String(anioActual + 1)} value={nuevo} onChange={(e) => setNuevo(e.target.value)} /></Field>
        <button className={btnPrimary} disabled={!nuevo || abrir.isPending} onClick={() => abrir.mutate(Number(nuevo))}>Abrir</button>
      </div>
      {isLoading ? <LoadingSpinner /> : (
        <div className="space-y-2">
          {ejercicios?.length ? ejercicios.map((e) => (
            <div key={e.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between">
              <div><p className="text-sm font-semibold text-gray-800">Ejercicio {e.anio}</p><p className="text-xs text-gray-500">Apertura: {e.fecha_apertura || '—'}{e.fecha_cierre ? ` · Cierre: ${e.fecha_cierre}` : ''}</p></div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${e.estado === 'abierto' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>{e.estado}</span>
                {e.estado === 'abierto' && <button className={btnSecondary} disabled={cerrar.isPending} onClick={() => { if (confirm(`¿Cerrar el ejercicio ${e.anio}? Se generará el asiento de cierre.`)) cerrar.mutate(e.anio); }}>Cerrar</button>}
              </div>
            </div>
          )) : <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">Sin ejercicios.</div>}
        </div>
      )}
    </div>
  );
}
