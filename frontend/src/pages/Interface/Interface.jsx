import ModuleInfoPage from '../../components/common/ModuleInfoPage';

export default function Interface() {
  return (
    <ModuleInfoPage
      title="Interface — Portal ciudadano"
      subtitle="Canal hacia el contribuyente e integraciones externas"
      descripcion="Módulo de contacto con el ciudadano y con servicios externos. Expone las boletas
        para que el contribuyente las consulte y pague, recibe sus consultas web y procesa las
        notificaciones de pago que envían las pasarelas/bancos (para confirmar automáticamente los
        cobros hechos por fuera de la ventanilla)."
      capacidades={[
        { titulo: 'Boletas', detalle: 'Emisión y consulta de boletas de pago por cuenta, para que el ciudadano las obtenga online.' },
        { titulo: 'Consultas web', detalle: 'Registro y seguimiento de consultas/reclamos que hace el contribuyente desde el portal.' },
        { titulo: 'Notificaciones de pago', detalle: 'Recepción de avisos de pago (webhooks) de pasarelas y bancos para confirmar el cobro.' },
        { titulo: 'Listas de configuración', detalle: 'Catálogos internos del módulo (tipos de boleta, canales, estados).' },
      ]}
      integra={[
        'Publica las boletas generadas por Emisiones al ciudadano',
        'Recibe notificaciones de pasarelas de pago / bancos',
        'Puede derivar los pagos confirmados a Tesorería / cuenta corriente',
      ]}
      endpoints={[
        'GET  /api/interface/boletas',
        'GET  /api/interface/boletas/by-cuenta/{numero}',
        'POST /api/interface/boletas',
        'GET  /api/interface/consultas',
        'POST /api/interface/pagos/notificaciones',
      ]}
      nota="El backend del módulo está operativo (API disponible). El portal ciudadano y la bandeja de notificaciones están pendientes de construcción; esta vista describe su alcance."
    />
  );
}
