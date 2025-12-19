import Direccion from '../entities/direccion';
import IDireccionRepository from '../repositories/direccion-repository';

import { isValidString, isValidInteger, isValidFloat } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';
import { SendRequest } from '../../infraestructure/sdk/utils/request';
import { REQUEST_METHOD } from '../../infraestructure/sdk/consts/requestMethodType';
import { APIS } from '../../server/configuration/apis';


export default class DireccionService {

    direccionRepository: IDireccionRepository;

    constructor(direccionRepository: IDireccionRepository) {
        this.direccionRepository = direccionRepository;
    }

    async list() {
        return new Promise( async (resolve, reject) => {
            try {
                const result = await this.direccionRepository.list();
                resolve(result);
            }
            catch(error) {
                reject(new ProcessError('Error procesando datos', error));
            }
        });
    }

    async listByEntidad(entidad:string, idEntidad:number) {
        return new Promise( async (resolve, reject) => {
            try {
                const result = await this.direccionRepository.listByEntidad(entidad, idEntidad);
                resolve(result);
            }
            catch(error) {
                reject(new ProcessError('Error procesando datos', error));
            }
        });
    }

    async listByEntidadAdministracion(entidad:string, idEntidad:number) {
        return new Promise( async (resolve, reject) => {
            try {               
                const paramsUrl = `/entidad/${entidad}/${idEntidad}`;
                const result = await SendRequest(null, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.ADMINISTRACION_DIRECCION);
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
                const result = await this.direccionRepository.findById(id);
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

    async add(direccion: Direccion, allowEmpty = false) {
        return new Promise( async (resolve, reject) => {
            try {
                const runValidation = !allowEmpty || [
                    direccion.idPais,
                    direccion.idProvincia,
                    direccion.idLocalidad,
                    direccion.codigoPostal,
                    direccion.calle,
                    direccion.entreCalle1,
                    direccion.entreCalle2,
                    direccion.altura,
                    direccion.piso,
                    direccion.dpto,
                    direccion.referencia,
                    direccion.longitud,
                    direccion.latitud,
                ].some(x => (x !== 0 && x !== ''))

                if (
                    runValidation &&
                    (
                        !isValidString(direccion.entidad, true) ||
                        !isValidInteger(direccion.idEntidad, true) ||
                        !isValidInteger(direccion.idTipoGeoreferencia, true) ||
                        !isValidInteger(direccion.idPais, true) ||
                        !isValidInteger(direccion.idProvincia, true) ||
                        !isValidInteger(direccion.idLocalidad, true) ||
                        !isValidString(direccion.codigoPostal, false) ||
                        !isValidString(direccion.calle, false) ||
                        !isValidString(direccion.entreCalle1, false) ||
                        !isValidString(direccion.entreCalle2, false) ||
                        !isValidString(direccion.altura, false) ||
                        !isValidString(direccion.piso, false) ||
                        !isValidString(direccion.dpto, false) ||
                        !isValidString(direccion.referencia, false) ||
                        !isValidFloat(direccion.longitud, false) ||
                        !isValidFloat(direccion.latitud, false)
                    )
                ) {
                    reject(new ValidationError('Existen campos incompletos'));
                    return;
                }

                direccion.id = null;
                if (direccion.idZonaGeoreferencia === 0) direccion.idZonaGeoreferencia = null;
                if (direccion.idTipoGeoreferencia === 0) direccion.idTipoGeoreferencia = null;
                if (direccion.idPais === 0) direccion.idPais = null;
                if (direccion.idProvincia === 0) direccion.idProvincia = null;
                if (direccion.idLocalidad === 0) direccion.idLocalidad = null;
                const result = await this.direccionRepository.add(direccion);
                resolve(result);
            }
            catch(error) {
                reject(new ProcessError('Error procesando datos', error));
            }
        });
    }

    async modify(id: number, direccion: Direccion, allowEmpty = false) {
        return new Promise( async (resolve, reject) => {
            try {
                const runValidation = !allowEmpty || [
                    direccion.idPais,
                    direccion.idProvincia,
                    direccion.idLocalidad,
                    direccion.codigoPostal,
                    direccion.calle,
                    direccion.entreCalle1,
                    direccion.entreCalle2,
                    direccion.altura,
                    direccion.piso,
                    direccion.dpto,
                    direccion.referencia,
                    direccion.longitud,
                    direccion.latitud,
                ].some(x => (x !== 0 && x !== ''))

                if (
                    runValidation &&
                    (
                        !isValidInteger(direccion.idTipoGeoreferencia, true) ||
                        !isValidInteger(direccion.idPais, true) ||
                        !isValidInteger(direccion.idProvincia, true) ||
                        !isValidInteger(direccion.idLocalidad, true) ||
                        !isValidString(direccion.codigoPostal, false) ||
                        !isValidString(direccion.calle, false) ||
                        !isValidString(direccion.entreCalle1, false) ||
                        !isValidString(direccion.entreCalle2, false) ||
                        !isValidString(direccion.altura, false) ||
                        !isValidString(direccion.piso, false) ||
                        !isValidString(direccion.dpto, false) ||
                        !isValidString(direccion.referencia, false) ||
                        !isValidFloat(direccion.longitud, false) ||
                        !isValidFloat(direccion.latitud, false)
                    )
                ) {
                    reject(new ValidationError('Existen campos incompletos'));
                    return;
                }

                if (direccion.idZonaGeoreferencia === 0) direccion.idZonaGeoreferencia = null;
                if (direccion.idTipoGeoreferencia === 0) direccion.idTipoGeoreferencia = null;
                if (direccion.idPais === 0) direccion.idPais = null;
                if (direccion.idProvincia === 0) direccion.idProvincia = null;
                if (direccion.idLocalidad === 0) direccion.idLocalidad = null;
                const result = await this.direccionRepository.modify(id, direccion);
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
                const result = await this.direccionRepository.remove(id);
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
    
}
