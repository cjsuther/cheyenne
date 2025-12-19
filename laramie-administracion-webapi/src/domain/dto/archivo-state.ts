import Archivo from "../entities/archivo";

export default class ArchivoState extends Archivo {

    state: string;

	constructor(
        id: number = 0,
		entidad: string = "",
		idEntidad: number = 0,
		nombre: string = "",
		path: string = "",
		descripcion: string = "",
		idUsuario: number = 0,
		fecha: Date = null,
		state: string = "o"
	)
	{
        super(id, entidad, idEntidad, nombre, path, descripcion, idUsuario, fecha);
		this.state = state;
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
		this.state = row.state ?? "o";
	}

}
