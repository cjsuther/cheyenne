import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { rrhhAPI } from '../../services/api';
import { CrudTab } from '../../components/common/CrudComponents';

const fmt = (v) => `$${Number(v || 0).toLocaleString('es-AR', { minimumFractionDigits: 2 })}`;
const bool = (v) => (v ? 'Sí' : 'No');
const anioActual = new Date().getFullYear();

const CONCEPTO_LABEL = {
  minimo_no_imponible: 'Mínimo no imponible',
  deduccion_especial: 'Deducción especial',
  conyuge: 'Cónyuge / conviviente',
  hijo: 'Hijo/a',
  hijo_incapacitado: 'Hijo/a incapacitado',
};

// ═══ DEDUCCIONES PERSONALES ANUALES ═══════════════════════════════════
export function DeduccionesGananciasTab() {
  return (
    <CrudTab queryKey="rrhh-gcias-ded" apiFns={rrhhAPI.gananciasDeducciones} entityName="Deducción de Ganancias" wide
      columns={[
        { key: 'anio', label: 'Año' },
        { key: 'concepto', label: 'Concepto', render: (v) => CONCEPTO_LABEL[v] || v },
        { key: 'importe_anual', label: 'Importe anual', render: fmt },
        { key: 'activo', label: 'Activo', render: bool },
      ]}
      formFields={[
        { key: 'anio', label: 'Año fiscal', type: 'int', required: true, defaultValue: anioActual },
        { key: 'concepto', label: 'Concepto', type: 'select', required: true, options: Object.entries(CONCEPTO_LABEL).map(([value, label]) => ({ value, label })) },
        { key: 'importe_anual', label: 'Importe anual', type: 'decimal', defaultValue: 0 },
      ]}
    />
  );
}

// ═══ ESCALA PROGRESIVA (art. 94) ══════════════════════════════════════
export function EscalaGananciasTab() {
  return (
    <CrudTab queryKey="rrhh-gcias-esc" apiFns={rrhhAPI.gananciasEscala} entityName="Tramo de Escala" wide
      columns={[
        { key: 'anio', label: 'Año' }, { key: 'tramo', label: 'Tramo' },
        { key: 'desde', label: 'Desde', render: fmt },
        { key: 'hasta', label: 'Hasta', render: (v) => (v == null ? 'sin tope' : fmt(v)) },
        { key: 'fijo', label: 'Cuota fija', render: fmt },
        { key: 'porcentaje', label: '%', render: (v) => `${Number(v)}%` },
        { key: 'excedente_sobre', label: 'Sobre exced. de', render: fmt },
      ]}
      formFields={[
        { key: 'anio', label: 'Año fiscal', type: 'int', required: true, defaultValue: anioActual },
        { key: 'tramo', label: 'N° de tramo', type: 'int', defaultValue: 0 },
        { key: 'desde', label: 'Desde', type: 'decimal', defaultValue: 0 },
        { key: 'hasta', label: 'Hasta (vacío = sin tope)', type: 'decimal' },
        { key: 'fijo', label: 'Cuota fija', type: 'decimal', defaultValue: 0 },
        { key: 'porcentaje', label: 'Porcentaje (%)', type: 'decimal', defaultValue: 0 },
        { key: 'excedente_sobre', label: 'Sobre excedente de', type: 'decimal', defaultValue: 0 },
      ]}
    />
  );
}

// ═══ RESUMEN MENSUAL ACUMULADO POR LEGAJO ═════════════════════════════
export function GananciasResumenTab() {
  const [idLegajo, setIdLegajo] = useState('');
  const [anio, setAnio] = useState(anioActual);

  const { data: legajos } = useQuery({
    queryKey: ['rrhh-f4-legajos'],
    queryFn: () => rrhhAPI.legajos.list({ limit: 100 }).then((r) => r.data),
  });
  const { data, isFetching } = useQuery({
    queryKey: ['rrhh-gcias-legajo', idLegajo, anio],
    queryFn: () => rrhhAPI.legajos.ganancias(idLegajo, { anio }).then((r) => r.data),
    enabled: !!idLegajo,
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Legajo</label>
          <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm min-w-[280px]"
            value={idLegajo} onChange={(e) => setIdLegajo(e.target.value)}>
            <option value="">— Elegí un legajo —</option>
            {(legajos || []).map((l) => (
              <option key={l.id} value={l.id}>{l.apellido_nombre} ({l.numero_legajo})</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Año</label>
          <input type="number" className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-28"
            value={anio} onChange={(e) => setAnio(Number(e.target.value))} />
        </div>
      </div>

      {!idLegajo && <p className="text-sm text-gray-400">Elegí un legajo para ver el detalle de Impuesto a las Ganancias.</p>}
      {idLegajo && isFetching && <p className="text-sm text-gray-400">Cargando…</p>}
      {idLegajo && data && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-white border border-gray-100 rounded-lg p-3">
              <p className="text-xs text-gray-500">Impuesto determinado</p>
              <p className="text-lg font-semibold">{fmt(data.impuesto_determinado)}</p>
            </div>
            <div className="bg-white border border-gray-100 rounded-lg p-3">
              <p className="text-xs text-gray-500">Retenido en el año</p>
              <p className="text-lg font-semibold text-red-600">{fmt(data.total_retenido)}</p>
            </div>
          </div>
          <div className="border border-gray-100 rounded-lg overflow-x-auto">
            <table className="w-full text-xs whitespace-nowrap">
              <thead className="bg-gray-50 text-left text-gray-500">
                <tr>
                  <th className="px-3 py-2">Mes</th>
                  <th className="px-3 py-2 text-right">Rem. neta gravada</th>
                  <th className="px-3 py-2 text-right">Deducciones acum.</th>
                  <th className="px-3 py-2 text-right">Ganancia neta acum.</th>
                  <th className="px-3 py-2 text-right">Impuesto acum.</th>
                  <th className="px-3 py-2 text-right">Retención del mes</th>
                </tr>
              </thead>
              <tbody>
                {(data.meses || []).map((m, i) => (
                  <tr key={i} className="border-t border-gray-50">
                    <td className="px-3 py-1.5">{m.mes}{m.es_sac ? ' · SAC' : ''}</td>
                    <td className="px-3 py-1.5 text-right">{fmt(m.rem_neta_gravada)}</td>
                    <td className="px-3 py-1.5 text-right">{fmt(m.deducciones)}</td>
                    <td className="px-3 py-1.5 text-right">{fmt(m.ganancia_neta_acum)}</td>
                    <td className="px-3 py-1.5 text-right">{fmt(m.impuesto_acum)}</td>
                    <td className="px-3 py-1.5 text-right font-semibold text-red-600">{fmt(m.retencion_mes)}</td>
                  </tr>
                ))}
                {!data.meses?.length && (
                  <tr><td colSpan={6} className="px-3 py-3 text-gray-400">Sin liquidaciones para este año.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
