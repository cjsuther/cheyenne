export default class UbicacionComercio {

    id: number;
	codigo: string;
	nombre: string;
	orden: number;
	coeficiente: number;

	constructor(
        id: number = 0,
		codigo: string = "",
		nombre: string = "",
		orden: number = 0,
		coeficiente: number = 0
	)
	{
        this.id = id;
		this.codigo = codigo;
		this.nombre = nombre;
		this.orden = orden;
		this.coeficiente = coeficiente;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.codigo = row.codigo ?? "";
		this.nombre = row.nombre ?? "";
		this.orden = row.orden ?? 0;
		this.coeficiente = row.coeficiente ?? 0;
	}

}
