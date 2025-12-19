import IVinculoCementerioRepository from '../../../domain/repositories/vinculo-cementerio-repository';
import IPersonaRepository from '../../../domain/repositories/persona-repository';
import VinculoCementerioModel from './models/vinculo-cementerio-model';
import VinculoCementerio from '../../../domain/entities/vinculo-cementerio';
import VinculoCementerioState from '../../../domain/dto/vinculo-cementerio-state';
import PersonaModel from './models/persona-model';
import Persona from '../../../domain/entities/persona';

export default class VinculoCementerioRepositorySequelize implements IVinculoCementerioRepository {

	personaRepository: IPersonaRepository;

	constructor(personaRepository: IPersonaRepository) {
		this.personaRepository = personaRepository;

	}

	async listByCementerio(idCementerio: number) {
		const data = await VinculoCementerioModel.findAll({
			include: [
				{ model: PersonaModel, as: 'persona' }
			],
			where: { idCementerio: idCementerio }
		});
		const result = data.map((row) => this.ObjectToClass(row));

		return result;
	}

	async findById(id:number) {
		const data = await VinculoCementerioModel.findOne({
			include: [
				{ model: PersonaModel, as: 'persona' }
			],
			where: { id: id }
		});
		const result = (data) ? this.ObjectToClass(data) : null;

		return result;
	}

	async add(row:VinculoCementerio) {
		const data = await VinculoCementerioModel.create({
			idCementerio: row.idCementerio,
			idTipoVinculoCementerio: row.idTipoVinculoCementerio,
			idPersona: row.idPersona,		
			idTipoInstrumento: row.idTipoInstrumento,
			fechaInstrumentoDesde: row.fechaInstrumentoDesde,
			fechaInstrumentoHasta: row.fechaInstrumentoHasta,
			porcentajeCondominio: row.porcentajeCondominio
		});
		const result = new VinculoCementerio(...data.getDataValues());

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

	async modify(id:number, row:VinculoCementerio) {
		const rowOriginal = await this.findById(id);

		const affectedCount = await VinculoCementerioModel.update({
			idCementerio: row.idCementerio,
			idTipoVinculoCementerio: row.idTipoVinculoCementerio,
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

		const data =  await VinculoCementerioModel.findOne({ where: { id: id } });
		result = (data) ? new VinculoCementerio(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await VinculoCementerioModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

	async removeByCementerio(idCementerio: number) {
		const affectedCount = await VinculoCementerioModel.destroy({ where: { idCementerio: idCementerio } });
		const result = (affectedCount > 0) ? {idCementerio} : null;
		
		return result;
	}

	ObjectToClass(row:any) {
		const persona = row["persona"];

		let vinculoCementerio = new VinculoCementerioState(...row.getDataValues());
		if (persona) {
			vinculoCementerio.idTipoPersona = parseInt(persona.idTipoPersona);
			vinculoCementerio.nombrePersona = persona.nombrePersona;
			vinculoCementerio.idTipoDocumento = parseInt(persona.idTipoDocumento);
			vinculoCementerio.numeroDocumento = persona.numeroDocumento;
		}

		return vinculoCementerio;
	}

}
