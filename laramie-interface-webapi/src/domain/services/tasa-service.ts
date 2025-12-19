import { REQUEST_METHOD } from '../../infraestructure/sdk/consts/requestMethodType';
import { APIS } from '../../server/configuration/apis';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ApiError from '../../infraestructure/sdk/error/api-error';
import ListaService from './lista-service';
import { SendRequest } from '../../infraestructure/sdk/utils/request';
import SubTasaDTO from '../dto/sub-tasa-dto';
import Jurisdiccion from '../entities/jurisdiccion';
import { distinctArray } from '../../infraestructure/sdk/utils/helper';
import CuentaContable from '../entities/cuenta-contable';
import RecursoPorRubro from '../entities/recurso-por-rubro';
import ImputacionDTO from '../dto/imputacion-dto';


export default class TasaService {

    listaService: ListaService;
    
    constructor(listaService: ListaService) {
        this.listaService = listaService;
    }

    async listTasa(token: string) {
        return new Promise( async (resolve, reject) => {
            try {
                const result = await SendRequest(token, null, null, REQUEST_METHOD.GET, APIS.URLS.TASA);
                resolve(result);
            }
            catch(error) {
                reject(new ProcessError('Error procesando datos', error));
            }
        });
    }

    async listSubTasa(token: string) {
        return new Promise( async (resolve, reject) => {
            try {
                const result = await SendRequest(token, null, null, REQUEST_METHOD.GET, APIS.URLS.SUB_TASA);
                resolve(result);
            }
            catch(error) {
                reject(new ProcessError('Error procesando datos', error));
            }
        });
    }

    async listSubTasaImputacion(token: string, codigoSubTasas: any[]) {
        return new Promise( async (resolve, reject) => {
            try {
                const listas = await this.listaService.listByTipos(token, "Tasa&SubTasa") as any;
                const tasas = listas.Tasa as any[];
                const subtasas = listas.SubTasa as any[];

                let idsCuentaContable: number[] = [];
                let idsJurisdiccion: number[] = [];
                let idsRecursoPorRubro: number[] = [];
                const relaciones: SubTasaDTO[] = [];
                for (let i=0; i<codigoSubTasas.length; i++) {
                    const codigo = codigoSubTasas[i];
                    const tasa = tasas.find(f => f.codigo === codigo.codigoTasa);
                    const subtasa = subtasas.find(f => f.idTasa === tasa.id && f.codigo === codigo.codigoSubTasa);

                    const dataDTO = await SendRequest(token, `/${subtasa.id}`, null, REQUEST_METHOD.GET, APIS.URLS.SUB_TASA) as any;
                    const imputacion = dataDTO.subTasaImputaciones.find(f => f.ejercicio === codigo.ejercicio) as any;
                    const subTasaDTO = new SubTasaDTO();
                    subTasaDTO.ejercicio = codigo.ejercicio;
                    subTasaDTO.codigoTasa = tasa.codigo;
                    subTasaDTO.codigoSubTasa = subtasa.codigo;
                    subTasaDTO.descripcionTasa = tasa.descripcion;
                    subTasaDTO.descripcionSubTasa = subtasa.descripcion;
                    if (imputacion) subTasaDTO.imputacion.setFromObject(imputacion);
                    relaciones.push(subTasaDTO);

                    idsCuentaContable = [...idsCuentaContable, subTasaDTO.imputacion.idCuentaContableAnterior, subTasaDTO.imputacion.idCuentaContable, subTasaDTO.imputacion.idCuentaContableFutura];
                    idsJurisdiccion = [...idsJurisdiccion, subTasaDTO.imputacion.idJurisdiccionAnterior, subTasaDTO.imputacion.idJurisdiccionActual, subTasaDTO.imputacion.idJurisdiccionFutura];
                    idsRecursoPorRubro = [...idsRecursoPorRubro, subTasaDTO.imputacion.idRecursoPorRubroAnterior, subTasaDTO.imputacion.idRecursoPorRubroActual, subTasaDTO.imputacion.idRecursoPorRubroFutura];
                }
                idsCuentaContable = distinctArray(idsCuentaContable.filter(v => v > 0));
                idsJurisdiccion = distinctArray(idsJurisdiccion.filter(v => v > 0));
                idsRecursoPorRubro = distinctArray(idsRecursoPorRubro.filter(v => v > 0));

                const definicionesCuentaContable: CuentaContable[] = [];
                for (let i=0; i<idsCuentaContable.length; i++) {
                    const item = await SendRequest(token, `/${idsCuentaContable[i]}`, null, REQUEST_METHOD.GET, APIS.URLS.ADMINISTRACION_CUENTA_CONTABLE) as CuentaContable;
                    definicionesCuentaContable.push(item);
                }
                const definicionesJurisdiccion: Jurisdiccion[] = [];
                for (let i=0; i<idsJurisdiccion.length; i++) {
                    const item = await SendRequest(token, `/${idsJurisdiccion[i]}`, null, REQUEST_METHOD.GET, APIS.URLS.ADMINISTRACION_JURISDICCION) as Jurisdiccion;
                    definicionesJurisdiccion.push(item);
                }
                const definicionesRecursoPorRubro: RecursoPorRubro[] = [];
                for (let i=0; i<idsRecursoPorRubro.length; i++) {
                    const item = await SendRequest(token, `/${idsRecursoPorRubro[i]}`, null, REQUEST_METHOD.GET, APIS.URLS.ADMINISTRACION_RECURSO_POR_RUBRO) as RecursoPorRubro;
                    definicionesRecursoPorRubro.push(item);
                }

                const imputacionDTO = new ImputacionDTO();
                imputacionDTO.relaciones = relaciones;
                imputacionDTO.definicionesCuentaContable = definicionesCuentaContable;
                imputacionDTO.definicionesJurisdiccion = definicionesJurisdiccion;
                imputacionDTO.definicionesRecursoPorRubro = definicionesRecursoPorRubro;

                resolve(imputacionDTO);
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

}
