import ProcedimientoVariable from "../entities/procedimiento-variable";

export default class ProcedimientoVariableState extends ProcedimientoVariable{

    state: string;

	constructor(
        id: number = 0,
		idProcedimiento: number = 0,
		idColeccionCampo: number = 0,
		idTipoVariable: number = 0,
		codigo: string = "",
		nombre: string = "",
		tipoDato: string = "",
		orden: number = 0,
        state: string = "o"
	)
	{
        super(id, idProcedimiento, idColeccionCampo, idTipoVariable, codigo, nombre, tipoDato, orden);
        this.state = state;
	}

	setFromObject = (row) =>
	{
		this.id = row.id ?? 0;
		this.idProcedimiento = row.idProcedimiento ?? 0;
		this.idColeccionCampo = row.idColeccionCampo ?? 0;
		this.idTipoVariable = row.idTipoVariable ?? 0;
		this.codigo = row.codigo ?? "";
		this.nombre = row.nombre ?? "";
		this.tipoDato = row.tipoDato ?? "";
		this.orden = row.orden ?? 0;
        this.state = row.state ?? "o";
	}

}
