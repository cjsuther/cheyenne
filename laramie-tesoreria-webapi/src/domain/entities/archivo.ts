export default class Archivo {

    id: number;
	entidad: string;
	idEntidad: number;
	nombre: string;
	path: string;
	descripcion: string;
	idUsuario: number;
	fecha: Date;

	constructor(
        id: number = 0,
		entidad: string = "",
		idEntidad: number = 0,
		nombre: string = "",
		path: string = "",
		descripcion: string = "",
		idUsuario: number = 0,
		fecha: Date = null
	)
	{
        this.id = id;
		this.entidad = entidad;
		this.idEntidad = idEntidad;
		this.nombre = nombre;
		this.path = path;
		this.descripcion = descripcion;
		this.idUsuario = idUsuario;
		this.fecha = fecha;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.entidad = row.entidad ?? "";
		this.idEntidad = row.idEntidad ?? 0;
		this.nombre = row.nombre ?? "";
		this.path = row.path ?? "";
		this.descripcion = row.descripcion ?? "";
		this.idUsuario = row.idUsuario ?? 0;
		this.fecha = row.fecha ?? null;
	}

}
