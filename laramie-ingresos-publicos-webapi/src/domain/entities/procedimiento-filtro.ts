export default class ProcedimientoFiltro {

    id: number;
	idProcedimiento: number;
	idFiltro: number;

	constructor(
        id: number = 0,
		idProcedimiento: number = 0,
		idFiltro: number = 0
	)
	{
        this.id = id;
		this.idProcedimiento = idProcedimiento;
		this.idFiltro = idFiltro;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idProcedimiento = row.idProcedimiento ?? 0;
		this.idFiltro = row.idFiltro ?? 0;
	}

}
