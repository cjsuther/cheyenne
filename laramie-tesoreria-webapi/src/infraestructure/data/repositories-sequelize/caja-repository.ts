import { Sequelize } from 'sequelize';
import { getNamespace } from 'cls-hooked';
import ICajaRepository from '../../../domain/repositories/caja-repository';
import Caja from '../../../domain/entities/caja';
import CajaAsignacion from '../../../domain/entities/caja-asignacion';
import CajaModel from './models/caja-model';
import CajaAsignacionModel from './models/caja-asignacion-model';
import './models/caja-associations-model';

export default class CajaRepositorySequelize implements ICajaRepository {

	constructor() {

	}

	async list() {
		const data = await CajaModel.findAll({
            include: [
				{ model: CajaAsignacionModel, as: 'cajaAsignacion' }
            ]
		});
		const result = data.map((row) => {
			const caja = new Caja(...row.getDataValues());
			const rowCajaAsignacion = row["cajaAsignacion"];
			if (rowCajaAsignacion) {
				caja.cajaAsignacion = new CajaAsignacion(...rowCajaAsignacion.getDataValues());
			}

			return caja;
		});

		return result;
	}

	async listByDependencia(idDependencia:number) {
		const data = await CajaModel.findAll({ where: { idDependencia: idDependencia } });
		const result = data.map((row) => new Caja(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await CajaModel.findOne({ where: { id: id } });
		const result = (data) ? new Caja(...data.getDataValues()) : null;

		return result;
	}

	async findByUsuario(idUsuario:number) {
		const data = await CajaModel.findOne({ where: { idUsuarioActual: idUsuario } });
		const result = (data) ? new Caja(...data.getDataValues()) : null;

		return result;
	}

	async add(row:Caja) {
		const data = await CajaModel.create({
			codigo: row.codigo,
			nombre: row.nombre,
			orden: row.orden,
			idDependencia: row.idDependencia,
			idEstadoCaja: row.idEstadoCaja,
			idUsuarioActual: row.idUsuarioActual,
			idCajaAsignacionActual: row.idCajaAsignacionActual,
			idRecaudadora: row.idRecaudadora
		});
		const result = new Caja(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:Caja) {
		const affectedCount = await CajaModel.update({
			codigo: row.codigo,
			nombre: row.nombre,
			orden: row.orden,
			idDependencia: row.idDependencia,
			idEstadoCaja: row.idEstadoCaja,
			idUsuarioActual: row.idUsuarioActual,
			idCajaAsignacionActual: row.idCajaAsignacionActual,
			idRecaudadora: row.idRecaudadora
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await CajaModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new Caja(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await CajaModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

		
	async onTransaction(request) {
		const localStorage = getNamespace('LocalStorage');
		Sequelize.useCLS(localStorage);

		return await CajaModel.sequelize.transaction(async (t) => {
			return request();
		});
	}

}
