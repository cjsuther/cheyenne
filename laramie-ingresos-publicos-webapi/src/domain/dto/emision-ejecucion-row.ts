
export default class EmisionEjecucionRow {
    id: number;
    idEmisionDefinicion: number;
    periodo: string;
    numeroEmisionEjecucion: string;
    descripcionEmisionEjecucion: string;
    estadoEmisionEjecucion: string;
    numeroEmisionDefinicion: string;
    descripcionEmisionDefinicion: string;
    estadoEmisionDefinicion: string;
    tipoTributo: string;
    numeracion: string;

    constructor(
        id: number = 0,
        idEmisionDefinicion: number = 0,
        periodo: string = "",
        numeroEmisionEjecucion: string = "",
        descripcionEmisionEjecucion: string = "",
        estadoEmisionEjecucion: string = "",
        numeroEmisionDefinicion: string = "",
        descripcionEmisionDefinicion: string = "",
        estadoEmisionDefinicion: string = "",
        tipoTributo: string = "",
        numeracion: string = ""
        )
    {
        this.id = id;
        this.idEmisionDefinicion = idEmisionDefinicion;
        this.periodo = periodo;
        this.numeroEmisionEjecucion = numeroEmisionEjecucion;
        this.descripcionEmisionEjecucion = descripcionEmisionEjecucion;
        this.estadoEmisionEjecucion = estadoEmisionEjecucion;
        this.numeroEmisionDefinicion = numeroEmisionDefinicion;
        this.descripcionEmisionDefinicion = descripcionEmisionDefinicion;
        this.estadoEmisionDefinicion = estadoEmisionDefinicion;        
        this.tipoTributo = tipoTributo;
        this.numeracion = numeracion;
    }
}