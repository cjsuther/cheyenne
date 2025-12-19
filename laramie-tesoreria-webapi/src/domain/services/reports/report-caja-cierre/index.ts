import { MEDIO_PAGO } from '../../../../infraestructure/sdk/consts/medioPago';
import { TIPO_MOVIMIENTO_CAJA } from '../../../../infraestructure/sdk/consts/tipoMovimientoCaja';
import { TIPO_TRIBUTO } from '../../../../infraestructure/sdk/consts/tipoTributo';
import ProcessError from '../../../../infraestructure/sdk/error/process-error';
import { getDateNow, getDateToTicketDate, getFormatNumber } from '../../../../infraestructure/sdk/utils/convert';
import Caja from '../../../entities/caja';
import CajaAsignacion from '../../../entities/caja-asignacion';
import Configuracion from '../../../entities/configuracion';
import Lista from '../../../entities/lista';
import MovimientoCaja from '../../../entities/movimiento-caja';
import MovimientoMedioPago from '../../../entities/movimiento-medio-pago';
import MovimientoReciboPublicacion from '../../../entities/movimiento-recibo-publicacion';
import ReciboApertura from '../../../entities/recibo-apertura';
import ReciboPublicacion from '../../../entities/recibo-publicacion';
import SubTasa from '../../../entities/sub-tasa';
import Tasa from '../../../entities/tasa';
import CajaAsignacionService from '../../caja-asignacion-service';
import CajaService from '../../caja-service';
import ConfiguracionService from '../../configuracion-service';
import ListaService from '../../lista-service';
import MovimientoCajaService from '../../movimiento-caja-service';
import MovimientoMedioPagoService from '../../movimiento-medio-pago-service';
import MovimientoReciboPublicacionService from '../../movimiento-recibo-publicacion-service';
import ReciboAperturaService from '../../recibo-apertura-service';
import ReciboPublicacionService from '../../recibo-publicacion-service';
import TasaService from '../../tasa-service';


export default class ReportCajaCierre {

    configuracionService: ConfiguracionService;
    cajaService: CajaService;
    cajaAsignacionService: CajaAsignacionService;
    movimientoCajaService: MovimientoCajaService;
    movimientoMedioPagoService: MovimientoMedioPagoService;
    movimientoReciboPublicacionService: MovimientoReciboPublicacionService;
    reciboPublicacionService: ReciboPublicacionService;

	constructor(configuracionService: ConfiguracionService,
                cajaService: CajaService,
                cajaAsignacionService: CajaAsignacionService,
                movimientoCajaService: MovimientoCajaService,
                movimientoMedioPagoService: MovimientoMedioPagoService,
                movimientoReciboPublicacionService: MovimientoReciboPublicacionService,
                reciboPublicacionService: ReciboPublicacionService
    ) {
        this.configuracionService = configuracionService;
        this.cajaService = cajaService;
        this.cajaAsignacionService = cajaAsignacionService;
        this.movimientoCajaService = movimientoCajaService;
        this.movimientoMedioPagoService = movimientoMedioPagoService;
        this.movimientoReciboPublicacionService = movimientoReciboPublicacionService;
        this.reciboPublicacionService = reciboPublicacionService;
	}

    async generateReport(token: string, usuario:string, idCajaAsignacion: number) {
        return new Promise( async (resolve, reject) => {
            try {
                const lengthTicket = 33;
                const configuracion = await this.configuracionService.findByNombre("MunicipioNombre") as Configuracion;

                const cajaAsignacion = await this.cajaAsignacionService.findById(idCajaAsignacion) as CajaAsignacion;
                const caja = await this.cajaService.findById(cajaAsignacion.idCaja) as Caja;
                const movimientosCaja = await this.movimientoCajaService.listByCajaAsignacion(idCajaAsignacion) as MovimientoCaja[];

                const getRenglon = (titulo:string, valor:any, esMoneda = true, esNumerico = true) => {
                    const valorFormato = esNumerico ? (esMoneda ? `$ ${getFormatNumber(valor,2)}` : getFormatNumber(valor,0)) : valor;
                    return `${titulo}${"".padEnd(lengthTicket-titulo.length-valorFormato.length,' ')}${valorFormato}`;
                }

                //#region totalizadores
                let totalRecibosProcesdos = 0;

                let totalEfectivo = 0;
                let totalTarjetaCredito = 0;
                let totalTarjetaDebito = 0;
                let totalCheque = 0;
                let totalTransferencia = 0;
                let totalCobrado = 0;

                let totalRetiros = 0;
                let totalIngresos = 0;

                let totalTributo1 = 0;
                let totalTributo2 = 0;
                let totalTributo3 = 0;
                let totalTributo4 = 0;
                let totalTributo5 = 0;
                let totalTributo7 = 0;

                let itemsTarjetaCredito = new Map<string, number>();
                let itemsTarjetaDebito = new Map<string, number>();
                let itemsCheques = new Map<string, string>();
                //#endregion

                //#region data
                for (let m=0; m<movimientosCaja.length; m++) {
                    const movimientoCaja = movimientosCaja[m];

                    if (movimientoCaja.idTipoMovimientoCaja === TIPO_MOVIMIENTO_CAJA.COBRANZA) {
                        const recibosXMovimientoCaja = await this.movimientoReciboPublicacionService.listByMovimientoCaja(movimientoCaja.id) as MovimientoReciboPublicacion[];
                        for (let i=0; i<recibosXMovimientoCaja.length; i++) {
                            const movimiento = recibosXMovimientoCaja[i];
                            const recibo = await this.reciboPublicacionService.findById(movimiento.idReciboPublicacion) as ReciboPublicacion;
                            if (recibo) {
                                switch (recibo.codigoTipoTributo) {
                                    case TIPO_TRIBUTO.INMUEBLES: {
                                        totalTributo1 += movimiento.importeCobro;
                                        break;
                                    }
                                    case TIPO_TRIBUTO.COMERCIOS: {
                                        totalTributo2 += movimiento.importeCobro;
                                        break;
                                    }
                                    case TIPO_TRIBUTO.CEMENTERIOS: {
                                        totalTributo3 += movimiento.importeCobro;
                                        break;
                                    }
                                    case TIPO_TRIBUTO.FONDEADEROS: {
                                        totalTributo4 += movimiento.importeCobro;
                                        break;
                                    }
                                    case TIPO_TRIBUTO.VEHICULOS: {
                                        totalTributo5 += movimiento.importeCobro;
                                        break;
                                    }
                                    case TIPO_TRIBUTO.CUENTAS_ESPECIALES: {
                                        totalTributo7 += movimiento.importeCobro;
                                        break;
                                    }
                                }
                                totalRecibosProcesdos++;
                            }
                        }

                        const mediosPagosXMovimientoCaja = await this.movimientoMedioPagoService.listByMovimientoCaja(movimientoCaja.id) as MovimientoMedioPago[];
                        for (let i=0; i<mediosPagosXMovimientoCaja.length; i++) {
                            const medioPago = mediosPagosXMovimientoCaja[i];
                            switch (medioPago.idMedioPago) {
                                case MEDIO_PAGO.EFECTIVO: {
                                    totalEfectivo += medioPago.importeCobro;
                                    break;
                                }
                                case MEDIO_PAGO.TARJETA_CREDITO: {
                                    totalTarjetaCredito += medioPago.importeCobro;
                                    let importeAcumulado = itemsTarjetaCredito.has(medioPago.bancoMedioPago) ? itemsTarjetaCredito.get(medioPago.bancoMedioPago) : 0;
                                    importeAcumulado += medioPago.importeCobro;
                                    itemsTarjetaCredito.set(medioPago.bancoMedioPago, importeAcumulado);
                                    break;
                                }
                                case MEDIO_PAGO.TARJETA_DEBITO: {
                                    totalTarjetaDebito += medioPago.importeCobro;
                                    let importeAcumulado = itemsTarjetaDebito.has(medioPago.bancoMedioPago) ? itemsTarjetaDebito.get(medioPago.bancoMedioPago) : 0;
                                    importeAcumulado += medioPago.importeCobro;
                                    itemsTarjetaDebito.set(medioPago.bancoMedioPago, importeAcumulado);
                                    break;
                                }
                                case MEDIO_PAGO.CHEQUE: {
                                    totalCheque += medioPago.importeCobro;
                                    itemsCheques.set(medioPago.numeroMedioPago, medioPago.bancoMedioPago);
                                    break;
                                }
                                case MEDIO_PAGO.TRANSFERENCIA: {
                                    totalTransferencia += medioPago.importeCobro;
                                    break;
                                }
                            }
                        }
                        
                        totalCobrado += movimientoCaja.importeCobro;
                    }
                    else if (movimientoCaja.idTipoMovimientoCaja === TIPO_MOVIMIENTO_CAJA.RETIRO) {
                        totalRetiros += movimientoCaja.importeCobro;
                    }
                    else if (movimientoCaja.idTipoMovimientoCaja === TIPO_MOVIMIENTO_CAJA.INGRESO) {
                        totalIngresos += movimientoCaja.importeCobro;
                    }
                }
                //#endregion

                //#region items
                const items: string[] = [];
                items.push(getRenglon("Recibos procesados", totalRecibosProcesdos, false));
                items.push("".padEnd(lengthTicket));

                items.push("RESUMEN COBRADO");
                items.push(getRenglon("Efectivo", totalEfectivo));
                if (totalTarjetaCredito > 0) items.push(getRenglon("Tarj. Créd.", totalTarjetaCredito));
                if (totalTarjetaDebito > 0) items.push(getRenglon("Tarj. Déb.", totalTarjetaDebito));
                if (totalCheque > 0) items.push(getRenglon("Cheque", totalCheque));
                if (totalTransferencia > 0) items.push(getRenglon("Transferencia", totalTransferencia));
                items.push(getRenglon("Total cobrado", totalCobrado));
                items.push("".padEnd(lengthTicket));

                items.push("RESUMEN POR TRIBUTO");
                if (totalTributo1 > 0) items.push(getRenglon("Inmuebles", totalTributo1));
                if (totalTributo2 > 0) items.push(getRenglon("Comercios", totalTributo2));
                if (totalTributo3 > 0) items.push(getRenglon("Cementerios", totalTributo3));
                if (totalTributo4 > 0) items.push(getRenglon("Fondeaderos", totalTributo4));
                if (totalTributo5 > 0) items.push(getRenglon("Vehículos", totalTributo5));
                if (totalTributo7 > 0) items.push(getRenglon("Cuentas especiales", totalTributo7));
                items.push("".padEnd(lengthTicket));

                items.push("RESUMEN EFECTIVO");
                items.push(getRenglon("Saldo inicial", cajaAsignacion.importeSaldoInicial));
                items.push(getRenglon("Cobros", cajaAsignacion.importeCobroEfectivo));
                if (totalIngresos > 0) items.push(getRenglon("Ingresos", totalIngresos));
                if (totalRetiros > 0) items.push(getRenglon("Retiros", (-1)*totalRetiros));
                items.push(getRenglon("Total efectivo", cajaAsignacion.importeSaldoFinal));
                items.push("".padEnd(lengthTicket));

                if (itemsTarjetaCredito.size > 0) items.push("RESUMEN TARJETA CRÉDITO");
                for (const key of itemsTarjetaCredito.keys()) {
                    const value = itemsTarjetaCredito.get(key) as number;
                    items.push(getRenglon(key, value));
                }
                if (itemsTarjetaCredito.size > 0) items.push("".padEnd(lengthTicket));
              
                if (itemsTarjetaDebito.size > 0) items.push("RESUMEN TARJETA DÉBITO");
                for (const key of itemsTarjetaDebito.keys()) {
                    const value = itemsTarjetaDebito.get(key) as number;
                    items.push(getRenglon(key, value));
                }
                if (itemsTarjetaDebito.size > 0) items.push("".padEnd(lengthTicket));

                if (itemsCheques.size > 0) items.push("RESUMEN CHEQUES RECIBIDOS");
                for (const key of itemsCheques.keys()) {
                    const value = itemsCheques.get(key) as string;
                    items.push(getRenglon(key.slice(-4), value, false, false));
                }
                if (itemsCheques.size > 0) items.push("".padEnd(lengthTicket));
                //#endregion

                const data = [
                    `${"".padEnd((lengthTicket-14)/2,' ')}CIERRE DE CAJA`,
                    `${"".padEnd((lengthTicket-configuracion.valor.length)/2,' ')}${configuracion.valor.toUpperCase()}`,
                    `${"".padEnd((lengthTicket-20)/2,' ')}TESORERÍA MUNICIPAL`,
                    '_________________________________',
                    getDateToTicketDate(getDateNow(true)).padStart(lengthTicket,' '),
                    `CAJA: ${caja.codigo}`.padStart(lengthTicket,' '),
                    `CAJERO: ${usuario}`.padStart(lengthTicket,' '),
                    '_________________________________',
                    ...items,
                    `___________${cajaAsignacion.id.toString().padStart(12,'0')}__________`,
                ];

                resolve(data);
            }
            catch(error) {
                reject(new ProcessError('Error generando reporte', error));
            }
        });
    }


}