import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { presupuestoAPI } from '../../services/api';
import { useTabParam } from '../../hooks/useTabParam';
import PageHeader from '../../components/common/PageHeader';
import GroupedTabBar from '../../components/common/GroupedTabBar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { CrudTab, Modal, Field, inputClass, btnPrimary, btnSecondary } from '../../components/common/CrudComponents';
import PartidasTab from './PartidasTab';
import ModificacionesTab from './ModificacionesTab';
import RecursosTab from './RecursosTab';
import MapeoTributoTab from './MapeoTributoTab';
import CuotasTab from './CuotasTab';
import RRHHTab from './RRHHTab';
import MetasTab from './MetasTab';
import ProyectosTab from './ProyectosTab';
import TableroTab from './TableroTab';
import EvaluacionTab from './EvaluacionTab';
import ConsultasTab from './ConsultasTab';

const TABS = [
  { key: 'partidas', label: 'Partidas' },
  { key: 'modificaciones', label: 'Modificaciones' },
  { key: 'recursos', label: 'Recursos' },
  { key: 'mapeoTributo', label: 'Mapeo Tributo-Recurso' },
  { key: 'cuotas', label: 'Cuotas' },
  { key: 'rrhh', label: 'RRHH' },
  { key: 'metas', label: 'Metas' },
  { key: 'proyectos', label: 'Proyectos' },
  { key: 'tablero', label: 'Tablero' },
  { key: 'evaluacion', label: 'Evaluación' },
  { key: 'consultas', label: 'Consultas' },
  { key: 'ejercicios', label: 'Ejercicios' },
  { key: 'jurisdicciones', label: 'Jurisdicciones' },
  { key: 'estructuras', label: 'Estructuras Prog.' },
  { key: 'objetosGasto', label: 'Objetos del Gasto' },
  { key: 'fuentes', label: 'Fuentes' },
  { key: 'rubros', label: 'Rubros' },
  { key: 'cargos', label: 'Cargos' },
];

const GRUPOS = [
  { label: 'Ejercicio', keys: ['partidas', 'modificaciones', 'recursos', 'mapeoTributo', 'cuotas', 'rrhh', 'metas', 'proyectos', 'tablero', 'evaluacion', 'consultas', 'ejercicios'] },
  { label: 'Nomencladores', keys: ['jurisdicciones', 'estructuras', 'objetosGasto', 'fuentes', 'rubros', 'cargos'] },
];

export default function Presupuesto() {
  const [tab, setTab] = useTabParam('partidas');
  return (
    <div>
      <PageHeader title="Presupuesto" subtitle="Formulación, modificaciones y ejecución del presupuesto municipal" />
      <GroupedTabBar grupos={GRUPOS} tabsMeta={TABS} tab={tab} setTab={setTab} />
      {tab === 'partidas' && <PartidasTab />}
      {tab === 'modificaciones' && <ModificacionesTab />}
      {tab === 'recursos' && <RecursosTab />}
      {tab === 'mapeoTributo' && <MapeoTributoTab />}
      {tab === 'cuotas' && <CuotasTab />}
      {tab === 'rrhh' && <RRHHTab />}
      {tab === 'metas' && <MetasTab />}
      {tab === 'proyectos' && <ProyectosTab />}
      {tab === 'tablero' && <TableroTab />}
      {tab === 'evaluacion' && <EvaluacionTab />}
      {tab === 'consultas' && <ConsultasTab />}
      {tab === 'ejercicios' && <EjerciciosTab />}
      {tab === 'jurisdicciones' && (
        <NomencladorTab
          queryKey="presu-jurisdicciones" apiFns={presupuestoAPI.jurisdicciones} entityName="Jurisdicción"
          columns={[
            { key: 'codigo', label: 'Código' }, { key: 'nombre', label: 'Nombre' },
            { key: 'nivel', label: 'Nivel' }, { key: 'tipo', label: 'Tipo' },
            { key: 'activo', label: 'Estado', render: (v) => (v ? 'Activa' : 'Baja') },
          ]}
          formFields={[
            { key: 'codigo', label: 'Código (jerárquico, ej: 1.1.1)', required: true },
            { key: 'nombre', label: 'Nombre', required: true },
            { key: 'tipo', label: 'Tipo (A/U)' },
            { key: 'activo', label: 'Activo', type: 'boolean', defaultValue: true },
          ]}
          extraHeader={<ImportarJurisdicciones />}
        />
      )}
      {tab === 'estructuras' && (
        <CrudTab
          queryKey="presu-estructuras" apiFns={presupuestoAPI.estructuras} entityName="Estructura" wide
          columns={[
            { key: 'codigo', label: 'Código' }, { key: 'nombre', label: 'Nombre' },
            { key: 'id_jurisdiccion', label: 'Jurisdicción' },
            { key: 'tipo_programa', label: 'Tipo' },
            { key: 'activo', label: 'Estado', render: (v) => (v ? 'Activa' : 'Baja') },
          ]}
          formFields={[
            { key: 'codigo', label: 'Código (ej: 01)', required: true },
            { key: 'nombre', label: 'Nombre del programa', required: true },
            { key: 'id_jurisdiccion', label: 'Jurisdicción (vacío = todo el municipio)', type: 'remote_select', queryKey: 'sel-presu-juri', queryFn: () => presupuestoAPI.jurisdicciones.list({ limit: 200 }).then((r) => r.data), optionValue: 'id', optionLabel: 'nombre' },
            { key: 'tipo_programa', label: 'Tipo de programa' },
            { key: 'descripcion', label: 'Descripción', type: 'textarea' },
            { key: 'activo', label: 'Activo', type: 'boolean', defaultValue: true },
          ]}
        />
      )}
      {tab === 'objetosGasto' && (
        <NomencladorTab
          queryKey="presu-objetos" apiFns={presupuestoAPI.objetosGasto} entityName="Objeto del Gasto"
          columns={[
            { key: 'codigo', label: 'Código' }, { key: 'nombre', label: 'Nombre' },
            { key: 'nivel', label: 'Nivel' },
            { key: 'activo', label: 'Estado', render: (v) => (v ? 'Activo' : 'Baja') },
          ]}
          formFields={[
            { key: 'codigo', label: 'Código (inciso.principal.parcial, ej: 1.1.1)', required: true },
            { key: 'nombre', label: 'Nombre', required: true },
            { key: 'detalle', label: 'Detalle', type: 'textarea' },
            { key: 'activo', label: 'Activo', type: 'boolean', defaultValue: true },
          ]}
        />
      )}
      {tab === 'fuentes' && (
        <NomencladorTab
          queryKey="presu-fuentes" apiFns={presupuestoAPI.fuentes} entityName="Fuente"
          columns={[
            { key: 'codigo', label: 'Código' }, { key: 'nombre', label: 'Nombre' },
            { key: 'origen', label: 'Origen' },
            { key: 'activo', label: 'Estado', render: (v) => (v ? 'Activa' : 'Baja') },
          ]}
          formFields={[
            { key: 'codigo', label: 'Código (ej: 1.1.0)', required: true },
            { key: 'nombre', label: 'Nombre', required: true },
            { key: 'origen', label: 'Origen', type: 'select', options: [
              { value: 'municipal', label: 'Municipal' }, { value: 'provincial', label: 'Provincial' },
              { value: 'nacional', label: 'Nacional' }, { value: 'afectado', label: 'Afectado' },
            ] },
            { key: 'activo', label: 'Activo', type: 'boolean', defaultValue: true },
          ]}
        />
      )}
      {tab === 'cargos' && (
        <CrudTab
          queryKey="presu-cargos" apiFns={presupuestoAPI.cargos} entityName="Cargo"
          columns={[
            { key: 'codigo', label: 'Código' }, { key: 'nombre', label: 'Nombre' },
            { key: 'categoria', label: 'Categoría' },
            { key: 'activo', label: 'Estado', render: (v) => (v ? 'Activo' : 'Baja') },
          ]}
          formFields={[
            { key: 'codigo', label: 'Código', required: true },
            { key: 'nombre', label: 'Nombre del cargo', required: true },
            { key: 'categoria', label: 'Categoría' },
            { key: 'activo', label: 'Activo', type: 'boolean', defaultValue: true },
          ]}
        />
      )}
      {tab === 'rubros' && (
        <NomencladorTab
          queryKey="presu-rubros" apiFns={presupuestoAPI.rubros} entityName="Rubro"
          columns={[
            { key: 'codigo', label: 'Código' }, { key: 'nombre', label: 'Nombre' },
            { key: 'nivel', label: 'Nivel' }, { key: 'caracter_economico', label: 'Car. económico' },
            { key: 'activo', label: 'Estado', render: (v) => (v ? 'Activo' : 'Baja') },
          ]}
          formFields={[
            { key: 'codigo', label: 'Código (ej: 1.1.4.02)', required: true },
            { key: 'nombre', label: 'Nombre', required: true },
            { key: 'caracter_economico', label: 'Carácter económico' },
            { key: 'activo', label: 'Activo', type: 'boolean', defaultValue: true },
          ]}
        />
      )}
    </div>
  );
}

// ── Nomenclador con toggle tabla/árbol ───────────────────────────────
function NomencladorTab({ queryKey, apiFns, entityName, columns, formFields, extraHeader }) {
  const [vista, setVista] = useState('tabla');
  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <button onClick={() => setVista('tabla')} className={`px-3 py-1 rounded text-xs font-medium ${vista === 'tabla' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600'}`}>Tabla</button>
        <button onClick={() => setVista('arbol')} className={`px-3 py-1 rounded text-xs font-medium ${vista === 'arbol' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600'}`}>Árbol</button>
        {extraHeader}
      </div>
      {vista === 'tabla'
        ? <CrudTab queryKey={queryKey} apiFns={apiFns} entityName={entityName} columns={columns} formFields={formFields} />
        : <ArbolView queryKey={queryKey} apiFns={apiFns} />}
    </div>
  );
}

function NodoArbol({ nodo, nivel }) {
  const [abierto, setAbierto] = useState(nivel < 2);
  const tieneHijos = nodo.hijos?.length > 0;
  return (
    <div style={{ marginLeft: nivel * 16 }}>
      <div className="flex items-center gap-2 py-1">
        {tieneHijos ? (
          <button onClick={() => setAbierto(!abierto)} className="w-5 h-5 rounded bg-gray-100 text-gray-600 text-xs leading-none">{abierto ? '−' : '+'}</button>
        ) : <span className="w-5 h-5 inline-block" />}
        <span className="font-mono text-xs text-gray-500 w-28">{nodo.codigo}</span>
        <span className="text-sm text-gray-800">{nodo.nombre}</span>
      </div>
      {abierto && nodo.hijos?.map((h) => <NodoArbol key={h.id} nodo={h} nivel={nivel + 1} />)}
    </div>
  );
}

function ArbolView({ queryKey, apiFns }) {
  const { data, isLoading } = useQuery({
    queryKey: [queryKey, 'arbol'],
    queryFn: () => apiFns.arbol().then((r) => r.data),
  });
  if (isLoading) return <LoadingSpinner />;
  if (!data?.length) return <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">Sin datos.</div>;
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      {data.map((n) => <NodoArbol key={n.id} nodo={n} nivel={0} />)}
    </div>
  );
}

function ImportarJurisdicciones() {
  const qc = useQueryClient();
  const [msg, setMsg] = useState('');
  const imp = useMutation({
    mutationFn: () => presupuestoAPI.jurisdicciones.importar(),
    onSuccess: (r) => { setMsg(`Importadas ${r.data.importadas} (ya existían ${r.data.ya_existian})`); qc.invalidateQueries({ queryKey: ['presu-jurisdicciones'] }); },
    onError: (e) => setMsg(e.response?.data?.detail || 'Error al importar'),
  });
  return (
    <span className="ml-auto flex items-center gap-2">
      {msg && <span className="text-xs text-gray-500">{msg}</span>}
      <button className={btnSecondary} onClick={() => imp.mutate()} disabled={imp.isPending}>
        {imp.isPending ? 'Importando...' : 'Importar de Administración'}
      </button>
    </span>
  );
}

// ── Ejercicios (workflow) ────────────────────────────────────────────
const ESTADO_EJ = {
  formulacion: { t: 'En formulación', c: 'bg-amber-100 text-amber-700' },
  aprobado: { t: 'Aprobado', c: 'bg-blue-100 text-blue-700' },
  vigente: { t: 'Vigente', c: 'bg-green-100 text-green-700' },
  cerrado: { t: 'Cerrado', c: 'bg-gray-200 text-gray-600' },
};
const ACCIONES = {
  formulacion: [{ t: 'aprobar', label: 'Aprobar', pideActo: true }],
  aprobado: [{ t: 'vigencia', label: 'Poner en vigencia' }],
  vigente: [{ t: 'cerrar', label: 'Cerrar' }, { t: 'prorrogar', label: 'Prorrogar →', esProrroga: true }],
  cerrado: [{ t: 'reabrir', label: 'Reabrir' }, { t: 'prorrogar', label: 'Prorrogar →', esProrroga: true }],
};

function EjerciciosTab() {
  const qc = useQueryClient();
  const [modal, setModal] = useState(null); // 'nuevo' | {accion, ejercicio}
  const [error, setError] = useState('');
  const { data, isLoading } = useQuery({
    queryKey: ['presu-ejercicios'],
    queryFn: () => presupuestoAPI.ejercicios.list({ limit: 50 }).then((r) => r.data),
  });

  const refetch = () => qc.invalidateQueries({ queryKey: ['presu-ejercicios'] });

  if (isLoading) return <LoadingSpinner />;
  return (
    <div>
      {error && (
        <div className="mb-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2 flex items-center justify-between">
          <span>⚠ {error}</span>
          <button onClick={() => setError('')} className="text-red-500">✕</button>
        </div>
      )}
      <div className="mb-3 flex justify-end">
        <button className={btnPrimary} onClick={() => setModal('nuevo')}>Nuevo ejercicio</button>
      </div>
      <div className="space-y-2">
        {data?.length ? data.map((e) => (
          <div key={e.id} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <span className="text-xl font-bold text-gray-800">{e.anio}</span>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${ESTADO_EJ[e.estado]?.c || 'bg-gray-100'}`}>{ESTADO_EJ[e.estado]?.t || e.estado}</span>
                <span className="text-xs text-gray-400">sobregiro: {e.control_sobregiro}</span>
                {e.acto_administrativo && <span className="text-xs text-gray-500">· {e.acto_administrativo}</span>}
              </div>
              <div className="flex gap-2">
                {(ACCIONES[e.estado] || []).map((a) => (
                  <button key={a.t} className={btnSecondary} onClick={() => setModal({ accion: a, ejercicio: e })}>{a.label}</button>
                ))}
              </div>
            </div>
            {e.historial?.length > 0 && (
              <div className="mt-2 text-[11px] text-gray-400">
                {e.historial.slice(-3).map((h, i) => (
                  <span key={i} className="mr-3">{h.accion} · {h.usuario_nombre || h.usuario} · {h.fecha ? new Date(h.fecha).toLocaleString() : ''}</span>
                ))}
              </div>
            )}
          </div>
        )) : <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">Sin ejercicios. Creá el primero.</div>}
      </div>

      {modal === 'nuevo' && <NuevoEjercicioModal onClose={() => setModal(null)} onDone={() => { setModal(null); refetch(); }} onError={setError} />}
      {modal?.accion && (
        <TransicionModal modal={modal} onClose={() => setModal(null)}
          onDone={() => { setModal(null); setError(''); refetch(); }} onError={(m) => { setError(m); setModal(null); }} />
      )}
    </div>
  );
}

function NuevoEjercicioModal({ onClose, onDone, onError }) {
  const [anio, setAnio] = useState(String(new Date().getFullYear() + 1));
  const [sobregiro, setSobregiro] = useState('bloquear');
  const m = useMutation({
    mutationFn: () => presupuestoAPI.ejercicios.create({ anio: Number(anio), control_sobregiro: sobregiro }),
    onSuccess: onDone,
    onError: (e) => onError(e.response?.data?.detail || 'Error al crear el ejercicio'),
  });
  return (
    <Modal title="Nuevo ejercicio" onClose={onClose}>
      <div className="space-y-4">
        <Field label="Año"><input type="number" className={inputClass} value={anio} onChange={(e) => setAnio(e.target.value)} /></Field>
        <Field label="Control de sobregiro">
          <select className={inputClass} value={sobregiro} onChange={(e) => setSobregiro(e.target.value)}>
            <option value="bloquear">Bloquear (recomendado — no permite sobregiro)</option>
            <option value="advertir">Advertir (permite y registra)</option>
          </select>
        </Field>
        <button className={`${btnPrimary} w-full`} onClick={() => m.mutate()} disabled={m.isPending}>
          {m.isPending ? 'Creando...' : 'Crear en formulación'}
        </button>
      </div>
    </Modal>
  );
}

function TransicionModal({ modal, onClose, onDone, onError }) {
  const { accion, ejercicio } = modal;
  const [acto, setActo] = useState('');
  const [obs, setObs] = useState('');
  const [origenCredito, setOrigenCredito] = useState('inicial');
  const [anioDestino, setAnioDestino] = useState(String(ejercicio.anio + 1));
  const m = useMutation({
    mutationFn: () => accion.esProrroga
      ? presupuestoAPI.ejercicios.prorrogar(ejercicio.anio, { origen_credito: origenCredito, anio_destino: Number(anioDestino) })
      : presupuestoAPI.ejercicios.transicionar(ejercicio.anio, accion.t, {
      ...(accion.pideActo ? { acto_administrativo: acto } : {}),
      ...(obs ? { observaciones: obs } : {}),
    }),
    onSuccess: onDone,
    onError: (e) => onError(e.response?.data?.detail || `Error al ${accion.label.toLowerCase()}`),
  });
  return (
    <Modal title={`${accion.label} — Ejercicio ${ejercicio.anio}`} onClose={onClose}>
      <div className="space-y-4">
        {accion.pideActo && (
          <Field label="Acto administrativo (decreto / ordenanza) — obligatorio">
            <input className={inputClass} value={acto} onChange={(e) => setActo(e.target.value)} placeholder="ej: Ordenanza 1234/26" />
          </Field>
        )}
        {accion.esProrroga && (
          <>
            <Field label="Año destino">
              <input type="number" className={inputClass} value={anioDestino} onChange={(e) => setAnioDestino(e.target.value)} />
            </Field>
            <Field label="Crédito inicial del año nuevo (decisión configurable)">
              <select className={inputClass} value={origenCredito} onChange={(e) => setOrigenCredito(e.target.value)}>
                <option value="inicial">Inicial del año origen</option>
                <option value="vigente">Vigente del año origen (con modificaciones)</option>
              </select>
            </Field>
          </>
        )}
        <Field label="Observaciones">
          <input className={inputClass} value={obs} onChange={(e) => setObs(e.target.value)} placeholder="Opcional" />
        </Field>
        <button className={`${btnPrimary} w-full`} onClick={() => m.mutate()} disabled={m.isPending || (accion.pideActo && !acto.trim())}>
          {m.isPending ? 'Procesando...' : `Confirmar: ${accion.label}`}
        </button>
      </div>
    </Modal>
  );
}
