import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from './store/auth';
import Layout from './components/Layout/Layout';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Administracion from './pages/Administracion/Administracion';
import Auditoria from './pages/Auditoria/Auditoria';
import IngresosPublicos from './pages/IngresosPublicos/IngresosPublicos';
import Tesoreria from './pages/Tesoreria/Tesoreria';
import Comunicacion from './pages/Comunicacion/Comunicacion';
import Seguridad from './pages/Seguridad/Seguridad';
import Wav from './pages/Wav/Wav';
import Emisiones from './pages/Emisiones/Emisiones';
import Perfil from './pages/Perfil/Perfil';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="administracion/*" element={<Administracion />} />
            <Route path="auditoria/*" element={<Auditoria />} />
            <Route path="ingresos-publicos/*" element={<IngresosPublicos />} />
            <Route path="tesoreria/*" element={<Tesoreria />} />
            <Route path="comunicacion/*" element={<Comunicacion />} />
            <Route path="seguridad/*" element={<Seguridad />} />
            <Route path="wav/*" element={<Wav />} />
            <Route path="emisiones/*" element={<Emisiones />} />
            <Route path="perfil" element={<Perfil />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
