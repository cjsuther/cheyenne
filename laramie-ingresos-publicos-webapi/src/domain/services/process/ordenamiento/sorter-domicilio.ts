
export default class SorterDomicilio {

	constructor() {

    }

    execute(rows:any) {
        const rowsOrder = rows.sort((a,b) => {
            const orderCalle = a.calle.localeCompare(b.calle);
            return (orderCalle !== 0) ? orderCalle : a.altura.localeCompare(b.altura);
        });
        const updates = rowsOrder.map((item, index) => {
            return {
                idEmisionEjecucionCuenta: item.idEmisionEjecucionCuenta,
                numero: (index + 1)
            };
        });

        return updates;
    }

}