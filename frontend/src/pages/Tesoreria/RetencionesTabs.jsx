import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tesoreriaAPI } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { CrudTab, Modal, Field, inputClass, btnPrimary, btnSecondary } from '../../components/common/CrudComponents';

const fmt = (v) => new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(v || 0));

// ═══════════════════════════════════════════════════════════════════════
// RETENCIONES A DEPOSITAR
// ═══════════════════════════════════════════════════════════════════════
export function RetencionesTab() {
  const qc = useQueryClient();
  const [error, setError] = useState('');
  const { data, isLoading } = useQuery({
    queryKey: ['tes-ret-depositar'],
    queryFn: () => tesoreriaAPI.retenciones.aDepositar().then((r) => r.data),
  });
  const { data: pendientes } = useQuery({
    queryKey: ['tes-ret-list'],
    queryFn: () => tesoreriaAPI.retenciones.list({ depositada: false, limit: 200 }).then((r) => r.data),
  });
  const refetch = () => {
    qc.invalidateQueries({ queryKey: ['tes-ret-depositar'] });
    qc.invalidateQueries({ queryKey: ['tes-ret-list'] });
  };
  const depositar = (regimen) => {
    const comp = prompt(`Comprobante de depósito para el régimen ${regimen} (opcional):`) ?? undefined;
    tesoreriaAPI.retenciones.depositar({ regimen, comprobante_deposito: comp || null })
      .then(refetch).catch((e) => setError(e.response?.data?.detail || 'Error'));
  };

  return (
    <div>
      {error && <div className="mb-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2 flex justify-between"><span>⚠ {error}</span><button onClick={() => setError('')} className="text-red-500">✕</button></div>}
      <div className="mb-3 text-sm text-gray-600">Retenciones practicadas y aún no depositadas (pasivo a depositar).</div>
      {isLoading ? <LoadingSpinner /> : (
        <>
          <div className="mb-4">
            <div className="text-xs text-gray-500 mb-1">A depositar por régimen · total <b className="text-gray-800">{fmt(data?.total)}</b></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {data?.por_regimen?.length ? data.por_regimen.map((g) => (
                <div key={g.regimen} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{g.regimen}</p>
                    <p className="text-xs text-gray-500">{g.cantidad} retenc. · {fmt(g.importe)}</p>
                  </div>
                  <button className={btnPrimary.replace('px-4 py-2', 'px-3 py-1.5')} onClick={() => depositar(g.regimen)}>Depositar</button>
                </div>
              )) : <div className="bg-white rounded-xl border border-gray-200 p-6 text-center text-gray-500 col-span-full">Nada pendiente de depositar.</div>}
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
            <table className="min-w-full text-left text-xs">
              <thead><tr className="border-b border-gray-100 bg-gray-50/70 text-gray-500 uppercase tracking-wide">
                {['OP', 'Régimen', 'Base', 'Alícuota', 'Importe', 'Comprobante', 'Fecha'].map((h) => <th key={h} className="px-3 py-2.5 font-semibold whitespace-nowrap">{h}</th>)}
              </tr></thead>
              <tbody className="divide-y divide-gray-50">
                {pendientes?.length ? pendientes.map((r) => (
                  <tr key={r.id} className="hover:bg-primary-50/40">
                    <td className="px-3 py-2">#{r.id_orden_pago}</td>
                    <td className="px-3 py-2">{r.regimen}</td>
                    <td className="px-3 py-2 text-right">{fmt(r.base)}</td>
                    <td className="px-3 py-2 text-right">{fmt(r.alicuota)}%</td>
                    <td className="px-3 py-2 text-right font-medium">{fmt(r.importe)}</td>
                    <td className="px-3 py-2">{r.comprobante || '—'}</td>
                    <td className="px-3 py-2">{r.created_at ? new Date(r.created_at).toLocaleDateString() : ''}</td>
                  </tr>
                )) : <tr><td colSpan={7} className="px-3 py-8 text-center text-gray-400">Sin retenciones pendientes.</td></tr>}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// PROGRAMACIÓN DE CAJA (F47/F48)
// ═══════════════════════════════════════════════════════════════════════
const MESES = ['', 'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

export function ProgramacionCajaTab() {
  const qc = useQueryClient();
  const [anio, setAnio] = useState(new Date().getFullYear());
  const [modal, setModal] = useState(false);
  const [error, setError] = useState('');
  const { data: flujo, isLoading } = useQuery({
    queryKey: ['tes-prog-flujo', anio],
    queryFn: () => tesoreriaAPI.programacionCaja.flujo(anio).then((r) => r.data),
  });
  const { data: items } = useQuery({
    queryKey: ['tes-prog-list', anio],
    queryFn: () => tesoreriaAPI.programacionCaja.list({ anio, limit: 200 }).then((r) => r.data),
  });
  const refetch = () => {
    qc.invalidateQueries({ queryKey: ['tes-prog-flujo'] });
    qc.invalidateQueries({ queryKey: ['tes-prog-list'] });
  };

  return (
    <div>
      {error && <div className="mb-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2 flex justify-between"><span>⚠ {error}</span><button onClick={() => setError('')} className="text-red-500">✕</button></div>}
      <div className="mb-3 flex items-center gap-2 justify-between flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Año</span>
          <input type="number" className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm w-28" value={anio} onChange={(e) => setAnio(Number(e.target.value))} />
        </div>
        <button className={btnPrimary} onClick={() => setModal(true)}>Cargar concepto previsto</button>
      </div>
      {isLoading ? <LoadingSpinner /> : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto mb-4">
          <table className="min-w-full text-left text-xs">
            <thead><tr className="border-b border-gray-100 bg-gray-50/70 text-gray-500 uppercase tracking-wide">
              {['Mes', 'Ingr. previsto', 'Ingr. real', 'Egr. previsto', 'Egr. real', 'Flujo previsto', 'Flujo real', 'Desvío'].map((h) => <th key={h} className="px-3 py-2.5 font-semibold whitespace-nowrap">{h}</th>)}
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {flujo?.meses?.map((m) => (
                <tr key={m.periodo} className="hover:bg-primary-50/40">
                  <td className="px-3 py-2 font-medium">{MESES[m.periodo]}</td>
                  <td className="px-3 py-2 text-right">{fmt(m.ingreso_previsto)}</td>
                  <td className="px-3 py-2 text-right">{fmt(m.ingreso_real)}</td>
                  <td className="px-3 py-2 text-right">{fmt(m.egreso_previsto)}</td>
                  <td className="px-3 py-2 text-right">{fmt(m.egreso_real)}</td>
                  <td className="px-3 py-2 text-right">{fmt(m.flujo_previsto)}</td>
                  <td className="px-3 py-2 text-right font-medium">{fmt(m.flujo_real)}</td>
                  <td className={`px-3 py-2 text-right ${m.desvio < 0 ? 'text-red-600' : 'text-green-600'}`}>{fmt(m.desvio)}</td>
                </tr>
              ))}
              {flujo?.total && (
                <tr className="bg-gray-50 font-semibold">
                  <td className="px-3 py-2">Total</td>
                  <td className="px-3 py-2 text-right">{fmt(flujo.total.ingreso_previsto)}</td>
                  <td className="px-3 py-2 text-right">{fmt(flujo.total.ingreso_real)}</td>
                  <td className="px-3 py-2 text-right">{fmt(flujo.total.egreso_previsto)}</td>
                  <td className="px-3 py-2 text-right">{fmt(flujo.total.egreso_real)}</td>
                  <td className="px-3 py-2 text-right">{fmt(flujo.total.flujo_previsto)}</td>
                  <td className="px-3 py-2 text-right">{fmt(flujo.total.flujo_real)}</td>
                  <td className="px-3 py-2"></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      <div className="text-xs text-gray-500 mb-2">Conceptos previstos cargados ({items?.length || 0})</div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="min-w-full text-left text-xs">
          <thead><tr className="border-b border-gray-100 bg-gray-50/70 text-gray-500 uppercase tracking-wide">
            {['Mes', 'Tipo', 'Concepto', 'Importe', ''].map((h) => <th key={h} className="px-3 py-2.5 font-semibold whitespace-nowrap">{h}</th>)}
          </tr></thead>
          <tbody className="divide-y divide-gray-50">
            {items?.length ? items.map((p) => (
              <tr key={p.id} className="hover:bg-primary-50/40">
                <td className="px-3 py-2">{MESES[p.periodo]}</td>
                <td className="px-3 py-2">{p.tipo === 'ingreso_previsto' ? 'Ingreso' : 'Egreso'}</td>
                <td className="px-3 py-2">{p.concepto}</td>
                <td className="px-3 py-2 text-right font-medium">{fmt(p.importe)}</td>
                <td className="px-3 py-2 text-right"><button className="text-red-500 hover:underline" onClick={() => { if (confirm('¿Eliminar concepto?')) tesoreriaAPI.programacionCaja.delete(p.id).then(refetch).catch((e) => setError(e.response?.data?.detail)); }}>Eliminar</button></td>
              </tr>
            )) : <tr><td colSpan={5} className="px-3 py-8 text-center text-gray-400">Sin conceptos cargados.</td></tr>}
          </tbody>
        </table>
      </div>
      {modal && <ProgModal anio={anio} onClose={() => setModal(false)} onDone={() => { setModal(false); refetch(); }} onError={(m) => { setError(m); setModal(false); }} />}
    </div>
  );
}

function ProgModal({ anio, onClose, onDone, onError }) {
  const [f, setF] = useState({ anio, periodo: 1, tipo: 'ingreso_previsto', concepto: '', importe: '' });
  const m = useMutation({
    mutationFn: () => tesoreriaAPI.programacionCaja.create({
      anio: Number(f.anio), periodo: Number(f.periodo), tipo: f.tipo,
      concepto: f.concepto, importe: Number(f.importe),
    }),
    onSuccess: onDone, onError: (e) => onError(e.response?.data?.detail || 'Error'),
  });
  return (
    <Modal title="Concepto previsto de caja" onClose={onClose}>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Año"><input type="number" className={inputClass} value={f.anio} onChange={(e) => setF({ ...f, anio: e.target.value })} /></Field>
          <Field label="Mes">
            <select className={inputClass} value={f.periodo} onChange={(e) => setF({ ...f, periodo: e.target.value })}>
              {MESES.slice(1).map((mm, i) => <option key={i + 1} value={i + 1}>{mm}</option>)}
            </select>
          </Field>
        </div>
        <Field label="Tipo">
          <select className={inputClass} value={f.tipo} onChange={(e) => setF({ ...f, tipo: e.target.value })}>
            <option value="ingreso_previsto">Ingreso previsto</option>
            <option value="egreso_previsto">Egreso previsto</option>
          </select>
        </Field>
        <Field label="Concepto"><input className={inputClass} value={f.concepto} onChange={(e) => setF({ ...f, concepto: e.target.value })} /></Field>
        <Field label="Importe"><input type="number" className={inputClass} value={f.importe} onChange={(e) => setF({ ...f, importe: e.target.value })} /></Field>
        <button className={`${btnPrimary} w-full`} disabled={m.isPending || !f.concepto || !(Number(f.importe) > 0)} onClick={() => m.mutate()}>{m.isPending ? '...' : 'Cargar'}</button>
      </div>
    </Modal>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// EMBARGOS / PODERES
// ═══════════════════════════════════════════════════════════════════════
export function EmbargosPoderesTab() {
  const [sub, setSub] = useState('embargos');
  const { data: benef } = useQuery({ queryKey: ['tes-benef'], queryFn: () => tesoreriaAPI.beneficiarios.list({ limit: 200 }).then((r) => r.data) });
  const benefOpts = (benef || []).filter((b) => b.activo !== false).map((b) => ({ value: b.id, label: `${b.codigo} — ${b.nombre}` }));

  return (
    <div>
      <div className="mb-3 flex gap-2">
        <button className={sub === 'embargos' ? btnPrimary : btnSecondary} onClick={() => setSub('embargos')}>Embargos judiciales</button>
        <button className={sub === 'poderes' ? btnPrimary : btnSecondary} onClick={() => setSub('poderes')}>Poderes / apoderados</button>
      </div>
      {sub === 'embargos' ? (
        <CrudTab queryKey="tes-embargos" apiFns={tesoreriaAPI.embargos} entityName="Embargo" wide
          columns={[
            { key: 'beneficiario', label: 'Beneficiario' },
            { key: 'caratula', label: 'Carátula' },
            { key: 'juzgado', label: 'Juzgado' },
            { key: 'tipo', label: 'Tipo' },
            { key: 'importe_o_porcentaje', label: 'Importe / %', render: (v) => fmt(v) },
            { key: 'retenido_acumulado', label: 'Retenido acum.', render: (v) => fmt(v) },
            { key: 'activo', label: 'Estado', render: (v) => (v ? 'Vigente' : 'Levantado') },
          ]}
          formFields={[
            { key: 'id_beneficiario', label: 'Beneficiario', type: 'select', options: benefOpts, required: true },
            { key: 'caratula', label: 'Carátula', required: true },
            { key: 'juzgado', label: 'Juzgado' },
            { key: 'tipo', label: 'Tipo', type: 'select', options: [{ value: 'importe', label: 'Importe fijo' }, { value: 'porcentaje', label: 'Porcentaje' }], defaultValue: 'importe' },
            { key: 'importe_o_porcentaje', label: 'Importe o % a embargar', type: 'decimal', defaultValue: 0 },
            { key: 'activo', label: 'Vigente', type: 'boolean', defaultValue: true },
          ]} />
      ) : (
        <CrudTab queryKey="tes-poderes" apiFns={tesoreriaAPI.poderes} entityName="Poder" wide
          columns={[
            { key: 'beneficiario', label: 'Beneficiario' },
            { key: 'apoderado_nombre', label: 'Apoderado' },
            { key: 'apoderado_cuit', label: 'CUIT' },
            { key: 'vigencia_desde', label: 'Desde', render: (v) => (v ? new Date(v).toLocaleDateString() : '—') },
            { key: 'vigencia_hasta', label: 'Hasta', render: (v) => (v ? new Date(v).toLocaleDateString() : '—') },
            { key: 'activo', label: 'Estado', render: (v) => (v ? 'Vigente' : 'Revocado') },
          ]}
          formFields={[
            { key: 'id_beneficiario', label: 'Beneficiario', type: 'select', options: benefOpts, required: true },
            { key: 'apoderado_nombre', label: 'Nombre del apoderado', required: true },
            { key: 'apoderado_cuit', label: 'CUIT del apoderado' },
            { key: 'vigencia_desde', label: 'Vigencia desde', type: 'date' },
            { key: 'vigencia_hasta', label: 'Vigencia hasta', type: 'date' },
            { key: 'observaciones', label: 'Observaciones' },
            { key: 'activo', label: 'Vigente', type: 'boolean', defaultValue: true },
          ]} />
      )}
    </div>
  );
}
