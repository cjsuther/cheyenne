
export default class CuentaRow {

    id: number;
    idTipoTributo: number;
    numeroCuenta: string;
    numeroWeb: string;
    idContribuyente: number;
    idTipoDocumentoContribuyente: number;
    numeroDocumentoContribuyente: string;
    nombreContribuyente: string;
    idTributo: number;
    detalleTributo: string;

    constructor(
        id: number = 0,
        idTipoTributo: number = 0,
        numeroCuenta: string = "",
        numeroWeb: string = "",
        idContribuyente: number = 0,
        idTipoDocumentoContribuyente: number = 0,
        numeroDocumentoContribuyente: string = "",
        nombreContribuyente: string = "",
        idTributo: number = 0,
        detalleTributo: string = "",
    )
    {
        this.id = id;
        this.idTipoTributo = idTipoTributo;
        this.numeroCuenta = numeroCuenta;
        this.numeroWeb = numeroWeb;
        this.idContribuyente = idContribuyente;
        this.idTipoDocumentoContribuyente = idTipoDocumentoContribuyente;
        this.numeroDocumentoContribuyente = numeroDocumentoContribuyente;
        this.nombreContribuyente = nombreContribuyente;
        this.idTributo = idTributo;
        this.detalleTributo = detalleTributo;
    }
    
}
