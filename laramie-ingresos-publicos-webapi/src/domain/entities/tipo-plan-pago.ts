export default class TipoPlanPago {

    id: number;
	codigo: string;
	nombre: string;
	idTipoTributo: number;
	convenio: string;
	condiciones: string;

	constructor(
        id: number = 0,
		codigo: string = "",
		nombre: string = "",
		idTipoTributo: number = 0,
		convenio: string = "",
		condiciones: string = ""
	)
	{
        this.id = id;
		this.codigo = codigo;
		this.nombre = nombre;
		this.idTipoTributo = idTipoTributo;
		this.convenio = convenio;
		this.condiciones = condiciones;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.codigo = row.codigo ?? "";
		this.nombre = row.nombre ?? "";
		this.idTipoTributo = row.idTipoTributo ?? 0;
		this.convenio = row.convenio ?? "";
		this.condiciones = row.condiciones ?? "";
	}

}
