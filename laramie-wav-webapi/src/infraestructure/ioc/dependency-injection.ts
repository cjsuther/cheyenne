import { InjectionMode, createContainer, asClass } from "awilix";

import MessageRouterRabbitMQ from "../sdk/communication/message-router/message-router-rabbitmq";
import PublishService from "../../domain/services/publish-service";
import SubscribeService from "../../domain/services/subscribe-service";
import QueueMessageExecute from "../../domain/services/process/queue-message/queue-message-execute";

import LoginController from "../../server/controllers/login-controller";
import ListaController from "../../server/controllers/lista-controller";
import ComunicacionService from "../../domain/services/comunicacion-service";
import CuentaController from "../../server/controllers/cuenta-controller";
import ContribuyenteController from "../../server/controllers/contribuyente-controller";
import PasarelaPagoMercadoPagoController from "../../server/controllers/pasarela-pago-mp-controller";
import PasarelaPagoClickPagoController from "../../server/controllers/pasarela-pago-cp-controller";
import PasarelaPagoController from "../../server/controllers/pasarela-pago-controller";
import PasarelaPagoEPagoController from "../../server/controllers/pasarela-pago-ep-controller";
import ComunicacionController from "../../server/controllers/comunicacion-controller";

import LoginService from "../../domain/services/login-service";
import SesionService from "../../domain/services/sesion-service";
import ListaService from "../../domain/services/lista-service";
import TasaService from "../../domain/services/tasa-service";
import CuentaService from "../../domain/services/cuenta-service";
import ComercioService from "../../domain/services/comercio-service";
import CryptoService from "../../domain/services/crypto-service";
import CuentaCorrienteItemService from "../../domain/services/cuenta-corriente-item-service";
import CuentaPagoService from "../../domain/services/cuenta-pago-service";
import PlanPagoDefinicionService from "../../domain/services/plan-pago-definicion-service";
import PagoContadoDefinicionService from "../../domain/services/pago-contado-definicion-service";
import PlanPagoService from "../../domain/services/plan-pago-service";
import PagoContadoService from "../../domain/services/pago-contado-service";
import ReporteService from "../../domain/services/reporte-service";
import DeclaracionJuradaService from "../../domain/services/declaracion-jurada-service";
import RetencionService from "../../domain/services/retencion-service";
import PersonaService from "../../domain/services/persona-service";
import ConfiguracionService from "../../domain/services/configuracion-service";
import PasarelaPagoClickPagoService from "../../domain/services/pasarela-pago-cp-service";
import PasarelaPagoMercadoPagoService from "../../domain/services/pasarela-pago-mp-service";
import PasarelaPagoService from "../../domain/services/pasarela-pago-service";
import PasarelaPagoEPagoService from "../../domain/services/pasarela-pago-ep-service";

import ProcesadorPagoMercadoPago from "../../domain/services/procesador-pago/procesador-pago-mercado-pago";
import ProcesadorPagoClickPago from "../../domain/services/procesador-pago/procesador-pago-click-pago";
import ProcesadorPagoEPago from "../../domain/services/procesador-pago/procesador-pago-e-pago";
import ProcesadorPagoInterbanking from "../../domain/services/procesador-pago/procesador-pago-interbanking";

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
  comunicacionController: asClass(ComunicacionController),
  cuentaController: asClass(CuentaController),
  contribuyenteController: asClass(ContribuyenteController),
  pasarelaPagoClickPagoController: asClass(PasarelaPagoClickPagoController),
  pasarelaPagoMercadoPagoController: asClass(PasarelaPagoMercadoPagoController),
  pasarelaPagoEPagoController: asClass(PasarelaPagoEPagoController),
  pasarelaPagoController: asClass(PasarelaPagoController),

  loginService: asClass(LoginService),
  sesionService: asClass(SesionService),
  listaService: asClass(ListaService),
  tasaService: asClass(TasaService),
  comunicacionService: asClass(ComunicacionService),
  cuentaService: asClass(CuentaService),
  cuentaCorrienteItemService: asClass(CuentaCorrienteItemService),
  cuentaPagoService: asClass(CuentaPagoService),
  comercioService: asClass(ComercioService),
  cryptoService: asClass(CryptoService),
  planPagoDefinicionService: asClass(PlanPagoDefinicionService),
  pagoContadoDefinicionService: asClass(PagoContadoDefinicionService),
  planPagoService: asClass(PlanPagoService),
  pagoContadoService: asClass(PagoContadoService),
  reporteService: asClass(ReporteService),
  declaracionJuradaService: asClass(DeclaracionJuradaService),
  retencionService: asClass(RetencionService),
  personaService: asClass(PersonaService),
  configuracionService: asClass(ConfiguracionService),
  pasarelaPagoService: asClass(PasarelaPagoService),
  mercadoPagoService: asClass(PasarelaPagoMercadoPagoService),
  clickPagoService: asClass(PasarelaPagoClickPagoService),
  ePagoService: asClass(PasarelaPagoEPagoService),
  
  procesadorPagoMercadoPago: asClass(ProcesadorPagoMercadoPago),
  procesadorPagoClickPago: asClass(ProcesadorPagoClickPago),
  procesadorPagoEPago: asClass(ProcesadorPagoEPago),
  procesadorPagoInterbanking: asClass(ProcesadorPagoInterbanking),
});

export default container;
