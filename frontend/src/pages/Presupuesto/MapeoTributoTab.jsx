import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { presupuestoAPI } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Modal, Field, inputClass, btnPrimary, btnSecondary, btnDanger } from '../../components/common/CrudComponents';

const dim = (d) => (d?.nombre ? `${d.nombre} (${d.codigo})` : d?.codigo || '—');
const recursoLabel = (r) => (r ? `${dim(r.rubro)} · ${dim(r.jurisdiccion)}` : '—');

export default function MapeoTributoTab() {
  const qc = useQueryClient();
  const [anio, setAnio] = useState(null);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ tributo: '', id_recurso: '' });
  const [error, setError] = useState('');

  const { data: ejercicios } = useQuery({
    queryKey: ['presu-ejercicios'],
    queryFn: () => presupuestoAPI.ejercicios.list({ limit: 50 }).then((r) => r.data),
  });
  const anioSel = anio ?? ejercicios?.find((e) => e.estado === 'vigente')?.anio ?? ejercicios?.[0]?.anio ?? null;

  const { data: mapeos, isLoading } = useQuery({
    queryKey: ['presu-mapeo-tributo', anioSel],
    queryFn: () => presupuestoAPI.mapeoTributoRecurso.list({ anio: anioSel, limit: 200 }).then((r) => r.data),
    enabled: !!anioSel,
  });

  const { data: recursos } = useQuery({
    queryKey: ['presu-recursos', anioSel],
    queryFn: () => presupuestoAPI.recursos.list({ anio: anioSel, limit: 200 }).then((r) => r.data),
    enabled: !!anioSel,
  });
  const recursoById = Object.fromEntries((recursos || []).map((r) => [r.id, r]));

  const refetch = () => qc.invalidateQueries({ queryKey: ['presu-mapeo-tributo', anioSel] });

  const crear = useMutation({
    mutationFn: () => presupuestoAPI.mapeoTributoRecurso.create({
      tributo: form.tributo.trim().toUpperCase(), anio: anioSel, id_recurso: Number(form.id_recurso),
    }),
    onSuccess: () => { setModal(false); setForm({ tributo: '', id_recurso: '' }); setError(''); refetch(); },
    onError: (e) => setError(e.response?.data?.detail || 'Error al guardar'),
  });

  const eliminar = useMutation({
    mutationFn: (id) => presupuestoAPI.mapeoTributoRecurso.delete(id),
    onSuccess: refetch,
  });

  if (!ejercicios) return <LoadingSpinner />;

  return (
    <div>
      {error && (
        <div className="mb-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2 flex items-center justify-between">
          <span>⚠ {error}</span><button onClick={() => setError('')} className="text-red-500">✕</button>
        </div>
      )}
      <div className="mb-3 flex items-center gap-2">
        <select className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm" value={anioSel || ''} onChange={(e) => setAnio(Number(e.target.value))}>
          {ejercicios.map((e) => <option key={e.anio} value={e.anio}>{e.anio} — {e.estado}</option>)}
        </select>
        <button className={`${btnPrimary} ml-auto`} onClick={() => { setError(''); setModal(true); }}>Nuevo mapeo</button>
      </div>
      <p className="text-xs text-gray-400 mb-2">Asocia un tributo (ej. TSG, TSH) a un recurso presupuestario. Al informarse lo percibido por tributo, el importe se imputa al recurso mapeado (circuito devengado↔percibido).</p>

      {isLoading ? <LoadingSpinner /> : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
          <table className="min-w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/70 text-gray-500 uppercase tracking-wide">
                {['Tributo', 'Año', 'Recurso', ''].map((h) => (
                  <th key={h} className="px-3 py-2.5 whitespace-nowrap font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {(mapeos || []).length ? mapeos.map((m) => (
                <tr key={m.id} className="hover:bg-primary-50/40">
                  <td className="px-3 py-2 whitespace-nowrap font-medium">{m.tributo}</td>
                  <td className="px-3 py-2">{m.anio}</td>
                  <td className="px-3 py-2">{recursoLabel(recursoById[m.id_recurso]) } <span className="text-gray-400">#{m.id_recurso}</span></td>
                  <td className="px-3 py-2 text-right">
                    <button className={btnDanger} onClick={() => { if (confirm(`Eliminar mapeo ${m.tributo}?`)) eliminar.mutate(m.id); }}>Eliminar</button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={4} className="px-3 py-8 text-center text-gray-400">Sin mapeos definidos para {anioSel}.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <Modal title="Nuevo mapeo tributo → recurso" onClose={() => setModal(false)}>
          <form onSubmit={(e) => { e.preventDefault(); crear.mutate(); }} className="space-y-3">
            <Field label="Tributo (código, ej. TSG)">
              <input className={inputClass} value={form.tributo} required maxLength={30}
                onChange={(e) => setForm((f) => ({ ...f, tributo: e.target.value }))} />
            </Field>
            <Field label="Recurso presupuestario">
              <select className={inputClass} value={form.id_recurso} required
                onChange={(e) => setForm((f) => ({ ...f, id_recurso: e.target.value }))}>
                <option value="">Seleccionar...</option>
                {(recursos || []).map((r) => (
                  <option key={r.id} value={r.id}>{recursoLabel(r)} (#{r.id})</option>
                ))}
              </select>
            </Field>
            <p className="text-xs text-gray-400">Año: {anioSel}</p>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" className={btnSecondary} onClick={() => setModal(false)}>Cancelar</button>
              <button type="submit" className={btnPrimary} disabled={crear.isPending}>{crear.isPending ? 'Guardando...' : 'Guardar'}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
