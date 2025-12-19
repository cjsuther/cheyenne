export default class RecargoDescuento {

    id: number;
	idCuenta: number;
	idTipoRecargoDescuento: number;
	idTasa: number;
	idSubTasa: number;
	idRubro: number;
	fechaDesde: Date;
	fechaHasta: Date;
	fechaOtorgamiento: Date;
	numeroSolicitud: string;
	porcentaje: number;
	importe: number;
	idPersona: number;
	idTipoPersona: number;
	nombrePersona: string;
	numeroDocumento: string;
	idTipoDocumento: number;
	numeroDDJJ: string;
	letraDDJJ: string;
	ejercicioDDJJ: string;
	numeroDecreto: string;
	letraDecreto: string;
	ejercicioDecreto: string;
	idExpediente: number;
	detalleExpediente: string;

	constructor(
        id: number = 0,
		idCuenta: number = 0,
		idTipoRecargoDescuento: number = 0,
		idTasa: number = 0,
		idSubTasa: number = 0,
		idRubro: number = 0,
		fechaDesde: Date = null,
		fechaHasta: Date = null,
		fechaOtorgamiento: Date = null,
		numeroSolicitud: string = "",
		porcentaje: number = 0,
		importe: number = 0,
		idPersona: number = 0,
		idTipoPersona: number = 0,
		nombrePersona: string = "",
		numeroDocumento: string = "",
		idTipoDocumento: number = 0,
		numeroDDJJ: string = "",
		letraDDJJ: string = "",
		ejercicioDDJJ: string = "",
		numeroDecreto: string = "",
		letraDecreto: string = "",
		ejercicioDecreto: string = "",
		idExpediente: number = 0,
		detalleExpediente: string = ""
	)
	{
        this.id = id;
		this.idCuenta = idCuenta;
		this.idTipoRecargoDescuento = idTipoRecargoDescuento;
		this.idTasa = idTasa;
		this.idSubTasa = idSubTasa;
		this.idRubro = idRubro;
		this.fechaDesde = fechaDesde;
		this.fechaHasta = fechaHasta;
		this.fechaOtorgamiento = fechaOtorgamiento;
		this.numeroSolicitud = numeroSolicitud;
		this.porcentaje = porcentaje;
		this.importe = importe;
		this.idPersona = idPersona;
		this.idTipoPersona = idTipoPersona;
		this.nombrePersona = nombrePersona;
		this.numeroDocumento = numeroDocumento;
		this.idTipoDocumento = idTipoDocumento;
		this.numeroDDJJ = numeroDDJJ;
		this.letraDDJJ = letraDDJJ;
		this.ejercicioDDJJ = ejercicioDDJJ;
		this.numeroDecreto = numeroDecreto;
		this.letraDecreto = letraDecreto;
		this.ejercicioDecreto = ejercicioDecreto;
		this.idExpediente = idExpediente;
		this.detalleExpediente = detalleExpediente;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idCuenta = row.idCuenta ?? 0;
		this.idTipoRecargoDescuento = row.idTipoRecargoDescuento ?? 0;
		this.idTasa = row.idTasa ?? 0;
		this.idSubTasa = row.idSubTasa ?? 0;
		this.idRubro = row.idRubro ?? 0;
		this.fechaDesde = row.fechaDesde ?? null;
		this.fechaHasta = row.fechaHasta ?? null;
		this.fechaOtorgamiento = row.fechaOtorgamiento ?? null;
		this.numeroSolicitud = row.numeroSolicitud ?? "";
		this.porcentaje = row.porcentaje ?? 0;
		this.importe = row.importe ?? 0;
		this.idPersona = row.idPersona ?? 0;
		this.idTipoPersona = row.idTipoPersona ?? 0;
		this.nombrePersona = row.nombrePersona ?? "";
		this.numeroDocumento = row.numeroDocumento ?? "";
		this.idTipoDocumento = row.idTipoDocumento ?? 0;
		this.numeroDDJJ = row.numeroDDJJ ?? "";
		this.letraDDJJ = row.letraDDJJ ?? "";
		this.ejercicioDDJJ = row.ejercicioDDJJ ?? "";
		this.numeroDecreto = row.numeroDecreto ?? "";
		this.letraDecreto = row.letraDecreto ?? "";
		this.ejercicioDecreto = row.ejercicioDecreto ?? "";
		this.idExpediente = row.idExpediente ?? 0;
		this.detalleExpediente = row.detalleExpediente ?? "";
	}

}