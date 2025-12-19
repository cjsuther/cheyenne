import IEntidadRepository from '../../../domain/repositories/entidad-repository';
import EntidadModel from './models/entidad-model';
import Entidad from '../../../domain/entities/entidad';


export default class EntidadRepositorySequelize implements IEntidadRepository {

    constructor() {

    }

    async list(tipo:string) {
        const data = await EntidadModel.findAll({ where: { tipo: tipo } });
        const result = data.map((row) => new Entidad(...row.getDataValues()));

        return result;
    }

}
