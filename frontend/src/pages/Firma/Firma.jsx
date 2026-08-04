import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { firmaAPI } from '../../services/api';
import PageHeader from '../../components/common/PageHeader';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Modal, btnPrimary, btnSecondary, inputClass, apiErrorMessage } from '../../components/common/CrudComponents';

const fmtDT = (v) => (v ? new Date(v).toLocaleString('es-AR') : '—');
const BADGE = { pendiente: 'bg-amber-100 text-amber-700', firmado: 'bg-green-100 text-green-700', anulado: 'bg-gray-200 text-gray-500' };
const puestas = (d) => d.firmas_puestas ?? (d.firmas?.length || 0);

function EstadoBadge({ e }) {
  return <span className={`text-[10px] uppercase tracking-wide rounded px-1.5 py-0.5 font-semibold ${BADGE[e] || 'bg-gray-100 text-gray-600'}`}>{e}</span>;
}

function Progreso({ d }) {
  const req = d.cantidad_firmas || 1; const p = puestas(d);
  return (
    <span className="inline-flex items-center gap-2">
      <span className="text-xs text-gray-600 whitespace-nowrap">{p}/{req} firmas</span>
      <span className="inline-block w-20 h-1.5 rounded-full bg-gray-200 overflow-hidden">
        <span className="block h-full bg-primary-500" style={{ width: `${Math.min(100, (p / req) * 100)}%` }} />
      </span>
    </span>
  );
}

function DetalleModal({ id, onClose }) {
  const qc = useQueryClient();
  const [error, setError] = useState('');
  const [verif, setVerif] = useState(null);
  const { data: doc, isLoading } = useQuery({
    queryKey: ['firma-doc', id],
    queryFn: () => firmaAPI.documentos.get(id).then((r) => r.data),
  });
  const refrescar = () => {
    qc.invalidateQueries({ queryKey: ['firma-doc', id] });
    qc.invalidateQueries({ queryKey: ['firma-bandeja'] });
    qc.invalidateQueries({ queryKey: ['firma-docs'] });
  };
  const firmar = useMutation({
    mutationFn: () => firmaAPI.documentos.firmar(id, { computadora: 'web' }),
    onSuccess: () => { setError(''); refrescar(); },
    onError: (e) => setError(apiErrorMessage(e, 'No se pudo firmar')),
  });
  const anular = useMutation({
    mutationFn: () => firmaAPI.documentos.anular(id),
    onSuccess: () => { setError(''); refrescar(); },
    onError: (e) => setError(apiErrorMessage(e, 'No se pudo anular')),
  });
  const verificar = useMutation({
    mutationFn: () => firmaAPI.documentos.verificar(id),
    onSuccess: (r) => setVerif(r.data),
    onError: (e) => setError(apiErrorMessage(e, 'No se pudo verificar')),
  });

  return (
    <Modal title={doc ? `${doc.titulo}` : 'Documento'} onClose={onClose} wide>
      {isLoading || !doc ? <LoadingSpinner /> : (
        <div className="space-y-4">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">⚠ {error}</div>}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50 rounded-lg p-4 text-sm">
            <div><span className="text-xs text-gray-500">Origen</span><p className="font-medium">{doc.origen_modulo} · {doc.origen_tipo}</p></div>
            <div><span className="text-xs text-gray-500">Referencia</span><p className="font-medium">{doc.origen_ref}</p></div>
            <div><span className="text-xs text-gray-500">Estado</span><p><EstadoBadge e={doc.estado} /></p></div>
            <div><span className="text-xs text-gray-500">Firmas</span><p><Progreso d={doc} /></p></div>
          </div>
          {doc.descripcion && <p className="text-sm text-gray-600">{doc.descripcion}</p>}
          {doc.contenido_hash && <p className="text-xs text-gray-400 font-mono break-all">SHA-256: {doc.contenido_hash}</p>}

          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Firmas ({doc.firmas?.length || 0})</h4>
            {doc.firmas?.length > 0 ? (
              <div className="overflow-x-auto border border-gray-100 rounded-lg">
                <table className="w-full text-xs">
                  <thead className="bg-gray-50"><tr className="text-left text-gray-500">
                    <th className="px-3 py-2">Orden</th><th className="px-3 py-2">Firmante</th><th className="px-3 py-2">Documento</th>
                    <th className="px-3 py-2">Fecha/Hora</th><th className="px-3 py-2">Equipo</th><th className="px-3 py-2">Verificación</th>
                  </tr></thead>
                  <tbody>{doc.firmas.map((f) => {
                    const v = verif?.firmas?.find((x) => x.orden === f.orden_firma);
                    return (
                      <tr key={f.id} className="border-t border-gray-50">
                        <td className="px-3 py-1.5 font-semibold">{f.orden_firma}º</td>
                        <td className="px-3 py-1.5">{f.firmante_nombre}</td>
                        <td className="px-3 py-1.5">{f.firmante_documento || '—'}</td>
                        <td className="px-3 py-1.5 whitespace-nowrap">{fmtDT(f.fecha_hora)}</td>
                        <td className="px-3 py-1.5">{f.computadora || '—'}</td>
                        <td className="px-3 py-1.5">{v == null ? <span className="text-gray-300">—</span> : v.valido ? <span className="text-green-600">✓ válida</span> : <span className="text-red-600">✗ inválida</span>}</td>
                      </tr>
                    );
                  })}</tbody>
                </table>
              </div>
            ) : <p className="text-sm text-gray-500 bg-gray-50 rounded-lg px-3 py-3">Sin firmas todavía.</p>}
          </div>

          {verif && (
            <div className={`text-sm rounded-lg px-4 py-2 ${verif.valido ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
              {verif.valido ? '✓ Todas las firmas son íntegras y verificables.' : '✗ Se detectaron firmas alteradas.'}
            </div>
          )}

          <div className="flex flex-wrap justify-end gap-2 pt-2 border-t">
            <button className={btnSecondary} onClick={() => verificar.mutate()} disabled={verificar.isPending}>Verificar firmas</button>
            {doc.estado === 'pendiente' && (
              <>
                <button className={btnSecondary} onClick={() => anular.mutate()} disabled={anular.isPending}>Anular</button>
                <button className={btnPrimary} onClick={() => firmar.mutate()} disabled={firmar.isPending}>{firmar.isPending ? 'Firmando…' : 'Firmar'}</button>
              </>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}

function Lista({ items, onOpen, vacio }) {
  if (!items) return <LoadingSpinner />;
  if (items.length === 0) return <p className="text-sm text-gray-500 bg-white border border-gray-100 rounded-xl px-4 py-8 text-center">{vacio}</p>;
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead><tr className="border-b border-gray-100 text-xs text-gray-500 uppercase">
          <th className="px-4 py-3">Documento</th><th className="px-4 py-3">Origen</th><th className="px-4 py-3">Estado</th>
          <th className="px-4 py-3">Firmas</th><th className="px-4 py-3"></th>
        </tr></thead>
        <tbody className="divide-y divide-gray-50">
          {items.map((d) => (
            <tr key={d.id} className="hover:bg-primary-50/40">
              <td className="px-4 py-3"><p className="font-medium text-gray-800">{d.titulo}</p><p className="text-xs text-gray-400">{d.origen_ref}</p></td>
              <td className="px-4 py-3 text-xs text-gray-500">{d.origen_modulo} · {d.origen_tipo}</td>
              <td className="px-4 py-3"><EstadoBadge e={d.estado} /></td>
              <td className="px-4 py-3"><Progreso d={d} /></td>
              <td className="px-4 py-3 text-right"><button className="text-primary-600 hover:underline text-sm" onClick={() => onOpen(d.id)}>Ver / firmar</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Firma() {
  const [tab, setTab] = useState('bandeja');
  const [estado, setEstado] = useState('');
  const [detalle, setDetalle] = useState(null);

  const { data: bandeja } = useQuery({
    queryKey: ['firma-bandeja'],
    queryFn: () => firmaAPI.bandeja({ limit: 100 }).then((r) => r.data),
  });
  const { data: docs } = useQuery({
    queryKey: ['firma-docs', estado],
    queryFn: () => firmaAPI.documentos.list({ limit: 100, ...(estado ? { estado } : {}) }).then((r) => r.data),
    enabled: tab === 'todos',
  });

  const TABS = [
    { key: 'bandeja', label: `Bandeja de firma${bandeja?.length ? ` (${bandeja.length})` : ''}` },
    { key: 'todos', label: 'Todos los documentos' },
  ];

  return (
    <div className="space-y-4">
      <PageHeader title="Firma Digital" subtitle="Firma de órdenes de pago y documentos — firma múltiple secuencial" />

      <div className="flex flex-wrap gap-1 border-b border-gray-200">
        {TABS.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-3 py-2 text-sm font-medium border-b-2 -mb-px ${tab === t.key ? 'border-primary-600 text-primary-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'bandeja' && (
        <Lista items={bandeja} onOpen={setDetalle} vacio="No tenés documentos pendientes de firma." />
      )}
      {tab === 'todos' && (
        <div className="space-y-3">
          <select value={estado} onChange={(e) => setEstado(e.target.value)} className={`${inputClass} max-w-xs`}>
            <option value="">Todos los estados</option>
            <option value="pendiente">Pendientes</option>
            <option value="firmado">Firmados</option>
            <option value="anulado">Anulados</option>
          </select>
          <Lista items={docs} onOpen={setDetalle} vacio="No hay documentos." />
        </div>
      )}

      {detalle && <DetalleModal id={detalle} onClose={() => setDetalle(null)} />}
    </div>
  );
}
