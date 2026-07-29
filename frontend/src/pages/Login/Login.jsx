import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth';
import { authAPI } from '../../services/api';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [totp, setTotp] = useState('');
  const [needs2fa, setNeeds2fa] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setTokens, setUser } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data: tokens } = await authAPI.login(username, password, totp || undefined);
      setTokens(tokens.access_token, tokens.refresh_token);

      const { data: user } = await authAPI.me();
      setUser(user);

      navigate('/');
    } catch (err) {
      const requiere2fa = err.response?.headers?.['x-2fa-required'] === 'true'
        || /2fa/i.test(err.response?.data?.detail || '');
      if (requiere2fa) {
        setNeeds2fa(true);
        // solo mostrar error si ya se había ingresado un código (código inválido)
        setError(totp ? (err.response?.data?.detail || 'Código 2FA inválido') : '');
      } else {
        setNeeds2fa(false);
        setError(err.response?.data?.detail || 'Error al iniciar sesion');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Cheyenne</h1>
          <p className="text-gray-500 mt-2">Sistema de Administracion</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Usuario
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contrasena
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              required
            />
          </div>

          {needs2fa && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Código de autenticación (2FA)
              </label>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                value={totp}
                onChange={(e) => setTotp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="123456"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg tracking-widest text-center focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                autoFocus
              />
              <p className="text-xs text-gray-400 mt-1">Ingresá el código de 6 dígitos de tu app de autenticación.</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || (needs2fa && totp.length < 6)}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Ingresando...' : needs2fa ? 'Verificar código' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
}
