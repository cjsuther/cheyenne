export default class VinculoCuenta {

    id: number;
	idTipoTributo: number;
	idTributo: number;
	idTipoVinculoCuenta: number;
	idPersona: number;
	idTipoPersona: number;
	idTipoDocumento: number;
	numeroDocumento: string;
	nombrePersona: string;
	idTipoInstrumento: number;
	fechaInstrumentoDesde: Date;
	fechaInstrumentoHasta: Date;
	porcentajeCondominio: number;

	constructor(
        id: number = 0,
		idTipoTributo: number = 0,
		idTributo: number = 0,
		idTipoVinculoCuenta: number = 0,
		idPersona: number = 0,
		idTipoPersona: number = 0,
		idTipoDocumento: number = 0,
		numeroDocumento: string = "",
		nombrePersona: string = "",
		idTipoInstrumento: number = 0,
		fechaInstrumentoDesde: Date = null,
		fechaInstrumentoHasta: Date = null,
		porcentajeCondominio: number = 0
	)
	{
        this.id = id;
		this.idTipoTributo = idTipoTributo;
		this.idTributo = idTributo;
		this.idTipoVinculoCuenta = idTipoVinculoCuenta;
		this.idPersona = idPersona;
		this.idTipoPersona = idTipoPersona;
		this.idTipoDocumento = idTipoDocumento;
		this.numeroDocumento = numeroDocumento;
		this.nombrePersona = nombrePersona;
		this.idTipoInstrumento = idTipoInstrumento;
		this.fechaInstrumentoDesde = fechaInstrumentoDesde;
		this.fechaInstrumentoHasta = fechaInstrumentoHasta;
		this.porcentajeCondominio = porcentajeCondominio;
	}

}
