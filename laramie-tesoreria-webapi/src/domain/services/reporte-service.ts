import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';
import ReportCajaTicket from './reports/report-caja-ticket';
import ReportCajaCierre from './reports/report-caja-cierre';
import ReportInformeRecaudacionLote from './reports/report-informe-recaudacion-lote';
import ReportInformeRedo from './reports/report-informe-redo';


export default class ReporteService {

    reportCajaTicket: ReportCajaTicket;
    reportCajaCierre: ReportCajaCierre;
    reportInformeRecaudacionLote: ReportInformeRecaudacionLote;
    reportInformeRedo: ReportInformeRedo;

    constructor(reportCajaTicket: ReportCajaTicket,
                reportCajaCierre: ReportCajaCierre,
                reportInformeRecaudacionLote: ReportInformeRecaudacionLote,
                reportInformeRedo: ReportInformeRedo
    )
    {
        this.reportCajaTicket = reportCajaTicket;
        this.reportCajaCierre = reportCajaCierre;
        this.reportInformeRecaudacionLote = reportInformeRecaudacionLote;
        this.reportInformeRedo = reportInformeRedo;
    }

    async generateReport(token: string, usuario:string, reporte:string, paramsReporte:any) {
        return new Promise( async (resolve, reject) => {
            try {

                let buffer = null;
                switch(reporte) {
                    case "CajaTicket": {
                        const idMovimientoCaja:number = parseInt(paramsReporte.idMovimientoCaja);
                        buffer = await this.reportCajaTicket.generateReport(token, usuario, idMovimientoCaja) as any;
                        break;
                    }
                    case "CajaCierre": {
                        const idCajaAsignacion:number = parseInt(paramsReporte.idCajaAsignacion);
                        buffer = await this.reportCajaCierre.generateReport(token, usuario, idCajaAsignacion) as Buffer;
                        break;
                    }
                    case "InformeRecaudacionLote": {
                        const idRecaudacionLote:number = parseInt(paramsReporte.idRecaudacionLote);
                        buffer = await this.reportInformeRecaudacionLote.generateReport(token, usuario, idRecaudacionLote) as Buffer;
                        break;
                    }
                    case "InformeRedo": {
                        const idRegistroContableLote:number = parseInt(paramsReporte.idRegistroContableLote);
                        buffer = await this.reportInformeRedo.generateReport(token, usuario, idRegistroContableLote) as Buffer;
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
                    reject(new ValidationError('Reporte no identificado'));
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
