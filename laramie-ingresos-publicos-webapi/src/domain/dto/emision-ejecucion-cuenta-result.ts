export default class EmisionEjecucionCuentaResult {
    idEmisionEjecucionCuenta: number;
	idEmisionEjecucion: number;
	idCuenta: number;
	idEstadoEmisionEjecucionCuenta: number;
	numeroBloque: number;
	observacion: string;
	numeroCuenta: string;
	tipoEmisionCalculo: string;
	nombreCalculo: string;
    valor: string;

	constructor(
        idEmisionEjecucionCuenta: number = 0,
		idEmisionEjecucion: number = 0,
		idCuenta: number = 0,
		idEstadoEmisionEjecucionCuenta: number = 0,
		numeroBloque: number = 0,
		observacion: string = "",
        numeroCuenta: string = "",
        tipoEmisionCalculo: string = "",
        nombreCalculo: string = "",
        valor: string = ""
	)
	{
        this.idEmisionEjecucionCuenta = idEmisionEjecucionCuenta;
		this.idEmisionEjecucion = idEmisionEjecucion;
		this.idCuenta = idCuenta;
		this.idEstadoEmisionEjecucionCuenta = idEstadoEmisionEjecucionCuenta;
		this.numeroBloque = numeroBloque;
		this.observacion = observacion;
        this.numeroCuenta = numeroCuenta;
        this.tipoEmisionCalculo = tipoEmisionCalculo;
        this.nombreCalculo = nombreCalculo;
        this.valor = valor;
	}
}