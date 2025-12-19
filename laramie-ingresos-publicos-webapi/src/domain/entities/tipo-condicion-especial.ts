export default class TipoCondicionEspecial {

    id: number;
	codigo: string;
	nombre: string;
	orden: number;
	idTipoTributo: number;
	tipo: string;
	color: string;
	inhibicion: boolean;

	constructor(
        id: number = 0,
		codigo: string = "",
		nombre: string = "",
		orden: number = 0,
		idTipoTributo: number = 0,
		tipo: string = "",
		color: string = "",
		inhibicion: boolean = false
	)
	{
        this.id = id;
		this.codigo = codigo;
		this.nombre = nombre;
		this.orden = orden;
		this.idTipoTributo = idTipoTributo;
		this.tipo = tipo;
		this.color = color;
		this.inhibicion = inhibicion;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.codigo = row.codigo ?? "";
		this.nombre = row.nombre ?? "";
		this.orden = row.orden ?? 0;
		this.idTipoTributo = row.idTipoTributo ?? 0;
		this.tipo = row.tipo ?? "";
		this.color = row.color ?? "";
		this.inhibicion = row.inhibicion ?? false;
	}

}
