import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rrhhAPI } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { CrudTab, Modal, inputClass, btnPrimary, btnSecondary, apiErrorMessage } from '../../components/common/CrudComponents';
import { EmbargoProgreso } from './RrhhFase3';

const fmt = (v) => `$${Number(v || 0).toLocaleString('es-AR', { minimumFractionDigits: 2 })}`;
const allQuery = (apiFns) => () => apiFns.list({ limit: 200 }).then((r) => r.data);
const TIPO_LABEL = { H: 'Haber', A: 'Asig. Familiar', E: 'Exento', D: 'Descuento', R: 'Retención/Aporte', P: 'Aporte Patronal' };
const TIPO_COLOR = { H: 'text-green-700', A: 'text-teal-700', E: 'text-sky-700', D: 'text-red-600', R: 'text-red-600', P: 'text-gray-400' };

// ── Recibo de un empleado (renglones + totales) ──
function ReciboModal({ idLegajo, anio, mes, tipoLiq = 'MEN', onClose }) {
  const { data, isLoading } = useQuery({
    queryKey: ['rrhh-recibo', idLegajo, anio, mes, tipoLiq],
    queryFn: () => rrhhAPI.legajos.recibo(idLegajo, { anio, mes, tipo_liq: tipoLiq }).then((r) => r.data),
  });
  return (
    <Modal title={`Recibo — ${mes}/${anio}`} onClose={onClose} wide>
      {isLoading || !data ? <LoadingSpinner /> : !data.renglones?.length ? (
        <p className="text-sm text-gray-500">Sin liquidación para este período.</p>
      ) : (
        <div className="space-y-3">
          <div className="bg-gray-50 rounded-lg p-3 text-sm">
            <p className="font-semibold">{data.legajo?.apellido_nombre}</p>
            <p className="text-xs text-gray-500">Legajo {data.legajo?.numero_legajo} · CUIL {data.legajo?.cuil}</p>
          </div>
          <div className="overflow-x-auto border border-gray-100 rounded-lg">
            <table className="w-full text-xs">
              <thead className="bg-gray-50"><tr className="text-left text-gray-500">
                <th className="px-3 py-2">Concepto</th><th className="px-3 py-2">Tipo</th>
                <th className="px-3 py-2 text-right">Cant.</th><th className="px-3 py-2 text-right">Base</th>
                <th className="px-3 py-2 text-right">Haber</th><th className="px-3 py-2 text-right">Descuento</th>
              </tr></thead>
              <tbody>{data.renglones.map((r, i) => {
                const esDesc = r.tipo_concepto === 'R' || r.tipo_concepto === 'D';
                const esPatr = r.tipo_concepto === 'P';
                return (
                  <tr key={i} className="border-t border-gray-50">
                    <td className="px-3 py-1.5">{r.concepto_descripcion}</td>
                    <td className={`px-3 py-1.5 ${TIPO_COLOR[r.tipo_concepto]}`}>{TIPO_LABEL[r.tipo_concepto] || r.tipo_concepto}</td>
                    <td className="px-3 py-1.5 text-right">{Number(r.cantidad || 0) || ''}</td>
                    <td className="px-3 py-1.5 text-right">{r.base ? fmt(r.base) : ''}</td>
                    <td className="px-3 py-1.5 text-right">{!esDesc && !esPatr ? fmt(r.importe) : ''}</td>
                    <td className="px-3 py-1.5 text-right text-red-600">{esDesc ? fmt(r.importe) : esPatr ? <span className="text-gray-300">({fmt(r.importe)})</span> : ''}</td>
                  </tr>
                );
              })}</tbody>
            </table>
          </div>
          {data.totales && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 rounded-lg p-3 text-sm">
              <div><p className="text-xs text-gray-500">Haberes</p><p className="font-bold">{fmt(data.totales.haberes)}</p></div>
              <div><p className="text-xs text-gray-500">Retenciones</p><p className="font-bold text-red-600">{fmt(Number(data.totales.retenciones) + Number(data.totales.descuentos || 0))}</p></div>
              <div><p className="text-xs text-gray-500">Aporte patronal</p><p className="font-medium text-gray-400">{fmt(data.totales.aportes_patronales)}</p></div>
              <div><p className="text-xs text-gray-500">NETO</p><p className="font-bold text-primary-700 text-lg">{fmt(data.totales.neto)}</p></div>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}

// ── VISIÓN 360 DEL EMPLEADO ──
export function Empleado360Tab() {
  const [id, setId] = useState('');
  const [recibo, setRecibo] = useState(null);
  const { data: legajos } = useQuery({ queryKey: ['rrhh-legajos-sel'], queryFn: allQuery(rrhhAPI.legajos) });
  const { data: f, isFetching } = useQuery({
    queryKey: ['rrhh-ficha', id], enabled: !!id,
    queryFn: () => rrhhAPI.legajos.ficha(id).then((r) => r.data),
  });
  const Sec = ({ t, children }) => (
    <div className="bg-white rounded-xl border border-gray-200 p-3">
      <p className="text-sm font-semibold text-gray-700 mb-2">{t}</p>{children}
    </div>
  );
  const Dato = ({ k, v }) => <div><p className="text-xs text-gray-500">{k}</p><p className="text-sm font-medium">{v ?? '—'}</p></div>;
  return (
    <div>
      <div className="mb-3 max-w-md">
        <label className="text-xs text-gray-500">Empleado
          <select className={inputClass} value={id} onChange={(e) => setId(e.target.value)}>
            <option value="">Seleccionar legajo…</option>
            {legajos?.map((l) => <option key={l.id} value={l.id}>{l.numero_legajo} · {l.apellido_nombre}</option>)}
          </select>
        </label>
      </div>
      {!id ? <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-400">Elegí un empleado para ver su ficha 360.</div>
        : isFetching || !f ? <LoadingSpinner /> : (
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-teal-50 to-white rounded-xl border border-teal-100 p-4 flex items-center justify-between flex-wrap gap-2">
              <div>
                <p className="text-lg font-bold text-gray-800">{f.apellido_nombre}</p>
                <p className="text-xs text-gray-500">Legajo {f.numero_legajo} · CUIL {f.cuil || '—'} · <span className="capitalize">{f.estado}</span></p>
              </div>
              {f.ultimo_recibo && (
                <button className={btnSecondary} onClick={() => setRecibo({ anio: f.ultimo_recibo.anio, mes: f.ultimo_recibo.mes })}>
                  Último recibo {f.ultimo_recibo.mes}/{f.ultimo_recibo.anio} · neto {fmt(f.ultimo_recibo.neto)}
                </button>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              <Sec t="Situación laboral">
                <div className="grid grid-cols-2 gap-2">
                  <Dato k="Situación de revista" v={f.tipo_relacion_descripcion} />
                  <Dato k="Fecha de ingreso" v={f.fecha_ingreso} />
                  <Dato k="Antigüedad total" v={f.antiguedad_total_anios != null ? `${Number(f.antiguedad_total_anios).toFixed(2)} años` : '—'} />
                  <Dato k="Familiares a cargo" v={f.cantidad_familiares_a_cargo} />
                  <Dato k="Obra social" v={f.obra_social_nombre} />
                  <Dato k="Sindicato" v={f.sindicato_nombre} />
                </div>
              </Sec>
              <Sec t="Datos bancarios">
                <div className="grid grid-cols-2 gap-2">
                  <Dato k="Banco" v={f.banco} />
                  <Dato k="CBU" v={f.cbu} />
                  <Dato k="Estado" v={f.estado} />
                  <Dato k="Fecha egreso" v={f.fecha_egreso} />
                </div>
              </Sec>
            </div>

            <Sec t={`Cargos (${f.cargos?.length || 0})`}>
              {f.cargos?.length ? (
                <table className="w-full text-xs"><thead><tr className="text-left text-gray-500 border-b"><th className="py-1">Categoría</th><th>Tipo</th><th>Función</th><th>Oficina</th><th>Partida</th><th>Desde</th></tr></thead>
                  <tbody>{f.cargos.map((c) => (
                    <tr key={c.id} className="border-b border-gray-50"><td className="py-1">{c.categoria_descripcion || '—'}</td><td>{c.tipo_cargo_descripcion || '—'}</td><td>{c.cargo_funcion_descripcion || '—'}</td><td>{c.oficina_descripcion || '—'}</td><td>{c.objeto_gasto || '—'}</td><td>{c.fecha_ingreso_cargo || '—'}</td></tr>
                  ))}</tbody></table>
              ) : <p className="text-xs text-gray-400">Sin cargos.</p>}
            </Sec>

            <div className="grid md:grid-cols-2 gap-3">
              <Sec t={`Antigüedad (${f.antiguedades?.length || 0})`}>
                {f.antiguedades?.length ? f.antiguedades.map((a) => (
                  <p key={a.id} className="text-xs text-gray-700">{a.fecha_desde} → {a.fecha_hasta || 'actual'} · {a.lugar || ''} <span className="text-gray-400">({a.tipo_antiguedad_descripcion || 's/tipo'})</span></p>
                )) : <p className="text-xs text-gray-400">Sin registros.</p>}
              </Sec>
              <Sec t={`Familiares (${f.familiares?.length || 0})`}>
                {f.familiares?.length ? f.familiares.map((fa) => (
                  <p key={fa.id} className="text-xs text-gray-700">{fa.apellido_nombre} · {fa.parentesco_descripcion || 's/parentesco'} {fa.a_cargo ? '· a cargo' : ''} {fa.deduce_ganancias ? '· deduce Gcias.' : ''}</p>
                )) : <p className="text-xs text-gray-400">Sin registros.</p>}
              </Sec>
            </div>

            <div className="grid md:grid-cols-3 gap-3">
              <Sec t={`Licencias anuales (${f.licencias_anuales?.length || 0})`}>
                {f.licencias_anuales?.length ? f.licencias_anuales.map((l) => (
                  <p key={l.id} className="text-xs text-gray-700">{l.anio}: {l.cant_dias} días · saldo <b className={Number(l.saldo) <= 0 ? 'text-red-600' : 'text-green-700'}>{l.saldo}</b></p>
                )) : <p className="text-xs text-gray-400">Sin registros.</p>}
              </Sec>
              <Sec t={`Ausencias (${f.ausencias?.length || 0})`}>
                {f.ausencias?.length ? f.ausencias.slice(0, 6).map((a) => (
                  <p key={a.id} className="text-xs text-gray-700">{a.fecha_inicio} → {a.fecha_fin} · {a.motivo_descripcion || 's/motivo'} <span className="text-gray-400">({a.dias_habiles}d)</span></p>
                )) : <p className="text-xs text-gray-400">Sin registros.</p>}
              </Sec>
              <Sec t={`Embargos activos (${f.embargos_activos?.length || 0})`}>
                {f.embargos_activos?.length ? f.embargos_activos.map((e) => (
                  <div key={e.id} className="mb-2">
                    <p className="text-xs text-gray-700">#{e.numero} · {e.tipo}</p>
                    <EmbargoProgreso retenido={e.total_retenido} tope={e.monto_total} />
                  </div>
                )) : <p className="text-xs text-gray-400">Sin embargos.</p>}
              </Sec>
            </div>
          </div>
        )}
      {recibo && <ReciboModal idLegajo={id} anio={recibo.anio} mes={recibo.mes} onClose={() => setRecibo(null)} />}
    </div>
  );
}

// ── Conceptos (catálogo con fórmulas) ──
export function ConceptosTab() {
  return (
    <CrudTab queryKey="rrhh-conceptos" apiFns={rrhhAPI.conceptos} entityName="Concepto" wide
      columns={[
        { key: 'orden', label: 'Orden' }, { key: 'codigo', label: 'Código' }, { key: 'descripcion', label: 'Descripción' },
        { key: 'tipo', label: 'Tipo', render: (v) => TIPO_LABEL[v] || v },
        { key: 'formula', label: 'Fórmula', render: (v) => <span className="font-mono text-[11px]">{v}</span> },
        { key: 'activo', label: 'Activo', render: (v) => (v ? 'Sí' : 'No') },
      ]}
      formFields={[
        { key: 'codigo', label: 'Código', required: true }, { key: 'descripcion', label: 'Descripción', required: true },
        { key: 'tipo', label: 'Tipo', type: 'select', required: true, defaultValue: 'H', options: Object.entries(TIPO_LABEL).map(([v, l]) => ({ value: v, label: `${v} · ${l}` })) },
        { key: 'orden', label: 'Orden de cálculo', type: 'decimal', defaultValue: 0 },
        { key: 'condicion', label: 'Condición (fórmula lógica, opcional)', type: 'textarea', placeholder: '@ANIOS_ANTIG > 0' },
        { key: 'cantidad', label: 'Cantidad (fórmula, opcional)', type: 'textarea' },
        { key: 'base', label: 'Base (fórmula, opcional)', type: 'textarea' },
        { key: 'porcentaje', label: 'Porcentaje (fórmula, opcional)', type: 'textarea' },
        { key: 'formula', label: 'Fórmula del importe', type: 'textarea', placeholder: '#REDONDEO(@TN_HABER * 0.11, 2)' },
        { key: 'aguinaldo', label: 'Entra en SAC/aguinaldo', type: 'boolean' },
      ]}
    />
  );
}

// ── Novedades ──
export function NovedadesTab() {
  return (
    <CrudTab queryKey="rrhh-novedades" apiFns={rrhhAPI.novedades} entityName="Novedad" wide
      columns={[
        { key: 'id_legajo', label: 'Legajo', render: (v) => v || 'Todos' }, { key: 'variable', label: 'Variable' },
        { key: 'valor', label: 'Valor' }, { key: 'anio', label: 'Año' }, { key: 'mes', label: 'Mes' }, { key: 'descripcion', label: 'Descripción' },
      ]}
      formFields={[
        { key: 'id_legajo', label: 'Legajo (vacío = todos)', type: 'remote_select', queryKey: 'sel-rrhh-nov-leg', queryFn: allQuery(rrhhAPI.legajos), optionValue: 'id', optionLabel: 'apellido_nombre' },
        { key: 'variable', label: 'Variable (@NOMBRE)', required: true, placeholder: '@TIENE_TITULO' },
        { key: 'valor', label: 'Valor', type: 'decimal', defaultValue: 0 },
        { key: 'anio', label: 'Año (vacío = cualquiera)', type: 'int' },
        { key: 'mes', label: 'Mes (vacío = cualquiera)', type: 'int' },
        { key: 'descripcion', label: 'Descripción' },
      ]}
    />
  );
}

export function TiposLiqTab() {
  return (
    <CrudTab queryKey="rrhh-tiposliq" apiFns={rrhhAPI.tiposLiquidacion} entityName="Tipo de liquidación"
      columns={[{ key: 'codigo', label: 'Código' }, { key: 'descripcion', label: 'Descripción' }, { key: 'activo', label: 'Activo', render: (v) => (v ? 'Sí' : 'No') }]}
      formFields={[{ key: 'codigo', label: 'Código', required: true }, { key: 'descripcion', label: 'Descripción', required: true }]}
    />
  );
}

// ── Liquidación (correr período + ver procesos/recibos) ──
export function LiquidacionTab() {
  const qc = useQueryClient();
  const now = new Date();
  const [form, setForm] = useState({ anio: now.getFullYear(), mes: now.getMonth() + 1, tipo_liq: 'MEN', valor_modulo: 850.5 });
  const [msg, setMsg] = useState(''); const [error, setError] = useState('');
  const [proc, setProc] = useState(null);
  const [recibo, setRecibo] = useState(null);
  const { data: tipos } = useQuery({ queryKey: ['rrhh-tiposliq'], queryFn: allQuery(rrhhAPI.tiposLiquidacion) });
  const { data: procesos } = useQuery({ queryKey: ['rrhh-procesos'], queryFn: () => rrhhAPI.procesos.list({ limit: 50 }).then((r) => r.data) });
  const { data: det } = useQuery({ queryKey: ['rrhh-proc', proc], enabled: !!proc, queryFn: () => rrhhAPI.procesos.get(proc).then((r) => r.data) });
  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));
  const liquidar = useMutation({
    mutationFn: () => rrhhAPI.liquidar({ anio: Number(form.anio), mes: Number(form.mes), tipo_liq: form.tipo_liq, valor_modulo: Number(form.valor_modulo) }),
    onSuccess: (r) => { setError(''); setMsg(`Liquidación OK: ${r.data.legajos} legajos · neto total ${fmt(r.data.total_neto)}`); setProc(r.data.id_proceso); qc.invalidateQueries({ queryKey: ['rrhh-procesos'] }); },
    onError: (e) => { setMsg(''); setError(apiErrorMessage(e, 'No se pudo liquidar')); },
  });
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-wrap items-end gap-2">
        <label className="text-xs text-gray-500">Año<input type="number" value={form.anio} onChange={set('anio')} className={`${inputClass} w-24`} /></label>
        <label className="text-xs text-gray-500">Mes<input type="number" min="1" max="12" value={form.mes} onChange={set('mes')} className={`${inputClass} w-20`} /></label>
        <label className="text-xs text-gray-500">Tipo
          <select value={form.tipo_liq} onChange={set('tipo_liq')} className={inputClass}>
            {(tipos || [{ codigo: 'MEN', descripcion: 'Mensual' }]).map((t) => <option key={t.codigo} value={t.codigo}>{t.codigo} · {t.descripcion}</option>)}
          </select>
        </label>
        <label className="text-xs text-gray-500">Valor del módulo<input type="number" step="0.01" value={form.valor_modulo} onChange={set('valor_modulo')} className={`${inputClass} w-32`} /></label>
        <button className={btnPrimary} onClick={() => liquidar.mutate()} disabled={liquidar.isPending}>{liquidar.isPending ? 'Liquidando…' : 'Liquidar período'}</button>
      </div>
      {msg && <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-2">✓ {msg}</div>}
      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2">⚠ {error}</div>}

      <div className="grid md:grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3">
          <p className="text-sm font-semibold text-gray-700 mb-2">Procesos</p>
          {!procesos?.length ? <p className="text-xs text-gray-400">Sin procesos.</p> : (
            <div className="space-y-1">
              {procesos.map((p) => (
                <button key={p.id} onClick={() => setProc(p.id)} className={`w-full text-left text-xs rounded-lg px-3 py-2 ${proc === p.id ? 'bg-primary-50 text-primary-800 ring-1 ring-primary-200' : 'hover:bg-gray-50'}`}>
                  {p.mes}/{p.anio} · {p.tipo_liq} · {p.cantidad_legajos} leg. · neto {fmt(p.total_neto)}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="md:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-3">
          <p className="text-sm font-semibold text-gray-700 mb-2">Totales por empleado</p>
          {!proc ? <p className="text-xs text-gray-400">Elegí un proceso.</p> : !det ? <LoadingSpinner /> : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs"><thead><tr className="text-left text-gray-500 border-b"><th className="py-1">Legajo</th><th>Empleado</th><th className="text-right">Haberes</th><th className="text-right">Retenc.</th><th className="text-right">Neto</th><th></th></tr></thead>
                <tbody>{(det.totales || []).map((t) => (
                  <tr key={t.id_legajo} className="border-b border-gray-50">
                    <td className="py-1">{t.legajo_numero}</td><td>{t.apellido_nombre}</td>
                    <td className="text-right">{fmt(t.haberes)}</td>
                    <td className="text-right text-red-600">{fmt(Number(t.retenciones) + Number(t.descuentos || 0))}</td>
                    <td className="text-right font-semibold">{fmt(t.neto)}</td>
                    <td className="text-right"><button className="text-primary-600 hover:underline" onClick={() => setRecibo({ id: t.id_legajo, anio: det.anio, mes: det.mes, tipo: det.tipo_liq })}>Recibo</button></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      {recibo && <ReciboModal idLegajo={recibo.id} anio={recibo.anio} mes={recibo.mes} tipoLiq={recibo.tipo} onClose={() => setRecibo(null)} />}
    </div>
  );
}
