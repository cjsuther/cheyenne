export default class ObjetoCertificado {

    id: number;
	codigo: string;
	nombre: string;
	orden: number;
	actualizaPropietario: boolean;

	constructor(
        id: number = 0,
		codigo: string = "",
		nombre: string = "",
		orden: number = 0,
		actualizaPropietario: boolean = false
	)
	{
        this.id = id;
		this.codigo = codigo;
		this.nombre = nombre;
		this.orden = orden;
		this.actualizaPropietario = actualizaPropietario;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.codigo = row.codigo ?? "";
		this.nombre = row.nombre ?? "";
		this.orden = row.orden ?? 0;
		this.actualizaPropietario = row.actualizaPropietario ?? false;
	}

}
