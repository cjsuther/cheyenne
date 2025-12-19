import SubTasa from '../entities/sub-tasa';
import ArchivoState from './archivo-state';
import ObservacionState from './observacion-state';
import EtiquetaState from './etiqueta-state';
import SubTasaImputacionState from './sub-tasa-imputacion-state';

export default class SubTasaDTO {

    subTasa?: SubTasa;
    archivos: Array<ArchivoState>;
    observaciones: Array<ObservacionState>;
    etiquetas: Array<EtiquetaState>;
    subTasaImputaciones: Array<SubTasaImputacionState>;

    constructor(
        subTasa: SubTasa = new SubTasa(),
        archivos: Array<ArchivoState> = [],
        observaciones: Array<ObservacionState> = [],
        etiquetas: Array<EtiquetaState> = [],
        subTasaImputaciones: Array<SubTasaImputacionState> = []
        )
    {
        this.subTasa = subTasa;
        this.archivos = archivos;
        this.observaciones = observaciones;
        this.etiquetas = etiquetas;
        this.subTasaImputaciones = subTasaImputaciones;
    }

    setFromObject = (row) =>
    {
        this.subTasa.setFromObject(row.subTasa);
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
        this.subTasaImputaciones = row.subTasaImputaciones.map(x => {
            let item = new SubTasaImputacionState();
            item.setFromObject(x);
            return item;
        });
    }
    
}
