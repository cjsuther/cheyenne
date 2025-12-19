import Controlador from '../entities/controlador';
import ArchivoState from './archivo-state';
import ObservacionState from './observacion-state';
import EtiquetaState from './etiqueta-state';


export default class ControladorDTO {

    controlador?: Controlador;
    archivos: Array<ArchivoState>;
    observaciones: Array<ObservacionState>;
    etiquetas: Array<EtiquetaState>;

    constructor(
        controlador: Controlador = new Controlador(),
        archivos: Array<ArchivoState> = [],
        observaciones: Array<ObservacionState> = [],
        etiquetas: Array<EtiquetaState> = []
        )
    {
        this.controlador = controlador;
        this.archivos = archivos;
        this.observaciones = observaciones;
        this.etiquetas = etiquetas;
    }

    setFromObject = (row) =>
    {
        this.controlador.setFromObject(row.controlador);
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
