import CuentaCorrienteItemRecibo from "./cuenta-corriente-item-recibo";

export default class CuentaCorrienteItemPagoACuenta {

	idCuenta: number;
	importe: number;
	fechaVencimiento: Date;
	items: Array<CuentaCorrienteItemRecibo>;

	constructor(
		idCuenta: number = 0,
		importe: number = 0,
		fechaVencimiento: Date = null,
		items: Array<CuentaCorrienteItemRecibo> = []
	)
	{
		this.idCuenta = idCuenta;
		this.importe = importe;
		this.fechaVencimiento = fechaVencimiento;
		this.items = items;
	}

	setFromObject = (row) =>
	{
		this.idCuenta = row.idCuenta ?? 0;
		this.importe = row.importe ?? 0;
		this.fechaVencimiento = row.fechaVencimiento ?? null;
		this.items = row.items ?? [];
	}

}
