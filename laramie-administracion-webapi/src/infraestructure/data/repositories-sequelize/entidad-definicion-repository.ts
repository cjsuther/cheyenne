import IEntidadDefinicionRepository from '../../../domain/repositories/entidad-definicion-repository';
import EntidadDefinicionModel from './models/entidad-definicion-model';
import EntidadDefinicion from '../../../domain/entities/entidad-definicion';


export default class EntidadRepositorySequelize implements IEntidadDefinicionRepository {

    constructor() {

    }

    async getByTipo(tipo:string) {
        const data = await EntidadDefinicionModel.findOne({ where: { tipo: tipo } });
        const result = (data) ? new EntidadDefinicion(...data.getDataValues()) : null;

        return result;
    }

}
