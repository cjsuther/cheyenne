import CuentaService from "../../cuenta-service";
import ConfiguracionService from '../../configuracion-service';

import TasaService from '../../tasa-service';
import SubTasaService from '../../sub-tasa-service';
import EmisionEjecucionService from '../../emision-ejecucion-service';
import EmisionEjecucionCuotaService from '../../emision-ejecucion-cuota-service';
import EmisionCuentaCorrienteService from "../../emision-cuenta-corriente-service";
import EmisionConceptoService from '../../emision-concepto-service';
import EmisionConceptoResultadoService from '../../emision-concepto-resultado-service';

import Configuracion from "../../../entities/configuracion";
import CuentaCalculo from "../../../dto/cuenta-calculo";
import EmisionCuota from "../../../entities/emision-cuota";
import EmisionConcepto from "../../../entities/emision-concepto";
import EmisionEjecucionDTO from "../../../dto/emision-ejecucion-dto";

import ProcessError from '../../../../infraestructure/sdk/error/process-error';
import ValidationError from "../../../../infraestructure/sdk/error/validation-error";
import { GetDayDifference, GetDayOfYear, GetNumeroCodigoBarras, distinctArray } from '../../../../infraestructure/sdk/utils/helper';
import { getFormatNumber } from "../../../../infraestructure/sdk/utils/convert";
import EmisionConceptoResultado from "../../../entities/emision-concepto-resultado";
import EmisionCuentaCorriente from "../../../entities/emision-cuenta-corriente";



export default class CodigoBarrasExecute {

    cuentaService: CuentaService;
    configuracionService: ConfiguracionService;

    tasaService: TasaService;
    subTasaService: SubTasaService;
    emisionEjecucionService: EmisionEjecucionService;
    emisionEjecucionCuotaService: EmisionEjecucionCuotaService;
    emisionCuentaCorrienteService: EmisionCuentaCorrienteService;
    emisionConceptoService: EmisionConceptoService;
    emisionConceptoResultadoService: EmisionConceptoResultadoService;

	constructor(cuentaService: CuentaService, configuracionService: ConfiguracionService,
                tasaService: TasaService, subTasaService: SubTasaService,
                emisionEjecucionService: EmisionEjecucionService, emisionEjecucionCuotaService: EmisionEjecucionCuotaService,
                emisionCuentaCorrienteService: EmisionCuentaCorrienteService,
                emisionConceptoService: EmisionConceptoService, emisionConceptoResultadoService: EmisionConceptoResultadoService) {
		this.cuentaService = cuentaService;
        this.configuracionService = configuracionService;
        this.tasaService = tasaService;
        this.subTasaService = subTasaService;
        this.emisionEjecucionService = emisionEjecucionService;
        this.emisionEjecucionCuotaService = emisionEjecucionCuotaService;
        this.emisionCuentaCorrienteService = emisionCuentaCorrienteService;
        this.emisionConceptoService = emisionConceptoService;
        this.emisionConceptoResultadoService = emisionConceptoResultadoService;
	}

    async execute(idEmisionEjecucion:number) {
        return new Promise( async (resolve, reject) => {
            try {
                const municipioPagoFacil:string = (await this.configuracionService.findByNombre("MunicipioPagoFacil") as Configuracion).valor;
                const ejecucionDTO = await this.emisionEjecucionService.findById(idEmisionEjecucion) as EmisionEjecucionDTO;
                const ejecucion = ejecucionDTO.emisionEjecucion;
                const definicion = ejecucionDTO.emisionDefinicion;
                const cuotas = ejecucionDTO.emisionCuotas as Array<EmisionCuota>;
                const defCuentasCorrientes = await this.emisionCuentaCorrienteService.listByEmisionDefinicion(definicion.id) as Array<EmisionCuentaCorriente>
                const defConceptos = await this.emisionConceptoService.listByEmisionDefinicion(definicion.id) as Array<EmisionConcepto>;

                //ids de Tasas y SubTasas
                let idEmisionConceptoTasaCabecera = 0;
                let idEmisionConceptoRecargo = 0;

                try {
                    const defCuentaCorrienteCabecera = defCuentasCorrientes.find(f => f.tasaCabecera);
                    const idTasaTasaCabecera = defCuentaCorrienteCabecera.idTasa;
                    const idSubTasaTasaCabecera = defCuentaCorrienteCabecera.idSubTasa;
                    idEmisionConceptoTasaCabecera = defConceptos.find(f => f.idTasa === idTasaTasaCabecera && f.idSubTasa === idSubTasaTasaCabecera).id;
                    idEmisionConceptoRecargo = defConceptos.find(f => f.vencimiento === 2).id; 
                }
                catch {
                    reject(new ValidationError('No están definidas todas las tasas en los conceptos'));
                    return;
                }

                const items = await this.cuentaService.listByCalculo(idEmisionEjecucion) as Array<CuentaCalculo>;
                if (items.length === 0) {
                    reject(new ValidationError('No hay conceptos para procesar'));
                    return;
                }

                let requestUpdates = [];
                if (ejecucion.calculoPagoAnticipado) {
                    const idsEmisionEjecucionCuenta = distinctArray(items.map(item => item.idEmisionEjecucionCuenta));
                    for (let c=0; c < idsEmisionEjecucionCuenta.length; c++) {
                        const itemsXCuenta = items.filter(f => f.idEmisionEjecucionCuenta === idsEmisionEjecucionCuenta[c]);
                        let montoVencimiento1Recibo = 0;
                        let montoVencimiento2Recibo = 0;
                        for (let i=0; i < itemsXCuenta.length; i++) {
                            const item = itemsXCuenta[i];
                            const conceptos = await this.emisionConceptoResultadoService.listByEmisionEjecucionCuenta(item.idEmisionEjecucionCuenta) as Array<EmisionConceptoResultado>;
                            const conceptosXcuota = conceptos.filter(f => f.idEmisionCuota === item.idEmisionCuota);
        
                            const valorTasaCabecera = conceptosXcuota.find(f => f.idEmisionConcepto === idEmisionConceptoTasaCabecera).valorImporteTotal;
                            const valorRecargo = conceptosXcuota.find(f => f.idEmisionConcepto === idEmisionConceptoRecargo).valorImporteTotal;
        
                            montoVencimiento1Recibo += parseFloat(valorTasaCabecera);
                            montoVencimiento2Recibo += parseFloat(valorTasaCabecera) + parseFloat(valorRecargo);
                        }

                        const cuota = cuotas.find(f => f.id === itemsXCuenta[0].idEmisionCuota); //primer item (todos comparten ciertos datos)
                        const numeroCodigoBarras = GetNumeroCodigoBarras(
                            municipioPagoFacil,
                            getFormatNumber(montoVencimiento1Recibo,2).toString().replace(',','').replace('.',''),
                            cuota.fechaVencimiento1.getFullYear().toString().substring(2),
                            GetDayOfYear(cuota.fechaVencimiento1).toString(),
                            getFormatNumber(montoVencimiento2Recibo,2).toString().replace(',','').replace('.',''),
                            GetDayDifference(cuota.fechaVencimiento1, cuota.fechaVencimiento2).toString(),
                            itemsXCuenta[0].codigoDelegacion,
                            itemsXCuenta[0].numeroRecibo.toString()
                        );

                        requestUpdates = requestUpdates.concat(itemsXCuenta.map(async item => {
                            return {
                                idEmisionEjecucionCuota: item.idEmisionEjecucionCuota,
                                codigoBarras: numeroCodigoBarras
                            };
                        }));
                    }
                }
                else {
                    requestUpdates = items.map(async item => {
                        const conceptos = await this.emisionConceptoResultadoService.listByEmisionEjecucionCuenta(item.idEmisionEjecucionCuenta) as Array<EmisionConceptoResultado>;
                        const conceptosXcuota = conceptos.filter(f => f.idEmisionCuota === item.idEmisionCuota);
                        const cuota = cuotas.find(f => f.id === item.idEmisionCuota);
    
                        const valorTasaCabecera = conceptosXcuota.find(f => f.idEmisionConcepto === idEmisionConceptoTasaCabecera).valorImporteTotal;
                        const valorRecargo = conceptosXcuota.find(f => f.idEmisionConcepto === idEmisionConceptoRecargo).valorImporteTotal;
    
                        const montoVencimiento1 = parseFloat(valorTasaCabecera);
                        const montoVencimiento2 = parseFloat(valorTasaCabecera) + parseFloat(valorRecargo);
    
                        const numeroCodigoBarras = GetNumeroCodigoBarras(
                            municipioPagoFacil,
                            getFormatNumber(montoVencimiento1,2).toString().replace(',','').replace('.',''),
                            cuota.fechaVencimiento1.getFullYear().toString().substring(2),
                            GetDayOfYear(cuota.fechaVencimiento1).toString(),
                            getFormatNumber(montoVencimiento2,2).toString().replace(',','').replace('.',''),
                            GetDayDifference(cuota.fechaVencimiento1, cuota.fechaVencimiento2).toString(),
                            item.codigoDelegacion,
                            item.numeroRecibo.toString()
                        );
    
                        return {
                            idEmisionEjecucionCuota: item.idEmisionEjecucionCuota,
                            codigoBarras: numeroCodigoBarras
                        };
                    });
                }

                Promise.all(requestUpdates)
                .then(async responsesUpdates => {
                    const result = await this.emisionEjecucionCuotaService.modifyByEmisionEjecucion(responsesUpdates);
                    if (!result) {
                        reject(new ReferenceError('No se pudo completar el proceso de códigos de barras'));
                        return;
                    }
                    resolve(result);
                })
                .catch((error) => {
                    reject(error);
                });
            }
            catch(error) {
                reject(new ProcessError('Error generando ordenamiento', error));
            }
        });
    }

}