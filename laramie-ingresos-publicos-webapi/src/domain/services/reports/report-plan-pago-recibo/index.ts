import PdfReport from '../../../../infraestructure/sdk/pdf-report';
import CuentaService from "../../cuenta-service";
import ConfiguracionService from '../../configuracion-service';
import ListaService from '../../lista-service';
import LocalidadService from '../../localidad-service';

import TasaService from '../../tasa-service';
import SubTasaService from '../../sub-tasa-service';
import PlanPagoService from '../../plan-pago-service';
import CuentaPagoService from '../../cuenta-pago-service';
import CuentaPagoItemService from '../../cuenta-pago-item-service';
import VinculoInmuebleService from '../../vinculo-inmueble-service';
import VinculoComercioService from '../../vinculo-comercio-service';
import VinculoVehiculoService from '../../vinculo-vehiculo-service';
import VinculoCementerioService from '../../vinculo-cementerio-service';
import VinculoFondeaderoService from '../../vinculo-fondeadero-service';
import VinculoEspecialService from '../../vinculo-especial-service';

import Direccion from '../../../entities/direccion';
import Localidad from '../../../entities/localidad';
import CuentaPago from '../../../entities/cuenta-pago';
import CuentaPagoItem from '../../../entities/cuenta-pago-item';
import VinculoInmueble from '../../../entities/vinculo-inmueble';
import VinculoComercio from '../../../entities/vinculo-comercio';
import VinculoVehiculo from '../../../entities/vinculo-vehiculo';
import VinculoCementerio from '../../../entities/vinculo-cementerio';
import VinculoFondeadero from '../../../entities/vinculo-fondeadero';
import VinculoEspecial from '../../../entities/vinculo-especial';

import { getDateNow, getDateToString, getFormatNumber, iif } from '../../../../infraestructure/sdk/utils/convert';
import ProcessError from '../../../../infraestructure/sdk/error/process-error';
import CuentaRecibo from '../../../dto/cuenta-recibo';
import PlanPagoDTO from '../../../dto/plan-pago-dto';
import PlanPago from '../../../entities/plan-pago';
import { GetGraphicCodigoBarras } from '../../../../infraestructure/sdk/utils/helper';
import Lista from '../../../entities/lista';

export default class ReportPlanPagoRecibo {

    listaService: ListaService;
    localidadService: LocalidadService;
	configuracionService: ConfiguracionService;
    cuentaService: CuentaService;
    tasaService: TasaService;
    subTasaService: SubTasaService;
    planPagoService: PlanPagoService;
	cuentaPagoService: CuentaPagoService;
	cuentaPagoItemService: CuentaPagoItemService;
    vinculoInmuebleService: VinculoInmuebleService;
    vinculoComercioService: VinculoComercioService;
    vinculoVehiculoService: VinculoVehiculoService;
    vinculoCementerioService: VinculoCementerioService;
    vinculoFondeaderoService: VinculoFondeaderoService;
    vinculoEspecialService: VinculoEspecialService;

	constructor(listaService: ListaService, localidadService: LocalidadService, configuracionService: ConfiguracionService,
                cuentaService: CuentaService, tasaService: TasaService, subTasaService: SubTasaService,
                planPagoService: PlanPagoService, cuentaPagoService: CuentaPagoService, cuentaPagoItemService: CuentaPagoItemService,
                vinculoInmuebleService: VinculoInmuebleService, vinculoComercioService: VinculoComercioService, vinculoVehiculoService: VinculoVehiculoService,
                vinculoCementerioService: VinculoCementerioService, vinculoFondeaderoService: VinculoFondeaderoService, vinculoEspecialService: VinculoEspecialService)
    {
        this.listaService = listaService;
        this.localidadService = localidadService;
        this.configuracionService = configuracionService;
		this.cuentaService = cuentaService;
        this.tasaService = tasaService;
        this.subTasaService = subTasaService;
        this.planPagoService = planPagoService;
        this.cuentaPagoService = cuentaPagoService;
		this.cuentaPagoItemService = cuentaPagoItemService;
        this.vinculoInmuebleService = vinculoInmuebleService;
        this.vinculoComercioService = vinculoComercioService;
        this.vinculoVehiculoService = vinculoVehiculoService;
        this.vinculoCementerioService = vinculoCementerioService;
        this.vinculoFondeaderoService = vinculoFondeaderoService;
        this.vinculoEspecialService = vinculoEspecialService;
	}

    async generateReport(usuario:string, idPlanPago:number, planPagoCuota:number[]) {
        return new Promise( async (resolve, reject) => {
            try {
                const localidades = await this.localidadService.list() as Array<Localidad>;
                const listas = await this.listaService.list() as Array<Lista>;

                const planPagoDTO = await this.planPagoService.findById(idPlanPago) as PlanPagoDTO;
				const planPago = planPagoDTO.planPago as PlanPago;
                const vinculoCuenta = await this.getVinculoCuenta(planPago.idTipoTributo, planPago.idVinculoCuenta);
                const codigoTipoTributo = listas.find(f => f.id === planPago.idTipoTributo).codigo;

                const cuentaPagos = await this.cuentaPagoService.listByPlanPago(idPlanPago) as Array<CuentaPago>;

                const cuentaRecibo = await this.cuentaService.findReciboById(planPago.idCuenta) as CuentaRecibo;
                const cuenta = cuentaRecibo.cuenta;
                const direccion = (cuentaRecibo.direccionPrincipal) ? cuentaRecibo.direccionPrincipal : new Direccion();
                const localidad = (cuentaRecibo.direccionPrincipal) ? localidades.find(f => f.id === cuentaRecibo.direccionPrincipal.idLocalidad).nombre : "";

                let recibos = [];
                cuentaPagos.sort((a, b) => a.id - b.id);
                for (let i=0; i < cuentaPagos.length; i++) {
                    const cuentaPago = cuentaPagos[i];
                    const cuentaPagoItems = await this.cuentaPagoItemService.listByCuentaPago(cuentaPago.id) as Array<CuentaPagoItem>;
                    const cuentaPagoItem = cuentaPagoItems[0]; //es siempre un item por cabecera, ya que cada cuota tiene recibo diferente

                    if (planPagoCuota.includes(cuentaPagoItem.idPlanPagoCuota)) {
                        //data por cuota
                        let recibo = {
                            cuota: (cuentaPagoItem.cuota === 0) ? 'Anticipo' : cuentaPagoItem.cuota.toString().padStart(4,"0"),
                            importeTotal: getFormatNumber(cuentaPago.importeVencimiento1,2),
                            fechaVencimiento: getDateToString(cuentaPago.fechaVencimiento1, false),
                            numeroRecibo: '',
                            pathCodigoBarras: '',
                            codigoBarras: cuentaPago.codigoBarras
                        }

                        const base64 = await GetGraphicCodigoBarras(recibo.codigoBarras);

                        // recibo.numeroRecibo = `${cuentaPago.codigoDelegacion}-${cuentaPago.numeroRecibo.toString().padStart(10,"0")}-${recibo.codigoBarras[recibo.codigoBarras.length-1]}`;
                        recibo.numeroRecibo = `${cuentaPago.codigoDelegacion}-${cuentaPago.numeroRecibo.toString().padStart(10,"0")}`;
                        recibo.pathCodigoBarras = `data:image/png;base64,${base64}`;

                        recibos.push(recibo);
                    }
                }

                //data del reporte
                const data = {
                    fechaSolicitud: getDateToString(getDateNow(false), false),
                    usuario: usuario,
                    titular: cuentaRecibo.contribuyentePrincipal.nombrePersona.toUpperCase(),
                    domicilio: `${direccion.calle} ${direccion.altura} Piso. ${iif(direccion.piso,"","/")} Dpto. ${iif(direccion.dpto,"","/")}`.toUpperCase(),
                    localidad: `${localidad} C.P. ${direccion.codigoPostal}`.toUpperCase(),
                    nomenclatura: cuentaRecibo.nomenclatura,
                    cuenta: `${codigoTipoTributo}-${cuenta.numeroCuenta}`,
                    convenio: planPago.numero,
                    codigoPlanPago: planPago.codigo,
                    descPlanPago: planPago.descripcion,
                    firmante: vinculoCuenta.nombrePersona,
                    recibos: recibos
                };

                const optionsReport = {
                    title: 'Plan de Pagos',
                    margin: {
                        top: 10,
                        bottom: 10,
                        left: 0,
                        right: 0
                    },
                    pathBodyTemplate: 'src/domain/services/reports/report-plan-pago-recibo/index.ejs',
                    // pathHeaderTemplate: '',
                    // pathFooterTemplate: '',
                    pathStyles: ['src/domain/services/reports/report-common/index.css', 'src/domain/services/reports/report-plan-pago-recibo/index.css'],
                    data: data
                };
                
                const pdfReport = new PdfReport("PlanPagoRecibo.pdf", "src/infraestructure/sdk/pdf-report", optionsReport);
                const buffer = await pdfReport.generate() as Buffer;

                resolve(buffer);
            }
            catch(error) {
                reject(new ProcessError('Error generando reporte', error));
            }
        });
    }

    async getVinculoCuenta(idTipoTributo, idVinculoCuenta) {
        let vinculoCuenta = null;
        switch(idTipoTributo) {
            case 10:
                vinculoCuenta = await this.vinculoInmuebleService.findById(idVinculoCuenta) as VinculoInmueble;
                break;
            case 11:
                vinculoCuenta = await this.vinculoComercioService.findById(idVinculoCuenta) as VinculoComercio;
                break;
            case 12:
                vinculoCuenta = await this.vinculoVehiculoService.findById(idVinculoCuenta) as VinculoVehiculo;
                break;
            case 13:
                vinculoCuenta = await this.vinculoCementerioService.findById(idVinculoCuenta) as VinculoCementerio;
                break;
            case 14:
                vinculoCuenta = await this.vinculoFondeaderoService.findById(idVinculoCuenta) as VinculoFondeadero;
                break;
            case 15:
                vinculoCuenta = await this.vinculoEspecialService.findById(idVinculoCuenta) as VinculoEspecial;
                break;
            default:
                vinculoCuenta = null;
                break;
        }

        return vinculoCuenta;
    }

}