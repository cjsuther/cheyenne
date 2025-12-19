
export default class SorterCuenta {

	constructor() {

    }

    execute(rows:any) {
        const rowsOrder = rows.sort((a,b) => a.numeroCuenta.localeCompare(b.numeroCuenta));
        const updates = rowsOrder.map((item, index) => {
            return {
                idEmisionEjecucionCuenta: item.idEmisionEjecucionCuenta,
                numero: (index + 1)
            };
        });

        return updates;
    }

}