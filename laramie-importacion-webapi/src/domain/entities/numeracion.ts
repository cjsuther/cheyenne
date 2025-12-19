export default class Numeracion {

    id: number;
	nombre: string;
	valorProximo: number;

	constructor(
        id: number = 0,
		nombre: string = "",
		valorProximo: number = 0
	)
	{
        this.id = id;
		this.nombre = nombre;
		this.valorProximo = valorProximo;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.nombre = row.nombre ?? "";
		this.valorProximo = row.valorProximo ?? 0;
	}

}
