import IProcesoRepository from '../../../domain/repositories/proceso-repository';
import ProcesoModel from './models/proceso-model';
import Proceso from '../../../domain/entities/proceso';
import { PROCESO_STATE } from '../../sdk/consts/procesoState';
import { isNull } from '../../sdk/utils/validator';
import { getDateNow } from '../../sdk/utils/convert';

export default class ProcesoRepositorySequelize implements IProcesoRepository {

	constructor() {

	}

	async list() {
		const data = await ProcesoModel.findAll();
		const result = data.map((row) => new Proceso(...row.getDataValues()));

		return result;
	}

	async listByEntidad(entidad:string) {
		const data = await ProcesoModel.findAll({ where: { entidad: entidad } });
		const result = data.map((row) => new Proceso(...row.getDataValues()));

		return result;
	}

	async listByEstadoProceso(idEstadoProceso:number) {
		const data = await ProcesoModel.findAll({ where: { idEstadoProceso: idEstadoProceso } });
		const result = data.map((row) => new Proceso(...row.getDataValues()));

		return result;
	}

	async listReady() {
		const data = await ProcesoModel.findAll({ where: { idEstadoProceso: PROCESO_STATE.PENDIENTE} });
		const result = data.map((row) => new Proceso(...row.getDataValues()))
						   .filter(f => isNull(f.fechaProceso) || f.fechaProceso <= getDateNow(true));

		return result;
	}

	async findById(id:number) {
		const data = await ProcesoModel.findOne({ where: { id: id } });
		const result = (data) ? new Proceso(...data.getDataValues()) : null;

		return result;
	}

	async findByIdentificador(identificador:string) {
		const data = await ProcesoModel.findOne({ where: { identificador: identificador } });
		const result = (data) ? new Proceso(...data.getDataValues()) : null;

		return result;
	}

	async add(row:Proceso) {
		const data = await ProcesoModel.create({
			identificador: row.identificador,
			entidad: row.entidad,
			idProcesoProgramacion: row.idProcesoProgramacion,
			idEstadoProceso: row.idEstadoProceso,
			fechaProceso: row.fechaProceso,
			fechaInicio: row.fechaInicio,
			fechaFin: row.fechaFin,
			descripcion: row.descripcion,
			observacion: row.observacion,
			avance: row.avance,
			origen: row.origen,
			idUsuarioCreacion: row.idUsuarioCreacion,
			fechaCreacion: row.fechaCreacion,
			urlEjecucion: row.urlEjecucion
		});
		const result = new Proceso(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:Proceso) {
		const affectedCount = await ProcesoModel.update({
			identificador: row.identificador,
			entidad: row.entidad,
			idProcesoProgramacion: row.idProcesoProgramacion,
			idEstadoProceso: row.idEstadoProceso,
			fechaProceso: row.fechaProceso,
			fechaInicio: row.fechaInicio,
			fechaFin: row.fechaFin,
			descripcion: row.descripcion,
			observacion: row.observacion,
			avance: row.avance,
			origen: row.origen,
			idUsuarioCreacion: row.idUsuarioCreacion,
			fechaCreacion: row.fechaCreacion,
			urlEjecucion: row.urlEjecucion
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await ProcesoModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new Proceso(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await ProcesoModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

}
