import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { rrhhAPI } from '../../services/api';
import { CrudTab, Modal, btnSecondary } from '../../components/common/CrudComponents';

const bool = (v) => (v ? 'Sí' : 'No');
const fmt = (v) => `$${Number(v || 0).toLocaleString('es-AR', { minimumFractionDigits: 2 })}`;
const allQuery = (apiFns) => () => apiFns.list({ limit: 200 }).then((r) => r.data);
const legSel = (required = false) => ({
  key: 'id_legajo', label: 'Legajo', type: 'remote_select', required,
  queryKey: 'sel-rrhh-f3-leg', queryFn: allQuery(rrhhAPI.legajos), optionValue: 'id', optionLabel: 'apellido_nombre',
});

export function MotivosAusenciaTab() {
  return (
    <CrudTab queryKey="rrhh-motivos" apiFns={rrhhAPI.motivosAusencia} entityName="Motivo de ausencia" wide
      columns={[
        { key: 'codigo', label: 'Código' }, { key: 'descripcion', label: 'Descripción' },
        { key: 'porcentaje_descuento', label: '% desc.' },
        { key: 'descuenta_dias', label: 'Descuenta días', render: bool },
        { key: 'es_licencia_anual', label: 'Lic. anual', render: bool },
        { key: 'requiere_certificado', label: 'Certif.', render: bool },
      ]}
      formFields={[
        { key: 'codigo', label: 'Código', required: true }, { key: 'descripcion', label: 'Descripción', required: true },
        { key: 'porcentaje_descuento', label: '% de descuento', type: 'decimal', defaultValue: 0 },
        { key: 'descuenta_dias', label: 'Descuenta días', type: 'boolean' },
        { key: 'descuenta_aguinaldo', label: 'Descuenta aguinaldo', type: 'boolean' },
        { key: 'afecta_presentismo', label: 'Afecta presentismo', type: 'boolean' },
        { key: 'es_licencia_anual', label: 'Es licencia anual', type: 'boolean' },
        { key: 'requiere_certificado', label: 'Requiere certificado', type: 'boolean' },
      ]}
    />
  );
}

export function AusenciasTab() {
  return (
    <CrudTab queryKey="rrhh-ausencias" apiFns={rrhhAPI.ausencias} entityName="Ausencia" wide
      columns={[
        { key: 'id_legajo', label: 'Legajo' }, { key: 'id_motivo', label: 'Motivo' },
        { key: 'fecha_inicio', label: 'Desde' }, { key: 'fecha_fin', label: 'Hasta' },
        { key: 'dias_habiles', label: 'Días háb.' }, { key: 'certificado', label: 'Certif.', render: bool },
      ]}
      formFields={[
        legSel(true),
        { key: 'id_motivo', label: 'Motivo', type: 'remote_select', queryKey: 'sel-rrhh-motivo', queryFn: allQuery(rrhhAPI.motivosAusencia), optionValue: 'id', optionLabel: 'descripcion' },
        { key: 'fecha_inicio', label: 'Fecha inicio', type: 'date', required: true },
        { key: 'fecha_fin', label: 'Fecha fin', type: 'date', required: true },
        { key: 'dias_habiles', label: 'Días hábiles (0 = autocalcular)', type: 'int', defaultValue: 0 },
        { key: 'certificado', label: 'Presentó certificado', type: 'boolean' },
        { key: 'observaciones', label: 'Observaciones' },
      ]}
    />
  );
}

export function LicenciasTab() {
  return (
    <CrudTab queryKey="rrhh-licencias" apiFns={rrhhAPI.licenciasAnuales} entityName="Licencia anual" wide
      columns={[
        { key: 'id_legajo', label: 'Legajo' }, { key: 'anio', label: 'Año' },
        { key: 'cant_dias', label: 'Días' }, { key: 'dias_tomados', label: 'Tomados' },
        { key: 'saldo', label: 'Saldo', render: (v) => <span className={Number(v) <= 0 ? 'text-red-600 font-semibold' : 'text-green-700 font-semibold'}>{v}</span> },
      ]}
      formFields={[
        legSel(true),
        { key: 'anio', label: 'Año', type: 'int', required: true, defaultValue: new Date().getFullYear() },
        { key: 'cant_dias', label: 'Días asignados', type: 'int', defaultValue: 0 },
        { key: 'dias_tomados', label: 'Días tomados', type: 'int', defaultValue: 0 },
      ]}
    />
  );
}

export function HorasExtraTab() {
  return (
    <CrudTab queryKey="rrhh-horasextra" apiFns={rrhhAPI.horasExtra} entityName="Horas extra" wide
      columns={[
        { key: 'id_legajo', label: 'Legajo' }, { key: 'anio', label: 'Año' }, { key: 'mes', label: 'Mes' },
        { key: 'tipo', label: 'Tipo', render: (v) => `${v}%` }, { key: 'cantidad', label: 'Cantidad' },
        { key: 'valor_hora', label: 'Valor hora', render: fmt },
        { key: 'importe', label: 'Importe est.', render: (_, r) => fmt(Number(r.cantidad || 0) * Number(r.valor_hora || 0) * (r.tipo === '100' ? 2 : 1.5)) },
      ]}
      formFields={[
        legSel(true),
        { key: 'anio', label: 'Año', type: 'int', required: true, defaultValue: new Date().getFullYear() },
        { key: 'mes', label: 'Mes', type: 'int', required: true, defaultValue: new Date().getMonth() + 1 },
        { key: 'tipo', label: 'Tipo', type: 'select', defaultValue: '50', options: [{ value: '50', label: '50%' }, { value: '100', label: '100%' }] },
        { key: 'cantidad', label: 'Cantidad de horas', type: 'decimal', defaultValue: 0 },
        { key: 'valor_hora', label: 'Valor hora', type: 'decimal', defaultValue: 0 },
      ]}
    />
  );
}

// Barra tope/retenido reutilizable
export function EmbargoProgreso({ retenido, tope }) {
  const t = Number(tope || 0);
  if (!t) return <span className="text-xs text-gray-500">Retenido {fmt(retenido)} · sin tope</span>;
  const pct = Math.min(100, (Number(retenido) / t) * 100);
  return (
    <div className="text-xs">
      <div className="flex justify-between text-gray-500"><span>Retenido {fmt(retenido)}</span><span>Tope {fmt(t)}</span></div>
      <div className="h-2 rounded-full bg-gray-200 overflow-hidden mt-0.5"><div className="h-full bg-primary-500" style={{ width: `${pct}%` }} /></div>
      <p className="text-gray-500 mt-0.5">Saldo {fmt(t - Number(retenido))}</p>
    </div>
  );
}

function EmbargoDetalle({ id, onClose }) {
  const { data } = useQuery({ queryKey: ['rrhh-emb-liq', id], queryFn: () => rrhhAPI.embargos.liquidados(id).then((r) => r.data) });
  return (
    <Modal title="Retenciones del embargo" onClose={onClose}>
      {!data ? <p className="text-sm text-gray-400">Cargando…</p> : (
        <div className="space-y-3">
          <EmbargoProgreso retenido={data.total_retenido} tope={data.monto_total} />
          <div className="border border-gray-100 rounded-lg overflow-x-auto">
            <table className="w-full text-xs"><thead className="bg-gray-50"><tr className="text-left text-gray-500"><th className="px-3 py-2">Período</th><th className="px-3 py-2 text-right">Monto</th></tr></thead>
              <tbody>{(data.liquidados || []).map((l, i) => (
                <tr key={i} className="border-t border-gray-50"><td className="px-3 py-1.5">{l.mes}/{l.anio}</td><td className="px-3 py-1.5 text-right">{fmt(l.monto)}</td></tr>
              ))}
              {!data.liquidados?.length && <tr><td colSpan={2} className="px-3 py-3 text-gray-400">Sin retenciones todavía.</td></tr>}</tbody>
            </table>
          </div>
        </div>
      )}
    </Modal>
  );
}

export function EmbargosTab() {
  const [detalle, setDetalle] = useState(null);
  return (
    <>
      <CrudTab queryKey="rrhh-embargos" apiFns={rrhhAPI.embargos} entityName="Embargo" wide
        columns={[
          { key: 'numero', label: 'N°' }, { key: 'id_legajo', label: 'Legajo' },
          { key: 'tipo', label: 'Tipo' }, { key: 'retiene', label: 'Retiene' },
          { key: 'cuota_valor', label: 'Cuota', render: (v, r) => (r.retiene === 'porcentaje' ? `${v}%` : fmt(v)) },
          { key: 'monto_total', label: 'Tope', render: (v) => (Number(v) ? fmt(v) : 'Sin tope') },
          { key: 'estado', label: 'Estado' },
          { key: '_ver', label: '', render: (_, r) => <button className="text-primary-600 hover:underline text-xs" onClick={(e) => { e.stopPropagation(); setDetalle(r.id); }}>Retenciones</button> },
        ]}
        formFields={[
          legSel(true),
          { key: 'numero', label: 'N° de embargo', required: true },
          { key: 'tipo', label: 'Tipo', type: 'select', defaultValue: 'comun', options: [{ value: 'alimentos', label: 'Alimentos (prioritario)' }, { value: 'comun', label: 'Común' }] },
          { key: 'retiene', label: 'Retiene', type: 'select', defaultValue: 'porcentaje', options: [{ value: 'porcentaje', label: 'Porcentaje del neto' }, { value: 'importe', label: 'Importe fijo' }] },
          { key: 'cuota_valor', label: 'Cuota (% o importe según "retiene")', type: 'decimal', defaultValue: 0 },
          { key: 'monto_total', label: 'Monto total / tope (0 = sin tope)', type: 'decimal', defaultValue: 0 },
          { key: 'respeta_salario_familiar', label: 'Respeta salario familiar', type: 'boolean', defaultValue: true },
          { key: 'fecha', label: 'Fecha', type: 'date' },
          { key: 'fecha_vencimiento', label: 'Vencimiento', type: 'date' },
          { key: 'caratula', label: 'Carátula' }, { key: 'juzgado', label: 'Juzgado' },
          { key: 'estado', label: 'Estado', type: 'select', defaultValue: 'autorizado', options: [{ value: 'autorizado', label: 'Autorizado' }, { value: 'anulado', label: 'Anulado' }, { value: 'finalizado', label: 'Finalizado' }] },
          { key: 'banco_destino', label: 'Banco destino' },
        ]}
      />
      {detalle && <EmbargoDetalle id={detalle} onClose={() => setDetalle(null)} />}
    </>
  );
}
