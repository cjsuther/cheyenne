export default class TemaExpediente {

    id: number;
	codigo: string;
	nombre: string;
	orden: number;
	ejercicioOficina: number;
	oficina: number;
	detalle: string;
	plazo: number;
	fechaAlta: Date;
	fechaBaja: Date;

	constructor(
        id: number = 0,
		codigo: string = "",
		nombre: string = "",
		orden: number = 0,
		ejercicioOficina: number = 0,
		oficina: number = 0,
		detalle: string = "",
		plazo: number = 0,
		fechaAlta: Date = null,
		fechaBaja: Date = null
	)
	{
        this.id = id;
		this.codigo = codigo;
		this.nombre = nombre;
		this.orden = orden;
		this.ejercicioOficina = ejercicioOficina;
		this.oficina = oficina;
		this.detalle = detalle;
		this.plazo = plazo;
		this.fechaAlta = fechaAlta;
		this.fechaBaja = fechaBaja;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.codigo = row.codigo ?? "";
		this.nombre = row.nombre ?? "";
		this.orden = row.orden ?? 0;
		this.ejercicioOficina = row.ejercicioOficina ?? 0;
		this.oficina = row.oficina ?? 0;
		this.detalle = row.detalle ?? "";
		this.plazo = row.plazo ?? 0;
		this.fechaAlta = row.fechaAlta ?? null;
		this.fechaBaja = row.fechaBaja ?? null;
	}

}
