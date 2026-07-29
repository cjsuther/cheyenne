import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { importacionAPI } from '../../services/api';
import { useTabParam } from '../../hooks/useTabParam';
import PageHeader from '../../components/common/PageHeader';
import GroupedTabBar from '../../components/common/GroupedTabBar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Modal, Field, inputClass, btnPrimary, btnSecondary } from '../../components/common/CrudComponents';

const TIPOS = [
  { key: 'generico', label: 'Genérico' },
  { key: 'contribuyentes', label: 'Contribuyentes' },
  { key: 'recaudacion', label: 'Recaudación' },
];
const CAMPOS_DESTINO = {
  generico: [''],
  contribuyentes: ['', 'documento', 'cuit', 'nombre', 'razon_social'],
  recaudacion: ['', 'documento', 'cuit', 'monto', 'importe'],
};

const TABS = [
  { key: 'importar', label: 'Importar' },
  { key: 'lotes', label: 'Lotes' },
  { key: 'exportar', label: 'Exportar' },
];
const GRUPOS = [
  { label: 'Ingesta', keys: ['importar', 'lotes'] },
  { label: 'Salida', keys: ['exportar'] },
];

export default function Importacion() {
  const [tab, setTab] = useTabParam('importar');
  return (
    <div>
      <PageHeader title="Importación / Exportación" subtitle="Ingesta de archivos (CSV/XLSX), validación por fila y exportación real" />
      <GroupedTabBar grupos={GRUPOS} tabsMeta={TABS} tab={tab} setTab={setTab} />
      {tab === 'importar' && <ImportarTab onDone={() => setTab('lotes')} />}
      {tab === 'lotes' && <LotesTab />}
      {tab === 'exportar' && <ExportarTab />}
    </div>
  );
}

// ── Importar: upload + preview + mapeo + procesar ─────────────────────
function ImportarTab({ onDone }) {
  const qc = useQueryClient();
  const inputRef = useRef();
  const [file, setFile] = useState(null);
  const [drag, setDrag] = useState(false);
  const [tipo, setTipo] = useState('generico');
  const [preview, setPreview] = useState(null);
  const [mapeo, setMapeo] = useState({});
  const [msg, setMsg] = useState('');

  const pickFile = (f) => { setFile(f); setPreview(null); setMapeo({}); setMsg(''); };

  const previewMut = useMutation({
    mutationFn: () => { const fd = new FormData(); fd.append('archivo', file); return importacionAPI.preview(fd).then((r) => r.data); },
    onSuccess: (d) => setPreview(d),
    onError: (e) => setMsg(e.response?.data?.detail || 'No se pudo leer el archivo'),
  });

  const subirMut = useMutation({
    mutationFn: () => {
      const fd = new FormData();
      fd.append('archivo', file);
      fd.append('tipo_importacion', tipo);
      const limpio = Object.fromEntries(Object.entries(mapeo).filter(([, v]) => v));
      if (Object.keys(limpio).length) fd.append('mapeo', JSON.stringify(limpio));
      return importacionAPI.subir(fd).then((r) => r.data);
    },
    onSuccess: async (lote) => {
      await importacionAPI.procesar(lote.id, { tipo_importacion: tipo });
      qc.invalidateQueries({ queryKey: ['imp-lotes'] });
      setFile(null); setPreview(null); setMapeo({});
      onDone();
    },
    onError: (e) => setMsg(e.response?.data?.detail || 'Error al subir'),
  });

  const camposDestino = CAMPOS_DESTINO[tipo] || [''];

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); if (e.dataTransfer.files[0]) pickFile(e.dataTransfer.files[0]); }}
        onClick={() => inputRef.current?.click()}
        className={`cursor-pointer bg-white rounded-2xl border-2 border-dashed p-8 text-center transition ${drag ? 'border-primary-500 bg-primary-50/40' : 'border-gray-300'}`}
      >
        <input ref={inputRef} type="file" accept=".csv,.xlsx,.txt" className="hidden" onChange={(e) => e.target.files[0] && pickFile(e.target.files[0])} />
        <p className="text-sm text-gray-600">{file ? <span className="font-semibold text-gray-800">{file.name}</span> : 'Arrastrá un archivo CSV o XLSX, o hacé clic para elegir'}</p>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <Field label="Tipo de importación">
          <select className={inputClass} value={tipo} onChange={(e) => { setTipo(e.target.value); setMapeo({}); }}>
            {TIPOS.map((t) => <option key={t.key} value={t.key}>{t.label}</option>)}
          </select>
        </Field>
        <button className={btnSecondary} disabled={!file || previewMut.isPending} onClick={() => previewMut.mutate()}>{previewMut.isPending ? '...' : 'Previsualizar'}</button>
        <button className={btnPrimary} disabled={!file || subirMut.isPending} onClick={() => subirMut.mutate()}>{subirMut.isPending ? 'Procesando...' : 'Subir y procesar'}</button>
      </div>

      {msg && <p className="text-red-600 text-sm">⚠ {msg}</p>}

      {preview && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <p className="text-xs text-gray-500 mb-2">{preview.total_filas} filas · mostrando primeras {preview.filas.length}. Mapeá columnas del archivo a campos destino (opcional).</p>
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs">
              <thead>
                <tr className="bg-gray-50/70 text-gray-500">
                  {preview.headers.map((h) => (
                    <th key={h} className="px-2 py-1.5 text-left font-semibold">
                      <div>{h}</div>
                      {tipo !== 'generico' && (
                        <select className="mt-1 border border-gray-200 rounded px-1 py-0.5 text-[11px] font-normal" value={mapeo[h] || ''} onChange={(e) => setMapeo({ ...mapeo, [h]: e.target.value })}>
                          {camposDestino.map((c) => <option key={c} value={c}>{c || '— sin mapear —'}</option>)}
                        </select>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {preview.filas.map((f, i) => (
                  <tr key={i}>{preview.headers.map((h) => <td key={h} className="px-2 py-1 whitespace-nowrap">{String(f[h] ?? '')}</td>)}</tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Lotes + detalles con errores por fila ─────────────────────────────
const EST_LOTE = { 10: 'bg-amber-100 text-amber-700', 20: 'bg-green-100 text-green-700', 30: 'bg-red-100 text-red-700' };
const EST_LOTE_TXT = { 10: 'pendiente', 20: 'procesado', 30: 'con errores' };

function LotesTab() {
  const [detLote, setDetLote] = useState(null);
  const { data: lotes, isLoading } = useQuery({ queryKey: ['imp-lotes'], queryFn: () => importacionAPI.lotes({ limit: 100 }).then((r) => r.data) });
  if (isLoading) return <LoadingSpinner />;
  return (
    <div className="space-y-2">
      {lotes?.length ? lotes.map((l) => (
        <div key={l.id} className="bg-white rounded-xl border border-gray-200 p-4 cursor-pointer hover:border-primary-200" onClick={() => setDetLote(l)}>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div><p className="text-sm font-semibold text-gray-800">#{l.id} · {l.nombre_archivo}</p><p className="text-xs text-gray-500">{l.tipo_importacion} · {l.casos_total} filas · {l.casos_error} con error</p></div>
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${EST_LOTE[l.id_estado_importacion] || 'bg-gray-100 text-gray-600'}`}>{EST_LOTE_TXT[l.id_estado_importacion] || l.id_estado_importacion}</span>
          </div>
        </div>
      )) : <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">Sin lotes. Importá un archivo.</div>}
      {detLote && <DetalleModal lote={detLote} onClose={() => setDetLote(null)} />}
    </div>
  );
}

function DetalleModal({ lote, onClose }) {
  const qc = useQueryClient();
  const [soloErrores, setSoloErrores] = useState(false);
  const { data: detalles, isLoading } = useQuery({
    queryKey: ['imp-det', lote.id, soloErrores],
    queryFn: () => importacionAPI.detalles(lote.id, { limit: 200, solo_errores: soloErrores }).then((r) => r.data),
  });
  const reproc = useMutation({
    mutationFn: () => importacionAPI.procesar(lote.id, { tipo_importacion: lote.tipo_importacion }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['imp-det', lote.id] }); qc.invalidateQueries({ queryKey: ['imp-lotes'] }); },
  });
  return (
    <Modal title={`Lote #${lote.id} — ${lote.nombre_archivo}`} onClose={onClose} wide>
      <div className="flex items-center gap-3 mb-3 text-sm">
        <span className={`px-2 py-0.5 rounded text-xs font-medium ${EST_LOTE[lote.id_estado_importacion] || 'bg-gray-100'}`}>{EST_LOTE_TXT[lote.id_estado_importacion]}</span>
        <span className="text-gray-600">{lote.casos_total} filas · {lote.casos_error} con error</span>
        <label className="text-xs flex items-center gap-1 ml-auto"><input type="checkbox" checked={soloErrores} onChange={(e) => setSoloErrores(e.target.checked)} /> solo errores</label>
        <button className={btnSecondary} disabled={reproc.isPending} onClick={() => reproc.mutate()}>{reproc.isPending ? '...' : 'Reprocesar'}</button>
      </div>
      {isLoading ? <LoadingSpinner /> : (
        <div className="overflow-x-auto max-h-96">
          <table className="min-w-full text-xs">
            <thead className="sticky top-0 bg-gray-50"><tr className="text-gray-500"><th className="px-2 py-1 text-left">#</th><th className="px-2 py-1 text-left">Estado</th><th className="px-2 py-1 text-left">Error</th><th className="px-2 py-1 text-left">Datos</th></tr></thead>
            <tbody className="divide-y divide-gray-50">
              {detalles?.map((d) => (
                <tr key={d.id} className={d.id_estado_detalle === 30 ? 'bg-red-50/50' : ''}>
                  <td className="px-2 py-1">{d.numero_linea}</td>
                  <td className="px-2 py-1">{d.id_estado_detalle === 20 ? '✓ ok' : d.id_estado_detalle === 30 ? '✕ error' : 'pend.'}</td>
                  <td className="px-2 py-1 text-red-600">{d.detalle_error || ''}</td>
                  <td className="px-2 py-1 text-gray-500 truncate max-w-md">{JSON.stringify(d.datos_originales)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Modal>
  );
}

// ── Exportar: crear lote + descargar archivo real ─────────────────────
function ExportarTab() {
  const qc = useQueryClient();
  const [f, setF] = useState({ nombre_archivo: 'export', formato: 'csv', tipo_exportacion: 'generico', origen_lote_id: '' });
  const [msg, setMsg] = useState('');
  const { data: lotes } = useQuery({ queryKey: ['imp-lotes'], queryFn: () => importacionAPI.lotes({ limit: 100 }).then((r) => r.data) });
  const { data: exps, isLoading } = useQuery({ queryKey: ['exp-lotes'], queryFn: () => importacionAPI.exportaciones.list({ limit: 100 }).then((r) => r.data) });
  const crear = useMutation({
    mutationFn: () => importacionAPI.exportaciones.create({ ...f, origen_lote_id: f.origen_lote_id ? Number(f.origen_lote_id) : null }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['exp-lotes'] }); setMsg(''); },
    onError: (e) => setMsg(e.response?.data?.detail || 'Error'),
  });
  const descargar = async (l) => {
    const r = await importacionAPI.exportaciones.descargar(l.id);
    const url = URL.createObjectURL(new Blob([r.data]));
    const a = document.createElement('a');
    a.href = url; a.download = l.nombre_archivo + (l.formato === 'xlsx' ? '.xlsx' : '.csv'); a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-wrap items-end gap-3">
        <Field label="Nombre archivo"><input className={inputClass} value={f.nombre_archivo} onChange={(e) => setF({ ...f, nombre_archivo: e.target.value })} /></Field>
        <Field label="Formato"><select className={inputClass} value={f.formato} onChange={(e) => setF({ ...f, formato: e.target.value })}><option value="csv">CSV</option><option value="xlsx">XLSX</option></select></Field>
        <Field label="Origen (lote importado)"><select className={inputClass} value={f.origen_lote_id} onChange={(e) => setF({ ...f, origen_lote_id: e.target.value })}><option value="">— metadatos —</option>{lotes?.map((l) => <option key={l.id} value={l.id}>#{l.id} {l.nombre_archivo}</option>)}</select></Field>
        <button className={btnPrimary} disabled={crear.isPending || !f.nombre_archivo.trim()} onClick={() => crear.mutate()}>{crear.isPending ? '...' : 'Crear lote de exportación'}</button>
      </div>
      {msg && <p className="text-red-600 text-sm">⚠ {msg}</p>}
      {isLoading ? <LoadingSpinner /> : (
        <div className="space-y-2">
          {exps?.length ? exps.map((l) => (
            <div key={l.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between">
              <div><p className="text-sm font-semibold text-gray-800">#{l.id} · {l.nombre_archivo}</p><p className="text-xs text-gray-500">{l.tipo_exportacion} · {l.formato} · {l.casos} filas</p></div>
              <button className={btnSecondary} onClick={() => descargar(l)}>Descargar</button>
            </div>
          )) : <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">Sin exportaciones.</div>}
        </div>
      )}
    </div>
  );
}
