import { Sequelize, Op  } from 'sequelize';
import { getNamespace } from 'cls-hooked';
import IApremioRepository from '../../../domain/repositories/apremio-repository';
import ApremioModel from './models/apremio-model';
import Apremio from '../../../domain/entities/apremio';
import ApremioFilter from '../../../domain/dto/apremio-filter';

export default class ApremioRepositorySequelize implements IApremioRepository {

	constructor() {

	}

	async list() {
		const data = await ApremioModel.findAll();
		const result = data.map((row) => new Apremio(...row.getDataValues()));

		return result;
	}

	async listByFilter(apremioFilter: ApremioFilter) {

		let filters = {};
		if (apremioFilter.numero.length > 0) filters["numero"] = apremioFilter.numero;
		if (apremioFilter.caratula.length > 0) filters["caratula"] = {[Op.like]: `%${apremioFilter.caratula}%`};
		if (apremioFilter.idExpediente > 0) filters["idExpediente"] = apremioFilter.idExpediente;
		if (apremioFilter.idOrganismoJudicial > 0) filters["idOrganismoJudicial"] = apremioFilter.idOrganismoJudicial;
		if (apremioFilter.fechaInicioDemandaDesde !== null && apremioFilter.fechaInicioDemandaHasta !== null) {
			filters["fechaInicioDemanda"] = {
				[Op.gte]: apremioFilter.fechaInicioDemandaDesde,
				[Op.lte]: apremioFilter.fechaInicioDemandaHasta
			};
		}
		else {
			if (apremioFilter.fechaInicioDemandaDesde !== null) filters["fechaInicioDemanda"] = {[Op.gte]: apremioFilter.fechaInicioDemandaDesde};
			if (apremioFilter.fechaInicioDemandaHasta !== null) filters["fechaInicioDemanda"] = {[Op.lte]: apremioFilter.fechaInicioDemandaHasta};
		}
	
		let data = null;
		if (apremioFilter.numero.length === 0 &&
			apremioFilter.caratula.length === 0 &&
			apremioFilter.idExpediente === 0 &&
			apremioFilter.idOrganismoJudicial === 0 &&
			apremioFilter.fechaInicioDemandaDesde === null &&
			apremioFilter.fechaInicioDemandaHasta === null) {
			data = await ApremioModel.findAll();
		}
		else {
			data = await ApremioModel.findAll({ where: filters });
		}
		const result = data.map((row) => new Apremio(...row.getDataValues()));

        return result;
    }

	async findById(id:number) {
		const data = await ApremioModel.findOne({ where: { id: id } });
		const result = (data) ? new Apremio(...data.getDataValues()) : null;

		return result;
	}

	async add(row:Apremio) {
		const data = await ApremioModel.create({
			numero: row.numero,
			idExpediente: row.idExpediente,
			idOrganismoJudicial: row.idOrganismoJudicial,
			fechaInicioDemanda: row.fechaInicioDemanda,
			carpeta: row.carpeta,
			caratula: row.caratula,
			estado: row.estado
		});
		const result = new Apremio(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:Apremio) {
		const affectedCount = await ApremioModel.update({
			idExpediente: row.idExpediente,
			idOrganismoJudicial: row.idOrganismoJudicial,
			fechaInicioDemanda: row.fechaInicioDemanda,
			carpeta: row.carpeta,
			caratula: row.caratula,
			estado: row.estado
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await ApremioModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new Apremio(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await ApremioModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

	async onTransaction(request) {
		const localStorage = getNamespace('LocalStorage');
		Sequelize.useCLS(localStorage);

		return await ApremioModel.sequelize.transaction(async (t) => {
			return request();
		});
	}

}
