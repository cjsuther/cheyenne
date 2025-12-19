import CuentaCorrienteItemDeuda from './cuenta-corriente-item-deuda';

export default class CuentaCorrienteItemDeudaDTO {

    cuentaCorrienteItems?: Array<CuentaCorrienteItemDeuda>;
    certificadosApremio?: [];
    rubrosComercio?: [];
    condicionesEspeciales?: [];
    multas?: [];

    constructor(
        cuentaCorrienteItems: Array<CuentaCorrienteItemDeuda> = [])
    {
        this.cuentaCorrienteItems = cuentaCorrienteItems;
    }

    setFromObject = (row) =>
    {
        this.cuentaCorrienteItems = row.cuentaCorrienteItems.map(x => {
            let item = new CuentaCorrienteItemDeuda();
            item.setFromObject(x);
            return item;
        });
    }
    
}
