
export default class SorterNomenclatura {

	constructor() {

    }

    execute(rows:any) {
        const rowsOrder = rows.sort((a,b) => a.cuentaCatastral.localeCompare(b.cuentaCatastral));
        const updates = rowsOrder.map((item, index) => {
            return {
                idEmisionEjecucionCuenta: item.idEmisionEjecucionCuenta,
                numero: (index + 1)
            };
        });

        return updates;
    }

}