import { REQUEST_METHOD } from "../../infraestructure/sdk/consts/requestMethodType";
import { APIS } from '../../server/configuration/apis';
import { SendRequest } from '../../infraestructure/sdk/utils/request';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ListaService from "./lista-service";
import PersonaService from "./persona-service";
import ContribuyenteService from "./contribuyente-service";

export default class MedioPagoService {

    constructor() {

    }

    async listByCuenta(token: string, idCuenta:number) {
        return new Promise( async (resolve, reject) => {
            try {
                const listaService = new ListaService();
                const personaService = new PersonaService();
                const contribuyenteService = new ContribuyenteService();

                contribuyenteService.listByCuenta(token, idCuenta)
                .then(async (contribuyentes) => {
                    try {
                        let fetchPersonaContribuyentes = [];
                        (contribuyentes as Array<any>).forEach(contribuyente => {
                            fetchPersonaContribuyentes.push(personaService.findById(token, contribuyente.idPersona));
                        });
                        
                        Promise.all(fetchPersonaContribuyentes)
                        .then(async (personas) => {
                            const listas = await listaService.listByTipos(token, "TipoMedioPago");

                            let mediosPago = [];
                            (personas as Array<any>).forEach(persona => {
                                persona.mediosPago.forEach(medioPago => {
                                    const tipoMedioPago = listas["TipoMedioPago"].find(f => f.id === medioPago.idTipoMedioPago);
                                    medioPago.detalleMedioPago = `${tipoMedioPago.nombre} - Número: ${medioPago.numero}`;
                                    mediosPago.push(medioPago);
                                });
                            });
                            resolve(mediosPago);
                        })
                        .catch((error) => {
                            reject(new ProcessError('Error de conexión', error));
                        });
                    }
                    catch(error) {
                        reject(new ProcessError('Error procesando resultado', error));
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

    async findById(token: string, id: number) {
        const paramsUrl = `/${id}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.ADMINISTRACION_MEDIO_PAGO);
    }
    
}
