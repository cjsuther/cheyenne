import { InjectionMode, createContainer, asClass } from 'awilix';

import MessageRouterRabbitMQ from '../sdk/communication/message-router/message-router-rabbitmq';
import PublishService from '../../domain/services/publish-service';
import SubscribeService from '../../domain/services/subscribe-service';
import QueueMessageExecute from '../../domain/services/process/queue-message/queue-message-execute';

import ReporteController from '../../server/controllers/reporte-controller';
import PagoController from '../../server/controllers/pago-controller';
import ProcesoController from '../../server/controllers/proceso-controller';
import ConfiguracionController from '../../server/controllers/configuracion-controller';
import ListaController from '../../server/controllers/lista-controller';
import EntidadController from '../../server/controllers/entidad-controller';
import DireccionController from '../../server/controllers/direccion-controller';
import InformacionAdicionalController from '../../server/controllers/informacion-adicional-controller';
import ArchivoController from '../../server/controllers/archivo-controller';
import ObservacionController from '../../server/controllers/observacion-controller';
import EtiquetaController from '../../server/controllers/etiqueta-controller'
import ContribuyenteController from '../../server/controllers/contribuyente-controller';
import CuentaController from '../../server/controllers/cuenta-controller';
import VariableController from '../../server/controllers/variable-controller';
import VariableGlobalController from '../../server/controllers/variable-global-controller';

import InmuebleController from '../../server/controllers/inmueble-controller';
import VinculoInmuebleController from '../../server/controllers/vinculo-inmueble-controller';
import CatastroController from '../../server/controllers/catastro-controller';

import ComercioController from '../../server/controllers/comercio-controller';
import VinculoComercioController from '../../server/controllers/vinculo-comercio-controller';

import VehiculoController from '../../server/controllers/vehiculo-controller';
import VinculoVehiculoController from '../../server/controllers/vinculo-vehiculo-controller';

import CementerioController from '../../server/controllers/cementerio-controller';
import VinculoCementerioController from '../../server/controllers/vinculo-cementerio-controller';

import FondeaderoController from '../../server/controllers/fondeadero-controller';
import VinculoFondeaderoController from '../../server/controllers/vinculo-fondeadero-controller';

import EspecialController from '../../server/controllers/especial-controller';
import VinculoEspecialController from '../../server/controllers/vinculo-especial-controller';

import EmisionDefinicionController from '../../server/controllers/emision-definicion-controller';
import EmisionEjecucionController from '../../server/controllers/emision-ejecucion-controller';
import EmisionEjecucionCuentaController from '../../server/controllers/emision-ejecucion-cuenta-controller';
import EmisionAprobacionController from '../../server/controllers/emision-aprobacion-controller';
import EmisionNumeracionController from '../../server/controllers/emision-numeracion-controller';
import ProcedimientoController from '../../server/controllers/procedimiento-controller';

import TasaController from '../../server/controllers/tasa-controller';
import SubTasaController from '../../server/controllers/sub-tasa-controller';
import TasaVencimientoController from '../../server/controllers/tasa-vencimiento-controller';

import CertificadoEscribanoController from '../../server/controllers/certificado-escribano-controller';

import ApremioController from '../../server/controllers/apremio-controller';
import CertificadoApremioController from '../../server/controllers/certificado-apremio-controller';
import CertificadoApremioItemController from '../../server/controllers/certificado-apremio-item-controller';
import PlantillaDocumentoController from '../../server/controllers/plantilla-documento-controller';
import TipoActoProcesalController from '../../server/controllers/tipo-acto-procesal-controller';
import OrganoJudicialController from '../../server/controllers/organo-judicial-controller';
import TipoRelacionCertificadoApremioPersonaController from '../../server/controllers/tipo-relacion-certificado-apremio-persona-controller';

import TipoMovimientoController from '../../server/controllers/tipo-movimiento-controller';
import CuentaPagoController from '../../server/controllers/cuenta-pago-controller';
import CuentaPagoItemController from '../../server/controllers/cuenta-pago-item-controller';
import CuentaCorrienteItemController from '../../server/controllers/cuenta-corriente-item-controller';
import CuentaCorrienteCondicionEspecialController from '../../server/controllers/cuenta-corriente-condicion-especial-controller';
import ConvenioParametroController from '../../server/controllers/convenio-parametro-controller';
import TipoPlanPagoController from '../../server/controllers/tipo-plan-pago-controller';
import TipoVencimientoPlanPagoController from '../../server/controllers/tipo-vencimiento-plan-pago-controller';
import PlanPagoDefinicionController from '../../server/controllers/plan-pago-definicion-controller';
import PlanPagoController from '../../server/controllers/plan-pago-controller';
import PlanPagoCuotaController from '../../server/controllers/plan-pago-cuota-controller';
import PagoContadoDefinicionController from '../../server/controllers/pago-contado-definicion-controller';
import PagoContadoController from '../../server/controllers/pago-contado-controller';
import CuotaPorcentajeController from '../../server/controllers/cuota-porcentaje-controller';

import TipoControladorController from '../../server/controllers/tipo-controlador-controller';
import ControladorController from '../../server/controllers/controlador-controller';
import TipoVinculoCuentaController from '../../server/controllers/tipo-vinculo-cuenta-controller';
import VinculoCuentaController from '../../server/controllers/vinculo-cuenta-controller';

import DeclaracionJuradaComercioController from '../../server/controllers/declaracion-jurada-comercio-controller';
import ClaseElementoController from '../../server/controllers/clase-elemento-controller';
import TipoElementoController from '../../server/controllers/tipo-elemento-controller';
import FiltroController from '../../server/controllers/filtro-controller';
import ColeccionController from '../../server/controllers/coleccion-controller';

import ReciboEspecialController from '../../server/controllers/recibo-especial-controller';

import ReporteService from  '../../domain/services/reporte-service';
import ReportCementerioSolicitudReduccion from '../../domain/services/reports/report-cementerio-solicitud-reduccion';
import ReportCementerioSolicitudVerificacion from '../../domain/services/reports/report-cementerio-solicitud-verificacion';
import ReportEmisionAprobacionCalculo from '../../domain/services/reports/report-emision-aprobacion-calculo';
import ReportEmisionAprobacionOrdenamiento from '../../domain/services/reports/report-emision-aprobacion-ordenamiento';
import ReportEmisionAprobacionControlRecibos from '../../domain/services/reports/report-emision-aprobacion-control-recibos';
import ReportCuentaCorrienteRecibo from '../../domain/services/reports/report-cuenta-corriente-recibo';
import ReportPlanPagoRecibo from '../../domain/services/reports/report-plan-pago-recibo';
import ReportPlanPagoConvenio from '../../domain/services/reports/report-plan-pago-convenio';
import ReportApremioCaratula from '../../domain/services/reports/report-apremio-caratula';
import ReportVehiculoBaja from '../../domain/services/reports/report-vehiculo-baja';
import ReportVehiculoLibreDeuda from '../../domain/services/reports/report-vehiculo-libre-deuda';
import ReportCertificadoApremioJuicio from '../../domain/services/reports/report-certificado-apremio-juicio';
import ReportEmisionRecibos from '../../domain/services/reports/report-emision-recibos';

import PerfilService from '../../domain/services/perfil-service';
import PagoService from '../../domain/services/pago-service';
import ProcesoService from '../../domain/services/proceso-service';
import ProcesoProgramacionService from '../../domain/services/proceso-programacion-service';
import ConfiguracionService from '../../domain/services/configuracion-service';
import NumeracionService from '../../domain/services/numeracion-service';
import ListaService from '../../domain/services/lista-service';
import EntidadService from '../../domain/services/entidad-service';
import DireccionService from '../../domain/services/direccion-service';
import InformacionAdicionalService from '../../domain/services/informacion-adicional-service';
import ArchivoService from '../../domain/services/archivo-service';
import ObservacionService from '../../domain/services/observacion-service';
import EtiquetaService from '../../domain/services/etiqueta-service';
import ContribuyenteService from '../../domain/services/contribuyente-service';
import CuentaService from '../../domain/services/cuenta-service';
import RelacionCuentaService from '../../domain/services/relacion-cuenta-service';
import ControladorCuentaService from '../../domain/services/controlador-cuenta-service';
import VariableService from '../../domain/services/variable-service';
import VariableCuentaService from '../../domain/services/variable-cuenta-service';
import VariableGlobalService from '../../domain/services/variable-global-service';
import ZonaEntregaService from '../../domain/services/zona-entrega-service';
import CondicionEspecialService from '../../domain/services/condicion-especial-service';
import RecargoDescuentoService from '../../domain/services/recargo-descuento-service';
import DebitoAutomaticoService from '../../domain/services/debito-automatico-service';

import InmuebleService from '../../domain/services/inmueble-service';
import VinculoInmuebleService from '../../domain/services/vinculo-inmueble-service';
import LadoTerrenoService from '../../domain/services/lado-terreno-service';
import LadoTerrenoServicioService from '../../domain/services/lado-terreno-servicio-service';
import LadoTerrenoObraService from '../../domain/services/lado-terreno-obra-service';
import ValuacionService from '../../domain/services/valuacion-service';
import ObraInmuebleService from '../../domain/services/obra-inmueble-service';
import ObraInmuebleDetalleService from '../../domain/services/obra-inmueble-detalle-service';
import SuperficieService from '../../domain/services/superficie-service';
import EdesurService from '../../domain/services/edesur-service';
import EdesurClienteService from '../../domain/services/edesur-cliente-service';
import CatastroService from '../../domain/services/catastro-service';

import ComercioService from '../../domain/services/comercio-service';
import VinculoComercioService from '../../domain/services/vinculo-comercio-service';
import InspeccionService from '../../domain/services/inspeccion-service';
import RubroComercioService from '../../domain/services/rubro-comercio-service';
import DeclaracionJuradaService from '../../domain/services/declaracion-jurada-service';

import VehiculoService from '../../domain/services/vehiculo-service';
import VinculoVehiculoService from '../../domain/services/vinculo-vehiculo-service';

import CementerioService from '../../domain/services/cementerio-service';
import VinculoCementerioService from '../../domain/services/vinculo-cementerio-service';
import InhumadoService from '../../domain/services/inhumado-service';
import VerificacionService from '../../domain/services/verificacion-service';

import FondeaderoService from '../../domain/services/fondeadero-service';
import VinculoFondeaderoService from '../../domain/services/vinculo-fondeadero-service';

import EspecialService from '../../domain/services/especial-service';
import VinculoEspecialService from '../../domain/services/vinculo-especial-service';

import EmisionCalculoService from '../../domain/services/emision-calculo-service';
import EmisionCalculoResultadoService from '../../domain/services/emision-calculo-resultado-service';
import EmisionCuotaService from '../../domain/services/emision-cuota-service';
import EmisionDefinicionService from '../../domain/services/emision-definicion-service';
import EmisionEjecucionService from '../../domain/services/emision-ejecucion-service';
import EmisionEjecucionCuentaService from '../../domain/services/emision-ejecucion-cuenta-service';
import EmisionEjecucionCuotaService from '../../domain/services/emision-ejecucion-cuota-service';
import EmisionProcedimientoParametroService from '../../domain/services/emision-procedimiento-parametro-service';
import EmisionVariableService from '../../domain/services/emision-variable-service';
import EmisionConceptoService from '../../domain/services/emision-concepto-service';
import EmisionConceptoResultadoService from '../../domain/services/emision-concepto-resultado-service';
import EmisionCuentaCorrienteService from '../../domain/services/emision-cuenta-corriente-service';
import EmisionCuentaCorrienteResultadoService from '../../domain/services/emision-cuenta-corriente-resultado-service';
import EmisionImputacionContableService from '../../domain/services/emision-imputacion-contable-service';
import EmisionImputacionContableResultadoService from '../../domain/services/emision-imputacion-contable-resultado-service';
import EmisionAprobacionService from '../../domain/services/emision-aprobacion-service';
import EmisionNumeracionService from '../../domain/services/emision-numeracion-service';
import FuncionService from '../../domain/services/funcion-service';
import FuncionParametroService from '../../domain/services/funcion-parametro-service';
import ProcedimientoService from '../../domain/services/procedimiento-service';
import ProcedimientoParametroService from '../../domain/services/procedimiento-parametro-service';
import ProcedimientoVariableService from '../../domain/services/procedimiento-variable-service';
import ProcedimientoFiltroService from '../../domain/services/procedimiento-filtro-service';

import CodeGenerator from '../../domain/services/process/emision/code-generator';
import EmisionExecute from '../../domain/services/process/emision/emision-execute';
import OrdenamientoExecute from '../../domain/services/process/ordenamiento/ordenamiento-execute';
import CodigoBarrasExecute from '../../domain/services/process/codigo-barras/codigo-barras-execute';
import CuentaCorrienteExecute from '../../domain/services/process/cuenta-corriente/cuenta-corriente-execute';

import TasaService from '../../domain/services/tasa-service';
import SubTasaService from '../../domain/services/sub-tasa-service';
import SubTasaImputacionService from '../../domain/services/sub-tasa-imputacion-service';
import TasaVencimientoService from '../../domain/services/tasa-vencimiento-service';

import CertificadoEscribanoService from '../../domain/services/certificado-escribano-service';

import ApremioService from '../../domain/services/apremio-service';
import JuicioCitacionService from '../../domain/services/juicio-citacion-service';
import ActoProcesalService from '../../domain/services/acto-procesal-service';
import CertificadoApremioService from '../../domain/services/certificado-apremio-service';
import CertificadoApremioItemService from '../../domain/services/certificado-apremio-item-service';
import CertificadoApremioPersonaService from '../../domain/services/certificado-apremio-persona-service';
import PlantillaDocumentoService from '../../domain/services/plantilla-documento-service';
import TipoActoProcesalService from '../../domain/services/tipo-acto-procesal-service';
import OrganoJudicialService from '../../domain/services/organo-judicial-service';
import TipoRelacionCertificadoApremioPersonaService from '../../domain/services/tipo-relacion-certificado-apremio-persona-service';

import TipoMovimientoService from '../../domain/services/tipo-movimiento-service';
import CuentaPagoService from '../../domain/services/cuenta-pago-service';
import CuentaPagoItemService from '../../domain/services/cuenta-pago-item-service';
import CuentaCorrienteItemService from '../../domain/services/cuenta-corriente-item-service';
import CuentaCorrienteCondicionEspecialService from '../../domain/services/cuenta-corriente-condicion-especial-service';
import ConvenioParametroService from '../../domain/services/convenio-parametro-service';  
import TipoPlanPagoService from '../../domain/services/tipo-plan-pago-service';
import TipoVencimientoPlanPagoService from '../../domain/services/tipo-vencimiento-plan-pago-service';
import PlanPagoDefinicionService from '../../domain/services/plan-pago-definicion-service';
import PlanPagoService from '../../domain/services/plan-pago-service';
import PlanPagoCuotaService from '../../domain/services/plan-pago-cuota-service';
import CuotaPorcentajeService from '../../domain/services/cuota-porcentaje-service';

import PlanPagoDefinicionAlcanceTasaService from '../../domain/services/plan-pago-definicion-alcance-tasa-service';
import PlanPagoDefinicionAlcanceRubroService from '../../domain/services/plan-pago-definicion-alcance-rubro-service';
import PlanPagoDefinicionAlcanceGrupoService from '../../domain/services/plan-pago-definicion-alcance-grupo-service';
import PlanPagoDefinicionAlcanceZonaTarifariaService from '../../domain/services/plan-pago-definicion-alcance-zona-tarifaria-service';
import PlanPagoDefinicionAlcanceCondicionFiscalService from '../../domain/services/plan-pago-definicion-alcance-condicion-fiscal-service';
import PlanPagoDefinicionAlcanceRubroAfipService from '../../domain/services/plan-pago-definicion-alcance-rubro-afip-service';
import PlanPagoDefinicionAlcanceFormaJuridicaService from '../../domain/services/plan-pago-definicion-alcance-forma-juridica-service';
import PlanPagoDefinicionQuitaCuotaService from '../../domain/services/plan-pago-definicion-quita-cuota-service';
import PlanPagoDefinicionInteresService from '../../domain/services/plan-pago-definicion-interes-service';
import PlanPagoDefinicionTipoVinculoCuentaService from '../../domain/services/plan-pago-definicion-tipo-vinculo-cuenta-service';

import PagoContadoService from '../../domain/services/pago-contado-service';
import PagoContadoDefinicionService from '../../domain/services/pago-contado-definicion-service';
import PagoContadoDefinicionAlcanceTasaService from '../../domain/services/pago-contado-definicion-alcance-tasa-service';
import PagoContadoDefinicionAlcanceRubroService from '../../domain/services/pago-contado-definicion-alcance-rubro-service';
import PagoContadoDefinicionAlcanceGrupoService from '../../domain/services/pago-contado-definicion-alcance-grupo-service';
import PagoContadoDefinicionAlcanceZonaTarifariaService from '../../domain/services/pago-contado-definicion-alcance-zona-tarifaria-service';
import PagoContadoDefinicionAlcanceCondicionFiscalService from '../../domain/services/pago-contado-definicion-alcance-condicion-fiscal-service';
import PagoContadoDefinicionAlcanceRubroAfipService from '../../domain/services/pago-contado-definicion-alcance-rubro-afip-service';
import PagoContadoDefinicionAlcanceFormaJuridicaService from '../../domain/services/pago-contado-definicion-alcance-forma-juridica-service';
import PagoContadoDefinicionTipoVinculoCuentaService from '../../domain/services/pago-contado-definicion-tipo-vinculo-cuenta-service';

import TipoControladorService from '../../domain/services/tipo-controlador-service';
import ControladorService from '../../domain/services/controlador-service';
import TipoVinculoCuentaService from '../../domain/services/tipo-vinculo-cuenta-service';
import VinculoCuentaService from '../../domain/services/vinculo-cuenta-service';

import DeclaracionJuradaComercioService from '../../domain/services/declaracion-jurada-comercio-service';
import DeclaracionJuradaRubroService from '../../domain/services/declaracion-jurada-rubro-service';
import ClaseElementoService from '../../domain/services/clase-elemento-service';
import TipoElementoService from '../../domain/services/tipo-elemento-service';
import ElementoService from '../../domain/services/elemento-service';
import FiltroService from '../../domain/services/filtro-service';
import ColeccionService from '../../domain/services/coleccion-service';
import ColeccionCampoService from '../../domain/services/coleccion-campo-service';

import ReciboEspecialService from '../../domain/services/recibo-especial-service';
import ReciboEspecialConceptoService from '../../domain/services/recibo-especial-concepto-service';

import ProcesoRepositorySequelize from '../data/repositories-sequelize/proceso-repository';
import ProcesoProgramacionRepositorySequelize from '../data/repositories-sequelize/proceso-programacion-repository';
import ConfiguracionRepositorySequelize from '../data/repositories-sequelize/configuracion-repository';
import NumeracionRepositorySequelize from '../data/repositories-sequelize/numeracion-repository';
import ListaRepositorySequelize from '../data/repositories-sequelize/lista-repository';
import EntidadRepositorySequelize from '../data/repositories-sequelize/entidad-repository';
import EntidadDefinicionRepositorySequelize from '../data/repositories-sequelize/entidad-definicion-repository';
import DireccionRepositorySequelize from '../data/repositories-sequelize/direccion-repository';
import ArchivoRepositorySequelize from '../data/repositories-sequelize/archivo-repository';
import ObservacionRepositorySequelize from '../data/repositories-sequelize/observacion-repository';
import EtiquetaRepositorySequelize from '../data/repositories-sequelize/etiqueta-repository';
import ContribuyenteRepositorySequelize from '../data/repositories-sequelize/contribuyente-repository';
import CuentaRepositorySequelize from '../data/repositories-sequelize/cuenta-repository';
import RelacionCuentaRepositorySequelize from '../data/repositories-sequelize/relacion-cuenta-repository';
import ControladorCuentaRepositorySequelize from '../data/repositories-sequelize/controlador-cuenta-repository';
import VariableRepositorySequelize from '../data/repositories-sequelize/variable-repository';
import VariableCuentaRepositorySequelize from '../data/repositories-sequelize/variable-cuenta-repository';
import VariableGlobalRepositorySequelize from '../data/repositories-sequelize/variable-global-repository';
import ZonaEntregaRepositorySequelize from '../data/repositories-sequelize/zona-entrega-repository';
import CondicionEspecialRepositorySequelize from '../data/repositories-sequelize/condicion-especial-repository';
import RecargoDescuentoRepositorySequelize from '../data/repositories-sequelize/recargo-descuento-repository';
import DebitoAutomaticoRepositorySequelize from '../data/repositories-sequelize/debito-automatico-repository';
import CuentaPruebaRepositorySequelize from '../data/repositories-sequelize/cuenta-prueba-repository';

import InmuebleRepositorySequelize from '../data/repositories-sequelize/inmueble-repository';
import VinculoInmuebleRepositorySequelize from '../data/repositories-sequelize/vinculo-inmueble-repository';
import LadoTerrenoRepositorySequelize from '../data/repositories-sequelize/lado-terreno-repository';
import LadoTerrenoServicioRepositorySequelize from '../data/repositories-sequelize/lado-terreno-servicio-repository';
import LadoTerrenoObraRepositorySequelize from '../data/repositories-sequelize/lado-terreno-obra-repository';
import ValuacionRepositorySequelize from '../data/repositories-sequelize/valuacion-repository';
import ObraInmuebleRepositorySequelize from '../data/repositories-sequelize/obra-inmueble-repository';
import ObraInmuebleDetalleRepositorySequelize from '../data/repositories-sequelize/obra-inmueble-detalle-repository';
import SuperficieRepositorySequelize from '../data/repositories-sequelize/superficie-repository';
import EdesurRepositorySequelize from '../data/repositories-sequelize/edesur-repository';
import EdesurClienteRepositorySequelize from '../data/repositories-sequelize/edesur-cliente-repository';
import CatastroRepositorySequelize from '../data/repositories-sequelize/catastro-repository';

import ComercioRepositorySequelize from '../data/repositories-sequelize/comercio-repository';
import VinculoComercioRepositorySequelize from '../data/repositories-sequelize/vinculo-comercio-repository';
import InspeccionRepositorySequelize from '../data/repositories-sequelize/inspeccion-repository';
import RubroComercioRepositorySequelize from '../data/repositories-sequelize/rubro-comercio-repository';
import DeclaracionJuradaRepositorySequelize from '../data/repositories-sequelize/declaracion-jurada-repository';

import VehiculoRepositorySequelize from '../data/repositories-sequelize/vehiculo-repository';
import VinculoVehiculoRepositorySequelize from '../data/repositories-sequelize/vinculo-vehiculo-repository';

import CementerioRepositorySequelize from '../data/repositories-sequelize/cementerio-repository';
import VinculoCementerioRepositorySequelize from '../data/repositories-sequelize/vinculo-cementerio-repository';
import InhumadoRepositorySequelize from '../data/repositories-sequelize/inhumado-repository';
import VerificacionRepositorySequelize from '../data/repositories-sequelize/verificacion-repository';

import FondeaderoRepositorySequelize from '../data/repositories-sequelize/fondeadero-repository';
import VinculoFondeaderoRepositorySequelize from '../data/repositories-sequelize/vinculo-fondeadero-repository';

import EspecialRepositorySequelize from '../data/repositories-sequelize/especial-repository';
import VinculoEspecialRepositorySequelize from '../data/repositories-sequelize/vinculo-especial-repository';

import EmisionCalculoRepositorySequelize from '../data/repositories-sequelize/emision-calculo-repository';
import EmisionCalculoResultadoRepositorySequelize from '../data/repositories-sequelize/emision-calculo-resultado-repository';
import EmisionCuotaRepositorySequelize from '../data/repositories-sequelize/emision-cuota-repository';
import EmisionDefinicionRepositorySequelize from '../data/repositories-sequelize/emision-definicion-repository';
import EmisionEjecucionRepositorySequelize from '../data/repositories-sequelize/emision-ejecucion-repository';
import EmisionEjecucionCuentaRepositorySequelize from '../data/repositories-sequelize/emision-ejecucion-cuenta-repository';
import EmisionEjecucionCuotaRepositorySequelize from '../data/repositories-sequelize/emision-ejecucion-cuota-repository';
import EmisionProcedimientoParametroRepositorySequelize from '../data/repositories-sequelize/emision-procedimiento-parametro-repository';
import EmisionVariableRepositorySequelize from '../data/repositories-sequelize/emision-variable-repository';
import EmisionConceptoRepositorySequelize from '../data/repositories-sequelize/emision-concepto-repository';
import EmisionConceptoResultadoRepositorySequelize from '../data/repositories-sequelize/emision-concepto-resultado-repository';
import EmisionCuentaCorrienteRepositorySequelize from '../data/repositories-sequelize/emision-cuenta-corriente-repository';
import EmisionCuentaCorrienteResultadoRepositorySequelize from '../data/repositories-sequelize/emision-cuenta-corriente-resultado-repository';
import EmisionImputacionContableRepositorySequelize from '../data/repositories-sequelize/emision-imputacion-contable-repository';
import EmisionImputacionContableResultadoRepositorySequelize from '../data/repositories-sequelize/emision-imputacion-contable-resultado-repository';
import EmisionAprobacionRepositorySequelize from '../data/repositories-sequelize/emision-aprobacion-repository';
import EmisionNumeracionRepositorySequelize from '../data/repositories-sequelize/emision-numeracion-repository';
import FuncionRepositorySequelize from '../data/repositories-sequelize/funcion-repository';
import FuncionParametroRepositorySequelize from '../data/repositories-sequelize/funcion-parametro-repository';
import ProcedimientoRepositorySequelize from '../data/repositories-sequelize/procedimiento-repository';
import ProcedimientoParametroRepositorySequelize from '../data/repositories-sequelize/procedimiento-parametro-repository';
import ProcedimientoVariableRepositorySequelize from '../data/repositories-sequelize/procedimiento-variable-repository';
import ProcedimientoFiltroRepositorySequelize from '../data/repositories-sequelize/procedimiento-filtro-repository';

import TasaRepositorySequelize from '../data/repositories-sequelize/tasa-repository';
import SubTasaRepositorySequelize from '../data/repositories-sequelize/sub-tasa-repository';
import SubTasaImputacionRepositorySequelize from '../data/repositories-sequelize/sub-tasa-imputacion-repository';
import TasaVencimientoRepositorySequelize from '../data/repositories-sequelize/tasa-vencimiento-repository';

import CertificadoEscribanoRepositorySequelize from '../data/repositories-sequelize/certificado-escribano-repository';

import ApremioRepositorySequelize from '../data/repositories-sequelize/apremio-repository';
import JuicioCitacionRepositorySequelize from '../data/repositories-sequelize/juicio-citacion-repository';
import ActoProcesalRepositorySequelize from '../data/repositories-sequelize/acto-procesal-repository';
import CertificadoApremioRepositorySequelize from '../data/repositories-sequelize/certificado-apremio-repository';
import CertificadoApremioItemRepositorySequelize from '../data/repositories-sequelize/certificado-apremio-item-repository';
import CertificadoApremioPersonaRepositorySequelize from '../data/repositories-sequelize/certificado-apremio-persona-repository';
import PlantillaDocumentoRepositorySequelize from '../data/repositories-sequelize/plantilla-documento-repository';
import TipoActoProcesalRepositorySequelize from '../data/repositories-sequelize/tipo-acto-procesal-repository';
import OrganoJudicialRepositorySequelize from '../data/repositories-sequelize/organo-judicial-repository';
import TipoRelacionCertificadoApremioPersonaRepositorySequelize from '../data/repositories-sequelize/tipo-relacion-certificado-apremio-persona-repository';

import TipoMovimientoRepositorySequelize from '../data/repositories-sequelize/tipo-movimiento-repository';
import CuentaPagoRepositorySequelize from '../data/repositories-sequelize/cuenta-pago-repository';
import CuentaPagoItemRepositorySequelize from '../data/repositories-sequelize/cuenta-pago-item-repository';
import CuentaCorrienteItemRepositorySequelize from '../data/repositories-sequelize/cuenta-corriente-item-repository';
import CuentaCorrienteCondicionEspecialRepositorySequelize from '../data/repositories-sequelize/cuenta-corriente-condicion-especial-repository';
import ConvenioParametroRepositorySequelize from '../data/repositories-sequelize/convenio-parametro-repository';
import TipoPlanPagoRepositorySequelize from '../data/repositories-sequelize/tipo-plan-pago-repository';
import TipoVencimientoPlanPagoRepositorySequelize from '../data/repositories-sequelize/tipo-vencimiento-plan-pago-repository';
import PlanPagoDefinicionRepositorySequelize from '../data/repositories-sequelize/plan-pago-definicion-repository';
import PlanPagoRepositorySequelize from '../data/repositories-sequelize/plan-pago-repository';
import PlanPagoCuotaRepositorySequelize from '../data/repositories-sequelize/plan-pago-cuota-repository';
import CuotaPorcentajeRepositorySequelize from '../data/repositories-sequelize/cuota-porcentaje-repository';

import PlanPagoDefinicionAlcanceTasaRepositorySequelize from '../data/repositories-sequelize/plan-pago-definicion-alcance-tasa-repository';
import PlanPagoDefinicionAlcanceRubroRepositorySequelize from '../data/repositories-sequelize/plan-pago-definicion-alcance-rubro-repository';
import PlanPagoDefinicionAlcanceGrupoRepositorySequelize from '../data/repositories-sequelize/plan-pago-definicion-alcance-grupo-repository';
import PlanPagoDefinicionAlcanceZonaTarifariaRepositorySequelize from '../data/repositories-sequelize/plan-pago-definicion-alcance-zona-tarifaria-repository';
import PlanPagoDefinicionAlcanceCondicionFiscalRepositorySequelize from '../data/repositories-sequelize/plan-pago-definicion-alcance-condicion-fiscal-repository';
import PlanPagoDefinicionAlcanceRubroAfipRepositorySequelize from '../data/repositories-sequelize/plan-pago-definicion-alcance-rubro-afip-repository';
import PlanPagoDefinicionAlcanceFormaJuridicaRepositorySequelize from '../data/repositories-sequelize/plan-pago-definicion-alcance-forma-juridica-repository';
import PlanPagoDefinicionQuitaCuotaRepositorySequelize from '../data/repositories-sequelize/plan-pago-definicion-quita-cuota-repository';
import PlanPagoDefinicionInteresRepositorySequelize from '../data/repositories-sequelize/plan-pago-definicion-interes-repository';
import PlanPagoDefinicionTipoVinculoCuentaRepositorySequelize from '../data/repositories-sequelize/plan-pago-definicion-tipo-vinculo-cuenta-repository';

import TipoControladorRepositorySequelize from '../data/repositories-sequelize/tipo-controlador-repository';
import ControladorRepositorySequelize from '../data/repositories-sequelize/controlador-repository';
import PersonaRepositorySequelize from '../data/repositories-sequelize/persona-repository';

import PagoContadoDefinicionRepositorySequelize from '../data/repositories-sequelize/pago-contado-definicion-repository';
import PagoContadoDefinicionAlcanceTasaRepositorySequelize from '../data/repositories-sequelize/pago-contado-definicion-alcance-tasa-repository';
import PagoContadoDefinicionAlcanceRubroRepositorySequelize from '../data/repositories-sequelize/pago-contado-definicion-alcance-rubro-repository';
import PagoContadoDefinicionAlcanceGrupoRepositorySequelize from '../data/repositories-sequelize/pago-contado-definicion-alcance-grupo-repository';
import PagoContadoDefinicionAlcanceZonaTarifariaRepositorySequelize from '../data/repositories-sequelize/pago-contado-definicion-alcance-zona-tarifaria-repository';
import PagoContadoDefinicionAlcanceCondicionFiscalRepositorySequelize from '../data/repositories-sequelize/pago-contado-definicion-alcance-condicion-fiscal-repository';
import PagoContadoDefinicionAlcanceRubroAfipRepositorySequelize from '../data/repositories-sequelize/pago-contado-definicion-alcance-rubro-afip-repository';
import PagoContadoDefinicionAlcanceFormaJuridicaRepositorySequelize from '../data/repositories-sequelize/pago-contado-definicion-alcance-forma-juridica-repository';
import PagoContadoDefinicionTipoVinculoCuentaRepositorySequelize from '../data/repositories-sequelize/pago-contado-definicion-tipo-vinculo-cuenta-repository';

import DeclaracionJuradaComercioRepositorySequelize from '../data/repositories-sequelize/declaracion-jurada-comercio-repository';
import DeclaracionJuradaRubroRepositorySequelize from '../data/repositories-sequelize/declaracion-jurada-rubro-repository';
import ClaseElementoRepositorySequelize from '../data/repositories-sequelize/clase-elemento-repository';
import TipoElementoRepositorySequelize from '../data/repositories-sequelize/tipo-elemento-repository';
import ElementoRepositorySequelize from '../data/repositories-sequelize/elemento-repository';
import FiltroRepositorySequelize from '../data/repositories-sequelize/filtro-repository';
import ColeccionRepositorySequelize from '../data/repositories-sequelize/coleccion-repository';
import ColeccionCampoRepositorySequelize from '../data/repositories-sequelize/coleccion-campo-repository';

import ReciboEspecialRepositorySequelize from '../data/repositories-sequelize/recibo-especial-repository';
import ReciboEspecialConceptoRepositorySequelize from '../data/repositories-sequelize/recibo-especial-concepto-repository';

import ObraController from '../../server/controllers/obra-controller';
import TipoSuperficieController from '../../server/controllers/tipo-superficie-controller';
import GrupoSuperficieController from '../../server/controllers/grupo-superficie-controller';
import TipoCondicionEspecialController from '../../server/controllers/tipo-condicion-especial-controller';
import TipoInstrumentoController from '../../server/controllers/tipo-instrumento-controller';
import RubroController from '../../server/controllers/rubro-controller';
import TipoRecargoDescuentoController from '../../server/controllers/tipo-recargo-descuento-controller';
import IncisoVehiculoController from '../../server/controllers/inciso-vehiculo-controller';
import TipoVehiculoController from '../../server/controllers/tipo-vehiculo-controller';
import CategoriaVehiculoController from '../../server/controllers/categoria-vehiculo-controller';
import RubroLiquidacionController from '../../server/controllers/rubro-liquidacion-controller';
import ZonaTarifariaController from '../../server/controllers/zona-tarifaria-controller';
import GrupoController from '../../server/controllers/grupo-controller';
import TipoConstruccionFunerariaController from '../../server/controllers/tipo-construccion-funeraria-controller';
import TipoRubroComercioController from '../../server/controllers/tipo-rubro-comercio-controller';
import RubroProvinciaController from '../../server/controllers/rubro-provincia-controller';
import RubroBCRAController from '../../server/controllers/rubro-bcra-controller';
import MotivoBajaRubroComercioController from '../../server/controllers/motivo-baja-rubro-comercio-controller';
import UbicacionComercioController from '../../server/controllers/ubicacion-comercio-controller';
import CocheriaController from '../../server/controllers/cocheria-controller';
import RegistroCivilController from '../../server/controllers/registro-civil-controller';
import CategoriaTasaController from '../../server/controllers/categoria-tasa-controller';
import TipoAnuncioController from '../../server/controllers/tipo-anuncio-controller';
import CategoriaUbicacionController from '../../server/controllers/categoria-ubicacion-controller';
import MotivoBajaComercioController from '../../server/controllers/motivo-baja-comercio-controller';
import ObjetoCertificadoController from '../../server/controllers/objeto-certificado-controller';
import EscribanoController from '../../server/controllers/escribano-controller';
import TipoDDJJController from '../../server/controllers/tipo-ddjj-controller';
import PaisController from '../../server/controllers/pais-controller';
import ProvinciaController from '../../server/controllers/provincia-controller';
import LocalidadController from '../../server/controllers/localidad-controller';
import CuentaPruebaController from '../../server/controllers/cuenta-prueba-controller';

import ObraService from '../../domain/services/obra-service';
import TipoSuperficieService from '../../domain/services/tipo-superficie-service';
import GrupoSuperficieService from '../../domain/services/grupo-superficie-service';
import TipoCondicionEspecialService from '../../domain/services/tipo-condicion-especial-service';
import TipoInstrumentoService from '../../domain/services/tipo-instrumento-service';
import RubroService from '../../domain/services/rubro-service';
import TipoRecargoDescuentoService from '../../domain/services/tipo-recargo-descuento-service';
import IncisoVehiculoService from '../../domain/services/inciso-vehiculo-service';
import TipoVehiculoService from '../../domain/services/tipo-vehiculo-service';
import CategoriaVehiculoService from '../../domain/services/categoria-vehiculo-service';
import RubroLiquidacionService from '../../domain/services/rubro-liquidacion-service';
import ZonaTarifariaService from '../../domain/services/zona-tarifaria-service';
import GrupoService from '../../domain/services/grupo-service';
import TipoConstruccionFunerariaService from '../../domain/services/tipo-construccion-funeraria-service';
import TipoRubroComercioService from '../../domain/services/tipo-rubro-comercio-service';
import RubroProvinciaService from '../../domain/services/rubro-provincia-service';
import RubroBCRAService from '../../domain/services/rubro-bcra-service';
import MotivoBajaRubroComercioService from '../../domain/services/motivo-baja-rubro-comercio-service';
import UbicacionComercioService from '../../domain/services/ubicacion-comercio-service';
import CocheriaService from '../../domain/services/cocheria-service';
import RegistroCivilService from '../../domain/services/registro-civil-service';
import CategoriaTasaService from '../../domain/services/categoria-tasa-service';
import TipoAnuncioService from '../../domain/services/tipo-anuncio-service';
import CategoriaUbicacionService from '../../domain/services/categoria-ubicacion-service';
import MotivoBajaComercioService from '../../domain/services/motivo-baja-comercio-service';
import ObjetoCertificadoService from '../../domain/services/objeto-certificado-service';
import EscribanoService from '../../domain/services/escribano-service';
import TipoDDJJService from '../../domain/services/tipo-ddjj-service';
import PaisService from '../../domain/services/pais-service';
import ProvinciaService from '../../domain/services/provincia-service';
import LocalidadService from '../../domain/services/localidad-service';
import CuentaPruebaService from '../../domain/services/cuenta-prueba-service';

import ObraRepositorySequelize from '../data/repositories-sequelize/obra-repository';
import TipoSuperficieRepositorySequelize from '../data/repositories-sequelize/tipo-superficie-repository';
import GrupoSuperficieRepositorySequelize from '../data/repositories-sequelize/grupo-superficie-repository';
import TipoCondicionEspecialRepositorySequelize from '../data/repositories-sequelize/tipo-condicion-especial-repository';
import TipoInstrumentoRepositorySequelize from '../data/repositories-sequelize/tipo-instrumento-repository';
import RubroRepositorySequelize from '../data/repositories-sequelize/rubro-repository';
import TipoRecargoDescuentoRepositorySequelize from '../data/repositories-sequelize/tipo-recargo-descuento-repository';
import IncisoVehiculoRepositorySequelize from '../data/repositories-sequelize/inciso-vehiculo-repository';
import TipoVehiculoRepositorySequelize from '../data/repositories-sequelize/tipo-vehiculo-repository';
import CategoriaVehiculoRepositorySequelize from '../data/repositories-sequelize/categoria-vehiculo-repository';
import RubroLiquidacionRepositorySequelize from '../data/repositories-sequelize/rubro-liquidacion-repository';
import ZonaTarifariaRepositorySequelize from '../data/repositories-sequelize/zona-tarifaria-repository';
import GrupoRepositorySequelize from '../data/repositories-sequelize/grupo-repository';
import TipoConstruccionFunerariaRepositorySequelize from '../data/repositories-sequelize/tipo-construccion-funeraria-repository';
import TipoRubroComercioRepositorySequelize from '../data/repositories-sequelize/tipo-rubro-comercio-repository';
import RubroProvinciaRepositorySequelize from '../data/repositories-sequelize/rubro-provincia-repository';
import RubroBCRARepositorySequelize from '../data/repositories-sequelize/rubro-bcra-repository';
import MotivoBajaRubroComercioRepositorySequelize from '../data/repositories-sequelize/motivo-baja-rubro-comercio-repository';
import UbicacionComercioRepositorySequelize from '../data/repositories-sequelize/ubicacion-comercio-repository';
import CocheriaRepositorySequelize from '../data/repositories-sequelize/cocheria-repository';
import RegistroCivilRepositorySequelize from '../data/repositories-sequelize/registro-civil-repository';
import CategoriaTasaRepositorySequelize from '../data/repositories-sequelize/categoria-tasa-repository';
import TipoAnuncioRepositorySequelize from '../data/repositories-sequelize/tipo-anuncio-repository';
import CategoriaUbicacionRepositorySequelize from '../data/repositories-sequelize/categoria-ubicacion-repository';
import MotivoBajaComercioRepositorySequelize from '../data/repositories-sequelize/motivo-baja-comercio-repository';
import ObjetoCertificadoRepositorySequelize from '../data/repositories-sequelize/objeto-certificado-repository';
import EscribanoRepositorySequelize from '../data/repositories-sequelize/escribano-repository';
import TipoDDJJRepositorySequelize from '../data/repositories-sequelize/tipo-ddjj-repository';
import PaisRepositorySequelize from '../data/repositories-sequelize/pais-repository';
import ProvinciaRepositorySequelize from '../data/repositories-sequelize/provincia-repository';
import LocalidadRepositorySequelize from '../data/repositories-sequelize/localidad-repository';

const container = createContainer({
  injectionMode: InjectionMode.CLASSIC
})

container.register({

  messageRouter: asClass(MessageRouterRabbitMQ),
  publishService: asClass(PublishService),
  subscribeService: asClass(SubscribeService),
  queueMessageExecute: asClass(QueueMessageExecute),

  reporteController: asClass(ReporteController),
  pagoController: asClass(PagoController),
  procesoController: asClass(ProcesoController),
  configuracionController: asClass(ConfiguracionController),
  listaController: asClass(ListaController),
  entidadController: asClass(EntidadController),
  direccionController: asClass(DireccionController),
  informacionAdicionalController: asClass(InformacionAdicionalController),
  archivoController: asClass(ArchivoController),
  observacionController: asClass(ObservacionController),
  etiquetaController: asClass(EtiquetaController),
  contribuyenteController: asClass(ContribuyenteController),
  cuentaController: asClass(CuentaController),
  variableController: asClass(VariableController),
  variableGlobalController: asClass(VariableGlobalController),
  cuentaPruebaController: asClass(CuentaPruebaController),

  inmuebleController: asClass(InmuebleController),
  vinculoInmuebleController: asClass(VinculoInmuebleController),
  catastroController: asClass(CatastroController),
  
  comercioController: asClass(ComercioController),
  vinculoComercioController: asClass(VinculoComercioController),

  vehiculoController: asClass(VehiculoController),
  vinculoVehiculoController: asClass(VinculoVehiculoController),
  
  cementerioController: asClass(CementerioController),
  vinculoCementerioController: asClass(VinculoCementerioController),

  fondeaderoController: asClass(FondeaderoController),
  vinculoFondeaderoController: asClass(VinculoFondeaderoController),

  especialController: asClass(EspecialController),
  vinculoEspecialController: asClass(VinculoEspecialController),

  emisionDefinicionController: asClass(EmisionDefinicionController),
  emisionEjecucionController: asClass(EmisionEjecucionController),
  emisionEjecucionCuentaController: asClass(EmisionEjecucionCuentaController),
  emisionAprobacionController: asClass(EmisionAprobacionController),
  emisionNumeracionController: asClass(EmisionNumeracionController),
  procedimientoController: asClass(ProcedimientoController),

  tasaController: asClass(TasaController),
  subTasaController: asClass(SubTasaController),
  tasaVencimientoController: asClass(TasaVencimientoController),

  certificadoEscribanoController: asClass(CertificadoEscribanoController),

  apremioController: asClass(ApremioController),
  certificadoApremioController: asClass(CertificadoApremioController),
  certificadoApremioItemController: asClass(CertificadoApremioItemController),
  plantillaDocumentoController: asClass(PlantillaDocumentoController),
  tipoActoProcesalController: asClass(TipoActoProcesalController),
  organoJudicialController: asClass(OrganoJudicialController),
  tipoRelacionCertificadoApremioPersonaController: asClass(TipoRelacionCertificadoApremioPersonaController),

  tipoMovimientoController: asClass(TipoMovimientoController),
  cuentaPagoController: asClass(CuentaPagoController),
  cuentaPagoItemController: asClass(CuentaPagoItemController),
  cuentaCorrienteItemController: asClass(CuentaCorrienteItemController),
  cuentaCorrienteCondicionEspecialController: asClass(CuentaCorrienteCondicionEspecialController),
  convenioParametroController: asClass(ConvenioParametroController),
  tipoPlanPagoController: asClass(TipoPlanPagoController),
  tipoVencimientoPlanPagoController: asClass(TipoVencimientoPlanPagoController),
  planPagoDefinicionController: asClass(PlanPagoDefinicionController),
  planPagoController: asClass(PlanPagoController),
  planPagoCuotaController: asClass(PlanPagoCuotaController),
  pagoContadoDefinicionController: asClass(PagoContadoDefinicionController),
  pagoContadoController: asClass(PagoContadoController),
  cuotaPorcentajeController: asClass(CuotaPorcentajeController),

  tipoControladorController: asClass(TipoControladorController),
  controladorController: asClass(ControladorController),
  tipoVinculoCuentaController: asClass(TipoVinculoCuentaController),
  vinculoCuentaController: asClass(VinculoCuentaController),

  declaracionJuradaComercioController: asClass(DeclaracionJuradaComercioController),
  claseElementoController: asClass(ClaseElementoController),
  tipoElementoController: asClass(TipoElementoController),
  filtroController: asClass(FiltroController),
  coleccionController: asClass(ColeccionController),
  
  reciboEspecialController: asClass(ReciboEspecialController),

  reporteService: asClass(ReporteService),
  reportCementerioSolicitudReduccion: asClass(ReportCementerioSolicitudReduccion),
  reportCementerioSolicitudVerificacion: asClass(ReportCementerioSolicitudVerificacion),
  reportEmisionAprobacionCalculo: asClass(ReportEmisionAprobacionCalculo),
  reportEmisionAprobacionOrdenamiento: asClass(ReportEmisionAprobacionOrdenamiento),
  reportEmisionAprobacionControlRecibos: asClass(ReportEmisionAprobacionControlRecibos),
  reportCuentaCorrienteRecibo: asClass(ReportCuentaCorrienteRecibo),
  reportPlanPagoRecibo: asClass(ReportPlanPagoRecibo),
  reportPlanPagoConvenio: asClass(ReportPlanPagoConvenio),
  reportApremioCaratula: asClass(ReportApremioCaratula),
  reportVehiculoBaja: asClass(ReportVehiculoBaja),
  reportVehiculoLibreDeuda: asClass(ReportVehiculoLibreDeuda),
  reportCertificadoApremioJuicio: asClass(ReportCertificadoApremioJuicio),
  reportEmisionRecibos: asClass(ReportEmisionRecibos),

  perfilService: asClass(PerfilService),
  pagoService: asClass(PagoService),
  procesoService: asClass(ProcesoService),
  procesoProgramacionService: asClass(ProcesoProgramacionService),
  configuracionService: asClass(ConfiguracionService),
  numeracionService: asClass(NumeracionService),
  listaService: asClass(ListaService),
  entidadService: asClass(EntidadService),
  direccionService: asClass(DireccionService),
  informacionAdicionalService: asClass(InformacionAdicionalService),
  archivoService: asClass(ArchivoService),
  observacionService: asClass(ObservacionService),
  etiquetaService: asClass(EtiquetaService),
  contribuyenteService: asClass(ContribuyenteService),
  cuentaService: asClass(CuentaService),
  relacionCuentaService: asClass(RelacionCuentaService),
  controladorCuentaService: asClass(ControladorCuentaService),
  variableService: asClass(VariableService),
  variableGlobalService: asClass(VariableGlobalService),
  variableCuentaService: asClass(VariableCuentaService),
  zonaEntregaService: asClass(ZonaEntregaService),
  condicionEspecialService: asClass(CondicionEspecialService),
  recargoDescuentoService: asClass(RecargoDescuentoService),
  debitoAutomaticoService: asClass(DebitoAutomaticoService),

  inmuebleService: asClass(InmuebleService),
  vinculoInmuebleService: asClass(VinculoInmuebleService),
  ladoTerrenoService: asClass(LadoTerrenoService),
  ladoTerrenoServicioService: asClass(LadoTerrenoServicioService),
  ladoTerrenoObraService: asClass(LadoTerrenoObraService),
  valuacionService: asClass(ValuacionService),
  obraInmuebleService: asClass(ObraInmuebleService),
  obraInmuebleDetalleService: asClass(ObraInmuebleDetalleService),
  superficieService: asClass(SuperficieService),
  edesurService: asClass(EdesurService),
  edesurClienteService: asClass(EdesurClienteService),
  catastroService: asClass(CatastroService),

  comercioService: asClass(ComercioService),
  vinculoComercioService: asClass(VinculoComercioService),
  inspeccionService: asClass(InspeccionService),
  rubroComercioService: asClass(RubroComercioService),
  declaracionJuradaService: asClass(DeclaracionJuradaService),
  
  vehiculoService: asClass(VehiculoService),
  vinculoVehiculoService: asClass(VinculoVehiculoService),

  cementerioService: asClass(CementerioService),
  vinculoCementerioService: asClass(VinculoCementerioService),
  inhumadoService: asClass(InhumadoService),
  verificacionService: asClass(VerificacionService),

  fondeaderoService: asClass(FondeaderoService),
  vinculoFondeaderoService: asClass(VinculoFondeaderoService),

  especialService: asClass(EspecialService),
  vinculoEspecialService: asClass(VinculoEspecialService),

  emisionCalculoService: asClass(EmisionCalculoService),
  emisionCalculoResultadoService: asClass(EmisionCalculoResultadoService),
  emisionCuotaService: asClass(EmisionCuotaService),
  emisionDefinicionService: asClass(EmisionDefinicionService),
  emisionEjecucionService: asClass(EmisionEjecucionService),
  emisionEjecucionCuentaService: asClass(EmisionEjecucionCuentaService),
  emisionEjecucionCuotaService: asClass(EmisionEjecucionCuotaService),
  emisionProcedimientoParametroService: asClass(EmisionProcedimientoParametroService),
  emisionVariableService: asClass(EmisionVariableService),
  emisionConceptoService: asClass(EmisionConceptoService),
  emisionConceptoResultadoService: asClass(EmisionConceptoResultadoService),
  emisionCuentaCorrienteResultadoService: asClass(EmisionCuentaCorrienteResultadoService),
  emisionCuentaCorrienteService: asClass(EmisionCuentaCorrienteService),
  emisionImputacionContableService: asClass(EmisionImputacionContableService),
  emisionImputacionContableResultadoService: asClass(EmisionImputacionContableResultadoService),
  emisionAprobacionService: asClass(EmisionAprobacionService),
  emisionNumeracionService: asClass(EmisionNumeracionService),
  funcionService: asClass(FuncionService),
  funcionParametroService: asClass(FuncionParametroService),
  procedimientoService: asClass(ProcedimientoService),
  procedimientoParametroService: asClass(ProcedimientoParametroService),
  procedimientoVariableService: asClass(ProcedimientoVariableService),
  procedimientoFiltroService: asClass(ProcedimientoFiltroService),

  codeGenerator: asClass(CodeGenerator),
  emisionExecute: asClass(EmisionExecute),
  ordenamientoExecute: asClass(OrdenamientoExecute),
  codigoBarrasExecute: asClass(CodigoBarrasExecute),
  cuentaCorrienteExecute: asClass(CuentaCorrienteExecute),

  tasaService: asClass(TasaService),
  subTasaService: asClass(SubTasaService),
  subTasaImputacionService: asClass(SubTasaImputacionService),
  tasaVencimientoService: asClass(TasaVencimientoService),

  certificadoEscribanoService: asClass(CertificadoEscribanoService),

  apremioService: asClass(ApremioService),
  juicioCitacionService: asClass(JuicioCitacionService),
  actoProcesalService: asClass(ActoProcesalService),
  certificadoApremioService: asClass(CertificadoApremioService),
  certificadoApremioItemService: asClass(CertificadoApremioItemService),
  certificadoApremioPersonaService: asClass(CertificadoApremioPersonaService),
  plantillaDocumentoService: asClass(PlantillaDocumentoService),
  tipoActoProcesalService: asClass(TipoActoProcesalService),
  organoJudicialService: asClass(OrganoJudicialService),
  tipoRelacionCertificadoApremioPersonaService: asClass(TipoRelacionCertificadoApremioPersonaService),

  tipoMovimientoService: asClass(TipoMovimientoService),
  cuentaPagoService: asClass(CuentaPagoService),
  cuentaPagoItemService: asClass(CuentaPagoItemService),
  cuentaCorrienteItemService: asClass(CuentaCorrienteItemService),
  cuentaCorrienteCondicionEspecialService: asClass(CuentaCorrienteCondicionEspecialService),
  convenioParametroService: asClass(ConvenioParametroService),
  tipoPlanPagoService: asClass(TipoPlanPagoService),
  tipoVencimientoPlanPagoService: asClass(TipoVencimientoPlanPagoService),
  planPagoDefinicionService: asClass(PlanPagoDefinicionService),
  planPagoService: asClass(PlanPagoService),
  planPagoCuotaService: asClass(PlanPagoCuotaService),
  cuotaPorcentajeService: asClass(CuotaPorcentajeService),

  planPagoDefinicionAlcanceTasaService: asClass(PlanPagoDefinicionAlcanceTasaService),
  planPagoDefinicionAlcanceRubroService: asClass(PlanPagoDefinicionAlcanceRubroService),
  planPagoDefinicionAlcanceGrupoService: asClass(PlanPagoDefinicionAlcanceGrupoService),
  planPagoDefinicionAlcanceZonaTarifariaService: asClass(PlanPagoDefinicionAlcanceZonaTarifariaService),
  planPagoDefinicionAlcanceCondicionFiscalService: asClass(PlanPagoDefinicionAlcanceCondicionFiscalService),
  planPagoDefinicionAlcanceRubroAfipService: asClass(PlanPagoDefinicionAlcanceRubroAfipService),
  planPagoDefinicionAlcanceFormaJuridicaService: asClass(PlanPagoDefinicionAlcanceFormaJuridicaService),
  planPagoDefinicionQuitaCuotaService: asClass(PlanPagoDefinicionQuitaCuotaService),
  planPagoDefinicionInteresService: asClass(PlanPagoDefinicionInteresService),
  planPagoDefinicionTipoVinculoCuentaService: asClass(PlanPagoDefinicionTipoVinculoCuentaService),

  pagoContadoService: asClass(PagoContadoService),
  pagoContadoDefinicionService: asClass(PagoContadoDefinicionService),
  pagoContadoDefinicionAlcanceTasaService: asClass(PagoContadoDefinicionAlcanceTasaService),
  pagoContadoDefinicionAlcanceRubroService: asClass(PagoContadoDefinicionAlcanceRubroService),
  pagoContadoDefinicionAlcanceGrupoService: asClass(PagoContadoDefinicionAlcanceGrupoService),
  pagoContadoDefinicionAlcanceZonaTarifariaService: asClass(PagoContadoDefinicionAlcanceZonaTarifariaService),
  pagoContadoDefinicionAlcanceCondicionFiscalService: asClass(PagoContadoDefinicionAlcanceCondicionFiscalService),
  pagoContadoDefinicionAlcanceRubroAfipService: asClass(PagoContadoDefinicionAlcanceRubroAfipService),
  pagoContadoDefinicionAlcanceFormaJuridicaService: asClass(PagoContadoDefinicionAlcanceFormaJuridicaService),
  pagoContadoDefinicionTipoVinculoCuentaService: asClass(PagoContadoDefinicionTipoVinculoCuentaService),
  tipoControladorService: asClass(TipoControladorService),
  controladorService: asClass(ControladorService),
  tipoVinculoCuentaService: asClass(TipoVinculoCuentaService),
  vinculoCuentaService: asClass(VinculoCuentaService),

  declaracionJuradaComercioService: asClass(DeclaracionJuradaComercioService),
  declaracionJuradaRubroService: asClass(DeclaracionJuradaRubroService),
  claseElementoService: asClass(ClaseElementoService),
  tipoElementoService: asClass(TipoElementoService),
  elementoService: asClass(ElementoService),
  filtroService: asClass(FiltroService),
  coleccionService: asClass(ColeccionService),
  coleccionCampoService: asClass(ColeccionCampoService),

  reciboEspecialService: asClass(ReciboEspecialService),
  reciboEspecialConceptoService: asClass(ReciboEspecialConceptoService),

  procesoRepository: asClass(ProcesoRepositorySequelize),
  procesoProgramacionRepository: asClass(ProcesoProgramacionRepositorySequelize),
  configuracionRepository: asClass(ConfiguracionRepositorySequelize),
  numeracionRepository: asClass(NumeracionRepositorySequelize),
  listaRepository: asClass(ListaRepositorySequelize),
  entidadRepository: asClass(EntidadRepositorySequelize),
  entidadDefinicionRepository: asClass(EntidadDefinicionRepositorySequelize),
  direccionRepository: asClass(DireccionRepositorySequelize),
  archivoRepository: asClass(ArchivoRepositorySequelize),
  observacionRepository: asClass(ObservacionRepositorySequelize),
  etiquetaRepository: asClass(EtiquetaRepositorySequelize),
  contribuyenteRepository: asClass(ContribuyenteRepositorySequelize),
  cuentaRepository: asClass(CuentaRepositorySequelize),
  relacionCuentaRepository: asClass(RelacionCuentaRepositorySequelize),
  controladorCuentaRepository: asClass(ControladorCuentaRepositorySequelize),
  variableRepository: asClass(VariableRepositorySequelize),
  variableCuentaRepository: asClass(VariableCuentaRepositorySequelize),
  variableGlobalRepository: asClass(VariableGlobalRepositorySequelize),
  zonaEntregaRepository: asClass(ZonaEntregaRepositorySequelize),
  condicionEspecialRepository: asClass(CondicionEspecialRepositorySequelize),
  recargoDescuentoRepository: asClass(RecargoDescuentoRepositorySequelize),
  debitoAutomaticoRepository: asClass(DebitoAutomaticoRepositorySequelize),
  cuentaPruebaRepository: asClass(CuentaPruebaRepositorySequelize),

  inmuebleRepository: asClass(InmuebleRepositorySequelize),
  vinculoInmuebleRepository: asClass(VinculoInmuebleRepositorySequelize),
  ladoTerrenoRepository: asClass(LadoTerrenoRepositorySequelize),
  ladoTerrenoServicioRepository: asClass(LadoTerrenoServicioRepositorySequelize),
  ladoTerrenoObraRepository: asClass(LadoTerrenoObraRepositorySequelize),
  valuacionRepository: asClass(ValuacionRepositorySequelize),
  obraInmuebleRepository: asClass(ObraInmuebleRepositorySequelize),
  obraInmuebleDetalleRepository: asClass(ObraInmuebleDetalleRepositorySequelize),
  superficieRepository: asClass(SuperficieRepositorySequelize),
  edesurRepository: asClass(EdesurRepositorySequelize),
  edesurClienteRepository: asClass(EdesurClienteRepositorySequelize),
  catastroRepository: asClass(CatastroRepositorySequelize),

  comercioRepository: asClass(ComercioRepositorySequelize),
  vinculoComercioRepository: asClass(VinculoComercioRepositorySequelize),
  inspeccionRepository: asClass(InspeccionRepositorySequelize),
  rubroComercioRepository: asClass(RubroComercioRepositorySequelize),
  declaracionJuradaRepository: asClass(DeclaracionJuradaRepositorySequelize),

  vehiculoRepository: asClass(VehiculoRepositorySequelize),
  vinculoVehiculoRepository: asClass(VinculoVehiculoRepositorySequelize),

  cementerioRepository: asClass(CementerioRepositorySequelize),
  vinculoCementerioRepository: asClass(VinculoCementerioRepositorySequelize),
  inhumadoRepository: asClass(InhumadoRepositorySequelize),
  verificacionRepository: asClass(VerificacionRepositorySequelize),

  fondeaderoRepository: asClass(FondeaderoRepositorySequelize),
  vinculoFondeaderoRepository: asClass(VinculoFondeaderoRepositorySequelize),

  especialRepository: asClass(EspecialRepositorySequelize),
  vinculoEspecialRepository: asClass(VinculoEspecialRepositorySequelize),

  emisionCalculoRepository: asClass(EmisionCalculoRepositorySequelize),
  emisionCalculoResultadoRepository: asClass(EmisionCalculoResultadoRepositorySequelize),
  emisionCuotaRepository: asClass(EmisionCuotaRepositorySequelize),
  emisionDefinicionRepository: asClass(EmisionDefinicionRepositorySequelize),
  emisionEjecucionRepository: asClass(EmisionEjecucionRepositorySequelize),
  emisionEjecucionCuentaRepository: asClass(EmisionEjecucionCuentaRepositorySequelize),
  emisionEjecucionCuotaRepository: asClass(EmisionEjecucionCuotaRepositorySequelize),
  emisionProcedimientoParametroRepository: asClass(EmisionProcedimientoParametroRepositorySequelize),
  emisionVariableRepository: asClass(EmisionVariableRepositorySequelize),
  emisionConceptoRepository: asClass(EmisionConceptoRepositorySequelize),
  emisionConceptoResultadoRepository: asClass(EmisionConceptoResultadoRepositorySequelize),
  emisionCuentaCorrienteRepository: asClass(EmisionCuentaCorrienteRepositorySequelize),
  emisionCuentaCorrienteResultadoRepository: asClass(EmisionCuentaCorrienteResultadoRepositorySequelize),
  emisionImputacionContableRepository: asClass(EmisionImputacionContableRepositorySequelize),
  emisionImputacionContableResultadoRepository: asClass(EmisionImputacionContableResultadoRepositorySequelize),
  emisionAprobacionRepository: asClass(EmisionAprobacionRepositorySequelize),
  emisionNumeracionRepository: asClass(EmisionNumeracionRepositorySequelize),
  funcionRepository: asClass(FuncionRepositorySequelize),
  funcionParametroRepository: asClass(FuncionParametroRepositorySequelize),
  procedimientoRepository: asClass(ProcedimientoRepositorySequelize),
  procedimientoParametroRepository: asClass(ProcedimientoParametroRepositorySequelize),
  procedimientoVariableRepository: asClass(ProcedimientoVariableRepositorySequelize),
  procedimientoFiltroRepository: asClass(ProcedimientoFiltroRepositorySequelize),
  
  tasaRepository: asClass(TasaRepositorySequelize),
  subTasaRepository: asClass(SubTasaRepositorySequelize),
  subTasaImputacionRepository: asClass(SubTasaImputacionRepositorySequelize),
  tasaVencimientoRepository: asClass(TasaVencimientoRepositorySequelize),

  certificadoEscribanoRepository: asClass(CertificadoEscribanoRepositorySequelize),

  apremioRepository: asClass(ApremioRepositorySequelize),
  juicioCitacionRepository: asClass(JuicioCitacionRepositorySequelize),
  actoProcesalRepository: asClass(ActoProcesalRepositorySequelize),
  certificadoApremioRepository: asClass(CertificadoApremioRepositorySequelize),
  certificadoApremioItemRepository: asClass(CertificadoApremioItemRepositorySequelize),
  certificadoApremioPersonaRepository: asClass(CertificadoApremioPersonaRepositorySequelize),
  plantillaDocumentoRepository: asClass(PlantillaDocumentoRepositorySequelize),
  tipoActoProcesalRepository: asClass(TipoActoProcesalRepositorySequelize),
  organoJudicialRepository: asClass(OrganoJudicialRepositorySequelize),
  tipoRelacionCertificadoApremioPersonaRepository: asClass(TipoRelacionCertificadoApremioPersonaRepositorySequelize),

  tipoMovimientoRepository: asClass(TipoMovimientoRepositorySequelize),
  cuentaPagoRepository: asClass(CuentaPagoRepositorySequelize),
  cuentaPagoItemRepository: asClass(CuentaPagoItemRepositorySequelize),
  cuentaCorrienteItemRepository: asClass(CuentaCorrienteItemRepositorySequelize),
  cuentaCorrienteCondicionEspecialRepository: asClass(CuentaCorrienteCondicionEspecialRepositorySequelize),
  convenioParametroRepository: asClass(ConvenioParametroRepositorySequelize),
  tipoPlanPagoRepository: asClass(TipoPlanPagoRepositorySequelize),
  tipoVencimientoPlanPagoRepository: asClass(TipoVencimientoPlanPagoRepositorySequelize),
  planPagoDefinicionRepository: asClass(PlanPagoDefinicionRepositorySequelize),
  planPagoRepository: asClass(PlanPagoRepositorySequelize),
  planPagoCuotaRepository: asClass(PlanPagoCuotaRepositorySequelize),
  cuotaPorcentajeRepository: asClass(CuotaPorcentajeRepositorySequelize),

  planPagoDefinicionAlcanceTasaRepository: asClass(PlanPagoDefinicionAlcanceTasaRepositorySequelize),
  planPagoDefinicionAlcanceRubroRepository: asClass(PlanPagoDefinicionAlcanceRubroRepositorySequelize),
  planPagoDefinicionAlcanceGrupoRepository: asClass(PlanPagoDefinicionAlcanceGrupoRepositorySequelize),
  planPagoDefinicionAlcanceZonaTarifariaRepository: asClass(PlanPagoDefinicionAlcanceZonaTarifariaRepositorySequelize),
  planPagoDefinicionAlcanceCondicionFiscalRepository: asClass(PlanPagoDefinicionAlcanceCondicionFiscalRepositorySequelize),
  planPagoDefinicionAlcanceRubroAfipRepository: asClass(PlanPagoDefinicionAlcanceRubroAfipRepositorySequelize),
  planPagoDefinicionAlcanceFormaJuridicaRepository: asClass(PlanPagoDefinicionAlcanceFormaJuridicaRepositorySequelize),
  planPagoDefinicionQuitaCuotaRepository: asClass(PlanPagoDefinicionQuitaCuotaRepositorySequelize),
  planPagoDefinicionInteresRepository: asClass(PlanPagoDefinicionInteresRepositorySequelize),
  planPagoDefinicionTipoVinculoCuentaRepository: asClass(PlanPagoDefinicionTipoVinculoCuentaRepositorySequelize),

  tipoControladorRepository: asClass(TipoControladorRepositorySequelize),
  controladorRepository: asClass(ControladorRepositorySequelize),
  personaRepository: asClass(PersonaRepositorySequelize),

  pagoContadoDefinicionRepository: asClass(PagoContadoDefinicionRepositorySequelize),
  pagoContadoDefinicionAlcanceTasaRepository: asClass(PagoContadoDefinicionAlcanceTasaRepositorySequelize),
  pagoContadoDefinicionAlcanceRubroRepository: asClass(PagoContadoDefinicionAlcanceRubroRepositorySequelize),
  pagoContadoDefinicionAlcanceGrupoRepository: asClass(PagoContadoDefinicionAlcanceGrupoRepositorySequelize),
  pagoContadoDefinicionAlcanceZonaTarifariaRepository: asClass(PagoContadoDefinicionAlcanceZonaTarifariaRepositorySequelize),
  pagoContadoDefinicionAlcanceCondicionFiscalRepository: asClass(PagoContadoDefinicionAlcanceCondicionFiscalRepositorySequelize),
  pagoContadoDefinicionAlcanceRubroAfipRepository: asClass(PagoContadoDefinicionAlcanceRubroAfipRepositorySequelize),
  pagoContadoDefinicionAlcanceFormaJuridicaRepository: asClass(PagoContadoDefinicionAlcanceFormaJuridicaRepositorySequelize),
  pagoContadoDefinicionTipoVinculoCuentaRepository: asClass(PagoContadoDefinicionTipoVinculoCuentaRepositorySequelize),

  declaracionJuradaComercioRepository: asClass(DeclaracionJuradaComercioRepositorySequelize),
  declaracionJuradaRubroRepository: asClass(DeclaracionJuradaRubroRepositorySequelize),
  claseElementoRepository: asClass(ClaseElementoRepositorySequelize),
  tipoElementoRepository: asClass(TipoElementoRepositorySequelize),
  elementoRepository: asClass(ElementoRepositorySequelize),
  filtroRepository: asClass(FiltroRepositorySequelize),
  coleccionRepository: asClass(ColeccionRepositorySequelize),
  coleccionCampoRepository: asClass(ColeccionCampoRepositorySequelize),

  reciboEspecialRepository: asClass(ReciboEspecialRepositorySequelize),
  reciboEspecialConceptoRepository: asClass(ReciboEspecialConceptoRepositorySequelize),

  obraController: asClass(ObraController),
  tipoSuperficieController: asClass(TipoSuperficieController),
  grupoSuperficieController: asClass(GrupoSuperficieController),
  tipoCondicionEspecialController: asClass(TipoCondicionEspecialController),
  tipoInstrumentoController: asClass(TipoInstrumentoController),
  rubroController: asClass(RubroController),
  tipoRecargoDescuentoController: asClass(TipoRecargoDescuentoController),
  incisoVehiculoController: asClass(IncisoVehiculoController),
  tipoVehiculoController: asClass(TipoVehiculoController),
  categoriaVehiculoController: asClass(CategoriaVehiculoController),
  rubroLiquidacionController: asClass(RubroLiquidacionController),
  zonaTarifariaController: asClass(ZonaTarifariaController),
  grupoController: asClass(GrupoController),
  tipoConstruccionFunerariaController: asClass(TipoConstruccionFunerariaController),
  tipoRubroComercioController: asClass(TipoRubroComercioController),
  rubroProvinciaController: asClass(RubroProvinciaController),
  rubroBCRAController: asClass(RubroBCRAController),
  motivoBajaRubroComercioController: asClass(MotivoBajaRubroComercioController),
  ubicacionComercioController: asClass(UbicacionComercioController),
  cocheriaController: asClass(CocheriaController),
  registroCivilController: asClass(RegistroCivilController),
  categoriaTasaController: asClass(CategoriaTasaController),
  tipoAnuncioController: asClass(TipoAnuncioController),
  categoriaUbicacionController: asClass(CategoriaUbicacionController),
  motivoBajaComercioController: asClass(MotivoBajaComercioController),
  objetoCertificadoController: asClass(ObjetoCertificadoController),
  escribanoController: asClass(EscribanoController),
  tipoDDJJController: asClass(TipoDDJJController),
  paisController: asClass(PaisController),
  provinciaController: asClass(ProvinciaController),
  localidadController: asClass(LocalidadController),

  obraService: asClass(ObraService),
  tipoSuperficieService: asClass(TipoSuperficieService),
  grupoSuperficieService: asClass(GrupoSuperficieService),
  tipoCondicionEspecialService: asClass(TipoCondicionEspecialService),
  tipoInstrumentoService: asClass(TipoInstrumentoService),
  rubroService: asClass(RubroService),
  tipoRecargoDescuentoService: asClass(TipoRecargoDescuentoService),
  incisoVehiculoService: asClass(IncisoVehiculoService),
  tipoVehiculoService: asClass(TipoVehiculoService),
  categoriaVehiculoService: asClass(CategoriaVehiculoService),
  rubroLiquidacionService: asClass(RubroLiquidacionService),
  zonaTarifariaService: asClass(ZonaTarifariaService),
  grupoService: asClass(GrupoService),
  tipoConstruccionFunerariaService: asClass(TipoConstruccionFunerariaService),
  tipoRubroComercioService: asClass(TipoRubroComercioService),
  rubroProvinciaService: asClass(RubroProvinciaService),
  rubroBCRAService: asClass(RubroBCRAService),
  motivoBajaRubroComercioService: asClass(MotivoBajaRubroComercioService),
  ubicacionComercioService: asClass(UbicacionComercioService),
  cocheriaService: asClass(CocheriaService),
  registroCivilService: asClass(RegistroCivilService),
  categoriaTasaService: asClass(CategoriaTasaService),
  tipoAnuncioService: asClass(TipoAnuncioService),
  categoriaUbicacionService: asClass(CategoriaUbicacionService),
  motivoBajaComercioService: asClass(MotivoBajaComercioService),
  objetoCertificadoService: asClass(ObjetoCertificadoService),
  escribanoService: asClass(EscribanoService),
  tipoDDJJService: asClass(TipoDDJJService),
  paisService: asClass(PaisService),
  provinciaService: asClass(ProvinciaService),
  localidadService: asClass(LocalidadService),
  cuentaPruebaService: asClass(CuentaPruebaService),

  obraRepository: asClass(ObraRepositorySequelize),
  tipoSuperficieRepository: asClass(TipoSuperficieRepositorySequelize),
  grupoSuperficieRepository: asClass(GrupoSuperficieRepositorySequelize),
  tipoCondicionEspecialRepository: asClass(TipoCondicionEspecialRepositorySequelize),
  tipoInstrumentoRepository: asClass(TipoInstrumentoRepositorySequelize),
  rubroRepository: asClass(RubroRepositorySequelize),
  tipoRecargoDescuentoRepository: asClass(TipoRecargoDescuentoRepositorySequelize),
  incisoVehiculoRepository: asClass(IncisoVehiculoRepositorySequelize),
  tipoVehiculoRepository: asClass(TipoVehiculoRepositorySequelize),
  categoriaVehiculoRepository: asClass(CategoriaVehiculoRepositorySequelize),
  rubroLiquidacionRepository: asClass(RubroLiquidacionRepositorySequelize),
  zonaTarifariaRepository: asClass(ZonaTarifariaRepositorySequelize),
  grupoRepository: asClass(GrupoRepositorySequelize),
  tipoConstruccionFunerariaRepository: asClass(TipoConstruccionFunerariaRepositorySequelize),
  tipoRubroComercioRepository: asClass(TipoRubroComercioRepositorySequelize),
  rubroProvinciaRepository: asClass(RubroProvinciaRepositorySequelize),
  rubroBCRARepository: asClass(RubroBCRARepositorySequelize),
  motivoBajaRubroComercioRepository: asClass(MotivoBajaRubroComercioRepositorySequelize),
  ubicacionComercioRepository: asClass(UbicacionComercioRepositorySequelize),
  cocheriaRepository: asClass(CocheriaRepositorySequelize),
  registroCivilRepository: asClass(RegistroCivilRepositorySequelize),
  categoriaTasaRepository: asClass(CategoriaTasaRepositorySequelize),
  tipoAnuncioRepository: asClass(TipoAnuncioRepositorySequelize),
  categoriaUbicacionRepository: asClass(CategoriaUbicacionRepositorySequelize),
  motivoBajaComercioRepository: asClass(MotivoBajaComercioRepositorySequelize),
  objetoCertificadoRepository: asClass(ObjetoCertificadoRepositorySequelize),
  escribanoRepository: asClass(EscribanoRepositorySequelize),
  tipoDDJJRepository: asClass(TipoDDJJRepositorySequelize),
  paisRepository: asClass(PaisRepositorySequelize),
  provinciaRepository: asClass(ProvinciaRepositorySequelize),
  localidadRepository: asClass(LocalidadRepositorySequelize),
});

export default container;
