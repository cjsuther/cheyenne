
export default class CuentaFilter {
    idCuenta: number;
    idTipoTributo: number;
    numeroCuenta: string;
    numeroWeb: string;
    idPersona: number;
    etiqueta: string;

    constructor(
        idCuenta: number = 0,
        idTipoTributo: number = 0,
        numeroCuenta: string = "",
        numeroWeb: string = "",
        idPersona: number = 0,
        etiqueta: string = ""
    )
    {
        this.idCuenta = idCuenta;
        this.idTipoTributo = idTipoTributo;
        this.numeroCuenta = numeroCuenta;
        this.numeroWeb = numeroWeb;
        this.idPersona = idPersona;
        this.etiqueta = etiqueta;
    }
    
}
