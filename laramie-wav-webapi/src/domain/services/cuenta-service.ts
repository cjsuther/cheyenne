import { REQUEST_METHOD } from '../../infraestructure/sdk/consts/requestMethodType';
import { APIS } from '../../server/configuration/apis';
import { SendRequest } from '../../infraestructure/sdk/utils/request';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ApiError from '../../infraestructure/sdk/error/api-error';
import CuentaDeuda from '../entities/cuenta-deuda';
import Cuenta from '../entities/cuenta';
import { resolve } from 'path';
import { CUENTA_STATE } from '../../infraestructure/sdk/consts/cuentaState';
import { isEmpty } from '../../infraestructure/sdk/utils/validator';
import VinculoCuenta from '../entities/vinculo-cuenta';
import PersonaService from './persona-service';
import { TIPO_PERSONA } from '../../infraestructure/sdk/consts/tipoPersona';
import DeclaracionJuradaService from './declaracion-jurada-service';
import { TRIBUTO_TYPE } from '../../infraestructure/sdk/consts/tributoType';


export default class CuentaService {

    personaService: PersonaService;
    declaracionJuradaService: DeclaracionJuradaService;

    constructor(personaService: PersonaService, declaracionJuradaService: DeclaracionJuradaService) {
        this.personaService = personaService;
        this.declaracionJuradaService = declaracionJuradaService;
    }

    async findById(token: string, idCuenta: number) {
		return new Promise( async (resolve, reject) => {
			try {
                const paramsUrl = `/${idCuenta}`;
                const data = await SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.CUENTA) as any[];
    
                const cuenta = new Cuenta();
                cuenta.setFromObject(data);

                resolve(cuenta);
			}
			catch(error) {
                if (error.statusCode && error.message) {
                    reject(new ApiError(error.message, error.statusCode));
                }
                else {
                    reject(new ProcessError('Error procesando datos', error));
                }
			}
		});
    }

    async listByNumero(token: string, idTipoTributo: number, numeroCuenta: string, numeroWeb: string) {
		return new Promise( async (resolve, reject) => {
			try {
                const paramsUrl = `/numero/${idTipoTributo}/${encodeURIComponent(numeroCuenta)}/${encodeURIComponent(numeroWeb)}`;
                const data = await SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.CUENTA) as any[];
    
                const cuentas: CuentaDeuda[] = data.map(row => {
                    const cuenta = new CuentaDeuda();
                    cuenta.setFromObject(row);
                    return cuenta;
                });
                const cuentasActivas = cuentas.filter(f => f.idEstadoCuenta === CUENTA_STATE.ACTIVA);

                resolve(cuentasActivas);
			}
			catch(error) {
                if (error.statusCode && error.message) {
                    reject(new ApiError(error.message, error.statusCode));
                }
                else {
                    reject(new ProcessError('Error procesando datos', error));
                }
			}
		});
    }

    async listByPersona(token: string, idPersona: number) {
		return new Promise( async (resolve, reject) => {
			try {
                const paramsUrl = `/persona/${idPersona}`;
                const cuentas = await SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.CUENTA) as any[];
                const cuentasActivas = cuentas.filter(f => f.idEstadoCuenta === CUENTA_STATE.ACTIVA && (f.esTitular || f.esResponsableCuenta));

                for (let i=0; i<cuentasActivas.length; i++) {
                    const cuenta = cuentasActivas[i];
                    if (cuenta.idTipoTributo === TRIBUTO_TYPE.COMERCIOS) {
                        const defDDJJ = await this.declaracionJuradaService.list(token, idPersona, cuenta.id) as any[];
                        cuenta.presentaDDJJ = (defDDJJ.length > 0);
                    }
                    else {
                        cuenta.presentaDDJJ = false;
                    }
                }

                resolve(cuentasActivas);
			}
			catch(error) {
                if (error.statusCode && error.message) {
                    reject(new ApiError(error.message, error.statusCode));
                }
                else {
                    reject(new ProcessError('Error procesando datos', error));
                }
			}
		});
    }

    async bindContribuyente(token: string, idCuenta: number, idPersona: number, dataBody: any) {
        const paramsUrl = `/${idCuenta}/contribuyente/${idPersona}/bind`;
        return SendRequest(token, paramsUrl, dataBody, REQUEST_METHOD.PUT, APIS.URLS.CUENTA);
    }

    async unbindContribuyente(token: string, idCuenta: number, idPersona: number, dataBody: any) {
		return new Promise( async (resolve, reject) => {
			try {
                const TipoContacto_EMAIL = 525;

                const personaDesvinculada = await this.personaService.findById(token, idPersona) as any;
                const emailPersonaDesvinculada = personaDesvinculada.contactos.find(f => f.idTipoContacto === TipoContacto_EMAIL);
                dataBody.emailPersonaDesvinculada = (emailPersonaDesvinculada) ? emailPersonaDesvinculada.detalle : "";

                if (isEmpty(dataBody.emailZonaEntrega)) {
                    const TITULARES = [51,61,71,81,91,101];
                    const RESPONSABLES = [50,60,70,80,90,100];
                    
                    const cuenta = await this.findById(token, idCuenta) as Cuenta;
                    const paramsUrlVinculos = `/tributo/${cuenta.idTipoTributo}/${cuenta.idTributo}`;
                    const vinculosCuenta = await SendRequest(token, paramsUrlVinculos, null, REQUEST_METHOD.GET, APIS.URLS.VINCULO_CUENTA) as VinculoCuenta[];

                    const vinculosTitulares = vinculosCuenta.filter(f => TITULARES.includes(f.idTipoVinculoCuenta) && f.idPersona !== parseInt(idPersona.toString()));
                    vinculosTitulares.sort((a,b) => a.id - b.id); //en caso de igual tipo de vinculo, se prioriza el primero ingresado
                    const vinculosResponsables = vinculosCuenta.filter(f => RESPONSABLES.includes(f.idTipoVinculoCuenta) && f.idPersona !== parseInt(idPersona.toString()));
                    vinculosResponsables.sort((a,b) => a.id - b.id); //en caso de igual tipo de vinculo, se prioriza el primero ingresado
                    const vinculosAdmitidos = [vinculosTitulares, vinculosResponsables];

                    let emailVerificado = "";
                    let emailNoVerificado = "";

                    for (let t=0; t<vinculosAdmitidos.length; t++) {
                        const vinculos = vinculosAdmitidos[t];
                        
                        for (let i=0; i<vinculos.length; i++) {
                            const vinculo = vinculos[i];
                            const persona = await this.personaService.findById(token, vinculo.idPersona) as any;
                            if (persona.idTipoPersona === TIPO_PERSONA.JURIDICA) continue;

                            const email = persona.contactos.find(f => f.idTipoContacto === TipoContacto_EMAIL);
                            if (email) {
                                const personaVerificada = (persona.origen === "PORTAL_WEB");
                                if (personaVerificada && isEmpty(emailVerificado)) emailVerificado = email.detalle;
                                else if (!personaVerificada && isEmpty(emailNoVerificado)) emailNoVerificado = email.detalle;
                            }

                            if (!isEmpty(emailVerificado)) break;
                        }
                    }

                    dataBody.emailZonaEntrega = !isEmpty(emailVerificado) ? emailVerificado : !isEmpty(emailNoVerificado) ? emailNoVerificado : "";
                }

                const paramsUrl = `/${idCuenta}/contribuyente/${idPersona}/unbind`;
                const response = await SendRequest(token, paramsUrl, dataBody, REQUEST_METHOD.PUT, APIS.URLS.CUENTA);

                resolve(response);
            }
            catch(error) {
                if (error.statusCode && error.message) {
                    reject(new ApiError(error.message, error.statusCode));
                }
                else {
                    reject(new ProcessError('Error procesando datos', error));
                }
            }
        });
    }

}
