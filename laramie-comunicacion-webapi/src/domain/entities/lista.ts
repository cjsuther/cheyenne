export default class Lista {

    id: number;
	codigo: string;
	tipo: string;
	nombre: string;
	orden: number;

	constructor(
        id: number = 0,
		codigo: string = "",
		tipo: string = "",
		nombre: string = "",
		orden: number = 0
	)
	{
        this.id = id;
		this.codigo = codigo;
		this.tipo = tipo;
		this.nombre = nombre;
		this.orden = orden;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.codigo = row.codigo ?? "";
		this.tipo = row.tipo ?? "";
		this.nombre = row.nombre ?? "";
		this.orden = row.orden ?? 0;
	}

}
