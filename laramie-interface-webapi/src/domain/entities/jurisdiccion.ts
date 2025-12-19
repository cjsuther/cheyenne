export default class Jurisdiccion {

    id: number;
	codigo: string;
	nombre: string;
	orden: number;
	ejercicio: string;
	agrupamiento: string;
	fechaBaja: Date;
	nivel: number;
	tipo: string;
	ejercicioOficina: string;
	oficina: string;

	constructor(
        id: number = 0,
		codigo: string = "",
		nombre: string = "",
		orden: number = 0,
		ejercicio: string = "",
		agrupamiento: string = "",
		fechaBaja: Date = null,
		nivel: number = 0,
		tipo: string = "",
		ejercicioOficina: string = "",
		oficina: string = ""
	)
	{
        this.id = id;
		this.codigo = codigo;
		this.nombre = nombre;
		this.orden = orden;
		this.ejercicio = ejercicio;
		this.agrupamiento = agrupamiento;
		this.fechaBaja = fechaBaja;
		this.nivel = nivel;
		this.tipo = tipo;
		this.ejercicioOficina = ejercicioOficina;
		this.oficina = oficina;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.codigo = row.codigo ?? "";
		this.nombre = row.nombre ?? "";
		this.orden = row.orden ?? 0;
		this.ejercicio = row.ejercicio ?? "";
		this.agrupamiento = row.agrupamiento ?? "";
		this.fechaBaja = row.fechaBaja ?? null;
		this.nivel = row.nivel ?? 0;
		this.tipo = row.tipo ?? "";
		this.ejercicioOficina = row.ejercicioOficina ?? "";
		this.oficina = row.oficina ?? "";
	}

}
