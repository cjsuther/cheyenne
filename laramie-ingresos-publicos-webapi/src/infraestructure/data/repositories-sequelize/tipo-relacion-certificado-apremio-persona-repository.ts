import ITipoRelacionCertificadoApremioPersonaRepository from '../../../domain/repositories/tipo-relacion-certificado-apremio-persona-repository';
import TipoRelacionCertificadoApremioPersonaModel from './models/tipo-relacion-certificado-apremio-persona-model';
import TipoRelacionCertificadoApremioPersona from '../../../domain/entities/tipo-relacion-certificado-apremio-persona';

export default class TipoRelacionCertificadoApremioPersonaRepositorySequelize implements ITipoRelacionCertificadoApremioPersonaRepository {

	constructor() {

	}

	async list() {
		const data = await TipoRelacionCertificadoApremioPersonaModel.findAll();
		const result = data.map((row) => new TipoRelacionCertificadoApremioPersona(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await TipoRelacionCertificadoApremioPersonaModel.findOne({ where: { id: id } });
		const result = (data) ? new TipoRelacionCertificadoApremioPersona(...data.getDataValues()) : null;

		return result;
	}

	async add(row:TipoRelacionCertificadoApremioPersona) {
		const data = await TipoRelacionCertificadoApremioPersonaModel.create({
			codigo: row.codigo,
			descripcion: row.descripcion,
			idTipoControlador: row.idTipoControlador
		});
		const result = new TipoRelacionCertificadoApremioPersona(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:TipoRelacionCertificadoApremioPersona) {
		const affectedCount = await TipoRelacionCertificadoApremioPersonaModel.update({
			codigo: row.codigo,
			descripcion: row.descripcion,
			idTipoControlador: row.idTipoControlador
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await TipoRelacionCertificadoApremioPersonaModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new TipoRelacionCertificadoApremioPersona(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await TipoRelacionCertificadoApremioPersonaModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

}
