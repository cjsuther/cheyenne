
export default class EmisionDefinicionFilter {
    idTipoTributo: number;
    numero: string;
    descripcion: string;
    etiqueta: string;

    constructor(
        idTipoTributo: number = 0,
        numero: string = "",
        descripcion: string = "",
        etiqueta: string = ""
        )
    {
        this.idTipoTributo = idTipoTributo;
        this.numero = numero;
        this.descripcion = descripcion;
        this.etiqueta = etiqueta;
    }
}