export default class TipoSuperficie {

    id: number;
	codigo: string;
	nombre: string;
	orden: number;
	clase: number;
	suma: string;
	adicionales: boolean;

	constructor(
        id: number = 0,
		codigo: string = "",
		nombre: string = "",
		orden: number = 0,
		clase: number = 0,
		suma: string = "",
		adicionales: boolean = false
	)
	{
        this.id = id;
		this.codigo = codigo;
		this.nombre = nombre;
		this.orden = orden;
		this.clase = clase;
		this.suma = suma;
		this.adicionales = adicionales;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.codigo = row.codigo ?? "";
		this.nombre = row.nombre ?? "";
		this.orden = row.orden ?? 0;
		this.clase = row.clase ?? 0;
		this.suma = row.suma ?? "";
		this.adicionales = row.adicionales ?? false;
	}

}
