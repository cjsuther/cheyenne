import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { administracionAPI } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { inputClass } from '../../components/common/CrudComponents';

const rotulo = (tipo, p) => tipo === 'fisica'
  ? `${p.apellido || ''}, ${p.nombre || ''}`.replace(/^,\s*/, '') || `#${p.id}`
  : (p.denominacion || p.nombre_fantasia || `#${p.id}`);

function Seccion({ titulo, filas, columnas }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-3">
      <p className="text-sm font-semibold text-gray-700 mb-2">{titulo} <span className="text-xs text-gray-400">({filas.length})</span></p>
      {filas.length === 0 ? <p className="text-xs text-gray-400">Sin registros.</p> : (
        <table className="w-full text-xs">
          <thead><tr className="text-gray-500 border-b">{columnas.map((c) => <th key={c.k} className="text-left py-1 font-medium">{c.l}</th>)}</tr></thead>
          <tbody>
            {filas.map((f, i) => <tr key={i} className="border-b border-gray-50">{columnas.map((c) => <td key={c.k} className="py-1 pr-2">{c.r ? c.r(f[c.k], f) : (f[c.k] ?? '—')}</td>)}</tr>)}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default function Persona360Tab() {
  const [tipo, setTipo] = useState('fisica');
  const [id, setId] = useState('');
  const { data: personas } = useQuery({
    queryKey: ['adm-personas-sel', tipo],
    queryFn: () => administracionAPI.personas[tipo === 'fisica' ? 'fisicas' : 'juridicas'].list({ limit: 100 }).then((r) => r.data),
  });
  const { data: ficha, isFetching } = useQuery({
    queryKey: ['adm-ficha360', tipo, id], enabled: !!id,
    queryFn: () => administracionAPI.personas.ficha360(tipo, id).then((r) => r.data),
  });
  const p = ficha?.persona;
  return (
    <div>
      <div className="mb-3 flex items-end gap-2 flex-wrap">
        <label className="text-xs text-gray-500">Tipo
          <select className={inputClass} value={tipo} onChange={(e) => { setTipo(e.target.value); setId(''); }}>
            <option value="fisica">Persona física</option>
            <option value="juridica">Persona jurídica</option>
          </select>
        </label>
        <label className="text-xs text-gray-500 flex-1 min-w-[240px]">Contribuyente
          <select className={inputClass} value={id} onChange={(e) => setId(e.target.value)}>
            <option value="">Seleccionar...</option>
            {personas?.map((x) => <option key={x.id} value={x.id}>{rotulo(tipo, x)} · {x.numero_documento || ''}</option>)}
          </select>
        </label>
      </div>

      {!id ? <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-400">Elegí un contribuyente para ver su ficha consolidada.</div>
        : isFetching || !ficha ? <LoadingSpinner /> : (
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-primary-50 to-white rounded-xl border border-primary-100 p-4 flex items-center justify-between flex-wrap gap-2">
              <div>
                <p className="text-lg font-bold text-gray-800">{rotulo(tipo, p)}</p>
                <p className="text-xs text-gray-500">{tipo === 'fisica' ? 'Persona física' : 'Persona jurídica'} · Documento {p.numero_documento || '—'}{tipo === 'fisica' && p.profesion ? ` · ${p.profesion}` : ''}{tipo === 'juridica' && p.nombre_fantasia ? ` · ${p.nombre_fantasia}` : ''}</p>
              </div>
              <Link to="/contribuyente-360" className="text-sm text-primary-600 hover:underline">Ver deuda y cuentas tributarias (Contribuyente 360) →</Link>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              <Seccion titulo="Direcciones" filas={ficha.direcciones}
                columnas={[{ k: 'calle', l: 'Calle' }, { k: 'altura', l: 'Altura' }, { k: 'piso', l: 'Piso' }, { k: 'dpto', l: 'Dpto' }, { k: 'codigo_postal', l: 'CP' }]} />
              <Seccion titulo="Contactos" filas={ficha.contactos}
                columnas={[{ k: 'detalle', l: 'Contacto' }, { k: 'id_tipo_contacto', l: 'Tipo' }]} />
              <Seccion titulo="Documentos" filas={ficha.documentos}
                columnas={[{ k: 'numero_documento', l: 'Nº documento' }, { k: 'principal', l: 'Principal', r: (v) => (v ? 'Sí' : '') }]} />
              <Seccion titulo="Medios de pago" filas={ficha.medios_pago}
                columnas={[{ k: 'titular', l: 'Titular' }, { k: 'banco', l: 'Banco' }, { k: 'numero', l: 'Nº/CBU' }, { k: 'alias', l: 'Alias' }]} />
              <Seccion titulo="Observaciones" filas={ficha.observaciones}
                columnas={[{ k: 'detalle', l: 'Observación' }, { k: 'fecha', l: 'Fecha', r: (v) => (v ? String(v).slice(0, 10) : '') }]} />
              <Seccion titulo="Etiquetas" filas={ficha.etiquetas}
                columnas={[{ k: 'codigo', l: 'Etiqueta' }]} />
              <Seccion titulo="Archivos" filas={ficha.archivos}
                columnas={[{ k: 'nombre', l: 'Archivo' }, { k: 'descripcion', l: 'Descripción' }]} />
            </div>
          </div>
        )}
    </div>
  );
}
