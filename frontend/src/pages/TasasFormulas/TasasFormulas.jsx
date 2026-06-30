import { useState } from 'react';
import { emisionesAPI } from '../../services/api';
import PageHeader from '../../components/common/PageHeader';
import { CrudTab, inputClass, btnPrimary, btnSecondary, Field, Modal } from '../../components/common/CrudComponents';

const fmtNum = (v) => Number(v).toLocaleString('es-AR', { minimumFractionDigits: 2 });

// ── Probador de una fórmula del catálogo (con sus acumuladores) ──────
function ProbarCatalogoModal({ formula, onClose }) {
  const [vars, setVars] = useState('{\n  "I_CUOTA_ANUAL": "N",\n  "I_ZONATARI": "2"\n}');
  const [valuacion, setValuacion] = useState('');
  const [superficie, setSuperficie] = useState('');
  const [res, setRes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [jsonError, setJsonError] = useState('');

  const probar = async () => {
    let variables;
    try {
      variables = vars.trim() ? JSON.parse(vars) : {};
    } catch {
      setJsonError('El JSON de variables no es válido');
      return;
    }
    setJsonError('');
    setLoading(true);
    try {
      const datos_calculo = {
        variables,
        valuaciones: valuacion ? [{ tval_Codigo: 1, valu_Valor: Number(valuacion) }] : [],
        superficies: superficie ? [{ tips_Codigo: 1, tips_Clase: 1, supe_Superficie: Number(superficie), supe_FechaVigencia: 20260101 }] : [],
      };
      const { data } = await emisionesAPI.formulas.probarCatalogo(formula.id, { periodo: 2026, mes: 12, datos_calculo });
      setRes(data);
    } catch (e) {
      setRes({ aplica: false, acumuladores: [], vencimientos: [], error: e?.response?.data?.detail || 'Error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title={`Probar fórmula — tasa ${formula.ttas_tasa}/${formula.ttas_subtasa} N°${formula.fort_numero}`} onClose={onClose} wide>
      <div className="space-y-4">
        <div className="text-xs text-gray-600 bg-gray-50 rounded-lg p-3 space-y-1">
          <p><b>{formula.fort_descripcion || 'Sin descripción'}</b></p>
          {formula.fort_condicion && <p className="font-mono">cond: {formula.fort_condicion}</p>}
          <p className="font-mono truncate">aCancelar1: {formula.fort_a_cancelar_1 || '—'}</p>
        </div>

        <Field label="Variables del padrón (JSON)">
          <textarea rows={5} value={vars} onChange={(e) => setVars(e.target.value)} className={`${inputClass} font-mono text-xs`} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Valuación (opcional)"><input type="number" value={valuacion} onChange={(e) => setValuacion(e.target.value)} className={inputClass} /></Field>
          <Field label="Superficie (opcional)"><input type="number" value={superficie} onChange={(e) => setSuperficie(e.target.value)} className={inputClass} /></Field>
        </div>
        {jsonError && <p className="text-red-600 text-sm">{jsonError}</p>}

        <div className="flex justify-end gap-2">
          <button className={btnSecondary} onClick={onClose}>Cerrar</button>
          <button className={btnPrimary} onClick={probar} disabled={loading}>{loading ? 'Calculando…' : 'Probar'}</button>
        </div>

        {res && (
          <div className="space-y-3 border-t border-gray-100 pt-3">
            {res.error ? (
              <div className="bg-red-50 text-red-700 text-sm rounded-lg px-4 py-3">
                ⚠ {res.error}
                {res.error.includes('variable') && <p className="text-xs mt-1">Agregá esa variable al JSON de arriba y volvé a probar.</p>}
              </div>
            ) : (
              <>
                <p className="text-sm font-semibold text-gray-700">{res.aplica ? '✓ La condición se cumple' : 'La condición no se cumple (no liquida)'}</p>
                {res.vencimientos?.length > 0 && (
                  <table className="w-full text-sm">
                    <thead><tr className="text-left text-gray-500 text-xs"><th className="py-1">Vto</th><th className="py-1 text-right">A cancelar</th><th className="py-1 text-right">A pagar</th></tr></thead>
                    <tbody>{res.vencimientos.map((v) => (
                      <tr key={v.vencimiento} className="border-t border-gray-50"><td className="py-1">{v.vencimiento}</td><td className="py-1 text-right font-medium">{fmtNum(v.a_cancelar)}</td><td className="py-1 text-right">{fmtNum(v.a_pagar)}</td></tr>
                    ))}</tbody>
                  </table>
                )}
                {res.acumuladores?.length > 0 && (
                  <details className="text-xs text-gray-500">
                    <summary className="cursor-pointer">Acumuladores calculados ({res.acumuladores.length})</summary>
                    <div className="mt-1 font-mono max-h-40 overflow-y-auto">
                      {res.acumuladores.map((a) => <div key={a.numero}>@K_ACUMULA{String(a.numero).padStart(2, '0')} ({a.descripcion}) = {fmtNum(a.valor)}</div>)}
                    </div>
                  </details>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}

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
  const [probando, setProbando] = useState(null);
  return (
    <>
    <CrudTab
      queryKey="emi-formulas"
      apiFns={emisionesAPI.formulas}
      entityName="Fórmula"
      wide
      columns={[
        { key: 'id', label: 'ID' },
        { key: 'ttas_tasa', label: 'Tasa' },
        { key: 'ttas_subtasa', label: 'Sub' },
        { key: 'fort_numero', label: 'N°' },
        { key: 'fort_descripcion', label: 'Descripción' },
        { key: 'fort_a_cancelar_1', label: 'A cancelar (1)', render: (v) => <span className="font-mono text-xs">{trunc(v)}</span> },
        { key: 'activo', label: 'Estado', render: (v) => (v ? 'Activa' : 'Inactiva') },
        { key: '_probar', label: '', render: (_, row) => (
          <button onClick={() => setProbando(row)} className="text-xs bg-primary-600 hover:bg-primary-700 text-white px-3 py-1 rounded-md font-medium">Probar</button>
        ) },
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
    {probando && <ProbarCatalogoModal formula={probando} onClose={() => setProbando(null)} />}
    </>
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
