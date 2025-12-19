import { InjectionMode, createContainer, asClass } from 'awilix';

import MessageRouterRabbitMQ from '../sdk/communication/message-router/message-router-rabbitmq';
import PublishService from '../../domain/services/publish-service';
import SubscribeService from '../../domain/services/subscribe-service';
import QueueMessageExecute from '../../domain/services/process/queue-message/queue-message-execute';

import ListaRepositorySequelize from '../data/repositories-sequelize/lista-repository';
import UsuarioRepositorySequelize from '../data/repositories-sequelize/usuario-repository';
import PerfilRepositorySequelize from '../data/repositories-sequelize/perfil-repository';
import PermisoRepositorySequelize from '../data/repositories-sequelize/permiso-repository';
import AccesoRepositorySequelize from '../data/repositories-sequelize/acceso-repository';
import SesionRepositorySequelize from '../data/repositories-sequelize/sesion-repository';
import VerificacionRepositorySequelize from '../data/repositories-sequelize/verificacion-repository';

import ListaService from '../../domain/services/lista-service';
import UsuarioService from '../../domain/services/usuario-service';
import PerfilService from '../../domain/services/perfil-service';
import PermisoService from '../../domain/services/permiso-service';
import AccesoService from '../../domain/services/acceso-service';
import SesionService from '../../domain/services/sesion-service';
import VerificacionService from '../../domain/services/verificacion-service';

import ListaController from '../../server/controllers/lista-controller';
import UsuarioController from '../../server/controllers/usuario-controller';
import PerfilController from '../../server/controllers/perfil-controller';
import PermisoController from '../../server/controllers/permiso-controller';
import AccesoController from '../../server/controllers/acceso-controller';
import SesionController from '../../server/controllers/sesion-controller';
import VerificacionController from '../../server/controllers/verificacion-controller';

const container = createContainer({
  injectionMode: InjectionMode.CLASSIC
})

container.register({

  messageRouter: asClass(MessageRouterRabbitMQ),
  publishService: asClass(PublishService),
  subscribeService: asClass(SubscribeService),
  queueMessageExecute: asClass(QueueMessageExecute),

  listaRepository: asClass(ListaRepositorySequelize),
  usuarioRepository: asClass(UsuarioRepositorySequelize),
  perfilRepository: asClass(PerfilRepositorySequelize),
  permisoRepository: asClass(PermisoRepositorySequelize),
  accesoRepository: asClass(AccesoRepositorySequelize),
  sesionRepository: asClass(SesionRepositorySequelize),
  verificacionRepository: asClass(VerificacionRepositorySequelize),
  
  listaService: asClass(ListaService),
  usuarioService: asClass(UsuarioService),
  perfilService: asClass(PerfilService),
  permisoService: asClass(PermisoService),
  accesoService: asClass(AccesoService),
  sesionService: asClass(SesionService),
  verificacionService: asClass(VerificacionService),
  
  listaController: asClass(ListaController),
  usuarioController: asClass(UsuarioController),
  perfilController: asClass(PerfilController),
  permisoController: asClass(PermisoController),
  accesoController: asClass(AccesoController),
  sesionController: asClass(SesionController),
  verificacionController: asClass(VerificacionController),

});

export default container;
