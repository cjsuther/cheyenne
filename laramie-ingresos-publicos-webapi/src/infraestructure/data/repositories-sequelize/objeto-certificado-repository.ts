import IObjetoCertificadoRepository from '../../../domain/repositories/objeto-certificado-repository';
import ObjetoCertificadoModel from './models/objeto-certificado-model';
import ObjetoCertificado from '../../../domain/entities/objeto-certificado';

export default class ObjetoCertificadoRepositorySequelize implements IObjetoCertificadoRepository {

	constructor() {

	}

	async list() {
		const data = await ObjetoCertificadoModel.findAll();
		const result = data.map((row) => new ObjetoCertificado(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await ObjetoCertificadoModel.findOne({ where: { id: id } });
		const result = (data) ? new ObjetoCertificado(...data.getDataValues()) : null;

		return result;
	}

	async add(row:ObjetoCertificado) {
		const data = await ObjetoCertificadoModel.create({
			codigo: row.codigo,
			nombre: row.nombre,
			orden: row.orden,
			actualizaPropietario: row.actualizaPropietario
		});
		const result = new ObjetoCertificado(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:ObjetoCertificado) {
		const affectedCount = await ObjetoCertificadoModel.update({
			codigo: row.codigo,
			nombre: row.nombre,
			orden: row.orden,
			actualizaPropietario: row.actualizaPropietario
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await ObjetoCertificadoModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new ObjetoCertificado(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await ObjetoCertificadoModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

}
