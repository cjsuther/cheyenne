import IListaRepository from '../../../domain/repositories/lista-repository';
import ListaModel from './models/lista-model';
import Lista from '../../../domain/entities/lista';
import ListaState from '../../../domain/dto/lista-state';


export default class ListaRepositorySequelize implements IListaRepository {

    constructor() {

    }

    async list() {
        const data = await ListaModel.findAll();
        const result = data.map((row) => new Lista(...row.getDataValues()));

        return result;
    }

    async listTipo(tipo:string) {
        const data = await ListaModel.findAll({ where: { tipo: tipo } });
        const result = data.map((row) => new Lista(...row.getDataValues()));

        return result;
    }

    async findById(id:number) {
		const data = await ListaModel.findOne({ where: { id: id } });
		const result = (data) ? new Lista(...data.getDataValues()) : null;

		return result;
	}

	async add(row:Lista) {
		const data = await ListaModel.create({
			tipo: row.tipo,
			codigo: row.codigo,
			nombre: row.nombre,
			orden: row.orden
		});
		const result = new Lista(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:Lista) {
		const affectedCount = await ListaModel.update({
			tipo: row.tipo,
			codigo: row.codigo,
			nombre: row.nombre,
			orden: row.orden
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await ListaModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new Lista(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await ListaModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

}
