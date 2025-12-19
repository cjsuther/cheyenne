export default class CuentaContable {

    id: number;
	codigo: string;
	nombre: string;
	orden: number;
	agrupamiento: string;

	constructor(
        id: number = 0,
		codigo: string = "",
		nombre: string = "",
		orden: number = 0,
		agrupamiento: string = ""
	)
	{
        this.id = id;
		this.codigo = codigo;
		this.nombre = nombre;
		this.orden = orden;
		this.agrupamiento = agrupamiento;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.codigo = row.codigo ?? "";
		this.nombre = row.nombre ?? "";
		this.orden = row.orden ?? 0;
		this.agrupamiento = row.agrupamiento ?? "";
	}

}
