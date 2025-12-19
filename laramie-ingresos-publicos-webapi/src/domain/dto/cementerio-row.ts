
export default class CementerioRow {

    id: number;
    idCuenta: number;
    estadoCarga: string;
    numeroCuenta: string;
    numeroWeb: string;
    idEstadoCuenta: number;
    idTipoDocumentoInhumado: number;
    numeroDocumentoInhumado: string;
    nombreInhumado: string;
    apellidoInhumado: string;

    constructor(
        id: number = 0,
        idCuenta: number = 0,
        estadoCarga: string = "",
        numeroCuenta: string = "",
        numeroWeb: string = "",
        idEstadoCuenta: number = 0,
        idTipoDocumentoInhumado: number = 0,
        numeroDocumentoInhumado: string = "",
        nombreInhumado: string = "",
        apellidoInhumado: string = ""
        )
    {
        this.id = id;
        this.idCuenta = idCuenta;
        this.estadoCarga = estadoCarga;
        this.numeroCuenta = numeroCuenta;
        this.numeroWeb = numeroWeb;
        this.idEstadoCuenta = idEstadoCuenta;
        this.idTipoDocumentoInhumado = idTipoDocumentoInhumado;
        this.numeroDocumentoInhumado = numeroDocumentoInhumado;
        this.nombreInhumado = nombreInhumado;
        this.apellidoInhumado = apellidoInhumado;
    }
    
}
