import { Sequelize } from 'sequelize';
import { getNamespace } from 'cls-hooked';
import IEmisionAprobacionRepository from '../../../domain/repositories/emision-aprobacion-repository';
import EmisionAprobacionModel from './models/emision-aprobacion-model';
import EmisionAprobacion from '../../../domain/entities/emision-aprobacion';
import ProcessError from '../../sdk/error/process-error';

export default class EmisionAprobacionRepositorySequelize implements IEmisionAprobacionRepository {

	constructor() {

	}

	async list() {
		const data = await EmisionAprobacionModel.findAll();
		const result = data.map((row) => new EmisionAprobacion(...row.getDataValues()));

		return result;
	}

	async findByEmisionEjecucion(idEmisionEjecucion:number) {
		const data = await EmisionAprobacionModel.findOne({ where: { idEmisionEjecucion: idEmisionEjecucion } });
		const result = (data) ? new EmisionAprobacion(...data.getDataValues()) : null;

		return result;
	}

	async findById(id:number) {
		const data = await EmisionAprobacionModel.findOne({ where: { id: id } });
		const result = (data) ? new EmisionAprobacion(...data.getDataValues()) : null;

		return result;
	}

	async add(row:EmisionAprobacion) {
		const data = await EmisionAprobacionModel.create({
			idEmisionEjecucion: row.idEmisionEjecucion,
			idEstadoAprobacionCalculo: row.idEstadoAprobacionCalculo,
			idUsuarioAprobacionCalculo: row.idUsuarioAprobacionCalculo,
			fechaAprobacionCalculo: row.fechaAprobacionCalculo,
			idEstadoAprobacionOrdenamiento: row.idEstadoAprobacionOrdenamiento,
			idUsuarioAprobacionOrdenamiento: row.idUsuarioAprobacionOrdenamiento,
			fechaAprobacionOrdenamiento: row.fechaAprobacionOrdenamiento,
			idEstadoAprobacionControlRecibos: row.idEstadoAprobacionControlRecibos,
			idUsuarioAprobacionControlRecibos: row.idUsuarioAprobacionControlRecibos,
			fechaAprobacionControlRecibos: row.fechaAprobacionControlRecibos,
			idEstadoAprobacionCodigoBarras: row.idEstadoAprobacionCodigoBarras,
			idUsuarioAprobacionCodigoBarras: row.idUsuarioAprobacionCodigoBarras,
			fechaAprobacionCodigoBarras: row.fechaAprobacionCodigoBarras,
			idEstadoProcesoCuentaCorriente: row.idEstadoProcesoCuentaCorriente,
			idUsuarioProcesoCuentaCorriente: row.idUsuarioProcesoCuentaCorriente,
			fechaProcesoCuentaCorriente: row.fechaProcesoCuentaCorriente,
			idEstadoProcesoImpresion: row.idEstadoProcesoImpresion,
			idUsuarioProcesoImpresion: row.idUsuarioProcesoImpresion,
			fechaProcesoImpresion: row.fechaProcesoImpresion
		});
		const result = new EmisionAprobacion(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:EmisionAprobacion) {
		const affectedCount = await EmisionAprobacionModel.update({
			idEmisionEjecucion: row.idEmisionEjecucion,
			idEstadoAprobacionCalculo: row.idEstadoAprobacionCalculo,
			idUsuarioAprobacionCalculo: row.idUsuarioAprobacionCalculo,
			fechaAprobacionCalculo: row.fechaAprobacionCalculo,
			idEstadoAprobacionOrdenamiento: row.idEstadoAprobacionOrdenamiento,
			idUsuarioAprobacionOrdenamiento: row.idUsuarioAprobacionOrdenamiento,
			fechaAprobacionOrdenamiento: row.fechaAprobacionOrdenamiento,
			idEstadoAprobacionControlRecibos: row.idEstadoAprobacionControlRecibos,
			idUsuarioAprobacionControlRecibos: row.idUsuarioAprobacionControlRecibos,
			fechaAprobacionControlRecibos: row.fechaAprobacionControlRecibos,
			idEstadoAprobacionCodigoBarras: row.idEstadoAprobacionCodigoBarras,
			idUsuarioAprobacionCodigoBarras: row.idUsuarioAprobacionCodigoBarras,
			fechaAprobacionCodigoBarras: row.fechaAprobacionCodigoBarras,
			idEstadoProcesoCuentaCorriente: row.idEstadoProcesoCuentaCorriente,
			idUsuarioProcesoCuentaCorriente: row.idUsuarioProcesoCuentaCorriente,
			fechaProcesoCuentaCorriente: row.fechaProcesoCuentaCorriente,
			idEstadoProcesoImpresion: row.idEstadoProcesoImpresion,
			idUsuarioProcesoImpresion: row.idUsuarioProcesoImpresion,
			fechaProcesoImpresion: row.fechaProcesoImpresion
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await EmisionAprobacionModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new EmisionAprobacion(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await EmisionAprobacionModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

	async removeByEmisionEjecucion(idEmisionEjecucion:number) {
		const affectedCount = await EmisionAprobacionModel.destroy({ where: { idEmisionEjecucion: idEmisionEjecucion } });
		const result = (affectedCount > 0) ? {idEmisionEjecucion} : null;
		
		return result;
	}

	async onTransaction(request) {
		const localStorage = getNamespace('LocalStorage');
		Sequelize.useCLS(localStorage);

		return await EmisionAprobacionModel.sequelize.transaction(async (t) => {
			return request();
		});
	}

	// async onTransaction(request) {
	// 	return new Promise( async (resolve, reject) => {
	// 		try {
	// 			const localStorage = getNamespace('LocalStorage');
	// 			Sequelize.useCLS(localStorage);
		
	// 			const result = await EmisionAprobacionModel.sequelize.transaction(async (t) => {
	// 				return await request();
	// 			});

	// 			resolve(result);
	// 		}
	// 		catch(error) {
	// 			reject(new ProcessError('Error procesando datos', error));
	// 		}
	// 	});
	// }

}
