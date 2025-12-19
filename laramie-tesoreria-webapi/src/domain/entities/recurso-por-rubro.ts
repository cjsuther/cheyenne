export default class RecursoPorRubro {

    id: number;
	codigo: string;
	nombre: string;
	orden: number;
	presupuesto: string;
	agrupamiento: string;
	procedencia: string;
	caracterEconomico: string;
	nivel: number;
	fechaBaja: Date;
	ejercicio: string;
	detalle: string;


	constructor(
        id: number = 0,
		codigo: string = "",
		nombre: string = "",
		orden: number = 0,
		presupuesto: string = "",
		agrupamiento: string = "",
		procedencia: string = "",
		caracterEconomico: string = "",
		nivel: number = 0,
		fechaBaja: Date = null,
		ejercicio: string = "",
		detalle: string = ""
	)
	{
        this.id = id;
		this.codigo = codigo;
		this.nombre = nombre;
		this.orden = orden;
		this.presupuesto = presupuesto;
		this.agrupamiento = agrupamiento;
		this.procedencia = procedencia;
		this.caracterEconomico = caracterEconomico;
		this.nivel = nivel;
		this.fechaBaja = fechaBaja;
		this.ejercicio = ejercicio;
		this.detalle = detalle;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.codigo = row.codigo ?? "";
		this.nombre = row.nombre ?? "";
		this.orden = row.orden ?? 0;
		this.presupuesto = row.presupuesto ?? "";
		this.agrupamiento = row.agrupamiento ?? "";
		this.procedencia = row.procedencia ?? "";
		this.caracterEconomico = row.caracterEconomico ?? "";
		this.nivel = row.nivel ?? 0;
		this.fechaBaja = row.fechaBaja ?? null;
		this.ejercicio = row.ejercicio ?? "";
		this.detalle = row.detalle ?? "";
	}

}
