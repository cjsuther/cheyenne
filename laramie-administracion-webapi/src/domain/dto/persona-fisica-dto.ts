import PersonaFisica from '../entities/persona-fisica';
import Direccion from "../entities/direccion";
import ArchivoState from './archivo-state';
import ObservacionState from './observacion-state';
import EtiquetaState from './etiqueta-state';
import DocumentoState from './documento-state';
import ContactoState from './contacto-state';
import MedioPagoState from './medio-pago-state';


export default class PersonaFisicaDTO {

    persona?: PersonaFisica;
	direccion: Direccion;
    archivos: Array<ArchivoState>;
    observaciones: Array<ObservacionState>;
    etiquetas: Array<EtiquetaState>;
    documentos: Array<DocumentoState>;
    contactos: Array<ContactoState>;
    mediosPago: Array<MedioPagoState>;

    constructor(
        persona: PersonaFisica = new PersonaFisica(),
		direccion: Direccion = new Direccion(),
        archivos: Array<ArchivoState> = [],
        observaciones: Array<ObservacionState> = [],
        etiquetas: Array<EtiquetaState> = [],
        documentos: Array<DocumentoState> = [],
        contactos: Array<ContactoState> = [],
        mediosPago: Array<MedioPagoState> = []
    )
    {
        this.persona = persona;
		this.direccion = direccion;
        this.archivos = archivos;
        this.observaciones = observaciones;
        this.etiquetas = etiquetas;
        this.documentos = documentos;
        this.contactos = contactos;
        this.mediosPago = mediosPago;
    }

    setFromObject = (row) =>
    {
        this.persona.setFromObject(row.persona);
        this.direccion.setFromObject(row.direccion);
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
        this.documentos = row.documentos.map(x => {
            let item = new DocumentoState();
            item.setFromObject(x);
            return item;
        });
        this.contactos = row.contactos.map(x => {
            let item = new ContactoState();
            item.setFromObject(x);
            return item;
        });
        this.mediosPago = row.mediosPago.map(x => {
            let item = new MedioPagoState();
            item.setFromObject(x);
            return item;
        });
    }
    
}
