import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '../../store/auth';
import { authAPI } from '../../services/api';
import PageHeader from '../../components/common/PageHeader';

const inputClass = 'mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500';
const btnPrimary = 'bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium';

export default function Perfil() {
  return (
    <div>
      <PageHeader title="Mi Perfil" subtitle="Editar informacion personal y contrasena" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProfileInfoCard />
        <ChangePasswordCard />
      </div>
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
