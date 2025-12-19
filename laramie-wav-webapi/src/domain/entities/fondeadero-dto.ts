import Fondeadero from './fondeadero';
import Cuenta from './cuenta';
import CondicionEspecial from './condicion-especial';

export default class FondeaderoDTO {

    fondeadero?: Fondeadero;
    cuenta?: Cuenta;
    condicionesEspeciales: Array<CondicionEspecial>;

    constructor(
        fondeadero: Fondeadero = new Fondeadero(),
        cuenta: Cuenta =  new Cuenta(),
        condicionesEspeciales: Array<CondicionEspecial> = []
        )
    {
        this.fondeadero = fondeadero;
        this.cuenta = cuenta;
        this.condicionesEspeciales = condicionesEspeciales;
    }

    setFromObject = (row) =>
    {
        this.fondeadero.setFromObject(row.fondeadero);
        this.cuenta.setFromObject(row.cuenta);
        this.condicionesEspeciales = row.condicionesEspeciales.map(x => {
            let item = new CondicionEspecial();
            item.setFromObject(x);
            return item;
        });
    }
    
}
