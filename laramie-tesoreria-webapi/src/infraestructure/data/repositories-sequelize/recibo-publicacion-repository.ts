import { Op } from 'sequelize';
import IReciboPublicacionRepository from '../../../domain/repositories/recibo-publicacion-repository';
import ReciboPublicacionModel from './models/recibo-publicacion-model';
import ReciboPublicacion from '../../../domain/entities/recibo-publicacion';

export default class ReciboPublicacionRepositorySequelize implements IReciboPublicacionRepository {

	constructor() {

	}

	async list() {
		const data = await ReciboPublicacionModel.findAll();
		const result = data.map((row) => new ReciboPublicacion(...row.getDataValues()));

		return result;
	}

	async listByNumeros(codigoDelegacion:string, numerosRecibo:number[]) {
		const data = await ReciboPublicacionModel.findAll({
				where: {
					codigoDelegacion: codigoDelegacion,
					numeroRecibo: {[Op.in]: numerosRecibo}
				}
			});
		const result = data.map((row) => new ReciboPublicacion(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await ReciboPublicacionModel.findOne({ where: { id: id } });
		const result = (data) ? new ReciboPublicacion(...data.getDataValues()) : null;

		return result;
	}

	async findByCuentaPago(idCuentaPago:number) {
		const data = await ReciboPublicacionModel.findOne({ where: { idCuentaPago: idCuentaPago } });
		const result = (data) ? new ReciboPublicacion(...data.getDataValues()) : null;

		return result;
	}

	async findByNumero(codigoDelegacion: string, numeroRecibo: number) {
		const data = await ReciboPublicacionModel.findOne({ where: { codigoDelegacion: codigoDelegacion, numeroRecibo: numeroRecibo } });
		const result = (data) ? new ReciboPublicacion(...data.getDataValues()) : null;

		return result;
	}

	async findByCodigoBarras(codigoBarras: string) {
		const data = await ReciboPublicacionModel.findOne({ where: { codigoBarras: codigoBarras } });
		const result = (data) ? new ReciboPublicacion(...data.getDataValues()) : null;

		return result;
	}

	async add(row:ReciboPublicacion) {
		const data = await ReciboPublicacionModel.create({
			idReciboPublicacionLote: row.idReciboPublicacionLote,
			idCuentaPago: row.idCuentaPago,
			codigoTipoTributo: row.codigoTipoTributo,
			numeroCuenta: row.numeroCuenta,
			codigoDelegacion: row.codigoDelegacion,
			numeroRecibo: row.numeroRecibo,
			periodo: row.periodo,
			cuota: row.cuota,
			importeVencimiento1: row.importeVencimiento1,
			importeVencimiento2: row.importeVencimiento2,
			fechaVencimiento1: row.fechaVencimiento1,
			fechaVencimiento2: row.fechaVencimiento2,
			codigoBarras: row.codigoBarras,
			idPagoRendicion: row.idPagoRendicion
		});
		const result = new ReciboPublicacion(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:ReciboPublicacion) {
		const affectedCount = await ReciboPublicacionModel.update({
			idReciboPublicacionLote: row.idReciboPublicacionLote,
			idCuentaPago: row.idCuentaPago,
			codigoTipoTributo: row.codigoTipoTributo,
			numeroCuenta: row.numeroCuenta,
			codigoDelegacion: row.codigoDelegacion,
			numeroRecibo: row.numeroRecibo,
			periodo: row.periodo,
			cuota: row.cuota,
			importeVencimiento1: row.importeVencimiento1,
			importeVencimiento2: row.importeVencimiento2,
			fechaVencimiento1: row.fechaVencimiento1,
			fechaVencimiento2: row.fechaVencimiento2,
			codigoBarras: row.codigoBarras,
			idPagoRendicion: row.idPagoRendicion
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await ReciboPublicacionModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new ReciboPublicacion(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await ReciboPublicacionModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

}
