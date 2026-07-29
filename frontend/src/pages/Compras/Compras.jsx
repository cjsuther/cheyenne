import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { comprasAPI } from '../../services/api';
import { useTabParam } from '../../hooks/useTabParam';
import PageHeader from '../../components/common/PageHeader';
import GroupedTabBar from '../../components/common/GroupedTabBar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { CrudTab, Modal, Field, inputClass, btnPrimary, btnSecondary } from '../../components/common/CrudComponents';

const fmt = (v) => new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(v || 0));

const TABS = [
  { key: 'pedidos', label: 'Pedidos de Área' },
  { key: 'oc', label: 'Órdenes de Compra' },
  { key: 'stock', label: 'Stock' },
  { key: 'proveedores', label: 'Proveedores' },
  { key: 'articulos', label: 'Artículos' },
];
const GRUPOS = [
  { label: 'Circuito', keys: ['pedidos', 'oc', 'stock'] },
  { label: 'Maestros', keys: ['proveedores', 'articulos'] },
];

export default function Compras() {
  const [tab, setTab] = useTabParam('pedidos');
  return (
    <div>
      <PageHeader title="Compras — Adquisiciones" subtitle="Pedido de área → orden de compra → recepción → stock" />
      <GroupedTabBar grupos={GRUPOS} tabsMeta={TABS} tab={tab} setTab={setTab} />
      {tab === 'pedidos' && <PedidosTab />}
      {tab === 'oc' && <OrdenesCompraTab />}
      {tab === 'stock' && <StockTab />}
      {tab === 'proveedores' && (
        <CrudTab queryKey="comp-prov" apiFns={comprasAPI.proveedores} entityName="Proveedor"
          columns={[{ key: 'codigo', label: 'Código' }, { key: 'nombre', label: 'Nombre' }, { key: 'cuit', label: 'CUIT' }, { key: 'rubro', label: 'Rubro' }, { key: 'activo', label: 'Estado', render: (v) => (v ? 'Activo' : 'Baja') }]}
          formFields={[{ key: 'codigo', label: 'Código', required: true }, { key: 'nombre', label: 'Nombre', required: true }, { key: 'cuit', label: 'CUIT' }, { key: 'rubro', label: 'Rubro' }, { key: 'activo', label: 'Activo', type: 'boolean', defaultValue: true }]} />
      )}
      {tab === 'articulos' && (
        <CrudTab queryKey="comp-art" apiFns={comprasAPI.articulos} entityName="Artículo"
          columns={[{ key: 'codigo', label: 'Código' }, { key: 'nombre', label: 'Nombre' }, { key: 'unidad', label: 'Unidad' }, { key: 'precio_referencia', label: 'Precio ref.', render: fmt }, { key: 'activo', label: 'Estado', render: (v) => (v ? 'Activo' : 'Baja') }]}
          formFields={[{ key: 'codigo', label: 'Código', required: true }, { key: 'nombre', label: 'Nombre', required: true }, { key: 'unidad', label: 'Unidad (unidad/kg/litro)' }, { key: 'precio_referencia', label: 'Precio de referencia', type: 'decimal', defaultValue: 0 }, { key: 'activo', label: 'Activo', type: 'boolean', defaultValue: true }]} />
      )}
    </div>
  );
}

const ESTADO_PED = { borrador: 'bg-gray-100 text-gray-600', solicitado: 'bg-amber-100 text-amber-700', con_oc: 'bg-blue-100 text-blue-700', recibido: 'bg-green-100 text-green-700', anulado: 'bg-gray-200 text-gray-500' };

function PedidosTab() {
  const qc = useQueryClient();
  const [modal, setModal] = useState(null);
  const { data: pedidos, isLoading } = useQuery({ queryKey: ['comp-pedidos'], queryFn: () => comprasAPI.pedidos.list({ limit: 100 }).then((r) => r.data) });
  const refetch = () => qc.invalidateQueries({ queryKey: ['comp-pedidos'] });
  return (
    <div>
      <div className="mb-3 flex justify-end"><button className={btnPrimary} onClick={() => setModal('nuevo')}>Nuevo pedido</button></div>
      {isLoading ? <LoadingSpinner /> : (
        <div className="space-y-2">
          {pedidos?.length ? pedidos.map((p) => (
            <div key={p.id} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div><p className="text-sm font-semibold text-gray-800">{p.pedido} — {p.area}</p><p className="text-xs text-gray-500">{p.descripcion || ''} · {p.items.length} ítems</p></div>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${ESTADO_PED[p.estado]}`}>{p.estado}</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {p.items.map((it) => <span key={it.id} className="text-[11px] bg-gray-50 rounded px-2 py-0.5">{it.articulo?.codigo} {it.articulo?.nombre} × {it.cantidad}</span>)}
              </div>
            </div>
          )) : <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">Sin pedidos.</div>}
        </div>
      )}
      {modal === 'nuevo' && <PedidoModal onClose={() => setModal(null)} onDone={() => { setModal(null); refetch(); }} />}
    </div>
  );
}

function PedidoModal({ onClose, onDone }) {
  const { data: arts } = useQuery({ queryKey: ['comp-art-sel'], queryFn: () => comprasAPI.articulos.list({ limit: 200 }).then((r) => r.data) });
  const [f, setF] = useState({ anio: new Date().getFullYear(), area: '', descripcion: '' });
  const [items, setItems] = useState([{ id_articulo: '', cantidad: '' }]);
  const [msg, setMsg] = useState('');
  const setItem = (i, k, v) => setItems((p) => p.map((it, x) => (x === i ? { ...it, [k]: v } : it)));
  const validos = items.filter((it) => it.id_articulo && Number(it.cantidad) > 0);
  const m = useMutation({
    mutationFn: () => comprasAPI.pedidos.create({ anio: Number(f.anio), area: f.area, descripcion: f.descripcion || null, items: validos.map((it) => ({ id_articulo: Number(it.id_articulo), cantidad: Number(it.cantidad) })) }),
    onSuccess: onDone, onError: (e) => setMsg(e.response?.data?.detail || 'Error'),
  });
  return (
    <Modal title="Nuevo pedido de área" onClose={onClose} wide>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <Field label="Área solicitante"><input className={inputClass} value={f.area} onChange={(e) => setF({ ...f, area: e.target.value })} placeholder="ej: Secretaría de Obras" /></Field>
        <Field label="Descripción"><input className={inputClass} value={f.descripcion} onChange={(e) => setF({ ...f, descripcion: e.target.value })} /></Field>
      </div>
      <div className="space-y-2">
        {items.map((it, i) => (
          <div key={i} className="grid grid-cols-12 gap-2 items-center">
            <select className={`${inputClass} col-span-8`} value={it.id_articulo} onChange={(e) => setItem(i, 'id_articulo', e.target.value)}>
              <option value="">Artículo...</option>
              {arts?.map((a) => <option key={a.id} value={a.id}>{a.codigo} — {a.nombre}</option>)}
            </select>
            <input type="number" className={`${inputClass} col-span-3`} placeholder="Cant." value={it.cantidad} onChange={(e) => setItem(i, 'cantidad', e.target.value)} />
            <button className="col-span-1 text-red-500" onClick={() => setItems((p) => p.filter((_, x) => x !== i))}>✕</button>
          </div>
        ))}
      </div>
      <button className={`${btnSecondary} mt-2`} onClick={() => setItems((p) => [...p, { id_articulo: '', cantidad: '' }])}>+ Ítem</button>
      {msg && <p className="text-red-600 text-sm mt-2">⚠ {msg}</p>}
      <button className={`${btnPrimary} w-full mt-3`} disabled={m.isPending || !f.area.trim() || !validos.length} onClick={() => m.mutate()}>{m.isPending ? '...' : 'Crear pedido'}</button>
    </Modal>
  );
}

const ESTADO_OC = { emitida: 'bg-amber-100 text-amber-700', recibida_parcial: 'bg-blue-100 text-blue-700', recibida: 'bg-green-100 text-green-700', anulada: 'bg-gray-200 text-gray-500' };

function OrdenesCompraTab() {
  const qc = useQueryClient();
  const [modal, setModal] = useState(null);
  const [error, setError] = useState('');
  const { data: ocs, isLoading } = useQuery({ queryKey: ['comp-oc'], queryFn: () => comprasAPI.ordenesCompra.list({ limit: 100 }).then((r) => r.data) });
  const refetch = () => { qc.invalidateQueries({ queryKey: ['comp-oc'] }); qc.invalidateQueries({ queryKey: ['comp-pedidos'] }); qc.invalidateQueries({ queryKey: ['comp-stock'] }); };
  return (
    <div>
      {error && <div className="mb-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2 flex justify-between"><span>⚠ {error}</span><button onClick={() => setError('')} className="text-red-500">✕</button></div>}
      <div className="mb-3 flex justify-end"><button className={btnPrimary} onClick={() => setModal('nueva')}>Nueva orden de compra</button></div>
      {isLoading ? <LoadingSpinner /> : (
        <div className="space-y-2">
          {ocs?.length ? ocs.map((oc) => (
            <div key={oc.id} className="bg-white rounded-xl border border-gray-200 p-4 cursor-pointer hover:border-primary-200" onClick={() => setModal({ det: oc.id })}>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div><p className="text-sm font-semibold text-gray-800">{oc.orden_compra} — {oc.proveedor?.nombre}</p><p className="text-xs text-gray-500">{oc.concepto || ''}{oc.comprometida ? ' · comprometida en Contaduría' : ''}</p></div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-800">{fmt(oc.total)}</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${ESTADO_OC[oc.estado]}`}>{oc.estado}</span>
                </div>
              </div>
            </div>
          )) : <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">Sin órdenes de compra.</div>}
        </div>
      )}
      {modal === 'nueva' && <OCModal onClose={() => setModal(null)} onDone={() => { setModal(null); refetch(); }} />}
      {modal?.det && <OCDetalle id={modal.det} onClose={() => setModal(null)} onChange={refetch} onError={setError} />}
    </div>
  );
}

function OCModal({ onClose, onDone }) {
  const { data: provs } = useQuery({ queryKey: ['comp-prov-sel'], queryFn: () => comprasAPI.proveedores.list({ limit: 200 }).then((r) => r.data) });
  const { data: arts } = useQuery({ queryKey: ['comp-art-sel'], queryFn: () => comprasAPI.articulos.list({ limit: 200 }).then((r) => r.data) });
  const { data: pedidos } = useQuery({ queryKey: ['comp-ped-sel'], queryFn: () => comprasAPI.pedidos.list({ limit: 100 }).then((r) => r.data) });
  const [f, setF] = useState({ anio: new Date().getFullYear(), id_proveedor: '', id_pedido: '', concepto: '' });
  const [items, setItems] = useState([{ id_articulo: '', cantidad: '', precio: '' }]);
  const [msg, setMsg] = useState('');
  const setItem = (i, k, v) => setItems((p) => p.map((it, x) => (x === i ? { ...it, [k]: v } : it)));
  const cargarPedido = (idp) => {
    setF({ ...f, id_pedido: idp });
    const ped = pedidos?.find((p) => String(p.id) === String(idp));
    if (ped) setItems(ped.items.map((it) => ({ id_articulo: String(it.id_articulo), cantidad: String(it.cantidad), precio: String(it.articulo?.precio_referencia || '') })));
  };
  const validos = items.filter((it) => it.id_articulo && Number(it.cantidad) > 0 && it.precio !== '');
  const total = validos.reduce((s, it) => s + Number(it.cantidad) * Number(it.precio), 0);
  const m = useMutation({
    mutationFn: () => comprasAPI.ordenesCompra.create({ anio: Number(f.anio), id_proveedor: Number(f.id_proveedor), id_pedido: f.id_pedido ? Number(f.id_pedido) : null, concepto: f.concepto || null, items: validos.map((it) => ({ id_articulo: Number(it.id_articulo), cantidad: Number(it.cantidad), precio: Number(it.precio) })) }),
    onSuccess: onDone, onError: (e) => setMsg(e.response?.data?.detail || 'Error'),
  });
  return (
    <Modal title="Nueva orden de compra" onClose={onClose} wide>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <Field label="Proveedor"><select className={inputClass} value={f.id_proveedor} onChange={(e) => setF({ ...f, id_proveedor: e.target.value })}><option value="">Seleccionar...</option>{provs?.map((p) => <option key={p.id} value={p.id}>{p.codigo} — {p.nombre}</option>)}</select></Field>
        <Field label="Desde pedido (opcional, autocompleta ítems)"><select className={inputClass} value={f.id_pedido} onChange={(e) => cargarPedido(e.target.value)}><option value="">—</option>{pedidos?.filter((p) => p.estado === 'solicitado').map((p) => <option key={p.id} value={p.id}>{p.pedido} — {p.area}</option>)}</select></Field>
      </div>
      <Field label="Concepto"><input className={inputClass} value={f.concepto} onChange={(e) => setF({ ...f, concepto: e.target.value })} /></Field>
      <div className="space-y-2 mt-2">
        {items.map((it, i) => (
          <div key={i} className="grid grid-cols-12 gap-2 items-center">
            <select className={`${inputClass} col-span-6`} value={it.id_articulo} onChange={(e) => setItem(i, 'id_articulo', e.target.value)}><option value="">Artículo...</option>{arts?.map((a) => <option key={a.id} value={a.id}>{a.codigo} — {a.nombre}</option>)}</select>
            <input type="number" className={`${inputClass} col-span-2`} placeholder="Cant." value={it.cantidad} onChange={(e) => setItem(i, 'cantidad', e.target.value)} />
            <input type="number" className={`${inputClass} col-span-3`} placeholder="Precio" value={it.precio} onChange={(e) => setItem(i, 'precio', e.target.value)} />
            <button className="col-span-1 text-red-500" onClick={() => setItems((p) => p.filter((_, x) => x !== i))}>✕</button>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between mt-2">
        <button className={btnSecondary} onClick={() => setItems((p) => [...p, { id_articulo: '', cantidad: '', precio: '' }])}>+ Ítem</button>
        <span className="text-sm font-semibold">Total: {fmt(total)}</span>
      </div>
      {msg && <p className="text-red-600 text-sm mt-2">⚠ {msg}</p>}
      <button className={`${btnPrimary} w-full mt-3`} disabled={m.isPending || !f.id_proveedor || !validos.length} onClick={() => m.mutate()}>{m.isPending ? '...' : 'Emitir OC'}</button>
    </Modal>
  );
}

function OCDetalle({ id, onClose, onChange, onError }) {
  const qc = useQueryClient();
  const { data: oc, isLoading } = useQuery({ queryKey: ['comp-oc', id], queryFn: () => comprasAPI.ordenesCompra.get(id).then((r) => r.data) });
  const [recibir, setRecibir] = useState({});
  const refetch = () => { qc.invalidateQueries({ queryKey: ['comp-oc', id] }); onChange(); };
  const recibirMut = useMutation({
    mutationFn: () => comprasAPI.ordenesCompra.recibir(id, { items: Object.entries(recibir).filter(([, v]) => Number(v) > 0).map(([k, v]) => ({ id_oc_item: Number(k), cantidad: Number(v) })) }),
    onSuccess: () => { setRecibir({}); refetch(); }, onError: (e) => onError(e.response?.data?.detail || 'Error'),
  });
  const anularMut = useMutation({ mutationFn: () => comprasAPI.ordenesCompra.anular(id), onSuccess: () => { onChange(); onClose(); }, onError: (e) => { onError(e.response?.data?.detail || 'Error'); onClose(); } });
  if (isLoading || !oc) return null;
  const puedeRecibir = ['emitida', 'recibida_parcial'].includes(oc.estado);
  return (
    <Modal title={`${oc.orden_compra} — ${oc.proveedor?.nombre}`} onClose={onClose} wide>
      <div className="flex items-center gap-2 mb-3 text-sm">
        <span className={`px-2 py-0.5 rounded text-xs font-medium ${ESTADO_OC[oc.estado]}`}>{oc.estado}</span>
        <span className="font-bold">{fmt(oc.total)}</span>
        {oc.comprometida && <span className="text-xs text-blue-600">comprometida en Contaduría</span>}
      </div>
      <table className="w-full text-xs mb-3">
        <thead><tr className="text-gray-500 border-b"><th className="text-left py-1">Artículo</th><th className="text-right">Cant.</th><th className="text-right">Precio</th><th className="text-right">Recibido</th><th className="text-right">Pend.</th>{puedeRecibir && <th className="text-right">Recibir</th>}</tr></thead>
        <tbody>
          {oc.items.map((it) => (
            <tr key={it.id} className="border-b border-gray-50">
              <td className="py-1">{it.articulo?.codigo} {it.articulo?.nombre}</td>
              <td className="text-right">{it.cantidad}</td><td className="text-right">{fmt(it.precio)}</td>
              <td className="text-right">{it.cantidad_recibida}</td><td className="text-right font-medium">{it.pendiente}</td>
              {puedeRecibir && <td className="text-right">{it.pendiente > 0 ? <input type="number" className="w-20 border border-gray-200 rounded px-1 py-0.5 text-right" value={recibir[it.id] || ''} onChange={(e) => setRecibir({ ...recibir, [it.id]: e.target.value })} max={it.pendiente} /> : '✓'}</td>}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex gap-2">
        {puedeRecibir && <button className={`${btnPrimary} flex-1`} disabled={recibirMut.isPending || !Object.values(recibir).some((v) => Number(v) > 0)} onClick={() => recibirMut.mutate()}>Registrar recepción → stock</button>}
        {['emitida', 'recibida_parcial'].includes(oc.estado) && !oc.comprometida && <button className={btnSecondary} onClick={() => { if (confirm('¿Anular la OC?')) anularMut.mutate(); }}>Anular</button>}
      </div>
    </Modal>
  );
}

function StockTab() {
  const { data, isLoading } = useQuery({ queryKey: ['comp-stock'], queryFn: () => comprasAPI.stock().then((r) => r.data) });
  if (isLoading) return <LoadingSpinner />;
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
      <table className="min-w-full text-left text-xs">
        <thead><tr className="border-b border-gray-100 bg-gray-50/70 text-gray-500 uppercase tracking-wide">{['Código', 'Artículo', 'Unidad', 'Cantidad en stock'].map((h) => <th key={h} className="px-3 py-2.5 font-semibold">{h}</th>)}</tr></thead>
        <tbody className="divide-y divide-gray-50">
          {data?.length ? data.map((s) => (
            <tr key={s.id_articulo} className="hover:bg-primary-50/40">
              <td className="px-3 py-2">{s.articulo?.codigo}</td><td className="px-3 py-2">{s.articulo?.nombre}</td>
              <td className="px-3 py-2">{s.articulo?.unidad || '—'}</td><td className="px-3 py-2 font-bold text-right pr-8">{s.cantidad}</td>
            </tr>
          )) : <tr><td colSpan={4} className="px-3 py-8 text-center text-gray-400">Sin stock. Ingresá mercadería recibiendo una OC.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
