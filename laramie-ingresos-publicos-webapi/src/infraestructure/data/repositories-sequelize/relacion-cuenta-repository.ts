import IRelacionCuentaRepository from '../../../domain/repositories/relacion-cuenta-repository';
import RelacionCuentaModel from './models/relacion-cuenta-model';
import RelacionCuenta from '../../../domain/entities/relacion-cuenta';
import RelacionCuentaState from '../../../domain/dto/relacion-cuenta-state';
import { Op } from 'sequelize';

export default class RelacionCuentaRepositorySequelize implements IRelacionCuentaRepository {

	constructor() {

	}

	async listByCuenta(idCuenta: number) {
		const data = await RelacionCuentaModel.findAll({where: {
			[Op.or]: [{idCuenta1: idCuenta}, {idCuenta2: idCuenta}]
		}});
		const result = data.map((row) => {
			return new RelacionCuentaState(...row.getDataValues());
		}) as Array<RelacionCuentaState>;

		return result;
	}

	async findById(id:number) {
		const data = await RelacionCuentaModel.findOne({ where: { id: id } });
		const result = (data) ? new RelacionCuenta(...data.getDataValues()) : null;

		return result;
	}

	async add(row:RelacionCuenta) {
		const data = await RelacionCuentaModel.create({
			idCuenta1: row.idCuenta1,
			idCuenta2: row.idCuenta2
		});
		const result = new RelacionCuenta(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:RelacionCuenta) {
		const affectedCount = await RelacionCuentaModel.update({
			idCuenta1: row.idCuenta1,
			idCuenta2: row.idCuenta2
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await RelacionCuentaModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new RelacionCuenta(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await RelacionCuentaModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

	async removeByCuenta(idCuenta: number) {
		const affectedCount1 = await RelacionCuentaModel.destroy({ where: { idCuenta1: idCuenta } });
		const affectedCount2 = await RelacionCuentaModel.destroy({ where: { idCuenta2: idCuenta } });
		const result = (affectedCount1 + affectedCount2 > 0) ? {idCuenta} : null;
		
		return result;
	}

}
