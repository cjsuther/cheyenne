import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { patrimonioAPI } from '../../services/api';
import { useTabParam } from '../../hooks/useTabParam';
import PageHeader from '../../components/common/PageHeader';
import GroupedTabBar from '../../components/common/GroupedTabBar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Modal, Field, inputClass, btnPrimary, btnSecondary } from '../../components/common/CrudComponents';

const fmt = (v) => new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(v || 0));
const TIPOS = ['mueble', 'inmueble', 'rodado', 'informatico', 'otro'];
const EST = { alta: 'bg-green-100 text-green-700', baja: 'bg-gray-200 text-gray-500', transferido: 'bg-blue-100 text-blue-700' };

const TABS = [
  { key: 'bienes', label: 'Bienes' },
  { key: 'inventario', label: 'Inventario' },
  { key: 'amortizacion', label: 'Amortización' },
];
const GRUPOS = [{ label: 'Patrimonio', keys: ['bienes', 'inventario', 'amortizacion'] }];

export default function Patrimonio() {
  const [tab, setTab] = useTabParam('bienes');
  return (
    <div>
      <PageHeader title="Patrimonio — Bienes de Uso" subtitle="Altas, amortización lineal, pases y bajas" />
      <GroupedTabBar grupos={GRUPOS} tabsMeta={TABS} tab={tab} setTab={setTab} />
      {tab === 'bienes' && <BienesTab />}
      {tab === 'inventario' && <InventarioTab />}
      {tab === 'amortizacion' && <AmortizacionTab />}
    </div>
  );
}

function BienesTab() {
  const qc = useQueryClient();
  const [modal, setModal] = useState(null);
  const [error, setError] = useState('');
  const { data: bienes, isLoading } = useQuery({ queryKey: ['patr-bienes'], queryFn: () => patrimonioAPI.bienes.list({ limit: 200 }).then((r) => r.data) });
  const refetch = () => qc.invalidateQueries({ queryKey: ['patr-bienes'] });
  const baja = (b) => { const motivo = prompt('Motivo de la baja:'); if (motivo === null) return; patrimonioAPI.bienes.baja(b.id, { motivo }).then(refetch).catch((e) => setError(e.response?.data?.detail || 'Error')); };
  return (
    <div>
      {error && <div className="mb-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2 flex justify-between"><span>⚠ {error}</span><button onClick={() => setError('')} className="text-red-500">✕</button></div>}
      <div className="mb-3 flex justify-end gap-2">
        <button className={btnSecondary} onClick={() => setModal('desde-oc')}>Alta desde OC</button>
        <button className={btnPrimary} onClick={() => setModal('nuevo')}>Nuevo bien</button>
      </div>
      {isLoading ? <LoadingSpinner /> : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
          <table className="min-w-full text-left text-xs">
            <thead><tr className="border-b border-gray-100 bg-gray-50/70 text-gray-500 uppercase tracking-wide">
              {['Código', 'Denominación', 'Tipo', 'Dependencia', 'V. origen', 'Amort. acum.', 'V. neto', 'Estado', ''].map((h) => <th key={h} className="px-3 py-2.5 font-semibold whitespace-nowrap">{h}</th>)}
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {bienes?.length ? bienes.map((b) => (
                <tr key={b.id} className="hover:bg-primary-50/40">
                  <td className="px-3 py-2 font-medium">{b.codigo}</td>
                  <td className="px-3 py-2">{b.denominacion}</td>
                  <td className="px-3 py-2 capitalize">{b.tipo}</td>
                  <td className="px-3 py-2">{b.dependencia || '—'}</td>
                  <td className="px-3 py-2 text-right">{fmt(b.valor_origen)}</td>
                  <td className="px-3 py-2 text-right text-gray-500">{fmt(b.amortizacion_acumulada)}</td>
                  <td className="px-3 py-2 text-right font-medium">{fmt(b.valor_neto)}</td>
                  <td className="px-3 py-2"><span className={`px-2 py-0.5 rounded text-xs font-medium ${EST[b.estado]}`}>{b.estado}</span></td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {b.estado === 'alta' && <>
                      <button className="text-blue-600 hover:underline mr-2" onClick={() => setModal({ pase: b })}>pase</button>
                      <button className="text-red-500 hover:underline" onClick={() => baja(b)}>baja</button>
                    </>}
                  </td>
                </tr>
              )) : <tr><td colSpan={9} className="px-3 py-8 text-center text-gray-400">Sin bienes registrados.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
      {modal === 'nuevo' && <NuevoBienModal onClose={() => setModal(null)} onDone={() => { setModal(null); refetch(); }} />}
      {modal === 'desde-oc' && <AltaDesdeOcModal onClose={() => setModal(null)} onDone={() => { setModal(null); refetch(); }} />}
      {modal?.pase && <PaseModal bien={modal.pase} onClose={() => setModal(null)} onDone={() => { setModal(null); refetch(); }} />}
    </div>
  );
}

function NuevoBienModal({ onClose, onDone }) {
  const [f, setF] = useState({ codigo: '', denominacion: '', tipo: 'mueble', dependencia: '', responsable: '', valor_origen: '', valor_residual: '0', vida_util_meses: '60' });
  const [msg, setMsg] = useState('');
  const m = useMutation({
    mutationFn: () => patrimonioAPI.bienes.create({ ...f, valor_origen: Number(f.valor_origen), valor_residual: Number(f.valor_residual || 0), vida_util_meses: Number(f.vida_util_meses || 0) }),
    onSuccess: onDone, onError: (e) => setMsg(e.response?.data?.detail || 'Error'),
  });
  return (
    <Modal title="Alta de bien de uso" onClose={onClose} wide>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Código"><input className={inputClass} value={f.codigo} onChange={(e) => setF({ ...f, codigo: e.target.value })} /></Field>
        <Field label="Denominación"><input className={inputClass} value={f.denominacion} onChange={(e) => setF({ ...f, denominacion: e.target.value })} /></Field>
        <Field label="Tipo"><select className={inputClass} value={f.tipo} onChange={(e) => setF({ ...f, tipo: e.target.value })}>{TIPOS.map((t) => <option key={t} value={t}>{t}</option>)}</select></Field>
        <Field label="Dependencia"><input className={inputClass} value={f.dependencia} onChange={(e) => setF({ ...f, dependencia: e.target.value })} /></Field>
        <Field label="Responsable"><input className={inputClass} value={f.responsable} onChange={(e) => setF({ ...f, responsable: e.target.value })} /></Field>
        <Field label="Valor de origen"><input type="number" className={inputClass} value={f.valor_origen} onChange={(e) => setF({ ...f, valor_origen: e.target.value })} /></Field>
        <Field label="Valor residual"><input type="number" className={inputClass} value={f.valor_residual} onChange={(e) => setF({ ...f, valor_residual: e.target.value })} /></Field>
        <Field label="Vida útil (meses, 0=no amortiza)"><input type="number" className={inputClass} value={f.vida_util_meses} onChange={(e) => setF({ ...f, vida_util_meses: e.target.value })} /></Field>
      </div>
      {msg && <p className="text-red-600 text-sm mt-2">⚠ {msg}</p>}
      <button className={`${btnPrimary} w-full mt-3`} disabled={m.isPending || !f.codigo.trim() || !f.denominacion.trim() || !(Number(f.valor_origen) > 0)} onClick={() => m.mutate()}>{m.isPending ? '...' : 'Dar de alta'}</button>
    </Modal>
  );
}

function AltaDesdeOcModal({ onClose, onDone }) {
  const [f, setF] = useState({ id_orden_compra: '', dependencia: '', vida_util_meses: '60' });
  const [msg, setMsg] = useState('');
  const m = useMutation({
    mutationFn: () => patrimonioAPI.bienes.altaDesdeOc({ id_orden_compra: Number(f.id_orden_compra), dependencia: f.dependencia || null, vida_util_meses: Number(f.vida_util_meses || 60) }),
    onSuccess: (r) => { alert(`Altas generadas: ${r.data.altas} · valor ${fmt(r.data.valor_total)}`); onDone(); },
    onError: (e) => setMsg(e.response?.data?.detail || 'Error'),
  });
  return (
    <Modal title="Alta patrimonial desde Orden de Compra" onClose={onClose}>
      <p className="text-sm text-gray-500 mb-2">Genera un bien por unidad recibida de cada artículo de la OC (consulta a Compras).</p>
      <Field label="ID de la Orden de Compra"><input type="number" className={inputClass} value={f.id_orden_compra} onChange={(e) => setF({ ...f, id_orden_compra: e.target.value })} /></Field>
      <Field label="Dependencia destino"><input className={inputClass} value={f.dependencia} onChange={(e) => setF({ ...f, dependencia: e.target.value })} /></Field>
      <Field label="Vida útil (meses)"><input type="number" className={inputClass} value={f.vida_util_meses} onChange={(e) => setF({ ...f, vida_util_meses: e.target.value })} /></Field>
      {msg && <p className="text-red-600 text-sm mt-2">⚠ {msg}</p>}
      <button className={`${btnPrimary} w-full mt-3`} disabled={m.isPending || !f.id_orden_compra} onClick={() => m.mutate()}>{m.isPending ? '...' : 'Generar altas'}</button>
    </Modal>
  );
}

function PaseModal({ bien, onClose, onDone }) {
  const [f, setF] = useState({ dependencia_destino: '', responsable: '', motivo: '' });
  const [msg, setMsg] = useState('');
  const m = useMutation({
    mutationFn: () => patrimonioAPI.bienes.pase(bien.id, f),
    onSuccess: onDone, onError: (e) => setMsg(e.response?.data?.detail || 'Error'),
  });
  return (
    <Modal title={`Pase de ${bien.codigo}`} onClose={onClose}>
      <p className="text-sm text-gray-500 mb-2">Actual: {bien.dependencia || 'sin asignar'}</p>
      <Field label="Dependencia destino"><input className={inputClass} value={f.dependencia_destino} onChange={(e) => setF({ ...f, dependencia_destino: e.target.value })} /></Field>
      <Field label="Nuevo responsable"><input className={inputClass} value={f.responsable} onChange={(e) => setF({ ...f, responsable: e.target.value })} /></Field>
      <Field label="Motivo"><input className={inputClass} value={f.motivo} onChange={(e) => setF({ ...f, motivo: e.target.value })} /></Field>
      {msg && <p className="text-red-600 text-sm mt-2">⚠ {msg}</p>}
      <button className={`${btnPrimary} w-full mt-3`} disabled={m.isPending || !f.dependencia_destino.trim()} onClick={() => m.mutate()}>{m.isPending ? '...' : 'Registrar pase'}</button>
    </Modal>
  );
}

function InventarioTab() {
  const { data, isLoading } = useQuery({ queryKey: ['patr-inv'], queryFn: () => patrimonioAPI.bienes.inventario().then((r) => r.data) });
  if (isLoading) return <LoadingSpinner />;
  if (!data) return null;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {[['Bienes activos', data.cantidad], ['Valor de origen', fmt(data.valor_origen)], ['Valor neto', fmt(data.valor_neto)]].map(([l, v]) => (
          <div key={l} className="bg-white rounded-xl border border-gray-200 p-3"><p className="text-xs text-gray-500">{l}</p><p className="text-lg font-bold text-gray-800">{v}</p></div>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3">
          <p className="text-sm font-semibold mb-2">Por tipo</p>
          <table className="w-full text-xs"><tbody>
            {data.por_tipo.map((t) => <tr key={t.tipo} className="border-b border-gray-50"><td className="py-1 capitalize">{t.tipo}</td><td className="text-right">{t.cantidad}</td><td className="text-right font-medium">{fmt(t.valor_neto)}</td></tr>)}
          </tbody></table>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3">
          <p className="text-sm font-semibold mb-2">Por dependencia</p>
          <table className="w-full text-xs"><tbody>
            {data.por_dependencia.map((d) => <tr key={d.dependencia} className="border-b border-gray-50"><td className="py-1">{d.dependencia}</td><td className="text-right">{d.cantidad}</td><td className="text-right font-medium">{fmt(d.valor_neto)}</td></tr>)}
          </tbody></table>
        </div>
      </div>
    </div>
  );
}

function AmortizacionTab() {
  const qc = useQueryClient();
  const [periodo, setPeriodo] = useState('');
  const [error, setError] = useState('');
  const { data: prev, isFetching } = useQuery({
    queryKey: ['patr-amort-prev', periodo], enabled: /^\d{4}-\d{2}$/.test(periodo),
    queryFn: () => patrimonioAPI.amortizacion.preview(periodo).then((r) => r.data),
  });
  const correr = () => patrimonioAPI.amortizacion.correr({ periodo }).then((r) => { alert(`Amortizados: ${r.data.bienes_amortizados} bienes · total ${fmt(r.data.total)}`); qc.invalidateQueries({ queryKey: ['patr-amort-prev'] }); qc.invalidateQueries({ queryKey: ['patr-bienes'] }); }).catch((e) => setError(e.response?.data?.detail || 'Error'));
  return (
    <div>
      {error && <div className="mb-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2">⚠ {error}</div>}
      <div className="mb-3 flex items-center gap-2">
        <input className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm" placeholder="Período YYYY-MM" value={periodo} onChange={(e) => setPeriodo(e.target.value)} />
        <button className={btnPrimary} disabled={!prev || !prev.cantidad} onClick={correr}>Correr amortización</button>
        {prev && <span className="text-sm text-gray-500 ml-2">{prev.cantidad} bienes · total <b className="text-gray-800">{fmt(prev.total)}</b></span>}
      </div>
      {isFetching ? <LoadingSpinner /> : prev && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
          <table className="min-w-full text-left text-xs">
            <thead><tr className="border-b border-gray-100 bg-gray-50/70 text-gray-500 uppercase"><th className="px-3 py-2">Código</th><th className="px-3 py-2">Bien</th><th className="px-3 py-2 text-right">Amort. acum.</th><th className="px-3 py-2 text-right">Cuota del período</th></tr></thead>
            <tbody className="divide-y divide-gray-50">
              {prev.bienes.length ? prev.bienes.map((b) => (
                <tr key={b.id_bien}><td className="px-3 py-2">{b.codigo}</td><td className="px-3 py-2">{b.denominacion}</td><td className="px-3 py-2 text-right text-gray-500">{fmt(b.amortizacion_acumulada)}</td><td className="px-3 py-2 text-right font-medium">{fmt(b.cuota)}</td></tr>
              )) : <tr><td colSpan={4} className="px-3 py-6 text-center text-gray-400">Nada por amortizar en ese período (o ya corrido).</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
