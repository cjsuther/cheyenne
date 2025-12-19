import EmisionCuentaCorriente from "../entities/emision-cuenta-corriente";

export default class EmisionCuentaCorrienteState extends EmisionCuentaCorriente {

    state: string;

	constructor(
        id: number = 0,
		idEmisionDefinicion: number = 0,
		idTasa: number = 0,
		idSubTasa: number = 0,
		idTipoMovimiento: number = 0,
		tasaCabecera: boolean = false,
		descripcion: string = "",
		formulaCondicion: string = "",
		formulaDebe: string = "",
		formulaHaber: string = "",
		vencimiento: number = 0,
		orden: number = 0,
		soloLectura: boolean = false,
		state: string = "o"
	)
	{
        super(id, idEmisionDefinicion, idTasa, idSubTasa, idTipoMovimiento, tasaCabecera, descripcion, formulaCondicion, formulaDebe, formulaHaber, vencimiento, orden, soloLectura);
		this.state = state;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idEmisionDefinicion = row.idEmisionDefinicion ?? 0;
		this.idTasa = row.idTasa ?? 0;
		this.idSubTasa = row.idSubTasa ?? 0;
		this.idTipoMovimiento = row.idTipoMovimiento ?? 0;
		this.tasaCabecera = row.tasaCabecera ?? false;
		this.descripcion = row.descripcion ?? "";
		this.formulaCondicion = row.formulaCondicion ?? "";
		this.formulaDebe = row.formulaDebe ?? "";
		this.formulaHaber = row.formulaHaber ?? "";
		this.vencimiento = row.vencimiento ?? 0;
		this.orden = row.orden ?? 0;
		this.soloLectura = row.soloLectura ?? false;
		this.state = row.state ?? "o";
	}

}
