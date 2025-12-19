import IOrganoJudicialRepository from '../../../domain/repositories/organo-judicial-repository';
import OrganoJudicialModel from './models/organo-judicial-model';
import OrganoJudicial from '../../../domain/entities/organo-judicial';

export default class OrganoJudicialRepositorySequelize implements IOrganoJudicialRepository {

	constructor() {

	}

	async list() {
		const data = await OrganoJudicialModel.findAll();
		const result = data.map((row) => new OrganoJudicial(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await OrganoJudicialModel.findOne({ where: { id: id } });
		const result = (data) ? new OrganoJudicial(...data.getDataValues()) : null;

		return result;
	}

	async add(row:OrganoJudicial) {
		const data = await OrganoJudicialModel.create({
			codigoOrganoJudicial: row.codigoOrganoJudicial,
			departamentoJudicial: row.departamentoJudicial,
			fuero: row.fuero,
			secretaria: row.secretaria
		});
		const result = new OrganoJudicial(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:OrganoJudicial) {
		const affectedCount = await OrganoJudicialModel.update({
			codigoOrganoJudicial: row.codigoOrganoJudicial,
			departamentoJudicial: row.departamentoJudicial,
			fuero: row.fuero,
			secretaria: row.secretaria
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await OrganoJudicialModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new OrganoJudicial(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await OrganoJudicialModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

}
