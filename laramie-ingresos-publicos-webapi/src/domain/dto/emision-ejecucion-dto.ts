import EmisionEjecucion from '../entities/emision-ejecucion';
import EmisionDefinicion from '../entities/emision-definicion';
import EmisionAprobacion from '../entities/emision-aprobacion';
import ArchivoState from './archivo-state';
import ObservacionState from './observacion-state';
import EtiquetaState from './etiqueta-state';
import Procedimiento from '../entities/procedimiento';
import Funcion from '../entities/funcion';
import EmisionVariableState from './emision-variable-state';
import EmisionProcedimientoParametroState from './emision-procedimiento-parametro-state';
import EmisionCuotaState from './emision-cuota-state';


export default class EmisionEjecucionDTO {

    emisionDefinicion?: EmisionDefinicion;
    emisionEjecucion?: EmisionEjecucion;
    emisionAprobacion?: EmisionAprobacion;
    procedimiento: Procedimiento;

    archivos: Array<ArchivoState>;
    observaciones: Array<ObservacionState>;
    etiquetas: Array<EtiquetaState>;

    funciones: Array<Funcion>;
    emisionVariables: Array<EmisionVariableState>;
    emisionProcedimientoParametros: Array<EmisionProcedimientoParametroState>;
    emisionCuotas: Array<EmisionCuotaState>;

    constructor(
        emisionDefinicion: EmisionDefinicion = new EmisionDefinicion(),
        emisionEjecucion: EmisionEjecucion = new EmisionEjecucion(),
        emisionAprobacion: EmisionAprobacion = new EmisionAprobacion(),
        procedimiento: Procedimiento = new Procedimiento(),
        archivos: Array<ArchivoState> = [],
        observaciones: Array<ObservacionState> = [],
        etiquetas: Array<EtiquetaState> = [],
        funciones: Array<Funcion> = [],
        emisionVariables: Array<EmisionVariableState> = [],
        emisionProcedimientoParametros: Array<EmisionProcedimientoParametroState> = [],
        emisionCuotas: Array<EmisionCuotaState> = []
    )
    {
        this.emisionDefinicion = emisionDefinicion;
        this.emisionEjecucion = emisionEjecucion;
        this.emisionAprobacion = emisionAprobacion;
        this.procedimiento = procedimiento;
        this.archivos = archivos;
        this.observaciones = observaciones;
        this.etiquetas = etiquetas;
        this.funciones = funciones;
        this.emisionVariables = emisionVariables;
        this.emisionProcedimientoParametros = emisionProcedimientoParametros;
        this.emisionCuotas = emisionCuotas;
    }

    setFromObject = (row) =>
    {
        this.emisionDefinicion.setFromObject(row.emisionDefinicion);
        this.emisionEjecucion.setFromObject(row.emisionEjecucion);
        this.emisionAprobacion.setFromObject(row.emisionAprobacion);
        this.procedimiento.setFromObject(row.procedimiento);
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
        this.emisionProcedimientoParametros = row.emisionProcedimientoParametros.map(x => {
            let item = new EmisionProcedimientoParametroState();
            item.setFromObject(x);
            return item;
        });
        this.emisionCuotas = row.emisionCuotas.map(x => {
            let item = new EmisionCuotaState();
            item.setFromObject(x);
            return item;
        });
    }
    
}
