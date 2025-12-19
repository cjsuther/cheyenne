
export default class VehiculoFilter {
    //por cuenta
    numeroCuenta: string;
    numeroWeb: string;
    numeroDocumento: string;
    idPersona: number;
    etiqueta: string;
    //por datos vehiculo
    dominio: string;
    marcaModelo: string;

    constructor(
        numeroCuenta: string = "",
        numeroWeb: string = "",
        numeroDocumento: string = "",
        idPersona: number = 0,
        etiqueta: string = "",
        dominio: string = "",
        marcaModelo: string = ""
        )
    {
        this.numeroCuenta = numeroCuenta;
        this.numeroWeb = numeroWeb;
        this.numeroDocumento = numeroDocumento;
        this.idPersona = idPersona;
        this.etiqueta = etiqueta;
        this.dominio = dominio;
        this.marcaModelo = marcaModelo;
    }
    
}
