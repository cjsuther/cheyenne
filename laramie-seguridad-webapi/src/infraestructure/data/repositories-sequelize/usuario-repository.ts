import IUsuarioRepository from '../../../domain/repositories/usuario-repository';
import UsuarioModel from './models/usuario-model';
import PerfilUsuarioModel from './models/perfil-usuario-model';
import Usuario from '../../../domain/entities/usuario';
import { Op } from 'sequelize';


export default class UsuarioRepositorySequelize implements IUsuarioRepository {

    constructor() {

    }

    async list() {
        const data = await UsuarioModel.findAll();
        const result = data.map((row) => new Usuario(...row.getDataValues())).sort((a, b) => a.codigo.localeCompare(b.codigo));

        return result;
    }

    async findById(id:number) {
        const data = await UsuarioModel.findOne({ where: { id: id } });
        const result = (data) ? new Usuario(...data.getDataValues()) : null;

        return result;
    }

    async findByLogin(login: string) {
        const data = await UsuarioModel.findOne({ where: { codigo: login }})
        return (data) ? new Usuario(...data.getDataValues()) : null
    }

    async add(row:Usuario) {
        const data = await UsuarioModel.create({
            idTipoUsuario: row.idTipoUsuario,
            idEstadoUsuario: row.idEstadoUsuario,
            idPersona: row.idPersona,
            codigo : row.codigo,
            nombreApellido : row.nombreApellido,
            email : row.email,
            fechaAlta: row.fechaAlta
        });
        const result = new Usuario(...data.getDataValues());

        return result;
    }

    async modify(id:number, row:Usuario) {
        const affectedCount = await UsuarioModel.update({
            idTipoUsuario: row.idTipoUsuario,
            idEstadoUsuario: row.idEstadoUsuario,
            idPersona: row.idPersona,
            codigo : row.codigo,
            nombreApellido : row.nombreApellido,
            email : row.email,
            fechaBaja : row.fechaBaja
        },
        { where: { id: id } });

        const data = (affectedCount[0] > 0) ? await UsuarioModel.findOne({ where: { id: id } }) : null;
        const result = (data) ? new Usuario(...data.getDataValues()) : null;

        return result;
    }

    async remove(id:number) {
        const affectedCount = await UsuarioModel.destroy({ where: { id: id } });
        const result = (affectedCount > 0) ? {id} : null;
        
        return result;
    }


    async bindPerfiles(id:number, perfiles:number[]) {
        const rows = perfiles.map(idPerfil => {
            return {
                idUsuario: id,
                idPerfil: idPerfil,
            }
        });

        const affectedCount = await PerfilUsuarioModel.bulkCreate(rows);

        const response = { id: id };
        const result = (affectedCount != null) ? response : null;
        return result;
    }

    async unbindPerfiles(id:number, perfiles:number[]) {
        const criteria = perfiles.map(idPerfil => {
            return {
                [Op.and]: [
                    {idUsuario: id}, 
                    {idPerfil: idPerfil}
                ]
            }
        });

        const affectedCount = await PerfilUsuarioModel.destroy({
            where: {
                [Op.or]: criteria
            }
        });

        const response = { id: id };
        const result = (affectedCount != null) ? response : null;
        return result;
    }

    async findByIds(ids:number[]) {
        const distinctIds = [...new Set(ids)];
        const data = await UsuarioModel.findAll({ where: { id: {
                        [Op.in]: distinctIds
                    }        
        } });
        
        const result = data.map((row) => new Usuario(...row.getDataValues())).sort((a, b) => a.codigo.localeCompare(b.codigo));

        return result;    
    }

}
