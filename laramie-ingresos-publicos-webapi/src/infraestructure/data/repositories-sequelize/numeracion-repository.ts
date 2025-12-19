import INumeracionRepository from '../../../domain/repositories/numeracion-repository';
import NumeracionModel from './models/numeracion-model';
import Numeracion from '../../../domain/entities/numeracion';

export default class NumeracionRepositorySequelize implements INumeracionRepository {

	constructor() {

	}

	async list() {
		const data = await NumeracionModel.findAll();
		const result = data.map((row) => new Numeracion(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await NumeracionModel.findOne({ where: { id: id } });
		const result = (data) ? new Numeracion(...data.getDataValues()) : null;

		return result;
	}

	async findByNombre(nombre:string) {
		const data = await NumeracionModel.findOne({ where: { nombre: nombre } });
		const result = (data) ? new Numeracion(...data.getDataValues()) : null;

		return result;
	}

	async findByProximo(nombre:string) {
        const result = await NumeracionModel.sequelize.query(
            `SELECT numeracion_proximo(:p_nombre);`,
            {
                replacements: {
                    p_nombre: nombre
                }
            }
        );

		const row = result[0][0];
		const value = parseInt(row["numeracion_proximo"]);

        return value;
	}

	async add(row:Numeracion) {
		const data = await NumeracionModel.create({
			nombre: row.nombre,
			valorProximo: row.valorProximo
		});
		const result = new Numeracion(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:Numeracion) {
		const affectedCount = await NumeracionModel.update({
			nombre: row.nombre,
			valorProximo: row.valorProximo
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await NumeracionModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new Numeracion(...data.getDataValues()) : null;

		return result;
	}

	async modifyByNombre(nombre:string, row:Numeracion) {
		const affectedCount = await NumeracionModel.update({
			valorProximo: row.valorProximo
		},
		{ where: { nombre: nombre } });

		const data = (affectedCount[0] > 0) ? await NumeracionModel.findOne({ where: { nombre: nombre } }) : null;
		const result = (data) ? new Numeracion(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await NumeracionModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

}
