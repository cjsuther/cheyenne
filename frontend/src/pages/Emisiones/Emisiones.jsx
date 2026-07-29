import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { emisionesAPI } from '../../services/api';
import { useTabParam } from '../../hooks/useTabParam';
import PageHeader from '../../components/common/PageHeader';
import GroupedTabBar from '../../components/common/GroupedTabBar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { CrudTab, Modal, Field, inputClass, btnPrimary, btnSecondary } from '../../components/common/CrudComponents';

const fmtDate = (v) => (v ? new Date(v).toLocaleDateString() : '');
const fmtDateTime = (v) => (v ? new Date(v).toLocaleString() : '-');
const fmtMoney = (v) => `$${Number(v || 0).toFixed(2)}`;

const estadoColors = {
  borrador: 'bg-gray-100 text-gray-800', en_proceso: 'bg-blue-100 text-blue-800',
  completado: 'bg-green-100 text-green-800', finalizada: 'bg-green-100 text-green-800',
  error: 'bg-red-100 text-red-800', cancelada: 'bg-red-100 text-red-800',
};

function EstadoBadge({ estado }) {
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${estadoColors[estado] || 'bg-yellow-100 text-yellow-800'}`}>{estado || 'N/A'}</span>;
}

function WorkflowModal({ emision, onClose }) {
  const [approvalNote, setApprovalNote] = useState('');
  const [refId, setRefId] = useState('');
  const [cuentasPrueba, setCuentasPrueba] = useState('');
  const [directorio, setDirectorio] = useState('');
  const [criterioOrd, setCriterioOrd] = useState(['codigo_postal', 'barrio', 'calle', 'numero']);
  const [editParams, setEditParams] = useState({
    fecha_desde: (emision.fecha_desde || '').slice(0, 10),
    fecha_hasta: (emision.fecha_hasta || '').slice(0, 10),
    fecha_vencimiento_1: (emision.fecha_vencimiento_1 || '').slice(0, 10),
    fecha_vencimiento_2: (emision.fecha_vencimiento_2 || '').slice(0, 10),
    numero_cuota: emision.numero_cuota ?? '',
    ttas_tasa: emision.ttas_tasa ?? '',
    ttas_subtasa: emision.ttas_subtasa ?? 0,
    criterio_seleccion: emision.criterio_seleccion || '',
  });
  const setEP = (k) => (e) => setEditParams((p) => ({ ...p, [k]: e.target.value }));
  const [actionError, setActionError] = useState('');
  const [reejecutar, setReejecutar] = useState(null); // numero de paso completado que se está reejecutando
  const queryClient = useQueryClient();

  const { data: estadoData, isLoading } = useQuery({
    queryKey: ['emisiones-estado', emision.id],
    queryFn: () => emisionesAPI.emisiones.estado(emision.id).then((r) => r.data),
  });

  const pasoActual = estadoData?.paso_actual ?? emision.paso_actual ?? 0;
  const pasos = estadoData?.pasos ?? [];

  const { data: liquidaciones } = useQuery({
    queryKey: ['emisiones-liquidaciones', emision.id, pasoActual],
    queryFn: () => emisionesAPI.emisiones.liquidaciones(emision.id, { limit: 200 }).then((r) => r.data),
    enabled: pasoActual >= 3,
  });
  const totalAPagar = (liquidaciones ?? []).reduce((s, l) => s + Number(l.a_pagar || 0), 0);

  const { data: ctaCte } = useQuery({
    queryKey: ['emisiones-cuentacorriente', emision.id, pasoActual],
    queryFn: () => emisionesAPI.emisiones.cuentaCorriente(emision.id, { limit: 200 }).then((r) => r.data),
    enabled: pasoActual >= 16,
  });
  const totalDeuda = (ctaCte ?? []).reduce((s, c) => s + Number(c.saldo || 0), 0);

  const { data: comprobantes } = useQuery({
    queryKey: ['emisiones-comprobantes', emision.id, pasoActual],
    queryFn: () => emisionesAPI.emisiones.comprobantes(emision.id, { limit: 200 }).then((r) => r.data),
    enabled: pasoActual >= 8,
  });

  const { data: resumen } = useQuery({
    queryKey: ['emisiones-resumen', emision.id, pasoActual],
    queryFn: () => emisionesAPI.emisiones.resumen(emision.id).then((r) => r.data),
    enabled: pasoActual >= 3,
  });

  const { data: recibosPdf } = useQuery({
    queryKey: ['emisiones-recibospdf', emision.id, pasoActual],
    queryFn: () => emisionesAPI.emisiones.recibosPdf(emision.id).then((r) => r.data),
    enabled: pasoActual >= 8,
  });

  const descargarRecibo = async (r) => {
    const { data } = await emisionesAPI.emisiones.descargarRecibo(emision.id, r.ambito, r.archivo);
    const url = URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url; a.download = r.archivo; a.click();
    URL.revokeObjectURL(url);
  };

  const actionMutation = useMutation({
    mutationFn: ({ numero, data }) => emisionesAPI.emisiones.ejecutarPaso(emision.id, numero, data),
    onSuccess: () => {
      setActionError(''); setApprovalNote(''); setReejecutar(null);
      queryClient.invalidateQueries({ queryKey: ['emisiones-estado', emision.id] });
      queryClient.invalidateQueries({ queryKey: ['emisiones-liquidaciones', emision.id] });
      queryClient.invalidateQueries({ queryKey: ['emisiones-cuentacorriente', emision.id] });
      queryClient.invalidateQueries({ queryKey: ['emisiones-comprobantes', emision.id] });
      queryClient.invalidateQueries({ queryKey: ['emisiones-resumen', emision.id] });
      queryClient.invalidateQueries({ queryKey: ['emisiones-recibospdf', emision.id] });
      queryClient.invalidateQueries({ queryKey: ['emi-emisiones'] });
    },
    onError: (e) => setActionError(e.response?.data?.detail || 'Error al ejecutar el paso'),
  });

  const handleAction = (step) => {
    const data = {};
    if (step.tipo === 'aprobacion') { data.aprobado = true; data.observaciones = approvalNote; }
    if (step.numero === 1) { data.id_referencia = Number(refId) || null; }
    if (step.key === 'editar_calculo') { Object.assign(data, editParams); }
    if (step.key === 'calculo_prueba') { data.cuentas = cuentasPrueba; }
    if (step.key === 'ordenamiento_prueba' || step.key === 'ordenamiento_general') {
      data.criterio = ['codigo_postal', 'barrio', 'calle', 'numero'].filter((k) => criterioOrd.includes(k)).join(',');
    }
    if (step.key === 'impresion_prueba' || step.key === 'impresion_general') {
      if (directorio) data.directorio = directorio;
    }
    actionMutation.mutate({ numero: step.numero, data });
  };

  const definicion = estadoData?.definicion ?? [];
  const totalPasos = estadoData?.total_pasos ?? 16;

  const renderStepInput = (step) => {
    if (step.numero === 1) return (
      <Field label="Emisión de referencia (ID) — para importar sus parámetros">
        <input type="number" value={refId} onChange={(e) => setRefId(e.target.value)} placeholder="ID de la emisión anterior" className={inputClass} />
      </Field>
    );
    if (step.key === 'editar_calculo') return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <Field label="Fecha desde"><input type="date" value={editParams.fecha_desde} onChange={setEP('fecha_desde')} className={inputClass} /></Field>
        <Field label="Fecha hasta"><input type="date" value={editParams.fecha_hasta} onChange={setEP('fecha_hasta')} className={inputClass} /></Field>
        <Field label="N° de cuota"><input type="number" value={editParams.numero_cuota} onChange={setEP('numero_cuota')} className={inputClass} /></Field>
        <Field label="1er vencimiento"><input type="date" value={editParams.fecha_vencimiento_1} onChange={setEP('fecha_vencimiento_1')} className={inputClass} /></Field>
        <Field label="2do vencimiento"><input type="date" value={editParams.fecha_vencimiento_2} onChange={setEP('fecha_vencimiento_2')} className={inputClass} /></Field>
        <div />
        <Field label="Tasa"><input type="number" value={editParams.ttas_tasa} onChange={setEP('ttas_tasa')} className={inputClass} /></Field>
        <Field label="Sub-tasa"><input type="number" value={editParams.ttas_subtasa} onChange={setEP('ttas_subtasa')} className={inputClass} /></Field>
        <div />
        <div className="col-span-2 sm:col-span-3">
          <Field label="Criterios de selección"><input type="text" value={editParams.criterio_seleccion} onChange={setEP('criterio_seleccion')} placeholder="ej: zona=centro; estado=activo" className={inputClass} /></Field>
        </div>
      </div>
    );
    if (step.key === 'ordenamiento_prueba' || step.key === 'ordenamiento_general') return (
      <Field label="Criterio de ordenamiento para reparto">
        <div className="flex flex-wrap gap-4 mt-1">
          {[['codigo_postal', 'Código postal'], ['barrio', 'Barrio'], ['calle', 'Calle'], ['numero', 'Número']].map(([k, l]) => (
            <label key={k} className="flex items-center gap-1.5 text-sm">
              <input type="checkbox" checked={criterioOrd.includes(k)} onChange={(e) => setCriterioOrd((prev) => e.target.checked ? [...prev, k] : prev.filter((x) => x !== k))} className="w-4 h-4" />
              {l}
            </label>
          ))}
        </div>
      </Field>
    );
    if (step.key === 'calculo_prueba') return (
      <Field label="Cuentas de prueba — IDs de contribuyente separados por coma">
        <input type="text" value={cuentasPrueba} onChange={(e) => setCuentasPrueba(e.target.value)} placeholder="ej: 1, 2, 13" className={inputClass} />
      </Field>
    );
    if (step.key === 'impresion_prueba' || step.key === 'impresion_general') {
      const def = `/output/pdf/emision_${emision.id}/${step.key === 'impresion_prueba' ? 'prueba' : 'final'}`;
      return (
        <Field label="Directorio de salida de los recibos (PDF)">
          <input type="text" value={directorio} onChange={(e) => setDirectorio(e.target.value)} placeholder={def} className={inputClass} />
          <p className="text-xs text-gray-400 mt-1">Si lo dejás vacío usa: {def}</p>
        </Field>
      );
    }
    if (step.tipo === 'aprobacion') return (
      <Field label="Observación">
        <input type="text" value={approvalNote} onChange={(e) => setApprovalNote(e.target.value)} placeholder="Observación opcional..." className={inputClass} />
      </Field>
    );
    return null;
  };

  return (
    <Modal title={`Emision #${emision.id} - Workflow`} onClose={onClose} wide>
      {isLoading ? <div className="text-center py-8 text-gray-500">Cargando...</div> : (
        <div className="space-y-6">
          {actionError && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 flex items-start gap-2">
              <span className="shrink-0">⚠</span>
              <span className="flex-1">{actionError}</span>
              <button onClick={() => setActionError('')} className="text-red-500 hover:text-red-700 shrink-0" title="Cerrar">✕</button>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-gray-50 rounded-lg p-4">
            <div><span className="text-xs text-gray-500">Tributo</span><p className="text-sm font-medium capitalize">{emision.tipo_tributo}</p></div>
            <div><span className="text-xs text-gray-500">Periodo</span><p className="text-sm font-medium">{emision.periodo}</p></div>
            <div><span className="text-xs text-gray-500">Estado</span><p><EstadoBadge estado={estadoData?.estado ?? emision.estado} /></p></div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Progreso ({pasoActual}/{totalPasos})</h4>
            <div className="space-y-1">
              {definicion.map((step) => {
                const done = step.numero <= pasoActual;
                const current = step.numero === pasoActual + 1;
                const reejec = done && reejecutar === step.numero;   // paso completado en modo reejecuci\u00f3n
                const bloqueado = (current || reejec) && !step.puede_ejecutar;
                const expandido = current || reejec;
                const input = expandido && !bloqueado ? renderStepInput(step) : null;
                return (
                  <div key={step.numero} className={`rounded-lg text-sm ${reejec ? 'bg-amber-50 text-amber-900 ring-1 ring-amber-300' : done ? 'bg-green-50 text-green-800' : current ? 'bg-primary-50 text-primary-900 ring-1 ring-primary-300' : 'bg-gray-50 text-gray-400'}`}>
                    <div className="flex items-center gap-3 px-3 py-2">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${done ? 'bg-green-500 text-white' : current ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-500'}`}>{done ? '\u2713' : step.numero}</span>
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium ${expandido ? '' : 'truncate'}`}>{step.numero}. {step.nombre}</p>
                        {expandido && <p className="text-xs text-gray-600">{step.descripcion}</p>}
                      </div>
                      {step.tipo === 'aprobacion' && <span className="text-[10px] uppercase tracking-wide text-amber-600 shrink-0">aprob.</span>}
                      {done && !reejec && step.puede_ejecutar && (
                        <button className="text-[11px] text-green-700 hover:text-green-900 underline shrink-0" onClick={() => { setActionError(''); setReejecutar(step.numero); }}>Reejecutar</button>
                      )}
                      {current && !input && (
                        bloqueado
                          ? <span className="text-[11px] text-red-500 shrink-0" title={`Requiere permiso ${step.permiso}`}>sin permiso</span>
                          : <button className="bg-primary-600 hover:bg-primary-700 text-white px-3 py-1 rounded text-xs font-medium shrink-0" onClick={() => handleAction(step)} disabled={actionMutation.isPending}>{actionMutation.isPending ? '...' : step.tipo === 'aprobacion' ? 'Aprobar' : 'Ejecutar'}</button>
                      )}
                    </div>
                    {expandido && (input || reejec) && (
                      <div className="px-3 pb-3 space-y-2">
                        {reejec && <p className="text-[11px] text-amber-700">Vas a reejecutar un paso ya completado. Esto recalcula/regenera sus resultados.</p>}
                        {input}
                        <div className="flex justify-end gap-2">
                          {reejec && <button className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded text-xs font-medium" onClick={() => setReejecutar(null)} disabled={actionMutation.isPending}>Cancelar</button>}
                          <button className={`text-white px-4 py-1.5 rounded text-xs font-medium ${reejec ? 'bg-amber-600 hover:bg-amber-700' : 'bg-primary-600 hover:bg-primary-700'}`} onClick={() => handleAction(step)} disabled={actionMutation.isPending}>{actionMutation.isPending ? 'Procesando...' : reejec ? 'Reejecutar' : step.tipo === 'aprobacion' ? 'Aprobar' : 'Ejecutar'}</button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {resumen?.lineas > 0 && (
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Totalizador del cálculo</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                <div><p className="text-xs text-gray-500">Cuentas</p><p className="font-bold">{resumen.cuentas}</p></div>
                <div><p className="text-xs text-gray-500">Líneas</p><p className="font-bold">{resumen.lineas}</p></div>
                <div><p className="text-xs text-gray-500">Total a cancelar</p><p className="font-bold">{fmtMoney(resumen.total_a_cancelar)}</p></div>
                <div><p className="text-xs text-gray-500">Total a pagar</p><p className="font-bold text-primary-700">{fmtMoney(resumen.total_a_pagar)}</p></div>
              </div>
              {resumen.por_vencimiento?.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {resumen.por_vencimiento.map((v) => (
                    <span key={v.vencimiento} className="text-xs bg-white border border-gray-200 rounded-full px-2 py-0.5">
                      Vto {v.vencimiento}: a pagar {fmtMoney(v.a_pagar)}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {recibosPdf?.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Recibos generados ({recibosPdf.length})</h4>
              <div className="max-h-48 overflow-y-auto border border-gray-100 rounded-lg divide-y divide-gray-50">
                {recibosPdf.map((r) => (
                  <div key={r.ambito + r.archivo} className="flex items-center justify-between px-3 py-2 text-xs">
                    <span className="font-mono truncate">{r.archivo} <span className="text-gray-400">· {r.ambito} · {Math.round(r.bytes / 1024)} KB</span></span>
                    <button onClick={() => descargarRecibo(r)} className="text-primary-600 hover:underline shrink-0 ml-2">Descargar PDF</button>
                  </div>
                ))}
              </div>
            </div>
          )}


          {pasoActual >= 3 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold text-gray-700">Liquidaciones ({liquidaciones?.length || 0})</h4>
                {liquidaciones?.length > 0 && (
                  <span className="text-sm font-semibold text-primary-700">Total a pagar: ${totalAPagar.toFixed(2)}</span>
                )}
              </div>
              {liquidaciones?.length > 0 ? (
                <div className="overflow-x-auto max-h-72 overflow-y-auto border border-gray-100 rounded-lg">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-50 sticky top-0"><tr className="text-left text-gray-500">
                      <th className="px-3 py-2">Contrib.</th><th className="px-3 py-2">Objeto</th>
                      <th className="px-3 py-2">Tasa</th><th className="px-3 py-2">Vto</th>
                      <th className="px-3 py-2 text-right">a Cancelar</th><th className="px-3 py-2 text-right">a Pagar</th>
                    </tr></thead>
                    <tbody>{liquidaciones.map((l) => (
                      <tr key={l.id} className="border-t border-gray-50">
                        <td className="px-3 py-1.5">{l.id_contribuyente}</td>
                        <td className="px-3 py-1.5">{l.id_objeto_imponible}</td>
                        <td className="px-3 py-1.5">{l.id_tasa}</td>
                        <td className="px-3 py-1.5">{l.numero_vencimiento}</td>
                        <td className="px-3 py-1.5 text-right">${Number(l.a_cancelar || 0).toFixed(2)}</td>
                        <td className="px-3 py-1.5 text-right font-medium">${Number(l.a_pagar || 0).toFixed(2)}</td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-gray-500 bg-gray-50 rounded-lg px-3 py-3">Aún no hay liquidaciones. Ejecutá el paso 8 (Generar Liquidaciones).</p>
              )}
            </div>
          )}

          {pasoActual >= 16 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold text-gray-700">Cuenta corriente ({ctaCte?.length || 0})</h4>
                {ctaCte?.length > 0 && <span className="text-sm font-semibold text-red-600">Deuda total: ${totalDeuda.toFixed(2)}</span>}
              </div>
              {ctaCte?.length > 0 ? (
                <div className="overflow-x-auto max-h-72 overflow-y-auto border border-gray-100 rounded-lg">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-50 sticky top-0"><tr className="text-left text-gray-500">
                      <th className="px-3 py-2">Contrib.</th><th className="px-3 py-2">Concepto</th>
                      <th className="px-3 py-2">Vto</th><th className="px-3 py-2">Estado</th>
                      <th className="px-3 py-2 text-right">Saldo</th>
                    </tr></thead>
                    <tbody>{ctaCte.map((c) => (
                      <tr key={c.id} className="border-t border-gray-50">
                        <td className="px-3 py-1.5">{c.id_contribuyente}</td>
                        <td className="px-3 py-1.5">{c.concepto}</td>
                        <td className="px-3 py-1.5">{fmtDate(c.fecha_vencimiento)}</td>
                        <td className="px-3 py-1.5">{c.estado}</td>
                        <td className="px-3 py-1.5 text-right font-medium">${Number(c.saldo || 0).toFixed(2)}</td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-gray-500 bg-gray-50 rounded-lg px-3 py-3">Sin cuenta corriente. Ejecutá el paso 11 (Generar Cuentas Corrientes).</p>
              )}
            </div>
          )}

          {pasoActual >= 8 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Comprobantes / Recibos ({comprobantes?.length || 0})</h4>
              {comprobantes?.length > 0 ? (
                <div className="overflow-x-auto max-h-72 overflow-y-auto border border-gray-100 rounded-lg">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-50 sticky top-0"><tr className="text-left text-gray-500">
                      <th className="px-3 py-2">Número</th><th className="px-3 py-2">Contrib.</th>
                      <th className="px-3 py-2">Cód. barras</th><th className="px-3 py-2 text-right">Importe</th>
                    </tr></thead>
                    <tbody>{comprobantes.map((c) => (
                      <tr key={c.id} className="border-t border-gray-50">
                        <td className="px-3 py-1.5 font-mono">{c.numero_comprobante}</td>
                        <td className="px-3 py-1.5">{c.id_contribuyente}</td>
                        <td className="px-3 py-1.5 font-mono text-gray-500">{c.codigo_barras}</td>
                        <td className="px-3 py-1.5 text-right font-medium">${Number(c.importe_total || 0).toFixed(2)}</td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-gray-500 bg-gray-50 rounded-lg px-3 py-3">Sin comprobantes. Ejecutá el paso 12 (Generar Comprobantes).</p>
              )}
            </div>
          )}

          {pasos.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Historial</h4>
              <div className="overflow-x-auto"><table className="w-full text-xs"><thead><tr className="border-b text-left text-gray-500"><th className="pb-2 pr-3">#</th><th className="pb-2 pr-3">Nombre</th><th className="pb-2 pr-3">Estado</th><th className="pb-2 pr-3">Usuario</th><th className="pb-2 pr-3">Fecha de ejecución</th><th className="pb-2">Detalle</th></tr></thead>
              <tbody>{pasos.map((p, i) => (<tr key={i} className="border-b border-gray-100"><td className="py-1.5 pr-3">{p.numero_paso}</td><td className="py-1.5 pr-3">{p.nombre_paso}</td><td className="py-1.5 pr-3"><EstadoBadge estado={p.estado} /></td><td className="py-1.5 pr-3">{p.usuario_nombre || p.usuario_codigo || (p.id_usuario ? `#${p.id_usuario}` : '-')}{p.usuario_nombre && p.usuario_codigo ? <span className="text-gray-400"> ({p.usuario_codigo})</span> : null}</td><td className="py-1.5 pr-3 whitespace-nowrap">{fmtDateTime(p.ejecutado_en)}</td><td className="py-1.5 text-gray-500 max-w-xs truncate" title={p.error || p.resultado || ''}>{p.error || p.resultado || '-'}</td></tr>))}</tbody></table></div>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}

const TABS = [
  { key: 'emisiones', label: 'Emisiones' },
  { key: 'ctacte', label: 'Cuenta Corriente / Libro Mayor' },
  { key: 'coeficientes', label: 'Coeficientes' },
];
const GRUPOS = [
  { label: 'Motor', keys: ['emisiones'] },
  { label: 'Cobranza', keys: ['ctacte', 'coeficientes'] },
];

export default function Emisiones() {
  const [tab, setTab] = useTabParam('emisiones');
  return (
    <div>
      <PageHeader title="Emisiones" subtitle="Motor de cálculo, workflow de aprobación, cuenta corriente y coeficientes" />
      <GroupedTabBar grupos={GRUPOS} tabsMeta={TABS} tab={tab} setTab={setTab} />
      {tab === 'emisiones' && <EmisionesTab />}
      {tab === 'ctacte' && <LibroMayorTab />}
      {tab === 'coeficientes' && <CoeficientesTab />}
    </div>
  );
}

function EmisionesTab() {
  const [workflowEmision, setWorkflowEmision] = useState(null);

  return (
    <div>
      <CrudTab queryKey="emi-emisiones" apiFns={emisionesAPI.emisiones} entityName="Emision" wide
        columns={[
          { key: 'id', label: 'ID' },
          { key: 'tipo_tributo', label: 'Tributo', render: (v) => <span className="capitalize">{v}</span> },
          { key: 'periodo', label: 'Periodo' },
          { key: 'ttas_tasa', label: 'Tasa', render: (v) => (v != null ? v : '—') },
          { key: 'descripcion', label: 'Descripcion' },
          { key: 'estado', label: 'Estado', render: (v) => <EstadoBadge estado={v} /> },
          { key: 'paso_actual', label: 'Paso' },
          { key: 'cantidad_contribuyentes', label: 'Contrib.' },
          { key: 'monto_total', label: 'Monto', render: fmtMoney },
          { key: '_workflow', label: '', render: (_, row) => (
            <button className="bg-primary-100 hover:bg-primary-200 text-primary-700 px-3 py-1.5 rounded text-xs font-medium"
              onClick={(e) => { e.stopPropagation(); setWorkflowEmision(row); }}>Workflow</button>
          )},
        ]}
        formFields={[
          { key: 'tipo_tributo', label: 'Tipo Tributo', type: 'select', required: true, options: [
            { value: 'vehiculos', label: 'Vehiculos' }, { value: 'inmuebles', label: 'Inmuebles' },
            { value: 'comercios', label: 'Comercios' }, { value: 'otro', label: 'Otro' },
          ]},
          { key: 'periodo', label: 'Periodo (ej: 2025-01)', required: true },
          { key: 'ttas_tasa', label: 'Tasa del catálogo (opcional)', type: 'int' },
          { key: 'ttas_subtasa', label: 'Sub-tasa', type: 'int', defaultValue: 0 },
          { key: 'variables_default', label: 'Variables del padrón (JSON, opcional)', type: 'textarea',
            placeholder: '{"I_CUOTA_ANUAL":"N","I_ZONATARI":"2"}' },
          { key: 'descripcion', label: 'Descripcion' },
          { key: 'fecha_vencimiento_1', label: '1er Vencimiento', type: 'date' },
          { key: 'fecha_vencimiento_2', label: '2do Vencimiento', type: 'date' },
          { key: 'id_emision_base', label: 'Emision Base (ID)', type: 'int' },
        ]}
      />
      {workflowEmision && <WorkflowModal emision={workflowEmision} onClose={() => setWorkflowEmision(null)} />}
    </div>
  );
}

// ── Cuenta corriente / Libro mayor del contribuyente ─────────────────────
function LibroMayorTab() {
  const [idContribuyente, setIdContribuyente] = useState('');
  const [buscado, setBuscado] = useState(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['emi-libromayor', buscado],
    queryFn: () => emisionesAPI.ctacte.movimientos(buscado).then((r) => r.data),
    enabled: buscado != null,
  });

  const buscar = (e) => { e.preventDefault(); const n = Number(idContribuyente); if (n) setBuscado(n); };

  return (
    <div>
      <form onSubmit={buscar} className="mb-4 flex items-end gap-2">
        <Field label="ID de contribuyente">
          <input type="number" value={idContribuyente} onChange={(e) => setIdContribuyente(e.target.value)}
            placeholder="ej: 1024" className={inputClass} />
        </Field>
        <button type="submit" className={btnPrimary}>Ver libro mayor</button>
      </form>

      {buscado == null ? (
        <p className="text-sm text-gray-500 bg-gray-50 rounded-lg px-3 py-3">Ingresá un ID de contribuyente para ver su extracto Debe/Haber con saldo corrido.</p>
      ) : isLoading ? <LoadingSpinner /> : isError ? (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-3">No se pudo obtener el libro mayor.</p>
      ) : (
        <div>
          <div className="grid grid-cols-3 gap-3 mb-3 bg-gray-50 rounded-lg p-4 text-sm">
            <div><p className="text-xs text-gray-500">Total Debe</p><p className="font-bold text-gray-800">{fmtMoney(data.total_debe)}</p></div>
            <div><p className="text-xs text-gray-500">Total Haber</p><p className="font-bold text-gray-800">{fmtMoney(data.total_haber)}</p></div>
            <div><p className="text-xs text-gray-500">Saldo</p><p className={`font-bold ${Number(data.saldo) > 0 ? 'text-red-600' : 'text-green-600'}`}>{fmtMoney(data.saldo)}</p></div>
          </div>
          {data.movimientos?.length > 0 ? (
            <div className="overflow-x-auto border border-gray-100 rounded-lg">
              <table className="w-full text-xs">
                <thead className="bg-gray-50"><tr className="text-left text-gray-500">
                  <th className="px-3 py-2">Fecha</th><th className="px-3 py-2">Concepto</th>
                  <th className="px-3 py-2">Comprobante</th><th className="px-3 py-2">Tributo</th>
                  <th className="px-3 py-2 text-right">Debe</th><th className="px-3 py-2 text-right">Haber</th>
                  <th className="px-3 py-2 text-right">Saldo</th>
                </tr></thead>
                <tbody>{data.movimientos.map((m) => (
                  <tr key={m.id} className="border-t border-gray-50">
                    <td className="px-3 py-1.5 whitespace-nowrap">{fmtDate(m.fecha)}</td>
                    <td className="px-3 py-1.5"><span className="capitalize">{m.concepto}</span>{m.descripcion ? <span className="text-gray-400"> · {m.descripcion}</span> : null}</td>
                    <td className="px-3 py-1.5 font-mono text-gray-500">{m.comprobante || '—'}</td>
                    <td className="px-3 py-1.5 capitalize">{m.tipo_tributo || '—'}</td>
                    <td className="px-3 py-1.5 text-right">{m.debe ? fmtMoney(m.debe) : ''}</td>
                    <td className="px-3 py-1.5 text-right">{m.haber ? fmtMoney(m.haber) : ''}</td>
                    <td className="px-3 py-1.5 text-right font-medium">{fmtMoney(m.saldo)}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-gray-500 bg-gray-50 rounded-lg px-3 py-3">Este contribuyente no tiene movimientos.</p>
          )}
        </div>
      )}
    </div>
  );
}

// ── ABM de coeficientes (curva temporal de recargos) ─────────────────────
const emptyCoef = { tipo_tributo: '', fecha_desde: '', fecha_hasta: '', tipo: 'mensual', valor: '', descripcion: '' };

function CoeficientesTab() {
  const qc = useQueryClient();
  const [modal, setModal] = useState(null); // { data } o null
  const [form, setForm] = useState(emptyCoef);
  const [err, setErr] = useState('');

  const { data: coefs, isLoading } = useQuery({
    queryKey: ['emi-coeficientes'],
    queryFn: () => emisionesAPI.coeficientes.list({ limit: 200 }).then((r) => r.data),
  });
  const refetch = () => qc.invalidateQueries({ queryKey: ['emi-coeficientes'] });

  const save = useMutation({
    mutationFn: (payload) => (payload.id
      ? emisionesAPI.coeficientes.update(payload.id, payload)
      : emisionesAPI.coeficientes.create(payload)),
    onSuccess: () => { setModal(null); setErr(''); refetch(); },
    onError: (e) => setErr(e.response?.data?.detail || 'No se pudo guardar'),
  });
  const del = useMutation({
    mutationFn: (id) => emisionesAPI.coeficientes.remove(id),
    onSuccess: refetch,
  });

  const abrir = (row) => {
    if (row) setForm({ ...emptyCoef, ...row, fecha_desde: (row.fecha_desde || '').slice(0, 10), fecha_hasta: (row.fecha_hasta || '').slice(0, 10) });
    else setForm(emptyCoef);
    setErr(''); setModal({ id: row?.id });
  };
  const setF = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));
  const submit = (e) => {
    e.preventDefault();
    const payload = { ...form, id: modal.id,
      tipo_tributo: form.tipo_tributo || null,
      fecha_hasta: form.fecha_hasta || null,
      valor: Number(form.valor) };
    save.mutate(payload);
  };

  return (
    <div>
      <div className="mb-3 flex justify-between items-center">
        <p className="text-sm text-gray-500">Curva de recargos por mora: la mora se calcula recorriendo estos tramos según la fecha de corte (no un % plano a hoy).</p>
        <button className={btnPrimary} onClick={() => abrir(null)}>Nuevo coeficiente</button>
      </div>
      {isLoading ? <LoadingSpinner /> : (
        <div className="overflow-x-auto border border-gray-100 rounded-lg">
          <table className="w-full text-xs">
            <thead className="bg-gray-50"><tr className="text-left text-gray-500">
              <th className="px-3 py-2">Tributo</th><th className="px-3 py-2">Desde</th><th className="px-3 py-2">Hasta</th>
              <th className="px-3 py-2">Tipo</th><th className="px-3 py-2 text-right">Valor %</th>
              <th className="px-3 py-2">Descripción</th><th className="px-3 py-2"></th>
            </tr></thead>
            <tbody>{(coefs || []).map((c) => (
              <tr key={c.id} className="border-t border-gray-50">
                <td className="px-3 py-1.5 capitalize">{c.tipo_tributo || 'Todos'}</td>
                <td className="px-3 py-1.5">{fmtDate(c.fecha_desde)}</td>
                <td className="px-3 py-1.5">{c.fecha_hasta ? fmtDate(c.fecha_hasta) : '∞'}</td>
                <td className="px-3 py-1.5 capitalize">{c.tipo}</td>
                <td className="px-3 py-1.5 text-right font-medium">{Number(c.valor || 0)}</td>
                <td className="px-3 py-1.5 text-gray-500">{c.descripcion}</td>
                <td className="px-3 py-1.5 text-right whitespace-nowrap">
                  <button className="text-primary-600 hover:underline mr-3" onClick={() => abrir(c)}>Editar</button>
                  <button className="text-red-500 hover:underline" onClick={() => { if (confirm('¿Desactivar coeficiente?')) del.mutate(c.id); }}>Baja</button>
                </td>
              </tr>
            ))}</tbody>
          </table>
          {(coefs || []).length === 0 && <p className="text-sm text-gray-500 px-3 py-3">Sin coeficientes cargados. Se usa el % plano configurado como fallback.</p>}
        </div>
      )}

      {modal && (
        <Modal title={modal.id ? 'Editar coeficiente' : 'Nuevo coeficiente'} onClose={() => setModal(null)}>
          <form onSubmit={submit} className="space-y-3">
            {err && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-3 py-2">{err}</div>}
            <Field label="Tipo de tributo (vacío = aplica a todos)">
              <input type="text" value={form.tipo_tributo} onChange={setF('tipo_tributo')} placeholder="ej: inmuebles" className={inputClass} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Fecha desde"><input type="date" required value={form.fecha_desde} onChange={setF('fecha_desde')} className={inputClass} /></Field>
              <Field label="Fecha hasta (opcional)"><input type="date" value={form.fecha_hasta} onChange={setF('fecha_hasta')} className={inputClass} /></Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Tipo">
                <select value={form.tipo} onChange={setF('tipo')} className={inputClass}>
                  <option value="mensual">Mensual (por 30 días)</option>
                  <option value="diario">Diario (por día)</option>
                </select>
              </Field>
              <Field label="Valor % del tramo"><input type="number" step="0.000001" required value={form.valor} onChange={setF('valor')} placeholder="ej: 3.0" className={inputClass} /></Field>
            </div>
            <Field label="Descripción"><input type="text" value={form.descripcion} onChange={setF('descripcion')} className={inputClass} /></Field>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" className={btnSecondary} onClick={() => setModal(null)}>Cancelar</button>
              <button type="submit" className={btnPrimary} disabled={save.isPending}>{save.isPending ? 'Guardando...' : 'Guardar'}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
