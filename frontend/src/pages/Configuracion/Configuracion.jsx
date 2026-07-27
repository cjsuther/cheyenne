import Administracion from '../Administracion/Administracion';

// Maestros y datos de configuración del sistema (resto de Administración).
export default function Configuracion() {
  return (
    <Administracion
      titulo="Configuración"
      subtitulo="Maestros y datos del sistema"
      gruposVisibles={['Ubicaciones', 'Contable', 'Contacto', 'Expedientes', 'Otros']}
    />
  );
}
