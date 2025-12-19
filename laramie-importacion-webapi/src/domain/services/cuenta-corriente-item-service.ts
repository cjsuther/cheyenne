import CuentaCorrienteItemRecibo from '../dto/cuenta-corriente-item-recibo';
import { REQUEST_METHOD } from '../../infraestructure/sdk/consts/requestMethodType';
import { APIS } from '../../server/configuration/apis';
import { SendRequest } from '../../infraestructure/sdk/utils/request';
import ConfiguracionService from './configuracion-service';
import ListaService from './lista-service';
import Lista from '../entities/lista';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import CuentaCorrienteItem from '../entities/cuenta-corriente-item';


export default class CuentaCorrienteItemService {

    configuracionService: ConfiguracionService;
    listaService: ListaService;

    constructor(configuracionService: ConfiguracionService, listaService: ListaService) {
        this.configuracionService = configuracionService;
        this.listaService = listaService;
    }

    async listByCuota(token: string, idCuenta: number, perido: string, cuota: number) {
        const paramsUrl = `/cuenta/${idCuenta}/periodo/${perido}/cuota/${cuota}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.CUENTA_CORRIENTE_ITEM);
    }

    async listByPartida(token: string, numeroPartida: number) {
        const paramsUrl = `/partida/${numeroPartida}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.CUENTA_CORRIENTE_ITEM);
    }

    async addReciboComun(token: string, idCuenta: number, fechaVencimiento: Date, items: CuentaCorrienteItemRecibo, cancelacionForzada: boolean = false) {
        const paramsUrl = `/recibo-comun`;
        const body = {
            idCuenta: idCuenta,
            fechaVencimiento: fechaVencimiento,
            items: [items],
            cancelacionForzada: cancelacionForzada
        };
        return SendRequest(token, paramsUrl, body, REQUEST_METHOD.POST, APIS.URLS.CUENTA_CORRIENTE_ITEM);
    }
    
}
