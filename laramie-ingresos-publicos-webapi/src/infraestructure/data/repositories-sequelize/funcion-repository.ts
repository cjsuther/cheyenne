import IFuncionRepository from '../../../domain/repositories/funcion-repository';
import FuncionModel from './models/funcion-model';
import FuncionParametroModel from './models/funcion-parametro-model';
import Funcion from '../../../domain/entities/funcion';
import FuncionParametro from '../../../domain/entities/funcion-parametro';

export default class FuncionRepositorySequelize implements IFuncionRepository {

	constructor() {

	}

	async list() {
		const data = await FuncionModel.findAll({
            include: [
				{ model: FuncionParametroModel, as: 'funcionParametro' }
            ]
		});
		const result = data.map((row) => {
			const funcionParametro = row["funcionParametro"];

			let funcion = new Funcion(...row.getDataValues());
			funcion.funcionParametros = (funcionParametro.map((detalle) => new FuncionParametro(...detalle.getDataValues())) as Array<FuncionParametro>).sort((a, b) => a.orden - b.orden);

			return funcion;
		});

		return result;
	}

	async findById(id:number) {
		const data = await FuncionModel.findOne({ where: { id: id } });
		const result = (data) ? new Funcion(...data.getDataValues()) : null;

		return result;
	}

	async add(row:Funcion) {
		const data = await FuncionModel.create({
			idCategoriaFuncion: row.idCategoriaFuncion,
			codigo: row.codigo,
			nombre: row.nombre,
			descripcion: row.descripcion,
			tipoDato: row.tipoDato,
			modulo: row.modulo
		});
		const result = new Funcion(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:Funcion) {
		const affectedCount = await FuncionModel.update({
			idCategoriaFuncion: row.idCategoriaFuncion,
			codigo: row.codigo,
			nombre: row.nombre,
			descripcion: row.descripcion,
			tipoDato: row.tipoDato,
			modulo: row.modulo
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await FuncionModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new Funcion(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await FuncionModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

}
