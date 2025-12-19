import IZonaEntregaRepository from '../../../domain/repositories/zona-entrega-repository';
import ZonaEntregaModel from './models/zona-entrega-model';
import ZonaEntrega from '../../../domain/entities/zona-entrega';
import ZonaEntregaState from '../../../domain/dto/zona-entrega-state';
import DireccionModel from './models/direccion-model';
import Direccion from '../../../domain/entities/direccion';

export default class ZonaEntregaRepositorySequelize implements IZonaEntregaRepository {

	constructor() {

	}

	async listByCuenta(idCuenta: number) {
		const data = await ZonaEntregaModel.findAll({
            include: [
				{ model: DireccionModel, as: 'direccion' }
            ],
			where: { idCuenta: idCuenta }
		});
		const result = data.map((row) => {
			const direccion = row["direccion"];

			let zonaEntrega = new ZonaEntregaState(...row.getDataValues());
			zonaEntrega.direccion = new Direccion(...direccion[0].getDataValues());

			return zonaEntrega;
		});

		return result;
	}

	async findById(id:number) {
		const data = await ZonaEntregaModel.findOne({ where: { id: id } });
		const result = (data) ? new ZonaEntrega(...data.getDataValues()) : null;

		return result;
	}

	async add(row:ZonaEntrega) {
		const data = await ZonaEntregaModel.create({
			idCuenta: row.idCuenta,
			idTipoControlador: row.idTipoControlador,
			email: row.email
		});
		const result = new ZonaEntrega(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:ZonaEntrega) {
		const affectedCount = await ZonaEntregaModel.update({
			idCuenta: row.idCuenta,
			idTipoControlador: row.idTipoControlador,
			email: row.email
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await ZonaEntregaModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new ZonaEntrega(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await ZonaEntregaModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

}
