import CuentaCorrienteItemRecibo from "./cuenta-corriente-item-recibo";


export default class PagoContadoAdd {

	idPagoContadoDefinicion: number;
	idCuenta: number;
    items: Array<CuentaCorrienteItemRecibo>;

	constructor(
		idPagoContadoDefinicion: number = 0,
		idCuenta: number = 0,
        items: Array<CuentaCorrienteItemRecibo> = []
	)
	{
		this.idPagoContadoDefinicion = idPagoContadoDefinicion;
		this.idCuenta = idCuenta;
        this.items = items;
	}

	setFromObject = (row) =>
	{
		this.idPagoContadoDefinicion = row.idPagoContadoDefinicion ?? 0;
		this.idCuenta = row.idCuenta ?? 0;
        this.items = row.items.map(x => {
            let item = new CuentaCorrienteItemRecibo();
            item.setFromObject(x);
            return item;
        });
	}

}
