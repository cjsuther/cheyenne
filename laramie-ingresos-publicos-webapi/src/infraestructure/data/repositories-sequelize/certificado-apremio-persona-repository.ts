import ICertificadoApremioPersonaRepository from '../../../domain/repositories/certificado-apremio-persona-repository';
import IPersonaRepository from '../../../domain/repositories/persona-repository';
import CertificadoApremioPersonaModel from './models/certificado-apremio-persona-model';
import CertificadoApremioPersona from '../../../domain/entities/certificado-apremio-persona';
import CertificadoApremioPersonaState from '../../../domain/dto/certificado-apremio-persona-state';
import PersonaModel from './models/persona-model';
import Persona from '../../../domain/entities/persona';

export default class CertificadoApremioPersonaRepositorySequelize implements ICertificadoApremioPersonaRepository {

	personaRepository: IPersonaRepository;

	constructor(personaRepository: IPersonaRepository) {
		this.personaRepository = personaRepository;

	}

	async listByCertificadoApremio(idCertificadoApremio: number) {
		const data = await CertificadoApremioPersonaModel.findAll({
			include: [
				{ model: PersonaModel, as: 'persona' }
			],
			where: { idCertificadoApremio: idCertificadoApremio }
		});
		const result = data.map((row) => this.ObjectToClass(row));

		return result;

	}

	async findById(id:number) {
		const data = await CertificadoApremioPersonaModel.findOne({
			include: [
				{ model: PersonaModel, as: 'persona' }
			],
			where: { id: id }
		});
		const result = (data) ? this.ObjectToClass(data) : null;

		return result;
	}

	async add(row:CertificadoApremioPersona) {
		const data = await CertificadoApremioPersonaModel.create({
			idCertificadoApremio: row.idCertificadoApremio,
			idTipoRelacionCertificadoApremioPersona: row.idTipoRelacionCertificadoApremioPersona,
			fechaDesde: row.fechaDesde,
			fechaHasta: row.fechaHasta,
			idPersona: row.idPersona,
		});
		const result = new CertificadoApremioPersona(...data.getDataValues());

		if (row.idPersona) {
			const persona = new Persona(
				row.idPersona,
				row.idTipoPersona,
				row.nombrePersona,
				row.idTipoDocumento,
				row.numeroDocumento
			);
			await this.personaRepository.checkById(row.idPersona, persona);
		}

		return result;
	}

	async modify(id:number, row:CertificadoApremioPersona) {
		const rowOriginal = await this.findById(id);

		const affectedCount = await CertificadoApremioPersonaModel.update({
			idCertificadoApremio: row.idCertificadoApremio,
			idTipoRelacionCertificadoApremioPersona: row.idTipoRelacionCertificadoApremioPersona,
			fechaDesde: row.fechaDesde,
			fechaHasta: row.fechaHasta,
			idPersona: row.idPersona,
		},
		{ where: { id: id } });

		let result = null;
		if (rowOriginal && affectedCount[0] > 0) {

			if (row.idPersona && row.idPersona !== rowOriginal.idPersona) {
				const persona = new Persona(
					row.idPersona,
					row.idTipoPersona,
					row.nombrePersona,
					row.idTipoDocumento,
					row.numeroDocumento
				);
				await this.personaRepository.checkById(row.idPersona, persona);
			}
		}

		const data =  await CertificadoApremioPersonaModel.findOne({ where: { id: id } });
		result = (data) ? new CertificadoApremioPersona(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await CertificadoApremioPersonaModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

	async removeByCertificadoApremio(idCertificadoApremio: number) {
		const affectedCount = await CertificadoApremioPersonaModel.destroy({ where: { idCertificadoApremio: idCertificadoApremio } });
		const result = (affectedCount > 0) ? {idCertificadoApremio} : null;

		return result;
	}

	ObjectToClass(row:any) {
		const persona = row["persona"];

		let certificadoApremioPersona = new CertificadoApremioPersonaState(...row.getDataValues());
		if (persona) {
			certificadoApremioPersona.idTipoPersona = parseInt(persona.idTipoPersona);
			certificadoApremioPersona.nombrePersona = persona.nombrePersona;
			certificadoApremioPersona.idTipoDocumento = parseInt(persona.idTipoDocumento);
			certificadoApremioPersona.numeroDocumento = persona.numeroDocumento;
		}

		return certificadoApremioPersona;
	}

}
