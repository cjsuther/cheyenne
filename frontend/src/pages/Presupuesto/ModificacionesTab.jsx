import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { presupuestoAPI } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Modal, Field, inputClass, btnPrimary, btnSecondary } from '../../components/common/CrudComponents';

const fmt = (v) => new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(v || 0));

const ESTADO = {
  borrador: 'bg-amber-100 text-amber-700',
  aprobada: 'bg-green-100 text-green-700',
  anulada: 'bg-red-100 text-red-600',
};
const TIPOS = [
  { v: 'compensacion', l: 'Compensación (Σ = 0)' },
  { v: 'ampliacion', l: 'Ampliación (+)' },
  { v: 'reduccion', l: 'Reducción (−)' },
];

export default function ModificacionesTab() {
  const qc = useQueryClient();
  const [anio, setAnio] = useState(null);
  const [modal, setModal] = useState(null); // 'nueva' | {det: id}
  const [error, setError] = useState('');

  const { data: ejercicios } = useQuery({
    queryKey: ['presu-ejercicios'],
    queryFn: () => presupuestoAPI.ejercicios.list({ limit: 50 }).then((r) => r.data),
  });
  const modificables = (ejercicios || []).filter((e) => ['aprobado', 'vigente'].includes(e.estado));
  const anioSel = anio ?? modificables[0]?.anio ?? ejercicios?.[0]?.anio ?? null;
  const ejercicio = ejercicios?.find((e) => e.anio === anioSel);
  const habilitado = ['aprobado', 'vigente'].includes(ejercicio?.estado);

  const { data: lista, isLoading } = useQuery({
    queryKey: ['presu-modifs', anioSel],
    queryFn: () => presupuestoAPI.modificaciones.list({ anio: anioSel, limit: 100 }).then((r) => r.data),
    enabled: !!anioSel,
  });
  const refetch = () => {
    qc.invalidateQueries({ queryKey: ['presu-modifs', anioSel] });
    qc.invalidateQueries({ queryKey: ['presu-partidas', anioSel] });
  };

  if (!ejercicios) return <LoadingSpinner />;

  return (
    <div>
      {error && (
        <div className="mb-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2 flex items-center justify-between">
          <span>⚠ {error}</span><button onClick={() => setError('')} className="text-red-500">✕</button>
        </div>
      )}
      <div className="mb-3 flex items-center gap-2 flex-wrap">
        <select className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm" value={anioSel || ''} onChange={(e) => setAnio(Number(e.target.value))}>
          {ejercicios.map((e) => <option key={e.anio} value={e.anio}>{e.anio} — {e.estado}</option>)}
        </select>
        {!habilitado && <span className="text-xs text-amber-600">Las modificaciones aplican a ejercicios aprobados o vigentes</span>}
        {habilitado && <button className={`${btnPrimary} ml-auto`} onClick={() => setModal('nueva')}>Nueva modificación</button>}
      </div>

      {isLoading ? <LoadingSpinner /> : (
        <div className="space-y-2">
          {lista?.length ? lista.map((m) => (
            <div key={m.id} className="bg-white rounded-xl border border-gray-200 p-4 cursor-pointer hover:border-primary-200" onClick={() => setModal({ det: m.id })}>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="font-bold text-gray-800">{m.numero ? `MOD-${m.anio}-${String(m.numero).padStart(4, '0')}` : 'Borrador'}</span>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${ESTADO[m.estado]}`}>{m.estado}</span>
                <span className="text-xs text-gray-500 capitalize">{m.tipo}</span>
                <span className="text-xs text-gray-500">{m.acto_administrativo}</span>
                <span className="ml-auto text-sm">
                  {m.total_ampliado > 0 && <span className="text-green-700 mr-2">+{fmt(m.total_ampliado)}</span>}
                  {m.total_reducido < 0 && <span className="text-red-600">{fmt(m.total_reducido)}</span>}
                </span>
              </div>
              <p className="text-[11px] text-gray-400 mt-1">
                {m.cantidad_items} ítems · creada por {m.creado_por}
                {m.aprobado_por && ` · aprobada por ${m.aprobado_por} (${new Date(m.fecha_aprobacion).toLocaleString()})`}
                {m.anulado_por && ` · anulada por ${m.anulado_por}`}
              </p>
            </div>
          )) : (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">Sin modificaciones en {anioSel}.</div>
          )}
        </div>
      )}

      {modal === 'nueva' && <AsistenteModal anio={anioSel} onClose={() => setModal(null)} onDone={() => { setModal(null); refetch(); }} />}
      {modal?.det && <DetalleModal id={modal.det} onClose={() => setModal(null)} onChange={refetch} onError={setError} />}
    </div>
  );
}

// ── Asistente de 3 pasos ─────────────────────────────────────────────
function AsistenteModal({ anio, onClose, onDone }) {
  const [paso, setPaso] = useState(1);
  const [cab, setCab] = useState({ tipo: 'compensacion', acto_administrativo: '', expediente: '', observaciones: '' });
  const [items, setItems] = useState([{ id_partida: '', importe: '', detalle: '' }]);
  const [msg, setMsg] = useState('');

  const { data: partidas } = useQuery({
    queryKey: ['presu-partidas', anio],
    queryFn: () => presupuestoAPI.partidas.list({ anio, limit: 200 }).then((r) => r.data),
  });

  const etiqueta = (p) => `${p.jurisdiccion?.codigo} · ${p.estructura?.codigo} · ${p.objeto_gasto?.codigo} · ${p.fuente?.codigo}${p.descripcion ? ` — ${p.descripcion}` : ''}`;
  const setItem = (i, k, v) => setItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, [k]: v } : it)));
  const filasValidas = items.filter((it) => it.id_partida && Number(it.importe) !== 0 && it.detalle.trim());
  const suma = useMemo(() => filasValidas.reduce((s, it) => s + Number(it.importe || 0), 0), [items]);

  const balanceOk = cab.tipo !== 'compensacion' || Math.abs(suma) < 0.005;
  const signosOk = cab.tipo === 'compensacion'
    || (cab.tipo === 'ampliacion' && filasValidas.every((it) => Number(it.importe) > 0))
    || (cab.tipo === 'reduccion' && filasValidas.every((it) => Number(it.importe) < 0));

  const disponibleDe = (idp) => partidas?.find((p) => p.id === Number(idp))?.disponible;

  const crear = useMutation({
    mutationFn: () => presupuestoAPI.modificaciones.create({
      anio, ...cab,
      items: filasValidas.map((it) => ({ id_partida: Number(it.id_partida), importe: Number(it.importe), detalle: it.detalle })),
    }),
    onSuccess: onDone,
    onError: (e) => setMsg(e.response?.data?.detail || 'Error al crear'),
  });

  return (
    <Modal title={`Nueva modificación — Ejercicio ${anio} (paso ${paso}/3)`} onClose={onClose} wide>
      {paso === 1 && (
        <div className="space-y-3">
          <Field label="Tipo">
            <select className={inputClass} value={cab.tipo} onChange={(e) => setCab({ ...cab, tipo: e.target.value })}>
              {TIPOS.map((t) => <option key={t.v} value={t.v}>{t.l}</option>)}
            </select>
          </Field>
          <Field label="Acto administrativo (decreto / resolución) — obligatorio">
            <input className={inputClass} value={cab.acto_administrativo} onChange={(e) => setCab({ ...cab, acto_administrativo: e.target.value })} placeholder="ej: Decreto 56/2026" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Expediente (opcional)"><input className={inputClass} value={cab.expediente} onChange={(e) => setCab({ ...cab, expediente: e.target.value })} /></Field>
            <Field label="Observaciones"><input className={inputClass} value={cab.observaciones} onChange={(e) => setCab({ ...cab, observaciones: e.target.value })} /></Field>
          </div>
          <button className={`${btnPrimary} w-full`} disabled={!cab.acto_administrativo.trim()} onClick={() => setPaso(2)}>Continuar → Ítems</button>
        </div>
      )}

      {paso === 2 && (
        <div className="space-y-3">
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {items.map((it, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 items-center">
                <select className={`${inputClass} col-span-6 text-xs`} value={it.id_partida} onChange={(e) => setItem(i, 'id_partida', e.target.value)}>
                  <option value="">Partida...</option>
                  {partidas?.map((p) => <option key={p.id} value={p.id}>{etiqueta(p)}</option>)}
                </select>
                <input type="number" className={`${inputClass} col-span-2`} placeholder="± importe" value={it.importe} onChange={(e) => setItem(i, 'importe', e.target.value)} />
                <input className={`${inputClass} col-span-3`} placeholder="Detalle (oblig.)" value={it.detalle} onChange={(e) => setItem(i, 'detalle', e.target.value)} />
                <button className="col-span-1 text-red-500 text-sm" onClick={() => setItems((p) => p.filter((_, x) => x !== i))}>✕</button>
                {it.id_partida && Number(it.importe) < 0 && (
                  <p className="col-span-12 -mt-1 text-[11px] text-gray-400">disponible de la partida: {fmt(disponibleDe(it.id_partida))}</p>
                )}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <button className={btnSecondary} onClick={() => setItems((p) => [...p, { id_partida: '', importe: '', detalle: '' }])}>+ Ítem</button>
            <span className={`text-sm font-semibold ${balanceOk ? 'text-green-700' : 'text-red-600'}`}>
              Σ {fmt(suma)} {cab.tipo === 'compensacion' && (balanceOk ? '✓ balancea' : '✗ debe ser 0 (RN-04)')}
            </span>
          </div>
          {!signosOk && <p className="text-xs text-red-600">⚠ {cab.tipo === 'ampliacion' ? 'La ampliación solo admite importes positivos' : 'La reducción solo admite importes negativos'} (RN-04)</p>}
          <div className="flex gap-2">
            <button className={`${btnSecondary} flex-1`} onClick={() => setPaso(1)}>← Volver</button>
            <button className={`${btnPrimary} flex-1`} disabled={!filasValidas.length || !balanceOk || !signosOk} onClick={() => setPaso(3)}>Continuar → Confirmar</button>
          </div>
        </div>
      )}

      {paso === 3 && (
        <div className="space-y-3">
          <div className="bg-slate-50 rounded-lg p-3 text-sm">
            <p><b className="capitalize">{cab.tipo}</b> · {cab.acto_administrativo}{cab.expediente && ` · Exp. ${cab.expediente}`}</p>
            <p className="text-xs text-gray-500 mt-1">{filasValidas.length} ítems · Σ {fmt(suma)}</p>
          </div>
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {filasValidas.map((it, i) => (
              <div key={i} className="flex justify-between text-xs bg-gray-50 rounded px-3 py-1.5">
                <span className="truncate">{etiqueta(partidas?.find((p) => p.id === Number(it.id_partida)) || {})} — {it.detalle}</span>
                <span className={`font-semibold ${Number(it.importe) < 0 ? 'text-red-600' : 'text-green-700'}`}>{fmt(it.importe)}</span>
              </div>
            ))}
          </div>
          {msg && <p className="text-red-600 text-sm">⚠ {msg}</p>}
          <div className="flex gap-2">
            <button className={`${btnSecondary} flex-1`} onClick={() => setPaso(2)}>← Volver</button>
            <button className={`${btnPrimary} flex-1`} disabled={crear.isPending} onClick={() => crear.mutate()}>
              {crear.isPending ? 'Guardando...' : 'Crear borrador'}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}

// ── Detalle + aprobar / anular ───────────────────────────────────────
function DetalleModal({ id, onClose, onChange, onError }) {
  const qc = useQueryClient();
  const { data: m, isLoading } = useQuery({
    queryKey: ['presu-modif', id],
    queryFn: () => presupuestoAPI.modificaciones.get(id).then((r) => r.data),
  });
  const [motivo, setMotivo] = useState('');
  const [advertencias, setAdvertencias] = useState([]);

  const accion = useMutation({
    mutationFn: ({ tipo }) => tipo === 'aprobar'
      ? presupuestoAPI.modificaciones.aprobar(id)
      : tipo === 'anular' ? presupuestoAPI.modificaciones.anular(id, motivo)
      : presupuestoAPI.modificaciones.delete(id),
    onSuccess: (r, { tipo }) => {
      qc.invalidateQueries({ queryKey: ['presu-modif', id] });
      onChange();
      const adv = r?.data?.advertencias || [];
      if (adv.length) setAdvertencias(adv); else if (tipo !== 'aprobar') onClose();
    },
    onError: (e) => { onError(e.response?.data?.detail || 'Error'); onClose(); },
  });

  if (isLoading || !m) return null;
  return (
    <Modal title={m.numero ? `MOD-${m.anio}-${String(m.numero).padStart(4, '0')}` : 'Borrador de modificación'} onClose={onClose} wide>
      <div className="space-y-3">
        <div className="flex items-center gap-2 flex-wrap text-sm">
          <span className={`px-2 py-0.5 rounded text-xs font-medium ${ESTADO[m.estado]}`}>{m.estado}</span>
          <span className="capitalize">{m.tipo}</span>
          <span className="text-gray-500">{m.acto_administrativo}</span>
          {m.expediente && <span className="text-gray-400 text-xs">Exp. {m.expediente}</span>}
        </div>
        {advertencias.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-xs text-amber-800">
            {advertencias.map((a, i) => <p key={i}>⚠ {a}</p>)}
          </div>
        )}
        <div className="space-y-1 max-h-64 overflow-y-auto">
          {m.items?.map((it) => (
            <div key={it.id} className="flex justify-between text-xs bg-gray-50 rounded px-3 py-1.5">
              <span className="truncate">{it.partida} — {it.detalle}</span>
              <span className={`font-semibold ${it.importe < 0 ? 'text-red-600' : 'text-green-700'}`}>{fmt(it.importe)}</span>
            </div>
          ))}
        </div>
        <div className="text-[11px] text-gray-400">
          Creada por {m.creado_por}{m.aprobado_por && ` · aprobada por ${m.aprobado_por} el ${new Date(m.fecha_aprobacion).toLocaleString()}`}
          {m.anulado_por && ` · anulada por ${m.anulado_por}${m.motivo_anulacion ? ` (${m.motivo_anulacion})` : ''}`}
        </div>
        {m.estado === 'borrador' && (
          <div className="flex gap-2">
            <button className={`${btnSecondary} flex-1`} onClick={() => accion.mutate({ tipo: 'descartar' })} disabled={accion.isPending}>Descartar borrador</button>
            <button className={`${btnPrimary} flex-1`} onClick={() => accion.mutate({ tipo: 'aprobar' })} disabled={accion.isPending}>
              {accion.isPending ? 'Procesando...' : 'Aprobar (impacta el crédito)'}
            </button>
          </div>
        )}
        {m.estado === 'aprobada' && (
          <div className="flex gap-2 items-center">
            <input className={`${inputClass} flex-1`} placeholder="Motivo de anulación" value={motivo} onChange={(e) => setMotivo(e.target.value)} />
            <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium" onClick={() => accion.mutate({ tipo: 'anular' })} disabled={accion.isPending}>
              Anular (contra-asienta)
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}
