export default class IncisoVehiculo {

    id: number;
	codigo: string;
	nombre: string;
	orden: number;
	vehiculoMenor: boolean;
	codigoSucerp: string;

	constructor(
        id: number = 0,
		codigo: string = "",
		nombre: string = "",
		orden: number = 0,
		vehiculoMenor: boolean = false,
		codigoSucerp: string = "",
	)
	{
        this.id = id;
		this.codigo = codigo;
		this.nombre = nombre;
		this.orden = orden;
		this.vehiculoMenor = vehiculoMenor;
		this.codigoSucerp = codigoSucerp;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.codigo = row.codigo ?? "";
		this.nombre = row.nombre ?? "";
		this.orden = row.orden ?? 0;
		this.vehiculoMenor = row.vehiculoMenor ?? false;
		this.codigoSucerp = row.codigoSucerp ?? false;
	}

}
