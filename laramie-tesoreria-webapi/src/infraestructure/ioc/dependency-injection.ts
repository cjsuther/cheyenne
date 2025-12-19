import { InjectionMode, createContainer, asClass } from 'awilix';

import MessageRouterRabbitMQ from '../sdk/communication/message-router/message-router-rabbitmq';
import PublishService from '../../domain/services/publish-service';
import SubscribeService from '../../domain/services/subscribe-service';
import QueueMessageExecute from '../../domain/services/process/queue-message/queue-message-execute';

import ReporteController from '../../server/controllers/reporte-controller';
import ListaController from '../../server/controllers/lista-controller';
import EntidadController from '../../server/controllers/entidad-controller';
import InformacionAdicionalController from '../../server/controllers/informacion-adicional-controller';
import ArchivoController from '../../server/controllers/archivo-controller';
import ObservacionController from '../../server/controllers/observacion-controller';
import EtiquetaController from '../../server/controllers/etiqueta-controller';
import ReciboPublicacionLoteController from '../../server/controllers/recibo-publicacion-lote-controller';
import DependenciaController from '../../server/controllers/dependencia-controller';
import CajaController from '../../server/controllers/caja-controller';
import RecaudadoraController from '../../server/controllers/recaudadora-controller';
import RecaudacionLoteController from '../../server/controllers/recaudacion-lote-controller';
import PagoRendicionLoteController from '../../server/controllers/pago-rendicion-lote-controller';
import RegistroContableLoteController from '../../server/controllers/registro-contable-lote-controller';

import ReporteService from '../../domain/services/reporte-service';
import ReportCajaTicket from '../../domain/services/reports/report-caja-ticket';
import ReportCajaCierre from '../../domain/services/reports/report-caja-cierre';

import PerfilService from '../../domain/services/perfil-service';
import ConfiguracionService from '../../domain/services/configuracion-service';
import ListaService from '../../domain/services/lista-service';
import EntidadService from '../../domain/services/entidad-service';
import TasaService from '../../domain/services/tasa-service';
import InformacionAdicionalService from '../../domain/services/informacion-adicional-service';
import ArchivoService from '../../domain/services/archivo-service';
import ObservacionService from '../../domain/services/observacion-service';
import EtiquetaService from '../../domain/services/etiqueta-service';
import ReciboPublicacionLoteService from '../../domain/services/recibo-publicacion-lote-service';
import ReciboPublicacionService from '../../domain/services/recibo-publicacion-service';
import ReciboAperturaService from '../../domain/services/recibo-apertura-service';
import DependenciaService from '../../domain/services/dependencia-service';
import CajaService from '../../domain/services/caja-service';
import CajaAsignacionService from '../../domain/services/caja-asignacion-service';
import MovimientoCajaService from '../../domain/services/movimiento-caja-service';
import MovimientoMedioPagoService from '../../domain/services/movimiento-medio-pago-service';
import MovimientoReciboPublicacionService from '../../domain/services/movimiento-recibo-publicacion-service';
import RecaudadoraService from '../../domain/services/recaudadora-service';
import RecaudacionLoteService from '../../domain/services/recaudacion-lote-service';
import RecaudacionService from '../../domain/services/recaudacion-service';
import PagoRendicionLoteService from '../../domain/services/pago-rendicion-lote-service';
import PagoRendicionService from '../../domain/services/pago-rendicion-service';
import RegistroContableLoteService from '../../domain/services/registro-contable-lote-service';
import RegistroContableService from '../../domain/services/registro-contable-service';
import CodigoBarrasClienteService from '../../domain/services/codigo-barras-cliente-service';

import ListaRepositorySequelize from '../data/repositories-sequelize/lista-repository';
import ConfiguracionRepositorySequelize from '../data/repositories-sequelize/configuracion-repository';
import EntidadRepositorySequelize from '../data/repositories-sequelize/entidad-repository';
import EntidadDefinicionRepositorySequelize from '../data/repositories-sequelize/entidad-definicion-repository';
import ArchivoRepositorySequelize from '../data/repositories-sequelize/archivo-repository';
import ObservacionRepositorySequelize from '../data/repositories-sequelize/observacion-repository';
import EtiquetaRepositorySequelize from '../data/repositories-sequelize/etiqueta-repository';
import ReciboPublicacionLoteRepositorySequelize from '../data/repositories-sequelize/recibo-publicacion-lote-repository';
import ReciboPublicacionRepositorySequelize from '../data/repositories-sequelize/recibo-publicacion-repository';
import ReciboAperturaRepositorySequelize from '../data/repositories-sequelize/recibo-apertura-repository';
import DependenciaRepositorySequelize from '../data/repositories-sequelize/dependencia-repository';
import CajaRepositorySequelize from '../data/repositories-sequelize/caja-repository';
import CajaAsignacionRepositorySequelize from '../data/repositories-sequelize/caja-asignacion-repository';
import MovimientoCajaRepositorySequelize from '../data/repositories-sequelize/movimiento-caja-repository';
import MovimientoMedioPagoRepositorySequelize from '../data/repositories-sequelize/movimiento-medio-pago-repository';
import MovimientoReciboPublicacionRepositorySequelize from '../data/repositories-sequelize/movimiento-recibo-publicacion-repository';
import RecaudadoraRepositorySequelize from '../data/repositories-sequelize/recaudadora-repository';
import RecaudacionLoteRepositorySequelize from '../data/repositories-sequelize/recaudacion-lote-repository';
import RecaudacionRepositorySequelize from '../data/repositories-sequelize/recaudacion-repository';
import PagoRendicionLoteRepositorySequelize from '../data/repositories-sequelize/pago-rendicion-lote-repository';
import PagoRendicionRepositorySequelize from '../data/repositories-sequelize/pago-rendicion-repository';
import RegistroContableLoteRepositorySequelize from '../data/repositories-sequelize/registro-contable-lote-repository';
import RegistroContableRepositorySequelize from '../data/repositories-sequelize/registro-contable-repository';
import CodigoBarrasClienteRepositorySequelize from '../data/repositories-sequelize/codigo-barras-cliente-repository';

import ReportInformeRecaudacionLote from '../../domain/services/reports/report-informe-recaudacion-lote';
import ReportInformeRedo from '../../domain/services/reports/report-informe-redo';

const container = createContainer({
  injectionMode: InjectionMode.CLASSIC
})

container.register({

  messageRouter: asClass(MessageRouterRabbitMQ),
  publishService: asClass(PublishService),
  subscribeService: asClass(SubscribeService),
  queueMessageExecute: asClass(QueueMessageExecute),

  reporteController: asClass(ReporteController),
  listaController: asClass(ListaController),
  entidadController: asClass(EntidadController),
  informacionAdicionalController: asClass(InformacionAdicionalController),
  archivoController: asClass(ArchivoController),
  observacionController: asClass(ObservacionController),
  etiquetaController: asClass(EtiquetaController),
  reciboPublicacionLoteController: asClass(ReciboPublicacionLoteController),
  dependenciaController: asClass(DependenciaController),
  cajaController: asClass(CajaController),
  recaudadoraController: asClass(RecaudadoraController),
  recaudacionLoteController: asClass(RecaudacionLoteController),
  pagoRendicionLoteController: asClass(PagoRendicionLoteController),
  registroContableLoteController: asClass(RegistroContableLoteController),

  reporteService: asClass(ReporteService),
  reportCajaTicket: asClass(ReportCajaTicket),
  reportCajaCierre: asClass(ReportCajaCierre),
  reportInformeRecaudacionLote: asClass(ReportInformeRecaudacionLote),
  reportInformeRedo: asClass(ReportInformeRedo),
  perfilService: asClass(PerfilService),
  configuracionService: asClass(ConfiguracionService),
  listaService: asClass(ListaService),
  entidadService: asClass(EntidadService),
  tasaService: asClass(TasaService),
  informacionAdicionalService: asClass(InformacionAdicionalService),
  archivoService: asClass(ArchivoService),
  observacionService: asClass(ObservacionService),
  etiquetaService: asClass(EtiquetaService),
  reciboPublicacionLoteService: asClass(ReciboPublicacionLoteService),
  reciboPublicacionService: asClass(ReciboPublicacionService),
  reciboAperturaService: asClass(ReciboAperturaService),
  dependenciaService: asClass(DependenciaService),
  cajaService: asClass(CajaService),
  cajaAsignacionService: asClass(CajaAsignacionService),
  movimientoCajaService: asClass(MovimientoCajaService),
  movimientoMedioPagoService: asClass(MovimientoMedioPagoService),
  movimientoReciboPublicacionService: asClass(MovimientoReciboPublicacionService),
  recaudadoraService: asClass(RecaudadoraService),
  recaudacionLoteService: asClass(RecaudacionLoteService),
  recaudacionService: asClass(RecaudacionService),
  pagoRendicionLoteService: asClass(PagoRendicionLoteService),
  pagoRendicionService: asClass(PagoRendicionService),
  registroContableLoteService: asClass(RegistroContableLoteService),
  registroContableService: asClass(RegistroContableService),
  codigoBarrasClienteService: asClass(CodigoBarrasClienteService),

  listaRepository: asClass(ListaRepositorySequelize),
  configuracionRepository: asClass(ConfiguracionRepositorySequelize),
  entidadRepository: asClass(EntidadRepositorySequelize),
  entidadDefinicionRepository: asClass(EntidadDefinicionRepositorySequelize),
  archivoRepository: asClass(ArchivoRepositorySequelize),
  observacionRepository: asClass(ObservacionRepositorySequelize),
  etiquetaRepository: asClass(EtiquetaRepositorySequelize),
  reciboPublicacionLoteRepository: asClass(ReciboPublicacionLoteRepositorySequelize),
  reciboPublicacionRepository: asClass(ReciboPublicacionRepositorySequelize),
  reciboAperturaRepository: asClass(ReciboAperturaRepositorySequelize),
  dependenciaRepository: asClass(DependenciaRepositorySequelize),
  cajaRepository: asClass(CajaRepositorySequelize),
  cajaAsignacionRepository: asClass(CajaAsignacionRepositorySequelize),
  movimientoCajaRepository: asClass(MovimientoCajaRepositorySequelize),
  movimientoMedioPagoRepository: asClass(MovimientoMedioPagoRepositorySequelize),
  movimientoReciboPublicacionRepository: asClass(MovimientoReciboPublicacionRepositorySequelize),
  recaudadoraRepository: asClass(RecaudadoraRepositorySequelize),
  recaudacionLoteRepository: asClass(RecaudacionLoteRepositorySequelize),
  recaudacionRepository: asClass(RecaudacionRepositorySequelize),
  pagoRendicionLoteRepository: asClass(PagoRendicionLoteRepositorySequelize),
  pagoRendicionRepository: asClass(PagoRendicionRepositorySequelize),
  codigoBarrasClienteRepository: asClass(CodigoBarrasClienteRepositorySequelize),

  registroContableLoteRepository: asClass(RegistroContableLoteRepositorySequelize),
  registroContableRepository: asClass(RegistroContableRepositorySequelize),

});

export default container;
