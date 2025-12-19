import Apremio from '../entities/apremio';
import ArchivoState from './archivo-state';
import ObservacionState from './observacion-state';
import EtiquetaState from './etiqueta-state';
import CertificadoApremio from '../entities/certificado-apremio';
import JuicioCitacionState from './juicio-citacion-state';
import ActoProcesalState from './acto-procesal-state';

export default class ApremioDTO {

	apremio?: Apremio;
    archivos: Array<ArchivoState>;
    observaciones: Array<ObservacionState>;
    etiquetas: Array<EtiquetaState>;
	certificadosApremio: Array<CertificadoApremio>;
    juicioCitaciones: Array<JuicioCitacionState>;
    actosProcesales: Array<ActoProcesalState>;

	constructor(
		apremio: Apremio = new Apremio(),
        archivos: Array<ArchivoState> = [],
        observaciones: Array<ObservacionState> = [],
        etiquetas: Array<EtiquetaState> = [],
		certificadosApremio: Array<CertificadoApremio> = [],
        juicioCitaciones: Array<JuicioCitacionState> = [],
        actosProcesales: Array<ActoProcesalState> = []
		)
	{
		this.apremio = apremio;
        this.archivos = archivos;
        this.observaciones = observaciones;
        this.etiquetas = etiquetas;
		this.certificadosApremio = certificadosApremio;
        this.juicioCitaciones = juicioCitaciones;
        this.actosProcesales = actosProcesales;
	}

	setFromObject = (row) =>
	{
        this.apremio.setFromObject(row.apremio);
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
		this.certificadosApremio = row.certificadosApremio.map(x => {
            let item = new CertificadoApremio();
            item.setFromObject(x);
            return item;
        });
        this.juicioCitaciones = row.juicioCitaciones.map(x => {
            let item = new JuicioCitacionState();
            item.setFromObject(x);
            return item;
        });
        this.actosProcesales = row.actosProcesales.map(x => {
            let item = new ActoProcesalState();
            item.setFromObject(x);
            return item;
        });
    }
}
