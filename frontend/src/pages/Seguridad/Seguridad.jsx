import { useState, useEffect } from 'react';
import { useTabParam } from '../../hooks/useTabParam';
import { usePersistentSort } from '../../hooks/usePersistentSort';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { seguridadAPI } from '../../services/api';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function Seguridad() {
  const [tab, setTab] = useTabParam('usuarios');

  return (
    <div>
      <PageHeader title="Seguridad" subtitle="Gestion de usuarios, perfiles y permisos" />
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {['usuarios', 'perfiles', 'permisos', 'sesiones'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === t ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>
      {tab === 'usuarios' && <UsuariosTab />}
      {tab === 'perfiles' && <PerfilesTab />}
      {tab === 'permisos' && <PermisosTab />}
      {tab === 'sesiones' && <SesionesTab />}
    </div>
  );
}

// ── Modal generico ─────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

// ── Input reutilizable ─────────────────────────────────────────────────
function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      {children}
    </label>
  );
}

const inputClass = 'mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500';
const btnPrimary = 'bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium';
const btnDanger = 'bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded text-xs font-medium';
const btnSecondary = 'bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded text-xs font-medium';

// ═══════════════════════════════════════════════════════════════════════
// USUARIOS TAB
// ═══════════════════════════════════════════════════════════════════════
function UsuariosTab() {
  const [modal, setModal] = useState(null);
  const [page, setPage] = useState(0);
  const [filterInputs, setFilterInputs] = useState({});
  const [filters, setFilters] = useState({});
  const [sort, setSort] = usePersistentSort('seguridad-usuarios');
  const pageSize = 10;
  const queryClient = useQueryClient();

  const handleSort = (key) => {
    setPage(0);
    setSort((prev) => prev.by === key ? { by: key, dir: prev.dir === 'asc' ? 'desc' : 'asc' } : { by: key, dir: 'asc' });
  };

  useEffect(() => {
    const t = setTimeout(() => {
      const clean = {};
      Object.entries(filterInputs).forEach(([k, v]) => { if (v) clean[k] = v; });
      setFilters(clean);
      setPage(0);
    }, 400);
    return () => clearTimeout(t);
  }, [filterInputs]);

  const { data: usuarios, isLoading } = useQuery({
    queryKey: ['usuarios', page, filters, sort],
    queryFn: () => seguridadAPI.usuarios.list({ skip: page * pageSize, limit: pageSize, ...filters, sort_by: sort.by, sort_dir: sort.dir }).then((r) => r.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => seguridadAPI.usuarios.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['usuarios'] }),
  });

  const desbloquearMutation = useMutation({
    mutationFn: (id) => seguridadAPI.desbloquearUsuario(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['usuarios'] }),
    onError: (e) => alert(e.response?.data?.detail || 'Error al desbloquear'),
  });

  const isBloqueado = (row) => row.bloqueado_hasta && new Date(row.bloqueado_hasta) > new Date();

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'codigo', label: 'Codigo' },
    { key: 'nombre_apellido', label: 'Nombre' },
    { key: 'email', label: 'Email' },
    {
      key: 'id_estado_usuario',
      label: 'Estado',
      render: (v, row) =>
        isBloqueado(row) ? (
          <span className="text-red-600 font-medium">Bloqueado</span>
        ) : v === 10 ? 'Activo' : 'Inactivo',
    },
    {
      key: '_actions',
      label: 'Acciones',
      render: (_, row) => (
        <div className="flex gap-2">
          <button className={btnSecondary} onClick={() => setModal({ mode: 'edit', usuario: row })}>Editar</button>
          <button className={btnSecondary} onClick={() => setModal({ mode: 'perfiles', usuario: row })}>Perfiles</button>
          <button className={btnSecondary} onClick={() => setModal({ mode: 'permisos', usuario: row })}>Permisos</button>
          {isBloqueado(row) && (
            <button className={btnSecondary} onClick={() => { if (confirm('Desbloquear usuario?')) desbloquearMutation.mutate(row.id); }}>Desbloquear</button>
          )}
          <button className={btnDanger} onClick={() => { if (confirm('Eliminar usuario?')) deleteMutation.mutate(row.id); }}>Eliminar</button>
        </div>
      ),
    },
  ];

  const filterCols = columns.filter(c => c.key !== '_actions');

  return (
    <>
      <div className="mb-3 flex justify-end">
        <button className={btnPrimary} onClick={() => setModal('create')}>Nuevo Usuario</button>
      </div>
      <div className="bg-white rounded-t-lg border border-b-0 border-gray-200 px-2 py-2">
        <div className="flex gap-1">
          {filterCols.map(col => (
            <input key={col.key} placeholder={col.label} value={filterInputs[col.key] || ''}
              onChange={e => setFilterInputs(prev => ({ ...prev, [col.key]: e.target.value }))}
              className="flex-1 min-w-0 border border-gray-200 rounded px-2 py-1 text-xs placeholder:text-gray-400" />
          ))}
          <div className="w-[180px] shrink-0" />
        </div>
      </div>
      {isLoading ? <LoadingSpinner /> : <DataTable columns={columns} data={usuarios} sort={sort} onSort={handleSort} />}
      <div className="flex items-center justify-between mt-3">
        <button disabled={page === 0} onClick={() => setPage(p => p - 1)} className={`px-3 py-1.5 rounded text-xs font-medium ${page === 0 ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}>Anterior</button>
        <span className="text-xs text-gray-500">Pagina {page + 1}</span>
        <button disabled={!usuarios || usuarios.length < pageSize} onClick={() => setPage(p => p + 1)} className={`px-3 py-1.5 rounded text-xs font-medium ${!usuarios || usuarios.length < pageSize ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}>Siguiente</button>
      </div>
      {modal === 'create' && <UsuarioFormModal onClose={() => setModal(null)} />}
      {modal?.mode === 'edit' && <UsuarioFormModal usuario={modal.usuario} onClose={() => setModal(null)} />}
      {modal?.mode === 'perfiles' && <UsuarioPerfilesModal usuario={modal.usuario} onClose={() => setModal(null)} />}
      {modal?.mode === 'permisos' && <UsuarioPermisosModal usuario={modal.usuario} onClose={() => setModal(null)} />}
    </>
  );
}

// ── Modal: grant/deny de permisos por usuario ──────────────────────────
function UsuarioPermisosModal({ usuario, onClose }) {
  const queryClient = useQueryClient();
  const { data: permisos, isLoading } = useQuery({
    queryKey: ['usuario-permisos-override', usuario.id],
    queryFn: () => seguridadAPI.usuarioPermisosOverride(usuario.id).then((r) => r.data),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['usuario-permisos-override', usuario.id] });

  const setMutation = useMutation({
    mutationFn: ({ id, id_permiso, tipo }) => seguridadAPI.setUsuarioPermisoOverride(id, id_permiso, tipo),
    onSuccess: invalidate,
  });
  const clearMutation = useMutation({
    mutationFn: ({ id, id_permiso }) => seguridadAPI.clearUsuarioPermisoOverride(id, id_permiso),
    onSuccess: invalidate,
  });

  // Estado efectivo mostrado: 'grant' | 'deny' | (por_perfil ? 'perfil' : 'ninguno')
  const estado = (p) => p.override || (p.por_perfil ? 'perfil' : 'ninguno');

  const grouped = {};
  permisos?.forEach((p) => { (grouped[p.sistema] ??= []).push(p); });

  return (
    <Modal title={`Permisos de ${usuario.nombre_apellido}`} onClose={onClose}>
      <p className="text-xs text-gray-500 mb-3">
        Efectivo = permisos por perfil + grants - denies. Un <b>grant</b> agrega un permiso;
        un <b>deny</b> lo quita aunque venga del perfil.
      </p>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {Object.entries(grouped).map(([sistema, items]) => (
            <div key={sistema}>
              <h4 className="text-sm font-semibold text-gray-600 uppercase mb-1">{sistema || 'General'}</h4>
              <div className="space-y-1">
                {items.map((p) => {
                  const st = estado(p);
                  return (
                    <div key={p.id} className="flex items-center justify-between gap-2 p-1.5 rounded hover:bg-gray-50">
                      <div className="min-w-0">
                        <span className="text-sm text-gray-800">{p.nombre}</span>
                        <span className="text-xs text-gray-400 ml-2">{p.codigo}</span>
                        {p.por_perfil && <span className="text-[10px] text-gray-400 ml-2">(perfil)</span>}
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <button
                          className={`px-2 py-1 rounded text-xs font-medium ${st === 'grant' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                          onClick={() => setMutation.mutate({ id: usuario.id, id_permiso: p.id, tipo: 'grant' })}
                        >Grant</button>
                        <button
                          className={`px-2 py-1 rounded text-xs font-medium ${st === 'deny' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                          onClick={() => setMutation.mutate({ id: usuario.id, id_permiso: p.id, tipo: 'deny' })}
                        >Deny</button>
                        {p.override && (
                          <button
                            className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200"
                            onClick={() => clearMutation.mutate({ id: usuario.id, id_permiso: p.id })}
                          >Limpiar</button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// SESIONES TAB (sesiones propias + revocar)
// ═══════════════════════════════════════════════════════════════════════
function SesionesTab() {
  const queryClient = useQueryClient();
  const { data: sesiones, isLoading } = useQuery({
    queryKey: ['mis-sesiones'],
    queryFn: () => seguridadAPI.sesiones().then((r) => r.data),
  });

  const revocarMutation = useMutation({
    mutationFn: (id) => seguridadAPI.revocarSesion(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['mis-sesiones'] }),
    onError: (e) => alert(e.response?.data?.detail || 'Error al revocar'),
  });

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'fecha_creacion', label: 'Inicio', render: (v) => v ? new Date(v).toLocaleString() : '' },
    { key: 'fecha_vencimiento', label: 'Vence', render: (v) => v ? new Date(v).toLocaleString() : '' },
    { key: 'activa', label: 'Estado', render: (v) => (v ? <span className="text-green-600">Activa</span> : <span className="text-gray-400">Cerrada</span>) },
    {
      key: '_actions',
      label: 'Acciones',
      render: (_, row) => (
        <div className="flex gap-2 items-center">
          {row.actual && <span className="text-xs text-gray-400">(actual)</span>}
          {row.activa && !row.actual && (
            <button className={btnDanger} onClick={() => { if (confirm('Revocar esta sesion?')) revocarMutation.mutate(row.id); }}>Revocar</button>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <p className="text-sm text-gray-500 mb-3">Sesiones activas de tu cuenta. Podes revocar las que no reconozcas.</p>
      {isLoading ? <LoadingSpinner /> : <DataTable columns={columns} data={sesiones} />}
    </>
  );
}

function UsuarioFormModal({ usuario, onClose }) {
  const queryClient = useQueryClient();
  const isEdit = !!usuario;
  const [form, setForm] = useState({
    codigo: usuario?.codigo || '',
    nombre_apellido: usuario?.nombre_apellido || '',
    email: usuario?.email || '',
    password: '',
    id_estado_usuario: usuario?.id_estado_usuario ?? 10,
  });
  const [error, setError] = useState('');

  const mutation = useMutation({
    mutationFn: (data) => isEdit ? seguridadAPI.usuarios.update(usuario.id, data) : seguridadAPI.usuarios.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['usuarios'] }); onClose(); },
    onError: (e) => setError(e.response?.data?.detail || 'Error al guardar'),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...form };
    if (isEdit && !payload.password) delete payload.password;
    if (isEdit) delete payload.codigo;
    mutation.mutate(payload);
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <Modal title={isEdit ? 'Editar Usuario' : 'Nuevo Usuario'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {!isEdit && (
          <Field label="Codigo">
            <input value={form.codigo} onChange={set('codigo')} required className={inputClass} />
          </Field>
        )}
        <Field label="Nombre y Apellido">
          <input value={form.nombre_apellido} onChange={set('nombre_apellido')} required className={inputClass} />
        </Field>
        <Field label="Email">
          <input type="email" value={form.email} onChange={set('email')} required className={inputClass} />
        </Field>
        <Field label={isEdit ? 'Nueva contrasena (dejar vacio para no cambiar)' : 'Contrasena'}>
          <input type="password" value={form.password} onChange={set('password')} required={!isEdit} className={inputClass} />
        </Field>
        <Field label="Estado">
          <select value={form.id_estado_usuario} onChange={(e) => setForm({ ...form, id_estado_usuario: Number(e.target.value) })} className={inputClass}>
            <option value={10}>Activo</option>
            <option value={20}>Inactivo</option>
          </select>
        </Field>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">Cancelar</button>
          <button type="submit" disabled={mutation.isPending} className={btnPrimary}>
            {mutation.isPending ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function UsuarioPerfilesModal({ usuario, onClose }) {
  const queryClient = useQueryClient();
  const { data: perfilesData, isLoading } = useQuery({
    queryKey: ['usuario-perfiles', usuario.id],
    queryFn: () => seguridadAPI.usuarioPerfiles(usuario.id).then((r) => r.data),
  });

  const bindMutation = useMutation({
    mutationFn: ({ id, perfil_ids }) => seguridadAPI.bindPerfiles(id, perfil_ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuario-perfiles', usuario.id] });
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
    },
  });

  const unbindMutation = useMutation({
    mutationFn: ({ id, perfil_ids }) => seguridadAPI.unbindPerfiles(id, perfil_ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuario-perfiles', usuario.id] });
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
    },
  });

  const toggle = (perfil) => {
    if (perfil.selected) {
      unbindMutation.mutate({ id: usuario.id, perfil_ids: [perfil.id] });
    } else {
      bindMutation.mutate({ id: usuario.id, perfil_ids: [perfil.id] });
    }
  };

  return (
    <Modal title={`Perfiles de ${usuario.nombre_apellido}`} onClose={onClose}>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="space-y-2">
          {perfilesData?.map((p) => (
            <label key={p.id} className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={p.selected}
                onChange={() => toggle(p)}
                className="w-4 h-4 text-primary-600 rounded"
              />
              <div>
                <span className="text-sm font-medium text-gray-800">{p.nombre}</span>
                <span className="text-xs text-gray-500 ml-2">({p.codigo})</span>
              </div>
            </label>
          ))}
        </div>
      )}
    </Modal>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// PERFILES TAB
// ═══════════════════════════════════════════════════════════════════════
function PerfilesTab() {
  const [modal, setModal] = useState(null);
  const [page, setPage] = useState(0);
  const [sort, setSort] = usePersistentSort('seguridad-perfiles');
  const pageSize = 10;
  const queryClient = useQueryClient();

  const handleSort = (key) => {
    setPage(0);
    setSort((prev) => prev.by === key ? { by: key, dir: prev.dir === 'asc' ? 'desc' : 'asc' } : { by: key, dir: 'asc' });
  };

  const { data: perfiles, isLoading } = useQuery({
    queryKey: ['perfiles', page, sort],
    queryFn: () => seguridadAPI.perfiles.list({ skip: page * pageSize, limit: pageSize, sort_by: sort.by, sort_dir: sort.dir }).then((r) => r.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => seguridadAPI.perfiles.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['perfiles'] }),
  });

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'codigo', label: 'Codigo' },
    { key: 'nombre', label: 'Nombre' },
    {
      key: '_actions',
      label: 'Acciones',
      render: (_, row) => (
        <div className="flex gap-2">
          <button className={btnSecondary} onClick={() => setModal({ mode: 'edit', perfil: row })}>Editar</button>
          <button className={btnSecondary} onClick={() => setModal({ mode: 'permisos', perfil: row })}>Permisos</button>
          <button className={btnDanger} onClick={() => { if (confirm('Eliminar perfil?')) deleteMutation.mutate(row.id); }}>Eliminar</button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="mb-3 flex justify-end">
        <button className={btnPrimary} onClick={() => setModal('create')}>Nuevo Perfil</button>
      </div>
      {isLoading ? <LoadingSpinner /> : <DataTable columns={columns} data={perfiles} sort={sort} onSort={handleSort} />}
      <div className="flex items-center justify-between mt-3">
        <button disabled={page === 0} onClick={() => setPage(p => p - 1)} className={`px-3 py-1.5 rounded text-xs font-medium ${page === 0 ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}>Anterior</button>
        <span className="text-xs text-gray-500">Pagina {page + 1}</span>
        <button disabled={!perfiles || perfiles.length < pageSize} onClick={() => setPage(p => p + 1)} className={`px-3 py-1.5 rounded text-xs font-medium ${!perfiles || perfiles.length < pageSize ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}>Siguiente</button>
      </div>
      {modal === 'create' && <PerfilFormModal onClose={() => setModal(null)} />}
      {modal?.mode === 'edit' && <PerfilFormModal perfil={modal.perfil} onClose={() => setModal(null)} />}
      {modal?.mode === 'permisos' && <PerfilPermisosModal perfil={modal.perfil} onClose={() => setModal(null)} />}
    </>
  );
}

function PerfilFormModal({ perfil, onClose }) {
  const queryClient = useQueryClient();
  const isEdit = !!perfil;
  const [form, setForm] = useState({
    codigo: perfil?.codigo || '',
    nombre: perfil?.nombre || '',
  });
  const [error, setError] = useState('');

  const mutation = useMutation({
    mutationFn: (data) => isEdit ? seguridadAPI.perfiles.update(perfil.id, data) : seguridadAPI.perfiles.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['perfiles'] }); onClose(); },
    onError: (e) => setError(e.response?.data?.detail || 'Error al guardar'),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = isEdit ? { nombre: form.nombre } : form;
    mutation.mutate(payload);
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <Modal title={isEdit ? 'Editar Perfil' : 'Nuevo Perfil'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {!isEdit && (
          <Field label="Codigo">
            <input value={form.codigo} onChange={set('codigo')} required className={inputClass} />
          </Field>
        )}
        <Field label="Nombre">
          <input value={form.nombre} onChange={set('nombre')} required className={inputClass} />
        </Field>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">Cancelar</button>
          <button type="submit" disabled={mutation.isPending} className={btnPrimary}>
            {mutation.isPending ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function PerfilPermisosModal({ perfil, onClose }) {
  const queryClient = useQueryClient();
  const { data: permisosData, isLoading } = useQuery({
    queryKey: ['perfil-permisos', perfil.id],
    queryFn: () => seguridadAPI.perfilPermisos(perfil.id).then((r) => r.data),
  });

  const bindMutation = useMutation({
    mutationFn: ({ id, permiso_ids }) => seguridadAPI.bindPermisos(id, permiso_ids),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['perfil-permisos', perfil.id] }),
  });

  const unbindMutation = useMutation({
    mutationFn: ({ id, permiso_ids }) => seguridadAPI.unbindPermisos(id, permiso_ids),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['perfil-permisos', perfil.id] }),
  });

  const toggle = (permiso) => {
    if (permiso.selected) {
      unbindMutation.mutate({ id: perfil.id, permiso_ids: [permiso.id] });
    } else {
      bindMutation.mutate({ id: perfil.id, permiso_ids: [permiso.id] });
    }
  };

  // Group by sistema
  const grouped = {};
  permisosData?.forEach((p) => {
    if (!grouped[p.sistema]) grouped[p.sistema] = [];
    grouped[p.sistema].push(p);
  });

  return (
    <Modal title={`Permisos de ${perfil.nombre}`} onClose={onClose}>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="space-y-4">
          {Object.entries(grouped).map(([sistema, permisos]) => (
            <div key={sistema}>
              <h4 className="text-sm font-semibold text-gray-600 uppercase mb-1">{sistema}</h4>
              <div className="space-y-1">
                {permisos.map((p) => (
                  <label key={p.id} className="flex items-center gap-3 p-1.5 rounded hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={p.selected}
                      onChange={() => toggle(p)}
                      className="w-4 h-4 text-primary-600 rounded"
                    />
                    <span className="text-sm text-gray-800">{p.nombre}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// PERMISOS TAB (solo lectura)
// ═══════════════════════════════════════════════════════════════════════
function PermisosTab() {
  const [page, setPage] = useState(0);
  const [sort, setSort] = usePersistentSort('seguridad-permisos');
  const pageSize = 10;

  const handleSort = (key) => {
    setPage(0);
    setSort((prev) => prev.by === key ? { by: key, dir: prev.dir === 'asc' ? 'desc' : 'asc' } : { by: key, dir: 'asc' });
  };

  const { data: permisos, isLoading } = useQuery({
    queryKey: ['permisos', page, sort],
    queryFn: () => seguridadAPI.permisos.list({ skip: page * pageSize, limit: pageSize, sort_by: sort.by, sort_dir: sort.dir }).then((r) => r.data),
  });

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'codigo', label: 'Codigo' },
    { key: 'nombre', label: 'Nombre' },
    { key: 'sistema', label: 'Sistema' },
  ];

  return (
    <>
      {isLoading ? <LoadingSpinner /> : <DataTable columns={columns} data={permisos} sort={sort} onSort={handleSort} />}
      <div className="flex items-center justify-between mt-3">
        <button disabled={page === 0} onClick={() => setPage(p => p - 1)} className={`px-3 py-1.5 rounded text-xs font-medium ${page === 0 ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}>Anterior</button>
        <span className="text-xs text-gray-500">Pagina {page + 1}</span>
        <button disabled={!permisos || permisos.length < pageSize} onClick={() => setPage(p => p + 1)} className={`px-3 py-1.5 rounded text-xs font-medium ${!permisos || permisos.length < pageSize ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}>Siguiente</button>
      </div>
    </>
  );
}
