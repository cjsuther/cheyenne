import IRecargoDescuentoRepository from '../../../domain/repositories/recargo-descuento-repository';
import IPersonaRepository from '../../../domain/repositories/persona-repository';
import RecargoDescuentoModel from './models/recargo-descuento-model';
import RecargoDescuento from '../../../domain/entities/recargo-descuento';
import RecargoDescuentoState from '../../../domain/dto/recargo-descuento-state';
import PersonaModel from './models/persona-model';
import Persona from '../../../domain/entities/persona';

export default class RecargoDescuentoRepositorySequelize implements IRecargoDescuentoRepository {

	personaRepository: IPersonaRepository;

	constructor(personaRepository: IPersonaRepository) {
		this.personaRepository = personaRepository;
	}

	async listByCuenta(idCuenta: number) {
		const data = await RecargoDescuentoModel.findAll({
			include: [
				{ model: PersonaModel, as: 'persona' }
			],
			where: { idCuenta: idCuenta }
		});
		const result = data.map((row) => this.ObjectToClass(row));

		return result;
	}

	async findById(id:number) {
		const data = await RecargoDescuentoModel.findOne({
			include: [
				{ model: PersonaModel, as: 'persona' }
			],
			where: { id: id }
		});
		const result = (data) ? this.ObjectToClass(data) : null;

		return result;
	}

	async add(row:RecargoDescuento) {
		const data = await RecargoDescuentoModel.create({
			idTipoRecargoDescuento: row.idTipoRecargoDescuento,
			idCuenta: row.idCuenta,
			idTasa: row.idTasa,
			idSubTasa: row.idSubTasa,
			idRubro: row.idRubro,
			fechaDesde: row.fechaDesde,
			fechaHasta: row.fechaHasta,
			fechaOtorgamiento: row.fechaOtorgamiento,
			numeroSolicitud: row.numeroSolicitud,
			porcentaje: row.porcentaje,
			importe: row.importe,
			idPersona: row.idPersona,
			numeroDDJJ: row.numeroDDJJ,
			letraDDJJ: row.letraDDJJ,
			ejercicioDDJJ: row.ejercicioDDJJ,
			numeroDecreto: row.numeroDecreto,
			letraDecreto: row.letraDecreto,
			ejercicioDecreto: row.ejercicioDecreto,
			idExpediente: row.idExpediente,
			detalleExpediente: row.detalleExpediente
		});
		const result = new RecargoDescuento(...data.getDataValues());

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

	async modify(id:number, row:RecargoDescuento) {
		const rowOriginal = await this.findById(id);

		const affectedCount = await RecargoDescuentoModel.update({
			idTipoRecargoDescuento: row.idTipoRecargoDescuento,
			idCuenta: row.idCuenta,
			idTasa: row.idTasa,
			idSubTasa: row.idSubTasa,
			idRubro: row.idRubro,
			fechaDesde: row.fechaDesde,
			fechaHasta: row.fechaHasta,
			fechaOtorgamiento: row.fechaOtorgamiento,
			numeroSolicitud: row.numeroSolicitud,
			porcentaje: row.porcentaje,
			importe: row.importe,
			idPersona: row.idPersona,
			numeroDDJJ: row.numeroDDJJ,
			letraDDJJ: row.letraDDJJ,
			ejercicioDDJJ: row.ejercicioDDJJ,
			numeroDecreto: row.numeroDecreto,
			letraDecreto: row.letraDecreto,
			ejercicioDecreto: row.ejercicioDecreto,
			idExpediente: row.idExpediente,
			detalleExpediente: row.detalleExpediente
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

		const data =  await RecargoDescuentoModel.findOne({ where: { id: id } });
		result = (data) ? new RecargoDescuento(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await RecargoDescuentoModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

	async removeByCuenta(idCuenta: number) {
		const affectedCount = await RecargoDescuentoModel.destroy({ where: { idCuenta: idCuenta } });
		const result = (affectedCount > 0) ? {idCuenta} : null;
		
		return result;
	}

	ObjectToClass(row:any) {
		const persona = row["persona"];

		let recargoDescuento = new RecargoDescuentoState(...row.getDataValues());
		if (persona) {
			recargoDescuento.idTipoPersona = parseInt(persona.idTipoPersona);
			recargoDescuento.nombrePersona = persona.nombrePersona;
			recargoDescuento.idTipoDocumento = parseInt(persona.idTipoDocumento);
			recargoDescuento.numeroDocumento = persona.numeroDocumento;
		}

		return recargoDescuento;
	}

}