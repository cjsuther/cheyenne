
export default class CementerioFilter {
    //por cuenta
    numeroCuenta: string;
    numeroWeb: string;
    numeroDocumento: string;
    idPersona: number;
    etiqueta: string;
    //por datos inhumado
    numeroDocumentoInhumado: string;
    nombreApellidoInhumado: string;

    constructor(
        numeroCuenta: string = "",
        numeroWeb: string = "",
        numeroDocumento: string = "",
        idPersona: number = 0,
        etiqueta: string = "",
        numeroDocumentoInhumado: string = "",
        nombreApellidoInhumado: string = ""     
        )
    {
        this.numeroCuenta = numeroCuenta;
        this.numeroWeb = numeroWeb;
        this.numeroDocumento = numeroDocumento;
        this.idPersona = idPersona;
        this.etiqueta = etiqueta;
        this.numeroDocumentoInhumado = numeroDocumentoInhumado;
        this.nombreApellidoInhumado = nombreApellidoInhumado;
    }
    
}
