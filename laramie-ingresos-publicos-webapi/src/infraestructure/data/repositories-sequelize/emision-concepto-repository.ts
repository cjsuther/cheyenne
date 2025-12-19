import IEmisionConceptoRepository from '../../../domain/repositories/emision-concepto-repository';
import EmisionConceptoModel from './models/emision-concepto-model';
import EmisionConcepto from '../../../domain/entities/emision-concepto';
import EmisionConceptoState from '../../../domain/dto/emision-concepto-state';

export default class EmisionConceptoRepositorySequelize implements IEmisionConceptoRepository {

	constructor() {

	}

	async list() {
		const data = await EmisionConceptoModel.findAll();
		const result = data.map((row) => new EmisionConcepto(...row.getDataValues()));

		return result;
	}

	async listByEmisionDefinicion(idEmisionDefinicion:number) {
		const data = await EmisionConceptoModel.findAll({ where: { idEmisionDefinicion: idEmisionDefinicion } });
		const result = data.map((row) => new EmisionConceptoState(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await EmisionConceptoModel.findOne({ where: { id: id } });
		const result = (data) ? new EmisionConcepto(...data.getDataValues()) : null;

		return result;
	}

	async add(row:EmisionConcepto) {
		const data = await EmisionConceptoModel.create({
			idEmisionDefinicion: row.idEmisionDefinicion,
			idTasa: row.idTasa,
			idSubTasa: row.idSubTasa,
			idTipoMovimiento: row.idTipoMovimiento,
			descripcion: row.descripcion,
			formulaCondicion: row.formulaCondicion,
			formulaImporteTotal: row.formulaImporteTotal,
			formulaImporteNeto: row.formulaImporteNeto,
			vencimiento: row.vencimiento,
			orden: row.orden,
			soloLectura: row.soloLectura
		});
		const result = new EmisionConcepto(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:EmisionConcepto) {
		const affectedCount = await EmisionConceptoModel.update({
			idEmisionDefinicion: row.idEmisionDefinicion,
			idTasa: row.idTasa,
			idSubTasa: row.idSubTasa,
			idTipoMovimiento: row.idTipoMovimiento,
			descripcion: row.descripcion,
			formulaCondicion: row.formulaCondicion,
			formulaImporteTotal: row.formulaImporteTotal,
			formulaImporteNeto: row.formulaImporteNeto,
			vencimiento: row.vencimiento,
			orden: row.orden
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await EmisionConceptoModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new EmisionConcepto(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await EmisionConceptoModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

	async removeByEmisionDefinicion(idEmisionDefinicion:number) {
		const affectedCount = await EmisionConceptoModel.destroy({ where: { idEmisionDefinicion: idEmisionDefinicion } });
		const result = (affectedCount > 0) ? {idEmisionDefinicion} : null;
		
		return result;
	}

}
