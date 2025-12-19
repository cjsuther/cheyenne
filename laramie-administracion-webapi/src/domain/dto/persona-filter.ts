
export default class PersonaFilter {
    numeroDocumento: string;
    nombre: string;
    etiqueta: string;

    constructor(
        numeroDocumento: string = "",
        nombre: string = "",
        etiqueta: string = ""
        )
    {
        this.numeroDocumento = numeroDocumento;
        this.nombre = nombre;
        this.etiqueta = etiqueta;
    }
    
}
