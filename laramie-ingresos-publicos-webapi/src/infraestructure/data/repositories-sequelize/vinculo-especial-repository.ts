import IVinculoEspecialRepository from '../../../domain/repositories/vinculo-especial-repository';
import IPersonaRepository from '../../../domain/repositories/persona-repository';
import VinculoEspecialModel from './models/vinculo-especial-model';
import VinculoEspecial from '../../../domain/entities/vinculo-especial';
import VinculoEspecialState from '../../../domain/dto/vinculo-especial-state';
import PersonaModel from './models/persona-model';
import Persona from '../../../domain/entities/persona';

export default class VinculoEspecialRepositorySequelize implements IVinculoEspecialRepository {

	personaRepository: IPersonaRepository;

	constructor(personaRepository: IPersonaRepository) {
		this.personaRepository = personaRepository;

	}

	async listByEspecial(idEspecial: number) {
		const data = await VinculoEspecialModel.findAll({
			include: [
				{ model: PersonaModel, as: 'persona' }
			],
			where: { idEspecial: idEspecial }
		});
		const result = data.map((row) => this.ObjectToClass(row));

		return result;

	}

	async findById(id:number) {
		const data = await VinculoEspecialModel.findOne({
			include: [
				{ model: PersonaModel, as: 'persona' }
			],
			where: { id: id }
		});
		const result = (data) ? this.ObjectToClass(data) : null;

		return result;
	}

	async add(row:VinculoEspecial) {
		const data = await VinculoEspecialModel.create({
			idEspecial: row.idEspecial,
			idTipoVinculoEspecial: row.idTipoVinculoEspecial,
			idPersona: row.idPersona,	
			idTipoInstrumento: row.idTipoInstrumento,
			fechaInstrumentoDesde: row.fechaInstrumentoDesde,
			fechaInstrumentoHasta: row.fechaInstrumentoHasta,
			porcentajeCondominio: row.porcentajeCondominio
		});
		const result = new VinculoEspecial(...data.getDataValues());

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

	async modify(id:number, row:VinculoEspecial) {
		const rowOriginal = await this.findById(id);

		const affectedCount = await VinculoEspecialModel.update({
			idEspecial: row.idEspecial,
			idTipoVinculoEspecial: row.idTipoVinculoEspecial,
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

		const data =  await VinculoEspecialModel.findOne({ where: { id: id } });
		result = (data) ? new VinculoEspecial(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await VinculoEspecialModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

	async removeByEspecial(idEspecial: number) {
		const affectedCount = await VinculoEspecialModel.destroy({ where: { idEspecial: idEspecial } });
		const result = (affectedCount > 0) ? {idEspecial} : null;
		
		return result;
	}

	ObjectToClass(row:any) {
		const persona = row["persona"];

		let vinculoEspecial = new VinculoEspecialState(...row.getDataValues());
		if (persona) {
			vinculoEspecial.idTipoPersona = parseInt(persona.idTipoPersona);
			vinculoEspecial.nombrePersona = persona.nombrePersona;
			vinculoEspecial.idTipoDocumento = parseInt(persona.idTipoDocumento);
			vinculoEspecial.numeroDocumento = persona.numeroDocumento;
		}

		return vinculoEspecial;
	}

}
