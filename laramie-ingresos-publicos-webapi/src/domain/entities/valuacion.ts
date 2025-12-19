export default class Valuacion {

    id: number;
	idInmueble: number;
	idTipoValuacion: number;
	ejercicio: string;
	mes: number;
	valor: number;

	constructor(
        id: number = 0,
		idInmueble: number = 0,
		idTipoValuacion: number = 0,
		ejercicio: string = "",
		mes: number = 0,
		valor: number = 0
	)
	{
        this.id = id;
		this.idInmueble = idInmueble;
		this.idTipoValuacion = idTipoValuacion;
		this.ejercicio = ejercicio;
		this.mes = mes;
		this.valor = valor;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idInmueble = row.idInmueble ?? 0;
		this.idTipoValuacion = row.idTipoValuacion ?? 0;
		this.ejercicio = row.ejercicio ?? "";
		this.mes = row.mes ?? 0;
		this.valor = row.valor ?? 0;
	}

}
