export default class MotivoBajaComercio {

    id: number;
	codigo: string;
	nombre: string;
	orden: number;
	bajaConDeuda: boolean;
	bajaCancelaDeuda: boolean;

	constructor(
        id: number = 0,
		codigo: string = "",
		nombre: string = "",
		orden: number = 0,
		bajaConDeuda: boolean = false,
		bajaCancelaDeuda: boolean = false
	)
	{
        this.id = id;
		this.codigo = codigo;
		this.nombre = nombre;
		this.orden = orden;
		this.bajaConDeuda = bajaConDeuda;
		this.bajaCancelaDeuda = bajaCancelaDeuda;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.codigo = row.codigo ?? "";
		this.nombre = row.nombre ?? "";
		this.orden = row.orden ?? 0;
		this.bajaConDeuda = row.bajaConDeuda ?? false;
		this.bajaCancelaDeuda = row.bajaCancelaDeuda ?? false;
	}

}
