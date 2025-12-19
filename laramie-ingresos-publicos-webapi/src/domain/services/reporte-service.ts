

import ReportCementerioSolicitudReduccion from './reports/report-cementerio-solicitud-reduccion';
import ReportCementerioSolicitudVerificacion from './reports/report-cementerio-solicitud-verificacion';
import ReportEmisionAprobacionCalculo from './reports/report-emision-aprobacion-calculo';
import ReportEmisionAprobacionOrdenamiento from './reports/report-emision-aprobacion-ordenamiento';
import ReportEmisionAprobacionControlRecibos from './reports/report-emision-aprobacion-control-recibos';
import ReportCuentaCorrienteRecibo from './reports/report-cuenta-corriente-recibo';
import ReportPlanPagoRecibo from './reports/report-plan-pago-recibo';
import ReportPlanPagoConvenio from './reports/report-plan-pago-convenio';
import ReportApremioCaratula from './reports/report-apremio-caratula';
import ReportVehiculoBaja from './reports/report-vehiculo-baja';
import ReportVehiculoLibreDeuda from './reports/report-vehiculo-libre-deuda';
import ReportCertificadoApremioJuicio from './reports/report-certificado-apremio-juicio';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';


export default class ReporteService {

    reportCementerioSolicitudReduccion: ReportCementerioSolicitudReduccion;
    reportCementerioSolicitudVerificacion: ReportCementerioSolicitudVerificacion;
    reportEmisionAprobacionCalculo: ReportEmisionAprobacionCalculo;
    reportEmisionAprobacionOrdenamiento: ReportEmisionAprobacionOrdenamiento;
    reportEmisionAprobacionControlRecibos: ReportEmisionAprobacionControlRecibos;
    reportCuentaCorrienteRecibo: ReportCuentaCorrienteRecibo;
    reportPlanPagoRecibo: ReportPlanPagoRecibo;
    reportPlanPagoConvenio: ReportPlanPagoConvenio;
    reportApremioCaratula: ReportApremioCaratula;
    reportVehiculoBaja: ReportVehiculoBaja;
    reportVehiculoLibreDeuda: ReportVehiculoLibreDeuda;
    reportCertificadoApremioJuicio: ReportCertificadoApremioJuicio;

    constructor(reportCementerioSolicitudReduccion: ReportCementerioSolicitudReduccion,
                reportCementerioSolicitudVerificacion: ReportCementerioSolicitudVerificacion,
                reportEmisionAprobacionCalculo: ReportEmisionAprobacionCalculo,
                reportEmisionAprobacionOrdenamiento: ReportEmisionAprobacionOrdenamiento,
                reportEmisionAprobacionControlRecibos: ReportEmisionAprobacionControlRecibos,
                reportCuentaCorrienteRecibo: ReportCuentaCorrienteRecibo,
                reportPlanPagoRecibo: ReportPlanPagoRecibo,
                reportPlanPagoConvenio: ReportPlanPagoConvenio,
                reportApremioCaratula: ReportApremioCaratula,
                reportVehiculoBaja: ReportVehiculoBaja,
                reportVehiculoLibreDeuda: ReportVehiculoLibreDeuda,
                reportCertificadoApremioJuicio: ReportCertificadoApremioJuicio)
    {
        this.reportCementerioSolicitudReduccion = reportCementerioSolicitudReduccion;
        this.reportCementerioSolicitudVerificacion = reportCementerioSolicitudVerificacion;
        this.reportEmisionAprobacionCalculo = reportEmisionAprobacionCalculo;
        this.reportEmisionAprobacionOrdenamiento = reportEmisionAprobacionOrdenamiento;
        this.reportEmisionAprobacionControlRecibos = reportEmisionAprobacionControlRecibos;
        this.reportCuentaCorrienteRecibo = reportCuentaCorrienteRecibo;
        this.reportPlanPagoRecibo = reportPlanPagoRecibo;
        this.reportPlanPagoConvenio = reportPlanPagoConvenio;
        this.reportApremioCaratula = reportApremioCaratula;
        this.reportVehiculoBaja = reportVehiculoBaja;
        this.reportVehiculoLibreDeuda = reportVehiculoLibreDeuda;
        this.reportCertificadoApremioJuicio = reportCertificadoApremioJuicio;
    }

    async generateReport(usuario:string, reporte:string, paramsReporte:any) {
        return new Promise( async (resolve, reject) => {
            try {

                let buffer = null;
                switch(reporte) {
                    case "CementerioSolicitudReduccion": {
                        const idCementerio:number = parseInt(paramsReporte.idCementerio);
                        const idInhumado:number = parseInt(paramsReporte.idInhumado);
                        buffer = await this.reportCementerioSolicitudReduccion.generateReport(idCementerio, idInhumado) as Buffer;
                        break;
                    }
                    case "CementerioSolicitudInhumacion": //en la version legacy devuelven el mismo reporte
                    case "CementerioSolicitudVerificacion": {
                        const idCementerio:number = parseInt(paramsReporte.idCementerio);
                        const idInhumado:number = parseInt(paramsReporte.idInhumado);
                        buffer = await this.reportCementerioSolicitudVerificacion.generateReport(idCementerio, idInhumado) as Buffer;
                        break;
                    }
                    case "EmisionAprobacionCalculo": {
                        const idEmisionEjecucion:number = parseInt(paramsReporte.idEmisionEjecucion);
                        buffer = (await this.reportEmisionAprobacionCalculo.generateReport(idEmisionEjecucion)).buffer;
                        break;
                    }
                    case "EmisionAprobacionOrdenamiento": {
                        const idEmisionEjecucion:number = parseInt(paramsReporte.idEmisionEjecucion);
                        buffer = (await this.reportEmisionAprobacionOrdenamiento.generateReport(idEmisionEjecucion)).buffer;
                        break;
                    }
                    case "EmisionAprobacionControlRecibos": {
                        const idEmisionEjecucion:number = parseInt(paramsReporte.idEmisionEjecucion);
                        const idCuenta: number = parseInt(paramsReporte.idCuenta);
                        buffer = await this.reportEmisionAprobacionControlRecibos.generateReport(idEmisionEjecucion, idCuenta) as Buffer;
                        break;
                    }
                    case "CuentaCorrienteRecibo": {
                        const idCuentaPago:number = parseInt(paramsReporte.idCuentaPago);
                        const reciboResumido:boolean = paramsReporte.reciboResumido;
                        buffer = await this.reportCuentaCorrienteRecibo.generateReport(usuario, idCuentaPago, "RECIBO", reciboResumido) as Buffer;
                        break;
                    }
                    case "CuentaCorrientePagoReciboEspecial": {
                        const idCuentaPago:number = parseInt(paramsReporte.idCuentaPago);
                        buffer = await this.reportCuentaCorrienteRecibo.generateReport(usuario, idCuentaPago, "RECIBO ESPECIAL") as Buffer;
                        break;
                    }
                    case "CuentaCorrientePagoContado": {
                        const idCuentaPago:number = parseInt(paramsReporte.idCuentaPago);
                        const reciboResumido:boolean = paramsReporte.reciboResumido;
                        buffer = await this.reportCuentaCorrienteRecibo.generateReport(usuario, idCuentaPago, "PLAN DE PAGOS", reciboResumido) as Buffer;
                        break;
                    }
                    case "CuentaCorrientePagoACuenta": {
                        const idCuentaPago:number = parseInt(paramsReporte.idCuentaPago);
                        const reciboResumido:boolean = paramsReporte.reciboResumido;
                        buffer = await this.reportCuentaCorrienteRecibo.generateReport(usuario, idCuentaPago, "MOSTRADOR", reciboResumido) as Buffer;
                        break;
                    }
                    case "CuentaCorrientePagoAnticipado": {
                        const idCuentaPago:number = parseInt(paramsReporte.idCuentaPago);
                        buffer = await this.reportCuentaCorrienteRecibo.generateReport(usuario, idCuentaPago, "RECIBOS ANTICIPOS") as Buffer;
                        break;
                    }
                    case "PlanPagoRecibo": {
                        const idPlanPago:number = parseInt(paramsReporte.idPlanPago);
                        const planPagoCuota = paramsReporte.planPagoCuota as number[];
                        buffer = await this.reportPlanPagoRecibo.generateReport(usuario, idPlanPago, planPagoCuota) as Buffer;
                        break;
                    }
                    case "PlanPagoConvenio": {
                        const idPlanPago:number = parseInt(paramsReporte.idPlanPago);
                        buffer = await this.reportPlanPagoConvenio.generateReport(usuario, idPlanPago) as Buffer;
                        break;
                    }
                    case "ApremioCaratula": {
                        const idApremio:number = parseInt(paramsReporte.idApremio);
                        buffer = await this.reportApremioCaratula.generateReport(idApremio) as Buffer;
                        break;
                    }
                    case "VehiculoBaja": {
                        const idVehiculo:number = parseInt(paramsReporte.idVehiculo);
                        buffer = await this.reportVehiculoBaja.generateReport(idVehiculo) as Buffer;
                        break;
                    }
                    case "VehiculoLibreDeuda": {
                        const idVehiculo:number = parseInt(paramsReporte.idVehiculo);
                        buffer = await this.reportVehiculoLibreDeuda.generateReport(idVehiculo) as Buffer;
                        break;
                    }
                    case "CertificadoApremioJuicio": {
                        const idCertificadoApremio:number = parseInt(paramsReporte.idCertificadoApremio);
                        buffer = await this.reportCertificadoApremioJuicio.generateReport(idCertificadoApremio) as Buffer;
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
