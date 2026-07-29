import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contaduriaAPI, presupuestoAPI, comprasAPI } from '../../services/api';
import PageHeader from '../../components/common/PageHeader';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import GroupedTabBar from '../../components/common/GroupedTabBar';
import { useTabParam } from '../../hooks/useTabParam';
import { CrudTab, Modal, Field, inputClass, btnPrimary, btnSecondary } from '../../components/common/CrudComponents';

const fmt = (v) => new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(v || 0));

const ETAPAS = ['preventivado', 'comprometido', 'devengado', 'pagado'];
const ESTADO = {
  preventivado: 'bg-purple-100 text-purple-700', comprometido: 'bg-indigo-100 text-indigo-700',
  devengado: 'bg-orange-100 text-orange-700', pagado: 'bg-green-100 text-green-700',
  anulado: 'bg-gray-200 text-gray-500',
};
const ACCION = {
  preventivado: { label: 'Comprometer', doc: 'N° de orden de compra' },
  comprometido: { label: 'Devengar', doc: 'N° de factura' },
  devengado: { label: 'Pagar', doc: 'N° de orden de pago' },
};

const TABS_META = [
  { key: 'gastos', label: 'Ciclo del Gasto' },
  { key: 'retenciones', label: 'Retenciones' },
  { key: 'tiposRetencion', label: 'Tipos de Retención' },
  { key: 'rendicion', label: 'Rendición' },
  { key: 'deudaFlotante', label: 'Deuda Flotante' },
  { key: 'extracontables', label: 'Fondos de Terceros' },
];
const GRUPOS = [
  { label: 'Gasto', keys: ['gastos'] },
  { label: 'Retenciones', keys: ['retenciones', 'tiposRetencion'] },
  { label: 'Reportes', keys: ['rendicion', 'deudaFlotante'] },
  { label: 'Extracontable', keys: ['extracontables'] },
];

export default function Contaduria() {
  const [tab, setTab] = useTabParam('gastos');
  return (
    <div>
      <PageHeader title="Contaduría" subtitle="Ciclo del gasto, retenciones, rendición de cuentas y fondos de terceros" />
      <GroupedTabBar grupos={GRUPOS} tabsMeta={TABS_META} tab={tab} setTab={setTab} />
      {tab === 'gastos' && <GastosTab />}
      {tab === 'retenciones' && <RetencionesTab />}
      {tab === 'tiposRetencion' && <TiposRetencionTab />}
      {tab === 'rendicion' && <RendicionTab />}
      {tab === 'deudaFlotante' && <DeudaFlotanteTab />}
      {tab === 'extracontables' && <ExtracontablesTab />}
    </div>
  );
}

// ── Ciclo del gasto ─────────────────────────────────────────────────
function GastosTab() {
  const qc = useQueryClient();
  const [modal, setModal] = useState(null); // 'nuevo' | {avanzar: g} | {anular: g}
  const [error, setError] = useState('');
  const [adv, setAdv] = useState('');

  const { data: gastos, isLoading } = useQuery({
    queryKey: ['conta-gastos'],
    queryFn: () => contaduriaAPI.gastos.list({ limit: 100 }).then((r) => r.data),
  });
  const refetch = () => {
    qc.invalidateQueries({ queryKey: ['conta-gastos'] });
    qc.invalidateQueries({ queryKey: ['presu-partidas'] });
  };

  return (
    <div>
      {error && (
        <div className="mb-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2 flex items-center justify-between">
          <span>⚠ {error}</span><button onClick={() => setError('')} className="text-red-500">✕</button>
        </div>
      )}
      {adv && (
        <div className="mb-3 bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-lg px-4 py-2 flex items-center justify-between">
          <span>⚠ {adv}</span><button onClick={() => setAdv('')} className="text-amber-600">✕</button>
        </div>
      )}
      <div className="mb-3 flex justify-end">
        <button className={btnPrimary} onClick={() => setModal('nuevo')}>Nuevo gasto (reserva preventivo)</button>
      </div>

      {isLoading ? <LoadingSpinner /> : (
        <div className="space-y-2">
          {gastos?.length ? gastos.map((g) => (
            <div key={g.id} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-800">{g.expediente} — {g.descripcion}</p>
                  <p className="text-xs text-gray-500">
                    {g.partida || `partida ${g.id_partida}`}{g.proveedor ? ` · ${g.proveedor}` : ''}
                    {g.oc_numero ? ` · OC ${g.oc_numero}` : ''}{g.factura_numero ? ` · FC ${g.factura_numero}` : ''}{g.op_numero ? ` · OP ${g.op_numero}` : ''}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-800">{fmt(g.importe)}</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${ESTADO[g.estado]}`}>{g.estado}</span>
                  {ACCION[g.estado] && (
                    <button className={btnPrimary.replace('px-4 py-2', 'px-3 py-1.5')} onClick={() => setModal({ avanzar: g })}>{ACCION[g.estado].label}</button>
                  )}
                  {['devengado', 'pagado'].includes(g.estado) && (
                    <button className={btnSecondary} onClick={() => setModal({ retener: g })}>Retenciones</button>
                  )}
                  {['preventivado', 'comprometido'].includes(g.estado) && (
                    <button className={btnSecondary} onClick={() => setModal({ anular: g })}>Anular</button>
                  )}
                </div>
              </div>
              {/* stepper */}
              <div className="flex items-center gap-1 mt-3">
                {ETAPAS.map((e, i) => {
                  const idx = ETAPAS.indexOf(g.estado);
                  const done = g.estado !== 'anulado' && idx >= i;
                  return (
                    <div key={e} className="flex items-center flex-1 min-w-0">
                      <div className={`w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold ${done ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'}`}>{i + 1}</div>
                      <span className={`ml-1 text-[10px] truncate ${done ? 'text-primary-700 font-medium' : 'text-gray-400'}`}>{e}</span>
                      {i < ETAPAS.length - 1 && <div className={`flex-1 h-0.5 mx-1 ${done && idx > i ? 'bg-primary-400' : 'bg-gray-200'}`} />}
                    </div>
                  );
                })}
              </div>
              {g.historial?.length > 0 && (
                <p className="text-[10px] text-gray-400 mt-2">
                  {g.historial.map((h) => `${h.etapa} · ${h.usuario} · ${h.fecha ? new Date(h.fecha).toLocaleString() : ''}`).join('  →  ')}
                </p>
              )}
            </div>
          )) : <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">Sin expedientes de gasto. Creá el primero.</div>}
        </div>
      )}

      {modal === 'nuevo' && <NuevoGastoModal onClose={() => setModal(null)} onDone={(r) => { setModal(null); refetch(); if (r?.advertencia) setAdv(r.advertencia); }} />}
      {modal?.avanzar && <AvanzarModal gasto={modal.avanzar} onClose={() => setModal(null)}
        onDone={(r) => { setModal(null); refetch(); const a = r?.advertencia || (r?.advertencias_cuota || []).join('; ') || r?.contabilidad_aviso; if (a) setAdv(a); }}
        onError={(m) => { setError(m); setModal(null); }} />}
      {modal?.retener && <RetenerModal gasto={modal.retener} onClose={() => setModal(null)}
        onDone={() => { setModal(null); qc.invalidateQueries({ queryKey: ['conta-retenciones'] }); }}
        onError={(m) => { setError(m); setModal(null); }} />}
      {modal?.anular && <AnularModal gasto={modal.anular} onClose={() => setModal(null)}
        onDone={() => { setModal(null); refetch(); }} onError={(m) => { setError(m); setModal(null); }} />}
    </div>
  );
}

function NuevoGastoModal({ onClose, onDone }) {
  const { data: ejercicios } = useQuery({
    queryKey: ['presu-ejercicios'],
    queryFn: () => presupuestoAPI.ejercicios.list({ limit: 50 }).then((r) => r.data),
  });
  const vigentes = (ejercicios || []).filter((e) => e.estado === 'vigente');
  const [anio, setAnio] = useState(null);
  const anioSel = anio ?? vigentes[0]?.anio ?? null;
  const { data: partidas } = useQuery({
    queryKey: ['conta-partidas', anioSel],
    queryFn: () => presupuestoAPI.partidas.list({ anio: anioSel, limit: 200 }).then((r) => r.data),
    enabled: !!anioSel,
  });
  const [f, setF] = useState({ id_partida: '', importe: '', descripcion: '', proveedor: '' });
  const [msg, setMsg] = useState('');
  const partidaSel = partidas?.find((p) => p.id === Number(f.id_partida));
  const m = useMutation({
    mutationFn: () => contaduriaAPI.gastos.create({
      anio: anioSel, id_partida: Number(f.id_partida), importe: Number(f.importe),
      descripcion: f.descripcion, proveedor: f.proveedor || null,
    }),
    onSuccess: (r) => onDone(r.data),
    onError: (e) => setMsg(e.response?.data?.detail || 'Error al crear el gasto'),
  });
  return (
    <Modal title="Nuevo gasto — reserva el preventivo en Presupuesto" onClose={onClose} wide>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field label="Ejercicio (vigente)">
          <select className={inputClass} value={anioSel || ''} onChange={(e) => setAnio(Number(e.target.value))}>
            {vigentes.map((e) => <option key={e.anio} value={e.anio}>{e.anio}</option>)}
          </select>
        </Field>
        <Field label="Partida presupuestaria">
          <select className={inputClass} value={f.id_partida} onChange={(e) => setF({ ...f, id_partida: e.target.value })}>
            <option value="">Seleccionar...</option>
            {partidas?.map((p) => (
              <option key={p.id} value={p.id}>
                {p.jurisdiccion?.codigo} · {p.estructura?.codigo} · {p.objeto_gasto?.codigo} · {p.fuente?.codigo} (disp. {fmt(p.disponible)})
              </option>
            ))}
          </select>
        </Field>
        <Field label="Descripción del gasto"><input className={inputClass} value={f.descripcion} onChange={(e) => setF({ ...f, descripcion: e.target.value })} placeholder="ej: Compra de insumos de oficina" /></Field>
        <Field label="Proveedor (opcional)"><input className={inputClass} value={f.proveedor} onChange={(e) => setF({ ...f, proveedor: e.target.value })} /></Field>
        <Field label="Importe"><input type="number" className={inputClass} value={f.importe} onChange={(e) => setF({ ...f, importe: e.target.value })} /></Field>
      </div>
      {partidaSel && (
        <p className={`text-xs mt-2 ${Number(f.importe) > partidaSel.disponible ? 'text-red-600' : 'text-gray-500'}`}>
          Disponible de la partida: {fmt(partidaSel.disponible)}{Number(f.importe) > partidaSel.disponible ? ' — el importe lo supera' : ''}
        </p>
      )}
      {msg && <p className="text-red-600 text-sm mt-2">⚠ {msg}</p>}
      <button className={`${btnPrimary} w-full mt-3`} disabled={m.isPending || !f.id_partida || !f.descripcion.trim() || !(Number(f.importe) > 0)} onClick={() => m.mutate()}>
        {m.isPending ? 'Reservando crédito...' : 'Crear y reservar preventivo'}
      </button>
    </Modal>
  );
}

function AvanzarModal({ gasto, onClose, onDone, onError }) {
  const acc = ACCION[gasto.estado];
  const esCompromiso = gasto.estado === 'preventivado';
  const esDevengar = gasto.estado === 'comprometido';
  const esPagar = gasto.estado === 'devengado';
  const [documento, setDocumento] = useState('');
  const [importe, setImporte] = useState(String(gasto.importe));
  const [idOc, setIdOc] = useState('');
  // retenciones opcionales en el paso de devengar/pagar
  const [retSel, setRetSel] = useState([]); // ids de tipo elegidos
  const { data: tipos } = useQuery({
    queryKey: ['conta-tipos-retencion'],
    queryFn: () => contaduriaAPI.tiposRetencion.list({ limit: 200 }).then((r) => r.data),
    enabled: esDevengar || esPagar,
  });
  const { data: ocs } = useQuery({
    queryKey: ['conta-ocs-comprometibles'],
    queryFn: () => comprasAPI.ordenesCompra.list({ solo_comprometibles: true, limit: 100 }).then((r) => r.data),
    enabled: esCompromiso,
  });
  const ocSel = ocs?.find((o) => String(o.id) === String(idOc));
  const baseRet = Number(importe) || Number(gasto.importe) || 0;
  const previa = (tipos || []).filter((t) => retSel.includes(t.id)).map((t) => {
    const bajoMin = t.minimo_no_imponible != null && baseRet < Number(t.minimo_no_imponible);
    const imp = bajoMin ? 0 : Math.round((baseRet * Number(t.alicuota)) / 100 * 100) / 100;
    return { t, imp };
  });
  const totalRet = previa.reduce((a, p) => a + p.imp, 0);

  const m = useMutation({
    mutationFn: async () => {
      const r = await contaduriaAPI.gastos.avanzar(gasto.id, idOc ? { id_oc_compras: Number(idOc) } : { documento, importe: Number(importe) });
      if (retSel.length) {
        await contaduriaAPI.gastos.aplicarRetenciones(gasto.id, {
          retenciones: retSel.map((id) => ({ id_tipo_retencion: id })),
          comprobante: documento || undefined,
        }).catch(() => {});
      }
      return r;
    },
    onSuccess: (r) => onDone(r.data),
    onError: (e) => onError(e.response?.data?.detail || 'Error'),
  });
  const listo = idOc || (documento.trim() && Number(importe) > 0);
  const toggle = (id) => setRetSel((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);
  return (
    <Modal title={`${acc.label} — ${gasto.expediente}`} onClose={onClose} wide={esDevengar || esPagar}>
      <div className="space-y-3">
        <p className="text-sm text-gray-500">{gasto.descripcion} · {fmt(gasto.importe)}</p>
        {esCompromiso && (
          <Field label="Orden de compra (de Compras) — autocompleta nro. e importe">
            <select className={inputClass} value={idOc} onChange={(e) => setIdOc(e.target.value)}>
              <option value="">— cargar manualmente —</option>
              {ocs?.filter((o) => !o.comprometida).map((o) => <option key={o.id} value={o.id}>{o.orden_compra} · {o.proveedor?.nombre} · {fmt(o.total)}</option>)}
            </select>
          </Field>
        )}
        {ocSel ? (
          <p className="text-xs text-blue-600">Se comprometerá {fmt(ocSel.total)} con {ocSel.orden_compra}</p>
        ) : (
          <>
            <Field label={acc.doc}><input className={inputClass} value={documento} onChange={(e) => setDocumento(e.target.value)} /></Field>
            <Field label="Importe de la etapa"><input type="number" className={inputClass} value={importe} onChange={(e) => setImporte(e.target.value)} /></Field>
          </>
        )}
        {(esDevengar || esPagar) && (
          <div className="border-t pt-3">
            <p className="text-sm font-medium text-gray-700 mb-2">Retenciones a aplicar (opcional)</p>
            {tipos?.length ? (
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {tipos.map((t) => {
                  const p = previa.find((x) => x.t.id === t.id);
                  return (
                    <label key={t.id} className="flex items-center gap-2 text-sm">
                      <input type="checkbox" checked={retSel.includes(t.id)} onChange={() => toggle(t.id)} className="w-4 h-4 rounded" />
                      <span className="flex-1">{t.codigo} · {t.nombre} <span className="text-gray-400">({t.regimen} {Number(t.alicuota)}% s/{t.base})</span></span>
                      {p && <span className="text-xs font-semibold text-orange-600">{fmt(p.imp)}</span>}
                    </label>
                  );
                })}
              </div>
            ) : <p className="text-xs text-gray-400">No hay tipos de retención cargados.</p>}
            {retSel.length > 0 && <p className="text-xs text-gray-600 mt-2">Total a retener: <b>{fmt(totalRet)}</b> (neto a pagar aprox. {fmt(baseRet - totalRet)})</p>}
          </div>
        )}
        <button className={`${btnPrimary} w-full`} disabled={m.isPending || !listo} onClick={() => m.mutate()}>
          {m.isPending ? 'Registrando en presupuesto...' : `Confirmar: ${acc.label}`}
        </button>
      </div>
    </Modal>
  );
}

// Modal para aplicar retenciones a un gasto ya devengado/pagado
function RetenerModal({ gasto, onClose, onDone, onError }) {
  const [retSel, setRetSel] = useState([]);
  const [comprobante, setComprobante] = useState(gasto.factura_numero || '');
  const [cuit, setCuit] = useState('');
  const { data: tipos } = useQuery({
    queryKey: ['conta-tipos-retencion'],
    queryFn: () => contaduriaAPI.tiposRetencion.list({ limit: 200 }).then((r) => r.data),
  });
  const { data: aplicadas } = useQuery({
    queryKey: ['conta-ret-gasto', gasto.id],
    queryFn: () => contaduriaAPI.gastos.retenciones(gasto.id).then((r) => r.data),
  });
  const base = Number(gasto.importe) || 0;
  const previa = (tipos || []).filter((t) => retSel.includes(t.id)).map((t) => {
    const bajoMin = t.minimo_no_imponible != null && base < Number(t.minimo_no_imponible);
    return { t, imp: bajoMin ? 0 : Math.round((base * Number(t.alicuota)) / 100 * 100) / 100 };
  });
  const m = useMutation({
    mutationFn: () => contaduriaAPI.gastos.aplicarRetenciones(gasto.id, {
      retenciones: retSel.map((id) => ({ id_tipo_retencion: id })),
      comprobante: comprobante || undefined, cuit_beneficiario: cuit || undefined,
    }),
    onSuccess: onDone,
    onError: (e) => onError(e.response?.data?.detail || 'Error'),
  });
  const toggle = (id) => setRetSel((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);
  return (
    <Modal title={`Retenciones — ${gasto.expediente}`} onClose={onClose} wide>
      <div className="space-y-3">
        <p className="text-sm text-gray-500">{gasto.descripcion} · base {fmt(base)}{gasto.proveedor ? ` · ${gasto.proveedor}` : ''}</p>
        {aplicadas?.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-2 text-xs text-gray-600">
            Ya aplicadas: {aplicadas.map((r) => `${r.tipo_codigo} ${fmt(r.importe)}`).join(' · ')}
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Comprobante"><input className={inputClass} value={comprobante} onChange={(e) => setComprobante(e.target.value)} /></Field>
          <Field label="CUIT beneficiario (para TXT AFIP/ARBA)"><input className={inputClass} value={cuit} onChange={(e) => setCuit(e.target.value)} placeholder="20-12345678-9" /></Field>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Tipos a aplicar</p>
          {tipos?.length ? tipos.map((t) => {
            const p = previa.find((x) => x.t.id === t.id);
            return (
              <label key={t.id} className="flex items-center gap-2 text-sm py-0.5">
                <input type="checkbox" checked={retSel.includes(t.id)} onChange={() => toggle(t.id)} className="w-4 h-4 rounded" />
                <span className="flex-1">{t.codigo} · {t.nombre} <span className="text-gray-400">({t.regimen} {Number(t.alicuota)}% s/{t.base})</span></span>
                {p && <span className="text-xs font-semibold text-orange-600">{fmt(p.imp)}</span>}
              </label>
            );
          }) : <p className="text-xs text-gray-400">No hay tipos de retención cargados.</p>}
        </div>
        <button className={`${btnPrimary} w-full`} disabled={m.isPending || !retSel.length} onClick={() => m.mutate()}>
          {m.isPending ? 'Registrando...' : 'Registrar retenciones'}
        </button>
      </div>
    </Modal>
  );
}

function AnularModal({ gasto, onClose, onDone, onError }) {
  const [motivo, setMotivo] = useState('');
  const m = useMutation({
    mutationFn: () => contaduriaAPI.gastos.anular(gasto.id, motivo),
    onSuccess: onDone,
    onError: (e) => onError(e.response?.data?.detail || 'Error'),
  });
  return (
    <Modal title={`Anular ${gasto.expediente}`} onClose={onClose}>
      <div className="space-y-3">
        <p className="text-sm text-gray-500">Libera la reserva de crédito en Presupuesto (contra-movimiento).</p>
        <Field label="Motivo"><input className={inputClass} value={motivo} onChange={(e) => setMotivo(e.target.value)} /></Field>
        <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium w-full" disabled={m.isPending} onClick={() => m.mutate()}>
          {m.isPending ? 'Anulando...' : 'Anular y liberar crédito'}
        </button>
      </div>
    </Modal>
  );
}

// ── Retenciones aplicadas (listado + export TXT) ────────────────────
const REGIMENES = ['iibb', 'ganancias', 'iva', 'sijp', 'otros'];

function RetencionesTab() {
  const [regimen, setRegimen] = useState('');
  const [periodo, setPeriodo] = useState('');
  const { data, isLoading } = useQuery({
    queryKey: ['conta-retenciones', regimen, periodo],
    queryFn: () => contaduriaAPI.retenciones.list({
      limit: 200, ...(regimen ? { regimen } : {}), ...(periodo ? { periodo } : {}),
    }).then((r) => r.data),
  });
  const exportar = async () => {
    const r = await contaduriaAPI.retenciones.exportTxt({ ...(regimen ? { regimen } : {}), ...(periodo ? { periodo } : {}) });
    const blob = new Blob([r.data], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `retenciones_${regimen || 'todos'}_${periodo || 'todo'}.txt`;
    a.click(); URL.revokeObjectURL(url);
  };
  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-2 items-end justify-between">
        <div className="flex gap-2">
          <label className="text-sm">Régimen
            <select className={inputClass} value={regimen} onChange={(e) => setRegimen(e.target.value)}>
              <option value="">Todos</option>
              {REGIMENES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </label>
          <label className="text-sm">Período (AAAAMM)
            <input className={inputClass} value={periodo} onChange={(e) => setPeriodo(e.target.value)} placeholder="202606" />
          </label>
        </div>
        <button className={btnPrimary} onClick={exportar}>Exportar TXT (AFIP/ARBA)</button>
      </div>
      {isLoading ? <LoadingSpinner /> : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 text-xs">
              <tr><th className="text-left px-3 py-2">Gasto</th><th className="text-left px-3 py-2">Tipo</th><th className="text-left px-3 py-2">Régimen</th><th className="text-left px-3 py-2">Período</th><th className="text-right px-3 py-2">Base</th><th className="text-right px-3 py-2">Alíc.</th><th className="text-right px-3 py-2">Retenido</th><th className="text-left px-3 py-2">Beneficiario</th></tr>
            </thead>
            <tbody>
              {data?.length ? data.map((r) => (
                <tr key={r.id} className="border-t border-gray-100">
                  <td className="px-3 py-2">#{r.id_gasto}</td>
                  <td className="px-3 py-2">{r.tipo_codigo}</td>
                  <td className="px-3 py-2">{r.regimen}</td>
                  <td className="px-3 py-2">{r.periodo}</td>
                  <td className="px-3 py-2 text-right">{fmt(r.base_calculo)}</td>
                  <td className="px-3 py-2 text-right">{Number(r.alicuota || 0)}%</td>
                  <td className="px-3 py-2 text-right font-semibold text-orange-600">{fmt(r.importe)}</td>
                  <td className="px-3 py-2">{r.beneficiario || r.cuit_beneficiario || '—'}</td>
                </tr>
              )) : <tr><td colSpan={8} className="px-3 py-8 text-center text-gray-500">Sin retenciones registradas.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── Tipos de retención (CRUD) ───────────────────────────────────────
function TiposRetencionTab() {
  return (
    <CrudTab
      queryKey="conta-tipos-retencion"
      entityName="tipo de retención"
      apiFns={contaduriaAPI.tiposRetencion}
      wide
      columns={[
        { key: 'codigo', label: 'Código' },
        { key: 'nombre', label: 'Nombre' },
        { key: 'regimen', label: 'Régimen' },
        { key: 'alicuota', label: 'Alícuota %', render: (v) => Number(v) },
        { key: 'base', label: 'Base' },
        { key: 'minimo_no_imponible', label: 'Mín. no imp.', render: (v) => v != null ? fmt(v) : '—' },
      ]}
      formFields={[
        { key: 'codigo', label: 'Código', required: true },
        { key: 'nombre', label: 'Nombre', required: true },
        { key: 'regimen', label: 'Régimen', type: 'select', required: true, defaultValue: 'otros',
          options: REGIMENES.map((r) => ({ value: r, label: r })) },
        { key: 'alicuota', label: 'Alícuota (%)', type: 'decimal', required: true, defaultValue: 0 },
        { key: 'base', label: 'Base', type: 'select', required: true, defaultValue: 'neto',
          options: [{ value: 'neto', label: 'neto' }, { value: 'total', label: 'total' }] },
        { key: 'minimo_no_imponible', label: 'Mínimo no imponible', type: 'decimal' },
        { key: 'activo', label: 'Activo', type: 'boolean', defaultValue: true },
      ]}
    />
  );
}

// ── Rendición de cuentas ────────────────────────────────────────────
function RendicionTab() {
  const anioActual = new Date().getFullYear();
  const [anio, setAnio] = useState(anioActual);
  const [trimestre, setTrimestre] = useState('');
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['conta-rendicion', anio, trimestre],
    queryFn: () => contaduriaAPI.rendicion({ anio, ...(trimestre ? { trimestre } : {}) }).then((r) => r.data),
    enabled: false,
  });
  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-2 items-end">
        <label className="text-sm">Año<input type="number" className={inputClass} value={anio} onChange={(e) => setAnio(Number(e.target.value))} /></label>
        <label className="text-sm">Trimestre
          <select className={inputClass} value={trimestre} onChange={(e) => setTrimestre(e.target.value)}>
            <option value="">Anual</option>{[1, 2, 3, 4].map((t) => <option key={t} value={t}>{t}°</option>)}
          </select>
        </label>
        <button className={btnPrimary} onClick={() => refetch()}>Generar</button>
      </div>
      {isLoading || isFetching ? <LoadingSpinner /> : data ? (
        <div className="space-y-4">
          {data.aviso && <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-lg px-3 py-2">⚠ {data.aviso}</div>}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-sm font-semibold text-gray-700 mb-2">Ejecución por etapa ({data.expedientes} expedientes)</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {ETAPAS.map((e) => (
                <div key={e} className="rounded-lg bg-gray-50 p-3">
                  <p className="text-[11px] text-gray-500 uppercase">{e}</p>
                  <p className="text-sm font-bold text-gray-800">{fmt(data.por_etapa?.[e])}</p>
                </div>
              ))}
            </div>
          </div>
          <RendicionTabla titulo="Por objeto del gasto" keyName="objeto" rows={data.por_objeto_gasto} />
          <RendicionTabla titulo="Por jurisdicción" keyName="jurisdiccion" rows={data.por_jurisdiccion} />
        </div>
      ) : <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">Elegí año y presioná Generar.</div>}
    </div>
  );
}

function RendicionTabla({ titulo, keyName, rows }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
      <p className="text-sm font-semibold text-gray-700 px-4 pt-3">{titulo}</p>
      <table className="w-full text-sm mt-2">
        <thead className="bg-gray-50 text-gray-600 text-xs">
          <tr><th className="text-left px-3 py-2">{titulo.replace('Por ', '')}</th>{ETAPAS.map((e) => <th key={e} className="text-right px-3 py-2">{e}</th>)}</tr>
        </thead>
        <tbody>
          {rows?.length ? rows.map((r, i) => (
            <tr key={i} className="border-t border-gray-100">
              <td className="px-3 py-2">{r[keyName]}</td>
              {ETAPAS.map((e) => <td key={e} className="px-3 py-2 text-right">{fmt(r[e])}</td>)}
            </tr>
          )) : <tr><td colSpan={5} className="px-3 py-6 text-center text-gray-400">Sin datos.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}

// ── Deuda flotante ──────────────────────────────────────────────────
function DeudaFlotanteTab() {
  const [anio, setAnio] = useState(new Date().getFullYear());
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['conta-deuda-flotante', anio],
    queryFn: () => contaduriaAPI.deudaFlotante({ anio }).then((r) => r.data),
    enabled: false,
  });
  return (
    <div>
      <div className="mb-3 flex gap-2 items-end">
        <label className="text-sm">Año<input type="number" className={inputClass} value={anio} onChange={(e) => setAnio(Number(e.target.value))} /></label>
        <button className={btnPrimary} onClick={() => refetch()}>Consultar</button>
      </div>
      {isLoading || isFetching ? <LoadingSpinner /> : data ? (
        <div>
          <div className="mb-3 bg-white rounded-xl border border-gray-200 p-4 flex justify-between">
            <span className="text-sm text-gray-500">{data.cantidad} gastos devengados impagos al cierre {data.anio}</span>
            <span className="text-lg font-bold text-orange-600">{fmt(data.total)}</span>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 text-xs">
                <tr><th className="text-left px-3 py-2">Expediente</th><th className="text-left px-3 py-2">Descripción</th><th className="text-left px-3 py-2">Proveedor</th><th className="text-left px-3 py-2">Factura</th><th className="text-right px-3 py-2">Importe</th></tr>
              </thead>
              <tbody>
                {data.items?.length ? data.items.map((g) => (
                  <tr key={g.id} className="border-t border-gray-100">
                    <td className="px-3 py-2">{g.expediente}</td>
                    <td className="px-3 py-2">{g.descripcion}</td>
                    <td className="px-3 py-2">{g.proveedor || '—'}</td>
                    <td className="px-3 py-2">{g.factura_numero || '—'}</td>
                    <td className="px-3 py-2 text-right font-semibold">{fmt(g.importe)}</td>
                  </tr>
                )) : <tr><td colSpan={5} className="px-3 py-8 text-center text-gray-500">Sin deuda flotante.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      ) : <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">Elegí año y consultá.</div>}
    </div>
  );
}

// ── Fondos de terceros / extracontables ─────────────────────────────
function ExtracontablesTab() {
  const { data: saldos } = useQuery({
    queryKey: ['conta-extra-saldos'],
    queryFn: () => contaduriaAPI.extracontables.saldos().then((r) => r.data),
  });
  return (
    <div>
      {saldos?.length > 0 && (
        <div className="mb-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
          {saldos.map((s) => (
            <div key={s.concepto} className="bg-white rounded-xl border border-gray-200 p-3">
              <p className="text-[11px] text-gray-500 truncate">{s.concepto}</p>
              <p className={`text-sm font-bold ${s.saldo < 0 ? 'text-red-600' : 'text-gray-800'}`}>{fmt(s.saldo)}</p>
              <p className="text-[10px] text-gray-400">{s.movimientos} mov.</p>
            </div>
          ))}
        </div>
      )}
      <CrudTab
        queryKey="conta-extracontables"
        entityName="movimiento"
        apiFns={contaduriaAPI.extracontables}
        wide
        columns={[
          { key: 'concepto', label: 'Concepto' },
          { key: 'tipo', label: 'Tipo' },
          { key: 'importe', label: 'Importe', render: (v) => fmt(v) },
          { key: 'beneficiario', label: 'Beneficiario' },
          { key: 'referencia', label: 'Referencia' },
          { key: 'fecha', label: 'Fecha' },
        ]}
        formFields={[
          { key: 'concepto', label: 'Concepto', required: true },
          { key: 'tipo', label: 'Tipo', type: 'select', required: true, defaultValue: 'ingreso',
            options: [{ value: 'ingreso', label: 'ingreso' }, { value: 'egreso', label: 'egreso' }] },
          { key: 'importe', label: 'Importe', type: 'decimal', required: true },
          { key: 'beneficiario', label: 'Beneficiario' },
          { key: 'referencia', label: 'Referencia' },
          { key: 'fecha', label: 'Fecha', type: 'date' },
          { key: 'observaciones', label: 'Observaciones', type: 'textarea' },
        ]}
      />
    </div>
  );
}
