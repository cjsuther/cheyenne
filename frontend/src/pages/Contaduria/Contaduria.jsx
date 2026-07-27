import ModuleInfoPage from '../../components/common/ModuleInfoPage';

export default function Contaduria() {
  return (
    <ModuleInfoPage
      title="Contaduría"
      subtitle="Contabilidad y ejecución presupuestaria"
      descripcion="Módulo destinado a la contabilidad de la administración: registración contable,
        ejecución del presupuesto, asientos y conciliación con la recaudación. Se integrará con
        Tesorería (movimientos y rendiciones) y con Ingresos Públicos (imputación de tributos)."
      capacidades={[
        { titulo: 'Registración contable', detalle: 'Asientos y libros de la administración (pendiente de definición y construcción).' },
        { titulo: 'Ejecución presupuestaria', detalle: 'Seguimiento de partidas y ejecución del presupuesto.' },
        { titulo: 'Conciliación', detalle: 'Cruce entre lo recaudado (Tesorería) y lo imputado contablemente.' },
      ]}
      nota="Módulo aún sin funcionalidad. Esta vista reserva su lugar en la navegación y describe su alcance previsto."
    />
  );
}
