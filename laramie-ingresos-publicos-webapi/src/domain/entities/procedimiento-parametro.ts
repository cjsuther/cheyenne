export default class ProcedimientoParametro {

    id: number;
	idProcedimiento: number;
	codigo: string;
	nombre: string;
	tipoDato: string;
	orden: number;

	constructor(
        id: number = 0,
		idProcedimiento: number = 0,
		codigo: string = "",
		nombre: string = "",
		tipoDato: string = "",
		orden: number = 0
	)
	{
        this.id = id;
		this.idProcedimiento = idProcedimiento;
		this.codigo = codigo;
		this.nombre = nombre;
		this.tipoDato = tipoDato;
		this.orden = orden;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idProcedimiento = row.idProcedimiento ?? 0;
		this.codigo = row.codigo ?? "";
		this.nombre = row.nombre ?? "";
		this.tipoDato = row.tipoDato ?? "";
		this.orden = row.orden ?? 0;
	}

}
