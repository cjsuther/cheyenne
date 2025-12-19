import { Op } from 'sequelize';
import IRecaudacionRepository from '../../../domain/repositories/recaudacion-repository';
import RecaudacionModel from './models/recaudacion-model';
import Recaudacion from '../../../domain/entities/recaudacion';

export default class RecaudacionRepositorySequelize implements IRecaudacionRepository {

	constructor() {

	}

	async list() {
		const data = await RecaudacionModel.findAll();
		const result = data.map((row) => new Recaudacion(...row.getDataValues()));

		return result;
	}

	async listByLote(idRecaudacionLote:number) {
		const data = await RecaudacionModel.findAll({ where: { idRecaudacionLote: idRecaudacionLote } });
		const result = data.map((row) => new Recaudacion(...row.getDataValues()));

		return result;
	}

	async listIngresosPublicos(idsRecaudadora:number[] = []) {
		let data = [];
		if (idsRecaudadora.length > 0)
			data = await RecaudacionModel.findAll({
				where: {
					fechaConciliacion: {[Op.ne]: null},
					idPagoRendicionLote: null,
					idRecaudadora: {[Op.in]: idsRecaudadora}
				}
			});
		else
			data = await RecaudacionModel.findAll({
				where: {
					fechaConciliacion: {[Op.ne]: null},
					idPagoRendicionLote: null
				}
			});
		const result = data.map((row) => new Recaudacion(...row.getDataValues()));

		return result;
	}

	async listRegistroContable(idsRecaudadora:number[] = []) {
		let data = [];
		if (idsRecaudadora.length > 0)
			data = await RecaudacionModel.findAll({
				where: {
					fechaConciliacion: {[Op.ne]: null},
					idRegistroContableLote: null,
					idRecaudadora: {[Op.in]: idsRecaudadora}
				}
			});
		else
			data = await RecaudacionModel.findAll({
				where: {
					fechaConciliacion: {[Op.ne]: null},
					idRegistroContableLote: null
				}
			});
		const result = data.map((row) => new Recaudacion(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await RecaudacionModel.findOne({ where: { id: id } });
		const result = (data) ? new Recaudacion(...data.getDataValues()) : null;

		return result;
	}

	async add(row:Recaudacion) {
		const data = await RecaudacionModel.create({
			idRecaudacionLote: row.idRecaudacionLote,
			idReciboPublicacion: row.idReciboPublicacion,
			idRegistroContableLote: row.idRegistroContableLote,
			idPagoRendicionLote: row.idPagoRendicionLote,
			idRecaudadora: row.idRecaudadora,
			numeroControl: row.numeroControl,
			numeroComprobante: row.numeroComprobante,
			codigoTipoTributo: row.codigoTipoTributo,
			numeroCuenta: row.numeroCuenta,
			codigoDelegacion: row.codigoDelegacion,
			numeroRecibo: row.numeroRecibo,
			importeCobro: row.importeCobro,
			fechaCobro: row.fechaCobro,
			codigoBarras: row.codigoBarras,
			idUsuarioConciliacion: row.idUsuarioConciliacion,
			fechaConciliacion: row.fechaConciliacion,
			observacion: row.observacion
		});
		const result = new Recaudacion(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:Recaudacion) {
		const affectedCount = await RecaudacionModel.update({
			idRecaudacionLote: row.idRecaudacionLote,
			idReciboPublicacion: row.idReciboPublicacion,
			idRegistroContableLote: row.idRegistroContableLote,
			idPagoRendicionLote: row.idPagoRendicionLote,
			idRecaudadora: row.idRecaudadora,
			numeroControl: row.numeroControl,
			numeroComprobante: row.numeroComprobante,
			codigoTipoTributo: row.codigoTipoTributo,
			numeroCuenta: row.numeroCuenta,
			codigoDelegacion: row.codigoDelegacion,
			numeroRecibo: row.numeroRecibo,
			importeCobro: row.importeCobro,
			fechaCobro: row.fechaCobro,
			codigoBarras: row.codigoBarras,
			idUsuarioConciliacion: row.idUsuarioConciliacion,
			fechaConciliacion: row.fechaConciliacion,
			observacion: row.observacion
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await RecaudacionModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new Recaudacion(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await RecaudacionModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

	async removeByLote(idRecaudacionLote:number) {
		const affectedCount = await RecaudacionModel.destroy({ where: { idRecaudacionLote: idRecaudacionLote } });
		const result = (affectedCount > 0) ? {idRecaudacionLote} : null;
		
		return result;
	}

}
