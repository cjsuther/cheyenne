export default class EmisionImputacionContable {

    id: number;
	idEmisionDefinicion: number;
	idTasa: number;
	idSubTasa: number;
	idTipoMovimiento: number;
	descripcion: string;
	formulaCondicion: string;
	formulaPorcentaje: string;
	idTasaPorcentaje: number;
	idSubTasaPorcentaje: number;
	orden: number;
	soloLectura: boolean;

	constructor(
        id: number = 0,
		idEmisionDefinicion: number = 0,
		idTasa: number = 0,
		idSubTasa: number = 0,
		idTipoMovimiento: number = 0,
		descripcion: string = "",
		formulaCondicion: string = "",
		formulaPorcentaje: string = "",
		idTasaPorcentaje: number = 0,
		idSubTasaPorcentaje: number = 0,
		orden: number = 0,
		soloLectura: boolean = false
	)
	{
        this.id = id;
		this.idEmisionDefinicion = idEmisionDefinicion;
		this.idTasa = idTasa;
		this.idSubTasa = idSubTasa;
		this.idTipoMovimiento = idTipoMovimiento;
		this.descripcion = descripcion;
		this.formulaCondicion = formulaCondicion;
		this.formulaPorcentaje = formulaPorcentaje;
		this.idTasaPorcentaje = idTasaPorcentaje;
		this.idSubTasaPorcentaje = idSubTasaPorcentaje;
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
		this.descripcion = row.descripcion ?? "";
		this.formulaCondicion = row.formulaCondicion ?? "";
		this.formulaPorcentaje = row.formulaPorcentaje ?? "";
		this.idTasaPorcentaje = row.idTasaPorcentaje ?? 0;
		this.idSubTasaPorcentaje = row.idSubTasaPorcentaje ?? 0;
		this.orden = row.orden ?? 0;
		this.soloLectura = row.soloLectura ?? false;
	}

}
