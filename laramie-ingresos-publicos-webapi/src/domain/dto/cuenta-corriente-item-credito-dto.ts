import CuentaCorrienteItemDeuda from './cuenta-corriente-item-deuda';


export default class CuentaCorrienteItemCreditoDTO {

    cuentaCorrienteItemsCredito?: Array<CuentaCorrienteItemDeuda>;
    cuentaCorrienteItemsSaldo?: Array<CuentaCorrienteItemDeuda>;

    constructor(
        cuentaCorrienteItemsCredito: Array<CuentaCorrienteItemDeuda> = [],
        cuentaCorrienteItemsSaldo: Array<CuentaCorrienteItemDeuda> = []
        )
    {
        this.cuentaCorrienteItemsCredito = cuentaCorrienteItemsCredito;
        this.cuentaCorrienteItemsSaldo = cuentaCorrienteItemsSaldo;
    }

    setFromObject = (row) =>
    {
        this.cuentaCorrienteItemsCredito = row.cuentaCorrienteItemsCredito.map(x => {
            let item = new CuentaCorrienteItemDeuda();
            item.setFromObject(x);
            return item;
        });
        this.cuentaCorrienteItemsSaldo = row.cuentaCorrienteItemsSaldo.map(x => {
            let item = new CuentaCorrienteItemDeuda();
            item.setFromObject(x);
            return item;
        });
    }
    
}
