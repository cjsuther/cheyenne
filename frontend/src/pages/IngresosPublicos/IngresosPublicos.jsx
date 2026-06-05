import { useState } from 'react';
import { ingresosPublicosAPI } from '../../services/api';
import PageHeader from '../../components/common/PageHeader';
import { CrudTab } from '../../components/common/CrudComponents';

// ── Helpers ─────────────────────────────────────────────────────────
const listaQuery = (tipo) => () => ingresosPublicosAPI.listas.list({ tipo }).then((r) => r.data);
const allQuery = (apiFn) => () => apiFn.list({ skip: 0, limit: 100 }).then((r) => r.data);
const fmtMoney = (v) => `$${Number(v || 0).toFixed(2)}`;

// Contribuyentes con label compuesto (para combos simples)
const contribuyenteQuery = () => ingresosPublicosAPI.contribuyentes.list({ skip: 0, limit: 100 }).then((r) =>
  r.data.map((c) => ({ ...c, _label: `#${c.id} - ${c.numero_documento}` }))
);

// ── Helpers para search_select de Persona ───────────────────────────
const fmtPersona = (p) => p.nombre ? `${p.nombre} ${p.apellido} (${p.numero_documento})` : `${p.denominacion} (${p.numero_documento})`;

const personaSearchField = {
  type: 'search_select',
  queryKey: 'search-ip-personas',
  searchFn: (q) => ingresosPublicosAPI.personas.list({ q, limit: 20 }),
  getOneFn: (id) => ingresosPublicosAPI.personas.get(id),
  formatLabel: fmtPersona,
};

// ── Helpers para search_select de Cuenta ────────────────────────────
const fmtCuenta = (c) => `${c.numero_cuenta} (#${c.id})`;

const cuentaSearchField = {
  type: 'search_select',
  queryKey: 'search-ip-cuentas',
  searchFn: (q) => ingresosPublicosAPI.cuentas.list({ q, limit: 20 }),
  getOneFn: (id) => ingresosPublicosAPI.cuentas.get(id),
  formatLabel: fmtCuenta,
};

// ═══════════════════════════════════════════════════════════════════════
const TABS = [
  { key: 'contribuyentes', label: 'Contribuyentes' },
  { key: 'cuentas', label: 'Cuentas' },
  { key: 'comercios', label: 'Comercios' },
  { key: 'inmuebles', label: 'Inmuebles' },
  { key: 'vehiculos', label: 'Vehiculos' },
  { key: 'emisiones', label: 'Emisiones' },
  { key: 'emisionDef', label: 'Def. Emisiones' },
  { key: 'planesPago', label: 'Planes Pago' },
  { key: 'planPagoDef', label: 'Def. Planes' },
  { key: 'certificados', label: 'Certificados' },
  { key: 'multas', label: 'Multas' },
  { key: 'tasas', label: 'Tasas' },
  { key: 'subTasas', label: 'Sub-Tasas' },
  { key: 'listas', label: 'Listas' },
];

export default function IngresosPublicos() {
  const [tab, setTab] = useState('contribuyentes');
  return (
    <div>
      <PageHeader title="Ingresos Publicos" subtitle="Contribuyentes, cuentas, emisiones, planes de pago y tributos" />
      <div className="flex gap-1.5 mb-4 overflow-x-auto pb-2 -mx-1 px-1">
        {TABS.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${tab === t.key ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
          >{t.label}</button>
        ))}
      </div>
      {tab === 'contribuyentes' && <ContribuyentesTab />}
      {tab === 'cuentas' && <CuentasTab />}
      {tab === 'comercios' && <ComerciosTab />}
      {tab === 'inmuebles' && <InmueblesTab />}
      {tab === 'vehiculos' && <VehiculosTab />}
      {tab === 'emisiones' && <EmisionesTab />}
      {tab === 'emisionDef' && <EmisionDefinicionesTab />}
      {tab === 'planesPago' && <PlanesPagoTab />}
      {tab === 'planPagoDef' && <PlanPagoDefinicionesTab />}
      {tab === 'certificados' && <CertificadosTab />}
      {tab === 'multas' && <MultasTab />}
      {tab === 'tasas' && <TasasTab />}
      {tab === 'subTasas' && <SubTasasTab />}
      {tab === 'listas' && <ListasTab />}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
function ContribuyentesTab() {
  return <CrudTab queryKey="ip-contribuyentes" apiFns={ingresosPublicosAPI.contribuyentes} entityName="Contribuyente" wide
    columns={[
      { key: 'id', label: 'ID' }, { key: 'id_persona', label: 'Persona' },
      { key: 'id_tipo_persona', label: 'Tipo Persona' },
      { key: 'id_tipo_documento', label: 'Tipo Doc.' }, { key: 'numero_documento', label: 'Documento' },
      { key: 'activo', label: 'Estado', render: (v) => v ? 'Activo' : 'Inactivo' },
    ]}
    formFields={[
      { key: 'id_persona', label: 'Persona', ...personaSearchField, required: true },
      { key: 'id_tipo_persona', label: 'Tipo Persona', type: 'remote_select', queryKey: 'sel-ip-tipo_persona', queryFn: listaQuery('tipo_persona'), required: true },
      { key: 'id_tipo_documento', label: 'Tipo Documento', type: 'remote_select', queryKey: 'sel-ip-tipo_documento', queryFn: listaQuery('tipo_documento'), required: true },
      { key: 'numero_documento', label: 'Numero Documento', required: true },
      { key: 'activo', label: 'Activo', type: 'boolean', defaultValue: true },
    ]}
  />;
}

// ═══════════════════════════════════════════════════════════════════════
function CuentasTab() {
  return <CrudTab queryKey="ip-cuentas" apiFns={ingresosPublicosAPI.cuentas} entityName="Cuenta" wide
    columns={[
      { key: 'id', label: 'ID' }, { key: 'numero_cuenta', label: 'Nro Cuenta' },
      { key: 'id_contribuyente', label: 'Contribuyente' },
      { key: 'id_tipo_tributo', label: 'Tributo' },
      { key: 'id_estado_cuenta', label: 'Estado' },
      { key: 'activo', label: 'Activo', render: (v) => v ? 'Si' : 'No' },
    ]}
    formFields={[
      { key: 'numero_cuenta', label: 'Numero Cuenta', required: true },
      { key: 'id_contribuyente', label: 'Contribuyente', type: 'remote_select', queryKey: 'sel-ip-contribuyentes', queryFn: contribuyenteQuery, optionLabel: '_label' },
      { key: 'id_tipo_tributo', label: 'Tipo Tributo', type: 'remote_select', queryKey: 'sel-ip-tipo_tributo', queryFn: listaQuery('tipo_tributo'), required: true },
      { key: 'id_estado_cuenta', label: 'Estado Cuenta', type: 'remote_select', queryKey: 'sel-ip-estado_cuenta', queryFn: listaQuery('estado_cuenta'), defaultValue: 10 },
      { key: 'codigo_delegacion', label: 'Codigo Delegacion' },
      { key: 'activo', label: 'Activo', type: 'boolean', defaultValue: true },
    ]}
  />;
}

// ═══════════════════════════════════════════════════════════════════════
function ComerciosTab() {
  return <CrudTab queryKey="ip-comercios" apiFns={ingresosPublicosAPI.comercios} entityName="Comercio" wide
    columns={[
      { key: 'id', label: 'ID' }, { key: 'id_cuenta', label: 'Cuenta' }, { key: 'cuit', label: 'CUIT' },
      { key: 'nombre_fantasia', label: 'Nombre Fantasia' }, { key: 'id_categoria', label: 'Categoria' },
      { key: 'gran_contribuyente', label: 'Gran Cont.', render: (v) => v ? 'Si' : 'No' },
      { key: 'activo', label: 'Activo', render: (v) => v ? 'Si' : 'No' },
    ]}
    formFields={[
      { key: 'id_cuenta', label: 'Cuenta', ...cuentaSearchField, required: true },
      { key: 'cuit', label: 'CUIT' }, { key: 'nombre_fantasia', label: 'Nombre Fantasia' },
      { key: 'id_categoria', label: 'Categoria', type: 'remote_select', queryKey: 'sel-ip-categoria_tasa', queryFn: listaQuery('categoria_tasa') },
      { key: 'gran_contribuyente', label: 'Gran Contribuyente', type: 'boolean', defaultValue: false },
      { key: 'activo', label: 'Activo', type: 'boolean', defaultValue: true },
    ]}
  />;
}

// ═══════════════════════════════════════════════════════════════════════
function InmueblesTab() {
  return <CrudTab queryKey="ip-inmuebles" apiFns={ingresosPublicosAPI.inmuebles} entityName="Inmueble" wide
    columns={[
      { key: 'id', label: 'ID' }, { key: 'id_cuenta', label: 'Cuenta' }, { key: 'circuito', label: 'Circuito' },
      { key: 'sector', label: 'Sector' }, { key: 'fraccion', label: 'Fraccion' }, { key: 'parcela', label: 'Parcela' },
      { key: 'activo', label: 'Activo', render: (v) => v ? 'Si' : 'No' },
    ]}
    formFields={[
      { key: 'id_cuenta', label: 'Cuenta', ...cuentaSearchField, required: true },
      { key: 'circuito', label: 'Circuito' }, { key: 'sector', label: 'Sector' },
      { key: 'fraccion', label: 'Fraccion' }, { key: 'parcela', label: 'Parcela' },
      { key: 'id_estado_carga', label: 'Estado Carga', type: 'int' },
      { key: 'activo', label: 'Activo', type: 'boolean', defaultValue: true },
    ]}
  />;
}

// ═══════════════════════════════════════════════════════════════════════
function VehiculosTab() {
  return <CrudTab queryKey="ip-vehiculos" apiFns={ingresosPublicosAPI.vehiculos} entityName="Vehiculo" wide
    columns={[
      { key: 'id', label: 'ID' }, { key: 'id_cuenta', label: 'Cuenta' }, { key: 'dominio', label: 'Dominio' },
      { key: 'modelo', label: 'Modelo' }, { key: 'anio', label: 'Anio' }, { key: 'id_tipo_vehiculo', label: 'Tipo' },
      { key: 'activo', label: 'Activo', render: (v) => v ? 'Si' : 'No' },
    ]}
    formFields={[
      { key: 'id_cuenta', label: 'Cuenta', ...cuentaSearchField, required: true },
      { key: 'dominio', label: 'Dominio', required: true }, { key: 'modelo', label: 'Modelo' },
      { key: 'anio', label: 'Anio', type: 'int' }, { key: 'numero_motor', label: 'Numero Motor' }, { key: 'numero_chasis', label: 'Numero Chasis' },
      { key: 'id_tipo_vehiculo', label: 'Tipo Vehiculo', type: 'remote_select', queryKey: 'sel-ip-tipo_vehiculo', queryFn: listaQuery('tipo_vehiculo') },
      { key: 'activo', label: 'Activo', type: 'boolean', defaultValue: true },
    ]}
  />;
}

// ═══════════════════════════════════════════════════════════════════════
function EmisionesTab() {
  return <CrudTab queryKey="ip-emisiones" apiFns={ingresosPublicosAPI.emisiones} entityName="Emision" wide
    columns={[
      { key: 'id', label: 'ID' }, { key: 'id_cuenta', label: 'Cuenta' }, { key: 'ejercicio', label: 'Ejercicio' },
      { key: 'periodo', label: 'Periodo' }, { key: 'cuota', label: 'Cuota' },
      { key: 'importe_total', label: 'Importe', render: fmtMoney },
      { key: 'id_estado_emision', label: 'Estado' },
    ]}
    formFields={[
      { key: 'id_emision_definicion', label: 'Def. Emision', type: 'remote_select', queryKey: 'sel-ip-emision-def', queryFn: allQuery(ingresosPublicosAPI.emisionDefiniciones) },
      { key: 'id_cuenta', label: 'Cuenta', ...cuentaSearchField },
      { key: 'numero_emision', label: 'Numero Emision', type: 'int' },
      { key: 'ejercicio', label: 'Ejercicio', type: 'int' }, { key: 'periodo', label: 'Periodo', type: 'int' },
      { key: 'cuota', label: 'Cuota', type: 'int' },
      { key: 'importe_original', label: 'Importe Original', type: 'decimal', defaultValue: 0 },
      { key: 'importe_descuento', label: 'Descuento', type: 'decimal', defaultValue: 0 },
      { key: 'importe_recargo', label: 'Recargo', type: 'decimal', defaultValue: 0 },
      { key: 'importe_total', label: 'Total', type: 'decimal', defaultValue: 0 },
      { key: 'fecha_vencimiento_1', label: 'Vencimiento 1', type: 'date' },
      { key: 'fecha_vencimiento_2', label: 'Vencimiento 2', type: 'date' },
      { key: 'id_estado_emision', label: 'Estado Emision', type: 'remote_select', queryKey: 'sel-ip-estado_emision', queryFn: listaQuery('estado_emision'), defaultValue: 10 },
    ]}
  />;
}

// ═══════════════════════════════════════════════════════════════════════
function EmisionDefinicionesTab() {
  return <CrudTab queryKey="ip-emision-definiciones" apiFns={ingresosPublicosAPI.emisionDefiniciones} entityName="Def. Emision" wide
    columns={[
      { key: 'id', label: 'ID' }, { key: 'codigo', label: 'Codigo' }, { key: 'nombre', label: 'Nombre' },
      { key: 'id_tipo_tributo', label: 'Tributo' }, { key: 'ejercicio', label: 'Ejercicio' },
      { key: 'activo', label: 'Activo', render: (v) => v ? 'Si' : 'No' },
    ]}
    formFields={[
      { key: 'codigo', label: 'Codigo', required: true }, { key: 'nombre', label: 'Nombre', required: true },
      { key: 'id_tipo_tributo', label: 'Tipo Tributo', type: 'remote_select', queryKey: 'sel-ip-tipo_tributo', queryFn: listaQuery('tipo_tributo') },
      { key: 'id_tasa', label: 'Tasa', type: 'remote_select', queryKey: 'sel-ip-tasas', queryFn: allQuery(ingresosPublicosAPI.tasas), optionLabel: 'descripcion' },
      { key: 'ejercicio', label: 'Ejercicio', type: 'int' },
      { key: 'periodo_desde', label: 'Periodo Desde', type: 'int' }, { key: 'periodo_hasta', label: 'Periodo Hasta', type: 'int' },
      { key: 'cuota_desde', label: 'Cuota Desde', type: 'int' }, { key: 'cuota_hasta', label: 'Cuota Hasta', type: 'int' },
      { key: 'fecha_vencimiento_1', label: 'Vencimiento 1', type: 'date' }, { key: 'fecha_vencimiento_2', label: 'Vencimiento 2', type: 'date' },
      { key: 'activo', label: 'Activo', type: 'boolean', defaultValue: true },
    ]}
  />;
}

// ═══════════════════════════════════════════════════════════════════════
function PlanesPagoTab() {
  return <CrudTab queryKey="ip-planes-pago" apiFns={ingresosPublicosAPI.planesPago} entityName="Plan de Pago" wide
    columns={[
      { key: 'id', label: 'ID' }, { key: 'id_cuenta', label: 'Cuenta' }, { key: 'id_contribuyente', label: 'Contribuyente' },
      { key: 'cantidad_cuotas', label: 'Cuotas' }, { key: 'importe_total', label: 'Total', render: fmtMoney },
      { key: 'importe_cuota', label: 'Cuota', render: fmtMoney }, { key: 'id_estado_plan', label: 'Estado' },
    ]}
    formFields={[
      { key: 'id_plan_pago_definicion', label: 'Def. Plan', type: 'remote_select', queryKey: 'sel-ip-pp-def', queryFn: allQuery(ingresosPublicosAPI.planPagoDefiniciones) },
      { key: 'id_cuenta', label: 'Cuenta', ...cuentaSearchField },
      { key: 'id_contribuyente', label: 'Contribuyente', type: 'remote_select', queryKey: 'sel-ip-contribuyentes', queryFn: contribuyenteQuery, optionLabel: '_label' },
      { key: 'cantidad_cuotas', label: 'Cantidad Cuotas', type: 'int', required: true },
      { key: 'importe_total', label: 'Importe Total', type: 'decimal', defaultValue: 0 },
      { key: 'importe_anticipo', label: 'Anticipo', type: 'decimal', defaultValue: 0 },
      { key: 'importe_cuota', label: 'Importe Cuota', type: 'decimal', defaultValue: 0 },
      { key: 'id_estado_plan', label: 'Estado Plan', type: 'remote_select', queryKey: 'sel-ip-estado_plan_pago', queryFn: listaQuery('estado_plan_pago'), defaultValue: 10 },
      { key: 'fecha_caducidad', label: 'Fecha Caducidad', type: 'date' },
    ]}
  />;
}

// ═══════════════════════════════════════════════════════════════════════
function PlanPagoDefinicionesTab() {
  return <CrudTab queryKey="ip-plan-pago-definiciones" apiFns={ingresosPublicosAPI.planPagoDefiniciones} entityName="Def. Plan Pago" wide
    columns={[
      { key: 'id', label: 'ID' }, { key: 'codigo', label: 'Codigo' }, { key: 'nombre', label: 'Nombre' },
      { key: 'id_tipo_tributo', label: 'Tributo' }, { key: 'cuota_minima', label: 'Min' }, { key: 'cuota_maxima', label: 'Max' },
      { key: 'activo', label: 'Activo', render: (v) => v ? 'Si' : 'No' },
    ]}
    formFields={[
      { key: 'codigo', label: 'Codigo', required: true }, { key: 'nombre', label: 'Nombre', required: true },
      { key: 'id_tipo_tributo', label: 'Tipo Tributo', type: 'remote_select', queryKey: 'sel-ip-tipo_tributo', queryFn: listaQuery('tipo_tributo') },
      { key: 'cuota_minima', label: 'Cuota Minima', type: 'int', defaultValue: 1 },
      { key: 'cuota_maxima', label: 'Cuota Maxima', type: 'int', defaultValue: 12 },
      { key: 'porcentaje_anticipo', label: '% Anticipo', type: 'decimal' },
      { key: 'tasa_interes', label: 'Tasa Interes', type: 'decimal' },
      { key: 'fecha_desde', label: 'Fecha Desde', type: 'date' }, { key: 'fecha_hasta', label: 'Fecha Hasta', type: 'date' },
      { key: 'activo', label: 'Activo', type: 'boolean', defaultValue: true },
    ]}
  />;
}

// ═══════════════════════════════════════════════════════════════════════
function CertificadosTab() {
  return <CrudTab queryKey="ip-certificados" apiFns={ingresosPublicosAPI.certificados} entityName="Certificado" wide
    columns={[
      { key: 'id', label: 'ID' }, { key: 'id_cuenta', label: 'Cuenta' },
      { key: 'id_tipo_certificado', label: 'Tipo' }, { key: 'numero_certificado', label: 'Numero' },
      { key: 'fecha_vencimiento', label: 'Vencimiento' }, { key: 'id_estado_certificado', label: 'Estado' },
    ]}
    formFields={[
      { key: 'id_cuenta', label: 'Cuenta', ...cuentaSearchField },
      { key: 'id_tipo_certificado', label: 'Tipo Certificado', type: 'remote_select', queryKey: 'sel-ip-tipo_certificado', queryFn: listaQuery('tipo_certificado'), required: true },
      { key: 'numero_certificado', label: 'Numero Certificado' },
      { key: 'fecha_vencimiento', label: 'Fecha Vencimiento', type: 'date' },
      { key: 'id_estado_certificado', label: 'Estado', type: 'remote_select', queryKey: 'sel-ip-estado_certificado', queryFn: listaQuery('estado_certificado'), defaultValue: 10 },
      { key: 'detalle', label: 'Detalle' },
    ]}
  />;
}

// ═══════════════════════════════════════════════════════════════════════
function MultasTab() {
  return <CrudTab queryKey="ip-multas" apiFns={ingresosPublicosAPI.multas} entityName="Multa" wide
    columns={[
      { key: 'id', label: 'ID' }, { key: 'id_cuenta', label: 'Cuenta' },
      { key: 'id_tipo_multa', label: 'Tipo' }, { key: 'numero_multa', label: 'Numero' },
      { key: 'importe', label: 'Importe', render: fmtMoney }, { key: 'id_estado_multa', label: 'Estado' },
    ]}
    formFields={[
      { key: 'id_cuenta', label: 'Cuenta', ...cuentaSearchField },
      { key: 'id_tipo_multa', label: 'Tipo Multa', type: 'remote_select', queryKey: 'sel-ip-tipo_multa', queryFn: listaQuery('tipo_multa'), required: true },
      { key: 'numero_multa', label: 'Numero Multa' },
      { key: 'importe', label: 'Importe', type: 'decimal', required: true },
      { key: 'fecha_vencimiento', label: 'Fecha Vencimiento', type: 'date' },
      { key: 'id_estado_multa', label: 'Estado', type: 'remote_select', queryKey: 'sel-ip-estado_multa', queryFn: listaQuery('estado_multa'), defaultValue: 10 },
      { key: 'detalle', label: 'Detalle' },
    ]}
  />;
}

// ═══════════════════════════════════════════════════════════════════════
function TasasTab() {
  return <CrudTab queryKey="ip-tasas" apiFns={ingresosPublicosAPI.tasas} entityName="Tasa" wide
    columns={[
      { key: 'id', label: 'ID' }, { key: 'codigo', label: 'Codigo' }, { key: 'descripcion', label: 'Descripcion' },
      { key: 'id_tipo_tributo', label: 'Tributo' }, { key: 'id_categoria_tasa', label: 'Categoria' },
      { key: 'porcentaje_descuento', label: '% Descuento' },
    ]}
    formFields={[
      { key: 'codigo', label: 'Codigo', required: true }, { key: 'descripcion', label: 'Descripcion', required: true },
      { key: 'id_tipo_tributo', label: 'Tipo Tributo', type: 'remote_select', queryKey: 'sel-ip-tipo_tributo', queryFn: listaQuery('tipo_tributo') },
      { key: 'id_categoria_tasa', label: 'Categoria', type: 'remote_select', queryKey: 'sel-ip-categoria_tasa', queryFn: listaQuery('categoria_tasa') },
      { key: 'porcentaje_descuento', label: 'Porcentaje Descuento', type: 'decimal' },
    ]}
  />;
}

// ═══════════════════════════════════════════════════════════════════════
function SubTasasTab() {
  return <CrudTab queryKey="ip-sub-tasas" apiFns={ingresosPublicosAPI.subTasas} entityName="Sub-Tasa"
    columns={[
      { key: 'id', label: 'ID' }, { key: 'id_tasa', label: 'Tasa' }, { key: 'codigo', label: 'Codigo' },
      { key: 'descripcion', label: 'Descripcion' }, { key: 'fecha_desde', label: 'Desde' }, { key: 'fecha_hasta', label: 'Hasta' },
    ]}
    formFields={[
      { key: 'id_tasa', label: 'Tasa', type: 'remote_select', queryKey: 'sel-ip-tasas-all', queryFn: allQuery(ingresosPublicosAPI.tasas), optionLabel: 'descripcion', required: true },
      { key: 'codigo', label: 'Codigo', required: true }, { key: 'descripcion', label: 'Descripcion', required: true },
      { key: 'fecha_desde', label: 'Fecha Desde', type: 'date' }, { key: 'fecha_hasta', label: 'Fecha Hasta', type: 'date' },
    ]}
  />;
}

// ═══════════════════════════════════════════════════════════════════════
function ListasTab() {
  return <CrudTab queryKey="ip-listas" apiFns={ingresosPublicosAPI.listas} entityName="Lista"
    columns={[ { key: 'id', label: 'ID' }, { key: 'codigo', label: 'Codigo' }, { key: 'tipo', label: 'Tipo' }, { key: 'nombre', label: 'Nombre' }, { key: 'orden', label: 'Orden' } ]}
    formFields={[ { key: 'codigo', label: 'Codigo', required: true }, { key: 'tipo', label: 'Tipo', required: true }, { key: 'nombre', label: 'Nombre', required: true }, { key: 'orden', label: 'Orden', type: 'int', defaultValue: 0 } ]}
  />;
}
