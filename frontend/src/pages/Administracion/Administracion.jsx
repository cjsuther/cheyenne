import { useState } from 'react';
import { useTabParam } from '../../hooks/useTabParam';
import { administracionAPI } from '../../services/api';
import PageHeader from '../../components/common/PageHeader';
import GroupedTabBar from '../../components/common/GroupedTabBar';
import { CrudTab } from '../../components/common/CrudComponents';

// ── Helpers para queryFn de listas ──────────────────────────────────
const listaQuery = (tipo) => () => administracionAPI.listas.list({ tipo }).then((r) => r.data);
const allQuery = (apiFn) => () => apiFn.list({ skip: 0, limit: 100 }).then((r) => r.data);

// ═══════════════════════════════════════════════════════════════════════
const TABS = [
  { key: 'personasFisicas', label: 'Personas Fis.' },
  { key: 'personasJuridicas', label: 'Personas Jur.' },
  { key: 'expedientes', label: 'Expedientes' },
  { key: 'entidades', label: 'Entidades' },
  { key: 'listas', label: 'Listas' },
  { key: 'paises', label: 'Paises' },
  { key: 'provincias', label: 'Provincias' },
  { key: 'localidades', label: 'Localidades' },
  { key: 'cuentasContables', label: 'Ctas Contables' },
  { key: 'jurisdicciones', label: 'Jurisdicciones' },
  { key: 'recursosPorRubro', label: 'Recursos' },
  { key: 'documentos', label: 'Documentos' },
  { key: 'mediosPago', label: 'Medios Pago' },
  { key: 'direcciones', label: 'Direcciones' },
  { key: 'contactos', label: 'Contactos' },
  { key: 'archivos', label: 'Archivos' },
  { key: 'observaciones', label: 'Observaciones' },
  { key: 'etiquetas', label: 'Etiquetas' },
];

const GRUPOS = [
  { label: 'Personas', keys: ['personasFisicas', 'personasJuridicas'] },
  { label: 'Expedientes', keys: ['expedientes', 'documentos', 'archivos'] },
  { label: 'Ubicaciones', keys: ['paises', 'provincias', 'localidades', 'jurisdicciones'] },
  { label: 'Contable', keys: ['cuentasContables', 'recursosPorRubro', 'mediosPago'] },
  { label: 'Contacto', keys: ['direcciones', 'contactos'] },
  { label: 'Otros', keys: ['entidades', 'observaciones', 'etiquetas', 'listas'] },
];

export default function Administracion() {
  const [tab, setTab] = useTabParam('personasFisicas');
  return (
    <div>
      <PageHeader title="Administracion" subtitle="Gestion de personas, expedientes, entidades y datos administrativos" />
      <GroupedTabBar grupos={GRUPOS} tabsMeta={TABS} tab={tab} setTab={setTab} />
      {tab === 'personasFisicas' && <PersonasFisicasTab />}
      {tab === 'personasJuridicas' && <PersonasJuridicasTab />}
      {tab === 'expedientes' && <ExpedientesTab />}
      {tab === 'entidades' && <EntidadesTab />}
      {tab === 'listas' && <ListasTab />}
      {tab === 'paises' && <PaisesTab />}
      {tab === 'provincias' && <ProvinciasTab />}
      {tab === 'localidades' && <LocalidadesTab />}
      {tab === 'cuentasContables' && <CuentasContablesTab />}
      {tab === 'jurisdicciones' && <JurisdiccionesTab />}
      {tab === 'recursosPorRubro' && <RecursosPorRubroTab />}
      {tab === 'documentos' && <DocumentosTab />}
      {tab === 'mediosPago' && <MediosPagoTab />}
      {tab === 'direcciones' && <DireccionesTab />}
      {tab === 'contactos' && <ContactosTab />}
      {tab === 'archivos' && <ArchivosTab />}
      {tab === 'observaciones' && <ObservacionesTab />}
      {tab === 'etiquetas' && <EtiquetasTab />}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
function PersonasFisicasTab() {
  return <CrudTab queryKey="personas-fisicas" apiFns={administracionAPI.personas.fisicas} entityName="Persona Fisica" wide
    columns={[
      { key: 'id', label: 'ID' }, { key: 'nombre', label: 'Nombre' }, { key: 'apellido', label: 'Apellido' },
      { key: 'id_tipo_documento', label: 'Tipo Doc.' }, { key: 'numero_documento', label: 'Documento' },
      { key: 'id_genero', label: 'Genero' }, { key: 'id_condicion_fiscal', label: 'Cond. Fiscal' },
      { key: 'activo', label: 'Estado', render: (v) => v ? 'Activo' : 'Inactivo' },
    ]}
    formFields={[
      { key: 'id_tipo_documento', label: 'Tipo Documento', type: 'remote_select', queryKey: 'sel-tipo_documento', queryFn: listaQuery('tipo_documento'), required: true },
      { key: 'numero_documento', label: 'Numero Documento', required: true },
      { key: 'nombre', label: 'Nombre', required: true },
      { key: 'apellido', label: 'Apellido', required: true },
      { key: 'id_genero', label: 'Genero', type: 'remote_select', queryKey: 'sel-genero', queryFn: listaQuery('genero') },
      { key: 'id_estado_civil', label: 'Estado Civil', type: 'remote_select', queryKey: 'sel-estado_civil', queryFn: listaQuery('estado_civil') },
      { key: 'id_nacionalidad', label: 'Nacionalidad', type: 'remote_select', queryKey: 'sel-nacionalidad', queryFn: listaQuery('nacionalidad') },
      { key: 'id_condicion_fiscal', label: 'Condicion Fiscal', type: 'remote_select', queryKey: 'sel-condicion_fiscal', queryFn: listaQuery('condicion_fiscal') },
      { key: 'profesion', label: 'Profesion' }, { key: 'matricula', label: 'Matricula' },
      { key: 'fecha_nacimiento', label: 'Fecha Nacimiento', type: 'date' },
      { key: 'fecha_defuncion', label: 'Fecha Defuncion', type: 'date' },
      { key: 'activo', label: 'Activo', type: 'boolean', defaultValue: true },
    ]}
  />;
}

function PersonasJuridicasTab() {
  return <CrudTab queryKey="personas-juridicas" apiFns={administracionAPI.personas.juridicas} entityName="Persona Juridica" wide
    columns={[
      { key: 'id', label: 'ID' }, { key: 'denominacion', label: 'Denominacion' }, { key: 'nombre_fantasia', label: 'Nombre Fantasia' },
      { key: 'id_tipo_documento', label: 'Tipo Doc.' }, { key: 'numero_documento', label: 'Documento' },
      { key: 'id_forma_juridica', label: 'Forma Juridica' }, { key: 'activo', label: 'Estado', render: (v) => v ? 'Activo' : 'Inactivo' },
    ]}
    formFields={[
      { key: 'id_tipo_documento', label: 'Tipo Documento', type: 'remote_select', queryKey: 'sel-tipo_documento', queryFn: listaQuery('tipo_documento'), required: true },
      { key: 'numero_documento', label: 'Numero Documento', required: true },
      { key: 'denominacion', label: 'Denominacion', required: true },
      { key: 'nombre_fantasia', label: 'Nombre Fantasia' },
      { key: 'id_forma_juridica', label: 'Forma Juridica', type: 'remote_select', queryKey: 'sel-forma_juridica', queryFn: listaQuery('forma_juridica') },
      { key: 'fecha_constitucion', label: 'Fecha Constitucion', type: 'date' },
      { key: 'mes_cierre', label: 'Mes Cierre', type: 'int' },
      { key: 'activo', label: 'Activo', type: 'boolean', defaultValue: true },
    ]}
  />;
}

function ExpedientesTab() {
  return <CrudTab queryKey="expedientes" apiFns={administracionAPI.expedientes} entityName="Expediente" wide
    columns={[
      { key: 'id', label: 'ID' }, { key: 'matricula', label: 'Matricula' }, { key: 'ejercicio', label: 'Ejercicio' },
      { key: 'numero', label: 'Numero' }, { key: 'letra', label: 'Letra' },
      { key: 'id_tipo_expediente', label: 'Tipo' }, { key: 'referencia_expediente', label: 'Referencia' },
    ]}
    formFields={[
      { key: 'matricula', label: 'Matricula' }, { key: 'ejercicio', label: 'Ejercicio', type: 'int' },
      { key: 'numero', label: 'Numero', type: 'int' }, { key: 'letra', label: 'Letra' },
      { key: 'id_tipo_expediente', label: 'Tipo Expediente', type: 'remote_select', queryKey: 'sel-tipo_expediente', queryFn: listaQuery('tipo_expediente') },
      { key: 'subnumero', label: 'Subnumero', type: 'int' }, { key: 'referencia_expediente', label: 'Referencia' },
    ]}
  />;
}

function EntidadesTab() {
  return <CrudTab queryKey="entidades" apiFns={administracionAPI.entidades} entityName="Entidad" wide
    columns={[ { key: 'id', label: 'ID' }, { key: 'codigo', label: 'Codigo' }, { key: 'tipo', label: 'Tipo' }, { key: 'nombre', label: 'Nombre' }, { key: 'orden', label: 'Orden' } ]}
    formFields={[ { key: 'codigo', label: 'Codigo', required: true }, { key: 'tipo', label: 'Tipo', required: true }, { key: 'nombre', label: 'Nombre', required: true }, { key: 'orden', label: 'Orden', type: 'int', defaultValue: 0 }, { key: 'dato1', label: 'Dato 1' }, { key: 'dato2', label: 'Dato 2' }, { key: 'dato3', label: 'Dato 3' }, { key: 'dato4', label: 'Dato 4' }, { key: 'dato5', label: 'Dato 5' } ]}
  />;
}

function ListasTab() {
  return <CrudTab queryKey="listas" apiFns={administracionAPI.listas} entityName="Lista"
    columns={[ { key: 'id', label: 'ID' }, { key: 'codigo', label: 'Codigo' }, { key: 'tipo', label: 'Tipo' }, { key: 'nombre', label: 'Nombre' }, { key: 'orden', label: 'Orden' } ]}
    formFields={[ { key: 'codigo', label: 'Codigo', required: true }, { key: 'tipo', label: 'Tipo', required: true }, { key: 'nombre', label: 'Nombre', required: true }, { key: 'orden', label: 'Orden', type: 'int', defaultValue: 0 } ]}
  />;
}

function PaisesTab() {
  return <CrudTab queryKey="paises" apiFns={administracionAPI.paises} entityName="Pais"
    columns={[ { key: 'id', label: 'ID' }, { key: 'codigo', label: 'Codigo' }, { key: 'nombre', label: 'Nombre' }, { key: 'orden', label: 'Orden' } ]}
    formFields={[ { key: 'codigo', label: 'Codigo', required: true }, { key: 'nombre', label: 'Nombre', required: true }, { key: 'orden', label: 'Orden', type: 'int', defaultValue: 0 } ]}
  />;
}

function ProvinciasTab() {
  return <CrudTab queryKey="provincias" apiFns={administracionAPI.provincias} entityName="Provincia"
    columns={[ { key: 'id', label: 'ID' }, { key: 'codigo', label: 'Codigo' }, { key: 'nombre', label: 'Nombre' }, { key: 'id_pais', label: 'Pais' }, { key: 'orden', label: 'Orden' } ]}
    formFields={[ { key: 'codigo', label: 'Codigo', required: true }, { key: 'nombre', label: 'Nombre', required: true }, { key: 'id_pais', label: 'Pais', type: 'remote_select', queryKey: 'sel-paises', queryFn: allQuery(administracionAPI.paises), required: true }, { key: 'orden', label: 'Orden', type: 'int', defaultValue: 0 } ]}
  />;
}

function LocalidadesTab() {
  return <CrudTab queryKey="localidades" apiFns={administracionAPI.localidades} entityName="Localidad"
    columns={[ { key: 'id', label: 'ID' }, { key: 'codigo', label: 'Codigo' }, { key: 'nombre', label: 'Nombre' }, { key: 'id_provincia', label: 'Provincia' }, { key: 'orden', label: 'Orden' } ]}
    formFields={[ { key: 'codigo', label: 'Codigo', required: true }, { key: 'nombre', label: 'Nombre', required: true }, { key: 'id_provincia', label: 'Provincia', type: 'remote_select', queryKey: 'sel-provincias', queryFn: allQuery(administracionAPI.provincias), required: true }, { key: 'orden', label: 'Orden', type: 'int', defaultValue: 0 } ]}
  />;
}

function CuentasContablesTab() {
  return <CrudTab queryKey="cuentas-contables" apiFns={administracionAPI.cuentasContables} entityName="Cuenta Contable"
    columns={[ { key: 'id', label: 'ID' }, { key: 'codigo', label: 'Codigo' }, { key: 'nombre', label: 'Nombre' }, { key: 'agrupamiento', label: 'Agrupamiento' }, { key: 'orden', label: 'Orden' } ]}
    formFields={[ { key: 'codigo', label: 'Codigo', required: true }, { key: 'nombre', label: 'Nombre', required: true }, { key: 'agrupamiento', label: 'Agrupamiento' }, { key: 'orden', label: 'Orden', type: 'int', defaultValue: 0 } ]}
  />;
}

function JurisdiccionesTab() {
  return <CrudTab queryKey="jurisdicciones" apiFns={administracionAPI.jurisdicciones} entityName="Jurisdiccion" wide
    columns={[ { key: 'id', label: 'ID' }, { key: 'codigo', label: 'Codigo' }, { key: 'nombre', label: 'Nombre' }, { key: 'ejercicio', label: 'Ejercicio' }, { key: 'tipo', label: 'Tipo' }, { key: 'orden', label: 'Orden' } ]}
    formFields={[ { key: 'codigo', label: 'Codigo', required: true }, { key: 'nombre', label: 'Nombre', required: true }, { key: 'ejercicio', label: 'Ejercicio', type: 'int' }, { key: 'agrupamiento', label: 'Agrupamiento' }, { key: 'nivel', label: 'Nivel', type: 'int' }, { key: 'tipo', label: 'Tipo' }, { key: 'orden', label: 'Orden', type: 'int', defaultValue: 0 } ]}
  />;
}

function RecursosPorRubroTab() {
  return <CrudTab queryKey="recursos-por-rubro" apiFns={administracionAPI.recursosPorRubro} entityName="Recurso por Rubro" wide
    columns={[ { key: 'id', label: 'ID' }, { key: 'codigo', label: 'Codigo' }, { key: 'nombre', label: 'Nombre' }, { key: 'presupuesto', label: 'Presupuesto' }, { key: 'agrupamiento', label: 'Agrupamiento' }, { key: 'orden', label: 'Orden' } ]}
    formFields={[ { key: 'codigo', label: 'Codigo', required: true }, { key: 'nombre', label: 'Nombre', required: true }, { key: 'presupuesto', label: 'Presupuesto' }, { key: 'agrupamiento', label: 'Agrupamiento' }, { key: 'nivel', label: 'Nivel', type: 'int' }, { key: 'fecha_baja', label: 'Fecha Baja', type: 'date' }, { key: 'orden', label: 'Orden', type: 'int', defaultValue: 0 } ]}
  />;
}

function DocumentosTab() {
  return <CrudTab queryKey="documentos" apiFns={administracionAPI.documentos} entityName="Documento"
    columns={[ { key: 'id', label: 'ID' }, { key: 'id_tipo_persona', label: 'Tipo Persona' }, { key: 'id_persona', label: 'Persona (ID)' }, { key: 'id_tipo_documento', label: 'Tipo Doc.' }, { key: 'numero_documento', label: 'Numero' }, { key: 'principal', label: 'Principal', render: (v) => v ? 'Si' : 'No' } ]}
    formFields={[
      { key: 'id_tipo_persona', label: 'Tipo Persona', type: 'remote_select', queryKey: 'sel-tipo_persona', queryFn: listaQuery('tipo_persona'), required: true },
      { key: 'id_persona', label: 'Persona (ID)', type: 'int', required: true },
      { key: 'id_tipo_documento', label: 'Tipo Documento', type: 'remote_select', queryKey: 'sel-tipo_documento', queryFn: listaQuery('tipo_documento'), required: true },
      { key: 'numero_documento', label: 'Numero Documento', required: true },
      { key: 'principal', label: 'Principal', type: 'boolean', defaultValue: false },
    ]}
  />;
}

function MediosPagoTab() {
  return <CrudTab queryKey="medios-pago" apiFns={administracionAPI.mediosPago} entityName="Medio de Pago" wide
    columns={[ { key: 'id', label: 'ID' }, { key: 'id_tipo_medio_pago', label: 'Tipo' }, { key: 'titular', label: 'Titular' }, { key: 'numero', label: 'Numero' }, { key: 'banco', label: 'Banco' }, { key: 'alias', label: 'Alias' } ]}
    formFields={[
      { key: 'id_tipo_persona', label: 'Tipo Persona', type: 'remote_select', queryKey: 'sel-tipo_persona', queryFn: listaQuery('tipo_persona'), required: true },
      { key: 'id_persona', label: 'Persona (ID)', type: 'int', required: true },
      { key: 'id_tipo_medio_pago', label: 'Tipo Medio Pago', type: 'remote_select', queryKey: 'sel-tipo_medio_pago', queryFn: listaQuery('tipo_medio_pago'), required: true },
      { key: 'titular', label: 'Titular', required: true }, { key: 'numero', label: 'Numero', required: true },
      { key: 'banco', label: 'Banco' }, { key: 'alias', label: 'Alias' },
    ]}
  />;
}

function DireccionesTab() {
  return <CrudTab queryKey="direcciones" apiFns={administracionAPI.direcciones} entityName="Direccion" wide
    columns={[ { key: 'id', label: 'ID' }, { key: 'entidad', label: 'Entidad' }, { key: 'id_entidad', label: 'ID Entidad' }, { key: 'calle', label: 'Calle' }, { key: 'altura', label: 'Altura' }, { key: 'id_localidad', label: 'Localidad' }, { key: 'codigo_postal', label: 'CP' } ]}
    formFields={[
      { key: 'entidad', label: 'Entidad', required: true }, { key: 'id_entidad', label: 'ID Entidad', type: 'int', required: true },
      { key: 'calle', label: 'Calle', required: true }, { key: 'altura', label: 'Altura' }, { key: 'piso', label: 'Piso' }, { key: 'dpto', label: 'Dpto' }, { key: 'codigo_postal', label: 'CP' },
      { key: 'id_pais', label: 'Pais', type: 'remote_select', queryKey: 'sel-paises', queryFn: allQuery(administracionAPI.paises) },
      { key: 'id_provincia', label: 'Provincia', type: 'remote_select', queryKey: 'sel-provincias', queryFn: allQuery(administracionAPI.provincias) },
      { key: 'id_localidad', label: 'Localidad', type: 'remote_select', queryKey: 'sel-localidades', queryFn: allQuery(administracionAPI.localidades) },
      { key: 'referencia', label: 'Referencia' },
    ]}
  />;
}

function ContactosTab() {
  return <CrudTab queryKey="contactos" apiFns={administracionAPI.contactos} entityName="Contacto"
    columns={[ { key: 'id', label: 'ID' }, { key: 'entidad', label: 'Entidad' }, { key: 'id_entidad', label: 'ID Entidad' }, { key: 'id_tipo_contacto', label: 'Tipo' }, { key: 'detalle', label: 'Detalle' } ]}
    formFields={[
      { key: 'entidad', label: 'Entidad', required: true }, { key: 'id_entidad', label: 'ID Entidad', type: 'int', required: true },
      { key: 'id_tipo_contacto', label: 'Tipo Contacto', type: 'remote_select', queryKey: 'sel-tipo_contacto', queryFn: listaQuery('tipo_contacto'), required: true },
      { key: 'detalle', label: 'Detalle', required: true },
    ]}
  />;
}

function ArchivosTab() {
  return <CrudTab queryKey="archivos" apiFns={administracionAPI.archivos} entityName="Archivo" wide
    columns={[ { key: 'id', label: 'ID' }, { key: 'entidad', label: 'Entidad' }, { key: 'id_entidad', label: 'ID Entidad' }, { key: 'nombre', label: 'Nombre' }, { key: 'descripcion', label: 'Descripcion' }, { key: 'fecha', label: 'Fecha', render: (v) => v ? new Date(v).toLocaleDateString() : '' } ]}
    formFields={[ { key: 'entidad', label: 'Entidad', required: true }, { key: 'id_entidad', label: 'ID Entidad', type: 'int', required: true }, { key: 'nombre', label: 'Nombre', required: true }, { key: 'path', label: 'Path', required: true }, { key: 'descripcion', label: 'Descripcion' } ]}
  />;
}

function ObservacionesTab() {
  return <CrudTab queryKey="observaciones" apiFns={administracionAPI.observaciones} entityName="Observacion"
    columns={[ { key: 'id', label: 'ID' }, { key: 'entidad', label: 'Entidad' }, { key: 'id_entidad', label: 'ID Entidad' }, { key: 'detalle', label: 'Detalle' }, { key: 'fecha', label: 'Fecha', render: (v) => v ? new Date(v).toLocaleDateString() : '' } ]}
    formFields={[ { key: 'entidad', label: 'Entidad', required: true }, { key: 'id_entidad', label: 'ID Entidad', type: 'int', required: true }, { key: 'detalle', label: 'Detalle', required: true } ]}
  />;
}

function EtiquetasTab() {
  return <CrudTab queryKey="etiquetas" apiFns={administracionAPI.etiquetas} entityName="Etiqueta"
    columns={[ { key: 'id', label: 'ID' }, { key: 'entidad', label: 'Entidad' }, { key: 'id_entidad', label: 'ID Entidad' }, { key: 'codigo', label: 'Codigo' } ]}
    formFields={[ { key: 'entidad', label: 'Entidad', required: true }, { key: 'id_entidad', label: 'ID Entidad', type: 'int', required: true }, { key: 'codigo', label: 'Codigo', required: true } ]}
  />;
}
