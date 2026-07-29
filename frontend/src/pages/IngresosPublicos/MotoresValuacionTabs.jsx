import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ingresosPublicosAPI } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { inputClass, btnPrimary, btnSecondary } from '../../components/common/CrudComponents';

const fmt = (v) => new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(v || 0));

export function ValorTierraTab() {
  const qc = useQueryClient();
  const [f, setF] = useState({ ejercicio: new Date().getFullYear(), zona: 'general', valor_m2: '', coef_frente: '0' });
  const [masiva, setMasiva] = useState({ ejercicio: new Date().getFullYear(), zona: 'general' });
  const [error, setError] = useState('');
  const { data, isLoading } = useQuery({ queryKey: ['ip-valtierra'], queryFn: () => ingresosPublicosAPI.valorTierra.list().then((r) => r.data) });
  const refetch = () => qc.invalidateQueries({ queryKey: ['ip-valtierra'] });
  const crear = () => ingresosPublicosAPI.valorTierra.create({ ...f, ejercicio: Number(f.ejercicio), valor_m2: Number(f.valor_m2), coef_frente: Number(f.coef_frente || 0) }).then(() => { setF({ ...f, valor_m2: '' }); refetch(); }).catch((e) => setError(e.response?.data?.detail || 'Error'));
  const del = (id) => ingresosPublicosAPI.valorTierra.delete(id).then(refetch);
  const valuarMasiva = () => ingresosPublicosAPI.motorValuacion.valuarInmueblesMasiva(Number(masiva.ejercicio), masiva.zona).then((r) => { alert(`Valuados: ${r.data.valuados} · sin valuar: ${r.data.sin_valuar} · base total ${fmt(r.data.base_total)}`); }).catch((e) => setError(e.response?.data?.detail || 'Error'));
  return (
    <div>
      {error && <div className="mb-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2">⚠ {error}</div>}
      <p className="text-sm text-gray-500 mb-2">Motor de inmuebles: base imponible = valor_m² × superficie + valor_m² × coef_frente × frente.</p>
      <div className="bg-white rounded-xl border border-gray-200 p-3 mb-3 grid grid-cols-5 gap-2 items-end">
        <label className="text-xs text-gray-500">Ejercicio<input type="number" className={inputClass} value={f.ejercicio} onChange={(e) => setF({ ...f, ejercicio: e.target.value })} /></label>
        <label className="text-xs text-gray-500">Zona<input className={inputClass} value={f.zona} onChange={(e) => setF({ ...f, zona: e.target.value })} /></label>
        <label className="text-xs text-gray-500">Valor m²<input type="number" className={inputClass} value={f.valor_m2} onChange={(e) => setF({ ...f, valor_m2: e.target.value })} /></label>
        <label className="text-xs text-gray-500">Coef. frente<input type="number" className={inputClass} value={f.coef_frente} onChange={(e) => setF({ ...f, coef_frente: e.target.value })} /></label>
        <button className={btnPrimary} disabled={!(Number(f.valor_m2) > 0)} onClick={crear}>Guardar</button>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-3 mb-3 flex items-end gap-2">
        <span className="text-sm text-gray-600 mr-auto">Valuación masiva de inmuebles:</span>
        <label className="text-xs text-gray-500">Ejercicio<input type="number" className={inputClass} value={masiva.ejercicio} onChange={(e) => setMasiva({ ...masiva, ejercicio: e.target.value })} /></label>
        <label className="text-xs text-gray-500">Zona<input className={inputClass} value={masiva.zona} onChange={(e) => setMasiva({ ...masiva, zona: e.target.value })} /></label>
        <button className={btnSecondary} onClick={valuarMasiva}>⚙ Valuar padrón</button>
      </div>
      {isLoading ? <LoadingSpinner /> : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
          <table className="min-w-full text-left text-xs">
            <thead><tr className="border-b bg-gray-50/70 text-gray-500 uppercase"><th className="px-3 py-2">Ejercicio</th><th className="px-3 py-2">Zona</th><th className="px-3 py-2 text-right">Valor m²</th><th className="px-3 py-2 text-right">Coef. frente</th><th></th></tr></thead>
            <tbody className="divide-y divide-gray-50">
              {data?.length ? data.map((x) => (
                <tr key={x.id}><td className="px-3 py-2">{x.ejercicio}</td><td className="px-3 py-2">{x.zona}</td><td className="px-3 py-2 text-right">{fmt(x.valor_m2)}</td><td className="px-3 py-2 text-right">{x.coef_frente}</td><td className="px-3 py-2"><button className="text-red-500 hover:underline" onClick={() => del(x.id)}>eliminar</button></td></tr>
              )) : <tr><td colSpan={5} className="px-3 py-6 text-center text-gray-400">Sin valores de tierra cargados.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export function AlicuotaRubroTab() {
  const qc = useQueryClient();
  const [f, setF] = useState({ id_rubro: '', ejercicio: new Date().getFullYear(), alicuota: '', minimo: '0' });
  const [error, setError] = useState('');
  const { data, isLoading } = useQuery({ queryKey: ['ip-alicrubro'], queryFn: () => ingresosPublicosAPI.alicuotaRubro.list().then((r) => r.data) });
  const refetch = () => qc.invalidateQueries({ queryKey: ['ip-alicrubro'] });
  const crear = () => ingresosPublicosAPI.alicuotaRubro.create({ id_rubro: Number(f.id_rubro), ejercicio: Number(f.ejercicio), alicuota: Number(f.alicuota), minimo: Number(f.minimo || 0) }).then(() => { setF({ ...f, id_rubro: '', alicuota: '' }); refetch(); }).catch((e) => setError(e.response?.data?.detail || 'Error'));
  const del = (id) => ingresosPublicosAPI.alicuotaRubro.delete(id).then(refetch);
  return (
    <div>
      {error && <div className="mb-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2">⚠ {error}</div>}
      <p className="text-sm text-gray-500 mb-2">Motor de comercio: al liquidar una DD.JJ. → importe = máx(ingresos × alícuota, mínimo).</p>
      <div className="bg-white rounded-xl border border-gray-200 p-3 mb-3 grid grid-cols-5 gap-2 items-end">
        <label className="text-xs text-gray-500">ID Rubro<input type="number" className={inputClass} value={f.id_rubro} onChange={(e) => setF({ ...f, id_rubro: e.target.value })} /></label>
        <label className="text-xs text-gray-500">Ejercicio<input type="number" className={inputClass} value={f.ejercicio} onChange={(e) => setF({ ...f, ejercicio: e.target.value })} /></label>
        <label className="text-xs text-gray-500">Alícuota %<input type="number" className={inputClass} value={f.alicuota} onChange={(e) => setF({ ...f, alicuota: e.target.value })} /></label>
        <label className="text-xs text-gray-500">Mínimo<input type="number" className={inputClass} value={f.minimo} onChange={(e) => setF({ ...f, minimo: e.target.value })} /></label>
        <button className={btnPrimary} disabled={!f.id_rubro || !(Number(f.alicuota) >= 0)} onClick={crear}>Guardar</button>
      </div>
      {isLoading ? <LoadingSpinner /> : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
          <table className="min-w-full text-left text-xs">
            <thead><tr className="border-b bg-gray-50/70 text-gray-500 uppercase"><th className="px-3 py-2">Rubro</th><th className="px-3 py-2">Ejercicio</th><th className="px-3 py-2 text-right">Alícuota %</th><th className="px-3 py-2 text-right">Mínimo</th><th></th></tr></thead>
            <tbody className="divide-y divide-gray-50">
              {data?.length ? data.map((x) => (
                <tr key={x.id}><td className="px-3 py-2">#{x.id_rubro}</td><td className="px-3 py-2">{x.ejercicio}</td><td className="px-3 py-2 text-right">{x.alicuota}</td><td className="px-3 py-2 text-right">{fmt(x.minimo)}</td><td className="px-3 py-2"><button className="text-red-500 hover:underline" onClick={() => del(x.id)}>eliminar</button></td></tr>
              )) : <tr><td colSpan={5} className="px-3 py-6 text-center text-gray-400">Sin alícuotas cargadas.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
