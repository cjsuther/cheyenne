import { InjectionMode, createContainer, asClass } from 'awilix';

import ListaService from '../../domain/services/lista-service';
import UsuarioService from '../../domain/services/usuario-service';
import PerfilService from '../../domain/services/perfil-service';
import PermisoService from '../../domain/services/permiso-service';
import AccesoService from '../../domain/services/acceso-service';
import LoginService from '../../domain/services/login-service';
import SesionService from '../../domain/services/sesion-service';
import VerificacionService from '../../domain/services/verificacion-service';

import LoginController from '../../server/controllers/login-controller';
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

  loginService: asClass(LoginService),
  listaService: asClass(ListaService),
  usuarioService: asClass(UsuarioService),
  perfilService: asClass(PerfilService),
  permisoService: asClass(PermisoService),
  accesoService: asClass(AccesoService),
  sesionService: asClass(SesionService),
  verificacionService: asClass(VerificacionService),

  loginController: asClass(LoginController),
  listaController: asClass(ListaController),
  usuarioController: asClass(UsuarioController),
  perfilController: asClass(PerfilController),
  permisoController: asClass(PermisoController),
  accesoController: asClass(AccesoController),
  sesionController: asClass(SesionController),
  verificacionController: asClass(VerificacionController),
});

export default container;




  
