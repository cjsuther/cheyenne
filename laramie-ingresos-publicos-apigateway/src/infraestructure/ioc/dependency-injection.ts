import { InjectionMode, createContainer, asClass } from 'awilix';

import FileController from '../../server/controllers/file-controller';
import ReporteController from '../../server/controllers/reporte-controller';
import ProcesoController from '../../server/controllers/proceso-controller';
import ConfiguracionController from '../../server/controllers/configuracion-controller';
import ListaController from '../../server/controllers/lista-controller';
import EntidadController from '../../server/controllers/entidad-controller';
import DireccionController from '../../server/controllers/direccion-controller';
import InformacionAdicionalController from '../../server/controllers/informacion-adicional-controller';
import ArchivoController from '../../server/controllers/archivo-controller';
import ObservacionController from '../../server/controllers/observacion-controller';
import EtiquetaController from '../../server/controllers/etiqueta-controller';
import CuentaController from '../../server/controllers/cuenta-controller';
import VinculoCuentaController from '../../server/controllers/vinculo-cuenta-controller';
import ContribuyenteController from '../../server/controllers/contribuyente-controller';
import PersonaController from '../../server/controllers/persona-controller';
import ExpedienteController from '../../server/controllers/expediente-controller';
import MedioPagoController from '../../server/controllers/medio-pago-controller';
import InmuebleController from '../../server/controllers/inmueble-controller';
import CatastroController from '../../server/controllers/catastro-controller';
import ComercioController from '../../server/controllers/comercio-controller';
import VehiculoController from '../../server/controllers/vehiculo-controller';
import CementerioController from '../../server/controllers/cementerio-controller';
import FondeaderoController from '../../server/controllers/fondeadero-controller';
import EspecialController from '../../server/controllers/especial-controller';
import EmisionDefinicionController from '../../server/controllers/emision-definicion-controller';
import EmisionEjecucionController from '../../server/controllers/emision-ejecucion-controller';
import EmisionEjecucionCuentaController from '../../server/controllers/emision-ejecucion-cuenta-controller';
import EmisionAprobacionController from '../../server/controllers/emision-aprobacion-controller';
import ProcedimientoController from '../../server/controllers/procedimiento-controller';
import VariableController from '../../server/controllers/variable-controller';
import VariableGlobalController from '../../server/controllers/variable-global-controller';
import TasaController from '../../server/controllers/tasa-controller';
import SubTasaController from '../../server/controllers/sub-tasa-controller';
import TasaVencimientoController from '../../server/controllers/tasa-vencimiento-controller';
import CertificadoEscribanoController from '../../server/controllers/certificado-escribano-controller';
import CertificadoApremioController from '../../server/controllers/certificado-apremio-controller';
import CertificadoApremioItemController from '../../server/controllers/certificado-apremio-item-controller';
import PlantillaDocumentoController from '../../server/controllers/plantilla-documento-controller';
import TipoActoProcesalController from '../../server/controllers/tipo-acto-procesal-controller';
import OrganoJudicialController from '../../server/controllers/organo-judicial-controller';
import TipoRelacionCertificadoApremioPersonaController from '../../server/controllers/tipo-relacion-certificado-apremio-persona-controller';
import CuentaCorrienteItemController from '../../server/controllers/cuenta-corriente-item-controller';
import CuentaCorrienteCondicionEspecialController from '../../server/controllers/cuenta-corriente-condicion-especial-controller';
import ConvenioParametroController from '../../server/controllers/convenio-parametro-controller';
import TipoPlanPagoController from '../../server/controllers/tipo-plan-pago-controller';
import PlanPagoDefinicionController from '../../server/controllers/plan-pago-definicion-controller';
import PlanPagoController from '../../server/controllers/plan-pago-controller';
import PlanPagoCuotaController from '../../server/controllers/plan-pago-cuota-controller';
import PagoContadoDefinicionController from '../../server/controllers/pago-contado-definicion-controller';
import PagoContadoController from '../../server/controllers/pago-contado-controller';
import CuotaPorcentajeController from '../../server/controllers/cuota-porcentaje-controller';
import CuentaPagoController from '../../server/controllers/cuenta-pago-controller';
import CuentaPagoItemController from '../../server/controllers/cuenta-pago-item-controller';
import ControladorController from '../../server/controllers/controlador-controller';
import ApremioController from '../../server/controllers/apremio-controller';
import PermisoController from '../../server/controllers/permiso-controller';
import ColeccionController from '../../server/controllers/coleccion-controller';
import CuentaPruebaController from '../../server/controllers/cuenta-prueba-controller';
import ReciboEspecialController from '../../server/controllers/recibo-especial-controller';
import DeclaracionJuradaComercioController from '../../server/controllers/declaracion-jurada-comercio-controller';

import SesionService from '../../domain/services/sesion-service';
import ReporteService from  '../../domain/services/reporte-service';
import ProcesoService from '../../domain/services/proceso-service';
import ConfiguracionService from '../../domain/services/configuracion-service';
import ListaService from '../../domain/services/lista-service';
import EntidadService from '../../domain/services/entidad-service';
import DireccionService from '../../domain/services/direccion-service';
import InformacionAdicionalService from '../../domain/services/informacion-adicional-service';
import ArchivoService from '../../domain/services/archivo-service';
import ObservacionService from '../../domain/services/observacion-service';
import EtiquetaService from '../../domain/services/etiqueta-service';
import CuentaService from '../../domain/services/cuenta-service';
import VinculoCuentaService from '../../domain/services/vinculo-cuenta-service';
import ContribuyenteService from '../../domain/services/contribuyente-service';
import PersonaService from '../../domain/services/persona-service';
import ExpedienteService from '../../domain/services/expediente-service';
import MedioPagoService from '../../domain/services/medio-pago-service';
import InmuebleService from '../../domain/services/inmueble-service';
import CatastroService from '../../domain/services/catastro-service';
import ComercioService from '../../domain/services/comercio-service';
import VehiculoService from '../../domain/services/vehiculo-service';
import CementerioService from '../../domain/services/cementerio-service';
import FondeaderoService from '../../domain/services/fondeadero-service';
import EspecialService from '../../domain/services/especial-service';
import EmisionDefinicionService from '../../domain/services/emision-definicion-service';
import EmisionEjecucionService from '../../domain/services/emision-ejecucion-service';
import EmisionEjecucionCuentaService from '../../domain/services/emision-ejecucion-cuenta-service';
import EmisionAprobacionService from '../../domain/services/emision-aprobacion-service';
import ProcedimientoService from '../../domain/services/procedimiento-service';
import VariableService from '../../domain/services/variable-service';
import VariableGlobalService from '../../domain/services/variable-global-service';
import TasaService from '../../domain/services/tasa-service';
import SubTasaService from '../../domain/services/sub-tasa-service';
import TasaVencimientoService from '../../domain/services/tasa-vencimiento-service';
import ApremioService from '../../domain/services/apremio-service';
import CertificadoEscribanoService from '../../domain/services/certificado-escribano-service';
import CertificadoApremioService from '../../domain/services/certificado-apremio-service';
import CertificadoApremioItemService from '../../domain/services/certificado-apremio-item-service';
import PlantillaDocumentoService from '../../domain/services/plantilla-documento-service';
import TipoActoProcesalService from '../../domain/services/tipo-acto-procesal-service';
import OrganoJudicialService from '../../domain/services/organo-judicial-service';
import TipoRelacionCertificadoApremioPersonaService from '../../domain/services/tipo-relacion-certificado-apremio-persona-service';
import CuentaCorrienteItemService from '../../domain/services/cuenta-corriente-item-service';
import CuentaCorrienteCondicionEspecialService from '../../domain/services/cuenta-corriente-condicion-especial-service';
import ConvenioParametroService from '../../domain/services/convenio-parametro-service';
import TipoPlanPagoService from '../../domain/services/tipo-plan-pago-service';
import PlanPagoDefinicionService from '../../domain/services/plan-pago-definicion-service';
import PlanPagoService from '../../domain/services/plan-pago-service';
import PlanPagoCuotaService from '../../domain/services/plan-pago-cuota-service';
import PagoContadoDefinicionService from '../../domain/services/pago-contado-definicion-service';
import PagoContadoService from '../../domain/services/pago-contado-service';
import CuotaPorcentajeService from '../../domain/services/cuota-porcentaje-service';
import CuentaPagoService from '../../domain/services/cuenta-pago-service';
import CuentaPagoItemService from '../../domain/services/cuenta-pago-item-service';
import ControladorService from '../../domain/services/controlador-service';
import PermisoService from '../../domain/services/permiso-service';
import ColeccionService from '../../domain/services/coleccion-service';
import CuentaPruebaService from '../../domain/services/cuenta-prueba-service';
import ReciboEspecialService from '../../domain/services/recibo-especial-service';
import DeclaracionJuradaComercioService from '../../domain/services/declaracion-jurada-comercio-service';

const container = createContainer({
  injectionMode: InjectionMode.CLASSIC
})

container.register({

  fileController: asClass(FileController),
  reporteController: asClass(ReporteController),
  procesoController: asClass(ProcesoController),
  configuracionController: asClass(ConfiguracionController),
  listaController: asClass(ListaController),
  entidadController: asClass(EntidadController),
  direccionController: asClass(DireccionController),
  informacionAdicionalController: asClass(InformacionAdicionalController),
  archivoController: asClass(ArchivoController),
  observacionController: asClass(ObservacionController),
  etiquetaController: asClass(EtiquetaController),
  cuentaController: asClass(CuentaController),
  vinculoCuentaController: asClass(VinculoCuentaController),
  variableController: asClass(VariableController),
  variableGlobalController: asClass(VariableGlobalController),
  personaController: asClass(PersonaController),
  expedienteController: asClass(ExpedienteController),
  medioPagoController: asClass(MedioPagoController),
  contribuyenteController: asClass(ContribuyenteController),
  inmuebleController: asClass(InmuebleController),
  catastroController: asClass(CatastroController),
  comercioController: asClass(ComercioController),
  vehiculoController: asClass(VehiculoController),
  cementerioController: asClass(CementerioController),
  fondeaderoController: asClass(FondeaderoController),
  especialController: asClass(EspecialController),
  emisionDefinicionController: asClass(EmisionDefinicionController),
  emisionEjecucionController: asClass(EmisionEjecucionController),
  emisionEjecucionCuentaController: asClass(EmisionEjecucionCuentaController),
  emisionAprobacionController: asClass(EmisionAprobacionController),
  procedimientoController: asClass(ProcedimientoController),
  tasaController: asClass(TasaController),
  subTasaController: asClass(SubTasaController),
  tasaVencimientoController: asClass(TasaVencimientoController),
  certificadoEscribanoController: asClass(CertificadoEscribanoController),
  certificadoApremioController: asClass(CertificadoApremioController),
  certificadoApremioItemController: asClass(CertificadoApremioItemController),
  plantillaDocumentoController: asClass(PlantillaDocumentoController),
  tipoActoProcesalController: asClass(TipoActoProcesalController),
  organoJudicialController: asClass(OrganoJudicialController),
  tipoRelacionCertificadoApremioPersonaController: asClass(TipoRelacionCertificadoApremioPersonaController),
  cuentaCorrienteItemController: asClass(CuentaCorrienteItemController),
  cuentaCorrienteCondicionEspecialController: asClass(CuentaCorrienteCondicionEspecialController),
  convenioParametroController: asClass(ConvenioParametroController),
  tipoPlanPagoController: asClass(TipoPlanPagoController),
  planPagoDefinicionController: asClass(PlanPagoDefinicionController),
  planPagoController: asClass(PlanPagoController),
  planPagoCuotaController: asClass(PlanPagoCuotaController),
  pagoContadoDefinicionController: asClass(PagoContadoDefinicionController),
  pagoContadoController: asClass(PagoContadoController),
  cuotaPorcentajeController: asClass(CuotaPorcentajeController),
  cuentaPagoController: asClass(CuentaPagoController),
  cuentaPagoItemController: asClass(CuentaPagoItemController),
  controladorController: asClass(ControladorController),
  apremioController: asClass(ApremioController),
  permisoController: asClass(PermisoController),
  coleccionController: asClass(ColeccionController),
  cuentaPruebaController: asClass(CuentaPruebaController),
  reciboEspecialController: asClass(ReciboEspecialController),
  declaracionJuradaComercioController: asClass(DeclaracionJuradaComercioController),

  sesionService: asClass(SesionService),
  reporteService: asClass(ReporteService),
  procesoService: asClass(ProcesoService),
  configuracionService: asClass(ConfiguracionService),
  listaService: asClass(ListaService),
  entidadService: asClass(EntidadService),
  direccionService: asClass(DireccionService),
  informacionAdicionalService: asClass(InformacionAdicionalService),
  archivoService: asClass(ArchivoService),
  observacionService: asClass(ObservacionService),
  etiquetaService: asClass(EtiquetaService),
  cuentaService: asClass(CuentaService),
  vinculoCuentaService: asClass(VinculoCuentaService),
  variableService: asClass(VariableService),
  variableGlobalService: asClass(VariableGlobalService),
  personaService: asClass(PersonaService),
  expedienteService: asClass(ExpedienteService),
  medioPagoService: asClass(MedioPagoService),
  contribuyenteService: asClass(ContribuyenteService),
  inmuebleService: asClass(InmuebleService),
  catastroService: asClass(CatastroService),
  comercioService: asClass(ComercioService),
  vehiculoService: asClass(VehiculoService),
  cementerioService: asClass(CementerioService),
  fondeaderoService: asClass(FondeaderoService),
  especialService: asClass(EspecialService),
  emisionDefinicionService: asClass(EmisionDefinicionService),
  emisionEjecucionService: asClass(EmisionEjecucionService),
  emisionEjecucionCuentaService: asClass(EmisionEjecucionCuentaService),
  emisionAprobacionService: asClass(EmisionAprobacionService),
  procedimientoService: asClass(ProcedimientoService),
  tasaService: asClass(TasaService),
  subTasaService: asClass(SubTasaService),
  tasaVencimientoService: asClass(TasaVencimientoService),
  apremioService: asClass(ApremioService),
  certificadoEscribanoService: asClass(CertificadoEscribanoService),
  certificadoApremioService: asClass(CertificadoApremioService),
  certificadoApremioItemService: asClass(CertificadoApremioItemService),
  plantillaDocumentoService: asClass(PlantillaDocumentoService),
  tipoActoProcesalService: asClass(TipoActoProcesalService),
  organoJudicialService: asClass(OrganoJudicialService),
  tipoRelacionCertificadoApremioPersonaService: asClass(TipoRelacionCertificadoApremioPersonaService),
  cuentaCorrienteItemService: asClass(CuentaCorrienteItemService),
  cuentaCorrienteCondicionEspecialService: asClass(CuentaCorrienteCondicionEspecialService),
  convenioParametroService: asClass(ConvenioParametroService),
  tipoPlanPagoService: asClass(TipoPlanPagoService),
  planPagoDefinicionService: asClass(PlanPagoDefinicionService),
  planPagoService: asClass(PlanPagoService),
  planPagoCuotaService: asClass(PlanPagoCuotaService),
  pagoContadoDefinicionService: asClass(PagoContadoDefinicionService),
  pagoContadoService: asClass(PagoContadoService),
  cuotaPorcentajeService: asClass(CuotaPorcentajeService),
  cuentaPagoService: asClass(CuentaPagoService),
  cuentaPagoItemService: asClass(CuentaPagoItemService),
  controladorService: asClass(ControladorService),
  permisoService: asClass(PermisoService),
  coleccionService: asClass(ColeccionService),
  cuentaPruebaService: asClass(CuentaPruebaService),
  reciboEspecialService: asClass(ReciboEspecialService),
  declaracionJuradaComercioService: asClass(DeclaracionJuradaComercioService),
});

export default container;
