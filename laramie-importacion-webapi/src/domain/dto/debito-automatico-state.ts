import DebitoAutomatico from "../entities/debito-automatico";

export default class DebitoAutomaticoState extends DebitoAutomatico {

    state: string;

	constructor(
        id: number = 0,
		idCuenta: number = 0,
		idTasa: number = 0,
		idSubTasa: number = 0,
		idRubro: number = 0,
		idTipoSolicitudDebitoAutomatico: number = 0,
		numeroSolicitudDebitoAutomatico: string = "",
		idMedioPago: number = 0,
		detalleMedioPago: string = "",
		fechaDesde: Date = null,
		fechaAlta: Date = null,
		fechaBaja: Date = null,
		idEntidadRecaudadora: number = 0,
		state: string = "o"
	)
	{
        super(
			id,
			idCuenta,
			idTasa,
			idSubTasa,
			idRubro,
            idTipoSolicitudDebitoAutomatico,
            numeroSolicitudDebitoAutomatico,
            idMedioPago,
			detalleMedioPago,
			fechaDesde,
			fechaAlta,
			fechaBaja,
			idEntidadRecaudadora
		);
		this.state = state;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idCuenta = row.idCuenta ?? 0;
		this.idTasa = row.idTasa ?? 0;
		this.idSubTasa = row.idSubTasa ?? 0;
		this.idRubro = row.idRubro ?? 0;
		this.idTipoSolicitudDebitoAutomatico = row.idTipoSolicitudDebitoAutomatico ?? 0;
		this.numeroSolicitudDebitoAutomatico = row.numeroSolicitudDebitoAutomatico ?? "";
		this.idMedioPago = row.idMedioPago ?? 0;
		this.detalleMedioPago = row.detalleMedioPago ?? "";
		this.fechaDesde = row.fechaDesde ?? null;
		this.fechaAlta = row.fechaAlta ?? null;
		this.fechaBaja = row.fechaBaja ?? null;
		this.idEntidadRecaudadora = row.idEntidadRecaudadora ?? 0;
		this.state = row.state ?? "o";
	}

}