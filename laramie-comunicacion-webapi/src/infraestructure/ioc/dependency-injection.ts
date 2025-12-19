import { InjectionMode, createContainer, asClass } from 'awilix';

import MessageRouterRabbitMQ from '../sdk/communication/message-router/message-router-rabbitmq';
import PublishService from '../../domain/services/publish-service';
import SubscribeService from '../../domain/services/subscribe-service';
import QueueMessageExecute from '../../domain/services/process/queue-message/queue-message-execute';

import MensajeRepositorySequelize from '../data/repositories-sequelize/mensaje-repository';
import ListaRepositorySequelize from '../data/repositories-sequelize/lista-repository';

import MensajeService from '../../domain/services/mensaje-service';
import ListaService from '../../domain/services/lista-service';

import MensajeController from '../../server/controllers/mensaje-controller';
import ListaController from '../../server/controllers/lista-controller';

const container = createContainer({
  injectionMode: InjectionMode.CLASSIC
})

container.register({
  messageRouter: asClass(MessageRouterRabbitMQ),
  publishService: asClass(PublishService),
  subscribeService: asClass(SubscribeService),
  queueMessageExecute: asClass(QueueMessageExecute),

  mensajeRepository: asClass(MensajeRepositorySequelize),
  listaRepository: asClass(ListaRepositorySequelize),

  mensajeService: asClass(MensajeService),
  listaService: asClass(ListaService),

  mensajeController: asClass(MensajeController),
  listaController: asClass(ListaController),
});

export default container;
