import IValuacionRepository from '../../../domain/repositories/valuacion-repository';
import ValuacionModel from './models/valuacion-model';
import Valuacion from '../../../domain/entities/valuacion';
import ValuacionState from '../../../domain/dto/valuacion-state';

export default class ValuacionRepositorySequelize implements IValuacionRepository {

	constructor() {

	}

	async listByInmueble(idInmueble: number) {
		const data = await ValuacionModel.findAll({where: { idInmueble: idInmueble }});
		const result = data.map((row) => new ValuacionState(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await ValuacionModel.findOne({ where: { id: id } });
		const result = (data) ? new Valuacion(...data.getDataValues()) : null;

		return result;
	}

	async add(row:Valuacion) {
		const data = await ValuacionModel.create({
			idInmueble: row.idInmueble,
			idTipoValuacion: row.idTipoValuacion,
			ejercicio: row.ejercicio,
			mes: row.mes,
			valor: row.valor
		});
		const result = new Valuacion(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:Valuacion) {
		const affectedCount = await ValuacionModel.update({
			idInmueble: row.idInmueble,
			idTipoValuacion: row.idTipoValuacion,
			ejercicio: row.ejercicio,
			mes: row.mes,
			valor: row.valor
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await ValuacionModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new Valuacion(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await ValuacionModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

	async removeByInmueble(idInmueble: number) {
		const affectedCount = await ValuacionModel.destroy({ where: { idInmueble: idInmueble } });
		const result = (affectedCount > 0) ? {idInmueble} : null;
		
		return result;
	}

}
