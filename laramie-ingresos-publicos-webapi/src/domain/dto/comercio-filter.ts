
export default class ComercioFilter {
    //por cuenta
    numeroCuenta: string;
    numeroWeb: string;
    numeroDocumento: string;
    idPersona: number;
    etiqueta: string;
    //por datos comercio
    cuentaInmueble: string;
    rubro: string;
    nombreFantasia: string;


    constructor(
        numeroCuenta: string = "",
        numeroWeb: string = "",
        numeroDocumento: string = "",
        idPersona: number = 0,
        etiqueta: string = "",
        cuentaInmueble: string = "",
        rubro: string = "",
        nombreFantasia: string = ""
        )
    {
        this.numeroCuenta = numeroCuenta;
        this.numeroWeb = numeroWeb;
        this.numeroDocumento = numeroDocumento;
        this.idPersona = idPersona;
        this.etiqueta = etiqueta;
        this.cuentaInmueble = cuentaInmueble;
        this.rubro = rubro;
        this.nombreFantasia = nombreFantasia;
    }
    
}
