export default class CuentaCorrienteCondicionEspecial {

    id: number;
	numero: number;
	idTipoCondicionEspecial: number;
	idCuenta: number;
	codigoDelegacion: string;
	numeroMovimiento: number;
	numeroPartida: number;
	numeroComprobante: number;
	fechaDesde: Date;
	fechaHasta: Date;

	constructor(
        id: number = 0,
		numero: number = 0,
		idTipoCondicionEspecial: number = 0,
		idCuenta: number = 0,
		codigoDelegacion: string = "",
		numeroMovimiento: number = 0,
		numeroPartida: number = 0,
		numeroComprobante: number = 0,
		fechaDesde: Date = null,
		fechaHasta: Date = null
	)
	{
        this.id = id;
		this.numero = numero;
		this.idTipoCondicionEspecial = idTipoCondicionEspecial;
		this.idCuenta = idCuenta;
		this.codigoDelegacion = codigoDelegacion;
		this.numeroMovimiento = numeroMovimiento;
		this.numeroPartida = numeroPartida;
		this.numeroComprobante = numeroComprobante;
		this.fechaDesde = fechaDesde;
		this.fechaHasta = fechaHasta;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.numero = row.numero ?? 0;
		this.idTipoCondicionEspecial = row.idTipoCondicionEspecial ?? 0;
		this.idCuenta = row.idCuenta ?? 0;
		this.codigoDelegacion = row.codigoDelegacion ?? "";
		this.numeroMovimiento = row.numeroMovimiento ?? 0;
		this.numeroPartida = row.numeroPartida ?? 0;
		this.numeroComprobante = row.numeroComprobante ?? 0;
		this.fechaDesde = row.fechaDesde ?? null;
		this.fechaHasta = row.fechaHasta ?? 0;
	}

}
