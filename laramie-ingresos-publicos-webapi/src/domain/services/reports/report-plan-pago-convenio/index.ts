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
import VinculoCuentaService from '../../vinculo-cuenta-service';
import VinculoEspecialService from '../../vinculo-especial-service';

import Direccion from '../../../entities/direccion';
import Localidad from '../../../entities/localidad';
import CuentaPago from '../../../entities/cuenta-pago';


import { getDateNow, getDateToString, getFormatNumber, iif } from '../../../../infraestructure/sdk/utils/convert';
import ProcessError from '../../../../infraestructure/sdk/error/process-error';
import ValidationError from '../../../../infraestructure/sdk/error/validation-error';
import CuentaRecibo from '../../../dto/cuenta-recibo';
import PlanPagoDTO from '../../../dto/plan-pago-dto';
import PlanPago from '../../../entities/plan-pago';
import PlanPagoCuota from '../../../entities/plan-pago-cuota';
import PlanPagoDefinicion from '../../../entities/plan-pago-definicion';
import TipoPlanPago from '../../../entities/tipo-plan-pago';
import Lista from '../../../entities/lista';
import DireccionService from '../../direccion-service';
import VinculoCuenta from '../../../entities/vinculo-cuenta';

export default class ReportPlanPagoConvenio {

    listaService: ListaService;
    localidadService: LocalidadService;
    direccionService: DireccionService;
	configuracionService: ConfiguracionService;
    cuentaService: CuentaService;
    tasaService: TasaService;
    subTasaService: SubTasaService;
    planPagoService: PlanPagoService;
	cuentaPagoService: CuentaPagoService;
	cuentaPagoItemService: CuentaPagoItemService;
    vinculoCuentaService: VinculoCuentaService;
    vinculoEspecialService: VinculoEspecialService;

	constructor(listaService: ListaService, localidadService: LocalidadService, direccionService: DireccionService, configuracionService: ConfiguracionService,
                cuentaService: CuentaService, tasaService: TasaService, subTasaService: SubTasaService,
                planPagoService: PlanPagoService, cuentaPagoService: CuentaPagoService, cuentaPagoItemService: CuentaPagoItemService,
                vinculoCuentaService: VinculoCuentaService)
    {
        this.listaService = listaService;
        this.localidadService = localidadService;
        this.direccionService = direccionService;
        this.configuracionService = configuracionService;
		this.cuentaService = cuentaService;
        this.tasaService = tasaService;
        this.subTasaService = subTasaService;
        this.planPagoService = planPagoService;
        this.cuentaPagoService = cuentaPagoService;
		this.cuentaPagoItemService = cuentaPagoItemService;
        this.vinculoCuentaService = vinculoCuentaService;
	}

    async generateReport(usuario:string, idPlanPago:number) {
        return new Promise( async (resolve, reject) => {
            try {
                const localidades = await this.localidadService.list() as Array<Localidad>;
                const listas = await this.listaService.list() as Array<Lista>;

                const planPagoDTO = await this.planPagoService.findById(idPlanPago) as PlanPagoDTO;
                const tipoPlanPago = planPagoDTO.tipoPlanPago as TipoPlanPago;
                const planPagoDefinicion = planPagoDTO.planPagoDefinicion as PlanPagoDefinicion;
				const planPago = planPagoDTO.planPago as PlanPago;
				const planPagoCuotas = planPagoDTO.planPagoCuotas as Array<PlanPagoCuota>;
                const vinculoCuenta = await this.vinculoCuentaService.findById(planPago.idTipoTributo, planPago.idVinculoCuenta) as VinculoCuenta;

                const cuentaPagos = await this.cuentaPagoService.listByPlanPago(idPlanPago) as Array<CuentaPago>;

                const cuentaRecibo = await this.cuentaService.findReciboById(planPago.idCuenta) as CuentaRecibo;
                const cuenta = cuentaRecibo.cuenta;

                const entidadPersona = (vinculoCuenta.idTipoPersona === 500) ? "PersonaFisica" : "PersonaJuridicaDomicilioLegal";
                let direccion: Direccion = null
                try {
                    const direcciones = (await this.direccionService.listByEntidadAdministracion(entidadPersona, vinculoCuenta.idPersona)) as Array<Direccion>;
                    if (direcciones.length === 0) {
                        reject(new ValidationError('El titular no tiene domicilios asociados'));
                        return;
                    }
                    direccion = direcciones[0];
                }
                catch(error) {
                    reject(new ValidationError('No se pudo obtener el domicilio del titular'));
                    return;
                }
                const localidad = localidades.find(f => f.id === direccion.idLocalidad).nombre;
                const domicilio = `${direccion.calle} ${direccion.altura} Piso. ${iif(direccion.piso,"","/")} Dpto. ${iif(direccion.dpto,"","/")}`.toUpperCase();

                const codigoTipoTributo = listas.find(f => f.id === planPago.idTipoTributo).codigo;
                const tipoDocumento = listas.find(f => f.id === vinculoCuenta.idTipoDocumento).nombre;
                const tipoVinculoCuenta = listas.find(f => f.id === vinculoCuenta.idTipoVinculoCuenta).nombre;
                const cantidadCuotas = (planPagoDefinicion.tieneAnticipo) ? (cuentaPagos.length - 1) : cuentaPagos.length;
                const planPagoUltimaCuota = planPagoCuotas[planPagoCuotas.length - 1];

                let condiciones = tipoPlanPago.condiciones;
                condiciones = condiciones.replace('[[SOLICITANTE_NOMBRE]]', vinculoCuenta.nombrePersona);
                condiciones = condiciones.replace('[[SOLICITANTE_TIPO_DOCUMENTO]]', tipoDocumento);
                condiciones = condiciones.replace('[[SOLICITANTE_NUMERO_DOCUMENTO]]', vinculoCuenta.numeroDocumento);
                condiciones = condiciones.replace('[[SOLICITANTE_DOMICILIO]]', domicilio);
                condiciones = condiciones.replace('[[SOLICITANTE_LOCALIDAD]]', localidad);
                condiciones = condiciones.replace('[[TIPO_VINCULO_CUENTA]]', tipoVinculoCuenta);
                condiciones = condiciones.replace('[[IMPORTE_CAPITAL]]', getFormatNumber(planPago.importeCapital,2));
                if (planPagoDefinicion.tieneAnticipo) {
                    const planPagoAnticipo = planPagoCuotas[0];
                    condiciones = condiciones.replace('[[IMPORTE_ANTICIPO]]', getFormatNumber(planPagoAnticipo.importeCuota,2));
                }
                condiciones = condiciones.replace('[[CANTIDAD_CUOTAS]]', cantidadCuotas.toString());
                condiciones = condiciones.replace('[[IMPORTE_CUOTA]]', getFormatNumber(planPagoUltimaCuota.importeCuota,2));

                //data del reporte
                const data = {
                    fechaSolicitud: getDateToString(getDateNow(false), false),
                    usuario: usuario,
                    titular: cuentaRecibo.contribuyentePrincipal.nombrePersona.toUpperCase(),
                    domicilio: domicilio,
                    localidad: `${localidad} C.P. ${direccion.codigoPostal}`.toUpperCase(),
                    nomenclatura: cuentaRecibo.nomenclatura,
                    cuenta: `${codigoTipoTributo}-${cuenta.numeroCuenta}`,
                    convenio: planPago.numero,
                    condiciones: condiciones,
                    codigoPlanPago: planPago.codigo,
                    descPlanPago: planPago.descripcion,
                    firmante: vinculoCuenta.nombrePersona,
                    cantidadCuotas: cantidadCuotas.toString(),
                    totalConsolidado: getFormatNumber(planPago.importeCapital,2)
                };

                const optionsReport = {
                    title: 'Plan de Pagos',
                    margin: {
                        top: 100,
                        bottom: 10,
                        left: 28,
                        right: 28
                    },
                    pathBodyTemplate: 'src/domain/services/reports/report-plan-pago-convenio/index.ejs',
                    pathHeaderTemplate: 'src/domain/services/reports/report-plan-pago-convenio/header.ejs',
                    // pathFooterTemplate: '',
                    pathStyles: ['src/domain/services/reports/report-common/index.css', 'src/domain/services/reports/report-plan-pago-convenio/index.css'],
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

}