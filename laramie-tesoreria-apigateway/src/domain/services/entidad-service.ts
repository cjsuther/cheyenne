import { REQUEST_METHOD } from "../../infraestructure/sdk/consts/requestMethodType";
import { APIS } from '../../server/configuration/apis';
import { CreateRequest, SendRequest } from '../../infraestructure/sdk/utils/request';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ValidationError from "../../infraestructure/sdk/error/validation-error";


export default class EntidadService {

    constructor() {

    }

    static definitions = {
        EstadoCaja: { grupo: "General", subgrupo: "General", tipo: "EstadoCaja", isEntidad: false, editable: false, url: APIS.URLS.LISTA + '/EstadoCaja' },
        TipoMovimientoCaja: { grupo: "General", subgrupo: "General", tipo: "TipoMovimientoCaja", isEntidad: false, editable: false, url: APIS.URLS.LISTA + '/TipoMovimientoCaja' },
        MedioPago: { grupo: "General", subgrupo: "General", tipo: "MedioPago", isEntidad: false, editable: false, url: APIS.URLS.LISTA + '/MedioPago' },
        Banco: { grupo: "General", subgrupo: "General", tipo: "Banco", isEntidad: false, editable: true, url: APIS.URLS.LISTA + '/Banco' },
        Emisor: { grupo: "General", subgrupo: "General", tipo: "Emisor", isEntidad: false, editable: true, url: APIS.URLS.LISTA + '/Emisor' },
        Dependencia: { grupo: "General", subgrupo: "General", tipo: "Dependencia", isEntidad: true, editable: true, url: APIS.URLS.DEPENDENCIA },
        LugarPago: { grupo: "Recaudación", subgrupo: "Recaudación", tipo: "LugarPago", isEntidad: false, editable: true, url: APIS.URLS.LISTA + '/LugarPago' },
        OrigenRecaudacion: { grupo: "Recaudación", subgrupo: "Recaudación", tipo: "OrigenRecaudacion", isEntidad: false, editable: false, url: APIS.URLS.LISTA + '/OrigenRecaudacion' },
        Recaudadora: { grupo: "Recaudación", subgrupo: "Recaudación", tipo: "Recaudadora", isEntidad: true, editable: true, url: APIS.URLS.RECAUDADORA },
        Caja: { grupo: "Caja", subgrupo: "Caja", tipo: "Caja", isEntidad: true, editable: true, url: APIS.URLS.CAJA },
    }

    async listByDefinicion(token: string) {
        const paramsUrl = `/definicion`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.ENTIDAD);
    }

    async listByTipos(token: string, tipos: string) {
        const lTipos = tipos.split('&');
        return new Promise( async (resolve, reject) => {
            try {
                let fetchTipos = [];
                for (let t=0; t < lTipos.length; t++) {
                    const tipo = lTipos[t];
                    let paramsUrl = null;

                    let urlEndPoint = '';

                    const item = EntidadService.definitions[tipo]
                    if (item) urlEndPoint = item.url
                    else {
                        urlEndPoint = APIS.URLS.ENTIDAD;
                        paramsUrl = `/${tipo}`;
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
    
    async listByTiposFilter(token: string, tipos: string, idFilter: any = null) {
        const lTipos = tipos.split('&');
        return new Promise( async (resolve, reject) => {
            try {
                
                let fetchTipos = [];
                for (let t=0; t < lTipos.length; t++) {

                    const tipo = lTipos[t];
                    let paramsUrl = null;

                    let urlEndPoint = '';

                    const item = EntidadService.definitions[tipo]

                    if (item) {
                        urlEndPoint = item.url
                    }
                    else {
                        urlEndPoint = APIS.URLS.ENTIDAD;
                        paramsUrl = `/${tipo}`;
                    }

                    if (idFilter) {
                        switch(tipo) {
                            default:
                                break;
                        }               
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

    async findById(token: string, tipo: string, id: number) {
        const item = EntidadService.definitions[tipo]

        if (!item) {
            return new Promise((resolve, reject) => reject(new ReferenceError('La entidad no existe')))
        }

        const paramsUrl = `/${id}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, item.url);
    }

    async add(token: string, tipo: string, dataBody: object) {
        const item = EntidadService.definitions[tipo]

        if (!item) {
            return new Promise((resolve, reject) => reject(new ReferenceError('La entidad no existe')))
        }
        if (!item.editable) {
            return new Promise((resolve, reject) => reject(new ValidationError('La entidad no está definida como editable')));
        }

        return SendRequest(token, null, dataBody, REQUEST_METHOD.POST, item.url);
    }

    async modify(token: string, tipo: string, id: number, dataBody: object) {
        const item = EntidadService.definitions[tipo]

        if (!item) {
            return new Promise((resolve, reject) => reject(new ReferenceError('La entidad no existe')))
        }
        if (!item.editable) {
            return new Promise((resolve, reject) => reject(new ValidationError('La entidad no está definida como editable')));
        }

        const paramsUrl = `/${id}`;
        return SendRequest(token, paramsUrl, dataBody, REQUEST_METHOD.PUT, item.url);
    }

    async remove(token: string, tipo: string, id: number) {
        const item = EntidadService.definitions[tipo]

        if (!item) {
            return new Promise((resolve, reject) => reject(new ReferenceError('La entidad no existe')))
        }
        if (!item.editable) {
            return new Promise((resolve, reject) => reject(new ValidationError('La entidad no está definida como editable')));
        }

        const paramsUrl = `/${id}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.DELETE, item.url);
    }
}
