import fs from 'fs';
import PublishService from '../../publish-service';
import ConfiguracionService from '../../configuracion-service';
import ListaService from '../../lista-service';
import CuentaService from "../../cuenta-service";
import VehiculoService from '../../vehiculo-service';
import PersonaService from '../../persona-service';
import Persona from '../../../entities/persona';

import config from '../../../../server/configuration/config';
import ProcessError from '../../../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../../../infraestructure/sdk/error/reference-error';
import { getNamespace } from 'cls-hooked';
import { verifyAccessToken } from '../../../../server/authorization/token';
import { castPublicError, getDateNow } from '../../../../infraestructure/sdk/utils/convert';
import { ensureDirectoryExistence } from '../../../../infraestructure/sdk/utils/helper';
import { TIPO_PERSONA } from '../../../../infraestructure/sdk/consts/tipoPersona';
import PersonaJuridicaDTO from '../../../dto/persona-juridica-dto';
import PersonaFisicaDTO from '../../../dto/persona-fisica-dto';
import EspecialDTO from '../../../dto/especial-dto';
import DocumentoState from '../../../dto/documento-state';
import VinculoEspecialState from '../../../dto/vinculo-especial-state';
import EtiquetaState from '../../../dto/etiqueta-state';
import ObservacionState from '../../../dto/observacion-state';
import VariableCuentaState from '../../../dto/variable-cuenta-state';
import EspecialService from '../../especial-service';
import EspecialRow from '../../../dto/especial-row';
import VariableService from '../../variable-service';
import Variable from '../../../entities/variable';
import Lista from '../../../entities/lista';
import { isEmpty } from '../../../../infraestructure/sdk/utils/validator';

export default class ImportActasCausas {

    publishService: PublishService;
    configuracionService: ConfiguracionService;
    listaService: ListaService;
    cuentaService: CuentaService;
    vehiculoService: VehiculoService;
    personaService: PersonaService;
    especialService: EspecialService;
    variableService: VariableService;

    constructor(publishService: PublishService,
        configuracionService: ConfiguracionService, listaService: ListaService,
        cuentaService: CuentaService, personaService: PersonaService, especialService: EspecialService, variableService: VariableService
    ) {
        this.publishService = publishService;
        this.configuracionService = configuracionService;
        this.listaService = listaService;
        this.cuentaService = cuentaService;
        this.personaService = personaService;
        this.especialService = especialService;
        this.variableService = variableService;
    }

    async import(path: string, idUsuario: number) {
        return new Promise(async (resolve, reject) => {
            try {
                const pathFileSource = `${config.PATH.TEMP}${path}`;
                const content = fs.readFileSync(pathFileSource, { encoding: 'utf8', flag: 'r' });
                const rows = content.split('\n');

                const localStorage = getNamespace('LocalStorage');
                const token = localStorage.get("accessToken");

                try {
                    const dataToken = verifyAccessToken(token);
                    if (dataToken) {
                        idUsuario = dataToken.idUsuario;
                    }
                }
                catch {
                    reject(new ReferenceError('Token incorrecto'));
                    return;
                };

                const data = {
                    token: token,
                    idTipoEvento: 22, //Interfaz
                    idUsuario: idUsuario,
                    fecha: getDateNow(true),
                    idModulo: 30,
                    origen: "laramie-importacion-webapi/services/import-actas-causas",
                    mensaje: "Importacion actas causas (SUGIT)",
                    data: {
                        file: path
                    }
                };

                await this.publishService.sendMessage("laramie-importacion-webapi/services/import-actas-causas", "AddEvento", idUsuario.toString(), data);


                let alta = [];

                for (let i = 0; i < rows.length; i++) {
                    //alta
                    const row = rows[i].split('|');

                    let itemAlta = {
                        numeroCausa: row[0],
                        numeroActa: row[1],
                        tipoDocumentoInfractor: row[2],
                        numeroDocumentoInfractor: row[3],
                        nombreInfractor: row[4],
                        apellidoInfractor: row[5],
                        dominioVehiculoInfractor: row[6]
                    };
                    alta.push(itemAlta);
                }

                await this.executeAlta(alta, idUsuario);

                const pathFileTarget = `${config.PATH.IMPORTS}${path}`;
                ensureDirectoryExistence(pathFileTarget);
                fs.rename(pathFileSource, pathFileTarget, (err) => {
                    if (err) {
                        reject(new ProcessError('Error moviendo archivo', err));
                        return;
                    }
                });

                resolve({ path });
            }
            catch (error) {
                reject(new ProcessError('Error procesando importacion', error));
            }
        });
    }

    async executeAlta(alta, idUsuario: number) {
        return new Promise(async (resolve, reject) => {
            try {
                const localStorage = getNamespace('LocalStorage');
                const token = localStorage.get("accessToken");

                const listaTipoDocumento = await this.listaService.listByTipo(token, "TipoDocumento") as Array<Lista>;

                const codigoEntidad = 'IMPORTADO_SUGIT';
                const detalleObservacion = 'Importado por proceso de actas causas (SUGIT)';
                const entidad = 'Especial';
                const idEspecial = 0; //idEspecial es simbolico, addImportacion agrega el id automaticamente
                const idCuenta = 0; //idCuenta es simbolico, addImportacion agrega el id automaticamente
                for (let i = 0; i < alta.length; i++) {
                    try {
                        const itemAlta = alta[i];
                        const numeroCausa = itemAlta.numeroCausa;

                        const especiales = await this.especialService.listByCuenta(token, numeroCausa, "", "", 0, "") as Array<EspecialRow>;

                        if (especiales.length > 0) {
                            const data = {
                                token: token,
                                idTipoAlerta: 30,
                                idUsuario: idUsuario,
                                fecha: getDateNow(true),
                                idModulo: 30,
                                origen: "laramie-importacion-webapi/services/import-actas-causas/executeAlta",
                                mensaje: "Error Importación SUGIT",
                                data: {
                                    itemAlta: itemAlta,
                                    message: "La cuenta especial ya existe"
                                }
                            };

                            await this.publishService.sendMessage("laramie-importacion-webapi/services/import-actas-causas/executeAlta", "AddAlerta", idUsuario.toString(), data);
                            continue;
                        }

                        if (itemAlta.numeroCausa.length === 0) {
                            const data = {
                                token: token,
                                idTipoAlerta: 30,
                                idUsuario: idUsuario,
                                fecha: getDateNow(true),
                                idModulo: 30,
                                origen: "laramie-importacion-webapi/services/import-/executeAlta",
                                mensaje: "Error Importación SUGIT",
                                data: {
                                    itemAlta: itemAlta,
                                    message: "Número de causa NO informado"
                                }
                            };

                            await this.publishService.sendMessage("laramie-importacion-webapi/services/import-actas-causas/executeAlta", "AddAlerta", idUsuario.toString(), data);
                            continue;
                        }

                        if (itemAlta.numeroActa.length === 0) {
                            const data = {
                                token: token,
                                idTipoAlerta: 30,
                                idUsuario: idUsuario,
                                fecha: getDateNow(true),
                                idModulo: 30,
                                origen: "laramie-importacion-webapi/services/import-actas-causas/executeAlta",
                                mensaje: "Error Importación SUGIT",
                                data: {
                                    itemAlta: itemAlta,
                                    message: "Número de acta NO informado"
                                }
                            };

                            await this.publishService.sendMessage("laramie-importacion-webapi/services/import-actas-causas/executeAlta", "AddAlerta", idUsuario.toString(), data);
                            continue;
                        }

                        if (itemAlta.tipoDocumentoInfractor.length === 0) {
                            const data = {
                                token: token,
                                idTipoAlerta: 30,
                                idUsuario: idUsuario,
                                fecha: getDateNow(true),
                                idModulo: 30,
                                origen: "laramie-importacion-webapi/services/import-actas-causas/executeAlta",
                                mensaje: "Error Importación SUGIT",
                                data: {
                                    itemAlta: itemAlta,
                                    message: "Tipo de Documento del infractor NO informado"
                                }
                            };

                            await this.publishService.sendMessage("laramie-importacion-webapi/services/import-actas-causas/executeAlta", "AddAlerta", idUsuario.toString(), data);
                            continue;
                        }

                        if (itemAlta.numeroDocumentoInfractor.length === 0) {
                            const data = {
                                token: token,
                                idTipoAlerta: 30,
                                idUsuario: idUsuario,
                                fecha: getDateNow(true),
                                idModulo: 30,
                                origen: "laramie-importacion-webapi/services/import-actas-causas/executeAlta",
                                mensaje: "Error Importación SUGIT",
                                data: {
                                    itemAlta: itemAlta,
                                    message: "Número de Documento del infractor NO informado"
                                }
                            };

                            await this.publishService.sendMessage("laramie-importacion-webapi/services/import-actas-causas/executeAlta", "AddAlerta", idUsuario.toString(), data);
                            continue;
                        }

                        if (itemAlta.nombreInfractor.length === 0) {
                            const data = {
                                token: token,
                                idTipoAlerta: 30,
                                idUsuario: idUsuario,
                                fecha: getDateNow(true),
                                idModulo: 30,
                                origen: "laramie-importacion-webapi/services/import-actas-causas/executeAlta",
                                mensaje: "Error Importación SUGIT",
                                data: {
                                    itemAlta: itemAlta,
                                    message: "Nombre del infractor NO informado"
                                }
                            };

                            await this.publishService.sendMessage("laramie-importacion-webapi/services/import-actas-causas/executeAlta", "AddAlerta", idUsuario.toString(), data);
                            continue;
                        }

                        if (itemAlta.apellidoInfractor.length === 0) {
                            const data = {
                                token: token,
                                idTipoAlerta: 30,
                                idUsuario: idUsuario,
                                fecha: getDateNow(true),
                                idModulo: 30,
                                origen: "laramie-importacion-webapi/services/import-actas-causas/executeAlta",
                                mensaje: "Error Importación SUGIT",
                                data: {
                                    itemAlta: itemAlta,
                                    message: "Apellido del infractor NO informado"
                                }
                            };

                            await this.publishService.sendMessage("laramie-importacion-webapi/services/import-actas-causas/executeAlta", "AddAlerta", idUsuario.toString(), data);
                            continue;
                        }

                        if (itemAlta.dominioVehiculoInfractor.length === 0) {
                            const data = {
                                token: token,
                                idTipoAlerta: 30,
                                idUsuario: idUsuario,
                                fecha: getDateNow(true),
                                idModulo: 30,
                                origen: "laramie-importacion-webapi/services/import-actas-causas/executeAlta",
                                mensaje: "Error Importación SUGIT",
                                data: {
                                    itemAlta: itemAlta,
                                    message: "Dominio del vehículo del infractor NO informado"
                                }
                            };

                            await this.publishService.sendMessage("laramie-importacion-webapi/services/import-actas-causas/executeAlta", "AddAlerta", idUsuario.toString(), data);
                            continue;
                        }

                        let especialDTO = new EspecialDTO();
                        especialDTO.especial.id = idEspecial;
                        especialDTO.especial.idEstadoCarga = 20; //Incompleta
                        especialDTO.especial.idCuenta = especialDTO.cuenta.id;
                        especialDTO.cuenta.numeroCuenta = itemAlta.numeroCausa;

                        const numeroDocumentoTitular = itemAlta.numeroDocumentoInfractor;
                        const nombreTitular = itemAlta.nombreInfractor;
                        const apellidoTitular = itemAlta.apellidoInfractor;

                        const tipoDocumentoTitular = listaTipoDocumento.find(f => f.codigo === itemAlta.tipoDocumentoInfractor);
                        if (!tipoDocumentoTitular) {
                            const data = {
                                token: token,
                                idTipoAlerta: 30,
                                idUsuario: idUsuario,
                                fecha: getDateNow(true),
                                idModulo: 30,
                                origen: "laramie-importacion-webapi/services/import-actas-causas/executeAlta",
                                mensaje: "Error Importación SUGIT",
                                data: {
                                    itemAlta: itemAlta,
                                    message: "El tipo de documento no existe"
                                }
                            };

                            await this.publishService.sendMessage("laramie-importacion-webapi/services/import-actas-causas/executeAlta", "AddAlerta", idUsuario.toString(), data);
                            continue;
                        }
                        const idTipoDocumentoTitular = tipoDocumentoTitular.id;

                        let persona: Persona = null;
                        if (idTipoDocumentoTitular) {
                            persona = await this.personaService.findByDocumento(token, idTipoDocumentoTitular, numeroDocumentoTitular) as Persona;
                        }
                        if (persona && persona.idTipoDocumento === 0) {                        
                            const data = {
                                idCuenta: especialDTO.cuenta.id,
                                idTipoPersona: idTipoDocumentoTitular !== 20 ? 500 : 501, //500: PersonaFisica, 501: PersonaJuridica
                                idTipoDocumento: idTipoDocumentoTitular !== 0 ? idTipoDocumentoTitular : 517, //517: SIN DOCUMENTO
                                numeroDocumento: numeroDocumentoTitular,
                                nombrePersona: nombreTitular,
                                apellidoPersona: apellidoTitular
                            };
                            persona = await this.executeAddPersonaActasCausas(token, data);
                        }

                        if (persona) {
                            const idTipoVinculoEspecialTitular = 101; //TITULAR (Cuentas Especiales)
                            especialDTO.vinculosEspecial.push(new VinculoEspecialState(0, idEspecial, idTipoVinculoEspecialTitular, persona.id, persona.idTipoPersona, persona.idTipoDocumento, persona.numeroDocumento, persona.nombrePersona, 0, null, null, 0, "a"));
                        }
                        else {
                            const data = {
                                token: token,
                                idTipoAlerta: 30,
                                idUsuario: idUsuario,
                                fecha: getDateNow(true),
                                idModulo: 30,
                                origen: "laramie-importacion-webapi/services/import-actas-causas/executeAlta",
                                mensaje: "Error Importación SUGIT",
                                data: {
                                    itemAlta: itemAlta,
                                    message: "No se pudo procesar el titular"
                                }
                            };

                            await this.publishService.sendMessage("laramie-importacion-webapi/services/import-actas-causas/executeAlta", "AddAlerta", idUsuario.toString(), data);
                            continue;
                        }

                        const variableNumeroActa = await this.variableService.findByCodigo(token, 'NUMERO_ACTA') as Variable;
                        const variableDominioVehiculo = await this.variableService.findByCodigo(token, 'DOMINIO_VEHICULO_INFRACCION') as Variable;

                        // se agrega etiqueta
                        especialDTO.etiquetas.push(new EtiquetaState(0, entidad, idEspecial, codigoEntidad, 'a'));

                        // se agrega observacion
                        especialDTO.observaciones.push(new ObservacionState(0, entidad, idEspecial, detalleObservacion, idUsuario, getDateNow(true), 'a'));

                        //se agrega variable cuenta      
                        especialDTO.variablesCuenta.push(new VariableCuentaState(0, variableNumeroActa.id, idCuenta, itemAlta.numeroActa, null, null, 'a'));
                        especialDTO.variablesCuenta.push(new VariableCuentaState(0, variableDominioVehiculo.id, idCuenta, itemAlta.dominioVehiculoInfractor, null, null, 'a'));

                        await this.especialService.addImportacion(token, especialDTO) as EspecialDTO;
                    }
                    catch (error) {
                        const data = {
                            token: token,
                            idTipoAlerta: 30,
                            idUsuario: idUsuario,
                            fecha: getDateNow(true),
                            idModulo: 30,
                            origen: "laramie-importacion-webapi/services/import-actas-causas/executeAlta",
                            mensaje: "Error Importación SUGIT",
                            data: {
                                alta: alta[i],
                                error: castPublicError(error),
                                message: "Error al procesar el alta"
                            }
                        };
                        await this.publishService.sendMessage("laramie-importacion-webapi/services/import-actas-causas/executeAlta", "AddAlerta", idUsuario.toString(), data);
                    }
                }
                resolve({});
            }
            catch (error) {
                reject(new ProcessError('Error procesando importacion', error));
            }
        });
    }

    async executeAddPersonaActasCausas(token: string, data: any) {
        if (data.idTipoPersona === TIPO_PERSONA.FISICA) {
            let personaFisicaDTO = new PersonaFisicaDTO();

            personaFisicaDTO.persona.idTipoDocumento = data.idTipoDocumento;
            personaFisicaDTO.persona.numeroDocumento = data.numeroDocumento;
            personaFisicaDTO.persona.nombre = data.nombrePersona;
            personaFisicaDTO.persona.apellido = data.apellidoPersona;

            personaFisicaDTO.direccion.entidad = "PersonaFisica";
            personaFisicaDTO.direccion.codigoPostal = '';
            personaFisicaDTO.direccion.calle = '';
            personaFisicaDTO.direccion.altura = '';
            personaFisicaDTO.direccion.piso = '';
            personaFisicaDTO.direccion.dpto = '';
            personaFisicaDTO.direccion.idProvincia = 0;
            personaFisicaDTO.direccion.idPais = 0;

            personaFisicaDTO.documentos.push(new DocumentoState(-1, data.idTipoPersona, -1, data.idTipoDocumento, data.numeroDocumento, true, 'a'));

            const dto = await this.personaService.addPersonaFisica(token, personaFisicaDTO) as PersonaFisicaDTO;
            if (dto) {
                const nombrePersonaFisica = `${data.nombrePersona} ${data.apellidoPersona}`;
                return new Persona(dto.persona.id, data.idTipoPersona, nombrePersonaFisica, data.idTipoDocumento, data.numeroDocumento);
            }
            else
                return null;
        }
        else if (data.idTipoPersona === TIPO_PERSONA.JURIDICA) {
            let personaJuridicaDTO = new PersonaJuridicaDTO();

            personaJuridicaDTO.persona.idTipoDocumento = data.idTipoDocumento;
            personaJuridicaDTO.persona.numeroDocumento = data.numeroDocumento;
            personaJuridicaDTO.persona.nombreFantasia = data.nombrePersona;

            personaJuridicaDTO.documentos.push(new DocumentoState(-1, data.idTipoPersona, -1, data.idTipoDocumento, data.numeroDocumento, true, 'a'));

            const dto = await this.personaService.addPersonaJuridica(token, personaJuridicaDTO) as PersonaJuridicaDTO;
            if (dto)
                return new Persona(dto.persona.id, data.idTipoPersona, data.nombrePersona, data.idTipoDocumento, data.numeroDocumento);
            else
                return null;
        }
    }
}
