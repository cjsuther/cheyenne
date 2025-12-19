export default class TipoAnuncio {

    id: number;
	codigo: string;
	nombre: string;
	orden: number;
	porcentaje: number;
	importe: number;

	constructor(
        id: number = 0,
		codigo: string = "",
		nombre: string = "",
		orden: number = 0,
		porcentaje: number = 0,
		importe: number = 0
	)
	{
        this.id = id;
		this.codigo = codigo;
		this.nombre = nombre;
		this.orden = orden;
		this.porcentaje = porcentaje;
		this.importe = importe;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.codigo = row.codigo ?? "";
		this.nombre = row.nombre ?? "";
		this.orden = row.orden ?? 0;
		this.porcentaje = row.porcentaje ?? 0;
		this.importe = row.importe ?? 0;
	}

}
