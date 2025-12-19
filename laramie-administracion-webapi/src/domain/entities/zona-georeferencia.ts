export default class ZonaGeoreferencia {

    id: number;
	codigo: string;
	nombre: string;
	orden: number;
	idLocalidad: number;
	longitud: number;
	latitud: number;

	constructor(
        id: number = 0,
		codigo: string = "",
		nombre: string = "",
		orden: number = 0,
		idLocalidad: number = 0,
		longitud: number = 0,
		latitud: number = 0
	)
	{
        this.id = id;
		this.codigo = codigo;
		this.nombre = nombre;
		this.orden = orden;
		this.idLocalidad = idLocalidad;
		this.longitud = longitud;
		this.latitud = latitud;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.codigo = row.codigo ?? "";
		this.nombre = row.nombre ?? "";
		this.orden = row.orden ?? 0;
		this.idLocalidad = row.idLocalidad ?? 0;
		this.longitud = row.longitud ?? 0;
		this.latitud = row.latitud ?? 0;
	}

}
