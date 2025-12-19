import IVariableCuentaRepository from '../../../domain/repositories/variable-cuenta-repository';
import VariableCuentaModel from './models/variable-cuenta-model';
import VariableCuenta from '../../../domain/entities/variable-cuenta';
import VariableCuentaState from '../../../domain/dto/variable-cuenta-state';

export default class VariableCuentaRepositorySequelize implements IVariableCuentaRepository {

	constructor() {

	}

	async listByCuenta(idCuenta: number) {
		const data = await VariableCuentaModel.findAll({where: { idCuenta: idCuenta }});
		const result = data.map((row) => new VariableCuentaState(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await VariableCuentaModel.findOne({ where: { id: id } });
		const result = (data) ? new VariableCuenta(...data.getDataValues()) : null;

		return result;
	}

	async add(row:VariableCuenta) {
		const data = await VariableCuentaModel.create({
			idVariable: row.idVariable,
			idCuenta: row.idCuenta,
			valor: row.valor,
			fechaDesde: row.fechaDesde,
			fechaHasta: row.fechaHasta
		});
		const result = new VariableCuenta(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:VariableCuenta) {
		const affectedCount = await VariableCuentaModel.update({
			idVariable: row.idVariable,
			idCuenta: row.idCuenta,
			valor: row.valor,
			fechaDesde: row.fechaDesde,
			fechaHasta: row.fechaHasta
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await VariableCuentaModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new VariableCuenta(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await VariableCuentaModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

	async removeByCuenta(idCuenta: number) {
		const affectedCount = await VariableCuentaModel.destroy({ where: { idCuenta: idCuenta } });
		const result = (affectedCount > 0) ? {idCuenta} : null;
		
		return result;
	}

}
