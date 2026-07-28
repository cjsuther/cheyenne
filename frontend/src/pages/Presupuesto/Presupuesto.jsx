import ModuleInfoPage from '../../components/common/ModuleInfoPage';

// E1: página informativa del super-módulo. Las entregas E2-E5 la reemplazan por las
// pantallas reales (Partidas, Modificaciones, Recursos, Tablero, Nomencladores).
export default function Presupuesto() {
  return (
    <ModuleInfoPage
      title="Presupuesto"
      subtitle="Formulación, modificaciones y ejecución del presupuesto municipal"
      descripcion="Administra el presupuesto de gastos y recursos del municipio: las partidas
        presupuestarias (jurisdicción × estructura programática × objeto del gasto × fuente de
        financiamiento), sus modificaciones con aprobación y acto administrativo, el cálculo de
        recursos por rubro y la ejecución (preventivo, compromiso, devengado y pagado) sobre un
        libro mayor presupuestario con saldos en tiempo real."
      capacidades={[
        { titulo: 'Partidas y saldos', detalle: 'Crédito inicial, modificaciones, vigente, comprometido, devengado, pagado y disponible por partida, derivados del ledger.' },
        { titulo: 'Modificaciones', detalle: 'Ampliaciones, reducciones y compensaciones (Σ=0) con workflow de aprobación, acto administrativo y anulación por contra-movimientos.' },
        { titulo: 'Recursos', detalle: 'Cálculo de recursos por jurisdicción y rubro, con modificaciones y percibido.' },
        { titulo: 'API de afectación', detalle: 'Contrato para el ciclo del gasto: preventivo → compromiso → devengado → pagado, idempotente y con control de sobregiro configurable.' },
      ]}
      integra={[
        'Seguridad: permisos por acción (aprobar ejercicio, aprobar modificaciones, afectar)',
        'Administración: importación opcional de jurisdicciones',
        'Contaduría (futuro): las etapas del gasto afectan las partidas por HTTP',
      ]}
      endpoints={[
        'GET  /api/presupuesto/health',
        'GET  /api/presupuesto/info/permisos',
      ]}
      nota="Entrega 1 desplegada (servicio + seguridad + permisos). Las pantallas de Partidas, Modificaciones, Recursos y Tablero llegan en las próximas entregas (E2–E5 del plan aprobado)."
    />
  );
}
