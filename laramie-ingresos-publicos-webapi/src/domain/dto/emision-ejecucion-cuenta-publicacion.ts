
export default class EmisionEjecucionCuentaPublicacion {
    idEmisionEjecucion: number;
    idEmisionDefinicion: number;
    numeroEjecucion: string;
    descripcionEjecucion: string;
    descripcionAbreviada: string;
    calculoPagoAnticipado: boolean;
    aplicaDebitoAutomatico: boolean;
    idCuenta: number;
    idTipoTributo: number;
    numeroCuenta: string;
    periodo: string;
    cuota: number;
    codigoDelegacion: string;
    numeroRecibo: number;
    codigoBarras: string;
    importeVencimiento1: number;
    importeVencimiento2: number;
    fechaVencimiento1: Date;
    fechaVencimiento2: Date;
    idTasa: number;
    idSubTasa: number;
    idMedioPago: number;
    detalleMedioPago: string;

    constructor(
        idEmisionEjecucion: number = 0,
        idEmisionDefinicion: number = 0,
        numeroEjecucion: string = "",
        descripcionEjecucion: string = "",
        descripcionAbreviada: string = "",
        calculoPagoAnticipado: boolean = false,
        aplicaDebitoAutomatico: boolean = false,
        idCuenta: number = 0,
        idTipoTributo: number = 0,
        numeroCuenta: string = "",
        periodo: string = "",
        cuota: number = 0,
        codigoDelegacion: string = "",
        numeroRecibo: number = 0,
        codigoBarras: string = "",
        importeVencimiento1: number = 0,
        importeVencimiento2: number = 0,
        fechaVencimiento1: Date = null,
        fechaVencimiento2: Date = null,
        idTasa: number = 0,
        idSubTasa: number = 0,
        idMedioPago: number = 0,
        detalleMedioPago: string = ""
        )
    {
        this.idEmisionEjecucion = idEmisionEjecucion;
        this.idEmisionDefinicion = idEmisionDefinicion;
        this.numeroEjecucion = numeroEjecucion;
        this.descripcionEjecucion = descripcionEjecucion;
        this.descripcionAbreviada = descripcionAbreviada;
        this.calculoPagoAnticipado = calculoPagoAnticipado;
        this.aplicaDebitoAutomatico = aplicaDebitoAutomatico;
        this.idCuenta = idCuenta;
        this.idTipoTributo = idTipoTributo;
        this.numeroCuenta = numeroCuenta;
        this.periodo = periodo;
        this.cuota = cuota;
        this.codigoDelegacion = codigoDelegacion;
        this.numeroRecibo = numeroRecibo;
        this.codigoBarras = codigoBarras;
        this.importeVencimiento1 = importeVencimiento1;
        this.importeVencimiento2 = importeVencimiento2;
        this.fechaVencimiento1 = fechaVencimiento1;
        this.fechaVencimiento2 = fechaVencimiento2;
        this.idTasa = idTasa;
        this.idSubTasa = idSubTasa;
        this.idMedioPago = idMedioPago;
        this.detalleMedioPago = detalleMedioPago;
    }
}