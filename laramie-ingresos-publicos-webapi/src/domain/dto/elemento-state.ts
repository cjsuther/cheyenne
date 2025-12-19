import Elemento from "../entities/elemento";

export default class ElementoState extends Elemento {

    state: string;

	constructor(
        id: number = 0,
		idClaseElemento: number = 0,
		idTipoElemento: number = 0,
		idCuenta: number = 0,
		cantidad: number = 0,
		fechaAlta: Date = null,
		fechaBaja: Date = null,
		state: string = "o"
	)
	{
		super(id, idClaseElemento, idTipoElemento, idCuenta, cantidad, fechaAlta,fechaBaja);
		this.state = state;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idClaseElemento = row.idClaseElemento ?? 0;
		this.idTipoElemento = row.idTipoElemento ?? 0;
		this.idCuenta = row.idCuenta ?? 0;
		this.cantidad = row.cantidad ?? 0;
		this.fechaAlta = row.fechaAlta ?? null;
		this.fechaBaja = row.fechaBaja ?? null;
		this.state = row.state ?? "o";
	}

}
