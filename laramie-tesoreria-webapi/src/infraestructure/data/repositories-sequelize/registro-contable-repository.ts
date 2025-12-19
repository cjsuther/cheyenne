import IRegistroContableRepository from '../../../domain/repositories/registro-contable-repository';
import RegistroContableModel from './models/registro-contable-model';
import RegistroContable from '../../../domain/entities/registro-contable';
import RecaudacionModel from './models/recaudacion-model';
import Recaudacion from '../../../domain/entities/recaudacion';

export default class RegistroContableRepositorySequelize implements IRegistroContableRepository {

	constructor() {

	}

	async list() {
		const data = await RegistroContableModel.findAll();
		const result = data.map((row) => new RegistroContable(...row.getDataValues()));

		return result;
	}

	async listByLote(idRegistroContableLote:number) {
		const data = await RegistroContableModel.findAll({
            include: [
				{ model: RecaudacionModel, as: 'recaudacion' }
            ],
			where: { idRegistroContableLote: idRegistroContableLote }
		});
		const result = data.map((row) => {
			const registroContable = new RegistroContable(...row.getDataValues());
			const rowRecaudacion = row["recaudacion"];
			if (rowRecaudacion) {
				registroContable.recaudacion = new Recaudacion(...rowRecaudacion.getDataValues());
			}

			return registroContable;
		});

		return result;
	}

	async findById(id:number) {
		const data = await RegistroContableModel.findOne({ where: { id: id } });
		const result = (data) ? new RegistroContable(...data.getDataValues()) : null;

		return result;
	}

	async add(row:RegistroContable) {
		const data = await RegistroContableModel.create({
			idRegistroContableLote: row.idRegistroContableLote,
			idRecaudacion: row.idRecaudacion,
			fechaIngreso: row.fechaIngreso,
			cuentaContable: row.cuentaContable,
			jurisdiccion: row.jurisdiccion,
			recursoPorRubro: row.recursoPorRubro,
			codigoLugarPago: row.codigoLugarPago,
			ejercicio: row.ejercicio,
			codigoFormaPago: row.codigoFormaPago,
			codigoTipoRecuadacion: row.codigoTipoRecuadacion,
			importe: row.importe
		});
		const result = new RegistroContable(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:RegistroContable) {
		const affectedCount = await RegistroContableModel.update({
			idRegistroContableLote: row.idRegistroContableLote,
			idRecaudacion: row.idRecaudacion,
			fechaIngreso: row.fechaIngreso,
			cuentaContable: row.cuentaContable,
			jurisdiccion: row.jurisdiccion,
			recursoPorRubro: row.recursoPorRubro,
			codigoLugarPago: row.codigoLugarPago,
			ejercicio: row.ejercicio,
			codigoFormaPago: row.codigoFormaPago,
			codigoTipoRecuadacion: row.codigoTipoRecuadacion,
			importe: row.importe
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await RegistroContableModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new RegistroContable(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await RegistroContableModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

}
