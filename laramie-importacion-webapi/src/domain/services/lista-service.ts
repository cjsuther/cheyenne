import { REQUEST_METHOD } from '../../infraestructure/sdk/consts/requestMethodType';
import { APIS } from '../../server/configuration/apis';
import { CreateRequest } from '../../infraestructure/sdk/utils/request';
import ProcessError from '../../infraestructure/sdk/error/process-error';


export default class ListaService {

    constructor() {

    }

    async listByTipo(token: string, tipo: string) {
        return new Promise( async (resolve, reject) => {
            try {
                const paramsUrl = `/${tipo}`;
                let urlEndPoint = '';
                switch(tipo) {
                    case "TipoPersona":
                    case "TipoDocumento":
                    case "TipoContacto":
                    case "TipoGeoreferencia":
                    case "CondicionFiscal":
                    case "IngresosBrutos":
                    case "Genero":
                    case "EstadoCivil":
                    case "NivelEstudio":
                    case "FormaJuridica":
                    case "TipoMedioPago":
                    case "TipoTarjeta":
                    case "MarcaTarjeta":
                    case "TipoExpediente":
                    case "RubroAfip":
                    case "TipoFirma":
                    case "EstadoFirma":
                    urlEndPoint = APIS.URLS.ADMINISTRACION_LISTA;
                    break;
                    case "TipoTributo":
                    urlEndPoint = APIS.URLS.LISTA;
                    break;
                    case "FinalidadVehiculo":
                    urlEndPoint = APIS.URLS.LISTA;
                    break;
                    case "OrigenFabricacion":
                    urlEndPoint = APIS.URLS.LISTA;
                    break;
                    case "MotivoBajaVehiculo":
                    urlEndPoint = APIS.URLS.LISTA;
                    break;
                    case "Combustibles":
                    urlEndPoint = APIS.URLS.LISTA;
                    break;
                    default:
                        urlEndPoint = APIS.URLS.LISTA;
                        break;
                }

                const request = CreateRequest(
                    REQUEST_METHOD.GET,
                    null,
                    token,
                    urlEndPoint,
                    paramsUrl,
                    null
                );

                fetch(request.url, request.options)
                .then(async (response) => {
                    if (response.ok) {
                        try {
                            const data = await response.json();
                            resolve(data);
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
