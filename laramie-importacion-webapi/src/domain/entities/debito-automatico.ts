export default class DebitoAutomatico {

    id: number;
	idCuenta: number;
	idTasa: number;
	idSubTasa: number;
	idRubro: number;
	idTipoSolicitudDebitoAutomatico: number;
	numeroSolicitudDebitoAutomatico: string;
	idMedioPago: number;
	detalleMedioPago: string;
	fechaDesde: Date;
	fechaAlta: Date;
	fechaBaja: Date;
	idEntidadRecaudadora: number;

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
	)
	{
        this.id = id;
		this.idCuenta = idCuenta;
		this.idTasa = idTasa;
		this.idSubTasa = idSubTasa;
		this.idRubro = idRubro;
		this.idTipoSolicitudDebitoAutomatico = idTipoSolicitudDebitoAutomatico;
		this.numeroSolicitudDebitoAutomatico = numeroSolicitudDebitoAutomatico;
		this.idMedioPago = idMedioPago;
		this.detalleMedioPago= detalleMedioPago;
		this.fechaDesde = fechaDesde;
		this.fechaAlta = fechaAlta;
		this.fechaBaja = fechaBaja;
		this.idEntidadRecaudadora = idEntidadRecaudadora;
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
	}

}
