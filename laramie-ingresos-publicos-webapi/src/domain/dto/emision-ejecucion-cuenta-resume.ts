
export default class EmisionEjecucionCuentaResume {
    idEmisionEjecucion: number;
    idEstadoEmisionEjecucion: number;
    fechaEjecucionInicio: Date;
    fechaEjecucionFin: Date;
    idEstadoEmisionEjecucionCuenta: number;
    estadoEmisionEjecucionCuenta: string;
    cantidad: number;

    constructor(
        idEmisionEjecucion: number = 0,
        idEstadoEmisionEjecucion: number = 0,
        fechaEjecucionInicio: Date = null,
        fechaEjecucionFin: Date = null,
        idEstadoEmisionEjecucionCuenta: number = 0,
        estadoEmisionEjecucionCuenta: string = "",
        cantidad: number = 0
        )
    {
        this.idEmisionEjecucion = idEmisionEjecucion;
        this.idEstadoEmisionEjecucion = idEstadoEmisionEjecucion;
        this.fechaEjecucionInicio = fechaEjecucionInicio;
        this.fechaEjecucionFin = fechaEjecucionFin;
        this.idEstadoEmisionEjecucionCuenta = idEstadoEmisionEjecucionCuenta;
        this.estadoEmisionEjecucionCuenta = estadoEmisionEjecucionCuenta;
        this.cantidad = cantidad;
    }
}