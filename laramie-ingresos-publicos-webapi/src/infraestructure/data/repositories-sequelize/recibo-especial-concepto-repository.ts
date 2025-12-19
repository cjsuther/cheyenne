import IReciboEspecialConceptoRepository from '../../../domain/repositories/recibo-especial-concepto-repository';
import ReciboEspecialConceptoModel from './models/recibo-especial-concepto-model';
import ReciboEspecialConcepto from '../../../domain/entities/recibo-especial-concepto';
import ReciboEspecialConceptoState from '../../../domain/dto/recibo-especial-concepto-state';

export default class ReciboEspecialConceptoRepositorySequelize implements IReciboEspecialConceptoRepository {

	constructor() {

	}

	async listByReciboEspecial(idReciboEspecial: number) {
		const data = await ReciboEspecialConceptoModel.findAll({where: { idReciboEspecial: idReciboEspecial }});
		const result = data.map((row) => new ReciboEspecialConceptoState(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await ReciboEspecialConceptoModel.findOne({ where: { id: id } });
		const result = (data) ? new ReciboEspecialConcepto(...data.getDataValues()) : null;

		return result;
	}

	async add(row:ReciboEspecialConcepto) {
		const data = await ReciboEspecialConceptoModel.create({
			idReciboEspecial : row.idReciboEspecial ,
			idTasa : row.idTasa ,
			idSubTasa : row.idSubTasa ,
			valor : row.valor
		});
		const result = new ReciboEspecialConcepto(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:ReciboEspecialConcepto) {
		const affectedCount = await ReciboEspecialConceptoModel.update({
			idReciboEspecial : row.idReciboEspecial ,
			idTasa : row.idTasa ,
			idSubTasa : row.idSubTasa ,
			valor : row.valor
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await ReciboEspecialConceptoModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new ReciboEspecialConcepto(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await ReciboEspecialConceptoModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

	async removeByReciboEspecial(idReciboEspecial: number) {
		const affectedCount = await ReciboEspecialConceptoModel.destroy({ where: { idReciboEspecial: idReciboEspecial } });
		const result = (affectedCount > 0) ? {idReciboEspecial} : null;
		
		return result;
	}

}
