import { Sequelize } from 'sequelize';
import { getNamespace } from 'cls-hooked';
import IControladorRepository from '../../../domain/repositories/controlador-repository';
import IPersonaRepository from '../../../domain/repositories/persona-repository';
import ControladorModel from './models/controlador-model';
import Controlador from '../../../domain/entities/controlador';
import ControladorFilter from '../../../domain/dto/controlador-filter';
import TipoControladorModel from './models/tipo-controlador-model';
import TipoControlador from '../../../domain/entities/tipo-controlador';
import PersonaModel from './models/persona-model';
import Persona from '../../../domain/entities/persona';

export default class ControladorRepositorySequelize implements IControladorRepository {

	personaRepository: IPersonaRepository;

	constructor(personaRepository: IPersonaRepository) {
		this.personaRepository = personaRepository;

	}

	async list() {
		const data = await ControladorModel.findAll({
            include: [
				{ model: PersonaModel, as: 'persona' }
			]
		});
		const result = data.map((row) => this.ObjectToClass(row));

		return result;
	}

	async listByFilter(controladorFilter: ControladorFilter) {
		let data = await ControladorModel.findAll({
			include: [
				{ model: PersonaModel, as: 'persona' }
			]
		});
		let result = data.map((row) => this.ObjectToClass(row));
        result = result.filter(f => (controladorFilter.idTipoControlador === 0 || f.idTipoControlador === controladorFilter.idTipoControlador) &&
									(controladorFilter.idPersona === 0 || f.idPersona === controladorFilter.idPersona) &&
									(controladorFilter.idControladorSupervisor === 0 || f.idControladorSupervisor === controladorFilter.idControladorSupervisor)
							  	);
        return result;
    }

	async findById(id:number) {
		const data = await ControladorModel.findOne({ where: { id: id },
			include: [
				{ model: TipoControladorModel, as: 'tipoControlador' },
				{ model: PersonaModel, as: 'persona' }
            ]
		});
		let result: Controlador = null;
		if (data) {
			const tipoControlador = data["tipoControlador"];
			const controlador = (data) ? this.ObjectToClass(data) : null;
			controlador.tipoControlador = new TipoControlador(...tipoControlador.getDataValues());
			result = controlador;
		}

		return result;
	}

	async add(row:Controlador) {
		const data = await ControladorModel.create({
			idTipoControlador: row.idTipoControlador,
			numero: row.numero,
			esSupervisor: row.esSupervisor,
			fechaAlta: row.fechaAlta,
			fechaBaja: row.fechaBaja,
			catastralCir: row.catastralCir,
			catastralSec: row.catastralSec,
			catastralChacra: row.catastralChacra,
			catastralLchacra: row.catastralLchacra,
			catastralQuinta: row.catastralQuinta,
			catastralLquinta: row.catastralLquinta,
			catastralFrac: row.catastralFrac,
			catastralLfrac: row.catastralLfrac,
			catastralManz: row.catastralManz,
			catastralLmanz: row.catastralLmanz,
			catastralParc: row.catastralParc,
			catastralLparc: row.catastralLparc,
			catastralSubparc: row.catastralSubparc,
			catastralUfunc: row.catastralUfunc,
			catastralUcomp: row.catastralUcomp,
			idPersona: row.idPersona,
			legajo: row.legajo,
			idOrdenamiento: row.idOrdenamiento,
			idControladorSupervisor: row.idControladorSupervisor,
			clasificacion: row.clasificacion,
			fechaUltimaIntimacion: row.fechaUltimaIntimacion,
			cantidadIntimacionesEmitidas: row.cantidadIntimacionesEmitidas,
			cantidadIntimacionesAnuales: row.cantidadIntimacionesAnuales,
			porcentaje: row.porcentaje
		});
		const result = new Controlador(...data.getDataValues());

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

	async modify(id:number, row:Controlador) {
		const rowOriginal = await this.findById(id);

		const affectedCount = await ControladorModel.update({
			idTipoControlador: row.idTipoControlador,
			numero: row.numero,
			esSupervisor: row.esSupervisor,
			fechaAlta: row.fechaAlta,
			fechaBaja: row.fechaBaja,
			catastralCir: row.catastralCir,
			catastralSec: row.catastralSec,
			catastralChacra: row.catastralChacra,
			catastralLchacra: row.catastralLchacra,
			catastralQuinta: row.catastralQuinta,
			catastralLquinta: row.catastralLquinta,
			catastralFrac: row.catastralFrac,
			catastralLfrac: row.catastralLfrac,
			catastralManz: row.catastralManz,
			catastralLmanz: row.catastralLmanz,
			catastralParc: row.catastralParc,
			catastralLparc: row.catastralLparc,
			catastralSubparc: row.catastralSubparc,
			catastralUfunc: row.catastralUfunc,
			catastralUcomp: row.catastralUcomp,
			idPersona: row.idPersona,
			legajo: row.legajo,
			idOrdenamiento: row.idOrdenamiento,
			idControladorSupervisor: row.idControladorSupervisor,
			clasificacion: row.clasificacion,
			fechaUltimaIntimacion: row.fechaUltimaIntimacion,
			cantidadIntimacionesEmitidas: row.cantidadIntimacionesEmitidas,
			cantidadIntimacionesAnuales: row.cantidadIntimacionesAnuales,
			porcentaje: row.porcentaje
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

		const data =  await ControladorModel.findOne({ where: { id: id } });
		result = (data) ? new Controlador(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await ControladorModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

	async onTransaction(request) {
		const localStorage = getNamespace('LocalStorage');
		Sequelize.useCLS(localStorage);

		return await ControladorModel.sequelize.transaction(async (t) => {
			return request();
		});
	}

	ObjectToClass(row:any) {
		const persona = row["persona"];

		let controlador = new Controlador(...row.getDataValues());
		if (persona) {
			controlador.idTipoPersona = parseInt(persona.idTipoPersona);
			controlador.nombrePersona = persona.nombrePersona;
			controlador.idTipoDocumento = parseInt(persona.idTipoDocumento);
			controlador.numeroDocumento = persona.numeroDocumento;
		}

		return controlador;
	}

}
