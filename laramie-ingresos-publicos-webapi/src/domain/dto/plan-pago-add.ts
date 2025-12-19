import CuentaCorrienteItemRecibo from "./cuenta-corriente-item-recibo";


export default class PlanPagoAdd {

	idPlanPagoDefinicion: number;
	idCuenta: number;
	idTipoVinculoCuenta: number;
	idVinculoCuenta: number;
	cantidadCuotas: number;
    items: Array<CuentaCorrienteItemRecibo>;

	constructor(
		idPlanPagoDefinicion: number = 0,
		idCuenta: number = 0,
		idTipoVinculoCuenta: number = 0,
		idVinculoCuenta: number = 0,
        cantidadCuotas: number = 0,
        items: Array<CuentaCorrienteItemRecibo> = []
	)
	{
		this.idPlanPagoDefinicion = idPlanPagoDefinicion;
		this.idCuenta = idCuenta;
		this.idTipoVinculoCuenta = idTipoVinculoCuenta;
		this.idVinculoCuenta = idVinculoCuenta;
		this.cantidadCuotas = cantidadCuotas;
        this.items = items;
	}

	setFromObject = (row) =>
	{
		this.idPlanPagoDefinicion = row.idPlanPagoDefinicion ?? 0;
		this.idCuenta = row.idCuenta ?? 0;
		this.idTipoVinculoCuenta = row.idTipoVinculoCuenta ?? 0;
		this.idVinculoCuenta = row.idVinculoCuenta ?? 0;
		this.cantidadCuotas = row.cantidadCuotas ?? 0;
        this.items = row.items.map(x => {
            let item = new CuentaCorrienteItemRecibo();
            item.setFromObject(x);
            return item;
        });
	}

}
