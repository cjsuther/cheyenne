export default class CategoriaVehiculo {

    id: number;
	codigo: string;
	nombre: string;
	orden: number;
	idIncisoVehiculo: number;
	limiteInferior: number;
	limiteSuperior: number;

	constructor(
        id: number = 0,
		codigo: string = "",
		nombre: string = "",
		orden: number = 0,
		idIncisoVehiculo: number = 0,
		limiteInferior: number = 0,
		limiteSuperior: number = 0
	)
	{
        this.id = id;
		this.codigo = codigo;
		this.nombre = nombre;
		this.orden = orden;
		this.idIncisoVehiculo = idIncisoVehiculo;
		this.limiteInferior = limiteInferior;
		this.limiteSuperior = limiteSuperior;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.codigo = row.codigo ?? "";
		this.nombre = row.nombre ?? "";
		this.orden = row.orden ?? 0;
		this.idIncisoVehiculo = row.idIncisoVehiculo ?? 0;
		this.limiteInferior = row.limiteInferior ?? 0;
		this.limiteSuperior = row.limiteSuperior ?? 0;
	}

}
