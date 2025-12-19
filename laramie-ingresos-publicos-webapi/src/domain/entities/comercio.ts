
export default class Comercio {

    id: number;
    idCuenta: number;
    idEstadoCarga: number;
    fechaCargaInicio: Date;
    fechaCargaFin: Date;
	idRubro: number;
    idCuentaInmueble: number;
    nombreFantasia: string;
    digitoVerificador: string;
    granContribuyente: boolean;

    constructor(
        id: number = 0,
        idCuenta: number = 0,
        idEstadoCarga: number = 0,
        fechaCargaInicio: Date = null,
        fechaCargaFin: Date = null,
        idRubro: number = 0,
        idCuentaInmueble: number = 0,
        nombreFantasia: string = "",
        digitoVerificador: string = "",
        granContribuyente: boolean = false)
    {
        this.id = id;
        this.idCuenta = idCuenta;
        this.idEstadoCarga = idEstadoCarga;
        this.fechaCargaInicio = fechaCargaInicio;
        this.fechaCargaFin = fechaCargaFin;
		this.idRubro = idRubro;
		this.idCuentaInmueble = idCuentaInmueble;
		this.nombreFantasia = nombreFantasia;
		this.digitoVerificador = digitoVerificador;
		this.granContribuyente = granContribuyente;
     
    }

    setFromObject = (row) =>
    {
        this.id = row.id ?? 0;
        this.idCuenta = row.idCuenta ?? 0;
        this.idEstadoCarga = row.idEstadoCarga ?? 0;
        this.fechaCargaInicio = row.fechaCargaInicio ?? null;
        this.fechaCargaFin = row.fechaCargaFin ?? null;
		this.idRubro = row.idRubro ?? 0;
		this.idCuentaInmueble = row.idCuentaInmueble ?? 0;
		this.nombreFantasia = row.nombreFantasia ?? "";
		this.digitoVerificador = row.digitoVerificador ?? "";
		this.granContribuyente = row.granContribuyente ?? false;
    }
}
