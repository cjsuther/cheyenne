import ClaseElementoService from "../../clase-elemento-service";
import ClaseElemento from "../../../entities/clase-elemento";
import TipoElementoService from "../../tipo-elemento-service";
import TipoElemento from "../../../entities/tipo-elemento";
import ElementoService from "../../elemento-service";
import Elemento from "../../../entities/elemento";
import DeclaracionJuradaComercioService from "../../declaracion-jurada-comercio-service";
import DeclaracionJuradaComercio from "../../../entities/declaracion-jurada-comercio";
import DeclaracionJuradaRubroService from "../../declaracion-jurada-rubro-service";
import DeclaracionJuradaRubro from "../../../entities/declaracion-jurada-rubro";
import TipoRubroComercioService from "../../tipo-rubro-comercio-service";
import TipoRubroComercio from "../../../entities/tipo-rubro-comercio";
import RubroComercioService from "../../rubro-comercio-service";
import RubroComercio from "../../../entities/rubro-comercio";
import ColeccionService from "../../coleccion-service";
import ColeccionData from "../../../dto/coleccion-data";
import { isNull } from "../../../../infraestructure/sdk/utils/validator";

export default class EmisionProcedure {

    claseElementoService: ClaseElementoService;
    tipoElementoService: TipoElementoService;
    elementoService: ElementoService;
    declaracionJuradaComercioService: DeclaracionJuradaComercioService;
    declaracionJuradaRubroService: DeclaracionJuradaRubroService;
    tipoRubroComercioService: TipoRubroComercioService;
    rubroComercioService: RubroComercioService;
    coleccionService: ColeccionService;
    colecciones: Array<ColeccionData>;
    params:object;

    idEmisionEjecucion:number;
    idTasa:number;
    idSubTasa:number;

    constructor(claseElementoService: ClaseElementoService, tipoElementoService: TipoElementoService, elementoService: ElementoService,
                declaracionJuradaComercioService: DeclaracionJuradaComercioService, declaracionJuradaRubroService: DeclaracionJuradaRubroService,
                tipoRubroComercioService: TipoRubroComercioService, rubroComercioService: RubroComercioService,
                coleccionService: ColeccionService, colecciones: Array<ColeccionData>, params:object,
                idEmisionEjecucion:number, idTasa:number, idSubTasa:number) {
        this.claseElementoService = claseElementoService;
        this.tipoElementoService = tipoElementoService;
        this.elementoService = elementoService;
        this.declaracionJuradaComercioService = declaracionJuradaComercioService;
        this.declaracionJuradaRubroService = declaracionJuradaRubroService;
        this.tipoRubroComercioService = tipoRubroComercioService;
        this.rubroComercioService = rubroComercioService;
        this.coleccionService = coleccionService;
        this.colecciones = colecciones;
        this.params = params;
        this.idEmisionEjecucion = idEmisionEjecucion;
        this.idTasa = idTasa;
        this.idSubTasa = idSubTasa;
    }

    async getEntidadesByCuenta(idCuenta:number, periodo:number, mes:number): Promise<object> {
        return new Promise( async (resolve, reject) => {
            try {
                const ddjjComercio = (await this.declaracionJuradaComercioService.listByCuenta(idCuenta) as Array<DeclaracionJuradaComercio>).find(f => parseInt(f.anioDeclaracion) === periodo && f.mesDeclaracion === mes && isNull(f.fechaBaja));
                if (!ddjjComercio) {
                    reject('DDJJ no presentada');
                }
                const ddjjRubros = await this.declaracionJuradaRubroService.listByDeclaracionJuradaComercio(ddjjComercio.id) as Array<DeclaracionJuradaRubro>;
                const tipos = await this.tipoRubroComercioService.list() as Array<TipoRubroComercio>;

                let result = {};
                for (let r=0; r < ddjjRubros.length; r++) {
                    const ddjjRubro = ddjjRubros[r];
                    const rubro = await this.rubroComercioService.findById(ddjjRubro.idRubroComercio) as RubroComercio;
                    const tipo = tipos.find(f => f.id === rubro.idTipoRubroComercio);

                    if (!result["LISTA_RUBROS"]) result["LISTA_RUBROS"] = [];
                    if (tipo.facturable) {
                        const row = {
                            "CAMPO_ALICUOTA": tipo.alicuota,
                            "CAMPO_MINIMO": tipo.importeMinimo,
                            "CAMPO_REG_GENERAL": tipo.regimenGeneral,
                            "CAMPO_ING_BRUTO": ddjjRubro.importeIngresosBrutos,
                            "CAMPO_DEDUCCIONES": ddjjRubro.importeDeducciones,
                            "CAMPO_ING_NETO": ddjjRubro.importeIngresosNetos
                        };
                        result["LISTA_RUBROS"].push(row);
                    }
                }

                resolve(result);
            }
            catch(error) {
                reject(`Error generando elementos: ${error.message}`);
            }
        });
    }

    async getElementosByCuenta(idCuenta:number, periodo:number, mes:number): Promise<object> {
        return new Promise( async (resolve, reject) => {
            try {
                const filterDate = new Date(periodo, mes, 1, 0, 0, 0, 0);
                const clases = await this.claseElementoService.list() as Array<ClaseElemento>;
                const tipos = await this.tipoElementoService.list() as Array<TipoElemento>;
                const elementos = (await this.elementoService.listByCuenta(idCuenta) as Array<Elemento>).filter(f => f.fechaAlta <= filterDate && (isNull(f.fechaBaja) || f.fechaBaja >= filterDate));

                let result = {};
                for (let e=0; e < elementos.length; e++) {
                    const elemento = elementos[e];
                    const clase = clases.find(f => f.id === elemento.idClaseElemento);
                    const tipo = tipos.find(f => f.id === elemento.idTipoElemento);

                    if (!result[clase.codigo]) result[clase.codigo] = [];
                    const row = {
                        "CAMPO_TIPO": tipo.codigo,
                        "CAMPO_CANTIDAD": elemento.cantidad,
                        "CAMPO_VALOR": tipo.valor
                    };
                    result[clase.codigo].push(row);
                }

                resolve(result);
            }
            catch(error) {
                reject(`Error generando elementos: ${error.message}`);
            }
        });
    }

    async getVariablesByCuenta(idCuenta:number, periodo:number, mes:number): Promise<object> {
        return new Promise( async (resolve, reject) => {
            try {
                //VARIABLES DE SALIDA
                let result = {};
                for (let c=0 ; c < this.colecciones.length; c++) {
                    const coleccionData = this.colecciones[c];
                    const data = await this.coleccionService.execute(coleccionData.coleccion, idCuenta, this.idEmisionEjecucion, this.idTasa, this.idSubTasa, periodo, mes);
                    for (let cc=0; cc < coleccionData.campos.length; cc++) {
                        const campo = coleccionData.campos[cc];
                        //uso el valor de coleccionCampo y el codigo de procedimientoVariable
                        result[campo[1].codigo] = data[0][campo[0].codigo];
                    }
                }

                resolve(result);
            }
            catch(error) {
                reject(`Error generando variables: ${error.message}`);
            }
        });
    }

}