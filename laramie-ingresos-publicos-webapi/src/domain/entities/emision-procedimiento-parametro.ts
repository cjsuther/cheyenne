export default class EmisionProcedimientoParametro {

    id: number;
	idEmisionEjecucion: number;
	idProcedimientoParametro: number;
	valor: string;

	constructor(
        id: number = 0,
		idEmisionEjecucion: number = 0,
		idProcedimientoParametro: number = 0,
		valor: string = ""
	)
	{
        this.id = id;
		this.idEmisionEjecucion = idEmisionEjecucion;
		this.idProcedimientoParametro = idProcedimientoParametro;
		this.valor = valor;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idEmisionEjecucion = row.idEmisionEjecucion ?? 0;
		this.idProcedimientoParametro = row.idProcedimientoParametro ?? 0;
		this.valor = row.valor ?? "";
	}

}
