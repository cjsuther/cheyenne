import IVariableRepository from '../../../domain/repositories/variable-repository';
import VariableModel from './models/variable-model';
import Variable from '../../../domain/entities/variable';

export default class VariableRepositorySequelize implements IVariableRepository {

	constructor() {

	}

	async list() {
		const data = await VariableModel.findAll();
		const result = data.map((row) => new Variable(...row.getDataValues()));

		return result;
	}

	async listByTipoTributo(idTipoTributo:number) {
		const data = await VariableModel.findAll({ where: { idTipoTributo: idTipoTributo } });
		const result = data.map((row) => new Variable(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await VariableModel.findOne({ where: { id: id } });
		const result = (data) ? new Variable(...data.getDataValues()) : null;

		return result;
	}

	async findByCodigo(codigo:string) {
		const data = await VariableModel.findOne({ where: { codigo: codigo } });
		const result = (data) ? new Variable(...data.getDataValues()) : null;

		return result;
	}

	async add(row:Variable) {
		const data = await VariableModel.create({
			codigo: row.codigo,
			descripcion: row.descripcion,
			idTipoTributo: row.idTipoTributo,
			tipoDato: row.tipoDato,
			constante: row.constante,
			predefinido: row.predefinido,
			opcional: row.opcional,
			activo: row.activo,
			global: row.global
		});
		const result = new Variable(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:Variable) {
		const affectedCount = await VariableModel.update({
			codigo: row.codigo,
			descripcion: row.descripcion,
			idTipoTributo: row.idTipoTributo,
			tipoDato: row.tipoDato,
			constante: row.constante,
			predefinido: row.predefinido,
			opcional: row.opcional,
			activo: row.activo,
			global: row.global
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await VariableModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new Variable(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		try {
			const affectedCount = await VariableModel.destroy({ where: { id: id } });
			const result = (affectedCount > 0) ? {id} : null;
			
			return result;
		}
		catch(error) {
			if (error.name === "SequelizeForeignKeyConstraintError") {
				return null;
			}
			else {
				throw error;
			}
		}
	}

}
