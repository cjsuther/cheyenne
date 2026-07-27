import ModuleInfoPage from '../../components/common/ModuleInfoPage';

export default function Importacion() {
  return (
    <ModuleInfoPage
      title="Importación / Exportación"
      subtitle="Intercambio de datos por lotes con fuentes externas (ETL)"
      descripcion="Módulo de intercambio masivo de datos. Procesa archivos que llegan de terceros
        (bancos, entes recaudadores, otros sistemas) para incorporar novedades y pagos al sistema, y
        genera archivos de salida para enviar a esos mismos terceros. El trabajo se organiza en lotes,
        cada uno con su detalle de registros procesados, aceptados y rechazados."
      capacidades={[
        { titulo: 'Importación de lotes', detalle: 'Carga de archivos externos (novedades, pagos) en lotes, con el detalle registro por registro de lo procesado.' },
        { titulo: 'Exportación de lotes', detalle: 'Generación de archivos de salida para bancos o entes (padrones, deuda, recaudación) en lotes.' },
        { titulo: 'Detalle y trazabilidad', detalle: 'Cada lote guarda su detalle para auditar qué se importó/exportó y detectar rechazos.' },
        { titulo: 'Listas de configuración', detalle: 'Catálogos internos del módulo (tipos de lote, orígenes, estados).' },
      ]}
      integra={[
        'Recibe archivos de bancos / entes recaudadores y otros sistemas',
        'Alimenta al núcleo de Rentas (padrón, novedades, pagos)',
        'Genera salidas para terceros a partir de los datos del sistema',
      ]}
      endpoints={[
        'GET  /api/importacion/lotes',
        'POST /api/importacion/lotes',
        'GET  /api/importacion/lotes/{id}/detalles',
        'GET  /api/importacion/exportaciones/lotes',
        'POST /api/importacion/exportaciones/lotes',
      ]}
      nota="El backend del módulo está operativo (API disponible). La pantalla de carga y seguimiento de lotes está pendiente de construcción; esta vista describe su alcance."
    />
  );
}
