export default class EmisionVariable {

    id: number;
	idEmisionDefinicion: number;
	idProcedimientoVariable: number;

	constructor(
        id: number = 0,
		idEmisionDefinicion: number = 0,
		idProcedimientoVariable: number = 0
	)
	{
        this.id = id;
		this.idEmisionDefinicion = idEmisionDefinicion;
		this.idProcedimientoVariable = idProcedimientoVariable;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idEmisionDefinicion = row.idEmisionDefinicion ?? 0;
		this.idProcedimientoVariable = row.idProcedimientoVariable ?? 0;
	}

}
