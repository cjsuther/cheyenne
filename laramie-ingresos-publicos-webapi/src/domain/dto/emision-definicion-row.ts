
export default class EmisionDefinicionRow {
    id: number;
    numero: string;
    descripcion: string;
    estadoEmisionDefinicion: string;
    tipoTributo: string;
    numeracion: string;

    constructor(
        id: number = 0,
        numero: string = "",
        descripcion: string = "",
        estadoEmisionDefinicion: string = "",
        tipoTributo: string = "",
        numeracion: string = ""
        )
    {
        this.id = id;
        this.numero = numero;
        this.descripcion = descripcion;
        this.estadoEmisionDefinicion = estadoEmisionDefinicion;
        this.tipoTributo = tipoTributo;
        this.numeracion = numeracion;
    }
}