import Comercio from './comercio';
import Cuenta from './cuenta';
import CondicionEspecial from './condicion-especial';
import RubroComercio from './rubro-comercio';

export default class ComercioDTO {

    comercio?: Comercio;
    cuenta?: Cuenta;
    condicionesEspeciales: Array<CondicionEspecial>;
    rubrosComercio: Array<RubroComercio>;

    constructor(
        comercio: Comercio = new Comercio(),
        cuenta: Cuenta =  new Cuenta(),
        condicionesEspeciales: Array<CondicionEspecial> = [],
        rubrosComercio: Array<RubroComercio> = []
    )
    {
        this.comercio = comercio;
        this.cuenta = cuenta;
        this.condicionesEspeciales = condicionesEspeciales;
        this.rubrosComercio = rubrosComercio;
    }

    setFromObject = (row) =>
    {
        this.comercio.setFromObject(row.comercio);
        this.cuenta.setFromObject(row.cuenta);
        this.condicionesEspeciales = row.condicionesEspeciales.map(x => {
            let item = new CondicionEspecial();
            item.setFromObject(x);
            return item;
        });
        this.rubrosComercio = row.rubrosComercio.map(x => {
            let item = new RubroComercio();
            item.setFromObject(x);
            return item;
        });
    }
    
}
