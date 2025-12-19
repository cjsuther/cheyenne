import { REQUEST_METHOD } from "../../infraestructure/sdk/consts/requestMethodType";
import { APIS } from '../../server/configuration/apis';
import { CreateRequest } from '../../infraestructure/sdk/utils/request';
import ProcessError from '../../infraestructure/sdk/error/process-error';

export default class ExpedienteService {

    constructor() {

    }

    async listByFilter(token: string, idTipoExpediente:number, expediente: string, etiqueta: string) {
        return new Promise( async (resolve, reject) => {
            try {
                const paramsUrl = `/filter?`+
                `idTipoExpediente=${idTipoExpediente}&`+
                `expediente=${encodeURIComponent(expediente)}&`+
                `etiqueta=${encodeURIComponent(etiqueta)}`;
                  
                const request = CreateRequest(
                    REQUEST_METHOD.GET,
                    null,
                    token,
                    APIS.URLS.ADMINISTRACION_EXPEDIENTE,
                    paramsUrl,
                    null
                );

                fetch(request.url, request.options)
                .then(async (response) => {
                    if (response.ok) {
                        try {
                            let data = await response.json();
                            data.forEach(row => {
                                row.detalleExpediente = `${row.ejercicio}-${row.numero}-${row.letra}`;
                            });
                            resolve(data);
                        }
                        catch(error) {
                            reject(new ProcessError('Error procesando resultado', error));
                            return;
                        }
                    }
                    else {
                        response.json().then(reject).catch(reject);
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

    async findById(token: string, id: number) {
        return new Promise( async (resolve, reject) => {
            try {
                const paramsUrl = `/${id}`;

                const request = CreateRequest(
                    REQUEST_METHOD.GET,
                    null,
                    token,
                    APIS.URLS.ADMINISTRACION_EXPEDIENTE,
                    paramsUrl,
                    null
                );

                fetch(request.url, request.options)
                .then(async (response) => {
                    if (response.ok) {
                        try {
                            const data = await response.json();
                            resolve(data.expediente);
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
    
}
