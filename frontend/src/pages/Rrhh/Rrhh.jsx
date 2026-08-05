import { useTabParam } from '../../hooks/useTabParam';
import { rrhhAPI } from '../../services/api';
import PageHeader from '../../components/common/PageHeader';
import GroupedTabBar from '../../components/common/GroupedTabBar';
import { CrudTab } from '../../components/common/CrudComponents';
import { Empleado360Tab, ConceptosTab, NovedadesTab, TiposLiqTab, LiquidacionTab } from './RrhhFase2';
import { MotivosAusenciaTab, AusenciasTab, LicenciasTab, HorasExtraTab, EmbargosTab } from './RrhhFase3';
import { DeduccionesGananciasTab, EscalaGananciasTab, GananciasResumenTab } from './RrhhFase4';
import { IntegracionTab } from './RrhhFase5';

const bool = (v) => (v ? 'Sí' : 'No');
const num = (v) => (v == null ? '—' : Number(v).toLocaleString('es-AR'));
const allQuery = (apiFns) => () => apiFns.list({ limit: 100 }).then((r) => r.data);
const sel = (key, label, apiFns, optionLabel = 'descripcion', required = false) => ({
  key, label, type: 'remote_select', required,
  queryKey: `sel-rrhh-${key}`, queryFn: allQuery(apiFns), optionValue: 'id', optionLabel,
});

const TABS = [
  { key: 'empleado360', label: 'Empleado 360' },
  { key: 'liquidar', label: 'Liquidación' },
  { key: 'conceptos', label: 'Conceptos' },
  { key: 'novedades', label: 'Novedades' },
  { key: 'tiposLiq', label: 'Tipos de Liquidación' },
  { key: 'integracion', label: 'Contabilización y Pagos' },
  { key: 'gciasResumen', label: 'Ganancias por Empleado' },
  { key: 'gciasDeducciones', label: 'Ganancias · Deducciones' },
  { key: 'gciasEscala', label: 'Ganancias · Escala' },
  { key: 'legajos', label: 'Legajos' },
  { key: 'cargos', label: 'Cargos' },
  { key: 'antiguedad', label: 'Antigüedad' },
  { key: 'familiares', label: 'Familiares' },
  { key: 'ausencias', label: 'Ausencias' },
  { key: 'motivos', label: 'Motivos de Ausencia' },
  { key: 'licencias', label: 'Licencias Anuales' },
  { key: 'horasExtra', label: 'Horas Extra' },
  { key: 'embargos', label: 'Embargos' },
  { key: 'categorias', label: 'Categorías' },
  { key: 'tiposCargo', label: 'Tipos de Cargo' },
  { key: 'cargosFunciones', label: 'Cargos/Funciones' },
  { key: 'nivelesLaboral', label: 'Niveles' },
  { key: 'tiposRelacion', label: 'Situación de Revista' },
  { key: 'oficinas', label: 'Oficinas' },
  { key: 'parentescos', label: 'Parentescos' },
  { key: 'tiposAntiguedad', label: 'Tipos Antigüedad' },
  { key: 'sindicatos', label: 'Sindicatos' },
  { key: 'obrasSociales', label: 'Obras Sociales' },
  { key: 'planta', label: 'Planta (Presupuesto de Cargos)' },
];

const GRUPOS = [
  { label: 'Empleado 360', keys: ['empleado360'] },
  { label: 'Liquidación', keys: ['liquidar', 'conceptos', 'novedades', 'tiposLiq', 'integracion'] },
  { label: 'Ganancias', keys: ['gciasResumen', 'gciasDeducciones', 'gciasEscala'] },
  { label: 'Legajo', keys: ['legajos', 'cargos', 'antiguedad', 'familiares'] },
  { label: 'Novedades y Embargos', keys: ['ausencias', 'motivos', 'licencias', 'horasExtra', 'embargos'] },
  { label: 'Maestros', keys: ['categorias', 'tiposCargo', 'cargosFunciones', 'nivelesLaboral', 'tiposRelacion', 'oficinas', 'parentescos', 'tiposAntiguedad', 'sindicatos', 'obrasSociales'] },
  { label: 'Planta', keys: ['planta'] },
];

// ── Catálogo simple codigo/descripcion (+extras) ──
function Catalogo({ apiFns, entity, extraCols = [], extraFields = [] }) {
  return (
    <CrudTab queryKey={`rrhh-${entity}`} apiFns={apiFns} entityName={entity}
      columns={[{ key: 'id', label: 'ID' }, { key: 'codigo', label: 'Código' }, { key: 'descripcion', label: 'Descripción' }, ...extraCols, { key: 'activo', label: 'Activo', render: bool }]}
      formFields={[{ key: 'codigo', label: 'Código', required: true }, { key: 'descripcion', label: 'Descripción', required: true }, ...extraFields]}
    />
  );
}

export default function Rrhh() {
  const [tab, setTab] = useTabParam('empleado360');
  return (
    <div>
      <PageHeader title="Recursos Humanos" subtitle="Legajos, cargos, antigüedad, familiares, planta y maestros de personal" />
      <GroupedTabBar grupos={GRUPOS} tabsMeta={TABS} tab={tab} setTab={setTab} />

      {tab === 'empleado360' && <Empleado360Tab />}
      {tab === 'liquidar' && <LiquidacionTab />}
      {tab === 'conceptos' && <ConceptosTab />}
      {tab === 'novedades' && <NovedadesTab />}
      {tab === 'tiposLiq' && <TiposLiqTab />}
      {tab === 'integracion' && <IntegracionTab />}
      {tab === 'gciasResumen' && <GananciasResumenTab />}
      {tab === 'gciasDeducciones' && <DeduccionesGananciasTab />}
      {tab === 'gciasEscala' && <EscalaGananciasTab />}
      {tab === 'ausencias' && <AusenciasTab />}
      {tab === 'motivos' && <MotivosAusenciaTab />}
      {tab === 'licencias' && <LicenciasTab />}
      {tab === 'horasExtra' && <HorasExtraTab />}
      {tab === 'embargos' && <EmbargosTab />}

      {tab === 'legajos' && (
        <CrudTab queryKey="rrhh-legajos" apiFns={rrhhAPI.legajos} entityName="Legajo" wide
          columns={[
            { key: 'numero_legajo', label: 'Legajo' }, { key: 'apellido_nombre', label: 'Apellido y Nombre' },
            { key: 'cuil', label: 'CUIL' }, { key: 'estado', label: 'Estado' },
            { key: 'fecha_ingreso', label: 'Ingreso' },
          ]}
          formFields={[
            { key: 'numero_legajo', label: 'N° de Legajo', required: true },
            { key: 'apellido_nombre', label: 'Apellido y Nombre', required: true },
            { key: 'cuil', label: 'CUIL' },
            sel('id_tipo_relacion', 'Situación de revista', rrhhAPI.tiposRelacion),
            sel('id_obra_social', 'Obra Social', rrhhAPI.obrasSociales, 'nombre'),
            sel('id_sindicato', 'Sindicato', rrhhAPI.sindicatos, 'nombre'),
            { key: 'fecha_ingreso', label: 'Fecha de ingreso', type: 'date' },
            { key: 'fecha_egreso', label: 'Fecha de egreso', type: 'date' },
            { key: 'estado', label: 'Estado', type: 'select', defaultValue: 'activo', options: [
              { value: 'activo', label: 'Activo' }, { value: 'licencia', label: 'En licencia' }, { value: 'baja', label: 'Baja' }] },
            { key: 'cbu', label: 'CBU' }, { key: 'banco', label: 'Banco' },
          ]}
        />
      )}

      {tab === 'cargos' && (
        <CrudTab queryKey="rrhh-legajocargos" apiFns={rrhhAPI.legajoCargos} entityName="Cargo" wide
          columns={[
            { key: 'id_legajo', label: 'Legajo' }, { key: 'id_categoria', label: 'Categoría' },
            { key: 'id_tipo_cargo', label: 'Tipo' }, { key: 'objeto_gasto', label: 'Partida' },
            { key: 'fecha_ingreso_cargo', label: 'Desde' },
          ]}
          formFields={[
            sel('id_legajo', 'Legajo', rrhhAPI.legajos, 'apellido_nombre', true),
            sel('id_categoria', 'Categoría', rrhhAPI.categorias),
            sel('id_tipo_cargo', 'Tipo de cargo', rrhhAPI.tiposCargo),
            sel('id_cargo_funcion', 'Cargo/Función', rrhhAPI.cargosFunciones),
            sel('id_oficina', 'Oficina', rrhhAPI.oficinas),
            { key: 'fecha_ingreso_cargo', label: 'Fecha ingreso al cargo', type: 'date' },
            { key: 'fecha_egreso_cargo', label: 'Fecha egreso del cargo', type: 'date' },
            { key: 'letra_nombramiento', label: 'Letra nombramiento' },
            { key: 'anio_nombramiento', label: 'Año nombramiento', type: 'int' },
            { key: 'numero_nombramiento', label: 'N° nombramiento' },
            { key: 'fecha_nombramiento', label: 'Fecha nombramiento', type: 'date' },
            { key: 'expediente', label: 'Expediente' },
            { key: 'objeto_gasto', label: 'Objeto del gasto (partida)', placeholder: 'ej: 1.1.1' },
            { key: 'jurisdiccion', label: 'Jurisdicción' }, { key: 'estructura', label: 'Estructura' }, { key: 'fuente', label: 'Fuente' },
          ]}
        />
      )}

      {tab === 'antiguedad' && (
        <CrudTab queryKey="rrhh-antiguedades" apiFns={rrhhAPI.antiguedades} entityName="Antigüedad" wide
          columns={[
            { key: 'id_legajo', label: 'Legajo' }, { key: 'fecha_desde', label: 'Desde' },
            { key: 'fecha_hasta', label: 'Hasta' }, { key: 'lugar', label: 'Lugar' }, { key: 'id_tipo_antiguedad', label: 'Tipo' },
          ]}
          formFields={[
            sel('id_legajo', 'Legajo', rrhhAPI.legajos, 'apellido_nombre', true),
            { key: 'fecha_desde', label: 'Fecha desde', type: 'date' },
            { key: 'fecha_hasta', label: 'Fecha hasta', type: 'date' },
            { key: 'lugar', label: 'Lugar / organismo' },
            sel('id_tipo_antiguedad', 'Tipo de antigüedad', rrhhAPI.tiposAntiguedad),
          ]}
        />
      )}

      {tab === 'familiares' && (
        <CrudTab queryKey="rrhh-familiares" apiFns={rrhhAPI.familiares} entityName="Familiar" wide
          columns={[
            { key: 'id_legajo', label: 'Legajo' }, { key: 'apellido_nombre', label: 'Familiar' },
            { key: 'documento', label: 'Documento' }, { key: 'id_parentesco', label: 'Parentesco' },
            { key: 'a_cargo', label: 'A cargo', render: bool }, { key: 'deduce_ganancias', label: 'Deduce Gcias.', render: bool },
          ]}
          formFields={[
            sel('id_legajo', 'Legajo', rrhhAPI.legajos, 'apellido_nombre', true),
            { key: 'apellido_nombre', label: 'Apellido y Nombre', required: true },
            { key: 'documento', label: 'Documento' },
            sel('id_parentesco', 'Parentesco', rrhhAPI.parentescos),
            { key: 'a_cargo', label: 'A cargo', type: 'boolean', defaultValue: true },
            { key: 'deduce_ganancias', label: 'Deduce Ganancias', type: 'boolean' },
            { key: 'discapacitado', label: 'Discapacitado', type: 'boolean' },
            { key: 'porcentaje_deduccion', label: '% deducción', type: 'decimal', defaultValue: 0 },
          ]}
        />
      )}

      {tab === 'categorias' && <Catalogo apiFns={rrhhAPI.categorias} entity="Categoría"
        extraCols={[{ key: 'cantidad_modulos', label: 'Módulos', render: num }]}
        extraFields={[{ key: 'cantidad_modulos', label: 'Cantidad de módulos', type: 'decimal', defaultValue: 0 }]} />}
      {tab === 'tiposCargo' && <Catalogo apiFns={rrhhAPI.tiposCargo} entity="Tipo de Cargo" />}
      {tab === 'cargosFunciones' && <Catalogo apiFns={rrhhAPI.cargosFunciones} entity="Cargo/Función"
        extraCols={[{ key: 'cantidad_modulos', label: 'Módulos', render: num }, { key: 'es_cargo', label: 'Cargo', render: bool }, { key: 'es_funcion', label: 'Función', render: bool }]}
        extraFields={[{ key: 'cantidad_modulos', label: 'Cantidad de módulos', type: 'decimal', defaultValue: 0 }, { key: 'es_cargo', label: 'Es cargo', type: 'boolean', defaultValue: true }, { key: 'es_funcion', label: 'Es función', type: 'boolean' }]} />}
      {tab === 'nivelesLaboral' && <Catalogo apiFns={rrhhAPI.nivelesLaboral} entity="Nivel Laboral" />}
      {tab === 'tiposRelacion' && <Catalogo apiFns={rrhhAPI.tiposRelacion} entity="Situación de Revista" />}
      {tab === 'oficinas' && <Catalogo apiFns={rrhhAPI.oficinas} entity="Oficina" />}
      {tab === 'parentescos' && <Catalogo apiFns={rrhhAPI.parentescos} entity="Parentesco" />}
      {tab === 'tiposAntiguedad' && <Catalogo apiFns={rrhhAPI.tiposAntiguedad} entity="Tipo de Antigüedad"
        extraCols={[{ key: 'regimen', label: 'Régimen' }, { key: 'computa', label: 'Computa', render: bool }]}
        extraFields={[{ key: 'regimen', label: 'Régimen', type: 'select', defaultValue: 'municipal', options: [{ value: 'municipal', label: 'Municipal' }, { value: 'publica', label: 'Pública' }, { value: 'no_liquida', label: 'No liquida' }] }, { key: 'computa', label: 'Computa', type: 'boolean', defaultValue: true }]} />}
      {tab === 'sindicatos' && (
        <CrudTab queryKey="rrhh-sindicatos" apiFns={rrhhAPI.sindicatos} entityName="Sindicato"
          columns={[{ key: 'codigo', label: 'Código' }, { key: 'nombre', label: 'Nombre' }, { key: 'cuit', label: 'CUIT' }, { key: 'porcentaje_aporte', label: '% aporte', render: num }, { key: 'activo', label: 'Activo', render: bool }]}
          formFields={[{ key: 'codigo', label: 'Código', required: true }, { key: 'nombre', label: 'Nombre', required: true }, { key: 'cuit', label: 'CUIT' }, { key: 'porcentaje_aporte', label: '% de aporte', type: 'decimal', defaultValue: 0 }]} />
      )}
      {tab === 'obrasSociales' && (
        <CrudTab queryKey="rrhh-obrasociales" apiFns={rrhhAPI.obrasSociales} entityName="Obra Social"
          columns={[{ key: 'codigo', label: 'Código' }, { key: 'nombre', label: 'Nombre' }, { key: 'cuit', label: 'CUIT' }, { key: 'porcentaje_aporte', label: '% aporte', render: num }, { key: 'activo', label: 'Activo', render: bool }]}
          formFields={[{ key: 'codigo', label: 'Código', required: true }, { key: 'nombre', label: 'Nombre', required: true }, { key: 'cuit', label: 'CUIT' }, { key: 'porcentaje_aporte', label: '% de aporte', type: 'decimal', defaultValue: 0 }]} />
      )}

      {tab === 'planta' && (
        <CrudTab queryKey="rrhh-planta" apiFns={rrhhAPI.presupuestoCargos} entityName="Cargo presupuestado"
          columns={[
            { key: 'anio', label: 'Año' }, { key: 'id_categoria', label: 'Categoría' }, { key: 'id_tipo_cargo', label: 'Tipo' },
            { key: 'objeto_gasto', label: 'Partida' }, { key: 'cantidad_cargos', label: 'Cargos' }, { key: 'costo_anual', label: 'Costo anual', render: num },
          ]}
          formFields={[
            { key: 'anio', label: 'Año', type: 'int', required: true, defaultValue: new Date().getFullYear() },
            sel('id_categoria', 'Categoría', rrhhAPI.categorias),
            sel('id_tipo_cargo', 'Tipo de cargo', rrhhAPI.tiposCargo),
            { key: 'objeto_gasto', label: 'Objeto del gasto (partida)', placeholder: 'ej: 1.1.1' },
            { key: 'cantidad_cargos', label: 'Cantidad de cargos', type: 'int', defaultValue: 0 },
            { key: 'costo_anual', label: 'Costo anual', type: 'decimal', defaultValue: 0 },
          ]}
        />
      )}
    </div>
  );
}
