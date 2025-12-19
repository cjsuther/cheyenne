import EmisionProcedimientoParametro from "../entities/emision-procedimiento-parametro";

export default class EmisionProcedimientoParametroState extends EmisionProcedimientoParametro {

    state: string;

	constructor(
        id: number = 0,
		idEmisionEjecucion: number = 0,
		idProcedimientoParametro: number = 0,
		valor: string = "",
		state: string = "o"
	)
	{
        super(id, idEmisionEjecucion, idProcedimientoParametro, valor);
		this.state = state;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idEmisionEjecucion = row.idEmisionEjecucion ?? 0;
		this.idProcedimientoParametro = row.idProcedimientoParametro ?? 0;
		this.valor = row.valor ?? "";
		this.state = row.state ?? "o";
	}

}
