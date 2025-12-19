import IListaRepository from '../../../domain/repositories/lista-repository';
import ListaModel from './models/lista-model';
import Lista from '../../../domain/entities/lista';


export default class ListaRepositorySequelize implements IListaRepository {

    constructor() {

    }

    async list(tipo:string) {
        const data = await ListaModel.findAll({ where: { tipo: tipo } });
        const result = data.map((row) => new Lista(...row.getDataValues()));

        return result;
    }

}
