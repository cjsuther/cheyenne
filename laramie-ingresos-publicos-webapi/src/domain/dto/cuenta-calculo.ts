
export default class CuentaCalculo {

    idEmisionEjecucionCuota: number;
    idEmisionEjecucionCuenta: number;
    idEmisionCuota: number;
    periodo: string;
    numeroEmision: string;
    numeroCuenta: string;
    codigoDelegacion: string;
    numeroRecibo: string;
    cuota: string;
    inmCalle: string;
    inmAltura: string;
    zonCalle: string;
    zonAltura: string;

    constructor(
        idEmisionEjecucionCuota: number = 0,
        idEmisionEjecucionCuenta: number = 0,
        idEmisionCuota: number = 0,
        periodo: string = "",
        numeroEmision: string = "",
        numeroCuenta: string = "",
        codigoDelegacion: string = "",
        numeroRecibo: string = "",
        cuota: string = "",
        inmCalle: string = "",
        inmAltura: string = "",
        zonCalle: string = "",
        zonAltura: string = "")
    {
        this.idEmisionEjecucionCuota = idEmisionEjecucionCuota;
        this.idEmisionEjecucionCuenta = idEmisionEjecucionCuenta;
        this.idEmisionCuota = idEmisionCuota;
        this.periodo = periodo;
        this.numeroEmision = numeroEmision;
        this.numeroCuenta = numeroCuenta;
        this.codigoDelegacion = codigoDelegacion;
        this.numeroRecibo = numeroRecibo;
        this.cuota = cuota;
        this.inmCalle = inmCalle;
        this.inmAltura = inmAltura;
        this.zonCalle = zonCalle;
        this.zonAltura = zonAltura;
    }
    
}
