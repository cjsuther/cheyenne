import Cuenta from '../entities/cuenta';
import Especial from '../entities/especial';
import EtiquetaState from './etiqueta-state';
import ObservacionState from './observacion-state';
import RelacionCuentaState from './relacion-cuenta-state';
import VariableCuentaState from './variable-cuenta-state';
import VinculoEspecialState from './vinculo-especial-state';

export default class EspecialDTO {

    especial?: Especial;
    cuenta?: Cuenta;
    vinculosEspecial: VinculoEspecialState[];
    relacionesCuentas: RelacionCuentaState[];
    archivos: [];
    observaciones: ObservacionState[];
    etiquetas: EtiquetaState[];
    variablesCuenta: VariableCuentaState[];
    zonasEntrega: [];
    controladoresCuentas: [];
    condicionesEspeciales: [];
    recargosDescuentos: [];
    debitosAutomaticos: [];
    multas: [];

    constructor(
        especial: Especial = new Especial(),
        cuenta: Cuenta =  new Cuenta(),
        vinculosEspecial: Array<VinculoEspecialState> = [],
        relacionesCuentas: Array<RelacionCuentaState> = [],
        observaciones: Array<ObservacionState> = [],
        etiquetas: Array<EtiquetaState> = [],
        variablesCuenta: Array<VariableCuentaState> = []
    )
    {
        this.especial = especial;
        this.cuenta = cuenta;
        this.vinculosEspecial = vinculosEspecial;
        this.relacionesCuentas = relacionesCuentas;
        this.archivos = [];
        this.observaciones = observaciones;
        this.etiquetas = etiquetas;
        this.variablesCuenta = variablesCuenta;
        this.zonasEntrega = [];
        this.controladoresCuentas = [];
        this.condicionesEspeciales = [];
        this.recargosDescuentos = [];
        this.debitosAutomaticos = [];
        this.multas = [];
    }

    setFromObject = (row) =>
    {
        this.especial.setFromObject(row.especial);
        this.cuenta.setFromObject(row.cuenta);
        this.relacionesCuentas = row.relacionesCuentas.map(x => {
            let item = new RelacionCuentaState();
            item.setFromObject(x);
            return item;
        });
        this.vinculosEspecial = row.vinculosEspecial.map(x => {
            let item = new VinculoEspecialState();
            item.setFromObject(x);
            return item;
        });
        this.observaciones = row.observaciones.map(x => {
            let item = new ObservacionState();
            item.setFromObject(x);
            return item;
        });
        this.etiquetas = row.etiquetas.map(x => {
            let item = new EtiquetaState();
            item.setFromObject(x);
            return item;
        });
        this.variablesCuenta = row.variablesCuenta.map(x => {
            let item = new VariableCuentaState();
            item.setFromObject(x);
            return item;
        });
    }
    
}
