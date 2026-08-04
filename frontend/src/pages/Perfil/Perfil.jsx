import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../store/auth';
import { authAPI } from '../../services/api';
import PageHeader from '../../components/common/PageHeader';

const inputClass = 'mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500';
const btnPrimary = 'bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium';
const btnSecondary = 'bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium';
const btnDanger = 'bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium';

export default function Perfil() {
  return (
    <div>
      <PageHeader title="Mi Perfil" subtitle="Editar informacion personal, contrasena y seguridad" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProfileInfoCard />
        <ChangePasswordCard />
        <TwoFactorCard />
        <FirmaCard />
      </div>
    </div>
  );
}

function FirmaCard() {
  const qc = useQueryClient();
  const [clave, setClave] = useState('');
  const [clave2, setClave2] = useState('');
  const [aclaracion, setAclaracion] = useState('');
  const [seeded, setSeeded] = useState(false);
  const [msg, setMsg] = useState(null);
  const { data: cfg } = useQuery({ queryKey: ['mi-firma'], queryFn: () => authAPI.firmaConfig.get().then((r) => r.data) });
  if (cfg && !seeded) { setAclaracion(cfg.aclaracion || ''); setSeeded(true); }
  const guardar = useMutation({
    mutationFn: () => authAPI.firmaConfig.set({ clave, aclaracion }),
    onSuccess: () => { setMsg({ type: 'success', text: 'Clave de firma guardada.' }); setClave(''); setClave2(''); qc.invalidateQueries({ queryKey: ['mi-firma'] }); },
    onError: (e) => setMsg({ type: 'error', text: e.response?.data?.detail || 'No se pudo guardar' }),
  });
  const puede = clave.length >= 4 && clave === clave2;
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-800">Firma digital</h3>
      <p className="text-sm text-gray-500 mt-1 mb-4">
        Tu <b>clave de firma</b> (distinta de tu contraseña) se te pedirá al firmar documentos.{' '}
        {cfg?.tiene_clave ? 'Ya tenés una clave configurada.' : 'Todavía no configuraste tu clave.'}
      </p>
      {msg && <div className={`mb-3 text-sm rounded-lg px-4 py-2 ${msg.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{msg.text}</div>}
      <div className="space-y-3">
        <div><label className="text-sm text-gray-600">Aclaración de firma</label>
          <input value={aclaracion} onChange={(e) => setAclaracion(e.target.value)} placeholder="Cont. Juan Pérez — Tesorero" className={inputClass} /></div>
        <div><label className="text-sm text-gray-600">{cfg?.tiene_clave ? 'Nueva clave de firma' : 'Clave de firma'} (mín. 4 caracteres)</label>
          <input type="password" value={clave} onChange={(e) => setClave(e.target.value)} className={inputClass} /></div>
        <div><label className="text-sm text-gray-600">Repetir clave</label>
          <input type="password" value={clave2} onChange={(e) => setClave2(e.target.value)} className={inputClass} /></div>
        {clave && clave !== clave2 && <p className="text-xs text-red-500">Las claves no coinciden.</p>}
        <button className={btnPrimary} onClick={() => { setMsg(null); guardar.mutate(); }} disabled={!puede || guardar.isPending}>
          {guardar.isPending ? 'Guardando…' : 'Guardar clave de firma'}
        </button>
      </div>
    </div>
  );
}

function TwoFactorCard() {
  const qc = useQueryClient();
  const [step, setStep] = useState('idle'); // idle | setup | confirm
  const [setupData, setSetupData] = useState(null);
  const [codigo, setCodigo] = useState('');
  const [codigosRespaldo, setCodigosRespaldo] = useState(null);
  const [msg, setMsg] = useState(null);

  const { data: estado, isLoading } = useQuery({
    queryKey: ['twofa-estado'],
    queryFn: () => authAPI.twofaEstado().then((r) => r.data),
  });

  const invalidar = () => qc.invalidateQueries({ queryKey: ['twofa-estado'] });

  const setupMut = useMutation({
    mutationFn: () => authAPI.twofaSetup(),
    onSuccess: (r) => { setSetupData(r.data); setStep('confirm'); setMsg(null); },
    onError: (e) => setMsg({ type: 'error', text: e.response?.data?.detail || 'Error' }),
  });

  const activarMut = useMutation({
    mutationFn: () => authAPI.twofaActivar(codigo),
    onSuccess: (r) => {
      setCodigosRespaldo(r.data.codigos_respaldo);
      setStep('idle'); setSetupData(null); setCodigo('');
      setMsg({ type: 'success', text: '2FA activado correctamente.' });
      invalidar();
    },
    onError: (e) => setMsg({ type: 'error', text: e.response?.data?.detail || 'Codigo invalido' }),
  });

  const desactivarMut = useMutation({
    mutationFn: () => authAPI.twofaDesactivar(codigo),
    onSuccess: () => {
      setCodigo(''); setCodigosRespaldo(null);
      setMsg({ type: 'success', text: '2FA desactivado.' });
      invalidar();
    },
    onError: (e) => setMsg({ type: 'error', text: e.response?.data?.detail || 'Codigo invalido' }),
  });

  const qrUrl = setupData
    ? `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(setupData.otpauth_uri)}`
    : null;

  return (
    <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Autenticacion en dos pasos (2FA)</h3>
        {!isLoading && (
          <span className={`text-xs px-2 py-1 rounded-full ${estado?.habilitado ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
            {estado?.habilitado ? 'Activado' : 'Desactivado'}
          </span>
        )}
      </div>

      {msg && (
        <p className={`text-sm mb-3 ${msg.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>{msg.text}</p>
      )}

      {codigosRespaldo && (
        <div className="mb-4 border border-amber-300 bg-amber-50 rounded-lg p-4">
          <p className="text-sm font-medium text-amber-800 mb-2">Codigos de respaldo (guardelos, no se volveran a mostrar):</p>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 font-mono text-sm">
            {codigosRespaldo.map((c) => <span key={c} className="bg-white border rounded px-2 py-1 text-center">{c}</span>)}
          </div>
        </div>
      )}

      {/* No habilitado y no configurando */}
      {!estado?.habilitado && step === 'idle' && (
        <div>
          <p className="text-sm text-gray-600 mb-4">Anada una capa extra de seguridad usando una app de autenticacion (Google Authenticator, Authy, etc.).</p>
          <button onClick={() => setupMut.mutate()} disabled={setupMut.isPending} className={btnPrimary}>
            {setupMut.isPending ? 'Generando...' : 'Configurar 2FA'}
          </button>
        </div>
      )}

      {/* Configurando: mostrar QR/secret y pedir codigo */}
      {step === 'confirm' && setupData && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">Escanee este codigo QR con su app de autenticacion, o ingrese la clave manualmente.</p>
          <div className="flex flex-col sm:flex-row items-start gap-4">
            {qrUrl && <img src={qrUrl} alt="QR 2FA" className="border rounded" width={180} height={180} />}
            <div className="text-sm">
              <p className="text-gray-500">Clave secreta:</p>
              <code className="block bg-gray-100 px-2 py-1 rounded font-mono break-all mb-3">{setupData.secret}</code>
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Codigo de 6 digitos</span>
                <input value={codigo} onChange={(e) => setCodigo(e.target.value)} maxLength={6} inputMode="numeric" className={inputClass} placeholder="123456" />
              </label>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => activarMut.mutate()} disabled={activarMut.isPending || codigo.length < 6} className={btnPrimary}>
              {activarMut.isPending ? 'Activando...' : 'Activar 2FA'}
            </button>
            <button onClick={() => { setStep('idle'); setSetupData(null); setCodigo(''); setMsg(null); }} className={btnSecondary}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Habilitado: opcion de desactivar */}
      {estado?.habilitado && (
        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            2FA esta activo. Codigos de respaldo disponibles: <strong>{estado.codigos_respaldo_restantes}</strong>.
          </p>
          <label className="block max-w-xs">
            <span className="text-sm font-medium text-gray-700">Ingrese un codigo para desactivar</span>
            <input value={codigo} onChange={(e) => setCodigo(e.target.value)} maxLength={8} className={inputClass} placeholder="Codigo TOTP o de respaldo" />
          </label>
          <button onClick={() => desactivarMut.mutate()} disabled={desactivarMut.isPending || !codigo} className={btnDanger}>
            {desactivarMut.isPending ? 'Desactivando...' : 'Desactivar 2FA'}
          </button>
        </div>
      )}
    </div>
  );
}

function ProfileInfoCard() {
  const { user, setUser } = useAuthStore();
  const [form, setForm] = useState({
    nombre_apellido: user?.nombre_apellido || '',
    email: user?.email || '',
  });
  const [msg, setMsg] = useState(null);

  const mutation = useMutation({
    mutationFn: (data) => authAPI.updateProfile(data),
    onSuccess: (res) => {
      setUser(res.data);
      setMsg({ type: 'success', text: 'Perfil actualizado correctamente' });
    },
    onError: (e) => {
      setMsg({ type: 'error', text: e.response?.data?.detail || 'Error al actualizar' });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setMsg(null);
    mutation.mutate(form);
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Informacion Personal</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Codigo de usuario</span>
          <input value={user?.codigo || ''} disabled className={inputClass + ' bg-gray-50 text-gray-500'} />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Nombre y Apellido</span>
          <input value={form.nombre_apellido} onChange={set('nombre_apellido')} required className={inputClass} />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Email</span>
          <input type="email" value={form.email} onChange={set('email')} required className={inputClass} />
        </label>
        {msg && (
          <p className={`text-sm ${msg.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
            {msg.text}
          </p>
        )}
        <div className="flex justify-end">
          <button type="submit" disabled={mutation.isPending} className={btnPrimary}>
            {mutation.isPending ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </form>
    </div>
  );
}

function ChangePasswordCard() {
  const [form, setForm] = useState({ current_password: '', new_password: '', confirm: '' });
  const [msg, setMsg] = useState(null);

  const mutation = useMutation({
    mutationFn: (data) => authAPI.changeOwnPassword(data),
    onSuccess: () => {
      setMsg({ type: 'success', text: 'Contrasena actualizada correctamente' });
      setForm({ current_password: '', new_password: '', confirm: '' });
    },
    onError: (e) => {
      setMsg({ type: 'error', text: e.response?.data?.detail || 'Error al cambiar contrasena' });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setMsg(null);
    if (form.new_password !== form.confirm) {
      setMsg({ type: 'error', text: 'Las contrasenas no coinciden' });
      return;
    }
    if (form.new_password.length < 6) {
      setMsg({ type: 'error', text: 'La contrasena debe tener al menos 6 caracteres' });
      return;
    }
    mutation.mutate({ current_password: form.current_password, new_password: form.new_password });
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Cambiar Contrasena</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Contrasena actual</span>
          <input type="password" value={form.current_password} onChange={set('current_password')} required className={inputClass} />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Nueva contrasena</span>
          <input type="password" value={form.new_password} onChange={set('new_password')} required className={inputClass} />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Confirmar nueva contrasena</span>
          <input type="password" value={form.confirm} onChange={set('confirm')} required className={inputClass} />
        </label>
        {msg && (
          <p className={`text-sm ${msg.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
            {msg.text}
          </p>
        )}
        <div className="flex justify-end">
          <button type="submit" disabled={mutation.isPending} className={btnPrimary}>
            {mutation.isPending ? 'Cambiando...' : 'Cambiar contrasena'}
          </button>
        </div>
      </form>
    </div>
  );
}
