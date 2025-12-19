export default class Variable {

    id: number;
	codigo: string;
	descripcion: string;
	idTipoTributo: number;
	tipoDato: string;
	constante: boolean;
	predefinido: boolean;
	opcional: boolean;
	activo: boolean;
	global: boolean;

	constructor(
        id: number = 0,
		codigo: string = "",
		descripcion: string = "",
		idTipoTributo: number = 0,
		tipoDato: string = "",
		constante: boolean = false,
		predefinido: boolean = false,
		opcional: boolean = false,
		activo: boolean = false,
		global: boolean = false
	)
	{
        this.id = id;
		this.codigo = codigo;
		this.descripcion = descripcion;
		this.idTipoTributo = idTipoTributo;
		this.tipoDato = tipoDato;
		this.constante = constante;
		this.predefinido = predefinido;
		this.opcional = opcional;
		this.activo = activo;
		this.global = global;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.codigo = row.codigo ?? "";
		this.descripcion = row.descripcion ?? "";
		this.idTipoTributo = row.idTipoTributo ?? 0;
		this.tipoDato = row.tipoDato ?? "";
		this.constante = row.constante ?? false;
		this.predefinido = row.predefinido ?? false;
		this.opcional = row.opcional ?? false;
		this.activo = row.activo ?? false;
		this.global = row.global ?? false;
	}

}
