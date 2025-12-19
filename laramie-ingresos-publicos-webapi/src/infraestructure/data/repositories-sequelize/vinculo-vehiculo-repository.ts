import IVinculoVehiculoRepository from '../../../domain/repositories/vinculo-vehiculo-repository';
import IPersonaRepository from '../../../domain/repositories/persona-repository';
import VinculoVehiculoModel from './models/vinculo-vehiculo-model';
import VinculoVehiculo from '../../../domain/entities/vinculo-vehiculo';
import VinculoVehiculoState from '../../../domain/dto/vinculo-vehiculo-state';
import PersonaModel from './models/persona-model';
import Persona from '../../../domain/entities/persona';

export default class VinculoVehiculoRepositorySequelize implements IVinculoVehiculoRepository {

	personaRepository: IPersonaRepository;

	constructor(personaRepository: IPersonaRepository) {
		this.personaRepository = personaRepository;

	}

	async listByVehiculo(idVehiculo: number) {
		const data = await VinculoVehiculoModel.findAll({
			include: [
				{ model: PersonaModel, as: 'persona' }
			],
			where: { idVehiculo: idVehiculo }
		});
		const result = data.map((row) => this.ObjectToClass(row));

		return result;
	}

	async findById(id:number) {
		const data = await VinculoVehiculoModel.findOne({
			include: [
				{ model: PersonaModel, as: 'persona' }
			],
			where: { id: id }
		});
		const result = (data) ? this.ObjectToClass(data) : null;

		return result;
	}

	async add(row:VinculoVehiculo) {
		const data = await VinculoVehiculoModel.create({
			idVehiculo: row.idVehiculo,
			idTipoVinculoVehiculo: row.idTipoVinculoVehiculo,
			idPersona: row.idPersona,		
			idTipoInstrumento: row.idTipoInstrumento,
			fechaInstrumentoDesde: row.fechaInstrumentoDesde,
			fechaInstrumentoHasta: row.fechaInstrumentoHasta,
			porcentajeCondominio: row.porcentajeCondominio
		});
		const result = new VinculoVehiculo(...data.getDataValues());

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

	async modify(id:number, row:VinculoVehiculo) {
		const rowOriginal = await this.findById(id);

		const affectedCount = await VinculoVehiculoModel.update({
			idVehiculo: row.idVehiculo,
			idTipoVinculoVehiculo: row.idTipoVinculoVehiculo,
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

		const data =  await VinculoVehiculoModel.findOne({ where: { id: id } });
		result = (data) ? new VinculoVehiculo(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await VinculoVehiculoModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

	async removeByVehiculo(idVehiculo: number) {
		const affectedCount = await VinculoVehiculoModel.destroy({ where: { idVehiculo: idVehiculo } });
		const result = (affectedCount > 0) ? {idVehiculo} : null;
		
		return result;
	}

	ObjectToClass(row:any) {
		const persona = row["persona"];

		let vinculoVehiculo = new VinculoVehiculoState(...row.getDataValues());
		if (persona) {
			vinculoVehiculo.idTipoPersona = parseInt(persona.idTipoPersona);
			vinculoVehiculo.nombrePersona = persona.nombrePersona;
			vinculoVehiculo.idTipoDocumento = parseInt(persona.idTipoDocumento);
			vinculoVehiculo.numeroDocumento = persona.numeroDocumento;
		}

		return vinculoVehiculo;
	}

}
