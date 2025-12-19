import IAccesoRepository from '../../../domain/repositories/acceso-repository';
import AccesoModel from './models/acceso-model';
import Acceso from '../../../domain/entities/acceso';

export default class AccesoRepositorySequelize implements IAccesoRepository {

	constructor() {

	}

	async list() {
		const data = await AccesoModel.findAll();
		const result = data.map((row) => new Acceso(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await AccesoModel.findOne({ where: { id: id } });
		const result = (data) ? new Acceso(...data.getDataValues()) : null;

		return result;
	}

	async findByIdentificador(identificador:string) {
		const data = await AccesoModel.findOne({ where: { identificador: identificador } });
		const result = (data) ? new Acceso(...data.getDataValues()) : null;

		return result;
	}

	async findByLogin(identificador:string, password:string, tipoAcceso: number) {
		const data = await AccesoModel.findOne({ where: { identificador: identificador, password: password, idTipoAcceso: tipoAcceso } });
		const result = (data) ? new Acceso(...data.getDataValues()) : null;

		return result;
	}

	async add(row:Acceso) {
		const data = await AccesoModel.create({
			idUsuario: row.idUsuario,
			idTipoAcceso: row.idTipoAcceso,
			identificador: row.identificador,
			password: row.password
		});
		const result = new Acceso(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:Acceso) {
		const affectedCount = await AccesoModel.update({
			idUsuario: row.idUsuario,
			idTipoAcceso: row.idTipoAcceso,
			identificador: row.identificador,
			password: row.password
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await AccesoModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new Acceso(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await AccesoModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

}
