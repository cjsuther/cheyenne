export default class ClaseElemento {

    id: number;
	codigo: string;
	nombre: string;
	orden: number;
	idTipoTributo: number;

	constructor(
        id: number = 0,
		codigo: string = "",
		nombre: string = "",
		orden: number = 0,
		idTipoTributo: number = 0
	)
	{
        this.id = id;
		this.codigo = codigo;
		this.nombre = nombre;
		this.orden = orden;
		this.idTipoTributo = idTipoTributo;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.codigo = row.codigo ?? "";
		this.nombre = row.nombre ?? "";
		this.orden = row.orden ?? 0;
		this.idTipoTributo = row.idTipoTributo ?? 0;
	}

}
