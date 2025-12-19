export default class RubroLiquidacion {

    id: number;
	codigo: string;
	nombre: string;
	orden: number;
	numera: boolean;
	numero: number;
	reliquida: boolean;

	constructor(
        id: number = 0,
		codigo: string = "",
		nombre: string = "",
		orden: number = 0,
		numera: boolean = false,
		numero: number = 0,
		reliquida: boolean = false
	)
	{
        this.id = id;
		this.codigo = codigo;
		this.nombre = nombre;
		this.orden = orden;
		this.numera = numera;
		this.numero = numero;
		this.reliquida = reliquida;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.codigo = row.codigo ?? "";
		this.nombre = row.nombre ?? "";
		this.orden = row.orden ?? 0;
		this.numera = row.numera ?? false;
		this.numero = row.numero ?? 0;
		this.reliquida = row.reliquida ?? false;
	}

}
