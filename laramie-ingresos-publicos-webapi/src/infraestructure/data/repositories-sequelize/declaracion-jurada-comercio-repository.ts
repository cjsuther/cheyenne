import IDeclaracionJuradaComercioRepository from '../../../domain/repositories/declaracion-jurada-comercio-repository';
import DeclaracionJuradaComercioModel from './models/declaracion-jurada-comercio-model';
import DeclaracionJuradaComercio from '../../../domain/entities/declaracion-jurada-comercio';

export default class DeclaracionJuradaComercioRepositorySequelize implements IDeclaracionJuradaComercioRepository {

	constructor() {

	}

	async list() {
		const data = await DeclaracionJuradaComercioModel.findAll();
		const result = data.map((row) => new DeclaracionJuradaComercio(...row.getDataValues()));

		return result;
	}

	async listByCuenta(idCuenta: number) {
		const data = await DeclaracionJuradaComercioModel.findAll({where: { idCuenta: idCuenta }});
		const result = data.map((row) => new DeclaracionJuradaComercio(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await DeclaracionJuradaComercioModel.findOne({ where: { id: id } });
		const result = (data) ? new DeclaracionJuradaComercio(...data.getDataValues()) : null;

		return result;
	}

	async add(row:DeclaracionJuradaComercio) {
		const data = await DeclaracionJuradaComercioModel.create({
			idCuenta: row.idCuenta,
			fechaPresentacionDDJJ: row.fechaPresentacionDDJJ,
			anioDeclaracion: row.anioDeclaracion,
			mesDeclaracion: row.mesDeclaracion,
			numero: row.numero,
			idTipoDDJJ: row.idTipoDDJJ,
			fechaAlta: row.fechaAlta,
			fechaBaja: row.fechaBaja,
			resolucion: row.resolucion,
			titulares: row.titulares,
			dependientes: row.dependientes,
			importeExportaciones: row.importeExportaciones,
			importeTotalPais: row.importeTotalPais
		});
		const result = new DeclaracionJuradaComercio(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:DeclaracionJuradaComercio) {
		const affectedCount = await DeclaracionJuradaComercioModel.update({
			idCuenta: row.idCuenta,
			fechaPresentacionDDJJ: row.fechaPresentacionDDJJ,
			anioDeclaracion: row.anioDeclaracion,
			mesDeclaracion: row.mesDeclaracion,
			numero: row.numero,
			idTipoDDJJ: row.idTipoDDJJ,
			fechaAlta: row.fechaAlta,
			fechaBaja: row.fechaBaja,
			resolucion: row.resolucion,
			titulares: row.titulares,
			dependientes: row.dependientes,
			importeExportaciones: row.importeExportaciones,
			importeTotalPais: row.importeTotalPais
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await DeclaracionJuradaComercioModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new DeclaracionJuradaComercio(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await DeclaracionJuradaComercioModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

}
