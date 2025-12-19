export default class Verificacion {

    id: number;
	idTipoVerificacion: number;
	idEstadoVerificacion: number;
	idUsuario: number;
	codigo: string;
	fechaDesde: Date;
	fechaHasta: Date;
	token: string;
	detalle: string;

	constructor(
        id: number = 0,
		idTipoVerificacion: number = 0,
		idEstadoVerificacion: number = 0,
		idUsuario: number = 0,
		codigo: string = "",
		fechaDesde: Date = null,
		fechaHasta: Date = null,
		token: string = "",
		detalle: string = ""
	)
	{
        this.id = id;
		this.id = id;
		this.idTipoVerificacion = idTipoVerificacion;
		this.idEstadoVerificacion = idEstadoVerificacion;
		this.idUsuario = idUsuario;
		this.codigo = codigo;
		this.fechaDesde = fechaDesde;
		this.fechaHasta = fechaHasta;
		this.token = token;
		this.detalle = detalle;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.id = row.id ?? 0;
		this.idTipoVerificacion = row.idTipoVerificacion ?? 0;
		this.idEstadoVerificacion = row.idEstadoVerificacion ?? 0;
		this.idUsuario = row.idUsuario ?? 0;
		this.codigo = row.codigo ?? "";
		this.fechaDesde = row.fechaDesde ?? null;
		this.fechaHasta = row.fechaHasta ?? null;
		this.token = row.token ?? "";
		this.detalle = row.detalle ?? "";
	}

}
