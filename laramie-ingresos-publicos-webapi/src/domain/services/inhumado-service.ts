import Inhumado from '../entities/inhumado';
import InhumadoState from '../dto/inhumado-state';
import IInhumadoRepository from '../repositories/inhumado-repository';
import IDireccionRepository from '../repositories/direccion-repository';
import IVerificacionRepository from '../repositories/verificacion-repository';
import { isValidInteger, isValidString, isValidDate,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class InhumadoService {

	inhumadoRepository: IInhumadoRepository;
	direccionRepository: IDireccionRepository;
	verificacionRepository: IVerificacionRepository;

	constructor(inhumadoRepository: IInhumadoRepository,
				direccionRepository: IDireccionRepository,
				verificacionRepository: IVerificacionRepository) {
		this.inhumadoRepository = inhumadoRepository;
		this.direccionRepository = direccionRepository;
		this.verificacionRepository = verificacionRepository;
	}

	async listByCementerio(idCementerio: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = (await this.inhumadoRepository.listByCementerio(idCementerio) as Array<InhumadoState>).sort((a, b) => a.id - b.id);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async findById(id: number) {
		return new Promise( async (resolve, reject) => {
			try {			   
				const result = await this.inhumadoRepository.findById(id);
				if (!result) {
					reject(new ReferenceError('No existe el registro'));
					return;
				}
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async add(inhumado: Inhumado) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(inhumado.idCementerio, true) ||
					!isValidInteger(inhumado.idTipoDocumento, true) ||
					!isValidString(inhumado.numeroDocumento, true) ||
					!isValidString(inhumado.apellido, true) ||
					!isValidString(inhumado.nombre, true) ||
					!isValidDate(inhumado.fechaNacimiento, false) ||
					!isValidInteger(inhumado.idGenero, true) ||
					!isValidInteger(inhumado.idEstadoCivil, true) ||
					!isValidInteger(inhumado.idNacionalidad, true) ||
					!isValidDate(inhumado.fechaDefuncion, false) ||
					!isValidDate(inhumado.fechaIngreso, false) ||
					!isValidInteger(inhumado.idMotivoFallecimiento, true) ||
					!isValidInteger(inhumado.idCocheria, true) ||
					!isValidString(inhumado.numeroDefuncion, true) ||
					!isValidString(inhumado.libro, true) ||
					!isValidString(inhumado.folio, true) ||
					!isValidInteger(inhumado.idRegistroCivil, true) ||
					!isValidString(inhumado.acta, true) ||
					!isValidInteger(inhumado.idTipoOrigenInhumacion, true) ||
					!isValidString(inhumado.observacionesOrigen, true) ||
					!isValidInteger(inhumado.idTipoCondicionEspecial, true) ||
					!isValidDate(inhumado.fechaEgreso, false) ||
					!isValidDate(inhumado.fechaTraslado, false) ||
					!isValidInteger(inhumado.idTipoDestinoInhumacion, true) ||
					!isValidString(inhumado.observacionesDestino, true) ||
					!isValidDate(inhumado.fechaExhumacion, false) ||
					!isValidDate(inhumado.fechaReduccion, false) ||
					!isValidString(inhumado.numeroReduccion, true) ||
					!isValidString(inhumado.unidad, true) ||
					!isValidInteger(inhumado.idTipoDocumentoResponsable, true) ||
					!isValidString(inhumado.numeroDocumentoResponsable, true) ||
					!isValidString(inhumado.apellidoResponsable, true) ||
					!isValidString(inhumado.nombreResponsable, true) ||
					!isValidDate(inhumado.fechaHoraInicioVelatorio, false) ||
					!isValidDate(inhumado.fechaHoraFinVelatorio, false)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				inhumado.id = null;
				const result = await this.inhumadoRepository.add(inhumado);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, inhumado: Inhumado) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(inhumado.idCementerio, true) ||
					!isValidInteger(inhumado.idTipoDocumento, true) ||
					!isValidString(inhumado.numeroDocumento, true) ||
					!isValidString(inhumado.apellido, true) ||
					!isValidString(inhumado.nombre, true) ||
					!isValidDate(inhumado.fechaNacimiento, false) ||
					!isValidInteger(inhumado.idGenero, true) ||
					!isValidInteger(inhumado.idEstadoCivil, true) ||
					!isValidInteger(inhumado.idNacionalidad, true) ||
					!isValidDate(inhumado.fechaDefuncion, false) ||
					!isValidDate(inhumado.fechaIngreso, false) ||
					!isValidInteger(inhumado.idMotivoFallecimiento, true) ||
					!isValidInteger(inhumado.idCocheria, true) ||
					!isValidString(inhumado.numeroDefuncion, true) ||
					!isValidString(inhumado.libro, true) ||
					!isValidString(inhumado.folio, true) ||
					!isValidInteger(inhumado.idRegistroCivil, true) ||
					!isValidString(inhumado.acta, true) ||
					!isValidInteger(inhumado.idTipoOrigenInhumacion, true) ||
					!isValidString(inhumado.observacionesOrigen, true) ||
					!isValidInteger(inhumado.idTipoCondicionEspecial, true) ||
					!isValidDate(inhumado.fechaEgreso, false) ||
					!isValidDate(inhumado.fechaTraslado, false) ||
					!isValidInteger(inhumado.idTipoDestinoInhumacion, true) ||
					!isValidString(inhumado.observacionesDestino, true) ||
					!isValidDate(inhumado.fechaExhumacion, false) ||
					!isValidDate(inhumado.fechaReduccion, false) ||
					!isValidString(inhumado.numeroReduccion, true) ||
					!isValidString(inhumado.unidad, true) ||
					!isValidInteger(inhumado.idTipoDocumentoResponsable, true) ||
					!isValidString(inhumado.numeroDocumentoResponsable, true) ||
					!isValidString(inhumado.apellidoResponsable, true) ||
					!isValidString(inhumado.nombreResponsable, true) ||
					!isValidDate(inhumado.fechaHoraInicioVelatorio, false) ||
					!isValidDate(inhumado.fechaHoraFinVelatorio, false)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.inhumadoRepository.modify(id, inhumado);
				if (!result) {
					reject(new ReferenceError('No existe el registro'));
					return;
				}
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async remove(id: number) {
		return new Promise( async (resolve, reject) => {
			try {
				await this.verificacionRepository.removeByInhumado(id);
				await this.direccionRepository.removeByEntidad('Inhumado', id);
				const result = await this.inhumadoRepository.remove(id);
				if (!result) {
					reject(new ReferenceError('No existe el registro'));
					return;
				}
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async removeByCementerio(idCementerio: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const list = (await this.inhumadoRepository.listByCementerio(idCementerio) as Array<InhumadoState>)
				for (let i=0; i<list.length; i++) {
					const row = list[i];
					await this.remove(row.id);
				}
				resolve(idCementerio);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}
}
