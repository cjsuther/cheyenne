import { Sequelize } from 'sequelize';
import { getNamespace } from 'cls-hooked';
import IRegistroContableLoteRepository from '../../../domain/repositories/registro-contable-lote-repository';
import RegistroContableLoteModel from './models/registro-contable-lote-model';
import RegistroContableLote from '../../../domain/entities/registro-contable-lote';

export default class RegistroContableLoteRepositorySequelize implements IRegistroContableLoteRepository {

	constructor() {

	}

	async list() {
		const data = await RegistroContableLoteModel.findAll();
		const result = data.map((row) => new RegistroContableLote(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await RegistroContableLoteModel.findOne({ where: { id: id } });
		const result = (data) ? new RegistroContableLote(...data.getDataValues()) : null;

		return result;
	}

	async findByLote(numeroLote:string) {
		const data = await RegistroContableLoteModel.findOne({ where: { numeroLote: numeroLote } });
		const result = (data) ? new RegistroContableLote(...data.getDataValues()) : null;

		return result;
	}

	async add(row:RegistroContableLote) {
		const data = await RegistroContableLoteModel.create({
			numeroLote: row.numeroLote,
			fechaLote: row.fechaLote,
			casos: row.casos,
			importeTotal: row.importeTotal,
			idUsuarioProceso: row.idUsuarioProceso,
			fechaProceso: row.fechaProceso,
			fechaConfirmacion: row.fechaConfirmacion,
			pathArchivoRegistroContable: row.pathArchivoRegistroContable
		});
		const result = new RegistroContableLote(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:RegistroContableLote) {
		const affectedCount = await RegistroContableLoteModel.update({
			numeroLote: row.numeroLote,
			fechaLote: row.fechaLote,
			casos: row.casos,
			importeTotal: row.importeTotal,
			idUsuarioProceso: row.idUsuarioProceso,
			fechaProceso: row.fechaProceso,
			fechaConfirmacion: row.fechaConfirmacion,
			pathArchivoRegistroContable: row.pathArchivoRegistroContable
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await RegistroContableLoteModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new RegistroContableLote(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await RegistroContableLoteModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

	async onTransaction(request) {
		const localStorage = getNamespace('LocalStorage');
		Sequelize.useCLS(localStorage);

		return await RegistroContableLoteModel.sequelize.transaction(async (t) => {
			return request();
		});
	}

}
