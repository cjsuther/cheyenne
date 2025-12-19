import { TIPO_TRIBUTO } from '../../../../infraestructure/sdk/consts/tipoTributo';
import ProcessError from '../../../../infraestructure/sdk/error/process-error';
import ValidationError from '../../../../infraestructure/sdk/error/validation-error';
import PdfReport from '../../../../infraestructure/sdk/pdf-report';
import { getDateNow, getDateToString, getFormatNumber, precisionRound } from '../../../../infraestructure/sdk/utils/convert';
import ImputacionDTO from '../../../dto/imputacion-dto';
import RecaudacionContableRow from '../../../dto/recaudacion-contable.row';
import ReciboAperturaAgrupado from '../../../dto/recibo-apertura-agrupado';
import SubTasaRequest from '../../../dto/sub-tasa-request';
import Configuracion from '../../../entities/configuracion';
import CuentaContable from '../../../entities/cuenta-contable';
import Jurisdiccion from '../../../entities/jurisdiccion';
import Recaudacion from '../../../entities/recaudacion';
import RecaudacionLote from '../../../entities/recaudacion-lote';
import Recaudadora from '../../../entities/recaudadora';
import ReciboPublicacion from '../../../entities/recibo-publicacion';
import RecursoPorRubro from '../../../entities/recurso-por-rubro';
import SubTasaImputacion from '../../../entities/sub-tasa-imputacion';
import ConfiguracionService from '../../configuracion-service';
import RecaudacionLoteService from '../../recaudacion-lote-service';
import RecaudacionService from '../../recaudacion-service';
import RecaudadoraService from '../../recaudadora-service';
import ReciboAperturaService from '../../recibo-apertura-service';
import ReciboPublicacionService from '../../recibo-publicacion-service';
import TasaService from '../../tasa-service';


export default class ReportInformeRecaudacionLote {

    configuracionService: ConfiguracionService;
    recaudacionLoteService: RecaudacionLoteService;
    recaudacionService: RecaudacionService;
    recaudadoraService: RecaudadoraService;
    reciboPublicacionService: ReciboPublicacionService;
    reciboAperturaService: ReciboAperturaService;
    tasaService: TasaService;

	constructor(configuracionService: ConfiguracionService,
                recaudacionLoteService: RecaudacionLoteService,
                recaudacionService: RecaudacionService,
                recaudadoraService: RecaudadoraService,
                reciboPublicacionService: ReciboPublicacionService,
                reciboAperturaService: ReciboAperturaService,
                tasaService: TasaService
    ) {
        this.configuracionService = configuracionService;
        this.recaudacionLoteService = recaudacionLoteService;
        this.recaudacionService = recaudacionService;
        this.recaudadoraService = recaudadoraService;
        this.reciboPublicacionService = reciboPublicacionService;
        this.reciboAperturaService = reciboAperturaService;
        this.tasaService = tasaService;
	}

    async generateReport(token: string, usuario:string, idRecaudacionLote: number) {
        return new Promise( async (resolve, reject) => {
            try {
                const today = getDateNow(true);
                const periodoActual = today.getFullYear().toString();
                const municipioCodigo:string = (await this.configuracionService.findByNombre("MunicipioCodigo") as Configuracion).valor;
                const configuracion = await this.configuracionService.findByNombre("MunicipioNombre") as Configuracion;

                const recaudacionLote = await this.recaudacionLoteService.findById(idRecaudacionLote) as RecaudacionLote;
                const recaudaciones = await this.recaudacionService.listByLote(idRecaudacionLote) as Recaudacion[];
                const recaudadora = await this.recaudadoraService.findById(recaudacionLote.idRecaudadora) as Recaudadora;

                let totalRecibosProcesdos = 0;
                let totalRecibosConciliados = 0;
                let totalRecibosNoConciliadosIdentificados = 0;
                let totalRecibosNoConciliadosNoIdentificados = 0;
                let totalRecibosIdentificados = 0;
                let totalTributo1 = 0;
                let totalTributo2 = 0;
                let totalTributo3 = 0;
                let totalTributo4 = 0;
                let totalTributo5 = 0;
                let totalTributo7 = 0;

                let registros: RecaudacionContableRow[] = [];
                for (let r=0; r<recaudaciones.length; r++) {
                    const recaudacion = recaudaciones[r];
                    let recibo: ReciboPublicacion = null;
                    if (recaudacion.idReciboPublicacion) recibo = await this.reciboPublicacionService.findById(recaudacion.idReciboPublicacion) as ReciboPublicacion;
                    if (recibo) {
                        const aperturas = await this.reciboAperturaService.listByReciboPublicacionAgrupado(token, recibo.id, false) as ReciboAperturaAgrupado[];
                        let vencimiento = (recaudacion.fechaCobro.getTime() <= recibo.fechaVencimiento1.getTime()) ? 1 :
                                            (recaudacion.fechaCobro.getTime() <= recibo.fechaVencimiento2.getTime()) ? 2 : 0;
                        if (vencimiento == 0) {
                            // vamos a considerar el segundo vencimiento como base
                            vencimiento = 2;
                        }
                        const importeVencimiento = (vencimiento === 1) ? recibo.importeVencimiento1 : recibo.importeVencimiento2;
                        const coeficientePago = (recaudacion.importeCobro !== importeVencimiento) ? precisionRound(recaudacion.importeCobro / importeVencimiento,2) : 1;

                        for (let a=0; a<aperturas.length; a++) {
                            const apertura = aperturas[a];
                            const imputacionDto = await this.tasaService.listSubTasaImputacion(token, [new SubTasaRequest(apertura.periodo, apertura.codigoTasa, apertura.codigoSubTasa)]) as ImputacionDTO;
                            if (imputacionDto.relaciones.length === 0 || imputacionDto.relaciones.length > 1) {
                                reject(new ValidationError(`La imputación contable de la tasa ${apertura.codigoTasa}/${apertura.codigoSubTasa} del ejercicio ${apertura.periodo} está mal definida`));
                                return;
                            }
                            const relacion = imputacionDto.relaciones[0];
                            const imputacion = relacion.imputacion as SubTasaImputacion;
                            const cuentaContable = imputacion.idCuentaContable??0 > 0 ? imputacionDto.definicionesCuentaContable.find(f => f.id === imputacion.idCuentaContable) as CuentaContable : null;
                            const jurisdiccion = imputacion.idJurisdiccionActual??0 > 0 ? imputacionDto.definicionesJurisdiccion.find(f => f.id === imputacion.idJurisdiccionActual) as Jurisdiccion : null;
                            const recursoPorRubro = imputacion.idRecursoPorRubroActual??0 > 0 ? imputacionDto.definicionesRecursoPorRubro.find(f => f.id === imputacion.idRecursoPorRubroActual) as RecursoPorRubro : null;
                            const importeApertura = (vencimiento === 1) ? apertura.importe1 : apertura.importe2;
                            const importeCobro = (coeficientePago === 1) ? importeApertura : importeApertura*coeficientePago;

                            const registro = new RecaudacionContableRow();
                            registro.periodo = apertura.periodo;
                            registro.ejercicio = (apertura.periodo === periodoActual) ? "C" : "A";
                            registro.codigoTasa = apertura.codigoTasa;
                            registro.codigoSubTasa = apertura.codigoSubTasa;
                            registro.importe = precisionRound(importeCobro);
                            registro.agrupamientoJurisdiccion = jurisdiccion ? jurisdiccion.agrupamiento : "";
                            registro.descripcionJurisdiccion = jurisdiccion ? jurisdiccion.nombre : "";
                            registro.agrupamientoCuenta = cuentaContable ? cuentaContable.agrupamiento : recursoPorRubro ? recursoPorRubro.agrupamiento : "";
                            registro.descripcionCuenta = cuentaContable ? cuentaContable.nombre : recursoPorRubro ? recursoPorRubro.nombre : "";

                            registros.push(registro);
                        }

                        switch (recibo.codigoTipoTributo) {
                            case TIPO_TRIBUTO.INMUEBLES: {
                                totalTributo1 += recaudacion.importeCobro;
                                break;
                            }
                            case TIPO_TRIBUTO.COMERCIOS: {
                                totalTributo2 += recaudacion.importeCobro;
                                break;
                            }
                            case TIPO_TRIBUTO.CEMENTERIOS: {
                                totalTributo3 += recaudacion.importeCobro;
                                break;
                            }
                            case TIPO_TRIBUTO.FONDEADEROS: {
                                totalTributo4 += recaudacion.importeCobro;
                                break;
                            }
                            case TIPO_TRIBUTO.VEHICULOS: {
                                totalTributo5 += recaudacion.importeCobro;
                                break;
                            }
                            case TIPO_TRIBUTO.CUENTAS_ESPECIALES: {
                                totalTributo7 += recaudacion.importeCobro;
                                break;
                            }
                        }

                        if (recaudacion.fechaConciliacion) {
                            totalRecibosConciliados += recaudacion.importeCobro;
                        }
                        else {
                            totalRecibosNoConciliadosIdentificados += recaudacion.importeCobro;
                        }
                    }
                    else {
                        totalRecibosNoConciliadosNoIdentificados += recaudacion.importeCobro;
                    }
                    totalRecibosProcesdos += recaudacion.importeCobro;
                }

                const sortApertura = (a:RecaudacionContableRow,b:RecaudacionContableRow) => 
                    (a.periodo !== b.periodo) ? a.periodo.localeCompare(b.periodo) :
                        (a.agrupamientoJurisdiccion !== b.agrupamientoJurisdiccion) ? a.agrupamientoJurisdiccion.localeCompare(b.agrupamientoJurisdiccion) :
                            a.agrupamientoCuenta.localeCompare(b.agrupamientoCuenta);
                registros.sort(sortApertura);

                let importeAgrupado = 0;
                const registrosAgrupados: RecaudacionContableRow[] = [];
                for (let i=0; i<registros.length; i++) {
                    const registro = registros[i];
                    importeAgrupado += registro.importe;
					if (i === (registros.length - 1) || //ultimo
						registros[i].periodo !== registros[i+1].periodo ||
						registros[i].agrupamientoJurisdiccion !== registros[i+1].agrupamientoJurisdiccion ||
						registros[i].agrupamientoCuenta !== registros[i+1].agrupamientoCuenta)
					{
                        const registroAgrupado = new RecaudacionContableRow();
                        registroAgrupado.periodo = registro.periodo;
                        registroAgrupado.ejercicio = registro.ejercicio;
                        registroAgrupado.agrupamientoJurisdiccion = registro.agrupamientoJurisdiccion;
                        registroAgrupado.descripcionJurisdiccion = registro.descripcionJurisdiccion;
                        registroAgrupado.agrupamientoCuenta = registro.agrupamientoCuenta;
                        registroAgrupado.descripcionCuenta = registro.descripcionCuenta;
                        registroAgrupado.importe = precisionRound(importeAgrupado);
                        registrosAgrupados.push(registroAgrupado);
                        importeAgrupado = 0;
                    }
                }

                totalRecibosProcesdos = precisionRound(totalRecibosProcesdos);
                totalRecibosConciliados = precisionRound(totalRecibosConciliados);
                totalRecibosNoConciliadosIdentificados = precisionRound(totalRecibosNoConciliadosIdentificados);
                totalRecibosNoConciliadosNoIdentificados = precisionRound(totalRecibosNoConciliadosNoIdentificados);
                totalRecibosIdentificados = precisionRound(totalRecibosConciliados+totalRecibosNoConciliadosIdentificados);
                totalTributo1 = precisionRound(totalTributo1);
                totalTributo2 = precisionRound(totalTributo2);
                totalTributo3 = precisionRound(totalTributo3);
                totalTributo4 = precisionRound(totalTributo4);
                totalTributo5 = precisionRound(totalTributo5);
                totalTributo7 = precisionRound(totalTributo7);

                const data = {
                    fechaInforme: getDateToString(today,true),
                    municipioNombre: configuracion.valor,
                    recaudadora: recaudadora.nombre,
                    numeroLote: recaudacionLote.numeroLote,
                    fechaLote: getDateToString(recaudacionLote.fechaLote,false),
                    totalTributo1: getFormatNumber(totalTributo1,2),
                    totalTributo2: getFormatNumber(totalTributo2,2),
                    totalTributo3: getFormatNumber(totalTributo3,2),
                    totalTributo4: getFormatNumber(totalTributo4,2),
                    totalTributo5: getFormatNumber(totalTributo5,2),
                    totalTributo7: getFormatNumber(totalTributo7,2),
                    totalRecibosProcesdos: getFormatNumber(totalRecibosProcesdos,2),
                    totalRecibosConciliados: getFormatNumber(totalRecibosConciliados,2),
                    totalRecibosNoConciliadosIdentificados: getFormatNumber(totalRecibosNoConciliadosIdentificados,2),
                    totalRecibosNoConciliadosNoIdentificados: getFormatNumber(totalRecibosNoConciliadosNoIdentificados,2),
                    totalRecibosIdentificados: getFormatNumber(totalRecibosIdentificados,2),
                    rows: registrosAgrupados.map(x => {
                        return {...x,
                            importe: getFormatNumber(x.importe,2)
                        };
                    })
                };

                const optionsReport = {
                    title: 'Informe de Recaudación',
                    margin: {
                      top: 100,
                      bottom: 30,
                      left: 30,
                      right: 30
                    },
                    pathBodyTemplate: 'src/domain/services/reports/report-informe-recaudacion-lote/index.ejs',
                    // pathHeaderTemplate: 'src/domain/services/reports/report-cuenta-informe-deuda/header.ejs',
                    pathHeaderTemplate: `src/domain/services/reports/report-common/header_municipio${municipioCodigo}.ejs`,
                    // pathFooterTemplate: '',
                    pathStyles: ['src/domain/services/reports/report-common/index.css'],
                    pathImages: [],
                    data: data
                };
              
                const pdfReport = new PdfReport("InformeRecaudacionLote.pdf", "src/infraestructure/sdk/pdf-report", optionsReport);
                const buffer = await pdfReport.generate() as Buffer;

                resolve(buffer);
            }
            catch(error) {
                reject(new ProcessError('Error generando reporte', error));
            }
        });
    }


}