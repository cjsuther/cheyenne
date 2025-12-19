import EdesurCliente from "../entities/edesur-cliente";

export default class EdesurClienteState extends EdesurCliente {

    state: string;

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
		fechaHasta: Date = null,
		state: string = "o"
	)
	{
        super(id, idEdesur, idPersona, idTipoPersona, nombrePersona, idTipoDocumento, numeroDocumento, codigoCliente, fechaDesde, fechaHasta);
		this.state = state;
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
		this.state = row.state ?? "o";
	}

}
