export default class PlantillaDocumento {

    id: number;
	idTipoPlantillaDocumento: number;
	descripcion: string;
	nombre: string;
	path: string;
	idUsuario: number;
	fecha: Date;

	constructor(
        id: number = 0,
		idTipoPlantillaDocumento: number = 0,
		descripcion: string = "",
		nombre: string = "",
		path: string = "",
		idUsuario: number = 0,
		fecha: Date = null
	)
	{
        this.id = id;
		this.idTipoPlantillaDocumento = idTipoPlantillaDocumento;
		this.descripcion = descripcion;
		this.nombre = nombre;
		this.path = path;
		this.idUsuario = idUsuario;
		this.fecha = fecha;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idTipoPlantillaDocumento = row.idTipoPlantillaDocumento ?? 0;
		this.descripcion = row.descripcion ?? "";
		this.nombre = row.nombre ?? "";
		this.path = row.path ?? "";
		this.idUsuario = row.idUsuario ?? 0;
		this.fecha = row.fecha ?? null;
	}

}
