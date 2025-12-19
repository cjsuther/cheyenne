
export default class InmuebleFilter {
    //por cuenta
    numeroCuenta: string;
    numeroWeb: string;
    numeroDocumento: string;
    idPersona: number;
    etiqueta: string;
    //por ubicacion
    catastral: string;
    direccion: string;

    constructor(
        numeroCuenta: string = "",
        numeroWeb: string = "",
        numeroDocumento: string = "",
        idPersona: number = 0,
        etiqueta: string = "",
        catastral: string = "",
        direccion: string = ""
        )
    {
        this.numeroCuenta = numeroCuenta;
        this.numeroWeb = numeroWeb;
        this.numeroDocumento = numeroDocumento;
        this.idPersona = idPersona;
        this.etiqueta = etiqueta;
        this.catastral = catastral;
        this.direccion = direccion;
    }
    
}
