import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contabilidadAPI } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Modal, Field, inputClass, btnPrimary, btnSecondary } from '../../components/common/CrudComponents';

const fmt = (v) => new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(v || 0));
const EST_TX = { imputada: 'bg-green-100 text-green-700', sin_regla: 'bg-amber-100 text-amber-700', error: 'bg-red-100 text-red-700', anulada: 'bg-gray-200 text-gray-500' };

// ═══ TRANSACCIONES (bandeja) ═════════════════════════════════════════
export function TransaccionesTab() {
  const qc = useQueryClient();
  const [filtro, setFiltro] = useState('');
  const [sel, setSel] = useState(null);
  const [definir, setDefinir] = useState(null);   // transacción para la que se define el asiento
  const [error, setError] = useState('');
  const { data: txs, isLoading } = useQuery({
    queryKey: ['cont-tx', filtro],
    queryFn: () => contabilidadAPI.transacciones.list(filtro ? { estado: filtro, limit: 200 } : { limit: 200 }).then((r) => r.data),
  });
  const refetch = () => qc.invalidateQueries({ queryKey: ['cont-tx'] });
  const reprocesar = (id) => contabilidadAPI.transacciones.reprocesar(id).then(refetch).catch((e) => setError(e.response?.data?.detail || 'Error'));
  return (
    <div>
      {error && <div className="mb-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2 flex justify-between"><span>⚠ {error}</span><button onClick={() => setError('')} className="text-red-500">✕</button></div>}
      <div className="mb-3 flex items-center gap-2">
        <span className="text-sm text-gray-500">Los módulos postean hechos económicos; el contable los convierte en asientos según las reglas.</span>
        <select className="ml-auto border border-gray-300 rounded-lg px-3 py-1.5 text-sm" value={filtro} onChange={(e) => setFiltro(e.target.value)}>
          <option value="">Todas</option>
          <option value="imputada">Imputadas</option>
          <option value="sin_regla">Sin regla</option>
          <option value="error">Con error</option>
        </select>
      </div>
      {isLoading ? <LoadingSpinner /> : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
          <table className="min-w-full text-left text-xs">
            <thead><tr className="border-b border-gray-100 bg-gray-50/70 text-gray-500 uppercase tracking-wide">
              {['Origen', 'Tipo', 'Fecha', 'Importe', 'Estado', 'Asiento / Motivo', ''].map((h) => <th key={h} className="px-3 py-2.5 font-semibold whitespace-nowrap">{h}</th>)}
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {txs?.length ? txs.map((t) => (
                <tr key={t.id} className="hover:bg-primary-50/40">
                  <td className="px-3 py-2">{t.origen_modulo} · {t.origen_ref}</td>
                  <td className="px-3 py-2 font-medium">{t.tipo}</td>
                  <td className="px-3 py-2">{t.fecha || '—'}</td>
                  <td className="px-3 py-2 text-right">{fmt(t.importe)}</td>
                  <td className="px-3 py-2"><span className={`px-2 py-0.5 rounded text-xs font-medium ${EST_TX[t.estado]}`}>{t.estado}</span></td>
                  <td className="px-3 py-2 text-gray-500">{t.id_asiento ? <button className="text-primary-600 hover:underline" onClick={() => setSel(t)}>ver asiento</button> : (t.motivo || '')}</td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {t.estado === 'sin_regla' && <button className="text-primary-600 font-medium hover:underline mr-2" onClick={() => setDefinir(t)}>Definir asiento</button>}
                    {['sin_regla', 'error'].includes(t.estado) && <button className="text-gray-500 hover:underline" onClick={() => reprocesar(t.id)}>reprocesar</button>}
                  </td>
                </tr>
              )) : <tr><td colSpan={7} className="px-3 py-8 text-center text-gray-400">Sin transacciones.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
      {sel && <TxDetalle id={sel.id} onClose={() => setSel(null)} />}
      {definir && (
        <ReglaModal
          initialTipo={definir.tipo}
          tx={definir}
          onClose={() => setDefinir(null)}
          onDone={() => {
            // creada la regla, imputamos esta transacción (y refrescamos la bandeja)
            contabilidadAPI.transacciones.reprocesar(definir.id)
              .catch(() => {})
              .finally(() => { setDefinir(null); refetch(); });
          }}
        />
      )}
    </div>
  );
}

function TxDetalle({ id, onClose }) {
  const { data: tx } = useQuery({ queryKey: ['cont-tx', id], queryFn: () => contabilidadAPI.transacciones.get(id).then((r) => r.data) });
  if (!tx) return null;
  return (
    <Modal title={`Transacción ${tx.tipo} · ${tx.origen_ref}`} onClose={onClose} wide>
      <p className="text-sm text-gray-500 mb-2">{tx.concepto} · {fmt(tx.importe)} · estado {tx.estado}</p>
      <p className="text-xs text-gray-400 mb-2">Contexto: <code className="text-gray-600">{JSON.stringify(tx.contexto)}</code></p>
      {tx.asiento ? (
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-sm font-semibold mb-1">{tx.asiento.asiento} — {tx.asiento.concepto}</p>
          <table className="w-full text-xs">
            <thead><tr className="text-gray-500 border-b"><th className="text-left">Cuenta</th><th className="text-right">Debe</th><th className="text-right">Haber</th></tr></thead>
            <tbody>
              {tx.asiento.items?.map((i) => (
                <tr key={i.id}><td>{i.cuenta?.codigo} {i.cuenta?.nombre}</td><td className="text-right">{i.debe ? fmt(i.debe) : ''}</td><td className="text-right">{i.haber ? fmt(i.haber) : ''}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : <p className="text-amber-700 text-sm">Sin asiento generado — {tx.motivo}</p>}
    </Modal>
  );
}

// ═══ REGLAS DE IMPUTACIÓN ════════════════════════════════════════════
export function ReglasTab() {
  const qc = useQueryClient();
  const [modal, setModal] = useState(null);
  const [error, setError] = useState('');
  const { data: reglas, isLoading } = useQuery({ queryKey: ['cont-reglas'], queryFn: () => contabilidadAPI.reglasImputacion.list().then((r) => r.data) });
  const refetch = () => { qc.invalidateQueries({ queryKey: ['cont-reglas'] }); qc.invalidateQueries({ queryKey: ['cont-tx'] }); };
  const reprocesar = (id) => contabilidadAPI.reglasImputacion.reprocesarPendientes(id).then((r) => { alert(`Reprocesadas: ${r.data.reprocesadas} · imputadas: ${r.data.imputadas}`); refetch(); }).catch((e) => setError(e.response?.data?.detail || 'Error'));
  return (
    <div>
      {error && <div className="mb-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2">⚠ {error}</div>}
      <div className="mb-3 flex justify-end"><button className={btnPrimary} onClick={() => setModal({})}>Nueva regla</button></div>
      {isLoading ? <LoadingSpinner /> : (
        <div className="space-y-2">
          {reglas?.length ? reglas.map((r) => (
            <div key={r.id} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div><p className="text-sm font-semibold text-gray-800">{r.tipo} <span className="text-[10px] rounded px-1.5 py-0.5 bg-slate-100 text-slate-600 align-middle">{r.libro}</span> {!r.activo && <span className="text-xs text-gray-400">(inactiva)</span>}</p><p className="text-xs text-gray-500">{r.descripcion}</p></div>
                <div className="flex gap-2">
                  <button className="text-primary-600 text-xs hover:underline" onClick={() => reprocesar(r.id)}>reprocesar pendientes</button>
                  <button className="text-gray-600 text-xs hover:underline" onClick={() => setModal(r)}>editar</button>
                </div>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {r.lineas.map((l) => <span key={l.id} className={`text-[11px] rounded px-2 py-0.5 ${l.lado === 'debe' ? 'bg-blue-50 text-blue-700' : 'bg-orange-50 text-orange-700'}`}>{l.lado} · {l.origen_cuenta === 'derivada' ? `derivar(${l.dimension})` : l.cuenta_codigo}</span>)}
              </div>
            </div>
          )) : <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">Sin reglas.</div>}
        </div>
      )}
      {modal && <ReglaModal regla={modal.id ? modal : null} onClose={() => setModal(null)} onDone={() => { setModal(null); refetch(); }} />}
    </div>
  );
}

const LIBROS = ['patrimonial', 'presupuestaria', 'financiera', 'orden'];

function ReglaModal({ regla, initialTipo, tx, onClose, onDone }) {
  const tipoLock = !!(regla || initialTipo);
  const [f, setF] = useState({ tipo: regla?.tipo || initialTipo || '', libro: regla?.libro || 'patrimonial', descripcion: regla?.descripcion || '', activo: regla?.activo ?? true });
  const [lineas, setLineas] = useState(regla?.lineas?.length ? regla.lineas.map((l) => ({ ...l })) : [
    { orden: 1, lado: 'debe', origen_cuenta: 'fija', cuenta_codigo: '', dimension: '', importe_campo: 'importe' },
    { orden: 2, lado: 'haber', origen_cuenta: 'fija', cuenta_codigo: '', dimension: '', importe_campo: 'importe' },
  ]);
  const [msg, setMsg] = useState('');
  const setL = (i, k, v) => setLineas((p) => p.map((l, x) => (x === i ? { ...l, [k]: v } : l)));
  const m = useMutation({
    mutationFn: () => {
      const payload = { tipo: f.tipo, libro: f.libro, descripcion: f.descripcion, activo: f.activo, lineas };
      return regla ? contabilidadAPI.reglasImputacion.update(regla.id, payload) : contabilidadAPI.reglasImputacion.create(payload);
    },
    onSuccess: onDone, onError: (e) => setMsg(e.response?.data?.detail || 'Error'),
  });
  return (
    <Modal title={regla ? `Editar regla ${regla.tipo}` : initialTipo ? `Definir asiento para "${initialTipo}"` : 'Nueva regla de imputación'} onClose={onClose} wide>
      {tx && (
        <div className="mb-3 bg-blue-50 border border-blue-200 rounded-lg p-2 text-xs text-blue-800">
          Transacción de <b>{tx.origen_modulo}</b> · importe <b>{fmt(tx.importe)}</b>.
          Dimensiones disponibles para derivar cuentas: {Object.keys(tx.contexto || {}).length ? Object.keys(tx.contexto).map((k) => <code key={k} className="bg-white rounded px-1 mx-0.5">{k}</code>) : <span className="italic">ninguna</span>}.
          Al guardar la regla, esta transacción se imputa automáticamente.
        </div>
      )}
      <div className="grid grid-cols-3 gap-3 mb-3">
        <Field label="Tipo de transacción"><input className={inputClass} value={f.tipo} onChange={(e) => setF({ ...f, tipo: e.target.value })} placeholder="ej: gasto.devengado" disabled={tipoLock} /></Field>
        <Field label="Libro (RAFAM)"><select className={inputClass} value={f.libro} onChange={(e) => setF({ ...f, libro: e.target.value })} disabled={!!regla}>{LIBROS.map((l) => <option key={l} value={l}>{l}</option>)}</select></Field>
        <Field label="Descripción"><input className={inputClass} value={f.descripcion} onChange={(e) => setF({ ...f, descripcion: e.target.value })} /></Field>
      </div>
      <p className="text-xs text-gray-500 mb-1">Líneas del asiento (debe = haber):</p>
      <div className="space-y-2">
        {lineas.map((l, i) => (
          <div key={i} className="grid grid-cols-12 gap-2 items-center">
            <select className={`${inputClass} col-span-2`} value={l.lado} onChange={(e) => setL(i, 'lado', e.target.value)}><option value="debe">Debe</option><option value="haber">Haber</option></select>
            <select className={`${inputClass} col-span-3`} value={l.origen_cuenta} onChange={(e) => setL(i, 'origen_cuenta', e.target.value)}><option value="fija">Cuenta fija</option><option value="derivada">Derivada (mapeo)</option></select>
            {l.origen_cuenta === 'fija'
              ? <input className={`${inputClass} col-span-4`} placeholder="Código cuenta" value={l.cuenta_codigo || ''} onChange={(e) => setL(i, 'cuenta_codigo', e.target.value)} />
              : <input className={`${inputClass} col-span-4`} placeholder="Dimensión (ej objeto_gasto)" value={l.dimension || ''} onChange={(e) => setL(i, 'dimension', e.target.value)} />}
            <input className={`${inputClass} col-span-2`} placeholder="importe" value={l.importe_campo} onChange={(e) => setL(i, 'importe_campo', e.target.value)} />
            <button className="col-span-1 text-red-500" onClick={() => setLineas((p) => p.filter((_, x) => x !== i))}>✕</button>
          </div>
        ))}
      </div>
      <button className={`${btnSecondary} mt-2`} onClick={() => setLineas((p) => [...p, { orden: p.length + 1, lado: 'haber', origen_cuenta: 'fija', cuenta_codigo: '', dimension: '', importe_campo: 'importe' }])}>+ Línea</button>
      {msg && <p className="text-red-600 text-sm mt-2">⚠ {msg}</p>}
      <button className={`${btnPrimary} w-full mt-3`} disabled={m.isPending || !f.tipo.trim()} onClick={() => m.mutate()}>{m.isPending ? '...' : 'Guardar regla'}</button>
    </Modal>
  );
}

// ═══ MAPEO DE CUENTAS ════════════════════════════════════════════════
export function MapeoTab() {
  const qc = useQueryClient();
  const [f, setF] = useState({ dimension: '', clave: '', cuenta_codigo: '' });
  const [error, setError] = useState('');
  const { data: mapeos, isLoading } = useQuery({ queryKey: ['cont-mapeo'], queryFn: () => contabilidadAPI.mapeoCuentas.list().then((r) => r.data) });
  const refetch = () => qc.invalidateQueries({ queryKey: ['cont-mapeo'] });
  const crear = () => contabilidadAPI.mapeoCuentas.create(f).then(() => { setF({ dimension: '', clave: '', cuenta_codigo: '' }); refetch(); }).catch((e) => setError(e.response?.data?.detail || 'Error'));
  const borrar = (id) => contabilidadAPI.mapeoCuentas.delete(id).then(refetch);
  return (
    <div>
      {error && <div className="mb-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2">⚠ {error}</div>}
      <p className="text-sm text-gray-500 mb-2">Derivación de cuentas: cuando una línea de regla es "derivada", busca acá el código según la dimensión del hecho (ej. objeto_gasto → cuenta de gasto).</p>
      <div className="bg-white rounded-xl border border-gray-200 p-3 mb-3 grid grid-cols-4 gap-2 items-end">
        <Field label="Dimensión"><input className={inputClass} value={f.dimension} onChange={(e) => setF({ ...f, dimension: e.target.value })} placeholder="objeto_gasto" /></Field>
        <Field label="Clave"><input className={inputClass} value={f.clave} onChange={(e) => setF({ ...f, clave: e.target.value })} placeholder="valor del contexto" /></Field>
        <Field label="Código cuenta"><input className={inputClass} value={f.cuenta_codigo} onChange={(e) => setF({ ...f, cuenta_codigo: e.target.value })} placeholder="5.1.04" /></Field>
        <button className={btnPrimary} disabled={!f.dimension || !f.clave || !f.cuenta_codigo} onClick={crear}>Agregar</button>
      </div>
      {isLoading ? <LoadingSpinner /> : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
          <table className="min-w-full text-left text-xs">
            <thead><tr className="border-b border-gray-100 bg-gray-50/70 text-gray-500 uppercase"><th className="px-3 py-2">Dimensión</th><th className="px-3 py-2">Clave</th><th className="px-3 py-2">Cuenta</th><th></th></tr></thead>
            <tbody className="divide-y divide-gray-50">
              {mapeos?.length ? mapeos.map((m) => (
                <tr key={m.id}><td className="px-3 py-2">{m.dimension}</td><td className="px-3 py-2">{m.clave}</td><td className="px-3 py-2">{m.cuenta_codigo}</td><td className="px-3 py-2"><button className="text-red-500 hover:underline" onClick={() => borrar(m.id)}>eliminar</button></td></tr>
              )) : <tr><td colSpan={4} className="px-3 py-6 text-center text-gray-400">Sin mapeos.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
