import EmisionCalculo from "../entities/emision-calculo";

export default class EmisionCalculoState extends EmisionCalculo {

    state: string;

	constructor(
        id: number = 0,
		idEmisionDefinicion: number = 0,
		idTipoEmisionCalculo: number = 0,
		codigo: string = "",
		nombre: string = "",
		descripcion: string = "",
		guardaValor: boolean = false,
		formula: string = "",
		orden: number = 0,
		soloLectura: boolean = false,
		state: string = "o"
	)
	{
        super(id, idEmisionDefinicion, idTipoEmisionCalculo, codigo, nombre, descripcion, guardaValor, formula, orden, soloLectura);
		this.state = state;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idEmisionDefinicion = row.idEmisionDefinicion ?? 0;
		this.idTipoEmisionCalculo = row.idTipoEmisionCalculo ?? 0;
		this.codigo = row.codigo ?? "";
		this.nombre = row.nombre ?? "";
		this.descripcion = row.descripcion ?? "";
		this.guardaValor = row.guardaValor ?? false;
		this.formula = row.formula ?? "";
		this.orden = row.orden ?? 0;
		this.soloLectura = row.soloLectura ?? false;
		this.state = row.state ?? "o";
	}

}
