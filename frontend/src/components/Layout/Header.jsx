import { useAuthStore } from '../../store/auth';
import { authAPI } from '../../services/api';
import { useNavigate, Link } from 'react-router-dom';

export default function Header({ onMenuToggle }) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch {
      // ignore
    }
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-3 sm:px-6 py-3 flex items-center justify-between gap-2">
      <div className="flex items-center gap-3">
        {/* Hamburger button - mobile only */}
        <button onClick={onMenuToggle} className="lg:hidden p-1.5 rounded-md text-gray-600 hover:bg-gray-100">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="text-base sm:text-lg font-semibold text-gray-800 truncate">
          Cheyenne
        </h1>
      </div>
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        <Link to="/perfil" className="text-xs sm:text-sm text-primary-600 hover:text-primary-800 font-medium truncate max-w-[120px] sm:max-w-none">
          {user?.nombre_apellido || user?.codigo}
        </Link>
        <button
          onClick={handleLogout}
          className="text-xs sm:text-sm text-red-600 hover:text-red-800 font-medium whitespace-nowrap"
        >
          Salir
        </button>
      </div>
    </header>
  );
}
