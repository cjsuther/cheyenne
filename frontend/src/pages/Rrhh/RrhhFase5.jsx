import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rrhhAPI } from '../../services/api';
import { btnPrimary, btnSecondary, apiErrorMessage } from '../../components/common/CrudComponents';

const fmt = (v) => `$${Number(v || 0).toLocaleString('es-AR', { minimumFractionDigits: 2 })}`;
const fdate = (v) => (v ? new Date(v).toLocaleString('es-AR') : '—');

const BADGE = {
  ok: 'bg-green-100 text-green-700',
  error: 'bg-red-100 text-red-700',
  pendiente: 'bg-gray-100 text-gray-600',
};
function Estado({ v }) {
  return <span className={`text-xs px-2 py-0.5 rounded-full ${BADGE[v] || BADGE.pendiente}`}>{v || 'pendiente'}</span>;
}

function descargarBlob(resp, fallbackName) {
  const cd = resp.headers?.['content-disposition'] || '';
  const m = /filename="?([^"]+)"?/.exec(cd);
  const name = (m && m[1]) || fallbackName;
  const url = URL.createObjectURL(resp.data);
  const a = document.createElement('a');
  a.href = url; a.download = name; document.body.appendChild(a); a.click();
  a.remove(); URL.revokeObjectURL(url);
}

// Tarjeta de una integración con su acción
function CardIntegracion({ titulo, estado, detalle, fecha, extra, onAction, actionLabel, loading, disabled }) {
  return (
    <div className="bg-white border border-gray-100 rounded-lg p-4 space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-sm">{titulo}</h4>
        <Estado v={estado} />
      </div>
      {extra}
      <p className="text-xs text-gray-500 min-h-[16px]">{detalle || '—'}</p>
      <p className="text-[11px] text-gray-400">{fecha ? `Última ejecución: ${fdate(fecha)}` : 'Sin ejecutar'}</p>
      <button className={`${estado === 'ok' ? btnSecondary : btnPrimary} w-full`} onClick={onAction} disabled={loading || disabled}>
        {loading ? 'Procesando…' : estado === 'ok' ? `Reintentar ${actionLabel}` : actionLabel}
      </button>
    </div>
  );
}

export function IntegracionTab() {
  const qc = useQueryClient();
  const [idProc, setIdProc] = useState('');
  const [msg, setMsg] = useState(null);

  const { data: procesos } = useQuery({
    queryKey: ['rrhh-f5-procesos'],
    queryFn: () => rrhhAPI.procesos.list({ limit: 100 }).then((r) => r.data),
  });
  const proc = (procesos || []).find((p) => String(p.id) === String(idProc));

  const { data: estado, isFetching } = useQuery({
    queryKey: ['rrhh-integracion', idProc],
    queryFn: () => rrhhAPI.integracion.estado(idProc).then((r) => r.data),
    enabled: !!idProc,
  });

  const refetch = () => qc.invalidateQueries({ queryKey: ['rrhh-integracion', idProc] });
  const onOk = (text) => () => { setMsg({ ok: true, text }); refetch(); };
  const onErr = (fallback) => (e) => { setMsg({ ok: false, text: apiErrorMessage(e, fallback) }); refetch(); };
  const mDev = useMutation({
    mutationFn: () => rrhhAPI.integracion.devengar(idProc),
    onSuccess: onOk('Devengado registrado en Contabilidad'), onError: onErr('Error al devengar'),
  });
  const mOp = useMutation({
    mutationFn: () => rrhhAPI.integracion.generarOp(idProc),
    onSuccess: onOk('Orden de pago generada en Tesorería'), onError: onErr('Error al generar la OP'),
  });
  const mFirma = useMutation({
    mutationFn: () => rrhhAPI.integracion.enviarRecibosFirma(idProc, { cantidad_firmas: 1 }),
    onSuccess: onOk('Recibos enviados a firma'), onError: onErr('Error al enviar a firma'),
  });

  const bajarSicoss = async () => {
    try { descargarBlob(await rrhhAPI.integracion.sicoss(idProc), `SICOSS_${idProc}.txt`); }
    catch (e) { setMsg({ ok: false, text: apiErrorMessage(e, 'Error al generar SICOSS') }); }
  };
  const bajarBanco = async () => {
    try { descargarBlob(await rrhhAPI.integracion.banco(idProc, 'cbu'), `BANCO_${idProc}.txt`); }
    catch (e) { setMsg({ ok: false, text: apiErrorMessage(e, 'Error al generar archivo de banco') }); }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Proceso de liquidación</label>
          <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm min-w-[320px]"
            value={idProc} onChange={(e) => { setIdProc(e.target.value); setMsg(null); }}>
            <option value="">— Elegí un proceso liquidado —</option>
            {(procesos || []).map((p) => (
              <option key={p.id} value={p.id}>
                #{p.id} · {p.anio}-{String(p.mes).padStart(2, '0')} {p.tipo_liq} · {p.cantidad_legajos} legajos · neto {fmt(p.total_neto)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {msg && (
        <div className={`text-sm rounded-lg px-3 py-2 ${msg.ok ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {msg.text}
        </div>
      )}

      {!idProc && <p className="text-sm text-gray-400">Elegí un proceso para contabilizar, pagar, firmar recibos y exportar archivos AFIP/banco.</p>}

      {idProc && (
        <>
          {proc && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[['Haberes', proc.total_haberes], ['Retenciones', proc.total_retenciones], ['Neto a pagar', proc.total_neto], ['Legajos', proc.cantidad_legajos]].map(([k, v], i) => (
                <div key={i} className="bg-white border border-gray-100 rounded-lg p-3">
                  <p className="text-xs text-gray-500">{k}</p>
                  <p className="text-lg font-semibold">{i === 3 ? v : fmt(v)}</p>
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <CardIntegracion titulo="Devengado (Contabilidad)" estado={estado?.devengado_estado}
              detalle={estado?.devengado_detalle} fecha={estado?.devengado_fecha}
              extra={estado?.devengado_importe ? <p className="text-xs text-gray-600">Importe: {fmt(estado.devengado_importe)}</p> : null}
              onAction={() => mDev.mutate()} actionLabel="Devengar" loading={mDev.isPending} disabled={isFetching} />
            <CardIntegracion titulo="Orden de Pago (Tesorería)" estado={estado?.op_estado}
              detalle={estado?.op_detalle} fecha={estado?.op_fecha}
              extra={estado?.op_importe ? <p className="text-xs text-gray-600">Neto: {fmt(estado.op_importe)}</p> : null}
              onAction={() => mOp.mutate()} actionLabel="Generar OP" loading={mOp.isPending} disabled={isFetching} />
            <CardIntegracion titulo="Recibos a Firma" estado={estado?.firma_estado}
              detalle={estado?.firma_detalle} fecha={estado?.firma_fecha}
              extra={estado?.firma_cantidad ? <p className="text-xs text-gray-600">Enviados: {estado.firma_cantidad}</p> : null}
              onAction={() => mFirma.mutate()} actionLabel="Enviar recibos" loading={mFirma.isPending} disabled={isFetching} />
          </div>

          <div className="bg-white border border-gray-100 rounded-lg p-4">
            <h4 className="font-medium text-sm mb-1">Exportadores</h4>
            <p className="text-xs text-gray-500 mb-3">Archivos de texto para presentación en AFIP y acreditación bancaria del neto.</p>
            <div className="flex flex-wrap gap-2">
              <button className={btnSecondary} onClick={bajarSicoss}>Descargar SICOSS / F.931</button>
              <button className={btnSecondary} onClick={bajarBanco}>Descargar archivo de banco (CBU)</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
