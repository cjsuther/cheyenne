import { REQUEST_METHOD } from '../../infraestructure/sdk/consts/requestMethodType';
import { APIS } from '../../server/configuration/apis';
import { CreateRequest, SendRequest } from '../../infraestructure/sdk/utils/request';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import PersonaDTO from '../entities/persona-dto';
import PersonaFisicaDTO from '../entities/persona-fisica-dto';
import DocumentoState from '../entities/documento-state';
import ContactoState from '../entities/contacto-state';
import ApiError from '../../infraestructure/sdk/error/api-error';

export default class PersonaService {

    constructor() {

    }

    async listByDocumento(token: string, idTipoDocumento:number, numeroDocumento: string) {
        return new Promise( async (resolve, reject) => {
            try {
                const paramsUrl = `/filter?`+
                `idTipoDocumento=${idTipoDocumento}&`+
                `numeroDocumento=${encodeURIComponent(numeroDocumento)}&`+
                `nombre=&etiqueta=`;
        
                let fetchPersona = [];       
                let request = CreateRequest(
                    REQUEST_METHOD.GET,
                    null,
                    token,
                    APIS.URLS.ADMINISTRACION_PERSONA_FISICA,
                    paramsUrl,
                    null
                );
                fetchPersona.push(fetch(request.url, request.options));

                request = CreateRequest(
                    REQUEST_METHOD.GET,
                    null,
                    token,
                    APIS.URLS.ADMINISTRACION_PERSONA_JURIDICA,
                    paramsUrl,
                    null
                );
                fetchPersona.push(fetch(request.url, request.options));

                Promise.all(fetchPersona)
                .then(async (responses) => {
                    let dataPersona = [];
                    for (let r=0; r < responses.length; r++) {
                        const response = responses[r];
                        if (response.ok) {
                            try {
                                const data = await response.json();
                                const idTipoPersonaRow = (r === 0) ? 500 : 501;
                                data.forEach(row => {
                                    row.idTipoPersona = idTipoPersonaRow;
                                    if (idTipoPersonaRow === 500) {
                                        row.nombrePersona = `${row.nombre} ${row.apellido}`;
                                    }
                                    else if (idTipoPersonaRow === 501) {
                                        row.nombrePersona = row.denominacion;
                                    }
                                });
                                dataPersona = dataPersona.concat(data);
                            }
                            catch(error) {
                                reject(new ProcessError('Error procesando resultado', error));
                                return;
                            }
                        }
                        else {
                            response.json().then(reject).catch(reject);
                            return;
                        }
                    }
                    resolve(dataPersona);
                })
                .catch((error) => {
                    reject(new ProcessError('Error de conexión', error));
                });
                
            }
            catch(error) {
                reject(new ProcessError('Error procesando datos', error));
            }
        });
    }

    async findById(token: string, id: number) {
        return new Promise( async (resolve, reject) => {
            try {
                const paramsUrl = `/${id}`;
                let fetchPersona = [];

                const requestPersonaFisica = CreateRequest(
                    REQUEST_METHOD.GET,
                    null,
                    token,
                    APIS.URLS.ADMINISTRACION_PERSONA_FISICA,
                    paramsUrl,
                    null
                );
                fetchPersona.push(fetch(requestPersonaFisica.url, requestPersonaFisica.options));

                const requestPersonaJuridica = CreateRequest(
                    REQUEST_METHOD.GET,
                    null,
                    token,
                    APIS.URLS.ADMINISTRACION_PERSONA_JURIDICA,
                    paramsUrl,
                    null
                );
                fetchPersona.push(fetch(requestPersonaJuridica.url, requestPersonaJuridica.options));

                Promise.all(fetchPersona)
                .then(async (responses) => {
                    let rowPersona = null;
                    for (let r=0; r < responses.length; r++) {
                        const response = responses[r];
                        if (response.ok) {
                            try {
                                rowPersona = await response.json();
                                rowPersona.persona.idTipoPersona = (r === 0) ? 500 : (r === 1) ? 501 : 0;
                                if (rowPersona.persona.idTipoPersona === 500) {
                                    rowPersona.persona.nombrePersona = `${rowPersona.persona.nombre} ${rowPersona.persona.apellido}`;
                                }
                                else if (rowPersona.persona.idTipoPersona === 501) {
                                    rowPersona.persona.nombrePersona = rowPersona.persona.denominacion;
                                }
                                resolve({...rowPersona.persona, mediosPago: rowPersona.mediosPago, contactos: rowPersona.contactos});
                                return;
                            }
                            catch(error) {
                                reject(new ProcessError('Error procesando resultado', error));
                                return;
                            }
                        }
                        else {
                            //si r es 0, realizo otro intento, si es 1 no se encontro la persona
                            if (r === 1) {
                                response.json().then(reject).catch(reject);
                                return;
                            }
                        }
                    }
                })
                .catch((error) => {
                    reject(new ProcessError('Error de conexión', error));
                });
                
            }
            catch(error) {
                reject(new ProcessError('Error procesando datos', error));
            }
        });
    }

    async add(token: string, persona:PersonaDTO) {
        return new Promise( async (resolve, reject) => {
            try {
                const TipoContacto_CELULAR = 524;
                const TipoContacto_EMAIL = 525;
                const TipoGeoreferencia_CARGA_DIRECTA = 535;

                let personaFisicaDTO = new PersonaFisicaDTO();

                personaFisicaDTO.persona.idTipoDocumento = persona.idTipoDocumento;
                personaFisicaDTO.persona.numeroDocumento = persona.numeroDocumento;
                personaFisicaDTO.persona.nombre = persona.nombre;
                personaFisicaDTO.persona.apellido = persona.apellido;

                personaFisicaDTO.persona.idNacionalidad = persona.idNacionalidad;
                personaFisicaDTO.persona.idGenero = persona.idGenero;
                personaFisicaDTO.persona.idEstadoCivil = persona.idEstadoCivil;
                personaFisicaDTO.persona.fechaNacimiento = persona.fechaNacimiento;
                personaFisicaDTO.persona.origen = "PORTAL_WEB";

                personaFisicaDTO.direccion.idTipoGeoreferencia = TipoGeoreferencia_CARGA_DIRECTA;
                personaFisicaDTO.direccion.entidad = "PersonaFisica";
                personaFisicaDTO.direccion.codigoPostal = persona.direccionCodigoPostal;
                personaFisicaDTO.direccion.calle = persona.direccionCalle;
                personaFisicaDTO.direccion.altura = persona.direccionAltura;
                personaFisicaDTO.direccion.piso = persona.direccionPiso;
                personaFisicaDTO.direccion.dpto = persona.direccionDpto;
                personaFisicaDTO.direccion.idPais = persona.direccionIdPais;
                personaFisicaDTO.direccion.idProvincia = persona.direccionIdProvincia;
                personaFisicaDTO.direccion.idLocalidad = persona.direccionIdLocalidad;
                personaFisicaDTO.direccion.origen = "PORTAL_WEB";

                personaFisicaDTO.contactos.push(new ContactoState(-1, "PersonaFisica", -1, TipoContacto_EMAIL, persona.contactoEmail, 'a'));
                personaFisicaDTO.contactos.push(new ContactoState(-1, "PersonaFisica", -1, TipoContacto_CELULAR, persona.contactoCelular, 'a'));

                const paramsUrl = `/verified`;
                personaFisicaDTO = await SendRequest(token, paramsUrl, personaFisicaDTO, REQUEST_METHOD.POST, APIS.URLS.ADMINISTRACION_PERSONA_FISICA) as PersonaFisicaDTO;

                resolve({idPersona: personaFisicaDTO.persona.id});
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
