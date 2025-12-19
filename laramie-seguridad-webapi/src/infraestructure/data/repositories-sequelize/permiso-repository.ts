import IPermisoRepository from '../../../domain/repositories/permiso-repository';
import Permiso from '../../../domain/entities/permiso';
import PermisoModel from './models/permiso-model';
import PerfilPermisoModel from './models/perfil-permiso-model';

export default class PermisoRepositorySequelize implements IPermisoRepository {

    constructor() {}

    async list() {
        const data = await PermisoModel.findAll();
        const result = data.map((row) => new Permiso(...row.getDataValues()));

        return result;
    }

    async listByPerfil(idPerfil:number) {
        const data = await PermisoModel.findAll(
            {
                include: 
                [{
                    model: PerfilPermisoModel,
                    required: true,
                    as: 'perfilPermiso',
                    where: { idPerfil: idPerfil }
                }]
            }
        );
        const result = data.map((row) => new Permiso(...row.getDataValues()));

        return result;
    }

    async listByUsuario(idUsuario:number){

    }

    async findById(id:number) {
        const data = await PermisoModel.findOne({ where: { id: id } });
        const result = (data) ? new Permiso(...data.getDataValues()) : null;

        return result;
    }
}