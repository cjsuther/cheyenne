import Permiso from '../entities/permiso';
import PermisoDto from '../dto/permiso-dto';
import IPermisoRepository from '../repositories/permiso-repository';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';
import IPerfilRepository from '../repositories/perfil-repository';
import Perfil from '../entities/perfil';
import { isNull } from '../../infraestructure/sdk/utils/validator';
import { getProfiles, verifyAccess } from '../../server/authorization/profile';

export default class PermisoService {

    permisoRepository: IPermisoRepository;
    perfilRepository: IPerfilRepository;

    constructor(permisoRepository: IPermisoRepository,
                perfilRepository: IPerfilRepository) {
        this.permisoRepository = permisoRepository;
        this.perfilRepository = perfilRepository;
    }

    async list() {
        return new Promise( async (resolve, reject) => {
            try {
                const result = await this.permisoRepository.list();
                resolve(result);
            }
            catch(error) {
                reject(new ProcessError('Error procesando datos', error));
            }
        });
    }
    
    async listByPerfil(idPerfil:number) {
        return new Promise( async (resolve, reject) => {
            try {
                const permisos = await this.permisoRepository.list() as Permiso[];
                const permisosPerfil = await this.permisoRepository.listByPerfil(idPerfil) as Permiso[];

                const result = permisos.map(permiso => {
                    const selected = permisosPerfil.some(permisoPerfil => permisoPerfil.id == permiso.id);
                    return new PermisoDto(permiso, selected);
                });

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
                const perfilesUsuario = await this.perfilRepository.listByUsuario(idUsuario) as Perfil[]; // Obtiene todos los perfiles del usuario
                let permisosPerfilUsuario: Array<PermisoDto> = [];
                
                for (let i = 0; i < perfilesUsuario.length; i++) {
                    let idPerfil = perfilesUsuario[i].id;
                    
                    const tempPermisosPerfilUsuario = await this.permisoRepository.listByPerfil(idPerfil) as PermisoDto[]; // Obtiene todos los permisos de los perfiles del usuario
                    permisosPerfilUsuario = permisosPerfilUsuario.concat(tempPermisosPerfilUsuario);
                    
                }

                resolve(permisosPerfilUsuario);
            }
            catch(error) {
                reject(new ProcessError('Error procesando datos', error));
            }
        });
    }

    async findById(id: number) {
        return new Promise( async (resolve, reject) => {
            try {               
                const result = await this.permisoRepository.findById(id);
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

    async checkPermisos(idUsuario: number, codigoPermiso: string){
        return new Promise( async (resolve, reject) => {
            try {
                const perfilesUsuario = (await this.perfilRepository.listByUsuario(idUsuario) as Perfil[]).map(x => x.id);
                const verified = verifyAccess(perfilesUsuario, [codigoPermiso]);
                
                resolve({verified: verified});
            }
            catch(error) {
                reject(new ProcessError('Error procesando datos', error));
            }
        });
    }
}
