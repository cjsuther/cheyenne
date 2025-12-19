import { Sequelize } from 'sequelize';
import { getNamespace } from 'cls-hooked';
import ICertificadoEscribanoRepository from '../../../domain/repositories/certificado-escribano-repository';
import IPersonaRepository from '../../../domain/repositories/persona-repository';
import CertificadoEscribanoModel from './models/certificado-escribano-model';
import CertificadoEscribano from '../../../domain/entities/certificado-escribano';
import CertificadoEscribanoFilter from '../../../domain/dto/certificado-escribano-filter';
import PersonaModel from './models/persona-model';
import Persona from '../../../domain/entities/persona';

export default class CertificadoEscribanoRepositorySequelize implements ICertificadoEscribanoRepository {

	personaRepository: IPersonaRepository;

	constructor(personaRepository: IPersonaRepository) {
		this.personaRepository = personaRepository;
	}

	async list() {
		// const data = await CertificadoEscribanoModel.findAll();
		// const result = data.map((row) => new CertificadoEscribano(...row.getDataValues()));

		const data = await CertificadoEscribanoModel.findAll({
            include: [
				{ model: PersonaModel, as: 'personaIntermediario' },
				{ model: PersonaModel, as: 'personaRetiro' }
			]
		});
		const result = data.map((row) => this.ObjectToClass(row));

		return result;
	}
	
	async listByFilter(certificadoEscribanoFilter: CertificadoEscribanoFilter) {

		let filters = {};
		if (certificadoEscribanoFilter.anioCertificado.length > 0) filters["anioCertificado"] = certificadoEscribanoFilter.anioCertificado;
		if (certificadoEscribanoFilter.numeroCertificado.length > 0) filters["numeroCertificado"] = certificadoEscribanoFilter.numeroCertificado;
		if (certificadoEscribanoFilter.idTipoCertificado > 0) filters["idTipoCertificado"] = certificadoEscribanoFilter.idTipoCertificado;
		if (certificadoEscribanoFilter.idEscribano > 0) filters["idEscribano"] = certificadoEscribanoFilter.idEscribano;
		if (certificadoEscribanoFilter.idCuenta > 0) filters["idCuenta"] = certificadoEscribanoFilter.idCuenta;
		
		let data = null;
		if (certificadoEscribanoFilter.anioCertificado.length === 0 &&
			certificadoEscribanoFilter.numeroCertificado.length === 0 &&
			certificadoEscribanoFilter.idTipoCertificado === 0 &&
			certificadoEscribanoFilter.idEscribano === 0 &&
			certificadoEscribanoFilter.idCuenta === 0)
		{
			data = await CertificadoEscribanoModel.findAll({
				include: [
					{ model: PersonaModel, as: 'personaIntermediario' },
					{ model: PersonaModel, as: 'personaRetiro' }
				]
			});
		}
		else {
			data = await CertificadoEscribanoModel.findAll({
				include: [
					{ model: PersonaModel, as: 'personaIntermediario' },
					{ model: PersonaModel, as: 'personaRetiro' }
				],
				where: filters
			});
		}
		const result = data.map((row) => this.ObjectToClass(row));

        return result;
    }

	async findById(id:number) {
		const data = await CertificadoEscribanoModel.findOne({
			include: [
				{ model: PersonaModel, as: 'personaIntermediario' },
				{ model: PersonaModel, as: 'personaRetiro' }
			],
			where: { id: id }
		});
		const result = (data) ? this.ObjectToClass(data) : null;

		return result;
	}

	async add(row:CertificadoEscribano) {
		const data = await CertificadoEscribanoModel.create({
			anioCertificado: row.anioCertificado,
			numeroCertificado: row.numeroCertificado,
			idTipoCertificado: row.idTipoCertificado,
			idObjetoCertificado: row.idObjetoCertificado,
			idEscribano: row.idEscribano,
			transferencia: row.transferencia,
			idCuenta: row.idCuenta,
			vendedor: row.vendedor,
			partida: row.partida,
			direccion: row.direccion,
			idPersonaIntermediario: row.idPersonaIntermediario,
			idPersonaRetiro: row.idPersonaRetiro,
			fechaEntrada: row.fechaEntrada,
			fechaSalida: row.fechaSalida,
			fechaEntrega: row.fechaEntrega
		});
		const result = new CertificadoEscribano(...data.getDataValues());

		if (row.idPersonaIntermediario) {
			const personaIntermediario = new Persona(
				row.idPersonaIntermediario,
				row.idTipoPersonaIntermediario,
				row.nombrePersonaIntermediario,
				row.idTipoDocumentoIntermediario,
				row.numeroDocumentoIntermediario
			);
			await this.personaRepository.checkById(row.idPersonaIntermediario, personaIntermediario);
		}
		if (row.idPersonaRetiro) {
			const personaRetiro = new Persona(
				row.idPersonaRetiro,
				row.idTipoPersonaRetiro,
				row.nombrePersonaRetiro,
				row.idTipoDocumentoRetiro,
				row.numeroDocumentoRetiro
			);
			await this.personaRepository.checkById(row.idPersonaRetiro, personaRetiro);
		}

		return result;
	}

	async modify(id:number, row:CertificadoEscribano) {
		const rowOriginal = await this.findById(id);

		const affectedCount = await CertificadoEscribanoModel.update({
			anioCertificado: row.anioCertificado,
			numeroCertificado: row.numeroCertificado,
			idTipoCertificado: row.idTipoCertificado,
			idObjetoCertificado: row.idObjetoCertificado,
			idEscribano: row.idEscribano,
			transferencia: row.transferencia,
			idCuenta: row.idCuenta,
			vendedor: row.vendedor,
			partida: row.partida,
			direccion: row.direccion,
			idPersonaIntermediario: row.idPersonaIntermediario,
			idPersonaRetiro: row.idPersonaRetiro,
			fechaEntrada: row.fechaEntrada,
			fechaSalida: row.fechaSalida,
			fechaEntrega: row.fechaEntrega
		},
		{ where: { id: id } });

		let result = null;
		if (rowOriginal && affectedCount[0] > 0) {

			if (row.idPersonaIntermediario && row.idPersonaIntermediario !== rowOriginal.idPersonaIntermediario) {
				const personaIntermediario = new Persona(
					row.idPersonaIntermediario,
					row.idTipoPersonaIntermediario,
					row.nombrePersonaIntermediario,
					row.idTipoDocumentoIntermediario,
					row.numeroDocumentoIntermediario
				);
				await this.personaRepository.checkById(row.idPersonaIntermediario, personaIntermediario);
			}
			if (row.idPersonaRetiro && row.idPersonaRetiro !== rowOriginal.idPersonaRetiro) {
				const personaRetiro = new Persona(
					row.idPersonaRetiro,
					row.idTipoPersonaRetiro,
					row.nombrePersonaRetiro,
					row.idTipoDocumentoRetiro,
					row.numeroDocumentoRetiro
				);
				await this.personaRepository.checkById(row.idPersonaRetiro, personaRetiro);
			}

			const data =  await CertificadoEscribanoModel.findOne({ where: { id: id } });
			result = (data) ? new CertificadoEscribano(...data.getDataValues()) : null;
		}

		return result;
	}

	async remove(id:number) {
		const affectedCount = await CertificadoEscribanoModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

	async onTransaction(request) {
		const localStorage = getNamespace('LocalStorage');
		Sequelize.useCLS(localStorage);

		return await CertificadoEscribanoModel.sequelize.transaction(async (t) => {
			return request();
		});
	}

	//funciones auxiliares

	ObjectToClass(row:any) {
		const personaIntermediario = row["personaIntermediario"];
		const personaRetiro = row["personaRetiro"];

		let certificadoEscribano = new CertificadoEscribano(...row.getDataValues());
		if (personaIntermediario) {
			certificadoEscribano.idTipoPersonaIntermediario = parseInt(personaIntermediario.idTipoPersona);
			certificadoEscribano.nombrePersonaIntermediario = personaIntermediario.nombrePersona;
			certificadoEscribano.idTipoDocumentoIntermediario = parseInt(personaIntermediario.idTipoDocumento);
			certificadoEscribano.numeroDocumentoIntermediario = personaIntermediario.numeroDocumento;
		}
		if (personaRetiro) {
			certificadoEscribano.idTipoPersonaRetiro = parseInt(personaRetiro.idTipoPersona);
			certificadoEscribano.nombrePersonaRetiro = personaRetiro.nombrePersona;
			certificadoEscribano.idTipoDocumentoRetiro = parseInt(personaRetiro.idTipoDocumento);
			certificadoEscribano.numeroDocumentoRetiro = personaRetiro.numeroDocumento;
		}

		return certificadoEscribano;
	}

}
