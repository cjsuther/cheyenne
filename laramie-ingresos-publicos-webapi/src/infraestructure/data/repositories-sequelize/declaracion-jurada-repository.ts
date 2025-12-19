import IDeclaracionJuradaRepository from '../../../domain/repositories/declaracion-jurada-repository';
import DeclaracionJuradaModel from './models/declaracion-jurada-model';
import DeclaracionJurada from '../../../domain/entities/declaracion-jurada';
import DeclaracionJuradaState from '../../../domain/dto/declaracion-jurada-state';

export default class DeclaracionJuradaRepositorySequelize implements IDeclaracionJuradaRepository {

	constructor() {

	}

	async listByCuenta(idCuenta: number) {
		const data = await DeclaracionJuradaModel.findAll({where: { idCuenta: idCuenta }});
		const result = data.map((row) => new DeclaracionJuradaState(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await DeclaracionJuradaModel.findOne({ where: { id: id } });
		const result = (data) ? new DeclaracionJurada(...data.getDataValues()) : null;

		return result;
	}

	async add(row:DeclaracionJurada) {
		const data = await DeclaracionJuradaModel.create({
			idCuenta: row.idCuenta,
			idTipoTributo: row.idTipoTributo,
			idTributo: row.idTributo,
			idTasa: row.idTasa,
			idSubTasa: row.idSubTasa,
			fechaPresentacionDDJJ: row.fechaPresentacionDDJJ,
			anioDeclaracion: row.anioDeclaracion,
			mesDeclaracion: row.mesDeclaracion,
			numero: row.numero,
			idTipoDDJJ: row.idTipoDDJJ,
			valorDeclaracion: row.valorDeclaracion,
			fechaAlta: row.fechaAlta,
			fechaBaja: row.fechaBaja,
			resolucion: row.resolucion
		});
		const result = new DeclaracionJurada(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:DeclaracionJurada) {
		const affectedCount = await DeclaracionJuradaModel.update({
			idCuenta: row.idCuenta,
			idTipoTributo: row.idTipoTributo,
			idTributo: row.idTributo,
			idTasa: row.idTasa,
			idSubTasa: row.idSubTasa,
			fechaPresentacionDDJJ: row.fechaPresentacionDDJJ,
			anioDeclaracion: row.anioDeclaracion,
			mesDeclaracion: row.mesDeclaracion,
			numero: row.numero,
			idTipoDDJJ: row.idTipoDDJJ,
			valorDeclaracion: row.valorDeclaracion,
			fechaAlta: row.fechaAlta,
			fechaBaja: row.fechaBaja,
			resolucion: row.resolucion
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await DeclaracionJuradaModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new DeclaracionJurada(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await DeclaracionJuradaModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

}
