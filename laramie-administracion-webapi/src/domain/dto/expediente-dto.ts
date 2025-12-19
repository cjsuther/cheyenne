import Expediente from '../entities/expediente';
import ArchivoState from './archivo-state';
import ObservacionState from './observacion-state';
import EtiquetaState from './etiqueta-state';


export default class ExpedienteDTO {

    expediente?: Expediente;
    archivos: Array<ArchivoState>;
    observaciones: Array<ObservacionState>;
    etiquetas: Array<EtiquetaState>;

    constructor(
        expediente: Expediente = new Expediente(),
        archivos: Array<ArchivoState> = [],
        observaciones: Array<ObservacionState> = [],
        etiquetas: Array<EtiquetaState> = []
        )
    {
        this.expediente = expediente;
        this.archivos = archivos;
        this.observaciones = observaciones;
        this.etiquetas = etiquetas;
    }

    setFromObject = (row) =>
    {
        this.expediente.setFromObject(row.expediente);
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
    }
    
}
