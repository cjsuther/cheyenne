export default class Localidad {

    id: number;
	codigo: string;
	nombre: string;
	orden: number;
	idProvincia: number;

	constructor(
        id: number = 0,
		codigo: string = "",
		nombre: string = "",
		orden: number = 0,
		idProvincia: number = 0
	)
	{
        this.id = id;
		this.codigo = codigo;
		this.nombre = nombre;
		this.orden = orden;
		this.idProvincia = idProvincia;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.codigo = row.codigo ?? "";
		this.nombre = row.nombre ?? "";
		this.orden = row.orden ?? 0;
		this.idProvincia = row.idProvincia ?? 0;
	}

}
