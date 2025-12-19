export default class EmisionCuentaCorriente {

    id: number;
	idEmisionDefinicion: number;
	idTasa: number;
	idSubTasa: number;
	idTipoMovimiento: number;
	tasaCabecera: boolean;
	descripcion: string;
	formulaCondicion: string;
	formulaDebe: string;
	formulaHaber: string;
	vencimiento: number;
	orden: number;
	soloLectura: boolean;

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
		soloLectura: boolean = false
	)
	{
        this.id = id;
		this.idEmisionDefinicion = idEmisionDefinicion;
		this.idTasa = idTasa;
		this.idSubTasa = idSubTasa;
		this.idTipoMovimiento = idTipoMovimiento;
		this.tasaCabecera = tasaCabecera;
		this.descripcion = descripcion;
		this.formulaCondicion = formulaCondicion;
		this.formulaDebe = formulaDebe;
		this.formulaHaber = formulaHaber;
		this.vencimiento = vencimiento;
		this.orden = orden;
		this.soloLectura = soloLectura;
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
	}

}
