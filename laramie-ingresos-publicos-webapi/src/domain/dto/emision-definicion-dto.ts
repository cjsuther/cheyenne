import EmisionDefinicion from '../entities/emision-definicion';
import ArchivoState from './archivo-state';
import ObservacionState from './observacion-state';
import EtiquetaState from './etiqueta-state';
import Procedimiento from '../entities/procedimiento';
import Funcion from '../entities/funcion';
import EmisionVariableState from './emision-variable-state';
import EmisionCalculoState from './emision-calculo-state';
import EmisionConceptoState from './emision-concepto-state';
import EmisionCuentaCorrienteState from './emision-cuenta-corriente-state';
import EmisionImputacionContableState from './emision-imputacion-contable-state';


export default class EmisionDefinicionDTO {

    emisionDefinicion?: EmisionDefinicion;

    archivos: Array<ArchivoState>;
    observaciones: Array<ObservacionState>;
    etiquetas: Array<EtiquetaState>;

    procedimientos: Array<Procedimiento>;
    funciones: Array<Funcion>;
    emisionVariables: Array<EmisionVariableState>;
    emisionCalculos: Array<EmisionCalculoState>;
    emisionConceptos: Array<EmisionConceptoState>;
    emisionCuentasCorrientes: Array<EmisionCuentaCorrienteState>;
    emisionImputacionesContables: Array<EmisionImputacionContableState>;

    constructor(
        emisionDefinicion: EmisionDefinicion = new EmisionDefinicion(),
        archivos: Array<ArchivoState> = [],
        observaciones: Array<ObservacionState> = [],
        etiquetas: Array<EtiquetaState> = [],
        procedimientos: Array<Procedimiento> = [],
        funciones: Array<Funcion> = [],
        emisionVariables: Array<EmisionVariableState> = [],
        emisionCalculos: Array<EmisionCalculoState> = [],
        emisionConceptos: Array<EmisionConceptoState> = [],
        emisionCuentasCorrientes: Array<EmisionCuentaCorrienteState> = [],
        emisionImputacionesContables: Array<EmisionImputacionContableState> = []
    )
    {
        this.emisionDefinicion = emisionDefinicion;
        this.archivos = archivos;
        this.observaciones = observaciones;
        this.etiquetas = etiquetas;
        this.procedimientos = procedimientos;
        this.funciones = funciones;
        this.emisionVariables = emisionVariables;
        this.emisionCalculos = emisionCalculos;
        this.emisionConceptos = emisionConceptos;
        this.emisionCuentasCorrientes = emisionCuentasCorrientes;
        this.emisionImputacionesContables = emisionImputacionesContables;
    }

    setFromObject = (row) =>
    {
        this.emisionDefinicion.setFromObject(row.emisionDefinicion);
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
        this.procedimientos = row.procedimientos.map(x => {
            let item = new Procedimiento();
            item.setFromObject(x);
            return item;
        });
        this.funciones = row.funciones.map(x => {
            let item = new Funcion();
            item.setFromObject(x);
            return item;
        });
        this.emisionVariables = row.emisionVariables.map(x => {
            let item = new EmisionVariableState();
            item.setFromObject(x);
            return item;
        });
        this.emisionCalculos = row.emisionCalculos.map(x => {
            let item = new EmisionCalculoState();
            item.setFromObject(x);
            return item;
        });
        this.emisionConceptos = row.emisionConceptos.map(x => {
            let item = new EmisionConceptoState();
            item.setFromObject(x);
            return item;
        });
        this.emisionCuentasCorrientes = row.emisionCuentasCorrientes.map(x => {
            let item = new EmisionCuentaCorrienteState();
            item.setFromObject(x);
            return item;
        });
        this.emisionImputacionesContables = row.emisionImputacionesContables.map(x => {
            let item = new EmisionImputacionContableState();
            item.setFromObject(x);
            return item;
        });
    }
    
}
