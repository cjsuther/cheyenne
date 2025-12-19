import Inmueble from '../entities/inmueble';
import Cuenta from '../entities/cuenta';
import RelacionCuentaState from './relacion-cuenta-state';
import ArchivoState from './archivo-state';
import ObservacionState from './observacion-state';
import EtiquetaState from './etiqueta-state';
import VariableCuentaState from './variable-cuenta-state';
import VinculoInmuebleState from './vinculo-inmueble-state';
import LadoTerrenoState from './lado-terreno-state';
import ZonaEntregaState from './zona-entrega-state';
import ControladorCuentaState from './controlador-cuenta-state';
import ValuacionState from './valuacion-state';
import ObraInmuebleState from './obra-inmueble-state';
import CondicionEspecialState from './condicion-especial-state';
import SuperficieState from './superficie-state';
import EdesurState from './edesur-state';
import RecargoDescuentoState from './recargo-descuento-state';
import DebitoAutomaticoState from './debito-automatico-state';


export default class InmuebleDTO {

    inmueble?: Inmueble;
    cuenta?: Cuenta;
    relacionesCuentas: Array<RelacionCuentaState>;

    archivos: Array<ArchivoState>;
    observaciones: Array<ObservacionState>;
    etiquetas: Array<EtiquetaState>;

    variablesCuenta: Array<VariableCuentaState>;
    vinculosInmueble: Array<VinculoInmuebleState>;
    ladosTerreno: Array<LadoTerrenoState>;
    zonasEntrega: Array<ZonaEntregaState>;
    controladoresCuentas: Array<ControladorCuentaState>;
    valuaciones: Array<ValuacionState>;
    obrasInmueble: Array<ObraInmuebleState>;
    condicionesEspeciales: Array<CondicionEspecialState>;
    superficies: Array<SuperficieState>;
    edesur: Array<EdesurState>;
    recargosDescuentos: Array<RecargoDescuentoState>;
    debitosAutomaticos: Array<DebitoAutomaticoState>;

    constructor(
        inmueble: Inmueble = new Inmueble(),
        cuenta: Cuenta =  new Cuenta(),
        relacionesCuentas: Array<RelacionCuentaState> = [],
        archivos: Array<ArchivoState> = [],
        observaciones: Array<ObservacionState> = [],
        etiquetas: Array<EtiquetaState> = [],
        variablesCuenta: Array<VariableCuentaState> = [],
        vinculosInmueble: Array<VinculoInmuebleState> = [],
        ladosTerreno: Array<LadoTerrenoState> = [],
        zonasEntrega: Array<ZonaEntregaState> = [],
        controladoresCuentas: Array<ControladorCuentaState> = [],
        valuaciones: Array<ValuacionState> = [],
        obrasInmueble: Array<ObraInmuebleState> = [],
        condicionesEspeciales: Array<CondicionEspecialState> = [],
        superficies: Array<SuperficieState> = [],
        edesur: Array<EdesurState> = [],
        recargosDescuentos: Array<RecargoDescuentoState> = [],
        debitosAutomaticos: Array<DebitoAutomaticoState> = []
        )
    {
        this.inmueble = inmueble;
        this.cuenta = cuenta;
        this.relacionesCuentas = relacionesCuentas;
        this.archivos = archivos;
        this.observaciones = observaciones;
        this.etiquetas = etiquetas;
        this.variablesCuenta = variablesCuenta;
        this.vinculosInmueble = vinculosInmueble;
        this.ladosTerreno = ladosTerreno;
        this.zonasEntrega = zonasEntrega;
        this.controladoresCuentas = controladoresCuentas;
        this.valuaciones = valuaciones;
        this.obrasInmueble = obrasInmueble;
        this.condicionesEspeciales = condicionesEspeciales;
        this.superficies = superficies;
        this.edesur = edesur;
        this.recargosDescuentos = recargosDescuentos;
        this.debitosAutomaticos = debitosAutomaticos;
    }

    setFromObject = (row) =>
    {
        this.inmueble.setFromObject(row.inmueble);
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
        this.vinculosInmueble = row.vinculosInmueble.map(x => {
            let item = new VinculoInmuebleState();
            item.setFromObject(x);
            return item;
        });
        this.ladosTerreno = row.ladosTerreno.map(x => {
            let item = new LadoTerrenoState();
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
        this.valuaciones = row.valuaciones.map(x => {
            let item = new ValuacionState();
            item.setFromObject(x);
            return item;
        });
        this.obrasInmueble = row.obrasInmueble.map(x => {
            let item = new ObraInmuebleState();
            item.setFromObject(x);
            return item;
        });
        this.condicionesEspeciales = row.condicionesEspeciales.map(x => {
            let item = new CondicionEspecialState();
            item.setFromObject(x);
            return item;
        });
        this.superficies = row.superficies.map(x => {
            let item = new SuperficieState();
            item.setFromObject(x);
            return item;
        });
        this.edesur = row.edesur.map(x => {
            let item = new EdesurState();
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
    }
    
}
