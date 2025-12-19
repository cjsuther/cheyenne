import { REQUEST_METHOD } from '../../infraestructure/sdk/consts/requestMethodType';
import { APIS } from '../../server/configuration/apis';
import { SendRequest } from '../../infraestructure/sdk/utils/request';
import { getDateNow, getDateSerialize } from '../../infraestructure/sdk/utils/convert';
import CuentaCorrienteItemDeuda from '../entities/cuenta-corriente-item-deuda';
import CuentaCorrienteItemDeudaResumen from '../entities/cuenta-corriente-item-deuda-resumen';
import ApiError from '../../infraestructure/sdk/error/api-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import { isNull } from '../../infraestructure/sdk/utils/validator';
import ListaService from './lista-service';
import CuentaCorrienteCondicionEspecial from '../entities/cuenta-corriente-condicion-especial';
import ConfiguracionService from './configuracion-service';
import Configuracion from '../entities/configuracion';
import { addArray } from '../../infraestructure/sdk/utils/helper';
import TasaService from './tasa-service';


export default class CuentaCorrienteItemService {

    configuracionService: ConfiguracionService;
    listaService: ListaService;
    tasaService: TasaService;

    constructor(configuracionService: ConfiguracionService, listaService: ListaService, tasaService: TasaService) {
        this.configuracionService = configuracionService;
        this.listaService = listaService;
        this.tasaService = tasaService;
    }

    async listByDeudaVencimiento(token: string, idCuenta: number) {
		return new Promise( async (resolve, reject) => {
			try {
                const codigoTipoMovimientoCreditoRetencion:string = (await this.configuracionService.findByNombre(token, 'CuentaCorrienteCodigoTipoMovimientoCreditoRetencion') as Configuracion).valor;
                const codigoTipoCondicionEspecialPagoProvisorio:string = (await this.configuracionService.findByNombre(token, 'TipoCondicionEspecialPagoProvisorio') as Configuracion).valor;
                const listas = await this.listaService.listByTipos(token, "TipoCondicionEspecial&TipoMovimiento") as any;
                const tasas = await this.tasaService.listTasa(token) as any[];
                const subtasas = await this.tasaService.listSubTasa(token) as any[];
                const idsSubtasaCreditoRetencionAplicable = subtasas.filter(f => f.liquidableDDJJ).map(x => x.id) as number[];
                const idsTipoCondicionesEspecialesInhibicion = listas.TipoCondicionEspecial.filter(f => f.inhibicion).map(x => x.id) as number[];
                const tipoCondicionEspecialPagoProvisorio = listas.TipoCondicionEspecial.find(f => f.codigo === codigoTipoCondicionEspecialPagoProvisorio);
                const tipoMovimientoCreditoRetencion = listas.TipoMovimiento.find(f => f.codigo === codigoTipoMovimientoCreditoRetencion);

				const toDay = getDateNow();
                const fechaVencimiento = encodeURIComponent(getDateSerialize(toDay));
                const paramsUrl = `/deuda/${idCuenta}/vencimiento/${fechaVencimiento}`;
                const data = await SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.CUENTA_CORRIENTE_ITEM) as any;
                const creditos = await this.listByCredito(token, idCuenta) as any[];
                creditos.forEach(row => {
                    if (row.fechaVencimiento1) row.fechaVencimiento2 = new Date(row.fechaVencimiento1);
                    if (row.fechaVencimiento2) row.fechaVencimiento2 = new Date(row.fechaVencimiento2);
                });
    
                const items: CuentaCorrienteItemDeudaResumen[] = data.cuentaCorrienteItems.map(row => {
                    if (row.fechaVencimiento1) row.fechaVencimiento1 = new Date(row.fechaVencimiento1);
                    if (row.fechaVencimiento2) row.fechaVencimiento2 = new Date(row.fechaVencimiento2);

                    const item = new CuentaCorrienteItemDeuda();
                    item.setFromObject(row);
                    const condicionesEspecialesXPartida = data.cuentaCorrienteCondicionesEspeciales.filter(f => f.numeroPartida === item.numeroPartida) as CuentaCorrienteCondicionEspecial[];
                    const condicionesEspecialesConInhibicion = condicionesEspecialesXPartida.filter(f => idsTipoCondicionesEspecialesInhibicion.includes(f.idTipoCondicionEspecial));
                    const condicionesEspecialesPagoProvisorio = condicionesEspecialesXPartida.find(f => f.idTipoCondicionEspecial === tipoCondicionEspecialPagoProvisorio.id);

                    const itemResumen = new CuentaCorrienteItemDeudaResumen();
                    itemResumen.setFromObject(row);
                    itemResumen.tieneDeudaVencida = (item.importeAccesorios > 0);
                    itemResumen.tieneDeudaJudicial = (!isNull(item.idCertificadoApremio) && item.idCertificadoApremio > 0);
                    itemResumen.esPlanPago = (!isNull(item.idPlanPagoCuota) && item.idPlanPagoCuota > 0);
                    itemResumen.fechaVencimiento = item.fechaVencimiento2;

                    const tasa = tasas.find(f => f.id === item.idTasa);
                    itemResumen.codigoTasa = tasa.codigo;
                    itemResumen.nombreTasa = tasa.descripcion;
                    const subtasa = subtasas.find(f => f.id === item.idSubTasa);
                    itemResumen.codigoSubTasa = subtasa.codigo;
                    itemResumen.nombreSubTasa = subtasa.descripcion;
                    itemResumen.descripcionTasa = subtasa.descripcion;
                    itemResumen.tieneInhibicion = (condicionesEspecialesConInhibicion.length > 0);
                    itemResumen.idPasarela = condicionesEspecialesPagoProvisorio ? condicionesEspecialesPagoProvisorio.numeroComprobante : 0;

                    itemResumen.importeCreditoAplicable = addArray(creditos.filter(credito => credito.idTipoMovimiento !== tipoMovimientoCreditoRetencion.id &&
                                                                                        item.fechaVencimiento2.getTime() >= toDay.getTime() &&
                                                                                        item.fechaVencimiento2.getTime() >= credito.fechaVencimiento.getTime())
                                                                           .map(x => x.importeSaldo));

                    itemResumen.importeCreditoRetencionAplicable = addArray(creditos.filter(credito => credito.idTipoMovimiento === tipoMovimientoCreditoRetencion.id &&
                                                                                        item.fechaVencimiento2.getTime() >= toDay.getTime() &&
                                                                                        item.fechaVencimiento2.getTime() >= credito.fechaVencimiento.getTime() &&
                                                                                        idsSubtasaCreditoRetencionAplicable.includes(item.idSubTasa))
                                                                           .map(x => x.importeSaldo));

                    return itemResumen;
                });

                resolve(items);
			}
			catch(error) {
                if (error.statusCode && error.message) {
                    reject(new ApiError(error.message, error.statusCode));
                }
                else {
                    reject(new ProcessError('Error procesando datos', error));
                }
			}
		});
    }

    async listByCredito(token: string, idCuenta) {
		return new Promise( async (resolve, reject) => {
			try {
                const tasas = await this.tasaService.listTasa(token) as any[];
                const subtasas = await this.tasaService.listSubTasa(token) as any[];

                const paramsUrl = `/credito/${idCuenta}`;
                const itemsCreditos = await SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.CUENTA_CORRIENTE_ITEM) as any[];
    
                const items: CuentaCorrienteItemDeudaResumen[] = itemsCreditos.map(item => {
                    const itemResumen = new CuentaCorrienteItemDeudaResumen();
                    itemResumen.setFromObject(item);
                    itemResumen.fechaVencimiento = new Date(item.fechaVencimiento2);

                    const tasa = tasas.find(f => f.id === item.idTasa);
                    itemResumen.codigoTasa = tasa.codigo;
                    itemResumen.nombreTasa = tasa.descripcion;
                    const subtasa = subtasas.find(f => f.id === item.idSubTasa);
                    itemResumen.codigoSubTasa = subtasa.codigo;
                    itemResumen.nombreSubTasa = subtasa.descripcion;
                    itemResumen.descripcionTasa = subtasa.descripcion;
                    itemResumen["idTipoMovimiento"] = item.idTipoMovimiento;

                    delete itemResumen.importeAccesorios;
                    delete itemResumen.importeTotal;
                    delete itemResumen.importeCreditoAplicable;
                    delete itemResumen.importeCreditoRetencionAplicable;
                    delete itemResumen.tieneDeudaVencida;
                    delete itemResumen.tieneDeudaJudicial;
                    delete itemResumen.tieneInhibicion;
                    delete itemResumen.esPlanPago;
                    delete itemResumen.idPasarela;

                    return itemResumen;
                });

                resolve(items);
			}
			catch(error) {
                if (error.statusCode && error.message) {
                    reject(new ApiError(error.message, error.statusCode));
                }
                else {
                    reject(new ProcessError('Error procesando datos', error));
                }
			}
		});
    }

    async addReciboComun(token: string, dataBody: object) {
        const paramsUrl = `/recibo-comun`;
        return SendRequest(token, paramsUrl, dataBody, REQUEST_METHOD.POST, APIS.URLS.CUENTA_CORRIENTE_ITEM);
    }

}
