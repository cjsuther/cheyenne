import { useState } from 'react';
import { useTabParam } from '../../hooks/useTabParam';
import { comunicacionAPI } from '../../services/api';
import PageHeader from '../../components/common/PageHeader';
import { CrudTab } from '../../components/common/CrudComponents';

const listaQuery = (tipo) => () => comunicacionAPI.listas.list({ tipo }).then((r) => r.data);

const TABS = [
  { key: 'mensajes', label: 'Mensajes' },
  { key: 'listas', label: 'Listas' },
];

export default function Comunicacion() {
  const [tab, setTab] = useTabParam('mensajes');
  return (
    <div>
      <PageHeader title="Comunicación" subtitle="Mensajes y notificaciones del sistema" />
      <div className="flex gap-1.5 mb-4 overflow-x-auto pb-2 -mx-1 px-1">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
              tab === t.key ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tab === 'mensajes' && <MensajesTab />}
      {tab === 'listas' && <ListasTab />}
    </div>
  );
}

function MensajesTab() {
  return (
    <CrudTab
      queryKey="com-mensajes"
      apiFns={comunicacionAPI.mensajes}
      entityName="Mensaje"
      wide
      columns={[
        { key: 'id', label: 'ID' },
        { key: 'titulo', label: 'Título' },
        { key: 'identificador', label: 'Identificador' },
        { key: 'id_tipo_mensaje', label: 'Tipo' },
        { key: 'id_canal', label: 'Canal' },
        { key: 'id_prioridad', label: 'Prioridad' },
        { key: 'id_estado_mensaje', label: 'Estado' },
        { key: 'fecha_creacion', label: 'Fecha', render: (v) => (v ? new Date(v).toLocaleString() : '') },
      ]}
      formFields={[
        { key: 'identificador', label: 'Identificador', required: true },
        { key: 'titulo', label: 'Título', required: true },
        { key: 'cuerpo', label: 'Cuerpo', required: true },
        { key: 'id_tipo_mensaje', label: 'Tipo', type: 'remote_select', required: true, queryKey: 'com-tipo', queryFn: listaQuery('tipo_mensaje'), optionValue: 'id', optionLabel: 'nombre' },
        { key: 'id_canal', label: 'Canal', type: 'remote_select', required: true, queryKey: 'com-canal', queryFn: listaQuery('canal'), optionValue: 'id', optionLabel: 'nombre' },
        { key: 'id_prioridad', label: 'Prioridad', type: 'remote_select', required: true, queryKey: 'com-prio', queryFn: listaQuery('prioridad'), optionValue: 'id', optionLabel: 'nombre' },
        { key: 'id_estado_mensaje', label: 'Estado', type: 'remote_select', queryKey: 'com-estado', queryFn: listaQuery('estado_mensaje'), optionValue: 'id', optionLabel: 'nombre' },
      ]}
    />
  );
}

function ListasTab() {
  return (
    <CrudTab
      queryKey="com-listas"
      apiFns={comunicacionAPI.listas}
      entityName="Lista"
      columns={[
        { key: 'id', label: 'ID' },
        { key: 'codigo', label: 'Código' },
        { key: 'tipo', label: 'Tipo' },
        { key: 'nombre', label: 'Nombre' },
        { key: 'orden', label: 'Orden' },
      ]}
      formFields={[
        { key: 'codigo', label: 'Código', required: true },
        { key: 'tipo', label: 'Tipo', required: true },
        { key: 'nombre', label: 'Nombre', required: true },
        { key: 'orden', label: 'Orden', type: 'int', defaultValue: 0 },
      ]}
    />
  );
}
