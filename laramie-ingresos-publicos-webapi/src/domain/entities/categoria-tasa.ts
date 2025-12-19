export default class CategoriaTasa {

    id: number;
	codigo: string;
	nombre: string;
	orden: number;
	esPlan: boolean;
	esDerechoEspontaneo: boolean;

	constructor(
        id: number = 0,
		codigo: string = "",
		nombre: string = "",
		orden: number = 0,
		esPlan: boolean = false,
		esDerechoEspontaneo: boolean = false
	)
	{
        this.id = id;
		this.codigo = codigo;
		this.nombre = nombre;
		this.orden = orden;
		this.esPlan = esPlan;
		this.esDerechoEspontaneo = esDerechoEspontaneo;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.codigo = row.codigo ?? "";
		this.nombre = row.nombre ?? "";
		this.orden = row.orden ?? 0;
		this.esPlan = row.esPlan ?? false;
		this.esDerechoEspontaneo = row.esDerechoEspontaneo ?? false;
	}

}
