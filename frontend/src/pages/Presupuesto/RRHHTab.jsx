import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { presupuestoAPI } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Modal, Field, inputClass, btnPrimary, btnSecondary, btnDanger } from '../../components/common/CrudComponents';

const fmt = (v) => new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(v || 0));
const dim = (d) => (d?.nombre ? `${d.nombre} (${d.codigo})` : d?.codigo || '—');

export default function RRHHTab() {
  const qc = useQueryClient();
  const [anio, setAnio] = useState(null);
  const [modal, setModal] = useState(null);
  const [error, setError] = useState('');

  const { data: ejercicios } = useQuery({
    queryKey: ['presu-ejercicios'],
    queryFn: () => presupuestoAPI.ejercicios.list({ limit: 50 }).then((r) => r.data),
  });
  const anioSel = anio ?? ejercicios?.[0]?.anio ?? null;
  const ejercicio = ejercicios?.find((e) => e.anio === anioSel);
  const enFormulacion = ejercicio?.estado === 'formulacion';

  const { data: planta, isLoading } = useQuery({
    queryKey: ['presu-rrhh', anioSel],
    queryFn: () => presupuestoAPI.rrhh.list({ anio: anioSel, limit: 200 }).then((r) => r.data),
    enabled: !!anioSel,
  });
  const { data: resumen } = useQuery({
    queryKey: ['presu-rrhh-resumen', anioSel],
    queryFn: () => presupuestoAPI.rrhh.resumen({ anio: anioSel }).then((r) => r.data),
    enabled: !!anioSel,
  });
  const refetch = () => {
    qc.invalidateQueries({ queryKey: ['presu-rrhh', anioSel] });
    qc.invalidateQueries({ queryKey: ['presu-rrhh-resumen', anioSel] });
  };

  const borrar = useMutation({
    mutationFn: (id) => presupuestoAPI.rrhh.delete(id),
    onSuccess: refetch,
    onError: (e) => setError(e.response?.data?.detail || 'Error'),
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
        {!enFormulacion && <span className="text-xs text-amber-600">La planta se edita en formulación</span>}
        {enFormulacion && <button className={`${btnPrimary} ml-auto`} onClick={() => setModal('nuevo')}>Agregar cargo a la planta</button>}
      </div>

      {resumen && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
          {[['Cargos presupuestados', resumen.total_cargos, ''],
            ['Costo anual planta', fmt(resumen.costo_anual_planta), ''],
            ['Crédito inciso 1 (vigente)', fmt(resumen.credito_vigente_inciso1), ''],
            ['Cobertura', fmt(resumen.cobertura), resumen.cobertura < 0 ? 'text-red-600' : 'text-green-700']].map(([l, v, c]) => (
            <div key={l} className="bg-white rounded-xl border border-gray-200 p-3 text-center">
              <p className="text-[10px] text-gray-500 uppercase">{l}</p>
              <p className={`text-sm font-bold ${c || 'text-gray-800'}`}>{v}</p>
            </div>
          ))}
        </div>
      )}

      {isLoading ? <LoadingSpinner /> : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
          <table className="min-w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/70 text-gray-500 uppercase tracking-wide">
                {['Jurisdicción', 'Estructura', 'Cargo', 'Cant.', 'Costo mensual', 'Meses', 'Costo anual', ''].map((h) => (
                  <th key={h} className="px-3 py-2.5 whitespace-nowrap font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {planta?.length ? planta.map((f) => (
                <tr key={f.id} className="hover:bg-primary-50/40">
                  <td className="px-3 py-2 whitespace-nowrap">{dim(f.jurisdiccion)}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{dim(f.estructura)}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{dim(f.cargo)}</td>
                  <td className="px-3 py-2 text-right">{f.cantidad}</td>
                  <td className="px-3 py-2 text-right">{fmt(f.costo_mensual)}</td>
                  <td className="px-3 py-2 text-right">{f.meses}</td>
                  <td className="px-3 py-2 text-right font-medium">{fmt(f.costo_anual)}</td>
                  <td className="px-3 py-2">
                    {enFormulacion && (
                      <span className="flex gap-1">
                        <button className={btnSecondary} onClick={() => setModal({ edit: f })}>Editar</button>
                        <button className={btnDanger} onClick={() => { if (confirm('¿Quitar de la planta?')) borrar.mutate(f.id); }}>Quitar</button>
                      </span>
                    )}
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={8} className="px-3 py-8 text-center text-gray-400">Sin planta en {anioSel}.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {(modal === 'nuevo' || modal?.edit) && (
        <PlantaModal anio={anioSel} fila={modal?.edit} onClose={() => setModal(null)} onDone={() => { setModal(null); refetch(); }} />
      )}
    </div>
  );
}

function PlantaModal({ anio, fila, onClose, onDone }) {
  const q = (key, fn) => useQuery({ queryKey: [key], queryFn: () => fn({ limit: 200 }).then((r) => r.data), staleTime: 60000 });
  const juris = q('sel-p-juri', presupuestoAPI.jurisdicciones.list).data || [];
  const esprs = q('sel-p-espr', presupuestoAPI.estructuras.list).data || [];
  const cargos = q('sel-p-cargo', presupuestoAPI.cargos.list).data || [];
  const [f, setF] = useState({
    id_jurisdiccion: fila?.jurisdiccion?.id || '', id_estructura: fila?.estructura?.id || '',
    id_cargo: fila?.cargo?.id || '', cantidad: fila?.cantidad ?? 1,
    costo_mensual: fila?.costo_mensual ?? '', meses: fila?.meses ?? 13,
  });
  const [msg, setMsg] = useState('');
  const m = useMutation({
    mutationFn: () => {
      const payload = { anio, id_jurisdiccion: Number(f.id_jurisdiccion), id_estructura: Number(f.id_estructura),
        id_cargo: Number(f.id_cargo), cantidad: Number(f.cantidad), costo_mensual: Number(f.costo_mensual || 0), meses: Number(f.meses) };
      return fila ? presupuestoAPI.rrhh.update(fila.id, payload) : presupuestoAPI.rrhh.create(payload);
    },
    onSuccess: onDone,
    onError: (e) => setMsg(e.response?.data?.detail || 'Error al guardar'),
  });
  const sel = (label, key, items) => (
    <Field label={label}>
      <select className={inputClass} value={f[key]} onChange={(e) => setF({ ...f, [key]: e.target.value })}>
        <option value="">Seleccionar...</option>
        {items.filter((i) => i.activo !== false).map((i) => <option key={i.id} value={i.id}>{i.codigo} — {i.nombre}</option>)}
      </select>
    </Field>
  );
  return (
    <Modal title={fila ? 'Editar planta' : `Agregar a la planta — ${anio}`} onClose={onClose} wide>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {sel('Jurisdicción', 'id_jurisdiccion', juris)}
        {sel('Estructura programática', 'id_estructura', esprs)}
        {sel('Cargo', 'id_cargo', cargos)}
        <Field label="Cantidad de cargos"><input type="number" min="1" className={inputClass} value={f.cantidad} onChange={(e) => setF({ ...f, cantidad: e.target.value })} /></Field>
        <Field label="Costo mensual unitario"><input type="number" className={inputClass} value={f.costo_mensual} onChange={(e) => setF({ ...f, costo_mensual: e.target.value })} /></Field>
        <Field label="Meses (12 + SAC = 13)"><input type="number" min="1" max="14" className={inputClass} value={f.meses} onChange={(e) => setF({ ...f, meses: e.target.value })} /></Field>
      </div>
      <p className="text-sm text-gray-600 mt-2">Costo anual: <b>{fmt(Number(f.cantidad || 0) * Number(f.costo_mensual || 0) * Number(f.meses || 0))}</b></p>
      {msg && <p className="text-red-600 text-sm mt-1">⚠ {msg}</p>}
      <button className={`${btnPrimary} w-full mt-3`} disabled={m.isPending || !f.id_jurisdiccion || !f.id_estructura || !f.id_cargo}
        onClick={() => m.mutate()}>{m.isPending ? 'Guardando...' : 'Guardar'}</button>
    </Modal>
  );
}
