import path from 'path';
import PdfReport from '../../../../infraestructure/sdk/pdf-report';
import CuentaService from "../../cuenta-service";
import VariableService from '../../variable-service';
import VariableCuentaService from '../../variable-cuenta-service';
import EdesurService from '../../edesur-service';
import ConfiguracionService from '../../configuracion-service';
import Configuracion from '../../../entities/configuracion';
import ListaService from '../../lista-service';
import LocalidadService from '../../localidad-service';
import ProcessError from '../../../../infraestructure/sdk/error/process-error';

import TasaService from '../../tasa-service';
import SubTasaService from '../../sub-tasa-service';
import IEmisionDefinicionRepository from '../../../repositories/emision-definicion-repository';
import IEmisionEjecucionRepository from '../../../repositories/emision-ejecucion-repository';
import EmisionCuotaService from  '../../emision-cuota-service';
import EmisionEjecucionCuentaService from '../../emision-ejecucion-cuenta-service';
import EmisionEjecucionCuotaService from '../../emision-ejecucion-cuota-service';
import EmisionConceptoService from '../../emision-concepto-service';
import EmisionConceptoResultadoService from '../../emision-concepto-resultado-service';
import DebitoAutomaticoService from '../../debito-automatico-service';

import EmisionEjecucionDTO from '../../../dto/emision-ejecucion-dto';
import EmisionEjecucion from '../../../entities/emision-ejecucion';
import EmisionConcepto from '../../../entities/emision-concepto';
import EmisionConceptoResultado from '../../../entities/emision-concepto-resultado';
import { CloneObject, GetDayDifference, GetDayOfYear, GetFieldMes, GetGraphicCodigoBarras, GetNumeroCodigoBarras } from '../../../../infraestructure/sdk/utils/helper';
import { getCatastral, getDateNow, getDateToString, getDireccion, getFormatNumber, geValortVariable, iif } from '../../../../infraestructure/sdk/utils/convert';
import EmisionCuota from '../../../entities/emision-cuota';
import CuentaData from '../../../dto/cuenta-data';
import Cuenta from '../../../entities/cuenta';
import VariableCuenta from '../../../entities/variable-cuenta';
import Variable from '../../../entities/variable';
import Edesur from '../../../entities/edesur';
import { isNull } from '../../../../infraestructure/sdk/utils/validator';
import CuentaRecibo from '../../../dto/cuenta-recibo';
import Lista from '../../../entities/lista';
import Direccion from '../../../entities/direccion';
import ValidationError from '../../../../infraestructure/sdk/error/validation-error';
import Localidad from '../../../entities/localidad';
import Tasa from '../../../entities/tasa';
import SubTasa from '../../../entities/sub-tasa';
import EmisionEjecucionCuenta from '../../../entities/emision-ejecucion-cuenta';
import EmisionEjecucionCuota from '../../../entities/emision-ejecucion-cuota';
import EmisionEjecucionCuentaDTO from '../../../dto/emision-ejecucion-cuenta-dto';
import config from '../../../../server/configuration/config';
import DebitoAutomatico from '../../../entities/debito-automatico';
import EmisionDefinicion from '../../../entities/emision-definicion';


export default class ReportEmisionRecibos {

    listaService: ListaService;
    localidadService: LocalidadService;
	configuracionService: ConfiguracionService;
    cuentaService: CuentaService;
    variableService: VariableService;
    variableCuentaService: VariableCuentaService;
    edesurService: EdesurService;
    tasaService: TasaService;
    subTasaService: SubTasaService;
    emisionDefinicionRepository: IEmisionDefinicionRepository;
    emisionEjecucionRepository: IEmisionEjecucionRepository;
    emisionCuotaService: EmisionCuotaService;
    emisionEjecucionCuentaService: EmisionEjecucionCuentaService;
    emisionEjecucionCuotaService: EmisionEjecucionCuotaService;
    emisionConceptoService: EmisionConceptoService;
    emisionConceptoResultadoService: EmisionConceptoResultadoService;
    debitoAutomaticoService: DebitoAutomaticoService;

	constructor(listaService: ListaService, localidadService: LocalidadService, configuracionService: ConfiguracionService,
                cuentaService: CuentaService, variableService: VariableService, variableCuentaService: VariableCuentaService, edesurService: EdesurService,
                tasaService: TasaService, subTasaService: SubTasaService,
                emisionDefinicionRepository: IEmisionDefinicionRepository, emisionEjecucionRepository: IEmisionEjecucionRepository, emisionCuotaService: EmisionCuotaService,
                emisionEjecucionCuentaService: EmisionEjecucionCuentaService, emisionEjecucionCuotaService: EmisionEjecucionCuotaService,
                emisionConceptoService: EmisionConceptoService, emisionConceptoResultadoService: EmisionConceptoResultadoService,
                debitoAutomaticoService: DebitoAutomaticoService) {
        this.listaService = listaService;
        this.localidadService = localidadService;
        this.configuracionService = configuracionService;
		this.cuentaService = cuentaService;
        this.variableService = variableService;
        this.variableCuentaService = variableCuentaService;
        this.edesurService = edesurService;
        this.tasaService = tasaService;
        this.subTasaService = subTasaService;
        this.emisionDefinicionRepository = emisionDefinicionRepository;
        this.emisionEjecucionRepository = emisionEjecucionRepository;
        this.emisionCuotaService = emisionCuotaService;
        this.emisionEjecucionCuentaService = emisionEjecucionCuentaService;
        this.emisionEjecucionCuotaService = emisionEjecucionCuotaService;
        this.emisionConceptoService = emisionConceptoService;
        this.emisionConceptoResultadoService = emisionConceptoResultadoService;
        this.debitoAutomaticoService = debitoAutomaticoService;
	}

    async generateReport(idEmisionEjecucion:number, idCuenta:number) {
        return new Promise( async (resolve, reject) => {
            try {
                const today = getDateNow(false);
                const municipioPagoFacil:string = (await this.configuracionService.findByNombre("MunicipioPagoFacil") as Configuracion).valor;                
                const localidades = await this.localidadService.list() as Array<Localidad>;
                const tasas = await this.tasaService.list() as Array<Tasa>;
                const subTasas = await this.subTasaService.list() as Array<SubTasa>;

                const debitosAutomaticosActivos = (await this.debitoAutomaticoService.listByCuenta(idCuenta) as Array<DebitoAutomatico>)
                                                    .filter(f => f.fechaAlta.getTime() <= today.getTime() && (f.fechaBaja === null || f.fechaBaja.getTime() >= today.getTime()));

                const cuentaRecibo = await this.cuentaService.findReciboById(idCuenta) as CuentaRecibo;
                const cuenta = cuentaRecibo.cuenta;
                const variablesCuenta = cuentaRecibo.variablesCuenta;
                const direccion = (cuentaRecibo.direccionPrincipal) ? cuentaRecibo.direccionPrincipal : new Direccion();
                const localidad = (cuentaRecibo.direccionPrincipal) ? localidades.find(f => f.id === cuentaRecibo.direccionPrincipal.idLocalidad).nombre : "";
                
                const ejecucion = await this.emisionEjecucionRepository.findById(idEmisionEjecucion) as EmisionEjecucion;
                const definicion = await this.emisionDefinicionRepository.findById(ejecucion.idEmisionDefinicion) as EmisionDefinicion;
                const ejecucionCuentaDTO = await this.emisionEjecucionCuentaService.findByCuenta(idEmisionEjecucion, idCuenta) as EmisionEjecucionCuentaDTO;
                const ejecucionCuenta = ejecucionCuentaDTO.emisionEjecucionCuenta as EmisionEjecucionCuenta;

                const variables = await this.variableService.listByTipoTributo(cuenta.idTipoTributo) as Array<Variable>;
                const cuotas = await this.emisionCuotaService.listByEmisionEjecucion(idEmisionEjecucion) as Array<EmisionCuota>;
                const defConceptos = await this.emisionConceptoService.listByEmisionDefinicion(definicion.id) as Array<EmisionConcepto>;
                const conceptos = await this.emisionConceptoResultadoService.listByEmisionEjecucionCuenta(ejecucionCuenta.id) as Array<EmisionConceptoResultado>;
                const ejecucionCuotas = await this.emisionEjecucionCuotaService.listByEmisionEjecucionCuenta(ejecucionCuenta.id) as Array<EmisionEjecucionCuota>;

                const fechaPeriodo = new Date(parseInt(ejecucion.periodo), cuotas[0].mes - 1, 1);

                let edesur = new Edesur();
                if (cuenta.idTipoTributo === 10) { //Inmueble
                    const listaEdesur = await this.edesurService.listByInmueble(cuenta.idTributo) as Array<Edesur>;
                    if (listaEdesur.length > 0) edesur = listaEdesur[listaEdesur.length -1]; //verificar si validar el periodo y cuota, por ahora tomo el último
                }

                const valuacionesXPeriodo = cuentaRecibo.valuaciones.filter(x => x.ejercicio === ejecucion.periodo);
                if (valuacionesXPeriodo.length === 0) {
                    reject(new ValidationError('Valor de Valuación indefinido'));
                    return;
                }
                const valuacion = valuacionesXPeriodo.sort((a, b) => b.mes - a.mes)[0]; //obtiene el maximo mes

                //GRUPO
                const v_GRUPO = geValortVariable('GRUPO', fechaPeriodo, variables, variablesCuenta);
                if (!v_GRUPO) {
                    reject(new ValidationError('Valor de Variable GRUPO indefinido'));
                    return;
                }
                //ZONA_TARIFARIA
                const v_ZONA_TARIFARIA = geValortVariable('ZONA_TARIFARIA', fechaPeriodo, variables, variablesCuenta);
                if (!v_ZONA_TARIFARIA) {
                    reject(new ValidationError('Valor de Variable ZONA_TARIFARIA indefinido'));
                    return;
                }

                //ids de Tasas y SubTasas
                let idEmisionConceptoTSG = 0;
                let idEmisionConceptoBomberos = 0;
                let idEmisionConceptoRecargo = 0;

                try {
                    const codigoTSG = ["1000", "0"];
                    const idTasaTSG = tasas.find(f => f.codigo === codigoTSG[0]).id;
                    const idSubTasaTSG = subTasas.find(f => f.idTasa === idTasaTSG && f.codigo === codigoTSG[1]).id;
                    idEmisionConceptoTSG = defConceptos.find(f => f.idTasa === idTasaTSG && f.idSubTasa === idSubTasaTSG).id;

                    const codigoBomberos = ["1002", "0"];
                    const idTasaBomberos = tasas.find(f => f.codigo === codigoBomberos[0]).id;
                    const idSubTasaBomberos = subTasas.find(f => f.idTasa === idTasaBomberos && f.codigo === codigoBomberos[1]).id;
                    idEmisionConceptoBomberos = defConceptos.find(f => f.idTasa === idTasaBomberos && f.idSubTasa === idSubTasaBomberos).id;

                    const codigoRecargo = ["99999", "0"];
                    const idTasaRecargo = tasas.find(f => f.codigo === codigoRecargo[0]).id;
                    const idSubTasaRecargo = subTasas.find(f => f.idTasa === idTasaRecargo && f.codigo === codigoRecargo[1]).id;
                    idEmisionConceptoRecargo = defConceptos.find(f => f.idTasa === idTasaRecargo && f.idSubTasa === idSubTasaRecargo).id; 
                }
                catch {
                    reject(new ValidationError('No están definidas todas las tasas en los conceptos'));
                    return;
                }

                //data por cuota
                const requestCuotas = ejecucionCuotas.map(async ejecucionCuota => {
                    const cuota = cuotas.find(f => f.id === ejecucionCuota.idEmisionCuota);
                    const conceptosXcuota = conceptos.filter(f => f.idEmisionCuota === ejecucionCuota.idEmisionCuota);
                    const aviso = `${definicion.codigoDelegacion}-${ejecucionCuota.numeroRecibo}`;

                    const valorTSG = conceptosXcuota.find(f => f.idEmisionConcepto === idEmisionConceptoTSG).valorImporteTotal;
                    const valorBomberos = conceptosXcuota.find(f => f.idEmisionConcepto === idEmisionConceptoBomberos).valorImporteTotal;
                    const valorRecargo = conceptosXcuota.find(f => f.idEmisionConcepto === idEmisionConceptoRecargo).valorImporteTotal;

                    const montoTasa = parseFloat(valorTSG) - parseFloat(valorBomberos);
                    const montoBomberos = parseFloat(valorBomberos);
                    const montoVencimiento1 = parseFloat(valorTSG);
                    const montoVencimiento2 = parseFloat(valorTSG) + parseFloat(valorRecargo);

                    const numeroCodigoBarras = GetNumeroCodigoBarras(
                        municipioPagoFacil,
                        getFormatNumber(montoVencimiento1,2).toString().replace(',','').replace('.',''),
                        cuota.fechaVencimiento1.getFullYear().toString().substring(2),
                        GetDayOfYear(cuota.fechaVencimiento1).toString(),
                        getFormatNumber(montoVencimiento2,2).toString().replace(',','').replace('.',''),
                        GetDayDifference(cuota.fechaVencimiento1, cuota.fechaVencimiento2).toString(),
                        definicion.codigoDelegacion,
                        ejecucionCuota.numeroRecibo.toString()
                    );
                    const base64 = await GetGraphicCodigoBarras(numeroCodigoBarras);
                    const pathCodigoBarras = `data:image/png;base64,${base64}`;

                    const rowCuota = {
                        cuota: `${GetFieldMes(cuota.mes, 'name').toUpperCase()} ${ejecucion.periodo}`,
                        aviso: aviso,
                        fechaVencimiento1: getDateToString(cuota.fechaVencimiento1),
                        montoVencimiento1: getFormatNumber(montoVencimiento1,2),
                        fechaVencimiento2: getDateToString(cuota.fechaVencimiento2),
                        montoVencimiento2: getFormatNumber(montoVencimiento2,2),
                        montoTasa: getFormatNumber(montoTasa,2),
                        montoBomberos: getFormatNumber(montoBomberos,2),
                        montoEdesur: getFormatNumber(edesur.ultImporteEdesur,0),
                        numeroCodigoBarras: numeroCodigoBarras,
                        pathCodigoBarras: pathCodigoBarras
                    };

                    return rowCuota;
                });

                Promise.all(requestCuotas)
                .then(async responsesCuotas => {
                    //data del reporte
                    const data = {
                        fechaSolicitud: getDateToString(getDateNow(false), false),
                        tasa: definicion.descripcion,
                        titular: cuentaRecibo.contribuyentePrincipal.nombrePersona.toUpperCase(),
                        padron: `1-${cuenta.numeroCuenta}/000`,
                        grupo: v_GRUPO,
                        numeroControlador: (cuentaRecibo.controlador) ? cuentaRecibo.controlador.numero : '',
                        valuacionFiscal: getFormatNumber(valuacion.valor,2),
                        zonaTarifaria: v_ZONA_TARIFARIA,
                        claveWeb: cuenta.numeroWeb,
                        clavePagoMisCuentas: `1${cuenta.numeroCuenta}000`,
                        claveLINK: `00000000001${cuenta.numeroCuenta}000`,
                        claveMASTERCARD: "",
                        debitoAutomatico: (debitosAutomaticosActivos.length > 0) ? "-ADHERIDO A DÉBTIO AUTOMÁTICO-" : "",
                        detalleTributo1: `${direccion.calle} ${direccion.altura} Piso. ${iif(direccion.piso,"","/")} Dpto. ${iif(direccion.dpto,"","/")}`.toUpperCase(),
                        detalleTributo2: `${localidad} C.P. ${direccion.codigoPostal}`.toUpperCase(),
                        detalleTributo3: cuentaRecibo.partida,
                        detalleDeuda: "<pendiente...>",
                        cuotas: responsesCuotas
                    };

                    const optionsReport = {
                        title: 'TSG',
                        margin: {
                            top: 110,
                            bottom: 10,
                            left: 28,
                            right: 7
                        },
                        pathBodyTemplate: 'src/domain/services/reports/report-emision-recibos/index.ejs',
                        pathHeaderTemplate: 'src/domain/services/reports/report-emision-recibos/header.ejs',
                        // pathFooterTemplate: '',
                        pathStyles: ['src/domain/services/reports/report-common/index.css', 'src/domain/services/reports/report-emision-recibos/index.css'],
                        data: data
                    };
                    
                    const pdfReport = new PdfReport("EmisionRecibos.pdf", "src/infraestructure/sdk/pdf-report", optionsReport);
                    const buffer = await pdfReport.generate() as Buffer;

                    resolve(buffer);
                })
                .catch((error) => {
                    reject(error);
                });
            }
            catch(error) {
                reject(new ProcessError('Error generando reporte', error));
            }
        });
    }

}