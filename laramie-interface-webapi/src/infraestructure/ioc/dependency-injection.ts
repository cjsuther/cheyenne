import { InjectionMode, createContainer, asClass } from "awilix";

import MessageRouterRabbitMQ from "../sdk/communication/message-router/message-router-rabbitmq";
import PublishService from "../../domain/services/publish-service";
import SubscribeService from "../../domain/services/subscribe-service";
import QueueMessageExecute from "../../domain/services/process/queue-message/queue-message-execute";

import LoginController from "../../server/controllers/login-controller";
import ListaController from "../../server/controllers/lista-controller";
import VolqueteController from "../../server/controllers/volquete-controller";
import ObraController from "../../server/controllers/obra-controller";
import LicenciaController from "../../server/controllers/licencia-controller";
import TasaController from "../../server/controllers/tasa-controller";
import CausaController from "../../server/controllers/causa-controller";

import CryptoService from "../../domain/services/crypto-service";
import PerfilService from "../../domain/services/perfil-service";
import SesionService from "../../domain/services/sesion-service";
import ReporteService from "../../domain/services/reporte-service";
import LoginService from "../../domain/services/login-service";
import ListaService from "../../domain/services/lista-service";
import PersonaService from "../../domain/services/persona-service";
import SolicitudService from "../../domain/services/solicitud-service";
import VolqueteService from "../../domain/services/volquete-service";
import ObraService from "../../domain/services/obra-service";
import LicenciaService from "../../domain/services/licencia-service";
import TasaService from "../../domain/services/tasa-service";
import CausaService from "../../domain/services/causa-service";
import ConfiguracionService from "../../domain/services/configuracion-service";
import CuentaPagoService from "../../domain/services/cuenta-pago-service";
import BoletaController from "../../server/controllers/boleta-controller";

const container = createContainer({
  injectionMode: InjectionMode.CLASSIC,
});

container.register({
  messageRouter: asClass(MessageRouterRabbitMQ),
  publishService: asClass(PublishService),
  subscribeService: asClass(SubscribeService),
  queueMessageExecute: asClass(QueueMessageExecute),

  loginController: asClass(LoginController),
  listaController: asClass(ListaController),
  volqueteController: asClass(VolqueteController),
  obraController: asClass(ObraController),
  licenciaController: asClass(LicenciaController),
  tasaController: asClass(TasaController),
  causaController: asClass(CausaController),
  boletaController: asClass(BoletaController),

  configuracionService: asClass(ConfiguracionService),
  cryptoService: asClass(CryptoService),
  perfilService: asClass(PerfilService),
  reporteService: asClass(ReporteService),
  loginService: asClass(LoginService),
  sesionService: asClass(SesionService),
  listaService: asClass(ListaService),
  personaService: asClass(PersonaService),
  solicitudService: asClass(SolicitudService),
  volqueteService: asClass(VolqueteService),
  obraService: asClass(ObraService),
  licenciaService: asClass(LicenciaService),
  tasaService: asClass(TasaService),
  cuentaPagoService: asClass(CuentaPagoService),
  causaService: asClass(CausaService)
});

export default container;
