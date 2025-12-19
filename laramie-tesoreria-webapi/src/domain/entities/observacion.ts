export default class Observacion {

    id: number;
	entidad: string;
	idEntidad: number;
	detalle: string;
	idUsuario: number;
	fecha: Date;

	constructor(
        id: number = 0,
		entidad: string = "",
		idEntidad: number = 0,
		detalle: string = "",
		idUsuario: number = 0,
		fecha: Date = null
	)
	{
        this.id = id;
		this.entidad = entidad;
		this.idEntidad = idEntidad;
		this.detalle = detalle;
		this.idUsuario = idUsuario;
		this.fecha = fecha;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.entidad = row.entidad ?? "";
		this.idEntidad = row.idEntidad ?? 0;
		this.detalle = row.detalle ?? "";
		this.idUsuario = row.idUsuario ?? 0;
		this.fecha = row.fecha ?? null;
	}

}
