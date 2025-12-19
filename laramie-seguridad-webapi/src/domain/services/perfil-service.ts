import Perfil from '../entities/perfil';
import PerfilDto from '../dto/perfil-dto';
import IPerfilRepository from '../repositories/perfil-repository';
import IPermisoRepository from '../repositories/permiso-repository';
import { isValidString, isValidArray } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';
import Permiso from '../entities/permiso';
import PerfilPermiso from '../dto/perfil-permiso';


export default class PerfilService {

    perfilRepository: IPerfilRepository;
    permisoRepository: IPermisoRepository;

    constructor(perfilRepository: IPerfilRepository, permisoRepository: IPermisoRepository) {
        this.perfilRepository = perfilRepository;
        this.permisoRepository = permisoRepository;
    }

    async list() {
        return new Promise( async (resolve, reject) => {
            try {
                const result = await this.perfilRepository.list();
                resolve(result);
            }
            catch(error) {
                reject(new ProcessError('Error procesando datos', error));
            }
        });
    }

    async listPermisos() {
        return new Promise( async (resolve, reject) => {
            try {
                let result: Array<PerfilPermiso> = [];
                const perfiles = await this.perfilRepository.list() as Array<Perfil>;
                for (let i=0; i < perfiles.length; i++) {
                    const permisos = await this.permisoRepository.listByPerfil(perfiles[i].id) as Array<Permiso>;
                    const perfilPermiso = new PerfilPermiso(perfiles[i], permisos);
                    result.push(perfilPermiso);
                }

                resolve(result);
            }
            catch(error) {
                reject(new ProcessError('Error procesando datos', error));
            }
        });
    }

    async listByUsuario(idUsuario:number) {
        return new Promise( async (resolve, reject) => {
            try {
                const perfiles = await this.perfilRepository.list() as Perfil[];
                const perfilesUsuario = await this.perfilRepository.listByUsuario(idUsuario) as Perfil[];

                const result = perfiles.map(perfil => {
                    const selected = perfilesUsuario.some(perfilUsuario => perfilUsuario.id == perfil.id);
                    return new PerfilDto(perfil, selected);
                });

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
                const result = await this.perfilRepository.findById(id);
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

    async add(perfil: Perfil) {
        return new Promise( async (resolve, reject) => {
            try {
                if (!isValidString(perfil.codigo, true) ||
                    !isValidString(perfil.nombre, true)
                ) {
                    reject(new ValidationError('Existen campos incompletos'));
                    return;
                }

                perfil.id = null;
                const result = await this.perfilRepository.add(perfil);
                resolve(result);
            }
            catch(error) {
                reject(new ProcessError('Error procesando datos', error));
            }
        });
    }

    async modify(id: number, perfil: Perfil) {
        return new Promise( async (resolve, reject) => {
            try {
                if (!isValidString(perfil.codigo, true) ||
                    !isValidString(perfil.nombre, true)
                ) {
                    reject(new ValidationError('Existen campos incompletos'));
                    return;
                }

                const result = await this.perfilRepository.modify(id, perfil);
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

    async remove(id: number) {
        return new Promise( async (resolve, reject) => {
            try {
                const result = await this.perfilRepository.remove(id);
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


    async bindPermisos(id:number, permisos:number[]) {
        return new Promise( async (resolve, reject) => {
            try {
                if (!isValidArray(permisos, true)) {
                    reject(new ValidationError('Existen campos incompletos'));
                    return;
                }

                const result = await this.perfilRepository.bindPermisos(id, permisos);
                resolve(result);
            }
            catch(error) {
                reject(new ProcessError('Error procesando datos', error));
            }
        });
    }

    async unbindPermisos(id:number, permisos:number[]) {
        return new Promise( async (resolve, reject) => {
            try {
                if (!isValidArray(permisos, true)) {
                    reject(new ValidationError('Existen campos incompletos'));
                    return;
                }

                const result = await this.perfilRepository.unbindPermisos(id, permisos);
                resolve(result);
            }
            catch(error) {
                reject(new ProcessError('Error procesando datos', error));
            }
        });
    }
    
}
