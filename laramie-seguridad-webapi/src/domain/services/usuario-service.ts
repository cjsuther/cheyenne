import { v4 as uuidv4 } from 'uuid'

import Usuario from '../entities/usuario';
import IUsuarioRepository from '../repositories/usuario-repository';
import IPerfilRepository from '../repositories/perfil-repository';
import AccesoService from './acceso-service';
import { isValidString, isValidInteger, isValidEmail, isValidArray } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';
import Acceso from '../entities/acceso';
import VerificacionService from './verificacion-service';
import Verificacion from '../entities/verificacion';
import config from '../../server/configuration/config';
import { DecryptRSA } from '../../infraestructure/sdk/utils/cryptograph';
import PublishService from './publish-service';
import UsuarioDTO from '../dto/usuario-dto';
import Perfil from '../entities/perfil';


export default class UsuarioService {

    usuarioRepository: IUsuarioRepository;
    perfilRepository: IPerfilRepository;
    accesoService: AccesoService;
    verificacionService: VerificacionService;
    publishService: PublishService;

    constructor(usuarioRepository: IUsuarioRepository,
                perfilRepository: IPerfilRepository,
                accesoService: AccesoService,
                verificacionService: VerificacionService,
                publishService: PublishService,
    ) {
        this.usuarioRepository = usuarioRepository;
        this.perfilRepository = perfilRepository;
        this.accesoService = accesoService;
        this.verificacionService = verificacionService;
        this.publishService = publishService;
    }

    async list() {
        return new Promise( async (resolve, reject) => {
            try {
                const result = await this.usuarioRepository.list();
                resolve(result);
            }
            catch(error) {
                reject(new ProcessError('Error procesando datos', error));
            }
        });
    }

    async findById(id: number) {
        return new Promise( async (resolve, reject) => {
            try {               
                const result = await this.usuarioRepository.findById(id);
                if (!result) {
                    reject(new ReferenceError('No existe el registro'));
                    return;
                }
                resolve(result);
            }
            catch(error) {
                reject(new ProcessError('Error procesando datos', error));
            }
        });
    }

    async findByLogin(username: string, password: string) {
        return new Promise (async (resolve, reject) => {
            try {
                const tipoAcceso = 20; // 20 = Usuario registrado, luego se realizarán otros métodos de autenticación.

                const acceso = await this.accesoService.findByLogin(username.toLowerCase(), password, tipoAcceso) as Acceso;
                if (!acceso) {
                    reject(new ReferenceError('No existe el registro'));
                    return;
                }
                
                const usuario = await this.usuarioRepository.findById(acceso.idUsuario) as Usuario;
                if (usuario.idEstadoUsuario != 10) {
                    reject(new ValidationError('El usuario no está activo'));
                    return;
                }
                const perfiles = (await this.perfilRepository.listByUsuario(usuario.id) as Array<Perfil>).map(x => x.id);
                
                const usuarioDTO = new UsuarioDTO(usuario, perfiles);
                resolve(usuarioDTO);
                
            }
            catch (error) {
                if (error instanceof ValidationError ||
                    error instanceof ProcessError ||
                    error instanceof ReferenceError) {
                    reject(error);
                }
                else {
                    reject(new ProcessError('Error procesando datos', error));
                }
            }
        });
    }

    async getChangePassword(login: string) {
        return new Promise( async (resolve, reject) => {
            try {               
                const user = await this.usuarioRepository.findByLogin(login) as Usuario
                if (user === null)
                    reject(new ValidationError('No existe el usuario'))
    
                const token = uuidv4()
                const verificacion = new Verificacion(
                    null,
                    60,
                    50,
                    user.id,
                    user.codigo,
                    new Date(),
                    new Date((new Date()).getTime() + config.SESION_TIME),
                    token,
                    '',
                )

                const result = await this.verificacionService.add(verificacion)

                this.publishService.sendMessage(
                    "major-laramie-seguridad-webapi/usuario-service/getChangePassword",
                    "AddMensaje",
                    user.id.toString(),
                    {
                        idCanal: 20,
                        idPrioridad: 31,
                        identificador: user.email,
                        titulo: 'Cambio de Contraseña',
                        cuerpo: `
                            <div>
                                <head>
                                    <meta charset="UTF-8">
                                    <title>Cambio de Contraseña</title>
                                </head>
                                <body>
                                    <h1>Cambio de Contraseña</h1>
                                    <p>Para cambiar su contraseña, haga click en el siguiente link: <a href="${config.DOMAIN_WEB}/change-password/${token}">Cambiar Contraseña</a></p>
                                </body>
                            </div>                
                        `
                    }
                ).then(response => {
                    resolve(result)
                })
                .catch(reject);
            }
            catch(error) {
                reject(new ProcessError('Error procesando datos', error));
            }
        });
    }

    async putChangePassword(passwordToken: string, password: string) {
        return new Promise(async (resolve, reject) => {
            try {
                const verificacion = await this.verificacionService.verifyPasswordToken(passwordToken) as Verificacion

                const user = await this.usuarioRepository.findById(verificacion.idUsuario)

                const acceso = await this.accesoService.findByIdentificador(user.codigo) as Acceso
                await this.accesoService.modify(acceso.id, { ...acceso, password: DecryptRSA(password) })

                const updatedVerificacion = await this.verificacionService.modify(verificacion.id, { ...verificacion, idEstadoVerificacion: 51 })
                resolve(updatedVerificacion)
            }
            catch (error) {
                if (error.name === 'ValidationError' || error.name === 'ReferenceError')
                    reject(error)
                else reject(new ProcessError('Error procesando datos', error))
            }
        })
    }

    async add(usuario: Usuario, password: string) {
        return new Promise( async (resolve, reject) => {
            try {
                if (!isValidInteger(usuario.idTipoUsuario, true) ||
                    !isValidInteger(usuario.idEstadoUsuario, true) ||
                    !isValidString(usuario.codigo, true) ||
                    !isValidString(usuario.nombreApellido, true) ||
                    !isValidEmail(usuario.email)
                ) {
                    reject(new ValidationError('Existen campos incompletos'));
                    return;
                }

                usuario.id = null;
                usuario.idPersona = null;
                usuario.fechaAlta = new Date();
                usuario.fechaBaja = null;
                const result = await this.usuarioRepository.add(usuario);
                
                let acceso = new Acceso();
                acceso.id = null;
                acceso.idTipoAcceso = 20;
                acceso.idUsuario = result.id;
                acceso.identificador = result.codigo;
                acceso.password = password;

                await this.accesoService.add(acceso);
                
                resolve(result);
            }
            catch(error) {
                reject(new ProcessError('Error procesando datos', error));
            }
        });
    }

    async modify(id: number, usuario: Usuario, password: string) {
        return new Promise( async (resolve, reject) => {
            try {
                if (!isValidInteger(usuario.idTipoUsuario, true) ||
                    !isValidInteger(usuario.idEstadoUsuario, true) ||
                    !isValidString(usuario.codigo, true) ||
                    !isValidString(usuario.nombreApellido, true) ||
                    !isValidEmail(usuario.email)
                ) {
                    reject(new ValidationError('Existen campos incompletos'));
                    return;
                }

                usuario.idPersona = null;
                usuario.fechaBaja = (usuario.idEstadoUsuario == 11) ? new Date() : null; //11:Inactivo
                const result = await this.usuarioRepository.modify(id, usuario);
                if (!result) {
                    reject(new ReferenceError('No existe el registro'));
                    return;
                }

                if (password.length > 0) {
                    let acceso = await this.accesoService.findByIdentificador(usuario.codigo) as Acceso;
                    acceso.password = password;
                    await this.accesoService.modify(acceso.id, acceso);
                }

                resolve(result);
            }
            catch(error) {
                reject(new ProcessError('Error procesando datos', error));
            }
        });
    }

    async remove(id: number) {
        return new Promise( async (resolve, reject) => {
            try {
                const result = await this.usuarioRepository.remove(id);
                if (!result) {
                    reject(new ReferenceError('No existe el registro'));
                    return;
                }
                resolve(result);
            }
            catch(error) {
                reject(new ProcessError('Error procesando datos', error));
            }
        });
    }
    

    async bindPerfiles(id:number, perfiles:number[]) {
        return new Promise( async (resolve, reject) => {
            try {
                if (!isValidArray(perfiles, true)) {
                    reject(new ValidationError('Existen campos incompletos'));
                    return;
                }

                const result = await this.usuarioRepository.bindPerfiles(id, perfiles);
                resolve(result);
            }
            catch(error) {
                reject(new ProcessError('Error procesando datos', error));
            }
        });
    }

    async unbindPerfiles(id:number, perfiles:number[]) {
        return new Promise( async (resolve, reject) => {
            try {
                if (!isValidArray(perfiles, true)) {
                    reject(new ValidationError('Existen campos incompletos'));
                    return;
                }

                const result = await this.usuarioRepository.unbindPerfiles(id, perfiles);
                resolve(result);
            }
            catch(error) {
                reject(new ProcessError('Error procesando datos', error));
            }
        });
    }

    async findByIds(ids:number[]) {
        return new Promise( async (resolve, reject) => {
            try {
                if (!isValidArray(ids, true)) {
                    reject(new ValidationError('Existen campos incompletos'));
                    return;
                }

                const result = await this.usuarioRepository.findByIds(ids);
                resolve(result);
            }
            catch(error) {
                reject(new ProcessError('Error procesando datos', error));
            }
        });
    }

}
