//import PdfReport from '../../../../infraestructure/sdk/pdf-report';
import ProcessError from '../../../../infraestructure/sdk/error/process-error';
import { getDateNow, getDateToTicketDate, getFormatNumber } from '../../../../infraestructure/sdk/utils/convert';
import { getNumeroRecibo_ObjectToIdentificador } from '../../../../infraestructure/sdk/utils/helper';
import Caja from '../../../entities/caja';
import Configuracion from '../../../entities/configuracion';
import Lista from '../../../entities/lista';
import MovimientoCaja from '../../../entities/movimiento-caja';
import MovimientoMedioPago from '../../../entities/movimiento-medio-pago';
import MovimientoReciboPublicacion from '../../../entities/movimiento-recibo-publicacion';
import ReciboApertura from '../../../entities/recibo-apertura';
import ReciboPublicacion from '../../../entities/recibo-publicacion';
import SubTasa from '../../../entities/sub-tasa';
import Tasa from '../../../entities/tasa';
import CajaService from '../../caja-service';
import ConfiguracionService from '../../configuracion-service';
import ListaService from '../../lista-service';
import MovimientoCajaService from '../../movimiento-caja-service';
import MovimientoMedioPagoService from '../../movimiento-medio-pago-service';
import MovimientoReciboPublicacionService from '../../movimiento-recibo-publicacion-service';
import ReciboAperturaService from '../../recibo-apertura-service';
import ReciboPublicacionService from '../../recibo-publicacion-service';
import TasaService from '../../tasa-service';


export default class ReportCajaTicket {

    configuracionService: ConfiguracionService;
    cajaService: CajaService;
    movimientoCajaService: MovimientoCajaService;
    movimientoMedioPagoService: MovimientoMedioPagoService;
    movimientoReciboPublicacionService: MovimientoReciboPublicacionService;
    reciboPublicacionService: ReciboPublicacionService;
    reciboAperturaService: ReciboAperturaService;
    listaService: ListaService;
    tasaService: TasaService;

	constructor(configuracionService: ConfiguracionService,
                cajaService: CajaService,
                movimientoCajaService: MovimientoCajaService,
                movimientoMedioPagoService: MovimientoMedioPagoService,
                movimientoReciboPublicacionService: MovimientoReciboPublicacionService,
                reciboPublicacionService: ReciboPublicacionService,
                reciboAperturaService: ReciboAperturaService,
                listaService: ListaService,
                tasaService: TasaService
    ) {
        this.configuracionService = configuracionService;
        this.cajaService = cajaService;
        this.movimientoCajaService = movimientoCajaService;
        this.movimientoMedioPagoService = movimientoMedioPagoService;
        this.movimientoReciboPublicacionService = movimientoReciboPublicacionService;
        this.reciboPublicacionService = reciboPublicacionService;
        this.reciboAperturaService = reciboAperturaService;
        this.listaService = listaService;
        this.tasaService = tasaService;
	}

    async generateReport(token: string, usuario:string, idMovimientoCaja: number) {
        return new Promise( async (resolve, reject) => {
            try {
                const lengthTicket = 33;
                const configuracion = await this.configuracionService.findByNombre("MunicipioNombre") as Configuracion;
                const listaMediosPagos = await this.listaService.list("MedioPago") as Lista[];
                const movimientoCaja = await this.movimientoCajaService.findById(idMovimientoCaja) as MovimientoCaja;
                const mediosPagos = await this.movimientoMedioPagoService.listByMovimientoCaja(idMovimientoCaja) as MovimientoMedioPago[];
                const movimientosRecibos = await this.movimientoReciboPublicacionService.listByMovimientoCaja(idMovimientoCaja) as MovimientoReciboPublicacion[];
                const caja = await this.cajaService.findById(movimientoCaja.idCaja) as Caja;
                const tasas = await this.tasaService.listTasa(token) as Tasa[];
                const subtasas = await this.tasaService.listSubTasa(token) as SubTasa[];
                const importeTotal = '$ '+getFormatNumber(movimientoCaja.importeCobro,2);

                const items: string[] = [];
                for (let i=0; i<movimientosRecibos.length; i++) {
                    const movimientoRecibo = movimientosRecibos[i];
                    const importeMovimiento = '$ '+getFormatNumber(movimientoRecibo.importeCobro,2);
                    const recibo = await this.reciboPublicacionService.findById(movimientoRecibo.idReciboPublicacion) as ReciboPublicacion;
                    const aperturas = await this.reciboAperturaService.listByReciboPublicacion(recibo.id) as ReciboApertura[];
                    const aperturasCancelar = aperturas.filter(f => f.importeCancelar > 0);
                    if (aperturasCancelar.length > 0) {
                        const apertura = aperturasCancelar[0]; //tomo el primer item como referencia
                        const tasa = tasas.find(f => f.codigo === apertura.codigoTasa);
                        const subtasa = subtasas.find(f => f.idTasa === tasa.id && f.codigo === apertura.codigoSubTasa);
                        const concepto = `${apertura.codigoTasa}-${apertura.codigoSubTasa}/${recibo.periodo}-${recibo.cuota.toString().padStart(2,'0')}`;
                        const renglon1 = `${subtasa.descripcionReducida.substring(0, lengthTicket-concepto.length-1)} ${concepto}`.padEnd(lengthTicket,' ');
                        items.push(renglon1);

                        const idItem = `ID: ${getNumeroRecibo_ObjectToIdentificador(recibo)}`
                        const renglon2 = `${idItem}${"".padEnd(lengthTicket-idItem.length-importeMovimiento.length,' ')}${importeMovimiento}`;
                        items.push(renglon2);
                    }
                }

                const itemsMediosPagos: string[] = [];
                const checkMediosPagos = new Map<string, string>();
                for (let i=0; i<mediosPagos.length; i++) {
                    const detalleMedioPago = listaMediosPagos.find(f => f.id === mediosPagos[i].idMedioPago);
                    if (!checkMediosPagos.has(detalleMedioPago.codigo)) {
                        const renglon = `${detalleMedioPago.nombre}${"".padEnd(lengthTicket-detalleMedioPago.nombre.length,' ')}`
                        itemsMediosPagos.push(renglon);
                        checkMediosPagos.set(detalleMedioPago.codigo, null);
                    }
                }

                const data = [
                    `${"".padEnd((lengthTicket-configuracion.valor.length)/2,' ')}${configuracion.valor.toUpperCase()}`,
                    `${"".padEnd((lengthTicket-20)/2,' ')}TESORERÍA MUNICIPAL`,
                    '_________________________________',
                    getDateToTicketDate(getDateNow(true)).padStart(lengthTicket,' '),
                    `CAJA: ${caja.codigo}`.padStart(lengthTicket,' '),
                    `CAJERO: ${usuario}`.padStart(lengthTicket,' '),
                    '_________________________________',
                    ...items,
                    '_________________________________',
                    `TOTAL${"".padEnd(lengthTicket-5-importeTotal.length,' ')}${importeTotal}`,
                    `MEDIO DE PAGO:${"".padEnd(lengthTicket-14,' ')}`,
                    ...itemsMediosPagos,
                    '                                  ',
                    `___________${movimientoCaja.id.toString().padStart(12,'0')}__________`,
                ];

                resolve(data);
            }
            catch(error) {
                reject(new ProcessError('Error generando reporte', error));
            }
        });
    }


}