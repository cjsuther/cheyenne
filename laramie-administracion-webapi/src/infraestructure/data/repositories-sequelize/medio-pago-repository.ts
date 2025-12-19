import IMedioPagoRepository from '../../../domain/repositories/medio-pago-repository';
import MedioPagoModel from './models/medio-pago-model';
import MedioPago from '../../../domain/entities/medio-pago';
import MedioPagoState from '../../../domain/dto/medio-pago-state';

export default class MedioPagoRepositorySequelize implements IMedioPagoRepository {

	constructor() {

	}

	async list() {
		const data = await MedioPagoModel.findAll();
		const result = data.map((row) => new MedioPago(...row.getDataValues()));

		return result;
	}

	async listByPersona(idTipoPersona:number, idPersona:number) {
		const data = await MedioPagoModel.findAll({ where: { idTipoPersona: idTipoPersona, idPersona: idPersona } });
		const result = data.map((row) => new MedioPagoState(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await MedioPagoModel.findOne({ where: { id: id } });
		const result = (data) ? new MedioPago(...data.getDataValues()) : null;

		return result;
	}

	async add(row:MedioPago) {
		const data = await MedioPagoModel.create({
			idTipoPersona: row.idTipoPersona,
			idPersona: row.idPersona,
			idTipoMedioPago: row.idTipoMedioPago,
			titular: row.titular,
			numero: row.numero,
			banco: row.banco,
			alias: row.alias,
			idTipoTarjeta: row.idTipoTarjeta,
			idMarcaTarjeta: row.idMarcaTarjeta,
			fechaVencimiento: row.fechaVencimiento,
			cvv: row.cvv
		});
		const result = new MedioPago(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:MedioPago) {
		const affectedCount = await MedioPagoModel.update({
			idTipoPersona: row.idTipoPersona,
			idPersona: row.idPersona,
			idTipoMedioPago: row.idTipoMedioPago,
			titular: row.titular,
			numero: row.numero,
			banco: row.banco,
			alias: row.alias,
			idTipoTarjeta: row.idTipoTarjeta,
			idMarcaTarjeta: row.idMarcaTarjeta,
			fechaVencimiento: row.fechaVencimiento,
			cvv: row.cvv
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await MedioPagoModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new MedioPago(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await MedioPagoModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

	async removeByPersona(idTipoPersona:number, idPersona:number) {
		const affectedCount = await MedioPagoModel.destroy({ where: { idTipoPersona: idTipoPersona, idPersona: idPersona } });
		const result = (affectedCount > 0) ? {idPersona} : null;
		
		return result;
	}

}
