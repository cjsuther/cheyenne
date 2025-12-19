import CertificadoApremio from '../entities/certificado-apremio';
import CertificadoApremioPersonaState from './certificado-apremio-persona-state';
import CertificadoApremioItem from '../entities/certificado-apremio-item';
import ArchivoState from './archivo-state';
import ObservacionState from './observacion-state';
import EtiquetaState from './etiqueta-state';

export default class CertificadoApremioDTO {

    certificadoApremio?: CertificadoApremio;
    certificadoApremioItems: Array<CertificadoApremioItem>;
    certificadoApremioPersonas: Array<CertificadoApremioPersonaState>;
    archivos: Array<ArchivoState>;
    observaciones: Array<ObservacionState>;
    etiquetas: Array<EtiquetaState>;

	constructor(
        certificadoApremio: CertificadoApremio = new CertificadoApremio(),
        certificadoApremioItems: Array<CertificadoApremioItem> = [],
        certificadoApremioPersonas: Array<CertificadoApremioPersonaState> = [],
        archivos: Array<ArchivoState> = [],
        observaciones: Array<ObservacionState> = [],
        etiquetas: Array<EtiquetaState> = []
        )
    {
        this.certificadoApremio = certificadoApremio;
        this.certificadoApremioItems = certificadoApremioItems;
        this.certificadoApremioPersonas = certificadoApremioPersonas;
        this.archivos = archivos;
        this.observaciones = observaciones;
        this.etiquetas = etiquetas;
    }

	setFromObject = (row) =>
    {
        this.certificadoApremio.setFromObject(row.certificadoApremio);
        this.certificadoApremioItems = row.certificadoApremioItems.map(x => {
            let item = new CertificadoApremioItem();
            item.setFromObject(x);
            return item;
        });
        this.certificadoApremioPersonas = row.certificadoApremioPersonas.map(x => {
            let item = new CertificadoApremioPersonaState();
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
    }

}
