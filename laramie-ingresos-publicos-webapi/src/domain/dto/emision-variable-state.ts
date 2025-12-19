import EmisionVariable from "../entities/emision-variable";

export default class EmisionVariableState extends EmisionVariable {

    state: string;

	constructor(
        id: number = 0,
		idEmisionDefinicion: number = 0,
		idProcedimientoVariable: number = 0,
		state: string = "o"
	)
	{
        super(id, idEmisionDefinicion, idProcedimientoVariable);
		this.state = state;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idEmisionDefinicion = row.idEmisionDefinicion ?? 0;
		this.idProcedimientoVariable = row.idProcedimientoVariable ?? 0;
        this.state = row.state ?? "o";
	}

}
