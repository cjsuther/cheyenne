export default class PagoReciboEspecial {

    idCuenta: number;
	idPersona: number;
	idTipoPersona: number;
	idTipoDocumento: number;
	numeroDocumento: string;
	nombrePersona: string;
	idReciboEspecial: number;
	periodo: string;
	cuota: number;
	fechaVencimiento: Date;

	constructor(
        idCuenta: number = 0,
		idPersona: number = 0,
		idTipoPersona: number = 0,
		idTipoDocumento: number = 0,
		numeroDocumento: string = "",
		nombrePersona: string = "",
		idReciboEspecial: number = 0,
		periodo: string = "",
		cuota: number = 0,
		fechaVencimiento: Date = null
	)
	{
        this.idCuenta = idCuenta;
		this.idPersona = idPersona;
		this.idTipoPersona = idTipoPersona;
		this.idTipoDocumento = idTipoDocumento;
		this.numeroDocumento = numeroDocumento;
		this.nombrePersona = nombrePersona;
		this.idReciboEspecial = idReciboEspecial;
		this.periodo = periodo;
		this.cuota = cuota;
		this.fechaVencimiento = fechaVencimiento;
	}

	setFromObject = (row) =>
	{
        this.idCuenta = row.idCuenta ?? 0;
		this.idPersona = row.idPersona ?? 0;
		this.idTipoPersona = row.idTipoPersona ?? 0;
		this.idPersona = row.idPersona ?? 0;
		this.idTipoDocumento = row.idTipoDocumento ?? 0;
		this.numeroDocumento = row.numeroDocumento ?? "";
		this.nombrePersona = row.nombrePersona ?? "";
		this.idReciboEspecial = row.idReciboEspecial ?? 0;
		this.periodo = row.periodo ?? "";
		this.cuota = row.cuota ?? 0;
		this.fechaVencimiento = row.fechaVencimiento ?? null;
	}

}
