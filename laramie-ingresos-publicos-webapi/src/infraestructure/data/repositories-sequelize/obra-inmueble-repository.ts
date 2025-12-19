import IObraInmuebleRepository from '../../../domain/repositories/obra-inmueble-repository';
import IPersonaRepository from '../../../domain/repositories/persona-repository';
import ObraInmuebleModel from './models/obra-inmueble-model';
import ObraInmueble from '../../../domain/entities/obra-inmueble';
import ObraInmuebleState from '../../../domain/dto/obra-inmueble-state';
import ObraInmuebleDetalleModel from './models/obra-inmueble-detalle-model';
import ObraInmuebleDetalleState from '../../../domain/dto/obra-inmueble-detalle-state';
import PersonaModel from './models/persona-model';
import Persona from '../../../domain/entities/persona';


export default class ObraInmuebleRepositorySequelize implements IObraInmuebleRepository {

	personaRepository: IPersonaRepository;

	constructor(personaRepository: IPersonaRepository) {
		this.personaRepository = personaRepository;

	}

	async listByInmueble(idInmueble: number) {
		const data = await ObraInmuebleModel.findAll({
            include: [
				{ model: ObraInmuebleDetalleModel, as: 'obraInmuebleDetalle' },
				{ model: PersonaModel, as: 'persona' }
            ],
			where: { idInmueble: idInmueble }
		});
		const result = data.map((row) => {
			const obraInmuebleDetalle = row["obraInmuebleDetalle"];

			const obraInmueble = (row) ? this.ObjectToClass(row) : null;
			obraInmueble.obrasInmuebleDetalle = (obraInmuebleDetalle.map((detalle) => new ObraInmuebleDetalleState(...detalle.getDataValues())) as Array<ObraInmuebleDetalleState>).sort((a, b) => a.id - b.id);

			return obraInmueble;
		});

		return result;
	}

	async findById(id:number) {
		const data = await ObraInmuebleModel.findOne({
			include: [
				{ model: PersonaModel, as: 'persona' }
			],
			where: { id: id }
		});
		const result = (data) ? this.ObjectToClass(data) : null;

		return result;
	}

	async add(row:ObraInmueble) {
		const data = await ObraInmuebleModel.create({
			idInmueble: row.idInmueble,
			idTasa: row.idTasa,
			idSubTasa: row.idSubTasa,
			idTipoMovimiento: row.idTipoMovimiento,
			numero: row.numero,
			cuota: row.cuota,
			fechaPrimerVencimiento: row.fechaPrimerVencimiento,
			fechaSegundoVencimiento: row.fechaSegundoVencimiento,
			idExpediente: row.idExpediente,
			detalleExpediente: row.detalleExpediente,
			idPersona: row.idPersona,
			fechaPresentacion: row.fechaPresentacion,
			fechaInspeccion: row.fechaInspeccion,
			fechaAprobacion: row.fechaAprobacion,
			fechaInicioDesglose: row.fechaInicioDesglose,
			fechaFinDesglose: row.fechaFinDesglose,
			fechaFinObra: row.fechaFinObra,
			fechaArchivado: row.fechaArchivado,
			fechaIntimado: row.fechaIntimado,
			fechaVencidoIntimado: row.fechaVencidoIntimado,
			fechaMoratoria: row.fechaMoratoria,
			fechaVencidoMoratoria: row.fechaVencidoMoratoria
		});
		const result = new ObraInmueble(...data.getDataValues());

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

	async modify(id:number, row:ObraInmueble) {
		const rowOriginal = await this.findById(id);

		const affectedCount = await ObraInmuebleModel.update({
			idInmueble: row.idInmueble,
			idTasa: row.idTasa,
			idSubTasa: row.idSubTasa,
			idTipoMovimiento: row.idTipoMovimiento,
			numero: row.numero,
			cuota: row.cuota,
			fechaPrimerVencimiento: row.fechaPrimerVencimiento,
			fechaSegundoVencimiento: row.fechaSegundoVencimiento,
			idExpediente: row.idExpediente,
			detalleExpediente: row.detalleExpediente,
			idPersona: row.idPersona,
			fechaPresentacion: row.fechaPresentacion,
			fechaInspeccion: row.fechaInspeccion,
			fechaAprobacion: row.fechaAprobacion,
			fechaInicioDesglose: row.fechaInicioDesglose,
			fechaFinDesglose: row.fechaFinDesglose,
			fechaFinObra: row.fechaFinObra,
			fechaArchivado: row.fechaArchivado,
			fechaIntimado: row.fechaIntimado,
			fechaVencidoIntimado: row.fechaVencidoIntimado,
			fechaMoratoria: row.fechaMoratoria,
			fechaVencidoMoratoria: row.fechaVencidoMoratoria
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

		const data =  await ObraInmuebleModel.findOne({ where: { id: id } });
		result = (data) ? new ObraInmueble(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await ObraInmuebleModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

	ObjectToClass(row:any) {
		const persona = row["persona"];

		let obraInmueble = new ObraInmuebleState(...row.getDataValues());
		if (persona) {
			obraInmueble.idTipoPersona = parseInt(persona.idTipoPersona);
			obraInmueble.nombrePersona = persona.nombrePersona;
			obraInmueble.idTipoDocumento = parseInt(persona.idTipoDocumento);
			obraInmueble.numeroDocumento = persona.numeroDocumento;
		}

		return obraInmueble;
	}

}
