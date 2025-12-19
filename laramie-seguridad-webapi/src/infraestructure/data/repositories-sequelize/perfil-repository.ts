import IPerfilRepository from '../../../domain/repositories/perfil-repository';
import PerfilModel from './models/perfil-model';
import PerfilUsuarioModel from './models/perfil-usuario-model';
import PerfilPermisoModel from './models/perfil-permiso-model';
import Perfil from '../../../domain/entities/perfil';
import { Op } from 'sequelize';


export default class PerfilRepositorySequelize implements IPerfilRepository {

    constructor() {

    }

    async list() {
        const data = await PerfilModel.findAll();
        const result = data.map((row) => new Perfil(...row.getDataValues()));

        return result;
    }

    async listByUsuario(idUsuario:number) {
        const data = await PerfilModel.findAll(
            {
                include: 
                [{
                    model: PerfilUsuarioModel,
                    required: true,
                    as: 'perfilUsuario',
                    where: { idUsuario: idUsuario }
                }]
            }
        );
        const result = data.map((row) => new Perfil(...row.getDataValues()));

        return result;
    }

    async findById(id:number) {
        const data = await PerfilModel.findOne({ where: { id: id } });
        const result = (data) ? new Perfil(...data.getDataValues()) : null;

        return result;
    }

    async add(row:Perfil) {
        const data = await PerfilModel.create({
            codigo : row.codigo,
            nombre : row.nombre
        });
        const result = new Perfil(...data.getDataValues());

        return result;
    }

    async modify(id:number, row:Perfil) {
        const affectedCount = await PerfilModel.update({
            codigo : row.codigo,
            nombre : row.nombre
        },
        { where: { id: id } });

        const data = (affectedCount[0] > 0) ? await PerfilModel.findOne({ where: { id: id } }) : null;
        const result = (data) ? new Perfil(...data.getDataValues()) : null;

        return result;
    }

    async remove(id:number) {
        const affectedCount = await PerfilModel.destroy({ where: { id: id } });
        const result = (affectedCount > 0) ? {id} : null;
        
        return result;
    }


    async bindPermisos(id:number, permisos:number[]) {
        const rows = permisos.map(idPermiso => {
            return {
                idPerfil: id,
                idPermiso: idPermiso,
            }
        });

        const affectedCount = await PerfilPermisoModel.bulkCreate(rows);

        const response = { id: id };
        const result = (affectedCount != null) ? response : null;
        return result;
    }

    async unbindPermisos(id:number, permisos:number[]) {
        const criteria = permisos.map(idPermiso => {
            return {
                [Op.and]: [
                    {idPerfil: id}, 
                    {idPermiso: idPermiso}
                ]
            }
        });

        const affectedCount = await PerfilPermisoModel.destroy({
            where: {
                [Op.or]: criteria
            }
        });

        const response = { id: id };
        const result = (affectedCount != null) ? response : null;
        return result;
    }

}
