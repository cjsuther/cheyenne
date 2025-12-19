import VinculoVehiculo from "../entities/vinculo-vehiculo";

export default class VinculoVehiculoState extends VinculoVehiculo {

    state: string;

	constructor(
        id: number = 0,
		idVehiculo: number = 0,
		idTipoVinculoVehiculo: number = 0,
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
        super(id, idVehiculo, idTipoVinculoVehiculo,
			  idPersona, idTipoPersona, idTipoDocumento, numeroDocumento, nombrePersona,
			  idTipoInstrumento, fechaInstrumentoDesde, fechaInstrumentoHasta, porcentajeCondominio);
		this.state = state;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idVehiculo = row.idVehiculo ?? 0;
		this.idTipoVinculoVehiculo = row.idTipoVinculoVehiculo ?? 0;
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
