import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { reportesAPI } from '../../services/api';
import { useTabParam } from '../../hooks/useTabParam';
import PageHeader from '../../components/common/PageHeader';
import GroupedTabBar from '../../components/common/GroupedTabBar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { inputClass, btnPrimary } from '../../components/common/CrudComponents';

const fmt = (v) => new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(v || 0));
const fmtPct = (v) => `${new Intl.NumberFormat('es-AR', { maximumFractionDigits: 2 }).format(Number(v || 0))}%`;
const hoy = () => new Date().toISOString().slice(0, 10);

const TABS = [
  { key: 'tablero', label: 'Tablero' },
  { key: 'recaudacion', label: 'Recaudación' },
  { key: 'cierre', label: 'Cierre de caja' },
  { key: 'ejecucion', label: 'Ejecución presupuestaria' },
  { key: 'ciclo', label: 'Ciclo del gasto' },
];
const GRUPOS = [
  { label: 'Consolidado', keys: ['tablero'] },
  { label: 'Tesorería', keys: ['recaudacion', 'cierre'] },
  { label: 'Presupuesto y gasto', keys: ['ejecucion', 'ciclo'] },
];

export default function Reportes() {
  const [tab, setTab] = useTabParam('tablero');
  return (
    <div>
      <PageHeader title="Reportes — Consolidados" subtitle="Consolida en tiempo real datos de tesorería, emisiones, presupuesto y contaduría" />
      <GroupedTabBar grupos={GRUPOS} tabsMeta={TABS} tab={tab} setTab={setTab} />
      {tab === 'tablero' && <TableroTab />}
      {tab === 'recaudacion' && <RecaudacionTab />}
      {tab === 'cierre' && <CierreCajaTab />}
      {tab === 'ejecucion' && <EjecucionTab />}
      {tab === 'ciclo' && <CicloGastoTab />}
    </div>
  );
}

function Kpi({ label, value, hint, accent = 'primary' }) {
  const colors = {
    primary: 'text-primary-700', green: 'text-green-700', red: 'text-red-600',
    amber: 'text-amber-600', gray: 'text-gray-700',
  };
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${colors[accent] || colors.primary}`}>{value}</p>
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

function Aviso({ modulos }) {
  if (!modulos?.length) return null;
  return (
    <div className="mb-3 bg-amber-50 border border-amber-200 text-amber-700 text-sm rounded-lg px-4 py-2">
      ⚠ No se pudo consultar: <b>{modulos.join(', ')}</b>. Los totales pueden estar incompletos.
    </div>
  );
}

// ─────────────────────────── Tablero ───────────────────────────
function TableroTab() {
  const [anio, setAnio] = useState(new Date().getFullYear());
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['rep-tablero', anio],
    queryFn: () => reportesAPI.tablero({ anio }).then((r) => r.data),
  });
  const k = data?.kpis || {};
  return (
    <div>
      <div className="mb-3 flex items-end gap-2">
        <div><label className="text-xs text-gray-500 block mb-1">Ejercicio</label><input type="number" className={`${inputClass} w-28`} value={anio} onChange={(e) => setAnio(Number(e.target.value))} /></div>
        <button className={btnPrimary} onClick={() => refetch()} disabled={isFetching}>{isFetching ? '...' : 'Actualizar'}</button>
      </div>
      {isLoading ? <LoadingSpinner /> : (
        <>
          <Aviso modulos={data?.modulos_no_disponibles} />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Kpi label="Recaudado" value={fmt(k.recaudado)} accent="green" />
            <Kpi label="Pagado" value={fmt(k.pagado)} accent="red" />
            <Kpi label="Saldo" value={fmt(k.saldo)} accent={Number(k.saldo) >= 0 ? 'green' : 'red'} />
            <Kpi label="Presupuestado" value={fmt(k.presupuestado)} accent="gray" />
            <Kpi label="Ejecutado" value={fmt(k.ejecutado)} accent="amber" />
            <Kpi label="Ejecución" value={fmtPct(k.porcentaje_ejecucion)} accent="primary" hint={`Ejercicio ${data?.anio}`} />
          </div>
        </>
      )}
    </div>
  );
}

// ─────────────────────────── Recaudación ───────────────────────────
function RecaudacionTab() {
  const [f, setF] = useState({ desde: '', hasta: '' });
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['rep-recaudacion', f.desde, f.hasta],
    queryFn: () => reportesAPI.recaudacion({ desde: f.desde || undefined, hasta: f.hasta || undefined }).then((r) => r.data),
  });
  const s = data?.secciones || {};
  return (
    <div>
      <div className="mb-3 flex flex-wrap items-end gap-2">
        <div><label className="text-xs text-gray-500 block mb-1">Desde</label><input type="date" className={inputClass} value={f.desde} onChange={(e) => setF({ ...f, desde: e.target.value })} /></div>
        <div><label className="text-xs text-gray-500 block mb-1">Hasta</label><input type="date" className={inputClass} value={f.hasta} onChange={(e) => setF({ ...f, hasta: e.target.value })} /></div>
        <button className={btnPrimary} onClick={() => refetch()} disabled={isFetching}>{isFetching ? '...' : 'Generar'}</button>
      </div>
      {isLoading ? <LoadingSpinner /> : (
        <>
          <Aviso modulos={data?.modulos_no_disponibles} />
          <div className="grid gap-3 sm:grid-cols-3 mb-3">
            <Kpi label="Total recaudado" value={fmt(data?.total_recaudado)} accent="green" />
            <Kpi label="Tesorería" value={fmt(s.tesoreria?.total)} accent={s.tesoreria?.disponible ? 'gray' : 'red'} hint={s.tesoreria?.disponible ? null : s.tesoreria?.aviso} />
            <Kpi label="Emisiones" value={fmt(s.emisiones?.total)} accent={s.emisiones?.disponible ? 'gray' : 'red'} hint={s.emisiones?.disponible ? null : s.emisiones?.aviso} />
          </div>
        </>
      )}
    </div>
  );
}

// ─────────────────────────── Cierre de caja ───────────────────────────
function CierreCajaTab() {
  const [fecha, setFecha] = useState(hoy());
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['rep-cierre', fecha],
    queryFn: () => reportesAPI.cierreCaja({ fecha }).then((r) => r.data),
  });
  return (
    <div>
      <div className="mb-3 flex items-end gap-2">
        <div><label className="text-xs text-gray-500 block mb-1">Fecha del parte</label><input type="date" className={inputClass} value={fecha} onChange={(e) => setFecha(e.target.value)} /></div>
        <button className={btnPrimary} onClick={() => refetch()} disabled={isFetching}>{isFetching ? '...' : 'Generar parte'}</button>
      </div>
      {isLoading ? <LoadingSpinner /> : (
        <>
          <Aviso modulos={data?.modulos_no_disponibles} />
          <div className="grid gap-3 sm:grid-cols-3">
            <Kpi label="Recaudado del día" value={fmt(data?.total_recaudado)} accent="green" />
            <Kpi label="Egresos del día" value={fmt(data?.total_egresos)} accent="red" />
            <Kpi label="Saldo del día" value={fmt(data?.saldo_dia)} accent={Number(data?.saldo_dia) >= 0 ? 'green' : 'red'} hint={`Parte del ${data?.fecha}`} />
          </div>
        </>
      )}
    </div>
  );
}

// ─────────────────────────── Ejecución presupuestaria ───────────────────────────
function EjecucionTab() {
  const [anio, setAnio] = useState(new Date().getFullYear());
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['rep-ejecucion', anio],
    queryFn: () => reportesAPI.ejecucionPresupuestaria({ anio }).then((r) => r.data),
  });
  return (
    <div>
      <div className="mb-3 flex items-end gap-2">
        <div><label className="text-xs text-gray-500 block mb-1">Ejercicio</label><input type="number" className={`${inputClass} w-28`} value={anio} onChange={(e) => setAnio(Number(e.target.value))} /></div>
        <button className={btnPrimary} onClick={() => refetch()} disabled={isFetching}>{isFetching ? '...' : 'Generar'}</button>
      </div>
      {isLoading ? <LoadingSpinner /> : (
        <>
          <Aviso modulos={data?.modulos_no_disponibles} />
          <div className="grid gap-3 sm:grid-cols-3">
            <Kpi label="Presupuestado" value={fmt(data?.presupuestado)} accent="gray" />
            <Kpi label="Ejecutado" value={fmt(data?.ejecutado)} accent="amber" />
            <Kpi label="% Ejecución" value={fmtPct(data?.porcentaje_ejecucion)} accent="primary" hint={`Ejercicio ${data?.anio}`} />
          </div>
        </>
      )}
    </div>
  );
}

// ─────────────────────────── Ciclo del gasto ───────────────────────────
function CicloGastoTab() {
  const [anio, setAnio] = useState(new Date().getFullYear());
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['rep-ciclo', anio],
    queryFn: () => reportesAPI.cicloGasto({ anio }).then((r) => r.data),
  });
  const r = data?.resumen || {};
  return (
    <div>
      <div className="mb-3 flex items-end gap-2">
        <div><label className="text-xs text-gray-500 block mb-1">Ejercicio</label><input type="number" className={`${inputClass} w-28`} value={anio} onChange={(e) => setAnio(Number(e.target.value))} /></div>
        <button className={btnPrimary} onClick={() => refetch()} disabled={isFetching}>{isFetching ? '...' : 'Generar'}</button>
      </div>
      {isLoading ? <LoadingSpinner /> : (
        <>
          <Aviso modulos={data?.modulos_no_disponibles} />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Kpi label="Comprometido" value={fmt(r.comprometido)} accent="amber" />
            <Kpi label="Devengado" value={fmt(r.devengado)} accent="primary" />
            <Kpi label="Pagado" value={fmt(r.pagado)} accent="green" />
            <Kpi label="Cant. de gastos" value={r.cantidad ?? 0} accent="gray" hint={`Ejercicio ${data?.anio}`} />
          </div>
        </>
      )}
    </div>
  );
}
