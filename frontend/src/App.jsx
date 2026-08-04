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
import Contribuyente360 from './pages/Contribuyente360/Contribuyente360';
import TasasFormulas from './pages/TasasFormulas/TasasFormulas';
import Importacion from './pages/Importacion/Importacion';
import Interface from './pages/Interface/Interface';
import Personas from './pages/Contribuyente/Personas';
import Configuracion from './pages/Configuracion/Configuracion';
import Contaduria from './pages/Contaduria/Contaduria';
import Presupuesto from './pages/Presupuesto/Presupuesto';
import Compras from './pages/Compras/Compras';
import Contabilidad from './pages/Contabilidad/Contabilidad';
import Cementerio from './pages/Cementerio/Cementerio';
import Apremios from './pages/Apremios/Apremios';
import Reportes from './pages/Reportes/Reportes';
import Patrimonio from './pages/Patrimonio/Patrimonio';
import CreditoPublico from './pages/CreditoPublico/CreditoPublico';
import Firma from './pages/Firma/Firma';
import Rrhh from './pages/Rrhh/Rrhh';
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
            {/* Contribuyente */}
            <Route path="contribuyente-360" element={<Contribuyente360 />} />
            <Route path="contribuyente/personas" element={<Personas />} />
            {/* Ingresos Públicos */}
            <Route path="ingresos-publicos/*" element={<IngresosPublicos />} />
            <Route path="emisiones/*" element={<Emisiones />} />
            <Route path="tasas-formulas" element={<TasasFormulas />} />
            <Route path="tesoreria/*" element={<Tesoreria />} />
            <Route path="wav/*" element={<Wav />} />
            <Route path="comunicacion/*" element={<Comunicacion />} />
            <Route path="importacion" element={<Importacion />} />
            <Route path="interface" element={<Interface />} />
            {/* Presupuesto */}
            <Route path="presupuesto" element={<Presupuesto />} />
            {/* Compras */}
            <Route path="compras" element={<Compras />} />
            {/* Contabilidad */}
            <Route path="contabilidad" element={<Contabilidad />} />
            <Route path="cementerio" element={<Cementerio />} />
            <Route path="apremios" element={<Apremios />} />
            <Route path="reportes" element={<Reportes />} />
            <Route path="patrimonio" element={<Patrimonio />} />
            <Route path="credito-publico" element={<CreditoPublico />} />
            <Route path="firma" element={<Firma />} />
            <Route path="rrhh" element={<Rrhh />} />
            {/* Contaduría */}
            <Route path="contaduria" element={<Contaduria />} />
            {/* Configuración (maestros) */}
            <Route path="configuracion" element={<Configuracion />} />
            <Route path="administracion/*" element={<Administracion />} />
            {/* Seguridad */}
            <Route path="seguridad/*" element={<Seguridad />} />
            <Route path="auditoria/*" element={<Auditoria />} />
            <Route path="perfil" element={<Perfil />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
