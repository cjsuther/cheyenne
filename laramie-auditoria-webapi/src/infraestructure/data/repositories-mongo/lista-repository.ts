import IListaRepository from '../../../domain/repositories/lista-repository';
import { createListaModel } from './models/lista-model';
import Lista from '../../../domain/entities/lista';


export default class ListaRepositoryMongo implements IListaRepository {

    constructor() {

    }

    async list() {
        const ListaModel = await createListaModel();
        const data = await ListaModel.find();
        const result = data.map((row) => {
            let item = new Lista(); item.setFromObject(row);
            return item;
        });

        return result;
    }

}
