export default class Filtro {

    id: number;
	codigo: string;
	nombre: string;
	orden: number;
	idTipoTributo: number;
	ejecucion: string;

	constructor(
        id: number = 0,
		codigo: string = "",
		nombre: string = "",
		orden: number = 0,
		idTipoTributo: number = 0,
		ejecucion: string = ""
	)
	{
        this.id = id;
		this.codigo = codigo;
		this.nombre = nombre;
		this.orden = orden;
		this.idTipoTributo = idTipoTributo;
		this.ejecucion = ejecucion;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.codigo = row.codigo ?? "";
		this.nombre = row.nombre ?? "";
		this.orden = row.orden ?? 0;
		this.idTipoTributo = row.idTipoTributo ?? 0;
		this.ejecucion = row.ejecucion ?? "";
	}

}
