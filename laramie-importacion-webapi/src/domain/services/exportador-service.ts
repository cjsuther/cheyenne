
import ExportSUCERP from './process/exportador/export-sucerp';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';


export default class ExportadorService {

    exportSUCERP: ExportSUCERP;

    constructor(exportSUCERP: ExportSUCERP)
    {
        this.exportSUCERP = exportSUCERP;
    }

    async export(idUsuario:number, tipo:string, paramsExportador:any) {
        return new Promise( async (resolve, reject) => {
            try {

                let buffer = null;
                switch(tipo) {
                    case "SUCERP": {
                        buffer = (await this.exportSUCERP.export()).buffer;
                        break;
                    }
                    default: {
                        buffer = null;
                        break;
                    }
                }

                if (buffer) {
                    resolve(buffer);
                }
                else {
                    reject(new ValidationError('Exportación no identificada'));
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
