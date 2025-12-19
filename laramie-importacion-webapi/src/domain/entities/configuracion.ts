export default class Configuracion {

    id: number;
	nombre: string;
	valor: string;

	constructor(
        id: number = 0,
		nombre: string = "",
		valor: string = ""
	)
	{
        this.id = id;
		this.nombre = nombre;
		this.valor = valor;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.nombre = row.nombre ?? "";
		this.valor = row.valor ?? "";
	}

}
