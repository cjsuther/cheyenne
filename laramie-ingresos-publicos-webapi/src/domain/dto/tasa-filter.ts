
export default class TasaFilter {
    codigo: string;
    descripcion: string;
    etiqueta: string;

    constructor(
        codigo: string = "",
        descripcion: string = "",
        etiqueta: string = ""
        )
    {
        this.codigo = codigo;
        this.descripcion = descripcion;
        this.etiqueta = etiqueta;
    }
    
}
