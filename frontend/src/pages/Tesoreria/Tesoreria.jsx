import { useState, useEffect } from 'react';
import { useTabParam } from '../../hooks/useTabParam';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tesoreriaAPI } from '../../services/api';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { CrudTab, Modal, Field, CrudFormModal, inputClass, btnPrimary, btnDanger, btnSecondary } from '../../components/common/CrudComponents';

// ── Helpers ─────────────────────────────────────────────────────────
const listaQuery = (tipo) => () => tesoreriaAPI.listas.list({ tipo }).then((r) => r.data);
const allQuery = (apiFn) => () => apiFn.list({ skip: 0, limit: 100 }).then((r) => r.data);
const fmtMoney = (v) => `$${Number(v || 0).toFixed(2)}`;
const fmtDate = (v) => v ? new Date(v).toLocaleDateString() : '';

// ═══════════════════════════════════════════════════════════════════════
// COMPONENTE LOTE + DETALLE (patrón maestro-detalle)
// ═══════════════════════════════════════════════════════════════════════

const PAGE_SIZE = 10;
const btnPage = 'px-3 py-1.5 rounded text-xs font-medium transition-colors';
const btnPageDisabled = `${btnPage} bg-gray-100 text-gray-400 cursor-not-allowed`;
const btnPageEnabled = `${btnPage} bg-white text-gray-600 hover:bg-gray-50 border border-gray-200`;

function Pagination({ page, setPage, dataLength }) {
  const isFirst = page === 0;
  const isLast = !dataLength || dataLength < PAGE_SIZE;
  return (
    <div className="flex items-center justify-between mt-3">
      <button disabled={isFirst} onClick={() => setPage((p) => p - 1)} className={isFirst ? btnPageDisabled : btnPageEnabled}>Anterior</button>
      <span className="text-xs text-gray-500">Pagina {page + 1}</span>
      <button disabled={isLast} onClick={() => setPage((p) => p + 1)} className={isLast ? btnPageDisabled : btnPageEnabled}>Siguiente</button>
    </div>
  );
}

function FilterRow({ columns, filterInputs, setFilterInputs }) {
  const visibleCols = columns.filter((c) => c.key !== '_actions');
  return (
    <div className="bg-white rounded-t-lg border border-b-0 border-gray-200 px-2 py-2">
      <div className="flex gap-1">
        {visibleCols.map((col) => (
          <input key={col.key} placeholder={col.label} value={filterInputs[col.key] || ''}
            onChange={(e) => setFilterInputs((prev) => ({ ...prev, [col.key]: e.target.value }))}
            className="flex-1 min-w-0 border border-gray-200 rounded px-2 py-1 text-xs placeholder:text-gray-400 focus:ring-1 focus:ring-primary-400 focus:border-primary-400" />
        ))}
        <div className="w-[160px] shrink-0" />
      </div>
    </div>
  );
}

function LoteTab({ queryKey, apiFns, detailApiFns, entityName, detailName, loteColumns, loteFormFields, detailColumns, detailFormFields, wide }) {
  const [modal, setModal] = useState(null);
  const [detailLote, setDetailLote] = useState(null);
  const [page, setPage] = useState(0);
  const [filterInputs, setFilterInputs] = useState({});
  const [filters, setFilters] = useState({});
  const queryClient = useQueryClient();

  useEffect(() => {
    const t = setTimeout(() => {
      const clean = {};
      Object.entries(filterInputs).forEach(([k, v]) => { if (v) clean[k] = v; });
      setFilters(clean);
      setPage(0);
    }, 400);
    return () => clearTimeout(t);
  }, [filterInputs]);

  const { data, isLoading } = useQuery({
    queryKey: [queryKey, page, filters],
    queryFn: () => apiFns.list({ skip: page * PAGE_SIZE, limit: PAGE_SIZE, ...filters }).then((r) => r.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => apiFns.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [queryKey] }),
  });

  const allColumns = [
    ...loteColumns,
    {
      key: '_actions',
      label: 'Acciones',
      render: (_, row) => (
        <div className="flex gap-2">
          <button className="bg-primary-100 hover:bg-primary-200 text-primary-700 px-3 py-1.5 rounded text-xs font-medium" onClick={() => setDetailLote(row)}>Detalle</button>
          <button className={btnSecondary} onClick={() => setModal({ mode: 'edit', item: row })}>Editar</button>
          <button className={btnDanger} onClick={() => { if (confirm(`Eliminar ${entityName}?`)) deleteMutation.mutate(row.id); }}>Eliminar</button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="mb-3 flex justify-end">
        <button className={btnPrimary} onClick={() => setModal('create')}>Nuevo {entityName}</button>
      </div>
      <FilterRow columns={allColumns} filterInputs={filterInputs} setFilterInputs={setFilterInputs} />
      {isLoading ? <LoadingSpinner /> : <DataTable columns={allColumns} data={data} />}
      <Pagination page={page} setPage={setPage} dataLength={data?.length} />
      {(modal === 'create' || modal?.mode === 'edit') && (
        <CrudFormModal
          title={modal === 'create' ? `Nuevo ${entityName}` : `Editar ${entityName}`}
          item={modal?.item}
          formFields={loteFormFields}
          apiFns={apiFns}
          queryKey={queryKey}
          onClose={() => setModal(null)}
          wide={wide}
        />
      )}
      {detailLote && (
        <DetailModal
          lote={detailLote}
          detailApiFns={detailApiFns}
          detailName={detailName}
          entityName={entityName}
          detailColumns={detailColumns}
          detailFormFields={detailFormFields}
          parentQueryKey={queryKey}
          onClose={() => setDetailLote(null)}
        />
      )}
    </>
  );
}

function DetailModal({ lote, detailApiFns, detailName, entityName, detailColumns, detailFormFields, parentQueryKey, onClose }) {
  const [modal, setModal] = useState(null);
  const [page, setPage] = useState(0);
  const queryClient = useQueryClient();
  const detailQueryKey = `${parentQueryKey}-detail-${lote.id}`;

  const { data, isLoading } = useQuery({
    queryKey: [detailQueryKey, page],
    queryFn: () => detailApiFns.list(lote.id, { skip: page * PAGE_SIZE, limit: PAGE_SIZE }).then((r) => r.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => detailApiFns.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [detailQueryKey] });
      queryClient.invalidateQueries({ queryKey: [parentQueryKey] });
    },
  });

  const allColumns = [
    ...detailColumns,
    {
      key: '_actions',
      label: 'Acciones',
      render: (_, row) => (
        <div className="flex gap-2">
          <button className={btnSecondary} onClick={() => setModal({ mode: 'edit', item: row })}>Editar</button>
          <button className={btnDanger} onClick={() => { if (confirm(`Eliminar ${detailName}?`)) deleteMutation.mutate(row.id); }}>Eliminar</button>
        </div>
      ),
    },
  ];

  // Wrapper para que CrudFormModal funcione con la API nested
  const detailApiFnsWrapped = {
    create: (d) => detailApiFns.create(lote.id, d),
    update: (id, d) => detailApiFns.update(id, d),
    delete: (id) => detailApiFns.delete(id),
  };

  return (
    <Modal title={`${entityName} #${lote.id} - ${detailName}`} onClose={onClose} wide>
      <div className="mb-3 flex justify-end">
        <button className={btnPrimary} onClick={() => setModal('create')}>Nuevo {detailName}</button>
      </div>
      {isLoading ? <LoadingSpinner /> : <DataTable columns={allColumns} data={data} />}
      <Pagination page={page} setPage={setPage} dataLength={data?.length} />
      {(modal === 'create' || modal?.mode === 'edit') && (
        <CrudFormModal
          title={modal === 'create' ? `Nuevo ${detailName}` : `Editar ${detailName}`}
          item={modal?.item}
          formFields={detailFormFields}
          apiFns={detailApiFnsWrapped}
          queryKey={detailQueryKey}
          onClose={() => setModal(null)}
          wide
        />
      )}
    </Modal>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// TABS
// ═══════════════════════════════════════════════════════════════════════

const TABS = [
  { key: 'cajas', label: 'Cajas' },
  { key: 'dependencias', label: 'Dependencias' },
  { key: 'recaudadoras', label: 'Recaudadoras' },
  { key: 'recaudacionLotes', label: 'Recaudacion' },
  { key: 'reciboPubLotes', label: 'Recibos Pub.' },
  { key: 'pagoRendLotes', label: 'Pagos Rend.' },
  { key: 'regContLotes', label: 'Reg. Contables' },
  { key: 'entidades', label: 'Entidades' },
  { key: 'listas', label: 'Listas' },
];

export default function Tesoreria() {
  const [tab, setTab] = useTabParam('cajas');
  return (
    <div>
      <PageHeader title="Tesoreria" subtitle="Cajas, recaudacion, recibos, pagos y registros contables" />
      <div className="flex gap-1.5 mb-4 overflow-x-auto pb-2 -mx-1 px-1">
        {TABS.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${tab === t.key ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
          >{t.label}</button>
        ))}
      </div>
      {tab === 'cajas' && <CajasTab />}
      {tab === 'dependencias' && <DependenciasTab />}
      {tab === 'recaudadoras' && <RecaudadorasTab />}
      {tab === 'recaudacionLotes' && <RecaudacionLotesTab />}
      {tab === 'reciboPubLotes' && <ReciboPublicacionLotesTab />}
      {tab === 'pagoRendLotes' && <PagoRendicionLotesTab />}
      {tab === 'regContLotes' && <RegistroContableLotesTab />}
      {tab === 'entidades' && <EntidadesTab />}
      {tab === 'listas' && <ListasTab />}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// CAJAS (con asignaciones como detalle)
// ═══════════════════════════════════════════════════════════════════════
function CajasTab() {
  return <LoteTab
    queryKey="tes-cajas" apiFns={tesoreriaAPI.cajas} detailApiFns={tesoreriaAPI.cajaAsignaciones}
    entityName="Caja" detailName="Asignacion" wide
    loteColumns={[
      { key: 'id', label: 'ID' }, { key: 'codigo', label: 'Codigo' }, { key: 'nombre', label: 'Nombre' },
      { key: 'id_dependencia', label: 'Dependencia' }, { key: 'id_estado_caja', label: 'Estado' },
    ]}
    loteFormFields={[
      { key: 'codigo', label: 'Codigo', required: true }, { key: 'nombre', label: 'Nombre', required: true },
      { key: 'id_dependencia', label: 'Dependencia', type: 'remote_select', queryKey: 'sel-tes-dependencias', queryFn: allQuery(tesoreriaAPI.dependencias) },
      { key: 'id_estado_caja', label: 'Estado Caja', type: 'remote_select', queryKey: 'sel-tes-estado_caja', queryFn: listaQuery('estado_caja') },
      { key: 'id_usuario', label: 'Usuario (ID)', type: 'int' },
    ]}
    detailColumns={[
      { key: 'id', label: 'ID' }, { key: 'fecha_apertura', label: 'Apertura', render: fmtDate },
      { key: 'fecha_cierre', label: 'Cierre', render: fmtDate },
      { key: 'importe_saldo', label: 'Saldo', render: fmtMoney },
      { key: 'id_estado_asignacion', label: 'Estado' },
    ]}
    detailFormFields={[
      { key: 'id_usuario', label: 'Usuario (ID)', type: 'int' },
      { key: 'id_estado_asignacion', label: 'Estado', type: 'remote_select', queryKey: 'sel-tes-estado_asignacion', queryFn: listaQuery('estado_asignacion') },
      { key: 'importe_saldo', label: 'Saldo', type: 'decimal', defaultValue: 0 },
    ]}
  />;
}

// ═══════════════════════════════════════════════════════════════════════
// DEPENDENCIAS
// ═══════════════════════════════════════════════════════════════════════
function DependenciasTab() {
  return <CrudTab queryKey="tes-dependencias" apiFns={tesoreriaAPI.dependencias} entityName="Dependencia"
    columns={[ { key: 'id', label: 'ID' }, { key: 'codigo', label: 'Codigo' }, { key: 'nombre', label: 'Nombre' }, { key: 'orden', label: 'Orden' } ]}
    formFields={[ { key: 'codigo', label: 'Codigo', required: true }, { key: 'nombre', label: 'Nombre', required: true }, { key: 'orden', label: 'Orden', type: 'int', defaultValue: 0 } ]}
  />;
}

// ═══════════════════════════════════════════════════════════════════════
// RECAUDADORAS
// ═══════════════════════════════════════════════════════════════════════
function RecaudadorasTab() {
  return <CrudTab queryKey="tes-recaudadoras" apiFns={tesoreriaAPI.recaudadoras} entityName="Recaudadora" wide
    columns={[
      { key: 'id', label: 'ID' }, { key: 'codigo', label: 'Codigo' }, { key: 'nombre', label: 'Nombre' },
      { key: 'codigo_cliente', label: 'Cod. Cliente' }, { key: 'lugar_pago', label: 'Lugar Pago' },
    ]}
    formFields={[
      { key: 'codigo', label: 'Codigo', required: true }, { key: 'nombre', label: 'Nombre', required: true },
      { key: 'codigo_cliente', label: 'Codigo Cliente' }, { key: 'lugar_pago', label: 'Lugar Pago' },
      { key: 'metodo_importacion', label: 'Metodo Importacion' },
    ]}
  />;
}

// ═══════════════════════════════════════════════════════════════════════
// RECAUDACIÓN LOTES + RECAUDACIONES
// ═══════════════════════════════════════════════════════════════════════
function RecaudacionLotesTab() {
  return <LoteTab
    queryKey="tes-recaudacion-lotes" apiFns={tesoreriaAPI.recaudacionLotes} detailApiFns={tesoreriaAPI.recaudaciones}
    entityName="Lote Recaudacion" detailName="Recaudacion" wide
    loteColumns={[
      { key: 'id', label: 'ID' }, { key: 'numero_lote', label: 'Nro Lote' },
      { key: 'fecha_lote', label: 'Fecha', render: fmtDate }, { key: 'casos', label: 'Casos' },
      { key: 'importe_total', label: 'Total', render: fmtMoney },
      { key: 'id_estado_lote', label: 'Estado' },
    ]}
    loteFormFields={[
      { key: 'numero_lote', label: 'Numero Lote', type: 'int' },
      { key: 'id_recaudadora', label: 'Recaudadora', type: 'remote_select', queryKey: 'sel-tes-recaudadoras', queryFn: allQuery(tesoreriaAPI.recaudadoras) },
      { key: 'id_estado_lote', label: 'Estado Lote', type: 'remote_select', queryKey: 'sel-tes-estado_lote', queryFn: listaQuery('estado_lote') },
      { key: 'casos', label: 'Casos', type: 'int', defaultValue: 0 },
      { key: 'importe_total', label: 'Importe Total', type: 'decimal', defaultValue: 0 },
      { key: 'importe_neto', label: 'Importe Neto', type: 'decimal', defaultValue: 0 },
      { key: 'nombre_archivo', label: 'Nombre Archivo' },
    ]}
    detailColumns={[
      { key: 'id', label: 'ID' }, { key: 'numero_control', label: 'Control' },
      { key: 'numero_recibo', label: 'Recibo' }, { key: 'importe_cobro', label: 'Cobro', render: fmtMoney },
      { key: 'fecha_cobro', label: 'Fecha Cobro', render: fmtDate },
    ]}
    detailFormFields={[
      { key: 'numero_control', label: 'Numero Control' }, { key: 'numero_recibo', label: 'Numero Recibo' },
      { key: 'importe_cobro', label: 'Importe Cobro', type: 'decimal', defaultValue: 0 },
      { key: 'importe_comision', label: 'Comision', type: 'decimal', defaultValue: 0 },
      { key: 'codigo_barras', label: 'Codigo Barras' },
      { key: 'fecha_cobro', label: 'Fecha Cobro', type: 'date' },
      { key: 'fecha_acreditacion', label: 'Fecha Acreditacion', type: 'date' },
    ]}
  />;
}

// ═══════════════════════════════════════════════════════════════════════
// RECIBO PUBLICACIÓN LOTES + PUBLICACIONES
// ═══════════════════════════════════════════════════════════════════════
function ReciboPublicacionLotesTab() {
  return <LoteTab
    queryKey="tes-recibo-pub-lotes" apiFns={tesoreriaAPI.reciboPublicacionLotes} detailApiFns={tesoreriaAPI.reciboPublicaciones}
    entityName="Lote Recibos" detailName="Recibo" wide
    loteColumns={[
      { key: 'id', label: 'ID' }, { key: 'numero_lote', label: 'Nro Lote' },
      { key: 'fecha_lote', label: 'Fecha', render: fmtDate }, { key: 'casos', label: 'Casos' },
      { key: 'importe_total_1', label: 'Total 1er Vto', render: fmtMoney },
      { key: 'importe_total_2', label: 'Total 2do Vto', render: fmtMoney },
    ]}
    loteFormFields={[
      { key: 'numero_lote', label: 'Numero Lote', type: 'int' },
      { key: 'id_estado_lote', label: 'Estado Lote', type: 'remote_select', queryKey: 'sel-tes-estado_lote', queryFn: listaQuery('estado_lote') },
      { key: 'casos', label: 'Casos', type: 'int', defaultValue: 0 },
      { key: 'importe_total_1', label: 'Total 1er Vto', type: 'decimal', defaultValue: 0 },
      { key: 'importe_total_2', label: 'Total 2do Vto', type: 'decimal', defaultValue: 0 },
    ]}
    detailColumns={[
      { key: 'id', label: 'ID' }, { key: 'numero_recibo', label: 'Recibo' },
      { key: 'cuota', label: 'Cuota' }, { key: 'ejercicio', label: 'Ejercicio' },
      { key: 'importe_1', label: '1er Vto', render: fmtMoney },
      { key: 'importe_2', label: '2do Vto', render: fmtMoney },
    ]}
    detailFormFields={[
      { key: 'numero_recibo', label: 'Numero Recibo' },
      { key: 'ejercicio', label: 'Ejercicio', type: 'int' }, { key: 'periodo', label: 'Periodo', type: 'int' },
      { key: 'cuota', label: 'Cuota', type: 'int' },
      { key: 'fecha_vencimiento_1', label: '1er Vencimiento', type: 'date' },
      { key: 'importe_1', label: 'Importe 1er Vto', type: 'decimal', defaultValue: 0 },
      { key: 'fecha_vencimiento_2', label: '2do Vencimiento', type: 'date' },
      { key: 'importe_2', label: 'Importe 2do Vto', type: 'decimal', defaultValue: 0 },
      { key: 'codigo_barras', label: 'Codigo Barras' },
    ]}
  />;
}

// ═══════════════════════════════════════════════════════════════════════
// PAGO RENDICIÓN LOTES + RENDICIONES
// ═══════════════════════════════════════════════════════════════════════
function PagoRendicionLotesTab() {
  return <LoteTab
    queryKey="tes-pago-rend-lotes" apiFns={tesoreriaAPI.pagoRendicionLotes} detailApiFns={tesoreriaAPI.pagoRendiciones}
    entityName="Lote Pagos" detailName="Pago Rendicion" wide
    loteColumns={[
      { key: 'id', label: 'ID' }, { key: 'numero_lote', label: 'Nro Lote' },
      { key: 'fecha_lote', label: 'Fecha', render: fmtDate }, { key: 'casos', label: 'Casos' },
      { key: 'importe_total', label: 'Total', render: fmtMoney },
      { key: 'id_estado_lote', label: 'Estado' },
    ]}
    loteFormFields={[
      { key: 'numero_lote', label: 'Numero Lote', type: 'int' },
      { key: 'id_estado_lote', label: 'Estado Lote', type: 'remote_select', queryKey: 'sel-tes-estado_lote', queryFn: listaQuery('estado_lote') },
      { key: 'casos', label: 'Casos', type: 'int', defaultValue: 0 },
      { key: 'importe_total', label: 'Importe Total', type: 'decimal', defaultValue: 0 },
    ]}
    detailColumns={[
      { key: 'id', label: 'ID' }, { key: 'numero_pago', label: 'Nro Pago' },
      { key: 'importe_pago', label: 'Importe', render: fmtMoney },
      { key: 'fecha_pago', label: 'Fecha Pago', render: fmtDate },
      { key: 'id_estado_pago', label: 'Estado' },
    ]}
    detailFormFields={[
      { key: 'numero_pago', label: 'Numero Pago' },
      { key: 'importe_pago', label: 'Importe Pago', type: 'decimal', defaultValue: 0 },
      { key: 'fecha_pago', label: 'Fecha Pago', type: 'date' },
      { key: 'id_estado_pago', label: 'Estado Pago', type: 'remote_select', queryKey: 'sel-tes-estado_pago', queryFn: listaQuery('estado_pago') },
    ]}
  />;
}

// ═══════════════════════════════════════════════════════════════════════
// REGISTRO CONTABLE LOTES + REGISTROS
// ═══════════════════════════════════════════════════════════════════════
function RegistroContableLotesTab() {
  return <LoteTab
    queryKey="tes-reg-cont-lotes" apiFns={tesoreriaAPI.registroContableLotes} detailApiFns={tesoreriaAPI.registroContables}
    entityName="Lote Reg. Contable" detailName="Registro Contable" wide
    loteColumns={[
      { key: 'id', label: 'ID' }, { key: 'numero_lote', label: 'Nro Lote' },
      { key: 'fecha_lote', label: 'Fecha', render: fmtDate }, { key: 'casos', label: 'Casos' },
      { key: 'importe_total', label: 'Total', render: fmtMoney },
      { key: 'id_estado_lote', label: 'Estado' },
    ]}
    loteFormFields={[
      { key: 'numero_lote', label: 'Numero Lote', type: 'int' },
      { key: 'id_estado_lote', label: 'Estado Lote', type: 'remote_select', queryKey: 'sel-tes-estado_lote', queryFn: listaQuery('estado_lote') },
      { key: 'casos', label: 'Casos', type: 'int', defaultValue: 0 },
      { key: 'importe_total', label: 'Importe Total', type: 'decimal', defaultValue: 0 },
    ]}
    detailColumns={[
      { key: 'id', label: 'ID' }, { key: 'cuenta_contable', label: 'Cuenta' },
      { key: 'jurisdiccion', label: 'Jurisdiccion' }, { key: 'recurso_por_rubro', label: 'Recurso' },
      { key: 'ejercicio', label: 'Ejercicio' },
      { key: 'importe_debe', label: 'Debe', render: fmtMoney },
      { key: 'importe_haber', label: 'Haber', render: fmtMoney },
    ]}
    detailFormFields={[
      { key: 'cuenta_contable', label: 'Cuenta Contable' }, { key: 'jurisdiccion', label: 'Jurisdiccion' },
      { key: 'recurso_por_rubro', label: 'Recurso por Rubro' }, { key: 'ejercicio', label: 'Ejercicio', type: 'int' },
      { key: 'importe_debe', label: 'Importe Debe', type: 'decimal', defaultValue: 0 },
      { key: 'importe_haber', label: 'Importe Haber', type: 'decimal', defaultValue: 0 },
      { key: 'detalle', label: 'Detalle' },
    ]}
  />;
}

// ═══════════════════════════════════════════════════════════════════════
// ENTIDADES
// ═══════════════════════════════════════════════════════════════════════
function EntidadesTab() {
  return <CrudTab queryKey="tes-entidades" apiFns={tesoreriaAPI.entidades} entityName="Entidad" wide
    columns={[ { key: 'id', label: 'ID' }, { key: 'codigo', label: 'Codigo' }, { key: 'tipo', label: 'Tipo' }, { key: 'nombre', label: 'Nombre' }, { key: 'orden', label: 'Orden' } ]}
    formFields={[ { key: 'codigo', label: 'Codigo', required: true }, { key: 'tipo', label: 'Tipo', required: true }, { key: 'nombre', label: 'Nombre', required: true }, { key: 'orden', label: 'Orden', type: 'int', defaultValue: 0 }, { key: 'dato1', label: 'Dato 1' }, { key: 'dato2', label: 'Dato 2' }, { key: 'dato3', label: 'Dato 3' } ]}
  />;
}

// ═══════════════════════════════════════════════════════════════════════
// LISTAS
// ═══════════════════════════════════════════════════════════════════════
function ListasTab() {
  return <CrudTab queryKey="tes-listas" apiFns={tesoreriaAPI.listas} entityName="Lista"
    columns={[ { key: 'id', label: 'ID' }, { key: 'codigo', label: 'Codigo' }, { key: 'tipo', label: 'Tipo' }, { key: 'nombre', label: 'Nombre' }, { key: 'orden', label: 'Orden' } ]}
    formFields={[ { key: 'codigo', label: 'Codigo', required: true }, { key: 'tipo', label: 'Tipo', required: true }, { key: 'nombre', label: 'Nombre', required: true }, { key: 'orden', label: 'Orden', type: 'int', defaultValue: 0 } ]}
  />;
}
