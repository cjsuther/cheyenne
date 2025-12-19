import ISuperficieRepository from '../../../domain/repositories/superficie-repository';
import SuperficieModel from './models/superficie-model';
import Superficie from '../../../domain/entities/superficie';
import SuperficieState from '../../../domain/dto/superficie-state';

export default class SuperficieRepositorySequelize implements ISuperficieRepository {

	constructor() {

	}

	async listByInmueble(idInmueble: number) {
		const data = await SuperficieModel.findAll({where: { idInmueble: idInmueble }});
		const result = data.map((row) => new SuperficieState(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await SuperficieModel.findOne({ where: { id: id } });
		const result = (data) ? new Superficie(...data.getDataValues()) : null;

		return result;
	}

	async add(row:Superficie) {
		const data = await SuperficieModel.create({
			idInmueble: row.idInmueble,
			nroSuperficie: row.nroSuperficie,
			nroInterno: row.nroInterno,
			nroDeclaracionJurada: row.nroDeclaracionJurada,
			idTipoSuperficie: row.idTipoSuperficie,
			metros: row.metros,
			plano: row.plano,
			idGrupoSuperficie: row.idGrupoSuperficie,
			idTipoObraSuperficie: row.idTipoObraSuperficie,
			idDestinoSuperficie: row.idDestinoSuperficie,
			fechaIntimacion: row.fechaIntimacion,
			nroIntimacion: row.nroIntimacion,
			nroAnterior: row.nroAnterior,
			fechaPresentacion: row.fechaPresentacion,
			fechaVigenteDesde: row.fechaVigenteDesde,
			fechaRegistrado: row.fechaRegistrado,
			fechaPermisoProvisorio: row.fechaPermisoProvisorio,
			fechaAprobacion: row.fechaAprobacion,
			conformeObra: row.conformeObra,
			fechaFinObra: row.fechaFinObra,
			ratificacion: row.ratificacion,
			derechos: row.derechos
		});
		const result = new Superficie(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:Superficie) {
		const affectedCount = await SuperficieModel.update({
			idInmueble: row.idInmueble,
			nroSuperficie: row.nroSuperficie,
			nroInterno: row.nroInterno,
			nroDeclaracionJurada: row.nroDeclaracionJurada,
			idTipoSuperficie: row.idTipoSuperficie,
			metros: row.metros,
			plano: row.plano,
			idGrupoSuperficie: row.idGrupoSuperficie,
			idTipoObraSuperficie: row.idTipoObraSuperficie,
			idDestinoSuperficie: row.idDestinoSuperficie,
			fechaIntimacion: row.fechaIntimacion,
			nroIntimacion: row.nroIntimacion,
			nroAnterior: row.nroAnterior,
			fechaPresentacion: row.fechaPresentacion,
			fechaVigenteDesde: row.fechaVigenteDesde,
			fechaRegistrado: row.fechaRegistrado,
			fechaPermisoProvisorio: row.fechaPermisoProvisorio,
			fechaAprobacion: row.fechaAprobacion,
			conformeObra: row.conformeObra,
			fechaFinObra: row.fechaFinObra,
			ratificacion: row.ratificacion,
			derechos: row.derechos
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await SuperficieModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new Superficie(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await SuperficieModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

	async removeByInmueble(idInmueble: number) {
		const affectedCount = await SuperficieModel.destroy({ where: { idInmueble: idInmueble } });
		const result = (affectedCount > 0) ? {idInmueble} : null;
		
		return result;
	}

}