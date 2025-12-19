
export default class EmisionEjecucionFilter {
    idEmisionDefinicion: number;
    idTipoTributo: number;
    numero: string;
    descripcion: string;
    periodo: string;
    etiqueta: string;
    calculoMasivo: boolean;
    calculoMostradorWeb: boolean;


    constructor(
        idEmisionDefinicion: number = 0,
        idTipoTributo: number = 0,
        numero: string = "",
        descripcion: string = "",
        periodo: string = "",
        etiqueta: string = "",
        calculoMasivo: boolean =false,
        calculoMostradorWeb: boolean =false
        )
    {
        this.idEmisionDefinicion = idEmisionDefinicion;
        this.idTipoTributo = idTipoTributo;
        this.numero = numero;
        this.descripcion = descripcion;
        this.periodo = periodo;
        this.etiqueta = etiqueta;
        this.calculoMasivo = calculoMasivo;
        this.calculoMostradorWeb = calculoMostradorWeb;
    }   
}