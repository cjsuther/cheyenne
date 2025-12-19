import { REQUEST_METHOD } from '../../infraestructure/sdk/consts/requestMethodType';
import { APIS } from '../../server/configuration/apis';
import { CreateRequest } from '../../infraestructure/sdk/utils/request';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ValidationError from '../../infraestructure/sdk/error/validation-error';


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
                    let paramsUrl = `/${tipo}`;

                    let urlEndPoint = '';
                    switch(tipo) {
                        case "TipoPersona":
                        case "EstadoCivil":
                        case "TipoDocumento":
                        case "Genero":
                            urlEndPoint = APIS.URLS.ADMINISTRACION_LISTA;
                            break;
                        case "Pais":
                            urlEndPoint = APIS.URLS.PAIS;
                            paramsUrl = '';
                            break;
                        case "Provincia":
                            urlEndPoint = APIS.URLS.PROVINCIA;
                            paramsUrl = '';
                            break;
                        case "Localidad":
                            urlEndPoint = APIS.URLS.LOCALIDAD;
                            paramsUrl = '';
                            break;
                        case "EstadoCuenta":
                        case "TipoTributo":
                        case "UnidadMedida":
                            urlEndPoint = APIS.URLS.INGRESOS_PUBLICOS_LISTA;
                            break;
                        case "Tasa":
                            urlEndPoint = APIS.URLS.TASA;
                            paramsUrl = '';
                            break;
                        case "SubTasa":
                            urlEndPoint = APIS.URLS.SUB_TASA;
                            paramsUrl = '';
                            break;
                        case "TipoCondicionEspecial":
                            urlEndPoint = APIS.URLS.TIPO_CONDICION_ESPECIAL;
                            paramsUrl = '';
                            break;
                        case "TipoMovimiento":
                            urlEndPoint = APIS.URLS.TIPO_MOVIMIENTO;
                            paramsUrl = '';
                            break;
                        default:
                            reject(new ValidationError('Lista inexistente'));
                            return;
                    }

                    const request = CreateRequest(
                        REQUEST_METHOD.GET,
                        null,
                        token,
                        urlEndPoint,
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
