import IVinculoInmuebleRepository from '../../../domain/repositories/vinculo-inmueble-repository';
import IPersonaRepository from '../../../domain/repositories/persona-repository';
import VinculoInmuebleModel from './models/vinculo-inmueble-model';
import VinculoInmueble from '../../../domain/entities/vinculo-inmueble';
import VinculoInmuebleState from '../../../domain/dto/vinculo-inmueble-state';
import PersonaModel from './models/persona-model';
import Persona from '../../../domain/entities/persona';

export default class VinculoInmuebleRepositorySequelize implements IVinculoInmuebleRepository {

	personaRepository: IPersonaRepository;

	constructor(personaRepository: IPersonaRepository) {
		this.personaRepository = personaRepository;
	}

	async listByInmueble(idInmueble: number) {
		const data = await VinculoInmuebleModel.findAll({
			include: [
				{ model: PersonaModel, as: 'persona' }
			],
			where: { idInmueble: idInmueble }
		});
		const result = data.map((row) => this.ObjectToClass(row));

		return result;
	}

	async findById(id:number) {
		const data = await VinculoInmuebleModel.findOne({
			include: [
				{ model: PersonaModel, as: 'persona' }
			],
			where: { id: id }
		});
		const result = (data) ? this.ObjectToClass(data) : null;

		return result;
	}

	async add(row:VinculoInmueble) {
		const data = await VinculoInmuebleModel.create({
			idInmueble: row.idInmueble,
			idTipoVinculoInmueble: row.idTipoVinculoInmueble,
			idPersona: row.idPersona,	
			idTipoInstrumento: row.idTipoInstrumento,
			fechaInstrumentoDesde: row.fechaInstrumentoDesde,
			fechaInstrumentoHasta: row.fechaInstrumentoHasta,
			porcentajeCondominio: row.porcentajeCondominio
		});
		const result = new VinculoInmueble(...data.getDataValues());

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

	async modify(id:number, row:VinculoInmueble) {
		const rowOriginal = await this.findById(id);

		const affectedCount = await VinculoInmuebleModel.update({
			idInmueble: row.idInmueble,
			idTipoVinculoInmueble: row.idTipoVinculoInmueble,
			idPersona: row.idPersona,		
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

		const data =  await VinculoInmuebleModel.findOne({ where: { id: id } });
		result = (data) ? new VinculoInmueble(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await VinculoInmuebleModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

	async removeByInmueble(idInmueble: number) {
		const affectedCount = await VinculoInmuebleModel.destroy({ where: { idInmueble: idInmueble } });
		const result = (affectedCount > 0) ? {idInmueble} : null;
		
		return result;
	}

	ObjectToClass(row:any) {
		const persona = row["persona"];

		let vinculoInmueble = new VinculoInmuebleState(...row.getDataValues());
		if (persona) {
			vinculoInmueble.idTipoPersona = parseInt(persona.idTipoPersona);
			vinculoInmueble.nombrePersona = persona.nombrePersona;
			vinculoInmueble.idTipoDocumento = parseInt(persona.idTipoDocumento);
			vinculoInmueble.numeroDocumento = persona.numeroDocumento;
		}

		return vinculoInmueble;
	}

}
