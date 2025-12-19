import Comercio from '../entities/comercio';
import Cuenta from '../entities/cuenta';
import RelacionCuentaState from './relacion-cuenta-state';
import ArchivoState from './archivo-state';
import ObservacionState from './observacion-state';
import EtiquetaState from './etiqueta-state';
import VariableCuentaState from './variable-cuenta-state';
import VinculoComercioState from './vinculo-comercio-state';
import InspeccionState from './inspeccion-state';
import ZonaEntregaState from './zona-entrega-state';
import ControladorCuentaState from './controlador-cuenta-state';
import CondicionEspecialState from './condicion-especial-state';
import RecargoDescuentoState from './recargo-descuento-state';
import DebitoAutomaticoState from './debito-automatico-state';
import RubroComercioState from './rubro-comercio-state';
import ElementoState from './elemento-state';


export default class ComercioDTO {

    comercio?: Comercio;
    cuenta?: Cuenta;
    relacionesCuentas: Array<RelacionCuentaState>;

    archivos: Array<ArchivoState>;
    observaciones: Array<ObservacionState>;
    etiquetas: Array<EtiquetaState>;

    variablesCuenta: Array<VariableCuentaState>;
    vinculosComercio: Array<VinculoComercioState>;
    inspecciones: Array<InspeccionState>;
    zonasEntrega: Array<ZonaEntregaState>;
    controladoresCuentas: Array<ControladorCuentaState>;
    condicionesEspeciales: Array<CondicionEspecialState>;
    recargosDescuentos: Array<RecargoDescuentoState>;
    debitosAutomaticos: Array<DebitoAutomaticoState>;
    rubrosComercio: Array<RubroComercioState>;
    elementos: Array<ElementoState>;

    constructor(
        comercio: Comercio = new Comercio(),
        cuenta: Cuenta =  new Cuenta(),
        relacionesCuentas: Array<RelacionCuentaState> = [],
        archivos: Array<ArchivoState> = [],
        observaciones: Array<ObservacionState> = [],
        etiquetas: Array<EtiquetaState> = [],
        variablesCuenta: Array<VariableCuentaState> = [],
        vinculosComercio: Array<VinculoComercioState> = [],
        inspecciones: Array<InspeccionState> = [],
        zonasEntrega: Array<ZonaEntregaState> = [],
        controladoresCuentas: Array<ControladorCuentaState> = [],
        condicionesEspeciales: Array<CondicionEspecialState> = [],
        recargosDescuentos: Array<RecargoDescuentoState> = [],
        debitosAutomaticos: Array<DebitoAutomaticoState> = [],
        rubrosComercio: Array<RubroComercioState> = [],
        elementos: Array<ElementoState> = []
    )
    {
        this.comercio = comercio;
        this.cuenta = cuenta;
        this.relacionesCuentas = relacionesCuentas;
        this.archivos = archivos;
        this.observaciones = observaciones;
        this.etiquetas = etiquetas;
        this.variablesCuenta = variablesCuenta;
        this.vinculosComercio = vinculosComercio;
        this.inspecciones = inspecciones;
        this.zonasEntrega = zonasEntrega;
        this.controladoresCuentas = controladoresCuentas;
        this.condicionesEspeciales = condicionesEspeciales;
        this.recargosDescuentos = recargosDescuentos;
        this.debitosAutomaticos = debitosAutomaticos;
        this.rubrosComercio = rubrosComercio;
        this.elementos = elementos;
    }

    setFromObject = (row) =>
    {
        this.comercio.setFromObject(row.comercio);
        this.cuenta.setFromObject(row.cuenta);
        this.relacionesCuentas = row.relacionesCuentas.map(x => {
            let item = new RelacionCuentaState();
            item.setFromObject(x);
            return item;
        });
        this.archivos = row.archivos.map(x => {
            let item = new ArchivoState();
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
        this.vinculosComercio = row.vinculosComercio.map(x => {
            let item = new VinculoComercioState();
            item.setFromObject(x);
            return item;
        });
        this.inspecciones = row.inspecciones.map(x => {
            let item = new InspeccionState();
            item.setFromObject(x);
            return item;
        });
        this.zonasEntrega = row.zonasEntrega.map(x => {
            let item = new ZonaEntregaState();
            item.setFromObject(x);
            return item;
        });
        this.controladoresCuentas = row.controladoresCuentas.map(x => {
            let item = new ControladorCuentaState();
            item.setFromObject(x);
            return item;
        });
        this.condicionesEspeciales = row.condicionesEspeciales.map(x => {
            let item = new CondicionEspecialState();
            item.setFromObject(x);
            return item;
        });
        this.recargosDescuentos = row.recargosDescuentos.map(x => {
            let item = new RecargoDescuentoState();
            item.setFromObject(x);
            return item;
        });
        this.debitosAutomaticos = row.debitosAutomaticos.map(x => {
            let item = new DebitoAutomaticoState();
            item.setFromObject(x);
            return item;
        });
        this.rubrosComercio = row.rubrosComercio.map(x => {
            let item = new RubroComercioState();
            item.setFromObject(x);
            return item;
        });
        this.elementos = row.elementos.map(x => {
            let item = new ElementoState();
            item.setFromObject(x);
            return item;
        });
    }
    
}
