export default class TipoRecargoDescuento {

    id: number;
	codigo: string;
	nombre: string;
	orden: number;
	tipo: number;
	idTipoTributo: number;
	porcentaje: number;
	importe: number;
	emiteSolicitud: boolean;
	requiereOtrogamiento: boolean;
	fechaDesde: Date;
	fechaHasta: Date;
	procedimiento: string;

	constructor(
        id: number = 0,
		codigo: string = "",
		nombre: string = "",
		orden: number = 0,
		tipo: number = 0,
		idTipoTributo: number = 0,
		porcentaje: number = 0,
		importe: number = 0,
		emiteSolicitud: boolean = false,
		requiereOtrogamiento: boolean = false,
		fechaDesde: Date = null,
		fechaHasta: Date = null,
		procedimiento: string = ""
	)
	{
        this.id = id;
		this.codigo = codigo;
		this.nombre = nombre;
		this.orden = orden;
		this.tipo = tipo;
		this.idTipoTributo = idTipoTributo;
		this.porcentaje = porcentaje;
		this.importe = importe;
		this.emiteSolicitud = emiteSolicitud;
		this.requiereOtrogamiento = requiereOtrogamiento;
		this.fechaDesde = fechaDesde;
		this.fechaHasta = fechaHasta;
		this.procedimiento = procedimiento;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.codigo = row.codigo ?? "";
		this.nombre = row.nombre ?? "";
		this.orden = row.orden ?? 0;
		this.tipo = row.tipo ?? 0;
		this.idTipoTributo = row.idTipoTributo ?? 0;
		this.porcentaje = row.porcentaje ?? 0;
		this.importe = row.importe ?? 0;
		this.emiteSolicitud = row.emiteSolicitud ?? false;
		this.requiereOtrogamiento = row.requiereOtrogamiento ?? false;
		this.fechaDesde = row.fechaDesde ?? null;
		this.fechaHasta = row.fechaHasta ?? null;
		this.procedimiento = row.procedimiento ?? "";
	}

}
