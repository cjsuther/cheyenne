import { InjectionMode, createContainer, asClass } from 'awilix';

import FileController from '../../server/controllers/file-controller';
import ReporteController from '../../server/controllers/reporte-controller';
import ImportadorController from '../../server/controllers/importador-controller';
import ListaController from '../../server/controllers/lista-controller';
import EntidadController from '../../server/controllers/entidad-controller';
import InformacionAdicionalController from '../../server/controllers/informacion-adicional-controller';
import ArchivoController from '../../server/controllers/archivo-controller';
import ObservacionController from '../../server/controllers/observacion-controller';
import EtiquetaController from '../../server/controllers/etiqueta-controller';
import PermisoController from '../../server/controllers/permiso-controller';
import UsuarioController from '../../server/controllers/usuario-controller';
import ReciboPublicacionLoteController from '../../server/controllers/recibo-publicacion-lote-controller';
import CajaController from '../../server/controllers/caja-controller';
import RecaudacionLoteController from '../../server/controllers/recaudacion-lote-controller';
import PagoRendicionLoteController from '../../server/controllers/pago-rendicion-lote-controller';
import RegistroContableLoteController from '../../server/controllers/registro-contable-lote-controller';

import SesionService from '../../domain/services/sesion-service';
import ReporteService from  '../../domain/services/reporte-service';
import ImportadorService from '../../domain/services/importador-service';
import ListaService from '../../domain/services/lista-service';
import EntidadService from '../../domain/services/entidad-service';
import InformacionAdicionalService from '../../domain/services/informacion-adicional-service';
import ArchivoService from '../../domain/services/archivo-service';
import ObservacionService from '../../domain/services/observacion-service';
import EtiquetaService from '../../domain/services/etiqueta-service';
import PermisoService from '../../domain/services/permiso-service';
import UsuarioService from '../../domain/services/usuario-service';
import ReciboPublicacionLoteService from '../../domain/services/recibo-publicacion-lote-service';
import CajaService from '../../domain/services/caja-service';
import RecaudacionLoteService from '../../domain/services/recaudacion-lote-service';
import PagoRendicionLoteService from '../../domain/services/pago-rendicion-lote-service';
import RegistroContableLoteService from '../../domain/services/registro-contable-lote-service';

const container = createContainer({
  injectionMode: InjectionMode.CLASSIC
})

container.register({

  fileController: asClass(FileController),
  reporteController: asClass(ReporteController),
  importadorController: asClass(ImportadorController),
  listaController: asClass(ListaController),
  entidadController: asClass(EntidadController),
  informacionAdicionalController: asClass(InformacionAdicionalController),
  archivoController: asClass(ArchivoController),
  observacionController: asClass(ObservacionController),
  etiquetaController: asClass(EtiquetaController),
  permisoController: asClass(PermisoController),
  usuarioController: asClass(UsuarioController),
  reciboPublicacionLoteController: asClass(ReciboPublicacionLoteController),
  cajaController: asClass(CajaController),
  recaudacionLoteController: asClass(RecaudacionLoteController),
  pagoRendicionLoteController: asClass(PagoRendicionLoteController),
  registroContableLoteController: asClass(RegistroContableLoteController),

  sesionService: asClass(SesionService),
  reporteService: asClass(ReporteService),
  importadorService: asClass(ImportadorService),
  listaService: asClass(ListaService),
  entidadService: asClass(EntidadService),
  informacionAdicionalService: asClass(InformacionAdicionalService),
  archivoService: asClass(ArchivoService),
  observacionService: asClass(ObservacionService),
  etiquetaService: asClass(EtiquetaService),
  permisoService: asClass(PermisoService),
  usuarioService: asClass(UsuarioService),
  reciboPublicacionLoteService: asClass(ReciboPublicacionLoteService),
  cajaService: asClass(CajaService),
  recaudacionLoteService: asClass(RecaudacionLoteService),
  pagoRendicionLoteService: asClass(PagoRendicionLoteService),
  registroContableLoteService: asClass(RegistroContableLoteService),
});

export default container;