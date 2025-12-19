
export default class SubTasaFilter {
    idTasa: number;
    codigo: string;
    descripcion: string;
    etiqueta: string;

    constructor(
        idTasa: number = 0,
        codigo: string = "",
        descripcion: string = "",
        etiqueta: string = ""
        )
    {
        this.idTasa = idTasa;
        this.codigo = codigo;
        this.descripcion = descripcion;
        this.etiqueta = etiqueta;
    }
    
}
