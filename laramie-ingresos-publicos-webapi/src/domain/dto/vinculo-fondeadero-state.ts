import VinculoFondeadero from "../entities/vinculo-fondeadero";

export default class VinculoFondeaderoState extends VinculoFondeadero {

    state: string;

	constructor(
        id: number = 0,
		idFondeadero: number = 0,
		idTipoVinculoFondeadero: number = 0,
		idPersona: number = 0,
		idTipoPersona: number = 0,
		idTipoDocumento: number = 0,
		numeroDocumento: string = "",
		nombrePersona: string = "",
		idTipoInstrumento: number = 0,
		fechaInstrumentoDesde: Date = null,
		fechaInstrumentoHasta: Date = null,
		porcentajeCondominio: number = 0,
		state: string = "o"
	)
	{
        super(id, idFondeadero, idTipoVinculoFondeadero,
			  idPersona, idTipoPersona, idTipoDocumento, numeroDocumento, nombrePersona,
			  idTipoInstrumento, fechaInstrumentoDesde, fechaInstrumentoHasta, porcentajeCondominio);
		this.state = state;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idFondeadero = row.idFondeadero ?? 0;
		this.idTipoVinculoFondeadero = row.idTipoVinculoFondeadero ?? 0;
		this.idPersona = row.idPersona ?? 0;
		this.idTipoPersona = row.idTipoPersona ?? 0;
		this.idPersona = row.idPersona ?? 0;
		this.idTipoDocumento = row.idTipoDocumento ?? 0;
		this.numeroDocumento = row.numeroDocumento ?? "";
		this.nombrePersona = row.nombrePersona ?? "";
		this.idTipoInstrumento = row.idTipoInstrumento ?? 0;
		this.fechaInstrumentoDesde = row.fechaInstrumentoDesde ?? null;
		this.fechaInstrumentoHasta = row.fechaInstrumentoHasta ?? null;
		this.porcentajeCondominio = row.porcentajeCondominio ?? 0;
		this.state = row.state ?? "o";
	}

}
