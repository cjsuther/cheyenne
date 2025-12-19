import Procedimiento from '../entities/procedimiento';
import ArchivoState from './archivo-state';
import ObservacionState from './observacion-state';
import EtiquetaState from './etiqueta-state';
import ProcedimientoParametroState from './procedimiento-parametro-state';
import ProcedimientoVariableState from './procedimiento-variable-state';
import ProcedimientoFiltroState from './procedimiento-filtro-state';

export default class ProcedimientoDTO  {

	procedimiento?: Procedimiento;

    archivos: Array<ArchivoState>;
    observaciones: Array<ObservacionState>;
    etiquetas: Array<EtiquetaState>;
    procedimientoParametros: Array<ProcedimientoParametroState>;
    procedimientoVariables: Array<ProcedimientoVariableState>;
    procedimientoFiltros: Array<ProcedimientoFiltroState>;

	constructor(
        procedimiento: Procedimiento = new Procedimiento(),
        archivos: Array<ArchivoState> = [],
        observaciones: Array<ObservacionState> = [],
        etiquetas: Array<EtiquetaState> = [],
        procedimientoParametros: Array<ProcedimientoParametroState> = [],
        procedimientoVariables: Array<ProcedimientoVariableState> = [],
        procedimientoFiltros: Array<ProcedimientoFiltroState> = []
	)
	{
        this.procedimiento = procedimiento;
        this.archivos = archivos;
        this.observaciones = observaciones;
        this.etiquetas = etiquetas;
        this.procedimientoParametros = procedimientoParametros;
        this.procedimientoVariables = procedimientoVariables;
        this.procedimientoFiltros = procedimientoFiltros;
	}

	setFromObject = (row) =>
	{
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
        this.procedimientoParametros = row.procedimientoParametros.map(x => {
            let item = new ProcedimientoParametroState();
            item.setFromObject(x);
            return item;
        });
        this.procedimientoVariables = row.procedimientoVariables.map(x => {
            let item = new ProcedimientoVariableState();
            item.setFromObject(x);
            return item;
        });
        this.procedimientoFiltros = row.procedimientoFiltros.map(x => {
            let item = new ProcedimientoFiltroState();
            item.setFromObject(x);
            return item;
        });
	}

}
