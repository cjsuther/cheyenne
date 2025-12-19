export default class ModeloDeclaracionJurada {

    id: number;
	codigo: string;
	nombre: string;

	constructor(
        id: number = 0,
		codigo: string = "",
		nombre: string = ""
	)
	{
        this.id = id;
		this.codigo = codigo;
		this.nombre = nombre;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.codigo = row.codigo ?? "";
		this.nombre = row.nombre ?? "";
	}

}
