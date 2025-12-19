import { REQUEST_METHOD } from '../../infraestructure/sdk/consts/requestMethodType';
import { APIS } from '../../server/configuration/apis';
import { CreateRequest, SendRequest } from '../../infraestructure/sdk/utils/request';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import Persona from '../entities/persona';
import { TIPO_PERSONA } from '../../infraestructure/sdk/consts/tipoPersona';

export default class PersonaService {

    constructor() {

    }

    async listByFilter(token: string, idTipoPersona:number, idTipoDocumento:number, numeroDocumento: string, nombrePersona: string, etiqueta: string) {
        return new Promise( async (resolve, reject) => {
            try {
                const paramsUrl = `/filter?`+
                `idTipoDocumento=${idTipoDocumento}&`+
                `numeroDocumento=${encodeURIComponent(numeroDocumento)}&`+
                `nombre=${encodeURIComponent(nombrePersona)}&`+
                `etiqueta=${encodeURIComponent(etiqueta)}`;
        
                let fetchPersona = [];
                if (idTipoPersona === 0 || idTipoPersona === 500/*PersonaFísica*/) {           
                    const request = CreateRequest(
                        REQUEST_METHOD.GET,
                        null,
                        token,
                        APIS.URLS.ADMINISTRACION_PERSONA_FISICA,
                        paramsUrl,
                        null
                    );
                    fetchPersona.push(fetch(request.url, request.options));
                }
                if (idTipoPersona === 0 || idTipoPersona === 501/*PersonaJuridica*/) {
                    const request = CreateRequest(
                        REQUEST_METHOD.GET,
                        null,
                        token,
                        APIS.URLS.ADMINISTRACION_PERSONA_JURIDICA,
                        paramsUrl,
                        null
                    );
                    fetchPersona.push(fetch(request.url, request.options));
                }

                Promise.all(fetchPersona)
                .then(async (responses) => {
                    let dataPersona = [];
                    for (let r=0; r < responses.length; r++) {
                        const response = responses[r];
                        if (response.ok) {
                            try {
                                const data = await response.json();
                                const idTipoPersonaRow = (idTipoPersona === 0 && r === 0) ? 500 :
                                                         (idTipoPersona === 0 && r === 1) ? 501 : idTipoPersona;
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

    async findById(token: string, idTipoPersona:number, id: number) {
        return new Promise( async (resolve, reject) => {
            try {
                let fetchPersona = null;
                if (idTipoPersona === TIPO_PERSONA.FISICA) {
                    const paramsUrl = `/${id}`;
                    const requestPersonaFisica = CreateRequest(
                        REQUEST_METHOD.GET,
                        null,
                        token,
                        APIS.URLS.ADMINISTRACION_PERSONA_FISICA,
                        paramsUrl,
                        null
                    );
                    fetchPersona = fetch(requestPersonaFisica.url, requestPersonaFisica.options);
                }
                if (idTipoPersona === TIPO_PERSONA.JURIDICA) {
                    const paramsUrl = `/${id}`;
                    const requestPersonaJuridica = CreateRequest(
                        REQUEST_METHOD.GET,
                        null,
                        token,
                        APIS.URLS.ADMINISTRACION_PERSONA_JURIDICA,
                        paramsUrl,
                        null
                    );
                    fetchPersona = fetch(requestPersonaJuridica.url, requestPersonaJuridica.options);
                }

                fetchPersona
                .then(async (response) => {
                    if (response.ok) {
                        try {
                            const rowPersona = await response.json();
                            rowPersona.persona.idTipoPersona = idTipoPersona;
                            if (rowPersona.persona.idTipoPersona === 500) {
                                rowPersona.persona.nombrePersona = `${rowPersona.persona.nombre} ${rowPersona.persona.apellido}`;
                                resolve({persona: rowPersona.persona, direccion: rowPersona.direccion, documentos: []});
                            }
                            else if (rowPersona.persona.idTipoPersona === 501) {
                                rowPersona.persona.nombrePersona = rowPersona.persona.denominacion;
                                resolve({persona: rowPersona.persona, domicilioLegal: rowPersona.domicilioLegal, domicilioFiscal: rowPersona.domicilioFiscal, documentos: []});
                            }
                            return;
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

    async findByDocumento(token: string, idTipoDocumento: number, numeroDocumento:string) {
        return new Promise( async (resolve, reject) => {
            try {
                const paramsUrl = `/filter?`+
                `idTipoDocumento=${idTipoDocumento}&`+
                `numeroDocumento=${numeroDocumento}&nombre=&etiqueta=`;

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
                    let persona = new Persona();
                    for (let r=0; r < responses.length; r++) {
                        const response = responses[r];
                        if (response.ok) {
                            try {
                                const rows = await response.json();
                                if (rows.length === 0) {
                                    continue; //sigo buscando...
                                }
                                else {
                                    const rowPersona = rows[0];
                                    persona.id = rowPersona.id;
                                    persona.idTipoDocumento = idTipoDocumento;
                                    persona.numeroDocumento = numeroDocumento;
                                    persona.idTipoPersona = (r === 0) ? 500 : (r === 1) ? 501 : 0;
                                    if (persona.idTipoPersona === 500) {
                                        persona.nombrePersona = `${rowPersona.nombre} ${rowPersona.apellido}`;
                                    }
                                    else if (persona.idTipoPersona === 501) {
                                        persona.nombrePersona = rowPersona.denominacion;
                                    }
                                    break; //
                                }
                            }
                            catch(error) {
                                reject(new ProcessError('Error procesando resultado', error));
                                return;
                            }
                        }
                        else {
                            response.json().then(reject).catch(reject);
                        }
                    }
                    resolve(persona);
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

    async addPersonaFisica(token: string, dataBody:object) {
        const paramsUrl = `/importacion`;
        return SendRequest(token, paramsUrl, dataBody, REQUEST_METHOD.POST, APIS.URLS.ADMINISTRACION_PERSONA_FISICA);
    }

    async modifyPersonaFisica(token: string, id:number, dataBody:object) {
        const paramsUrl = `/importacion/${id}`;
        return SendRequest(token, paramsUrl, dataBody, REQUEST_METHOD.PUT, APIS.URLS.ADMINISTRACION_PERSONA_FISICA);
    }

    async addPersonaJuridica(token: string, dataBody:object) {
        const paramsUrl = `/importacion`;
        return SendRequest(token, paramsUrl, dataBody, REQUEST_METHOD.POST, APIS.URLS.ADMINISTRACION_PERSONA_JURIDICA);
    }

    async modifyPersonaJuridica(token: string, id:number, dataBody:object) {
        const paramsUrl = `/importacion/${id}`;
        return SendRequest(token, paramsUrl, dataBody, REQUEST_METHOD.PUT, APIS.URLS.ADMINISTRACION_PERSONA_JURIDICA);
    }

}
