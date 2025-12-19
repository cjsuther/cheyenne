import PdfReport from '../../../../infraestructure/sdk/pdf-report';
import TipoMovimientoService from '../../tipo-movimiento-service';
import CuentaService from "../../cuenta-service";
import VariableService from '../../variable-service';
import VariableCuentaService from '../../variable-cuenta-service';
import EdesurService from '../../edesur-service';
import ConfiguracionService from '../../configuracion-service';
import ListaService from '../../lista-service';
import LocalidadService from '../../localidad-service';
import ProcessError from '../../../../infraestructure/sdk/error/process-error';

import TasaService from '../../tasa-service';
import SubTasaService from '../../sub-tasa-service';
import CuentaPagoService from '../../cuenta-pago-service';
import CuentaPagoItemService from '../../cuenta-pago-item-service';
import ICuentaCorrienteItemRepository from '../../../repositories/cuenta-corriente-item-repository';

import { GetGraphicCodigoBarras } from '../../../../infraestructure/sdk/utils/helper';
import { getDateNow, getDateToString, getFormatNumber, iif } from '../../../../infraestructure/sdk/utils/convert';
import CuentaRecibo from '../../../dto/cuenta-recibo';
import Direccion from '../../../entities/direccion';
import Localidad from '../../../entities/localidad';
import Tasa from '../../../entities/tasa';
import SubTasa from '../../../entities/sub-tasa';
import CuentaPago from '../../../entities/cuenta-pago';
import CuentaPagoItem from '../../../entities/cuenta-pago-item';
import CuentaCorrienteItem from '../../../entities/cuenta-corriente-item';
import CuentaCorrienteItemRecibo from '../../../dto/cuenta-corriente-item-recibo';
import TipoMovimiento from '../../../entities/tipo-movimiento';
import Valuacion from '../../../entities/valuacion';
import Lista from '../../../entities/lista';


export default class ReportCuentaCorrienteRecibo {

    listaService: ListaService;
    localidadService: LocalidadService;
	configuracionService: ConfiguracionService;
    tipoMovimientoService: TipoMovimientoService;
    cuentaService: CuentaService;
    variableService: VariableService;
    variableCuentaService: VariableCuentaService;
    edesurService: EdesurService;
    tasaService: TasaService;
    subTasaService: SubTasaService;
	cuentaPagoService: CuentaPagoService;
	cuentaPagoItemService: CuentaPagoItemService;
	cuentaCorrienteItemRepository: ICuentaCorrienteItemRepository;

	constructor(listaService: ListaService, localidadService: LocalidadService, configuracionService: ConfiguracionService,
                tipoMovimientoService: TipoMovimientoService, cuentaService: CuentaService,
                variableService: VariableService, variableCuentaService: VariableCuentaService, edesurService: EdesurService,
                tasaService: TasaService, subTasaService: SubTasaService,
                cuentaPagoService: CuentaPagoService, cuentaPagoItemService: CuentaPagoItemService,
                cuentaCorrienteItemRepository: ICuentaCorrienteItemRepository) {
        this.listaService = listaService;
        this.localidadService = localidadService;
        this.configuracionService = configuracionService;
        this.tipoMovimientoService = tipoMovimientoService;
		this.cuentaService = cuentaService;
        this.variableService = variableService;
        this.variableCuentaService = variableCuentaService;
        this.edesurService = edesurService;
        this.tasaService = tasaService;
        this.subTasaService = subTasaService;
        this.cuentaPagoService = cuentaPagoService;
		this.cuentaPagoItemService = cuentaPagoItemService;
        this.cuentaCorrienteItemRepository = cuentaCorrienteItemRepository
	}

    async generateReport(usuario:string, idCuentaPago:number, titulo: string, reciboResumido:boolean = false) {
        return new Promise( async (resolve, reject) => {
            try {
                const localidades = await this.localidadService.list() as Array<Localidad>;
                const tasas = await this.tasaService.list() as Array<Tasa>;
                const subTasas = await this.subTasaService.list() as Array<SubTasa>;
                const listas = await this.listaService.list() as Array<Lista>;

                const cuentaPago = await this.cuentaPagoService.findById(idCuentaPago) as CuentaPago;
                const cuentaPagoItems = await this.cuentaPagoItemService.listByCuentaPago(idCuentaPago) as Array<CuentaPagoItem>;

                const cuentaRecibo = await this.cuentaService.findReciboById(cuentaPago.idCuenta) as CuentaRecibo;
                const cuenta = cuentaRecibo.cuenta;
                const direccion = (cuentaRecibo.direccionPrincipal) ? cuentaRecibo.direccionPrincipal : new Direccion();
                const localidad = (cuentaRecibo.direccionPrincipal) ? localidades.find(f => f.id === cuentaRecibo.direccionPrincipal.idLocalidad).nombre : "";
                const codigoTipoTributo = listas.find(f => f.id === cuenta.idTipoTributo).codigo;

                let valuacion = new Valuacion();
                if (cuenta.idTipoTributo === 10) { //Inmueble
                    const valuacionesXPeriodo = cuentaRecibo.valuaciones.filter(x => x.ejercicio === cuentaPago.periodo);
                    if (valuacionesXPeriodo.length > 0) valuacion = valuacionesXPeriodo.sort((a, b) => b.mes - a.mes)[0]; //obtiene el maximo mes
                }

                const getCodTasa = (id) => {
                    const row = tasas.find(f => f.id === id);
                    return (row) ? row.codigo : '';
                }
                const getDescTasa = (id) => {
                    const row = tasas.find(f => f.id === id);
                    return (row) ? row.descripcion : '';
                }
                const getCodSubTasa = (id) => {
                    const row = subTasas.find(f => f.id === id);
                    return (row) ? row.codigo : '';
                }
                const getDescSubTasa = (id) => {
                    const row = subTasas.find(f => f.id === id);
                    return (row) ? row.descripcion : '';
                }

                //data por cuota
                let recibo = {
                    importeTotal: cuentaPago.importeVencimiento1,
                    importeAccesorios: 0,
                    importeOtrosCreditos: 0,
                    importeDescuentos: 0,
                    importeEdesur: 0,
                    fechaVencimiento: cuentaPago.fechaVencimiento1,
                    codigoDelegacion: cuentaPago.codigoDelegacion,
                    numeroRecibo: cuentaPago.numeroRecibo,
                    codigoBarras: cuentaPago.codigoBarras
                }

                const sortCuentaPagoItems = (a,b) => 
                    (a.idTasa === b.idTasa) ?
                        (a.idSubTasa === b.idSubTasa) ?
                            (a.periodo === b.periodo) ?
                                (a.cuota === b.cuota) ?
                                    (a.item - b.item) :
                                (a.cuota - b.cuota) :
                            (a.periodo - b.periodo) :
                        (a.idSubTasa - b.idSubTasa) :
                    (a.idTasa - b.idTasa);

                let importeMovimientosHaber = 0;
                let importeMovimientosEdesur = 0;
                for (let i=0; i < cuentaPagoItems.length; i++) {
                    const cuentaPagoItem = cuentaPagoItems[i];
                    const filter = new CuentaCorrienteItemRecibo(
                        cuentaPagoItem.idCuenta,
                        cuentaPagoItem.idTasa,
                        cuentaPagoItem.idSubTasa,
                        "",
                        0,
                        cuentaPagoItem.numeroPartida,
                        cuentaPagoItem.periodo,
                        cuentaPagoItem.cuota
                    );
                    const itemsHaber = await this.cuentaCorrienteItemRepository.listByRecibo(filter) as Array<CuentaCorrienteItem>;
                    for (let i=0; i < itemsHaber.length; i++) {
                        const itemHaber = itemsHaber[i];
				        const tipoMovimientoHaber = await this.tipoMovimientoService.findById(itemHaber.idTipoMovimiento) as TipoMovimiento;
                        if (tipoMovimientoHaber.codigo === '99') { //Edesur
                            importeMovimientosEdesur += itemHaber.importeHaber;
                        }
                        else if (tipoMovimientoHaber.tipo !== 'F') { //Cancelaciones
                            importeMovimientosHaber += itemHaber.importeHaber;
                        }
                    }
                }
                recibo.importeEdesur = getFormatNumber(importeMovimientosEdesur, 2);
                recibo.importeOtrosCreditos = getFormatNumber((importeMovimientosHaber), 2);

                let idSubTasa = 0;
                let itemSubTasas = [];
                cuentaPagoItems.sort(sortCuentaPagoItems);
                cuentaPagoItems.forEach((cuentaPagoItem, index) => {
                    if (cuentaPagoItem.idSubTasa !== idSubTasa) {
                        itemSubTasas.push({
                            idTasa: cuentaPagoItem.idTasa,
                            codTasa: getCodTasa(cuentaPagoItem.idTasa),
                            descTasa: getDescTasa(cuentaPagoItem.idTasa),
                            idSubTasa: cuentaPagoItem.idSubTasa,
                            codSubTasa: getCodSubTasa(cuentaPagoItem.idSubTasa),
                            descSubTasa: getDescSubTasa(cuentaPagoItem.idSubTasa) 
                        });
                        idSubTasa = cuentaPagoItem.idSubTasa;
                    }
                });

                itemSubTasas.forEach(subTasa => {
                    const itemCuotas = cuentaPagoItems.filter(f => f.idSubTasa === subTasa.idSubTasa).map((cuentaPagoItem, index) => {
                        const importeOriginal = cuentaPagoItem.importeNominal;
                        const importeAccesorios = cuentaPagoItem.importeAccesorios;
                        const importeTotal = cuentaPagoItem.importeTotal;
                        const importeDescuento = cuentaPagoItem.importeDescuento;
                        const item = {
                            idTasa: cuentaPagoItem.idTasa,
                            idSubTasa: cuentaPagoItem.idSubTasa,
                            periodo: cuentaPagoItem.periodo,
                            cuota: (reciboResumido) ? cuentaPagoItem.cuota.toString() : cuentaPagoItem.cuota.toString().padStart(4,"0"),
                            importeOriginal: getFormatNumber(importeOriginal,2),
                            importeAccesorios: getFormatNumber(importeAccesorios,2),
                            importeTotal: getFormatNumber(importeTotal,2)
                        };
                        recibo.importeAccesorios += importeAccesorios;
                        recibo.importeDescuentos += importeDescuento;
                        return item;
                    });
                    subTasa.cuotas = itemCuotas;
                });

                const base64 = await GetGraphicCodigoBarras(recibo.codigoBarras);
                const pathCodigoBarras = `data:image/png;base64,${base64}`;

                //data del reporte
                const data = {
                    titulo: titulo,
                    fechaSolicitud: getDateToString(getDateNow(false), false),
                    usuario: usuario,
                    titular: cuentaRecibo.contribuyentePrincipal.nombrePersona.toUpperCase(),
                    cuenta: `${codigoTipoTributo} / ${cuenta.numeroCuenta}`,
                    valuacionFiscal: getFormatNumber(valuacion.valor,2),
                    //numeroRecibo: `${recibo.codigoDelegacion}-${recibo.numeroRecibo.toString().padStart(10,"0")}(${recibo.codigoBarras[recibo.codigoBarras.length-1]})`,
                    numeroRecibo: `${recibo.codigoDelegacion}-${recibo.numeroRecibo.toString().padStart(10,"0")}`,
                    domicilio: `${direccion.calle} ${direccion.altura} Piso. ${iif(direccion.piso,"","/")} Dpto. ${iif(direccion.dpto,"","/")}`.toUpperCase(),
                    localidad: `${localidad} C.P. ${direccion.codigoPostal}`.toUpperCase(),
                    subTasas: itemSubTasas,
                    pathCodigoBarras: pathCodigoBarras,
                    importeTotal: getFormatNumber(recibo.importeTotal,2),
                    importeAccesorios: getFormatNumber(recibo.importeAccesorios,2),
                    importeDescuentos: getFormatNumber(recibo.importeDescuentos,2),
                    fechaVencimiento: getDateToString(recibo.fechaVencimiento, false),
                    importeEdesur: recibo.importeEdesur,
                    importeOtrosCreditos: recibo.importeOtrosCreditos
                };

                const reportName = (reciboResumido) ? "index-resumido" : "index";
                const optionsReport = {
                    title: 'Recibo',
                    margin: {
                        top: 100,
                        bottom: 10,
                        left: 28,
                        right: 28
                    },
                    pathBodyTemplate: `src/domain/services/reports/report-cuenta-corriente-recibo/${reportName}.ejs`,
                    pathHeaderTemplate: 'src/domain/services/reports/report-cuenta-corriente-recibo/header.ejs',
                    // pathFooterTemplate: '',
                    pathStyles: ['src/domain/services/reports/report-common/index.css', 'src/domain/services/reports/report-cuenta-corriente-recibo/index.css'],
                    data: data
                };
                
                const pdfReport = new PdfReport("CuentaCorrienteRecibo.pdf", "src/infraestructure/sdk/pdf-report", optionsReport);
                const buffer = await pdfReport.generate() as Buffer;

                resolve(buffer);
            }
            catch(error) {
                reject(new ProcessError('Error generando reporte', error));
            }
        });
    }

}