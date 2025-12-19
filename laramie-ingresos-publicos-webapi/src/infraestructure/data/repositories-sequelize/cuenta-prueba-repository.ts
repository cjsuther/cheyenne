import ICuentaPruebaRepository from '../../../domain/repositories/cuenta-prueba-repository';
import CuentaPruebaModel from './models/cuenta-prueba-model';
import CuentaPrueba from '../../../domain/entities/cuenta-prueba';
import CuentaModel from './models/cuenta-model';
import ValidationError from '../../sdk/error/validation-error';

export default class CuentaPruebaRepositorySequelize implements ICuentaPruebaRepository {

	constructor() {

	}

	async list() {
		const data = await CuentaPruebaModel.findAll({ include: [
			{ model: CuentaModel, as: 'cuenta', }
		]});
		const result = data.map((row) => new CuentaPrueba(...row.getDataValues(), row.dataValues.cuenta.numeroCuenta));

		return result;
	}	

	async findById(id:number) {
		const data = await CuentaPruebaModel.findOne({ where: { id: id } });
		const result = (data) ? new CuentaPrueba(...data.getDataValues()) : null;

		return result;
	}

	async findByCuenta(idCuenta:number) {
		const data = await CuentaPruebaModel.findOne({ where: { idCuenta: idCuenta } });
		const result = (data) ? new CuentaPrueba(...data.getDataValues()) : null;

		return result;
	}

	async add(row:CuentaPrueba) {
		const data = await CuentaPruebaModel.create({
			idTipoTributo: row.idTipoTributo,
			idCuenta: row.idCuenta,
			comentario: row.comentario
		});
		const result = new CuentaPrueba(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:CuentaPrueba) {
		const affectedCount = await CuentaPruebaModel.update({
			idTipoTributo: row.idTipoTributo,
			idCuenta: row.idCuenta,
			comentario: row.comentario
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await CuentaPruebaModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new CuentaPrueba(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await CuentaPruebaModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

}
