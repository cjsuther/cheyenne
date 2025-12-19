import IInspeccionRepository from '../../../domain/repositories/inspeccion-repository';
import InspeccionModel from './models/inspeccion-model';
import Inspeccion from '../../../domain/entities/inspeccion';
import InspeccionState from '../../../domain/dto/inspeccion-state';

export default class InspeccionRepositorySequelize implements IInspeccionRepository {

	constructor() {

	}

	async listByComercio(idComercio: number) {
		const data = await InspeccionModel.findAll({where: { idComercio: idComercio }});
		const result = data.map((row) => new InspeccionState(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await InspeccionModel.findOne({ where: { id: id } });
		const result = (data) ? new Inspeccion(...data.getDataValues()) : null;

		return result;
	}

	async add(row:Inspeccion) {
		const data = await InspeccionModel.create({
			idComercio: row.idComercio,
			numero: row.numero,
			idMotivoInspeccion: row.idMotivoInspeccion,
			idSupervisor: row.idSupervisor,
			idInspector: row.idInspector,
			fechaInicio: row.fechaInicio,
			fechaFinalizacion: row.fechaFinalizacion,
			fechaNotificacion: row.fechaNotificacion,
			fechaBaja: row.fechaBaja,
			anioDesde: row.anioDesde,
			mesDesde: row.mesDesde,
			anioHasta: row.anioHasta,
			mesHasta: row.mesHasta,
			numeroResolucion: row.numeroResolucion,
			letraResolucion: row.letraResolucion,
			anioResolucion: row.anioResolucion,
			fechaResolucion: row.fechaResolucion,
			numeroLegajillo: row.numeroLegajillo,
			letraLegajillo: row.letraLegajillo,
			anioLegajillo: row.anioLegajillo,
			activo: row.activo,
			porcentajeMulta: row.porcentajeMulta,
			emiteConstancia: row.emiteConstancia,
			pagaPorcentaje: row.pagaPorcentaje,
			idExpediente: row.idExpediente
		});
		const result = new Inspeccion(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:Inspeccion) {
		const affectedCount = await InspeccionModel.update({
			idComercio: row.idComercio,
			numero: row.numero,
			idMotivoInspeccion: row.idMotivoInspeccion,
			idSupervisor: row.idSupervisor,
			idInspector: row.idInspector,
			fechaInicio: row.fechaInicio,
			fechaFinalizacion: row.fechaFinalizacion,
			fechaNotificacion: row.fechaNotificacion,
			fechaBaja: row.fechaBaja,
			anioDesde: row.anioDesde,
			mesDesde: row.mesDesde,
			anioHasta: row.anioHasta,
			mesHasta: row.mesHasta,
			numeroResolucion: row.numeroResolucion,
			letraResolucion: row.letraResolucion,
			anioResolucion: row.anioResolucion,
			fechaResolucion: row.fechaResolucion,
			numeroLegajillo: row.numeroLegajillo,
			letraLegajillo: row.letraLegajillo,
			anioLegajillo: row.anioLegajillo,
			activo: row.activo,
			porcentajeMulta: row.porcentajeMulta,
			emiteConstancia: row.emiteConstancia,
			pagaPorcentaje: row.pagaPorcentaje,
			idExpediente: row.idExpediente
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await InspeccionModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new Inspeccion(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await InspeccionModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

	async removeByComercio(idComercio: number) {
		const affectedCount = await InspeccionModel.destroy({ where: { idComercio: idComercio } });
		const result = (affectedCount > 0) ? {idComercio} : null;
		
		return result;
	}

}
