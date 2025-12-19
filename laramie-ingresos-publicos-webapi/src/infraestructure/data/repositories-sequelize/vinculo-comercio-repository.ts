import IVinculoComercioRepository from '../../../domain/repositories/vinculo-comercio-repository';
import IPersonaRepository from '../../../domain/repositories/persona-repository';
import VinculoComercioModel from './models/vinculo-comercio-model';
import VinculoComercio from '../../../domain/entities/vinculo-comercio';
import VinculoComercioState from '../../../domain/dto/vinculo-comercio-state';
import PersonaModel from './models/persona-model';
import Persona from '../../../domain/entities/persona';

export default class VinculoComercioRepositorySequelize implements IVinculoComercioRepository {

	personaRepository: IPersonaRepository;

	constructor(personaRepository: IPersonaRepository) {
		this.personaRepository = personaRepository;

	}

	async listByComercio(idComercio: number) {
		const data = await VinculoComercioModel.findAll({
			include: [
				{ model: PersonaModel, as: 'persona' }
			],
			where: { idComercio: idComercio }
		});
		const result = data.map((row) => this.ObjectToClass(row));

		return result;
	}

	async findById(id:number) {
		const data = await VinculoComercioModel.findOne({
			include: [
				{ model: PersonaModel, as: 'persona' }
			],
			where: { id: id }
		});
		const result = (data) ? this.ObjectToClass(data) : null;

		return result;
	}

	async add(row:VinculoComercio) {
		const data = await VinculoComercioModel.create({
			idComercio: row.idComercio,
			idTipoVinculoComercio: row.idTipoVinculoComercio,
			idPersona: row.idPersona,	
			idTipoInstrumento: row.idTipoInstrumento,
			fechaInstrumentoDesde: row.fechaInstrumentoDesde,
			fechaInstrumentoHasta: row.fechaInstrumentoHasta,
			porcentajeCondominio: row.porcentajeCondominio
		});
		const result = new VinculoComercio(...data.getDataValues());

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

	async modify(id:number, row:VinculoComercio) {
		const rowOriginal = await this.findById(id);

		const affectedCount = await VinculoComercioModel.update({
			idComercio: row.idComercio,
			idTipoVinculoComercio: row.idTipoVinculoComercio,
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

		const data =  await VinculoComercioModel.findOne({ where: { id: id } });
		result = (data) ? new VinculoComercio(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await VinculoComercioModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

	async removeByComercio(idComercio: number) {
		const affectedCount = await VinculoComercioModel.destroy({ where: { idComercio: idComercio } });
		const result = (affectedCount > 0) ? {idComercio} : null;
		
		return result;
	}

	ObjectToClass(row:any) {
		const persona = row["persona"];

		let vinculoComercio = new VinculoComercioState(...row.getDataValues());
		if (persona) {
			vinculoComercio.idTipoPersona = parseInt(persona.idTipoPersona);
			vinculoComercio.nombrePersona = persona.nombrePersona;
			vinculoComercio.idTipoDocumento = parseInt(persona.idTipoDocumento);
			vinculoComercio.numeroDocumento = persona.numeroDocumento;
		}

		return vinculoComercio;
	}

}
