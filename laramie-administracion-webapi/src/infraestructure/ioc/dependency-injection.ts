import { InjectionMode, createContainer, asClass } from 'awilix';

import MessageRouterRabbitMQ from '../sdk/communication/message-router/message-router-rabbitmq';
import PublishService from '../../domain/services/publish-service';
import SubscribeService from '../../domain/services/subscribe-service';
import QueueMessageExecute from '../../domain/services/process/queue-message/queue-message-execute';

import ListaController from '../../server/controllers/lista-controller';
import EntidadController from '../../server/controllers/entidad-controller';
import ContactoController from '../../server/controllers/contacto-controller';
import DireccionController from '../../server/controllers/direccion-controller';
import DocumentoController from '../../server/controllers/documento-controller';
import InformacionAdicionalController from '../../server/controllers/informacion-adicional-controller';
import ArchivoController from '../../server/controllers/archivo-controller';
import ObservacionController from '../../server/controllers/observacion-controller';
import EtiquetaController from '../../server/controllers/etiqueta-controller'
import ExpedienteController from '../../server/controllers/expediente-controller';
import PersonaFisicaController from '../../server/controllers/persona-fisica-controller';
import PersonaJuridicaController from '../../server/controllers/persona-juridica-controller';
import MedioPagoController from '../../server/controllers/medio-pago-controller';
import CuentaContableController from '../../server/controllers/cuenta-contable-controller';
import JurisdiccionController from '../../server/controllers/jurisdiccion-controller';
import RecursoPorRubroController from '../../server/controllers/recurso-por-rubro-controller';

import PerfilService from '../../domain/services/perfil-service';
import ListaService from '../../domain/services/lista-service';
import EntidadService from '../../domain/services/entidad-service';
import ContactoService from '../../domain/services/contacto-service';
import DireccionService from '../../domain/services/direccion-service';
import DocumentoService from '../../domain/services/documento-service';
import InformacionAdicionalService from '../../domain/services/informacion-adicional-service';
import ArchivoService from '../../domain/services/archivo-service';
import ObservacionService from '../../domain/services/observacion-service';
import EtiquetaService from '../../domain/services/etiqueta-service';
import ExpedienteService from '../../domain/services/expediente-service';
import PersonaFisicaService from '../../domain/services/persona-fisica-service';
import PersonaJuridicaService from '../../domain/services/persona-juridica-service';
import MedioPagoService from '../../domain/services/medio-pago-service';
import CuentaContableService from '../../domain/services/cuenta-contable-service';
import JurisdiccionService from '../../domain/services/jurisdiccion-service';
import RecursoPorRubroService from '../../domain/services/recurso-por-rubro-service';

import ListaRepositorySequelize from '../data/repositories-sequelize/lista-repository';
import EntidadRepositorySequelize from '../data/repositories-sequelize/entidad-repository';
import EntidadDefinicionRepositorySequelize from '../data/repositories-sequelize/entidad-definicion-repository';
import ContactoRepositorySequelize from '../data/repositories-sequelize/contacto-repository';
import DireccionRepositorySequelize from '../data/repositories-sequelize/direccion-repository';
import DocumentoRepositorySequelize from '../data/repositories-sequelize/documento-repository';
import ArchivoRepositorySequelize from '../data/repositories-sequelize/archivo-repository';
import ObservacionRepositorySequelize from '../data/repositories-sequelize/observacion-repository';
import EtiquetaRepositorySequelize from '../data/repositories-sequelize/etiqueta-repository';
import ExpedienteRepositorySequelize from '../data/repositories-sequelize/expediente-repository';
import PersonaFisicaRepositorySequelize from '../data/repositories-sequelize/persona-fisica-repository';
import PersonaJuridicaRepositorySequelize from '../data/repositories-sequelize/persona-juridica-repository';
import MedioPagoRepositorySequelize from '../data/repositories-sequelize/medio-pago-repository';
import CuentaContableRepositorySequelize from '../data/repositories-sequelize/cuenta-contable-repository';
import JurisdiccionRepositorySequelize from '../data/repositories-sequelize/jurisdiccion-repository';
import RecursoPorRubroRepositorySequelize from '../data/repositories-sequelize/recurso-por-rubro-repository';

import PaisController from '../../server/controllers/pais-controller';
import ProvinciaController from '../../server/controllers/provincia-controller';
import LocalidadController from '../../server/controllers/localidad-controller';
import ZonaGeoreferenciaController from '../../server/controllers/zona-georeferencia-controller';
import TemaExpedienteController from '../../server/controllers/tema-expediente-controller';

import PaisService from '../../domain/services/pais-service';
import ProvinciaService from '../../domain/services/provincia-service';
import LocalidadService from '../../domain/services/localidad-service';
import ZonaGeoreferenciaService from '../../domain/services/zona-georeferencia-service';
import TemaExpedienteService from '../../domain/services/tema-expediente-service';

import PaisRepositorySequelize from '../data/repositories-sequelize/pais-repository';
import ProvinciaRepositorySequelize from '../data/repositories-sequelize/provincia-repository';
import LocalidadRepositorySequelize from '../data/repositories-sequelize/localidad-repository';
import ZonaGeoreferenciaRepositorySequelize from '../data/repositories-sequelize/zona-georeferencia-repository';
import TemaExpedienteRepositorySequelize from '../data/repositories-sequelize/tema-expediente-repository';


const container = createContainer({
  injectionMode: InjectionMode.CLASSIC
})

container.register({

  messageRouter: asClass(MessageRouterRabbitMQ),
  publishService: asClass(PublishService),
  subscribeService: asClass(SubscribeService),
  queueMessageExecute: asClass(QueueMessageExecute),

  listaController: asClass(ListaController),
  entidadController: asClass(EntidadController),
  contactoController: asClass(ContactoController),
  direccionController: asClass(DireccionController),
  documentoController: asClass(DocumentoController),
  informacionAdicionalController: asClass(InformacionAdicionalController),
  archivoController: asClass(ArchivoController),
  observacionController: asClass(ObservacionController),
  etiquetaController: asClass(EtiquetaController),
  expedienteController: asClass(ExpedienteController),
  personaFisicaController: asClass(PersonaFisicaController),
  personaJuridicaController: asClass(PersonaJuridicaController),
  medioPagoController: asClass(MedioPagoController),
  cuentaContableController: asClass(CuentaContableController),
  jurisdiccionController: asClass(JurisdiccionController),
  recursoPorRubroController: asClass(RecursoPorRubroController),

  paisController: asClass(PaisController),
  provinciaController: asClass(ProvinciaController),
  localidadController: asClass(LocalidadController),
  zonaGeoreferenciaController: asClass(ZonaGeoreferenciaController),
  temaExpedienteController: asClass(TemaExpedienteController),
  
  perfilService: asClass(PerfilService),  listaService: asClass(ListaService),
  entidadService: asClass(EntidadService),
  contactoService: asClass(ContactoService),
  direccionService: asClass(DireccionService),
  documentoService: asClass(DocumentoService),
  informacionAdicionalService: asClass(InformacionAdicionalService),
  archivoService: asClass(ArchivoService),
  observacionService: asClass(ObservacionService),
  etiquetaService: asClass(EtiquetaService),
  expedienteService: asClass(ExpedienteService),
  personaFisicaService: asClass(PersonaFisicaService),
  personaJuridicaService: asClass(PersonaJuridicaService),
  medioPagoService: asClass(MedioPagoService),
  cuentaContableService: asClass(CuentaContableService),
  jurisdiccionService: asClass(JurisdiccionService),
  recursoPorRubroService: asClass(RecursoPorRubroService),

  paisService: asClass(PaisService),
  provinciaService: asClass(ProvinciaService),
  localidadService: asClass(LocalidadService),
  zonaGeoreferenciaService: asClass(ZonaGeoreferenciaService),
  temaExpedienteService: asClass(TemaExpedienteService),
  
  listaRepository: asClass(ListaRepositorySequelize),
  entidadRepository: asClass(EntidadRepositorySequelize),
  entidadDefinicionRepository: asClass(EntidadDefinicionRepositorySequelize),
  contactoRepository: asClass(ContactoRepositorySequelize),
  direccionRepository: asClass(DireccionRepositorySequelize),
  documentoRepository: asClass(DocumentoRepositorySequelize),
  archivoRepository: asClass(ArchivoRepositorySequelize),
  observacionRepository: asClass(ObservacionRepositorySequelize),
  etiquetaRepository: asClass(EtiquetaRepositorySequelize),
  expedienteRepository: asClass(ExpedienteRepositorySequelize),
  personaFisicaRepository: asClass(PersonaFisicaRepositorySequelize),
  personaJuridicaRepository: asClass(PersonaJuridicaRepositorySequelize),
  medioPagoRepository: asClass(MedioPagoRepositorySequelize),
  cuentaContableRepository: asClass(CuentaContableRepositorySequelize),
  jurisdiccionRepository: asClass(JurisdiccionRepositorySequelize),
  recursoPorRubroRepository: asClass(RecursoPorRubroRepositorySequelize),

  paisRepository: asClass(PaisRepositorySequelize),
  provinciaRepository: asClass(ProvinciaRepositorySequelize),
  localidadRepository: asClass(LocalidadRepositorySequelize),
  zonaGeoreferenciaRepository: asClass(ZonaGeoreferenciaRepositorySequelize),
  temaExpedienteRepository: asClass(TemaExpedienteRepositorySequelize),
  
});

export default container;
