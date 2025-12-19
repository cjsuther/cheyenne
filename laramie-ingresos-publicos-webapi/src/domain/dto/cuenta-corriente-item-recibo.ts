export default class CuentaCorrienteItemRecibo {

	idCuenta: number;
	idTasa: number;
	idSubTasa: number;
	codigoDelegacion: string;
	numeroMovimiento: number;
	numeroPartida: number;
	periodo: string;
	cuota: number;

	constructor(
		idCuenta: number = 0,
		idTasa: number = 0,
		idSubTasa: number = 0,
		codigoDelegacion: string = "",
		numeroMovimiento: number = 0,
		numeroPartida: number = 0,
		periodo: string = "",
		cuota: number = 0
	)
	{
		this.idCuenta = idCuenta;
		this.idTasa = idTasa;
		this.idSubTasa = idSubTasa;
		this.codigoDelegacion = codigoDelegacion;
		this.numeroMovimiento = numeroMovimiento;
		this.numeroPartida = numeroPartida;
		this.periodo = periodo;
		this.cuota = cuota;
	}

	setFromObject = (row) =>
	{
		this.idCuenta = row.idCuenta ?? null;
		this.idTasa = row.idTasa ?? null;
		this.idSubTasa = row.idSubTasa ?? null;
		this.codigoDelegacion = row.codigoDelegacion ?? "";
		this.numeroMovimiento = row.numeroMovimiento ?? 0;
		this.numeroPartida = row.numeroPartida ?? 0;
		this.periodo = row.periodo ?? "";
		this.cuota = row.cuota ?? 0;
	}

}
