import * as XLSX from 'xlsx';
import CuentaService from "../../cuenta-service";
import ConfiguracionService from '../../configuracion-service';
import NumeracionService from '../../numeracion-service';
import ListaService from '../../lista-service';
import ProcessError from '../../../../infraestructure/sdk/error/process-error';

import IEmisionEjecucionRepository from '../../../repositories/emision-ejecucion-repository';
import EmisionCalculoService from '../../emision-calculo-service';
import EmisionConceptoService from '../../emision-concepto-service';
import EmisionCuentaCorrienteService from '../../emision-cuenta-corriente-service';
import EmisionImputacionContableService from '../../emision-imputacion-contable-service';
import EmisionCalculoResultadoService from '../../emision-calculo-resultado-service';
import EmisionConceptoResultadoService from '../../emision-concepto-resultado-service';
import EmisionCuentaCorrienteResultadoService from '../../emision-cuenta-corriente-resultado-service';
import EmisionImputacionContableResultadoService from '../../emision-imputacion-contable-resultado-service';

import CuentaCalculo from '../../../dto/cuenta-calculo';
import EmisionEjecucionDTO from '../../../dto/emision-ejecucion-dto';
import EmisionEjecucion from '../../../entities/emision-ejecucion';
import EmisionCalculo from '../../../entities/emision-calculo';
import EmisionConcepto from '../../../entities/emision-concepto';
import EmisionCuentaCorriente from '../../../entities/emision-cuenta-corriente';
import EmisionImputacionContable from '../../../entities/emision-imputacion-contable';
import EmisionCalculoResultado from '../../../entities/emision-calculo-resultado';
import EmisionConceptoResultado from '../../../entities/emision-concepto-resultado';
import EmisionCuentaCorrienteResultado from '../../../entities/emision-cuenta-corriente-resultado';
import EmisionImputacionContableResultado from '../../../entities/emision-imputacion-contable-resultado';
import { CloneObject } from '../../../../infraestructure/sdk/utils/helper';
import config from '../../../../server/configuration/config';


export default class ReportEmisionAprobacionCalculo {

    listaService: ListaService;
	configuracionService: ConfiguracionService;
    numeracionService: NumeracionService;
    cuentaService: CuentaService;
    emisionEjecucionRepository: IEmisionEjecucionRepository;
    emisionCalculoService: EmisionCalculoService;
    emisionConceptoService: EmisionConceptoService;
    emisionCuentaCorrienteService: EmisionCuentaCorrienteService;
    emisionImputacionContableService: EmisionImputacionContableService;
    emisionCalculoResultadoService: EmisionCalculoResultadoService;
    emisionConceptoResultadoService: EmisionConceptoResultadoService;
    emisionCuentaCorrienteResultadoService: EmisionCuentaCorrienteResultadoService;
    emisionImputacionContableResultadoService: EmisionImputacionContableResultadoService;

	constructor(listaService: ListaService,
                configuracionService: ConfiguracionService, numeracionService: NumeracionService, cuentaService: CuentaService,
                emisionEjecucionRepository: IEmisionEjecucionRepository,
                emisionCalculoService: EmisionCalculoService, emisionConceptoService: EmisionConceptoService,
                emisionCuentaCorrienteService: EmisionCuentaCorrienteService, emisionImputacionContableService: EmisionImputacionContableService,
                emisionCalculoResultadoService: EmisionCalculoResultadoService, emisionConceptoResultadoService: EmisionConceptoResultadoService,
                emisionCuentaCorrienteResultadoService: EmisionCuentaCorrienteResultadoService, emisionImputacionContableResultadoService: EmisionImputacionContableResultadoService) {
        this.listaService = listaService;
        this.configuracionService = configuracionService;
        this.numeracionService = numeracionService;
		this.cuentaService = cuentaService;
        this.emisionEjecucionRepository = emisionEjecucionRepository;
        this.emisionCalculoService = emisionCalculoService;
        this.emisionConceptoService = emisionConceptoService;
        this.emisionCuentaCorrienteService = emisionCuentaCorrienteService;
        this.emisionImputacionContableService = emisionImputacionContableService;
        this.emisionCalculoResultadoService = emisionCalculoResultadoService;
        this.emisionConceptoResultadoService = emisionConceptoResultadoService;
        this.emisionCuentaCorrienteResultadoService = emisionCuentaCorrienteResultadoService;
        this.emisionImputacionContableResultadoService = emisionImputacionContableResultadoService;
	}

    async generateReport(idEmisionEjecucion:number) {
        return new Promise<{ buffer: Buffer, fileExtension: string }>( async (resolve, reject) => {
            try {
                const ejecucion = await this.emisionEjecucionRepository.findById(idEmisionEjecucion) as EmisionEjecucion as EmisionEjecucion;

                let requests = [];
                requests.push(this.cuentaService.listByCalculo(idEmisionEjecucion));
                requests.push(this.emisionCalculoService.listByEmisionDefinicion(ejecucion.idEmisionDefinicion));
                // requests.push(this.emisionConceptoService.listByEmisionDefinicion(ejecucion.idEmisionDefinicion));
                // requests.push(this.emisionCuentaCorrienteService.listByEmisionDefinicion(ejecucion.idEmisionDefinicion));
                // requests.push(this.emisionImputacionContableService.listByEmisionDefinicion(ejecucion.idEmisionDefinicion));
                requests.push(this.emisionCalculoResultadoService.listByEmisionEjecucion(idEmisionEjecucion));
                // requests.push(this.emisionConceptoResultadoService.listByEmisionEjecucion(idEmisionEjecucion));
                // requests.push(this.emisionCuentaCorrienteResultadoService.listByEmisionEjecucion(idEmisionEjecucion));
                // requests.push(this.emisionImputacionContableResultadoService.listByEmisionEjecucion(idEmisionEjecucion));
                
                Promise.all(requests)
                .then(responses => {
                    let indexResponse = 0;
                    let items = (responses[indexResponse++]) as Array<CuentaCalculo>;
                    const defCalculos = (responses[indexResponse++] as Array<EmisionCalculo>).sort((a,b) => a.id - b.id);
                    // const defConceptos = (responses[indexResponse++] as Array<EmisionConcepto>).sort((a,b) => a.id - b.id);
                    // const defCuentasCorrientes = (responses[indexResponse++] as Array<EmisionCuentaCorriente>).sort((a,b) => a.id - b.id);
                    // const defImputacionesContables = (responses[indexResponse++] as Array<EmisionImputacionContable>).sort((a,b) => a.id - b.id); 
                    const calculos = (responses[indexResponse++]) as Array<EmisionCalculoResultado>;
                    // const conceptos = (responses[indexResponse++]) as Array<EmisionConceptoResultado>;
                    // const cuentasCorrientes = (responses[indexResponse++]) as Array<EmisionCuentaCorrienteResultado>;
                    // const imputacionesContables = (responses[indexResponse++]) as Array<EmisionImputacionContableResultado>;

                    let indexCalculos = 0;
                    // let indexConceptos = 0;
                    // let indexCuentasCorrientes = 0;
                    // let indexImputacionesContables = 0;

                    let calculosResultado = [];
                    let headers = ["PERIODO", "NRO EMISIÓN", "NRO CUENTA", "CÓDIGO DELEGACIÓN", "NRO RECIBO", "CUOTA", "DIRECCIÓN ENTREGA"];
                    let rowInit = {
                        periodo: "",
                        numeroEmision: "",
                        numeroCuenta: "",
                        codigoDelegacion: "",
                        numeroRecibo: "",
                        cuota: "",
                        direccion: ""
                    };

                    defCalculos.forEach(def =>{
                        if (def.idTipoEmisionCalculo === 242) {
                            rowInit[`caValor${def.id}`] = null;
                            headers.push(def.descripcion);
                            calculosResultado.push(def.id);
                        }
                    });
                    // defConceptos.forEach(def =>{
                    //     rowInit[`coNeto${def.id}`] = null;
                    //     rowInit[`coTotal${def.id}`] = null;
                    //     headers.push(`${def.descripcion} - NETO`);
                    //     headers.push(`${def.descripcion} - TOTAL`);
                    // });
                    // defCuentasCorrientes.forEach(def =>{
                    //     rowInit[`ccDebe${def.id}`] = null;
                    //     rowInit[`ccHaber${def.id}`] = null;
                    //     headers.push(`${def.descripcion} - DEBE`);
                    //     headers.push(`${def.descripcion} - HABER`);
                    // });
                    // defImputacionesContables.forEach(def =>{
                    //     rowInit[`icPorcentaje${def.id}`] = null;
                    //     headers.push(def.descripcion);
                    // });

                    const rows = items.map((item, index) => {

                        let row = CloneObject(rowInit);
                        row.periodo = item.periodo;
                        row.numeroEmision = item.numeroEmision;
                        row.numeroCuenta = item.numeroCuenta;
                        row.codigoDelegacion = item.codigoDelegacion;
                        row.numeroRecibo = item.numeroRecibo;
                        row.cuota = item.cuota;
                        if (item.zonCalle.length > 0) {
                            row.direccion = `${item.zonCalle} ${item.zonAltura}`;
                        }
                        else {
                            row.direccion = `${item.inmCalle} ${item.inmAltura}`;
                        }

                        while(calculos.length > 0 && indexCalculos < calculos.length &&
                            calculos[indexCalculos].idEmisionEjecucionCuenta === item.idEmisionEjecucionCuenta &&
                            calculos[indexCalculos].idEmisionCuota === item.idEmisionCuota)
                        {
                            if (calculosResultado.includes(calculos[indexCalculos].idEmisionCalculo)) {
                                row[`caValor${calculos[indexCalculos].idEmisionCalculo}`] = parseFloat(calculos[indexCalculos].valor);
                            }
                            indexCalculos++;
                        }

                        // while(conceptos.length > 0 && indexConceptos < conceptos.length &&
                        //     conceptos[indexConceptos].idEmisionEjecucionCuenta === item.idEmisionEjecucionCuenta &&
                        //     conceptos[indexConceptos].idEmisionCuota === item.idEmisionCuota)
                        // {
                        //     row[`coNeto${conceptos[indexConceptos].idEmisionConcepto}`] = parseFloat(conceptos[indexConceptos].valorImporteNeto);
                        //     row[`coTotal${conceptos[indexConceptos].idEmisionConcepto}`] = parseFloat(conceptos[indexConceptos].valorImporteTotal);
                        //     indexConceptos++;
                        // }

                        // while(cuentasCorrientes.length > 0 && indexCuentasCorrientes < cuentasCorrientes.length &&
                        //     cuentasCorrientes[indexCuentasCorrientes].idEmisionEjecucionCuenta === item.idEmisionEjecucionCuenta &&
                        //     cuentasCorrientes[indexCuentasCorrientes].idEmisionCuota === item.idEmisionCuota)
                        // {
                        //     row[`ccDebe${cuentasCorrientes[indexCuentasCorrientes].idEmisionCuentaCorriente}`] = parseFloat(cuentasCorrientes[indexCuentasCorrientes].valorDebe);
                        //     row[`ccHaber${cuentasCorrientes[indexCuentasCorrientes].idEmisionCuentaCorriente}`] = parseFloat(cuentasCorrientes[indexCuentasCorrientes].valorHaber);
                        //     indexCuentasCorrientes++;
                        // }
                        
                        // while(imputacionesContables.length > 0 && indexImputacionesContables < imputacionesContables.length &&
                        //     imputacionesContables[indexImputacionesContables].idEmisionEjecucionCuenta === item.idEmisionEjecucionCuenta &&
                        //     imputacionesContables[indexImputacionesContables].idEmisionCuota === item.idEmisionCuota)
                        // {
                        //     row[`icPorcentaje${imputacionesContables[indexImputacionesContables].idEmisionImputacionContable}`] = parseFloat(imputacionesContables[indexImputacionesContables].valorPorcentaje);
                        //     indexImputacionesContables++;
                        // }

                        return row;
                    });

                    if (rows.length > config.XLSX_MAX_ROWS) {
                        const reducer = (prev, curr) => prev + ';' + curr
                        let csv = headers.reduce(reducer)
                        rows.forEach(row => csv += `\n` + Object.values(row).reduce(reducer))
                        resolve({
                            buffer: Buffer.from(csv, 'utf8'),
                            fileExtension: 'csv',
                        })
                    }
                    else {
                        const worksheet = XLSX.utils.json_to_sheet(rows);
                        const workbook = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(workbook, worksheet, "Informe");
                        XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: "A1" });
                        const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' }) as Buffer;

                        resolve({ buffer, fileExtension: 'xlsx', });
                    }
                })
                .catch(reject);
            }
            catch(error) {
                reject(new ProcessError('Error generando reporte', error));
            }
        });
    }


}