import { Sequelize } from 'sequelize';
import { getNamespace } from 'cls-hooked';
import IReciboEspecialRepository from '../../../domain/repositories/recibo-especial-repository';
import ReciboEspecialModel from './models/recibo-especial-model';
import ReciboEspecialConceptoModel from './models/recibo-especial-concepto-model';
import ReciboEspecial from '../../../domain/entities/recibo-especial';
import ReciboEspecialConcepto from '../../../domain/entities/recibo-especial-concepto';

export default class ReciboEspecialRepositorySequelize implements IReciboEspecialRepository {

	constructor() {

	}

	async list() {
		const data = await ReciboEspecialModel.findAll({
			include: [
				{ 
					model: ReciboEspecialConceptoModel, as: 'reciboEspecialConcepto',
			 	}
            ]
		});
		const result = data.map((row) => {
			const reciboEspecialConcepto = row["reciboEspecialConcepto"];
			
			let reciboEspecial = new ReciboEspecial(...row.getDataValues());
			reciboEspecial.recibosEspecialConcepto = (reciboEspecialConcepto.map((concepto) => new ReciboEspecialConcepto(...concepto.getDataValues())) as Array<ReciboEspecialConcepto>).sort((a, b) => a.id - b.id);

			return reciboEspecial;
		});

		return result;
	}

	async findById(id:number) {
		const data = await ReciboEspecialModel.findOne({ where: { id: id } });
		const result = (data) ? new ReciboEspecial(...data.getDataValues()) : null;

		return result;
	}

	async add(row:ReciboEspecial) {
		const data = await ReciboEspecialModel.create({
			codigo : row.codigo ,
			descripcion : row.descripcion ,
			aplicaValorUF : row.aplicaValorUF 
		});
		const result = new ReciboEspecial(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:ReciboEspecial) {
		const affectedCount = await ReciboEspecialModel.update({
			codigo : row.codigo ,
			descripcion : row.descripcion ,
			aplicaValorUF : row.aplicaValorUF 
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await ReciboEspecialModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new ReciboEspecial(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await ReciboEspecialModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

	async onTransaction(request) {
		const localStorage = getNamespace('LocalStorage');
		Sequelize.useCLS(localStorage);

		return await ReciboEspecialModel.sequelize.transaction(async (t) => {
			return request();
		});
	}


}
