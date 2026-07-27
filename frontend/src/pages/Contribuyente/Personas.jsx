import Administracion from '../Administracion/Administracion';

// Gestión de personas humanas y jurídicas (subconjunto de Administración).
export default function Personas() {
  return (
    <Administracion
      titulo="Personas"
      subtitulo="Personas humanas y jurídicas"
      gruposVisibles={['Personas']}
    />
  );
}
