import IReciboAperturaRepository from '../../../domain/repositories/recibo-apertura-repository';
import ReciboAperturaModel from './models/recibo-apertura-model';
import ReciboApertura from '../../../domain/entities/recibo-apertura';

export default class ReciboAperturaRepositorySequelize implements IReciboAperturaRepository {

	constructor() {

	}

	async list() {
		const data = await ReciboAperturaModel.findAll();
		const result = data.map((row) => new ReciboApertura(...row.getDataValues()));

		return result;
	}

	async listByReciboPublicacion(idReciboPublicacion: number) {
		const data = await ReciboAperturaModel.findAll({ where: { idReciboPublicacion: idReciboPublicacion } });
		const result = data.map((row) => new ReciboApertura(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await ReciboAperturaModel.findOne({ where: { id: id } });
		const result = (data) ? new ReciboApertura(...data.getDataValues()) : null;

		return result;
	}

	async add(row:ReciboApertura) {
		const data = await ReciboAperturaModel.create({
			idReciboPublicacion: row.idReciboPublicacion,
			codigoRubro: row.codigoRubro,
			codigoTasa: row.codigoTasa,
			codigoSubTasa: row.codigoSubTasa,
			codigoTipoMovimiento: row.codigoTipoMovimiento,
			periodo: row.periodo,
			cuota: row.cuota,
			importeCancelar: row.importeCancelar,
			importeImputacionContable: row.importeImputacionContable,
			numeroCertificadoApremio: row.numeroCertificadoApremio,
			vencimiento: row.vencimiento,
			fechaVencimiento: row.fechaVencimiento,
			numeroEmision: row.numeroEmision,
			tipoNovedad: row.tipoNovedad
		});
		const result = new ReciboApertura(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:ReciboApertura) {
		const affectedCount = await ReciboAperturaModel.update({
			idReciboPublicacion: row.idReciboPublicacion,
			codigoRubro: row.codigoRubro,
			codigoTasa: row.codigoTasa,
			codigoSubTasa: row.codigoSubTasa,
			codigoTipoMovimiento: row.codigoTipoMovimiento,
			periodo: row.periodo,
			cuota: row.cuota,
			importeCancelar: row.importeCancelar,
			importeImputacionContable: row.importeImputacionContable,
			numeroCertificadoApremio: row.numeroCertificadoApremio,
			vencimiento: row.vencimiento,
			fechaVencimiento: row.fechaVencimiento,
			numeroEmision: row.numeroEmision,
			tipoNovedad: row.tipoNovedad
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await ReciboAperturaModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new ReciboApertura(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await ReciboAperturaModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

}
