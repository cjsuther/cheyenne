import ProcedimientoParametro from "../entities/procedimiento-parametro";

export default class ProcedimientoParametroState extends ProcedimientoParametro{

    state: string;

	constructor(
        id: number = 0,
		idProcedimiento: number = 0,
		codigo: string = "",
		nombre: string = "",
		tipoDato: string = "",
		orden: number = 0,
        state: string = "o"
	)
	{
        super(id, idProcedimiento, codigo, nombre, tipoDato, orden);
        this.state = state;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idProcedimiento = row.idProcedimiento ?? 0;
		this.codigo = row.codigo ?? "";
		this.nombre = row.nombre ?? "";
		this.tipoDato = row.tipoDato ?? "";
		this.orden = row.orden ?? 0;
        this.state = row.state ?? "o";
	}

}
