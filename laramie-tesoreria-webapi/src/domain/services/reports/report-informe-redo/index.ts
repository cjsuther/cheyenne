import ProcessError from '../../../../infraestructure/sdk/error/process-error';
import PdfReport from '../../../../infraestructure/sdk/pdf-report';
import { getDateNow, getDateToString, getFormatNumber, iif, precisionRound } from '../../../../infraestructure/sdk/utils/convert';
import RecaudacionContableRow from '../../../dto/recaudacion-contable.row';
import Configuracion from '../../../entities/configuracion';
import RegistroContable from '../../../entities/registro-contable';
import RegistroContableLote from '../../../entities/registro-contable-lote';
import ConfiguracionService from '../../configuracion-service';
import RecaudadoraService from '../../recaudadora-service';
import RegistroContableLoteService from '../../registro-contable-lote-service';
import RegistroContableService from '../../registro-contable-service';


export default class ReportInformeRedo {

    configuracionService: ConfiguracionService;
    recaudadoraService: RecaudadoraService;
    registroContableLoteService: RegistroContableLoteService;
    registroContableService: RegistroContableService

    constructor(configuracionService: ConfiguracionService,
                recaudadoraService: RecaudadoraService,
                registroContableLoteService: RegistroContableLoteService,
                registroContableService: RegistroContableService
    ) {
        this.configuracionService = configuracionService;
        this.recaudadoraService = recaudadoraService;
        this.registroContableLoteService = registroContableLoteService;
        this.registroContableService = registroContableService;
    }

    async generateReport(token: string, usuario:string, idRegistroContableLote: number) {
        return new Promise( async (resolve, reject) => {
            try {
                const today = getDateNow(true);
                const municipioCodigo:string = (await this.configuracionService.findByNombre("MunicipioCodigo") as Configuracion).valor;
                const configuracion = await this.configuracionService.findByNombre("MunicipioNombre") as Configuracion;

                const registroContableLote = await this.registroContableLoteService.findById(idRegistroContableLote) as RegistroContableLote;
                const registros = await this.registroContableService.listByLote(idRegistroContableLote) as RegistroContable[];
                // const recaudadora = await this.recaudadoraService.findById(recaudacionLote.idRecaudadora) as Recaudadora;

                const sortApertura = (a:RegistroContable,b:RegistroContable) => 
                    (a.ejercicio !== b.ejercicio) ? a.ejercicio.localeCompare(b.ejercicio) :
                        (a.jurisdiccion !== b.jurisdiccion) ? a.jurisdiccion.localeCompare(b.jurisdiccion) :
                            (a.recursoPorRubro !== b.recursoPorRubro) ? a.recursoPorRubro.localeCompare(b.recursoPorRubro) :
                                a.cuentaContable.localeCompare(b.cuentaContable);
                registros.sort(sortApertura);

                let importeAgrupado = 0;
                const registrosAgrupados: RecaudacionContableRow[] = [];
                for (let i=0; i<registros.length; i++) {
                    const registro = registros[i];
                    importeAgrupado += registro.importe;
                    if (i === (registros.length - 1) || //ultimo
                        registros[i].ejercicio !== registros[i+1].ejercicio ||
                        registros[i].jurisdiccion !== registros[i+1].jurisdiccion ||
                        registros[i].recursoPorRubro !== registros[i+1].recursoPorRubro ||
                        registros[i].cuentaContable !== registros[i+1].cuentaContable)
                    {
                        const registroAgrupado = new RecaudacionContableRow();
                        registroAgrupado.periodo = registro.ejercicio;
                        registroAgrupado.ejercicio = registro.ejercicio;
                        registroAgrupado.agrupamientoJurisdiccion = registro.jurisdiccion;
                        registroAgrupado.agrupamientoCuenta = iif(registro.recursoPorRubro,"",registro.cuentaContable) ;
                        registroAgrupado.importe = precisionRound(importeAgrupado);
                        registrosAgrupados.push(registroAgrupado);
                        importeAgrupado = 0;
                    }
                }

                const data = {
                    fechaInforme: getDateToString(today,true),
                    municipioNombre: configuracion.valor,
                    recaudadora: "recaudadora.nombre",
                    numeroLote: registroContableLote.numeroLote,
                    numeroRedo: registroContableLote.id.toString(),
                    fechaLote: getDateToString(registroContableLote.fechaLote,false),
                    totalRecibosProcesdos: getFormatNumber(registroContableLote.importeTotal,2),
                    rows: registrosAgrupados.map(x => {
                        return {...x,
                            importe: getFormatNumber(x.importe,2)
                        };
                    })
                };

                const optionsReport = {
                    title: 'Recibo de documentación y valores (REDO)',
                    margin: {
                      top: 100,
                      bottom: 30,
                      left: 30,
                      right: 30
                    },
                    landscape: true,
                    pathBodyTemplate: 'src/domain/services/reports/report-informe-redo/index.ejs',
                    // pathHeaderTemplate: 'src/domain/services/reports/report-cuenta-informe-deuda/header.ejs',
                    pathHeaderTemplate: `src/domain/services/reports/report-common/header_municipio${municipioCodigo}.ejs`,
                    // pathFooterTemplate: '',
                    pathStyles: ['src/domain/services/reports/report-common/index.css'],
                    pathImages: [],
                    data: data
                };
              
                const pdfReport = new PdfReport("InformeRedo.pdf", "src/infraestructure/sdk/pdf-report", optionsReport);
                const buffer = await pdfReport.generate() as Buffer;

                resolve(buffer);
            }
            catch(error) {
                reject(new ProcessError('Error generando reporte', error));
            }
        });
    }


}