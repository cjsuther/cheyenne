export default class CuentaCorrienteItemFilter {

	idCuenta: number;
	codigoDelegacion: string = "";
	idTipoMovimiento: number = 0;
	numeroMovimiento: number = 0;
	numeroPartida: number = 0;
	periodo: string;
	cuota: number;
	incluyePlanes: boolean;
	fechaDesde: Date;
	fechaHasta: Date;
	fechaDeuda: Date;

	constructor(
		idCuenta: number = 0,
		codigoDelegacion: string = "",
		idTipoMovimiento: number = 0,
		numeroMovimiento: number = 0,
		numeroPartida: number = 0,
		periodo: string = "",
		cuota: number = 0,
		incluyePlanes: boolean = false,
		fechaDesde: Date = null,
		fechaHasta: Date = null,
		fechaDeuda: Date = null
	)
	{
		this.idCuenta = idCuenta;
		this.codigoDelegacion = codigoDelegacion;
		this.idTipoMovimiento = idTipoMovimiento;
		this.numeroMovimiento = numeroMovimiento;
		this.numeroPartida = numeroPartida;
		this.periodo = periodo;
		this.cuota = cuota;
		this.incluyePlanes = incluyePlanes;
		this.fechaDesde = fechaDesde;
		this.fechaHasta = fechaHasta;
		this.fechaDeuda = fechaDeuda;
	}

	setFromObject = (row) =>
	{
		this.idCuenta = row.idCuenta ?? 0;
		this.codigoDelegacion = row.codigoDelegacion ?? "";
		this.idTipoMovimiento = row.idTipoMovimiento ?? 0;
		this.numeroMovimiento = row.numeroMovimiento ?? 0;
		this.numeroPartida = row.numeroPartida ?? 0;
		this.periodo = row.periodo ?? "";
		this.cuota = row.cuota ?? 0;
		this.incluyePlanes = row.incluyePlanes ?? false;
		this.fechaDesde = row.fechaDesde ?? null;
		this.fechaHasta = row.fechaHasta ?? null;
		this.fechaDeuda = row.fechaDeuda ?? null;
	}

}
