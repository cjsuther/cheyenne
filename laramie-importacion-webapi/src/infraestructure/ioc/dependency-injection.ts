import { InjectionMode, createContainer, asClass } from 'awilix';

import ImportadorController from '../../server/controllers/importador-controller';
import ExportadorController from '../../server/controllers/exportador-controller';

import MessageRouterRabbitMQ from '../sdk/communication/message-router/message-router-rabbitmq';
import PublishService from '../../domain/services/publish-service';
import SubscribeService from '../../domain/services/subscribe-service';
import QueueMessageExecute from '../../domain/services/process/queue-message/queue-message-execute';

import ImportadorService from '../../domain/services/importador-service';
import ExportadorService from '../../domain/services/exportador-service';
import ImportSUCERP from '../../domain/services/process/importador/import-sucerp';
import ImportActasCausas from '../../domain/services/process/importador/import-actas-causas';
import ImportARBAVehiculo from '../../domain/services/process/importador/import-arba-vehiculo';
import ImportARBACatastro from '../../domain/services/process/importador/import-arba-catastro';
import ExportSUCERP from '../../domain/services/process/exportador/export-sucerp';

import ConfiguracionService from '../../domain/services/configuracion-service';
import PerfilService from '../../domain/services/perfil-service';
import ListaService from '../../domain/services/lista-service';
import CuentaService from '../../domain/services/cuenta-service';
import VehiculoService from '../../domain/services/vehiculo-service';
import TipoVehiculoService from '../../domain/services/tipo-vehiculo-service';
import IncisoVehiculoService from '../../domain/services/inciso-vehiculo-service';
import CategoriaVehiculoService from '../../domain/services/categoria-vehiculo-service';
import CategoriaTasaService from '../../domain/services/categoria-tasa-service';
import TipoCondicionEspecialService from '../../domain/services/tipo-condicion-especial-service';
import TipoMovimientoService from '../../domain/services/tipo-movimiento-service';
import CuentaPagoService from '../../domain/services/cuenta-pago-service';
import CuentaCorrienteItemService from '../../domain/services/cuenta-corriente-item-service';
import PersonaService from '../../domain/services/persona-service';
import ProvinciaService from '../../domain/services/provincia-service';
import ObservacionService from '../../domain/services/observacion-service';
import EtiquetaService from '../../domain/services/etiqueta-service';
import TasaService from '../../domain/services/tasa-service';
import SubTasaService from '../../domain/services/sub-tasa-service';
import NumeracionService from '../../domain/services/numeracion-service';
import EspecialService from '../../domain/services/especial-service';
import VariableService from '../../domain/services/variable-service';
import CatastroService from '../../domain/services/catastro-service';
import ProcesadorPagoEPago from '../sdk/web-services/procesador-pago/procesador-pago-e-pago';
import ProcesadorPagoInterbanking from '../sdk/web-services/procesador-pago/procesador-pago-interbanking';
import ImportEPagos from '../../domain/services/process/importador/import-e-pagos';
import ImportInterbanking from '../../domain/services/process/importador/import-interbanking';

const container = createContainer({
  injectionMode: InjectionMode.CLASSIC
})

container.register({

  importadorController: asClass(ImportadorController),
  exportadorController: asClass(ExportadorController),

  messageRouter: asClass(MessageRouterRabbitMQ),
  publishService: asClass(PublishService),
  subscribeService: asClass(SubscribeService),
  queueMessageExecute: asClass(QueueMessageExecute),
  procesadorPagoEPago: asClass(ProcesadorPagoEPago),
  procesadorPagoInterbanking: asClass(ProcesadorPagoInterbanking),

  importadorService: asClass(ImportadorService),
  exportadorService: asClass(ExportadorService),
  importSUCERP: asClass(ImportSUCERP),
  importActasCausas: asClass(ImportActasCausas),
  importARBAVehiculo: asClass(ImportARBAVehiculo),
  importARBACatastro: asClass(ImportARBACatastro),
  importEPagos: asClass(ImportEPagos),
  importInterbanking: asClass(ImportInterbanking),
  exportSUCERP: asClass(ExportSUCERP),
  configuracionService: asClass(ConfiguracionService),
  perfilService: asClass(PerfilService),
  listaService: asClass(ListaService),
  cuentaService: asClass(CuentaService),
  vehiculoService: asClass(VehiculoService),
  tipoVehiculoService: asClass(TipoVehiculoService),
  incisoVehiculoService: asClass(IncisoVehiculoService),
  categoriaVehiculoService: asClass(CategoriaVehiculoService),
  categoriaTasaService: asClass(CategoriaTasaService),
  tipoCondicionEspecialService: asClass(TipoCondicionEspecialService),
  tipoMovimientoService: asClass(TipoMovimientoService),
  cuentaPagoService: asClass(CuentaPagoService),
  cuentaCorrienteItemService: asClass(CuentaCorrienteItemService),
  personaService: asClass(PersonaService),
  provinciaService: asClass(ProvinciaService),
  observacionService: asClass(ObservacionService),
  etiquetaService: asClass(EtiquetaService),
  tasaService: asClass(TasaService),
  subTasaService: asClass(SubTasaService),
  numeracionService: asClass(NumeracionService),
  especialService: asClass(EspecialService),
  variableService: asClass(VariableService),
  catastroService: asClass(CatastroService)
});

export default container;
