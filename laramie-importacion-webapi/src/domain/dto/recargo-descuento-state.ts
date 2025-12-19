import RecargoDescuento from "../entities/recargo-descuento";

export default class RecargoDescuentoState extends RecargoDescuento {

    state: string;

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
		detalleExpediente: string = "",
		state: string = "o"
	)
	{
        super(
			id,
			idCuenta,
			idTipoRecargoDescuento,
			idTasa,
			idSubTasa,
			idRubro,
			fechaDesde,
			fechaHasta,
			fechaOtorgamiento,
			numeroSolicitud,
			porcentaje,
			importe,
			idPersona,
			idTipoPersona,
			nombrePersona,
			numeroDocumento,
			idTipoDocumento,
			numeroDDJJ,
			letraDDJJ,
			ejercicioDDJJ,
			numeroDecreto,
			letraDecreto,
			ejercicioDecreto,
			idExpediente,
			detalleExpediente
		);
		this.state = state;
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
		this.state = row.state ?? "o";
	}

}