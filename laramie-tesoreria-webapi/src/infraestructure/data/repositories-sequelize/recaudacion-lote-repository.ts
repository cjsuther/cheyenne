import { Op } from 'sequelize';
import { Sequelize } from 'sequelize';
import { getNamespace } from 'cls-hooked';
import IRecaudacionLoteRepository from '../../../domain/repositories/recaudacion-lote-repository';
import RecaudacionLoteModel from './models/recaudacion-lote-model';
import RecaudacionLote from '../../../domain/entities/recaudacion-lote';
import RecaudacionLoteConciliacion from '../../../domain/dto/recaudacion-lote-conciliacion';

export default class RecaudacionLoteRepositorySequelize implements IRecaudacionLoteRepository {

	constructor() {

	}

	async list() {
		const data = await RecaudacionLoteModel.findAll();
		const result = data.map((row) => new RecaudacionLote(...row.getDataValues()));

		return result;
	}

	async listControl() {
		const data = await RecaudacionLoteModel.findAll({
			where: {
				fechaControl: null
			}
		});
		const result = data.map((row) => new RecaudacionLote(...row.getDataValues()));

		return result;
	}

	async listConciliacion() {
		const data = await RecaudacionLoteModel.findAll({
			where: {
				fechaControl: {[Op.ne]: null},
				fechaConciliacion: null
			}
		});
		const result = data.map((row) => new RecaudacionLoteConciliacion(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await RecaudacionLoteModel.findOne({ where: { id: id } });
		const result = (data) ? new RecaudacionLote(...data.getDataValues()) : null;

		return result;
	}

	async findByLote(numeroLote:string) {
		const data = await RecaudacionLoteModel.findOne({ where: { numeroLote: numeroLote } });
		const result = (data) ? new RecaudacionLote(...data.getDataValues()) : null;

		return result;
	}

	async findByNombreArchivoRecaudacion(nombreArchivoRecaudacion:string) {
		const data = await RecaudacionLoteModel.findOne({ where: { nombreArchivoRecaudacion: nombreArchivoRecaudacion } });
		const result = (data) ? new RecaudacionLote(...data.getDataValues()) : null;

		return result;
	}	

	async add(row:RecaudacionLote) {
		const data = await RecaudacionLoteModel.create({
			numeroLote: row.numeroLote,
			fechaLote: row.fechaLote,
			casos: row.casos,
			idUsuarioProceso: row.idUsuarioProceso,
			fechaProceso: row.fechaProceso,
			idOrigenRecaudacion: row.idOrigenRecaudacion,
			idRecaudadora: row.idRecaudadora,
			fechaAcreditacion: row.fechaAcreditacion,
			idUsuarioControl: row.idUsuarioControl,
			fechaControl: row.fechaControl,
			idUsuarioConciliacion: row.idUsuarioConciliacion,
			fechaConciliacion: row.fechaConciliacion,
			importeTotal: row.importeTotal,
			importeNeto: row.importeNeto,
			pathArchivoRecaudacion: row.pathArchivoRecaudacion,
			nombreArchivoRecaudacion: row.nombreArchivoRecaudacion
		});
		const result = new RecaudacionLote(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:RecaudacionLote) {
		const affectedCount = await RecaudacionLoteModel.update({
			numeroLote: row.numeroLote,
			fechaLote: row.fechaLote,
			casos: row.casos,
			idUsuarioProceso: row.idUsuarioProceso,
			fechaProceso: row.fechaProceso,
			idOrigenRecaudacion: row.idOrigenRecaudacion,
			idRecaudadora: row.idRecaudadora,
			fechaAcreditacion: row.fechaAcreditacion,
			idUsuarioControl: row.idUsuarioControl,
			fechaControl: row.fechaControl,
			idUsuarioConciliacion: row.idUsuarioConciliacion,
			fechaConciliacion: row.fechaConciliacion,
			importeTotal: row.importeTotal,
			importeNeto: row.importeNeto,
			pathArchivoRecaudacion: row.pathArchivoRecaudacion,
			nombreArchivoRecaudacion: row.nombreArchivoRecaudacion
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await RecaudacionLoteModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new RecaudacionLote(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await RecaudacionLoteModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

	async onTransaction(request) {
		const localStorage = getNamespace('LocalStorage');
		Sequelize.useCLS(localStorage);

		return await RecaudacionLoteModel.sequelize.transaction(async (t) => {
			return request();
		});
	}

}
