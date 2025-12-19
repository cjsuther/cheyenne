import Tasa from '../entities/tasa';
import ArchivoState from './archivo-state';
import ObservacionState from './observacion-state';
import EtiquetaState from './etiqueta-state';


export default class TasaDTO {

    tasa?: Tasa;
    archivos: Array<ArchivoState>;
    observaciones: Array<ObservacionState>;
    etiquetas: Array<EtiquetaState>;

    constructor(
        tasa: Tasa = new Tasa(),
        archivos: Array<ArchivoState> = [],
        observaciones: Array<ObservacionState> = [],
        etiquetas: Array<EtiquetaState> = []
        )
    {
        this.tasa = tasa;
        this.archivos = archivos;
        this.observaciones = observaciones;
        this.etiquetas = etiquetas;
    }

    setFromObject = (row) =>
    {
        this.tasa.setFromObject(row.tasa);
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
