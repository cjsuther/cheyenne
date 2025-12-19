import EmisionConcepto from "../entities/emision-concepto";

export default class EmisionConceptoState extends EmisionConcepto {

    state: string;
	
	constructor(
        id: number = 0,
		idEmisionDefinicion: number = 0,
		idTasa: number = 0,
		idSubTasa: number = 0,
		idTipoMovimiento: number = 0,
		descripcion: string = "",
		formulaCondicion: string = "",
		formulaImporteTotal: string = "",
		formulaImporteNeto: string = "",
		vencimiento: number = 0,
		orden: number = 0,
		soloLectura: boolean = false,
		state: string = "o"
	)
	{
		super(id, idEmisionDefinicion, idTasa, idSubTasa, idTipoMovimiento, descripcion, formulaCondicion, formulaImporteTotal, formulaImporteNeto, vencimiento, orden, soloLectura);
		this.state = state;
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
		this.formulaImporteTotal = row.formulaImporteTotal ?? "";
		this.formulaImporteNeto = row.formulaImporteNeto ?? "";
		this.vencimiento = row.vencimiento ?? 0;
		this.orden = row.orden ?? 0;
		this.soloLectura = row.soloLectura ?? false;
		this.state = row.state ?? "o";
	}

}
