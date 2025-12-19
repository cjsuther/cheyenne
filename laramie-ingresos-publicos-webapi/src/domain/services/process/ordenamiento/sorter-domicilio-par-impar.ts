
export default class SorterDomicilioParImpar {

	constructor() {

    }

    execute(rows:any) {
        const rowsOrder = rows.sort((a,b) => {
            const orderCalle = a.calle.localeCompare(b.calle);
            return (orderCalle !== 0) ? orderCalle :
                    (this.isOdd(a.altura) === this.isOdd(b.altura)) ? a.altura.localeCompare(b.altura) :
                     (this.isOdd(a.altura)) ? 1 : -1;
        });
        const updates = rowsOrder.map((item, index) => {
            return {
                idEmisionEjecucionCuenta: item.idEmisionEjecucionCuenta,
                numero: (index + 1)
            };
        });

        return updates;
    }

    isOdd(value) { //es impar
        return (parseInt(value) % 2 !== 0);
    }

}