export default class EmisionCalculo {

    id: number;
	idEmisionDefinicion: number;
	idTipoEmisionCalculo: number;
	codigo: string;
	nombre: string;
	descripcion: string;
	guardaValor: boolean;
	formula: string;
	orden: number;
	soloLectura: boolean;

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
		soloLectura: boolean = false
	)
	{
        this.id = id;
		this.idEmisionDefinicion = idEmisionDefinicion;
		this.idTipoEmisionCalculo = idTipoEmisionCalculo;
		this.codigo = codigo;
		this.nombre = nombre;
		this.descripcion = descripcion;
		this.guardaValor = guardaValor;
		this.formula = formula;
		this.orden = orden;
		this.soloLectura = soloLectura;
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
	}

}
