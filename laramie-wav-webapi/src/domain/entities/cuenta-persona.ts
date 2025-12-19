
export default class CuentaPersona {

    id: number;
    numeroCuenta: string;
    numeroWeb: string;
    idEstadoCuenta: number;
    idTipoTributo: number;
    idTributo: number;
    detalleTributo: string;
    nombreContribuyente: string;
    importeDeuda: number;
    tieneDeuda: boolean;
    tieneDeudaVencida: boolean;
    esTitular: boolean;
    esResponsableCuenta: boolean;    

    constructor(
        id: number = 0,
        numeroCuenta: string = "",
        numeroWeb: string = "",
        idEstadoCuenta: number = 0,
        idTipoTributo: number = 0,
        idTributo: number = 0,
        detalleTributo = "",
        nombreContribuyente = "",
        importeDeuda: number = 0,
        tieneDeuda: boolean = false,
        tieneDeudaVencida: boolean = false,
        esTitular: boolean = false,
        esResponsableCuenta: boolean = false)
    {
        this.id = id;
        this.numeroCuenta = numeroCuenta;
        this.numeroWeb = numeroWeb;
        this.idEstadoCuenta = idEstadoCuenta;
        this.idTipoTributo = idTipoTributo;
        this.idTributo = idTributo;
        this.detalleTributo = detalleTributo;
        this.nombreContribuyente = nombreContribuyente;
        this.importeDeuda = importeDeuda;
        this.tieneDeuda = tieneDeuda;
        this.tieneDeudaVencida = tieneDeudaVencida;
        this.esTitular = esTitular;
        this.esResponsableCuenta = esResponsableCuenta;
    }

    setFromObject = (row) =>
    {
        this.id = row.id ?? 0;
        this.numeroCuenta = row.numeroCuenta ?? "";
        this.numeroWeb = row.numeroWeb ?? "";
        this.idEstadoCuenta = row.idEstadoCuenta ?? 0;
        this.idTipoTributo = row.idTipoTributo ?? 0;
        this.idTributo = row.idTributo ?? 0;
        this.detalleTributo = row.detalleTributo ?? "";
        this.nombreContribuyente = row.nombreContribuyente ?? "";
        this.importeDeuda = row.importeDeuda ?? 0;
        this.tieneDeuda = row.tieneDeuda ?? false;
        this.tieneDeudaVencida = row.tieneDeudaVencida ?? false;
        this.esTitular = row.esTitular ?? false;
        this.esResponsableCuenta = row.esResponsableCuenta ?? false;
    }
    
}
