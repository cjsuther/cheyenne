import { useState } from 'react';
import { emisionesAPI } from '../../services/api';
import PageHeader from '../../components/common/PageHeader';
import { CrudTab, inputClass, btnPrimary, Field } from '../../components/common/CrudComponents';

const TIPO_OPTS = [
  { value: 'inmuebles', label: 'Inmuebles' },
  { value: 'comercios', label: 'Comercios' },
  { value: 'vehiculos', label: 'Vehículos' },
];

const trunc = (s, n = 48) => (s && s.length > n ? s.slice(0, n) + '…' : s || '—');

// ── Probador de fórmulas ────────────────────────────────────────────
function Probador() {
  const [formula, setFormula] = useState('#I_VALUACION(0) * 0.012 + #I_SUPERFICIE(1,1) * 15');
  const [condicion, setCondicion] = useState('#I_VALUACION(0) > 0');
  const [valuacion, setValuacion] = useState('350000');
  const [superficie, setSuperficie] = useState('80');
  const [res, setRes] = useState(null);
  const [loading, setLoading] = useState(false);

  const probar = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const datos_calculo = {
        variables: {},
        valuaciones: valuacion ? [{ tval_Codigo: 1, valu_Valor: Number(valuacion) }] : [],
        superficies: superficie
          ? [{ tips_Codigo: 1, tips_Clase: 1, supe_Superficie: Number(superficie), supe_FechaVigencia: 20260101 }]
          : [],
      };
      const { data } = await emisionesAPI.formulas.probar({
        formula, condicion, periodo: 2026, mes: 12, datos_calculo,
      });
      setRes(data);
    } catch (err) {
      setRes({ aplica: false, resultado: null, error: err?.response?.data?.detail || 'Error al probar' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={probar} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
      <h3 className="text-sm font-semibold text-gray-700">Probador de fórmulas</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Field label="Fórmula (a cancelar)">
          <textarea rows={2} value={formula} onChange={(e) => setFormula(e.target.value)} className={`${inputClass} font-mono text-xs`} />
        </Field>
        <Field label="Condición (opcional)">
          <textarea rows={2} value={condicion} onChange={(e) => setCondicion(e.target.value)} className={`${inputClass} font-mono text-xs`} />
        </Field>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 items-end">
        <Field label="Valuación de ejemplo"><input type="number" value={valuacion} onChange={(e) => setValuacion(e.target.value)} className={inputClass} /></Field>
        <Field label="Superficie de ejemplo"><input type="number" value={superficie} onChange={(e) => setSuperficie(e.target.value)} className={inputClass} /></Field>
        <button type="submit" className={btnPrimary} disabled={loading}>{loading ? 'Calculando…' : 'Probar'}</button>
      </div>

      {res && (
        res.error ? (
          <div className="bg-red-50 text-red-700 text-sm rounded-lg px-4 py-3 font-mono">⚠ {res.error}</div>
        ) : !res.aplica ? (
          <div className="bg-amber-50 text-amber-700 text-sm rounded-lg px-4 py-3">La condición no se cumple → no liquida.</div>
        ) : (
          <div className="bg-green-50 text-green-800 text-sm rounded-lg px-4 py-3">
            ✓ Resultado: <b className="text-lg">{Number(res.resultado).toLocaleString('es-AR', { minimumFractionDigits: 2 })}</b>
          </div>
        )
      )}

      <p className="text-xs text-gray-400">
        Funciones: <code>#I_VALUACION(cod)</code> · <code>#I_SUPERFICIE(tipo,clase)</code> · <code>#REDONDEO(valor, dec)</code>.
        Variables del padrón en mayúsculas (ej. <code>I_METROS_FRENTE</code>).
      </p>
    </form>
  );
}

// ── ABM de fórmulas ─────────────────────────────────────────────────
function FormulasTab() {
  return (
    <CrudTab
      queryKey="emi-formulas"
      apiFns={emisionesAPI.formulas}
      entityName="Fórmula"
      wide
      columns={[
        { key: 'id', label: 'ID' },
        { key: 'tipo_tributo', label: 'Tributo', render: (v) => <span className="capitalize">{v || '—'}</span> },
        { key: 'ttas_tasa', label: 'Tasa' },
        { key: 'ttas_subtasa', label: 'Sub' },
        { key: 'fort_numero', label: 'N°' },
        { key: 'fort_descripcion', label: 'Descripción' },
        { key: 'fort_a_cancelar_1', label: 'A cancelar (1)', render: (v) => <span className="font-mono text-xs">{trunc(v)}</span> },
        { key: 'activo', label: 'Estado', render: (v) => (v ? 'Activa' : 'Inactiva') },
      ]}
      formFields={[
        { key: 'tipo_tributo', label: 'Tipo de tributo', type: 'select', options: TIPO_OPTS, required: true },
        { key: 'ttas_tasa', label: 'Tasa', type: 'int', required: true },
        { key: 'ttas_subtasa', label: 'Sub-tasa', type: 'int', defaultValue: 0 },
        { key: 'fort_numero', label: 'Número de fórmula', type: 'int', defaultValue: 1 },
        { key: 'fort_orden', label: 'Orden', type: 'int', defaultValue: 0 },
        { key: 'fort_descripcion', label: 'Descripción' },
        { key: 'fort_condicion', label: 'Condición', type: 'textarea', placeholder: 'ej: #I_VALUACION(0) > 0' },
        { key: 'fort_a_cancelar_1', label: 'A cancelar — Vto 1', type: 'textarea', required: true },
        { key: 'fort_a_pagar_1', label: 'A pagar — Vto 1', type: 'textarea' },
        { key: 'fort_a_cancelar_2', label: 'A cancelar — Vto 2', type: 'textarea' },
        { key: 'fort_a_pagar_2', label: 'A pagar — Vto 2', type: 'textarea' },
        { key: 'activo', label: 'Activa', type: 'boolean', defaultValue: true },
      ]}
    />
  );
}

export default function TasasFormulas() {
  return (
    <div className="space-y-5">
      <PageHeader title="Tasas y Fórmulas" subtitle="Motor de cálculo: fórmulas de liquidación por tasa" />
      <Probador />
      <FormulasTab />
    </div>
  );
}
