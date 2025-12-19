export default class EdesurCliente {

    id: number;
	idEdesur: number;
	idPersona: number;
	idTipoPersona: number;
	nombrePersona: string;
	idTipoDocumento: number;
	numeroDocumento: string;
	codigoCliente: string;
	fechaDesde: Date;
	fechaHasta: Date;

	constructor(
        id: number = 0,
		idEdesur: number = 0,
		idPersona: number = 0,
		idTipoPersona: number = 0,
		nombrePersona: string = "",
		idTipoDocumento: number = 0,
		numeroDocumento: string = "",
		codigoCliente: string = "",
		fechaDesde: Date = null,
		fechaHasta: Date = null
	)
	{
        this.id = id;
		this.idEdesur = idEdesur;
		this.idPersona = idPersona;
		this.idTipoPersona = idTipoPersona;
		this.nombrePersona = nombrePersona;
		this.idTipoDocumento = idTipoDocumento;
		this.numeroDocumento = numeroDocumento;
		this.codigoCliente = codigoCliente;
		this.fechaDesde = fechaDesde;
		this.fechaHasta = fechaHasta;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idEdesur = row.idEdesur ?? 0;
		this.idPersona = row.idPersona ?? 0;
		this.idTipoPersona = row.idTipoPersona ?? 0;
		this.nombrePersona = row.nombrePersona ?? "";
		this.idTipoDocumento = row.idTipoDocumento ?? 0;
		this.numeroDocumento = row.numeroDocumento ?? "";
		this.codigoCliente = row.codigoCliente ?? "";
		this.fechaDesde = row.fechaDesde ?? null;
		this.fechaHasta = row.fechaHasta ?? null;
	}

}
