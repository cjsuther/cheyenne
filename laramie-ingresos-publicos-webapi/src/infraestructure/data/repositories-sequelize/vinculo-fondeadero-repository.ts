import IVinculoFondeaderoRepository from '../../../domain/repositories/vinculo-fondeadero-repository';
import IPersonaRepository from '../../../domain/repositories/persona-repository';
import VinculoFondeaderoModel from './models/vinculo-fondeadero-model';
import VinculoFondeadero from '../../../domain/entities/vinculo-fondeadero';
import VinculoFondeaderoState from '../../../domain/dto/vinculo-fondeadero-state';
import PersonaModel from './models/persona-model';
import Persona from '../../../domain/entities/persona';

export default class VinculoFondeaderoRepositorySequelize implements IVinculoFondeaderoRepository {

	personaRepository: IPersonaRepository;

	constructor(personaRepository: IPersonaRepository) {
		this.personaRepository = personaRepository;

	}

	async listByFondeadero(idFondeadero: number) {
		const data = await VinculoFondeaderoModel.findAll({
			include: [
				{ model: PersonaModel, as: 'persona' }
			],
			where: { idFondeadero: idFondeadero }
		});
		const result = data.map((row) => this.ObjectToClass(row));

		return result;
	}

	async findById(id:number) {
		const data = await VinculoFondeaderoModel.findOne({
			include: [
				{ model: PersonaModel, as: 'persona' }
			],
			where: { id: id }
		});
		const result = (data) ? this.ObjectToClass(data) : null;

		return result;
	}

	async add(row:VinculoFondeadero) {
		const data = await VinculoFondeaderoModel.create({
			idFondeadero: row.idFondeadero,
			idTipoVinculoFondeadero: row.idTipoVinculoFondeadero,
			idPersona: row.idPersona,		
			idTipoInstrumento: row.idTipoInstrumento,
			fechaInstrumentoDesde: row.fechaInstrumentoDesde,
			fechaInstrumentoHasta: row.fechaInstrumentoHasta,
			porcentajeCondominio: row.porcentajeCondominio
		});
		const result = new VinculoFondeadero(...data.getDataValues());

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

	async modify(id:number, row:VinculoFondeadero) {
		const rowOriginal = await this.findById(id);

		const affectedCount = await VinculoFondeaderoModel.update({
			idFondeadero: row.idFondeadero,
			idTipoVinculoFondeadero: row.idTipoVinculoFondeadero,
			idPersona: row.idPersona,
			idTipoPersona: row.idTipoPersona,
			idTipoDocumento: row.idTipoDocumento,
			numeroDocumento: row.numeroDocumento,
			nombrePersona: row.nombrePersona,			
			idTipoInstrumento: row.idTipoInstrumento,
			fechaInstrumentoDesde: row.fechaInstrumentoDesde,
			fechaInstrumentoHasta: row.fechaInstrumentoHasta,
			porcentajeCondominio: row.porcentajeCondominio
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

		const data =  await VinculoFondeaderoModel.findOne({ where: { id: id } });
		result = (data) ? new VinculoFondeadero(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await VinculoFondeaderoModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

	async removeByFondeadero(idFondeadero: number) {
		const affectedCount = await VinculoFondeaderoModel.destroy({ where: { idFondeadero: idFondeadero } });
		const result = (affectedCount > 0) ? {idFondeadero} : null;
		
		return result;
	}

	ObjectToClass(row:any) {
		const persona = row["persona"];

		let vinculoFondeadero = new VinculoFondeaderoState(...row.getDataValues());
		if (persona) {
			vinculoFondeadero.idTipoPersona = parseInt(persona.idTipoPersona);
			vinculoFondeadero.nombrePersona = persona.nombrePersona;
			vinculoFondeadero.idTipoDocumento = parseInt(persona.idTipoDocumento);
			vinculoFondeadero.numeroDocumento = persona.numeroDocumento;
		}

		return vinculoFondeadero;
	}

}
