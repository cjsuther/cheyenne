import IDeclaracionJuradaRubroRepository from '../../../domain/repositories/declaracion-jurada-rubro-repository';
import DeclaracionJuradaRubroModel from './models/declaracion-jurada-rubro-model';
import DeclaracionJuradaRubro from '../../../domain/entities/declaracion-jurada-rubro';

export default class DeclaracionJuradaRubroRepositorySequelize implements IDeclaracionJuradaRubroRepository {

	constructor() {

	}

	async list() {
		const data = await DeclaracionJuradaRubroModel.findAll();
		const result = data.map((row) => new DeclaracionJuradaRubro(...row.getDataValues()));

		return result;
	}
	
	async listByDeclaracionJuradaComercio(idDeclaracionJuradaComercio: number) {
		const data = await DeclaracionJuradaRubroModel.findAll({where: { idDeclaracionJuradaComercio: idDeclaracionJuradaComercio }});
		const result = data.map((row) => new DeclaracionJuradaRubro(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await DeclaracionJuradaRubroModel.findOne({ where: { id: id } });
		const result = (data) ? new DeclaracionJuradaRubro(...data.getDataValues()) : null;

		return result;
	}

	async add(row:DeclaracionJuradaRubro) {
		const data = await DeclaracionJuradaRubroModel.create({
			idDeclaracionJuradaComercio: row.idDeclaracionJuradaComercio,
			idRubroComercio: row.idRubroComercio,
			importeIngresosBrutos: row.importeIngresosBrutos,
			importeDeducciones: row.importeDeducciones,
			importeIngresosNetos: row.importeIngresosNetos
		});
		const result = new DeclaracionJuradaRubro(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:DeclaracionJuradaRubro) {
		const affectedCount = await DeclaracionJuradaRubroModel.update({
			idDeclaracionJuradaComercio: row.idDeclaracionJuradaComercio,
			idRubroComercio: row.idRubroComercio,
			importeIngresosBrutos: row.importeIngresosBrutos,
			importeDeducciones: row.importeDeducciones,
			importeIngresosNetos: row.importeIngresosNetos
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await DeclaracionJuradaRubroModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new DeclaracionJuradaRubro(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await DeclaracionJuradaRubroModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

}
