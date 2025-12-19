import { REQUEST_METHOD } from "../../infraestructure/sdk/consts/requestMethodType";
import { APIS } from '../../server/configuration/apis';
import { CreateRequest } from '../../infraestructure/sdk/utils/request';
import ProcessError from '../../infraestructure/sdk/error/process-error';

export default class PersonaService {

    constructor() {

    }

    async listByFilter(token: string, idTipoPersona:number, numeroDocumento: string, nombrePersona: string, etiqueta: string) {
        return new Promise( async (resolve, reject) => {
            try {
                const paramsUrl = `/filter?`+
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
                                if (rowPersona.persona === 500) {
                                    rowPersona.persona.nombrePersona = `${rowPersona.persona.nombre} ${rowPersona.persona.apellido}`;
                                }
                                else if (rowPersona.persona.idTipoPersona === 501) {
                                    rowPersona.persona.nombrePersona = rowPersona.persona.denominacion;
                                }
                                resolve({...rowPersona.persona, mediosPago: rowPersona.mediosPago});
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
    
}
