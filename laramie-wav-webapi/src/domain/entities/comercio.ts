
export default class Comercio {

    id: number;
    idCuenta: number;
    idEstadoCarga: number;
    fechaCargaInicio: Date;
    fechaCargaFin: Date;
    idCuentaInmueble: number;
    nombreFantasia: string;
    digitoVerificador: string;
    granContribuyente: boolean;
    numeroCuit: string;
    idTipoUbicacion: number;

    constructor(
        id: number = 0,
        idCuenta: number = 0,
        idEstadoCarga: number = 0,
        fechaCargaInicio: Date = null,
        fechaCargaFin: Date = null,
        idCuentaInmueble: number = 0,
        nombreFantasia: string = "",
        digitoVerificador: string = "",
        granContribuyente: boolean = false,
        numeroCuit: string = "",
        idTipoUbicacion: number = 0)
    {
        this.id = id;
        this.idCuenta = idCuenta;
        this.idEstadoCarga = idEstadoCarga;
        this.fechaCargaInicio = fechaCargaInicio;
        this.fechaCargaFin = fechaCargaFin;
		this.idCuentaInmueble = idCuentaInmueble;
		this.nombreFantasia = nombreFantasia;
		this.digitoVerificador = digitoVerificador;
		this.granContribuyente = granContribuyente;
		this.numeroCuit = numeroCuit;
		this.idTipoUbicacion = idTipoUbicacion;
     
    }

    setFromObject = (row) =>
    {
        this.id = row.id ?? 0;
        this.idCuenta = row.idCuenta ?? 0;
        this.idEstadoCarga = row.idEstadoCarga ?? 0;
        this.fechaCargaInicio = row.fechaCargaInicio ?? null;
        this.fechaCargaFin = row.fechaCargaFin ?? null;
		this.idCuentaInmueble = row.idCuentaInmueble ?? 0;
		this.nombreFantasia = row.nombreFantasia ?? "";
		this.digitoVerificador = row.digitoVerificador ?? "";
		this.granContribuyente = row.granContribuyente ?? false;
		this.numeroCuit = row.numeroCuit ?? "";
        this.idTipoUbicacion = row.idTipoUbicacion ?? 0;
    }
}
