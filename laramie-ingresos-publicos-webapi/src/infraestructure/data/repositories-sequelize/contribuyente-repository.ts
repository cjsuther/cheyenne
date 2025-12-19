import IContribuyenteRepository from '../../../domain/repositories/contribuyente-repository';
import IPersonaRepository from '../../../domain/repositories/persona-repository';
import ContribuyenteCuentaModel from './models/contribuyente-cuenta-model';
import ContribuyenteModel from './models/contribuyente-model';
import Contribuyente from '../../../domain/entities/contribuyente';
import PersonaModel from './models/persona-model';
import Persona from '../../../domain/entities/persona';

export default class ContribuyenteRepositorySequelize implements IContribuyenteRepository {

	personaRepository: IPersonaRepository;

	constructor(personaRepository: IPersonaRepository) {
		this.personaRepository = personaRepository;
	}

	async list() {
		const data = await ContribuyenteModel.findAll({
            include: [
				{ model: PersonaModel, as: 'persona' }
			]
		});
		const result = data.map((row) => this.ObjectToClass(row));

		return result;
	}

	async listByCuenta(idCuenta:number) {
        const data = await ContribuyenteModel.findAll(
            {
                include: 
                [{
                    model: ContribuyenteCuentaModel,
                    required: true,
                    as: 'contribuyenteCuenta',
                    where: { idCuenta: idCuenta }
                },
				{ model: PersonaModel, as: 'persona' }
			]
            }
        );
		const result = data.map((row) => this.ObjectToClass(row));

        return result;
    }

	async findById(id:number) {
		const data = await ContribuyenteModel.findOne({
			include: [
				{ model: PersonaModel, as: 'persona' }
			],
			where: { id: id }
		});
		const result = (data) ? this.ObjectToClass(data) : null;

		return result;
	}

	async findByPersona(idPersona:number) {
		const data = await ContribuyenteModel.findOne({
			include: [
				{ model: PersonaModel, as: 'persona' }
			],
			where: { idPersona: idPersona }
		});
		const result = (data) ? this.ObjectToClass(data) : null;

		return result;
	}

	async add(row:Contribuyente) {
		const data = await ContribuyenteModel.create({
			idPersona: row.idPersona,
			fechaAlta: row.fechaAlta
		});
		const result = new Contribuyente(...data.getDataValues());

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

	async modify(id:number, row:Contribuyente) {
		const rowOriginal = await this.findById(id);

		const affectedCount = await ContribuyenteModel.update({
			idPersona: row.idPersona,
			fechaAlta: row.fechaAlta
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

		const data =  await ContribuyenteModel.findOne({ where: { id: id } });
		result = (data) ? new Contribuyente(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await ContribuyenteModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

	ObjectToClass(row:any) {
		const persona = row["persona"];

		let contribuyente = new Contribuyente(...row.getDataValues());
		if (persona) {
			contribuyente.idTipoPersona = parseInt(persona.idTipoPersona);
			contribuyente.nombrePersona = persona.nombrePersona;
			contribuyente.idTipoDocumento = parseInt(persona.idTipoDocumento);
			contribuyente.numeroDocumento = persona.numeroDocumento;
		}

		return contribuyente;
	}

}
