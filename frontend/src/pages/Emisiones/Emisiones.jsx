import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { emisionesAPI } from '../../services/api';
import PageHeader from '../../components/common/PageHeader';
import { CrudTab, Modal, Field, inputClass, btnPrimary } from '../../components/common/CrudComponents';

const fmtDate = (v) => (v ? new Date(v).toLocaleDateString() : '');
const fmtMoney = (v) => `$${Number(v || 0).toFixed(2)}`;

const WORKFLOW_STEPS = [
  { num: 1, label: 'Validar Parametros', apiKey: 'paso1' },
  { num: 2, label: 'Cargar Padron', apiKey: 'paso2', needsData: true },
  { num: 3, label: 'Validar Padron', apiKey: 'paso3' },
  { num: 4, label: 'Calcular Base Imponible', apiKey: 'paso4' },
  { num: 5, label: 'Aplicar Alicuotas', apiKey: 'paso5' },
  { num: 6, label: 'Calcular Bonificaciones', apiKey: 'paso6' },
  { num: 7, label: 'Calcular Recargos', apiKey: 'paso7' },
  { num: 8, label: 'Generar Liquidaciones', apiKey: 'paso8' },
  { num: 9, label: 'Validar Liquidaciones', apiKey: 'paso9', approval: true },
  { num: 10, label: 'Generar Ordenamiento', apiKey: 'paso10' },
  { num: 11, label: 'Generar Cuentas Corrientes', apiKey: 'paso11' },
  { num: 12, label: 'Generar Comprobantes', apiKey: 'paso12' },
  { num: 13, label: 'Imputacion Contable', apiKey: 'paso13' },
  { num: 14, label: 'Publicar Deuda', apiKey: 'paso14' },
  { num: 15, label: 'Solicitar Aprobacion', apiKey: 'paso15' },
  { num: 16, label: 'Aprobar Emision', apiKey: 'paso16', approval: true },
];

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
  const [actionError, setActionError] = useState('');
  const queryClient = useQueryClient();

  const { data: estadoData, isLoading } = useQuery({
    queryKey: ['emisiones-estado', emision.id],
    queryFn: () => emisionesAPI.emisiones.estado(emision.id).then((r) => r.data),
  });

  const pasoActual = estadoData?.paso_actual ?? emision.paso_actual ?? 0;
  const pasos = estadoData?.pasos ?? [];

  const actionMutation = useMutation({
    mutationFn: ({ apiKey, data }) => {
      const fn = emisionesAPI.emisiones[apiKey];
      return data !== undefined ? fn(emision.id, data) : fn(emision.id);
    },
    onSuccess: () => {
      setActionError(''); setApprovalNote('');
      queryClient.invalidateQueries({ queryKey: ['emisiones-estado', emision.id] });
      queryClient.invalidateQueries({ queryKey: ['emi-emisiones'] });
    },
    onError: (e) => setActionError(e.response?.data?.detail || 'Error al ejecutar accion'),
  });

  const handleAction = (step) => {
    if (step.approval) {
      actionMutation.mutate({ apiKey: step.apiKey, data: { aprobado: true, observaciones: approvalNote } });
    } else if (step.needsData) {
      actionMutation.mutate({ apiKey: step.apiKey, data: {} });
    } else {
      actionMutation.mutate({ apiKey: step.apiKey });
    }
  };

  return (
    <Modal title={`Emision #${emision.id} - Workflow`} onClose={onClose} wide>
      {isLoading ? <div className="text-center py-8 text-gray-500">Cargando...</div> : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-gray-50 rounded-lg p-4">
            <div><span className="text-xs text-gray-500">Tributo</span><p className="text-sm font-medium capitalize">{emision.tipo_tributo}</p></div>
            <div><span className="text-xs text-gray-500">Periodo</span><p className="text-sm font-medium">{emision.periodo}</p></div>
            <div><span className="text-xs text-gray-500">Estado</span><p><EstadoBadge estado={estadoData?.estado ?? emision.estado} /></p></div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Progreso ({pasoActual}/16)</h4>
            <div className="space-y-1">
              {WORKFLOW_STEPS.map((step) => {
                const done = step.num <= pasoActual;
                const current = step.num === pasoActual + 1;
                return (
                  <div key={step.num} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${done ? 'bg-green-50 text-green-800' : current ? 'bg-primary-50 text-primary-800 ring-1 ring-primary-300' : 'bg-gray-50 text-gray-400'}`}>
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${done ? 'bg-green-500 text-white' : current ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-500'}`}>{done ? '\u2713' : step.num}</span>
                    <span className="flex-1 truncate">{step.num}. {step.label}</span>
                    {current && <button className="bg-primary-600 hover:bg-primary-700 text-white px-3 py-1 rounded text-xs font-medium shrink-0" onClick={() => handleAction(step)} disabled={actionMutation.isPending}>{actionMutation.isPending ? '...' : step.approval ? 'Aprobar' : 'Ejecutar'}</button>}
                  </div>
                );
              })}
            </div>
          </div>

          {WORKFLOW_STEPS[pasoActual]?.approval && (
            <Field label="Observacion"><input type="text" value={approvalNote} onChange={(e) => setApprovalNote(e.target.value)} placeholder="Observacion opcional..." className={inputClass} /></Field>
          )}

          {actionError && <p className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded">{actionError}</p>}

          {pasos.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Historial</h4>
              <div className="overflow-x-auto"><table className="w-full text-xs"><thead><tr className="border-b text-left text-gray-500"><th className="pb-2 pr-3">#</th><th className="pb-2 pr-3">Nombre</th><th className="pb-2 pr-3">Estado</th><th className="pb-2 pr-3">Fecha</th><th className="pb-2">Obs.</th></tr></thead>
              <tbody>{pasos.map((p, i) => (<tr key={i} className="border-b border-gray-100"><td className="py-1.5 pr-3">{p.numero_paso}</td><td className="py-1.5 pr-3">{p.nombre_paso}</td><td className="py-1.5 pr-3"><EstadoBadge estado={p.estado} /></td><td className="py-1.5 pr-3">{fmtDate(p.ejecutado_en)}</td><td className="py-1.5 text-gray-500">{p.observaciones || '-'}</td></tr>))}</tbody></table></div>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}

export default function Emisiones() {
  const [workflowEmision, setWorkflowEmision] = useState(null);

  return (
    <div>
      <PageHeader title="Emisiones" subtitle="Gestion de emisiones tributarias y workflow de aprobacion" />
      <CrudTab queryKey="emi-emisiones" apiFns={emisionesAPI.emisiones} entityName="Emision" wide
        columns={[
          { key: 'id', label: 'ID' },
          { key: 'tipo_tributo', label: 'Tributo', render: (v) => <span className="capitalize">{v}</span> },
          { key: 'periodo', label: 'Periodo' },
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
