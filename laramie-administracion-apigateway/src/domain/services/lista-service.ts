import { REQUEST_METHOD } from "../../infraestructure/sdk/consts/requestMethodType";
import { APIS } from '../../server/configuration/apis';
import { CreateRequest } from '../../infraestructure/sdk/utils/request';
import ProcessError from '../../infraestructure/sdk/error/process-error';


export default class ListaService {

    constructor() {

    }

    async listByTipos(token: string, tipos: string) {
        const lTipos = tipos.split('&');
        return new Promise( async (resolve, reject) => {
            try {
                
                let fetchTipos = [];
                for (let t=0; t < lTipos.length; t++) {
                    const tipo = lTipos[t];
                    const paramsUrl = `/${tipo}`;
                    const request = CreateRequest(
                        REQUEST_METHOD.GET,
                        null,
                        token,
                        APIS.URLS.LISTA,
                        paramsUrl,
                        null
                    );
                    fetchTipos.push(fetch(request.url, request.options));
                }

                Promise.all(fetchTipos)
                .then(async (responses) => {
                    let dataTipos = {};
                    for (let r=0; r < responses.length; r++) {
                        const response = responses[r];
                        if (response.ok) {
                            try {
                                const data = await response.json();
                                dataTipos[lTipos[r]] = data;
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
                    resolve(dataTipos);
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
