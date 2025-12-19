import { InjectionMode, createContainer, asClass } from 'awilix';

import FileController from '../../server/controllers/file-controller';
import ListaController from '../../server/controllers/lista-controller';
import EntidadController from '../../server/controllers/entidad-controller';
import ContactoController from '../../server/controllers/contacto-controller';
import DireccionController from '../../server/controllers/direccion-controller';
import DocumentoController from '../../server/controllers/documento-controller';
import InformacionAdicionalController from '../../server/controllers/informacion-adicional-controller';
import ArchivoController from '../../server/controllers/archivo-controller';
import ObservacionController from '../../server/controllers/observacion-controller';
import EtiquetaController from '../../server/controllers/etiqueta-controller';
import ExpedienteController from '../../server/controllers/expediente-controller';
import PersonaFisicaController from '../../server/controllers/persona-fisica-controller';
import PersonaJuridicaController from '../../server/controllers/persona-juridica-controller';
import MedioPagoController from '../../server/controllers/medio-pago-controller';
import PermisoController from '../../server/controllers/permiso-controller';

import SesionService from '../../domain/services/sesion-service';
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
import PermisoService from '../../domain/services/permiso-service';


const container = createContainer({
  injectionMode: InjectionMode.CLASSIC
})

container.register({

  fileController: asClass(FileController),
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
  permisoController: asClass(PermisoController),

  sesionService: asClass(SesionService),
  listaService: asClass(ListaService),
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
  permisoService: asClass(PermisoService)
  
});

export default container;