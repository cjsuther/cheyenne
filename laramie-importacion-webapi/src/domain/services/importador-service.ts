
import ImportSUCERP from './process/importador/import-sucerp';
import ImportActasCausas from './process/importador/import-actas-causas';
import ImportARBAVehiculo from "./process/importador/import-arba-vehiculo";
import ImportARBACatastro from "./process/importador/import-arba-catastro";
import ReferenceError from '../../infraestructure/sdk/error/reference-error';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ImportEPagos from './process/importador/import-e-pagos';
import ImportInterbanking from './process/importador/import-interbanking';
import { getDateNow } from '../../infraestructure/sdk/utils/convert';


export default class ImportadorService {

    importSUCERP: ImportSUCERP;
    importActasCausas: ImportActasCausas;
    importARBAVehiculo: ImportARBAVehiculo;
    importARBACatastro: ImportARBACatastro;
    importEPagos: ImportEPagos;
    importInterbanking: ImportInterbanking;

    constructor(importSUCERP: ImportSUCERP,
                importActasCausas: ImportActasCausas,
                importARBAVehiculo: ImportARBAVehiculo,
                importARBACatastro: ImportARBACatastro,
                importEPagos: ImportEPagos,
                importInterbanking: ImportInterbanking
    )
    {
        this.importSUCERP = importSUCERP;
        this.importActasCausas = importActasCausas;
        this.importARBAVehiculo = importARBAVehiculo;
        this.importARBACatastro = importARBACatastro;
        this.importEPagos = importEPagos;
        this.importInterbanking = importInterbanking;
    }

    async import(idUsuario:number, tipo:string, paramsImportador:any) {
        return new Promise( async (resolve, reject) => {
            try {

                let response = null;
                switch(tipo.toUpperCase()) {
                    case "SUCERP": {
                        const path:string = paramsImportador.path;
                        response = await this.importSUCERP.import(path, idUsuario);
                        break;
                    }
                    // SE RESUELVE CON LA INTERFAZ CON EL TRIBUNAL DE FALTAS
                    // case "SUGIT": {
                    //     const path:string = paramsImportador.path;
                    //     response = await this.importActasCausas.import(path, idUsuario);
                    //     break;
                    // }
                    case "ARBA_VEHICULO": {
                        const { formalPath, propietariosPath, denunciasPath, deudasPath } = paramsImportador;
                        response = await this.importARBAVehiculo.import(formalPath, propietariosPath, denunciasPath, deudasPath, idUsuario);
                        break;
                    }
                    case "ARBA_CATASTRO": {
                        const { path } = paramsImportador;
                        response = await this.importARBACatastro.import(path, idUsuario);
                        break;
                    }
                    case "E-PAGOS": {
                        let { fechaEnvio } = paramsImportador;
                        if (fechaEnvio)
                            fechaEnvio = new Date(fechaEnvio);
                        else
                            fechaEnvio = getDateNow();
                        response = await this.importEPagos.import(fechaEnvio, idUsuario);
                        break;
                    }
                    case "INTERBANKING": {
                        let { fechaEnvio } = paramsImportador;
                        if (fechaEnvio)
                            fechaEnvio = new Date(fechaEnvio);
                        else
                            fechaEnvio = getDateNow();
                        response = await this.importInterbanking.import(fechaEnvio, idUsuario);
                        break;
                    }
                    default: {
                        response = null;
                        break;
                    }
                }

                if (response) {
                    resolve(response);
                }
                else {
                    reject(new ValidationError('Importación no identificada'));
                }

            }
            catch(error) {
                if (error instanceof ValidationError ||
                    error instanceof ProcessError ||
                    error instanceof ReferenceError) {
                    reject(error);
                }
                else {
                    reject(new ProcessError('Error procesando datos', error));
                }
            }
        });
    }
    
}
