import { InjectionMode, createContainer, asClass } from 'awilix';

import MessageRouterRabbitMQ from '../sdk/communication/message-router/message-router-rabbitmq';
import PublishService from '../../domain/services/publish-service';
import SubscribeService from '../../domain/services/subscribe-service';
import QueueMessageExecute from '../../domain/services/process/queue-message/queue-message-execute';

import PagoRendicionLoteRepositoryMongo from '../data/repositories-mongo/pago-rendicion-lote-repository';
import ReciboPublicacionLoteRepositoryMongo from '../data/repositories-mongo/recibo-publicacion-lote-repository';

import ReciboPublicacionService from '../../domain/services/recibo-publicacion-service';
import ReciboPublicacionLoteService from '../../domain/services/recibo-publicacion-lote-service';
import PagoRendicionService from '../../domain/services/pago-rendicion-service';
import PagoRendicionLoteService from '../../domain/services/pago-rendicion-lote-service';

import ReciboPublicacionController from '../../server/controllers/recibo-publicacion-controller';
import PagoRendicionController from '../../server/controllers/pago-rendicion-controller';
import PerfilService from '../../domain/services/perfil-service';
import UsuarioService from '../../domain/services/usuario-service';


const container = createContainer({
  injectionMode: InjectionMode.CLASSIC
})

container.register({

  messageRouter: asClass(MessageRouterRabbitMQ),
  publishService: asClass(PublishService),
  subscribeService: asClass(SubscribeService),
  queueMessageExecute: asClass(QueueMessageExecute),

  reciboPublicacionLoteRepository: asClass(ReciboPublicacionLoteRepositoryMongo),
  pagoRendicionLoteRepository: asClass(PagoRendicionLoteRepositoryMongo),

  reciboPublicacionService: asClass(ReciboPublicacionService),
  reciboPublicacionLoteService: asClass(ReciboPublicacionLoteService),
  pagoRendicionService: asClass(PagoRendicionService),
  pagoRendicionLoteService: asClass(PagoRendicionLoteService),
  perfilService: asClass(PerfilService),
  usuarioService: asClass(UsuarioService),
  
  reciboPublicacionController: asClass(ReciboPublicacionController),
  pagoRendicionController: asClass(PagoRendicionController),

});

export default container;
