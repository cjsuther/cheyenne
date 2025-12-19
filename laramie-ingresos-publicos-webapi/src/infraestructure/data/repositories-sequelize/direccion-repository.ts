import IDireccionRepository from '../../../domain/repositories/direccion-repository';
import DireccionModel from './models/direccion-model';
import Direccion from '../../../domain/entities/direccion';


export default class DireccionRepositorySequelize implements IDireccionRepository {

    constructor() {

    }

    async list() {
        const data = await DireccionModel.findAll();
        const result = data.map((row) => new Direccion(...row.getDataValues()));

        return result;
    }

    async listByEntidad(entidad:string, idEntidad:number) {
        const data = await DireccionModel.findAll({ where: { entidad: entidad, idEntidad: idEntidad } });
        const result = data.map((row) => new Direccion(...row.getDataValues()));

        return result;
    }

    async findById(id:number) {
        const data = await DireccionModel.findOne({ where: { id: id } });
        const result = (data) ? new Direccion(...data.getDataValues()) : null;

        return result;
    }

    async add(row:Direccion) {
        const data = await DireccionModel.create({
            entidad: row.entidad,
            idEntidad: row.idEntidad,
            idTipoGeoreferencia: row.idTipoGeoreferencia,
            idPais: row.idPais,
            idProvincia: row.idProvincia,
            idLocalidad: row.idLocalidad,
            idZonaGeoreferencia: row.idZonaGeoreferencia,
            codigoPostal: row.codigoPostal,
            calle: row.calle,
            entreCalle1: row.entreCalle1,
            entreCalle2: row.entreCalle2,
            altura: row.altura,
            piso: row.piso,
            dpto: row.dpto,
            referencia: row.referencia,
            longitud: row.longitud,
            latitud: row.latitud
        });
        const result = new Direccion(...data.getDataValues());

        return result;
    }

    async modify(id:number, row:Direccion) {
        const affectedCount = await DireccionModel.update({
            idTipoGeoreferencia: row.idTipoGeoreferencia,
            idPais: row.idPais,
            idProvincia: row.idProvincia,
            idLocalidad: row.idLocalidad,
            idZonaGeoreferencia: row.idZonaGeoreferencia,
            codigoPostal: row.codigoPostal,
            calle: row.calle,
            entreCalle1: row.entreCalle1,
            entreCalle2: row.entreCalle2,
            altura: row.altura,
            piso: row.piso,
            dpto: row.dpto,
            referencia: row.referencia,
            longitud: row.longitud,
            latitud: row.latitud
        },
        { where: { id: id } });

        const data = (affectedCount[0] > 0) ? await DireccionModel.findOne({ where: { id: id } }) : null;
        const result = (data) ? new Direccion(...data.getDataValues()) : null;

        return result;
    }

    async remove(id:number) {
        const affectedCount = await DireccionModel.destroy({ where: { id: id } });
        const result = (affectedCount > 0) ? {id} : null;
        
        return result;
    }

    async removeByEntidad(entidad:string, idEntidad: number) {
        const affectedCount = await DireccionModel.destroy({ where: { entidad: entidad, idEntidad: idEntidad } });
        const result = (affectedCount > 0) ? {idEntidad} : null;
        
        return result;
    }

}
