export default class TipoElemento {

    id: number;
	codigo: string;
	nombre: string;
	orden: number;
	idClaseElemento: number;
	idUnidadMedida: number;
	valor: number;

	constructor(
        id: number = 0,
		codigo: string = "",
		nombre: string = "",
		orden: number = 0,
		idClaseElemento: number = 0,
		idUnidadMedida: number = 0,
		valor: number = 0
	)
	{
        this.id = id;
		this.codigo = codigo;
		this.nombre = nombre;
		this.orden = orden;
		this.idClaseElemento = idClaseElemento;
		this.idUnidadMedida = idUnidadMedida;
		this.valor = valor;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.codigo = row.codigo ?? "";
		this.nombre = row.nombre ?? "";
		this.orden = row.orden ?? 0;
		this.idClaseElemento = row.idClaseElemento ?? 0;
		this.idUnidadMedida = row.idUnidadMedida ?? 0;
		this.valor = row.valor ?? 0;
	}

}
