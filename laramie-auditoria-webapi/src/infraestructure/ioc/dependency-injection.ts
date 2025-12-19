import { InjectionMode, createContainer, asClass } from 'awilix';

import MessageRouterRabbitMQ from '../sdk/communication/message-router/message-router-rabbitmq';
import PublishService from '../../domain/services/publish-service';
import SubscribeService from '../../domain/services/subscribe-service';
import QueueMessageExecute from '../../domain/services/process/queue-message/queue-message-execute';

import ListaRepositoryMongo from '../data/repositories-mongo/lista-repository';
import IncidenciaRepositoryMongo from '../data/repositories-mongo/incidencia-repository';

import ListaService from '../../domain/services/lista-service';
import IncidenciaService from '../../domain/services/incidencia-service';

import ListaController from '../../server/controllers/lista-controller';
import IncidenciaController from '../../server/controllers/incidencia-controller';

const container = createContainer({
  injectionMode: InjectionMode.CLASSIC
})

container.register({

  messageRouter: asClass(MessageRouterRabbitMQ),
  publishService: asClass(PublishService),
  subscribeService: asClass(SubscribeService),
  queueMessageExecute: asClass(QueueMessageExecute),

  listaRepository: asClass(ListaRepositoryMongo),
  incidenciaRepository: asClass(IncidenciaRepositoryMongo),
  
  listaService: asClass(ListaService),
  incidenciaService: asClass(IncidenciaService),
  
  listaController: asClass(ListaController),
  incidenciaController: asClass(IncidenciaController),


});

export default container;
