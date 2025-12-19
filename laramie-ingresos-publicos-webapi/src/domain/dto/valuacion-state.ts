import Valuacion from "../entities/valuacion";

export default class ValuacionState extends Valuacion {

    state: string;

	constructor(
        id: number = 0,
		idInmueble: number = 0,
		idTipoValuacion: number = 0,
		ejercicio: string = "",
		mes: number = 0,
		valor: number = 0,
		state: string = "o"
	)
	{
        super(id, idInmueble, idTipoValuacion, ejercicio, mes, valor);
		this.state = state;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idInmueble = row.idInmueble ?? 0;
		this.idTipoValuacion = row.idTipoValuacion ?? 0;
		this.ejercicio = row.ejercicio ?? "";
		this.mes = row.mes ?? 0;
		this.valor = row.valor ?? 0;
		this.state = row.state ?? "o";
	}

}
