export default class Jurisdiccion {

    id: number;
	codigo: string;
	nombre: string;
	orden: number;
	ejercicio: string;
	agrupamiento: string;
	fecha: Date;
	nivel: number;
	tipo: string;

	constructor(
        id: number = 0,
		codigo: string = "",
		nombre: string = "",
		orden: number = 0,
		ejercicio: string = "",
		agrupamiento: string = "",
		fecha: Date = null,
		nivel: number = 0,
		tipo: string = ""
	)
	{
        this.id = id;
		this.codigo = codigo;
		this.nombre = nombre;
		this.orden = orden;
		this.ejercicio = ejercicio;
		this.agrupamiento = agrupamiento;
		this.fecha = fecha;
		this.nivel = nivel;
		this.tipo = tipo;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.codigo = row.codigo ?? "";
		this.nombre = row.nombre ?? "";
		this.orden = row.orden ?? 0;
		this.ejercicio = row.ejercicio ?? "";
		this.agrupamiento = row.agrupamiento ?? "";
		this.fecha = row.fecha ?? null;
		this.nivel = row.nivel ?? 0;
		this.tipo = row.tipo ?? "";
	}

}
