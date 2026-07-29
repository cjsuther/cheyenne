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
  { key: 'licitaciones', label: 'Cotizaciones/Licitaciones' },
  { key: 'oc', label: 'Órdenes de Compra' },
  { key: 'facturas', label: 'Facturas' },
  { key: 'stock', label: 'Stock' },
  { key: 'depositos', label: 'Depósitos' },
  { key: 'proveedores', label: 'Proveedores' },
  { key: 'articulos', label: 'Artículos' },
];
const GRUPOS = [
  { label: 'Circuito', keys: ['pedidos', 'licitaciones', 'oc', 'facturas'] },
  { label: 'Depósitos', keys: ['stock', 'depositos'] },
  { label: 'Maestros', keys: ['proveedores', 'articulos'] },
];

export default function Compras() {
  const [tab, setTab] = useTabParam('pedidos');
  return (
    <div>
      <PageHeader title="Compras — Adquisiciones" subtitle="Pedido → cotización → orden de compra → recepción → factura → stock" />
      <GroupedTabBar grupos={GRUPOS} tabsMeta={TABS} tab={tab} setTab={setTab} />
      {tab === 'pedidos' && <PedidosTab />}
      {tab === 'licitaciones' && <LicitacionesTab />}
      {tab === 'oc' && <OrdenesCompraTab />}
      {tab === 'facturas' && <FacturasTab />}
      {tab === 'stock' && <StockTab />}
      {tab === 'depositos' && <DepositosTab />}
      {tab === 'proveedores' && <ProveedoresTab />}
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
  const { data: depots } = useQuery({ queryKey: ['comp-dep-sel'], queryFn: () => comprasAPI.depositos.list({ limit: 200 }).then((r) => r.data) });
  const [recibir, setRecibir] = useState({});
  const [idDeposito, setIdDeposito] = useState('');
  const refetch = () => { qc.invalidateQueries({ queryKey: ['comp-oc', id] }); onChange(); };
  const recibirMut = useMutation({
    mutationFn: () => comprasAPI.ordenesCompra.recibir(id, { id_deposito: idDeposito ? Number(idDeposito) : null, items: Object.entries(recibir).filter(([, v]) => Number(v) > 0).map(([k, v]) => ({ id_oc_item: Number(k), cantidad: Number(v) })) }),
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
      {puedeRecibir && (
        <div className="mb-2"><Field label="Depósito destino (default: Central)"><select className={inputClass} value={idDeposito} onChange={(e) => setIdDeposito(e.target.value)}><option value="">Central (default)</option>{depots?.filter((d) => d.activo).map((d) => <option key={d.id} value={d.id}>{d.codigo} — {d.nombre}</option>)}</select></Field></div>
      )}
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

// ═══════════════════════════ LICITACIONES / COTIZACIONES ═══════════════════════════
const ESTADO_COT = { abierto: 'bg-amber-100 text-amber-700', cerrado: 'bg-blue-100 text-blue-700', adjudicado: 'bg-green-100 text-green-700', desierto: 'bg-gray-200 text-gray-500' };

function LicitacionesTab() {
  const qc = useQueryClient();
  const [modal, setModal] = useState(null);
  const [error, setError] = useState('');
  const { data: peds, isLoading } = useQuery({ queryKey: ['comp-pedcot'], queryFn: () => comprasAPI.licitaciones.list({ limit: 100 }).then((r) => r.data) });
  const refetch = () => { qc.invalidateQueries({ queryKey: ['comp-pedcot'] }); qc.invalidateQueries({ queryKey: ['comp-oc'] }); };
  return (
    <div>
      {error && <div className="mb-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2 flex justify-between"><span>⚠ {error}</span><button onClick={() => setError('')} className="text-red-500">✕</button></div>}
      <div className="mb-3 flex justify-end"><button className={btnPrimary} onClick={() => setModal('nuevo')}>Nuevo pedido de cotización</button></div>
      {isLoading ? <LoadingSpinner /> : (
        <div className="space-y-2">
          {peds?.length ? peds.map((p) => (
            <div key={p.id} className="bg-white rounded-xl border border-gray-200 p-4 cursor-pointer hover:border-primary-200" onClick={() => setModal({ det: p.id })}>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div><p className="text-sm font-semibold text-gray-800">{p.pedido_cotizacion} — {p.concepto || 'Sin concepto'}</p><p className="text-xs text-gray-500">{p.items.length} ítems · {p.cant_cotizaciones} cotizaciones</p></div>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${ESTADO_COT[p.estado]}`}>{p.estado}</span>
              </div>
            </div>
          )) : <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">Sin pedidos de cotización.</div>}
        </div>
      )}
      {modal === 'nuevo' && <PedCotModal onClose={() => setModal(null)} onDone={() => { setModal(null); refetch(); }} />}
      {modal?.det && <PedCotDetalle id={modal.det} onClose={() => setModal(null)} onChange={refetch} onError={setError} />}
    </div>
  );
}

function PedCotModal({ onClose, onDone }) {
  const { data: arts } = useQuery({ queryKey: ['comp-art-sel'], queryFn: () => comprasAPI.articulos.list({ limit: 200 }).then((r) => r.data) });
  const [f, setF] = useState({ anio: new Date().getFullYear(), concepto: '' });
  const [items, setItems] = useState([{ id_articulo: '', cantidad: '' }]);
  const [msg, setMsg] = useState('');
  const setItem = (i, k, v) => setItems((p) => p.map((it, x) => (x === i ? { ...it, [k]: v } : it)));
  const validos = items.filter((it) => it.id_articulo && Number(it.cantidad) > 0);
  const m = useMutation({
    mutationFn: () => comprasAPI.licitaciones.create({ anio: Number(f.anio), concepto: f.concepto || null, items: validos.map((it) => ({ id_articulo: Number(it.id_articulo), cantidad: Number(it.cantidad) })) }),
    onSuccess: onDone, onError: (e) => setMsg(e.response?.data?.detail || 'Error'),
  });
  return (
    <Modal title="Nuevo pedido de cotización" onClose={onClose} wide>
      <Field label="Concepto"><input className={inputClass} value={f.concepto} onChange={(e) => setF({ ...f, concepto: e.target.value })} placeholder="ej: Insumos de librería 2026" /></Field>
      <div className="space-y-2 mt-2">
        {items.map((it, i) => (
          <div key={i} className="grid grid-cols-12 gap-2 items-center">
            <select className={`${inputClass} col-span-8`} value={it.id_articulo} onChange={(e) => setItem(i, 'id_articulo', e.target.value)}><option value="">Artículo...</option>{arts?.map((a) => <option key={a.id} value={a.id}>{a.codigo} — {a.nombre}</option>)}</select>
            <input type="number" className={`${inputClass} col-span-3`} placeholder="Cant." value={it.cantidad} onChange={(e) => setItem(i, 'cantidad', e.target.value)} />
            <button className="col-span-1 text-red-500" onClick={() => setItems((p) => p.filter((_, x) => x !== i))}>✕</button>
          </div>
        ))}
      </div>
      <button className={`${btnSecondary} mt-2`} onClick={() => setItems((p) => [...p, { id_articulo: '', cantidad: '' }])}>+ Ítem</button>
      {msg && <p className="text-red-600 text-sm mt-2">⚠ {msg}</p>}
      <button className={`${btnPrimary} w-full mt-3`} disabled={m.isPending || !validos.length} onClick={() => m.mutate()}>{m.isPending ? '...' : 'Crear pedido de cotización'}</button>
    </Modal>
  );
}

function PedCotDetalle({ id, onClose, onChange, onError }) {
  const qc = useQueryClient();
  const { data: p, isLoading } = useQuery({ queryKey: ['comp-pedcot', id], queryFn: () => comprasAPI.licitaciones.get(id).then((r) => r.data) });
  const { data: comp } = useQuery({ queryKey: ['comp-pedcot-comp', id], queryFn: () => comprasAPI.licitaciones.comparativa(id).then((r) => r.data), enabled: !!p && p.estado !== 'abierto' });
  const [sub, setSub] = useState(null); // 'cotizar' | 'adjudicar'
  const refetch = () => { qc.invalidateQueries({ queryKey: ['comp-pedcot', id] }); qc.invalidateQueries({ queryKey: ['comp-pedcot-comp', id] }); onChange(); };
  const aperturaMut = useMutation({ mutationFn: () => comprasAPI.licitaciones.apertura(id), onSuccess: refetch, onError: (e) => onError(e.response?.data?.detail || 'Error') });
  if (isLoading || !p) return null;
  return (
    <Modal title={`${p.pedido_cotizacion} — ${p.concepto || ''}`} onClose={onClose} wide>
      <div className="flex items-center gap-2 mb-3 text-sm">
        <span className={`px-2 py-0.5 rounded text-xs font-medium ${ESTADO_COT[p.estado]}`}>{p.estado}</span>
        <span className="text-xs text-gray-500">{p.cotizaciones?.length || 0} cotizaciones</span>
      </div>
      <div className="mb-3">
        <p className="text-xs font-semibold text-gray-500 mb-1">Ítems solicitados</p>
        <div className="flex flex-wrap gap-1.5">{p.items.map((it) => <span key={it.id} className="text-[11px] bg-gray-50 rounded px-2 py-0.5">{it.articulo?.codigo} {it.articulo?.nombre} × {it.cantidad}</span>)}</div>
      </div>
      {p.cotizaciones?.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-semibold text-gray-500 mb-1">Cotizaciones recibidas</p>
          <div className="space-y-1">{p.cotizaciones.map((c) => <div key={c.id} className="flex justify-between text-xs bg-gray-50 rounded px-2 py-1"><span>{c.proveedor?.nombre}</span><span className="font-semibold">{fmt(c.total)}</span></div>)}</div>
        </div>
      )}
      {comp && p.estado !== 'abierto' && (
        <div className="mb-3 overflow-x-auto">
          <p className="text-xs font-semibold text-gray-500 mb-1">Cuadro comparativo (mejor precio resaltado)</p>
          <table className="w-full text-xs">
            <thead><tr className="text-gray-500 border-b"><th className="text-left py-1">Artículo</th><th className="text-right">Cant.</th>{comp.proveedores.map((pr) => <th key={pr.id_proveedor} className="text-right px-2">{pr.nombre}</th>)}</tr></thead>
            <tbody>{comp.filas.map((fila) => (
              <tr key={fila.id_articulo} className="border-b border-gray-50"><td className="py-1">{fila.articulo?.codigo} {fila.articulo?.nombre}</td><td className="text-right">{fila.cantidad}</td>
                {comp.proveedores.map((pr) => { const v = fila.precios[String(pr.id_proveedor)]; const mejor = fila.mejor_id_proveedor === pr.id_proveedor; return <td key={pr.id_proveedor} className={`text-right px-2 ${mejor ? 'font-bold text-green-700' : ''}`}>{v != null ? fmt(v) : '—'}</td>; })}
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
      <div className="flex flex-wrap gap-2 mt-3">
        {p.estado === 'abierto' && <button className={btnPrimary} onClick={() => setSub('cotizar')}>Registrar cotización</button>}
        {p.estado === 'abierto' && <button className={btnSecondary} onClick={() => { if (confirm('¿Cerrar la recepción de ofertas (acta de apertura)?')) aperturaMut.mutate(); }}>Apertura (cerrar ofertas)</button>}
        {['abierto', 'cerrado'].includes(p.estado) && p.cotizaciones?.length > 0 && <button className={btnPrimary} onClick={() => setSub('adjudicar')}>Adjudicar → generar OC</button>}
      </div>
      {sub === 'cotizar' && <CotizarModal pedcot={p} onClose={() => setSub(null)} onDone={() => { setSub(null); refetch(); }} />}
      {sub === 'adjudicar' && <AdjudicarModal pedcot={p} comp={comp} onClose={() => setSub(null)} onDone={() => { setSub(null); refetch(); onClose(); }} />}
    </Modal>
  );
}

function CotizarModal({ pedcot, onClose, onDone }) {
  const { data: provs } = useQuery({ queryKey: ['comp-prov-sel'], queryFn: () => comprasAPI.proveedores.list({ limit: 200 }).then((r) => r.data) });
  const [idProv, setIdProv] = useState('');
  const [obs, setObs] = useState('');
  const [precios, setPrecios] = useState({}); // id_articulo -> precio
  const [msg, setMsg] = useState('');
  const items = pedcot.items.filter((it) => precios[it.id_articulo] !== '' && precios[it.id_articulo] != null).map((it) => ({ id_articulo: it.id_articulo, precio: Number(precios[it.id_articulo]), cantidad: it.cantidad }));
  const m = useMutation({
    mutationFn: () => comprasAPI.licitaciones.cotizar(pedcot.id, { id_proveedor: Number(idProv), observaciones: obs || null, items }),
    onSuccess: onDone, onError: (e) => setMsg(e.response?.data?.detail || 'Error'),
  });
  return (
    <Modal title="Registrar cotización" onClose={onClose} wide>
      <div className="grid grid-cols-2 gap-3 mb-2">
        <Field label="Proveedor"><select className={inputClass} value={idProv} onChange={(e) => setIdProv(e.target.value)}><option value="">Seleccionar...</option>{provs?.filter((p) => p.estado !== 'suspendido').map((p) => <option key={p.id} value={p.id}>{p.codigo} — {p.nombre}</option>)}</select></Field>
        <Field label="Observaciones"><input className={inputClass} value={obs} onChange={(e) => setObs(e.target.value)} /></Field>
      </div>
      <table className="w-full text-xs mb-2">
        <thead><tr className="text-gray-500 border-b"><th className="text-left py-1">Artículo</th><th className="text-right">Cant.</th><th className="text-right">Precio unit.</th></tr></thead>
        <tbody>{pedcot.items.map((it) => (
          <tr key={it.id} className="border-b border-gray-50"><td className="py-1">{it.articulo?.codigo} {it.articulo?.nombre}</td><td className="text-right">{it.cantidad}</td>
            <td className="text-right"><input type="number" className="w-24 border border-gray-200 rounded px-1 py-0.5 text-right" value={precios[it.id_articulo] || ''} onChange={(e) => setPrecios({ ...precios, [it.id_articulo]: e.target.value })} /></td></tr>
        ))}</tbody>
      </table>
      {msg && <p className="text-red-600 text-sm mt-2">⚠ {msg}</p>}
      <button className={`${btnPrimary} w-full mt-2`} disabled={m.isPending || !idProv || !items.length} onClick={() => m.mutate()}>{m.isPending ? '...' : 'Guardar cotización'}</button>
    </Modal>
  );
}

function AdjudicarModal({ pedcot, comp, onClose, onDone }) {
  const [sel, setSel] = useState({}); // id_articulo -> id_proveedor
  const [msg, setMsg] = useState('');
  const filas = comp?.filas || pedcot.items.map((it) => ({ id_articulo: it.id_articulo, articulo: it.articulo, cantidad: it.cantidad, precios: {}, mejor_id_proveedor: null }));
  const proveedores = comp?.proveedores || (pedcot.cotizaciones || []).map((c) => ({ id_proveedor: c.id_proveedor, nombre: c.proveedor?.nombre }));
  const lineas = Object.entries(sel).filter(([, pid]) => pid).map(([aid, pid]) => ({ id_articulo: Number(aid), id_proveedor: Number(pid) }));
  const m = useMutation({
    mutationFn: () => comprasAPI.licitaciones.adjudicar(pedcot.id, { lineas }),
    onSuccess: onDone, onError: (e) => setMsg(e.response?.data?.detail || 'Error'),
  });
  const autoMejor = () => { const s = {}; filas.forEach((f) => { if (f.mejor_id_proveedor) s[f.id_articulo] = String(f.mejor_id_proveedor); }); setSel(s); };
  return (
    <Modal title="Adjudicar y generar órdenes de compra" onClose={onClose} wide>
      <button className={`${btnSecondary} mb-2`} onClick={autoMejor}>Autoseleccionar mejor precio</button>
      <table className="w-full text-xs mb-2">
        <thead><tr className="text-gray-500 border-b"><th className="text-left py-1">Artículo</th><th className="text-right">Cant.</th><th className="text-left px-2">Adjudicar a</th></tr></thead>
        <tbody>{filas.map((f) => (
          <tr key={f.id_articulo} className="border-b border-gray-50"><td className="py-1">{f.articulo?.codigo} {f.articulo?.nombre}</td><td className="text-right">{f.cantidad}</td>
            <td className="px-2"><select className="border border-gray-200 rounded px-1 py-0.5 w-full" value={sel[f.id_articulo] || ''} onChange={(e) => setSel({ ...sel, [f.id_articulo]: e.target.value })}><option value="">— sin adjudicar —</option>{proveedores.map((pr) => { const precio = f.precios?.[String(pr.id_proveedor)]; return <option key={pr.id_proveedor} value={pr.id_proveedor}>{pr.nombre}{precio != null ? ` (${fmt(precio)})` : ''}</option>; })}</select></td></tr>
        ))}</tbody>
      </table>
      {msg && <p className="text-red-600 text-sm mt-2">⚠ {msg}</p>}
      <button className={`${btnPrimary} w-full mt-2`} disabled={m.isPending || !lineas.length} onClick={() => m.mutate()}>{m.isPending ? '...' : `Adjudicar ${lineas.length} ítem(s) y generar OC`}</button>
    </Modal>
  );
}

// ═══════════════════════════ FACTURAS ═══════════════════════════
const ESTADO_FACT = { registrada: 'bg-amber-100 text-amber-700', conformada: 'bg-green-100 text-green-700', anulada: 'bg-gray-200 text-gray-500' };

function FacturasTab() {
  const qc = useQueryClient();
  const [modal, setModal] = useState(null);
  const [error, setError] = useState('');
  const { data: facturas, isLoading } = useQuery({ queryKey: ['comp-fact'], queryFn: () => comprasAPI.facturas.list({ limit: 100 }).then((r) => r.data) });
  const refetch = () => qc.invalidateQueries({ queryKey: ['comp-fact'] });
  const conformarMut = useMutation({ mutationFn: (id) => comprasAPI.facturas.conformar(id), onSuccess: refetch, onError: (e) => setError(e.response?.data?.detail || 'Error') });
  const anularMut = useMutation({ mutationFn: (id) => comprasAPI.facturas.anular(id), onSuccess: refetch, onError: (e) => setError(e.response?.data?.detail || 'Error') });
  return (
    <div>
      {error && <div className="mb-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2 flex justify-between"><span>⚠ {error}</span><button onClick={() => setError('')} className="text-red-500">✕</button></div>}
      <div className="mb-3 flex justify-end"><button className={btnPrimary} onClick={() => setModal('nueva')}>Registrar factura</button></div>
      {isLoading ? <LoadingSpinner /> : (
        <div className="space-y-2">
          {facturas?.length ? facturas.map((f) => (
            <div key={f.id} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div><p className="text-sm font-semibold text-gray-800">Factura {f.numero} — {f.proveedor?.nombre}</p><p className="text-xs text-gray-500">{f.orden_compra ? `contra ${f.orden_compra}` : 'sin OC'}</p></div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-800">{fmt(f.total)}</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${ESTADO_FACT[f.estado]}`}>{f.estado}</span>
                  {f.estado === 'registrada' && <button className="text-xs text-green-600 border border-green-200 rounded px-2 py-0.5" onClick={() => conformarMut.mutate(f.id)}>Conformar</button>}
                  {f.estado === 'registrada' && <button className="text-xs text-red-500 border border-red-200 rounded px-2 py-0.5" onClick={() => { if (confirm('¿Anular factura?')) anularMut.mutate(f.id); }}>Anular</button>}
                </div>
              </div>
            </div>
          )) : <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">Sin facturas.</div>}
        </div>
      )}
      {modal === 'nueva' && <FacturaModal onClose={() => setModal(null)} onDone={() => { setModal(null); refetch(); }} />}
    </div>
  );
}

function FacturaModal({ onClose, onDone }) {
  const { data: provs } = useQuery({ queryKey: ['comp-prov-sel'], queryFn: () => comprasAPI.proveedores.list({ limit: 200 }).then((r) => r.data) });
  const { data: ocs } = useQuery({ queryKey: ['comp-oc'], queryFn: () => comprasAPI.ordenesCompra.list({ limit: 100 }).then((r) => r.data) });
  const [f, setF] = useState({ id_proveedor: '', id_orden_compra: '', numero: '', total: '' });
  const [msg, setMsg] = useState('');
  const ocsProv = (ocs || []).filter((o) => !f.id_proveedor || String(o.id_proveedor) === String(f.id_proveedor));
  const cargarOC = (idoc) => { const oc = ocs?.find((o) => String(o.id) === String(idoc)); setF({ ...f, id_orden_compra: idoc, id_proveedor: oc ? String(oc.id_proveedor) : f.id_proveedor, total: oc ? String(oc.total) : f.total }); };
  const m = useMutation({
    mutationFn: () => comprasAPI.facturas.create({ id_proveedor: Number(f.id_proveedor), id_orden_compra: f.id_orden_compra ? Number(f.id_orden_compra) : null, numero: f.numero, total: Number(f.total) }),
    onSuccess: onDone, onError: (e) => setMsg(e.response?.data?.detail || 'Error'),
  });
  return (
    <Modal title="Registrar factura de proveedor" onClose={onClose}>
      <Field label="Orden de compra (opcional, autocompleta proveedor y valida tope)"><select className={inputClass} value={f.id_orden_compra} onChange={(e) => cargarOC(e.target.value)}><option value="">— sin OC —</option>{ocsProv.filter((o) => o.estado !== 'anulada').map((o) => <option key={o.id} value={o.id}>{o.orden_compra} — {o.proveedor?.nombre} ({fmt(o.total)})</option>)}</select></Field>
      <Field label="Proveedor"><select className={inputClass} value={f.id_proveedor} onChange={(e) => setF({ ...f, id_proveedor: e.target.value })} disabled={!!f.id_orden_compra}><option value="">Seleccionar...</option>{provs?.map((p) => <option key={p.id} value={p.id}>{p.codigo} — {p.nombre}</option>)}</select></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Número de factura"><input className={inputClass} value={f.numero} onChange={(e) => setF({ ...f, numero: e.target.value })} placeholder="0001-00001234" /></Field>
        <Field label="Total"><input type="number" className={inputClass} value={f.total} onChange={(e) => setF({ ...f, total: e.target.value })} /></Field>
      </div>
      {msg && <p className="text-red-600 text-sm mt-2">⚠ {msg}</p>}
      <button className={`${btnPrimary} w-full mt-3`} disabled={m.isPending || !f.id_proveedor || !f.numero.trim() || !(Number(f.total) > 0)} onClick={() => m.mutate()}>{m.isPending ? '...' : 'Registrar factura'}</button>
    </Modal>
  );
}

// ═══════════════════════════ DEPÓSITOS ═══════════════════════════
function DepositosTab() {
  const qc = useQueryClient();
  const [modal, setModal] = useState(null);
  const [error, setError] = useState('');
  const { data: deps, isLoading } = useQuery({ queryKey: ['comp-dep'], queryFn: () => comprasAPI.depositos.list({ limit: 200 }).then((r) => r.data) });
  const { data: stock } = useQuery({ queryKey: ['comp-dep-stock'], queryFn: () => comprasAPI.depositos.stock().then((r) => r.data) });
  const refetch = () => { qc.invalidateQueries({ queryKey: ['comp-dep'] }); qc.invalidateQueries({ queryKey: ['comp-dep-stock'] }); qc.invalidateQueries({ queryKey: ['comp-stock'] }); };
  return (
    <div>
      {error && <div className="mb-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2 flex justify-between"><span>⚠ {error}</span><button onClick={() => setError('')} className="text-red-500">✕</button></div>}
      <div className="mb-3 flex justify-end gap-2">
        <button className={btnSecondary} onClick={() => setModal('movimiento')}>Movimiento de stock</button>
        <button className={btnPrimary} onClick={() => setModal('nuevo')}>Nuevo depósito</button>
      </div>
      {isLoading ? <LoadingSpinner /> : (
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-1">Depósitos</p>
            <div className="space-y-1.5">{deps?.map((d) => (
              <div key={d.id} className="bg-white rounded-xl border border-gray-200 p-3 flex justify-between items-center">
                <div><p className="text-sm font-semibold">{d.codigo} — {d.nombre}</p>{d.es_central && <span className="text-[11px] text-primary-600">Central</span>}{!d.activo && <span className="text-[11px] text-gray-400 ml-2">baja</span>}</div>
              </div>
            ))}</div>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-1">Stock por depósito</p>
            <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
              <table className="min-w-full text-xs"><thead><tr className="border-b bg-gray-50/70 text-gray-500"><th className="px-3 py-2 text-left">Depósito</th><th className="px-3 py-2 text-left">Artículo</th><th className="px-3 py-2 text-right">Cant.</th></tr></thead>
                <tbody>{stock?.length ? stock.map((s, i) => (<tr key={i} className="border-b border-gray-50"><td className="px-3 py-1.5">{s.deposito?.codigo}</td><td className="px-3 py-1.5">{s.articulo?.codigo} {s.articulo?.nombre}</td><td className="px-3 py-1.5 text-right font-semibold">{s.cantidad}</td></tr>)) : <tr><td colSpan={3} className="px-3 py-6 text-center text-gray-400">Sin stock por depósito.</td></tr>}</tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      {modal === 'nuevo' && <DepositoModal onClose={() => setModal(null)} onDone={() => { setModal(null); refetch(); }} />}
      {modal === 'movimiento' && <MovimientoModal deps={deps} onClose={() => setModal(null)} onDone={() => { setModal(null); refetch(); }} onError={setError} />}
    </div>
  );
}

function DepositoModal({ onClose, onDone }) {
  const [f, setF] = useState({ codigo: '', nombre: '', es_central: false });
  const [msg, setMsg] = useState('');
  const m = useMutation({ mutationFn: () => comprasAPI.depositos.create({ ...f, activo: true }), onSuccess: onDone, onError: (e) => setMsg(e.response?.data?.detail || 'Error') });
  return (
    <Modal title="Nuevo depósito" onClose={onClose}>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Código"><input className={inputClass} value={f.codigo} onChange={(e) => setF({ ...f, codigo: e.target.value })} /></Field>
        <Field label="Nombre"><input className={inputClass} value={f.nombre} onChange={(e) => setF({ ...f, nombre: e.target.value })} /></Field>
      </div>
      <label className="flex items-center gap-2 mt-2 text-sm"><input type="checkbox" checked={f.es_central} onChange={(e) => setF({ ...f, es_central: e.target.checked })} /> Depósito central (default de recepciones)</label>
      {msg && <p className="text-red-600 text-sm mt-2">⚠ {msg}</p>}
      <button className={`${btnPrimary} w-full mt-3`} disabled={m.isPending || !f.codigo.trim() || !f.nombre.trim()} onClick={() => m.mutate()}>{m.isPending ? '...' : 'Crear depósito'}</button>
    </Modal>
  );
}

function MovimientoModal({ deps, onClose, onDone, onError }) {
  const { data: arts } = useQuery({ queryKey: ['comp-art-sel'], queryFn: () => comprasAPI.articulos.list({ limit: 200 }).then((r) => r.data) });
  const [tipo, setTipo] = useState('transferencia');
  const [f, setF] = useState({ id_articulo: '', id_deposito_origen: '', id_deposito_destino: '', id_deposito: '', cantidad: '', motivo: '' });
  const [msg, setMsg] = useState('');
  const activos = (deps || []).filter((d) => d.activo);
  const m = useMutation({
    mutationFn: () => {
      if (tipo === 'transferencia') return comprasAPI.movimientosStock.transferencia({ id_articulo: Number(f.id_articulo), id_deposito_origen: Number(f.id_deposito_origen), id_deposito_destino: Number(f.id_deposito_destino), cantidad: Number(f.cantidad), motivo: f.motivo || null });
      if (tipo === 'ajuste') return comprasAPI.movimientosStock.ajuste({ id_articulo: Number(f.id_articulo), id_deposito: Number(f.id_deposito), cantidad: Number(f.cantidad), motivo: f.motivo });
      return comprasAPI.movimientosStock.salida({ id_articulo: Number(f.id_articulo), id_deposito: Number(f.id_deposito), cantidad: Number(f.cantidad), motivo: f.motivo || null });
    },
    onSuccess: onDone, onError: (e) => setMsg(e.response?.data?.detail || 'Error'),
  });
  return (
    <Modal title="Movimiento de stock" onClose={onClose}>
      <div className="flex gap-2 mb-3 text-sm">{['transferencia', 'ajuste', 'salida'].map((t) => <button key={t} className={`px-3 py-1 rounded ${tipo === t ? 'bg-primary-600 text-white' : 'bg-gray-100'}`} onClick={() => setTipo(t)}>{t}</button>)}</div>
      <Field label="Artículo"><select className={inputClass} value={f.id_articulo} onChange={(e) => setF({ ...f, id_articulo: e.target.value })}><option value="">Seleccionar...</option>{arts?.map((a) => <option key={a.id} value={a.id}>{a.codigo} — {a.nombre}</option>)}</select></Field>
      {tipo === 'transferencia' ? (
        <div className="grid grid-cols-2 gap-3">
          <Field label="Origen"><select className={inputClass} value={f.id_deposito_origen} onChange={(e) => setF({ ...f, id_deposito_origen: e.target.value })}><option value="">...</option>{activos.map((d) => <option key={d.id} value={d.id}>{d.codigo}</option>)}</select></Field>
          <Field label="Destino"><select className={inputClass} value={f.id_deposito_destino} onChange={(e) => setF({ ...f, id_deposito_destino: e.target.value })}><option value="">...</option>{activos.map((d) => <option key={d.id} value={d.id}>{d.codigo}</option>)}</select></Field>
        </div>
      ) : (
        <Field label="Depósito"><select className={inputClass} value={f.id_deposito} onChange={(e) => setF({ ...f, id_deposito: e.target.value })}><option value="">...</option>{activos.map((d) => <option key={d.id} value={d.id}>{d.codigo} — {d.nombre}</option>)}</select></Field>
      )}
      <div className="grid grid-cols-2 gap-3">
        <Field label={tipo === 'ajuste' ? 'Cantidad (+/-)' : 'Cantidad'}><input type="number" className={inputClass} value={f.cantidad} onChange={(e) => setF({ ...f, cantidad: e.target.value })} /></Field>
        <Field label={tipo === 'ajuste' ? 'Motivo (obligatorio)' : 'Motivo'}><input className={inputClass} value={f.motivo} onChange={(e) => setF({ ...f, motivo: e.target.value })} /></Field>
      </div>
      {msg && <p className="text-red-600 text-sm mt-2">⚠ {msg}</p>}
      <button className={`${btnPrimary} w-full mt-3`} disabled={m.isPending || !f.id_articulo || !f.cantidad || (tipo === 'ajuste' && !f.motivo.trim())} onClick={() => m.mutate()}>{m.isPending ? '...' : 'Registrar movimiento'}</button>
    </Modal>
  );
}

// ═══════════════════════════ PROVEEDORES (con estado/preinscripción) ═══════════════════════════
const ESTADO_PROV = { preinscripto: 'bg-amber-100 text-amber-700', activo: 'bg-green-100 text-green-700', suspendido: 'bg-red-100 text-red-700' };

function ProveedoresTab() {
  const qc = useQueryClient();
  const [modal, setModal] = useState(null);
  const [error, setError] = useState('');
  const { data: provs, isLoading } = useQuery({ queryKey: ['comp-prov'], queryFn: () => comprasAPI.proveedores.list({ limit: 200 }).then((r) => r.data) });
  const refetch = () => qc.invalidateQueries({ queryKey: ['comp-prov'] });
  const aprobarMut = useMutation({ mutationFn: (id) => comprasAPI.proveedores.aprobar(id), onSuccess: refetch, onError: (e) => setError(e.response?.data?.detail || 'Error') });
  const suspenderMut = useMutation({ mutationFn: (id) => comprasAPI.proveedores.suspender(id), onSuccess: refetch, onError: (e) => setError(e.response?.data?.detail || 'Error') });
  const reactivarMut = useMutation({ mutationFn: (id) => comprasAPI.proveedores.reactivar(id), onSuccess: refetch, onError: (e) => setError(e.response?.data?.detail || 'Error') });
  return (
    <div>
      {error && <div className="mb-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2 flex justify-between"><span>⚠ {error}</span><button onClick={() => setError('')} className="text-red-500">✕</button></div>}
      <div className="mb-3 flex justify-end gap-2">
        <button className={btnSecondary} onClick={() => setModal('preinscribir')}>Preinscribir proveedor</button>
        <button className={btnPrimary} onClick={() => setModal('nuevo')}>Nuevo proveedor</button>
      </div>
      {isLoading ? <LoadingSpinner /> : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
          <table className="min-w-full text-left text-xs">
            <thead><tr className="border-b bg-gray-50/70 text-gray-500 uppercase">{['Código', 'Nombre', 'CUIT', 'Rubro', 'Estado', 'Acciones'].map((h) => <th key={h} className="px-3 py-2.5 font-semibold">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-gray-50">
              {provs?.map((p) => (
                <tr key={p.id} className="hover:bg-primary-50/40">
                  <td className="px-3 py-2">{p.codigo}</td><td className="px-3 py-2">{p.nombre}</td><td className="px-3 py-2">{p.cuit || '—'}</td><td className="px-3 py-2">{p.rubro || '—'}</td>
                  <td className="px-3 py-2"><span className={`px-2 py-0.5 rounded text-[11px] font-medium ${ESTADO_PROV[p.estado] || 'bg-gray-100'}`}>{p.estado}</span></td>
                  <td className="px-3 py-2 flex gap-1.5">
                    {p.estado === 'preinscripto' && <button className="text-green-600 border border-green-200 rounded px-2 py-0.5" onClick={() => aprobarMut.mutate(p.id)}>Aprobar</button>}
                    {p.estado === 'activo' && <button className="text-red-500 border border-red-200 rounded px-2 py-0.5" onClick={() => suspenderMut.mutate(p.id)}>Suspender</button>}
                    {p.estado === 'suspendido' && <button className="text-green-600 border border-green-200 rounded px-2 py-0.5" onClick={() => reactivarMut.mutate(p.id)}>Reactivar</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {modal === 'nuevo' && <ProveedorModal onClose={() => setModal(null)} onDone={() => { setModal(null); refetch(); }} />}
      {modal === 'preinscribir' && <ProveedorModal preinscripcion onClose={() => setModal(null)} onDone={() => { setModal(null); refetch(); }} />}
    </div>
  );
}

function ProveedorModal({ preinscripcion, onClose, onDone }) {
  const [f, setF] = useState({ codigo: '', nombre: '', cuit: '', rubro: '', email: '', telefono: '', domicilio: '', documentacion: '' });
  const [msg, setMsg] = useState('');
  const m = useMutation({
    mutationFn: () => preinscripcion ? comprasAPI.proveedores.preinscribir(f) : comprasAPI.proveedores.create({ ...f, estado: 'activo', activo: true }),
    onSuccess: onDone, onError: (e) => setMsg(e.response?.data?.detail || 'Error'),
  });
  return (
    <Modal title={preinscripcion ? 'Preinscripción de proveedor' : 'Nuevo proveedor'} onClose={onClose} wide>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Código"><input className={inputClass} value={f.codigo} onChange={(e) => setF({ ...f, codigo: e.target.value })} /></Field>
        <Field label="Nombre / Razón social"><input className={inputClass} value={f.nombre} onChange={(e) => setF({ ...f, nombre: e.target.value })} /></Field>
        <Field label="CUIT"><input className={inputClass} value={f.cuit} onChange={(e) => setF({ ...f, cuit: e.target.value })} /></Field>
        <Field label="Rubro"><input className={inputClass} value={f.rubro} onChange={(e) => setF({ ...f, rubro: e.target.value })} /></Field>
        <Field label="Email"><input className={inputClass} value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></Field>
        <Field label="Teléfono"><input className={inputClass} value={f.telefono} onChange={(e) => setF({ ...f, telefono: e.target.value })} /></Field>
      </div>
      <Field label="Domicilio"><input className={inputClass} value={f.domicilio} onChange={(e) => setF({ ...f, domicilio: e.target.value })} /></Field>
      <Field label="Documentación presentada (notas / links)"><input className={inputClass} value={f.documentacion} onChange={(e) => setF({ ...f, documentacion: e.target.value })} /></Field>
      {preinscripcion && <p className="text-xs text-amber-600 mt-1">Quedará en estado "preinscripto" hasta su aprobación.</p>}
      {msg && <p className="text-red-600 text-sm mt-2">⚠ {msg}</p>}
      <button className={`${btnPrimary} w-full mt-3`} disabled={m.isPending || !f.codigo.trim() || !f.nombre.trim()} onClick={() => m.mutate()}>{m.isPending ? '...' : (preinscripcion ? 'Preinscribir' : 'Crear proveedor')}</button>
    </Modal>
  );
}
