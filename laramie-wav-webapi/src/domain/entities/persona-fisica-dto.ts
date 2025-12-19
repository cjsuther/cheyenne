import PersonaFisica from './persona-fisica';
import Direccion from "./direccion";
import DocumentoState from './documento-state';
import ContactoState from './contacto-state';

export default class PersonaFisicaDTO {

    persona?: PersonaFisica;
	direccion: Direccion;
    documentos: Array<DocumentoState>;
    contactos: Array<ContactoState>;
    archivos: [];
    observaciones: [];
    etiquetas: [];
    mediosPago: [];

    constructor(
        persona: PersonaFisica = new PersonaFisica(),
		direccion: Direccion = new Direccion(),
        documentos: Array<DocumentoState> = [],
        contactos: Array<ContactoState> = []

    )
    {
        this.persona = persona;
		this.direccion = direccion;
        this.documentos = documentos;
        this.contactos = contactos;
        this.archivos = [];
        this.observaciones = [];
        this.etiquetas = [];
        this.mediosPago = [];
    }

    setFromObject = (row) =>
    {
        this.persona.setFromObject(row.persona);
        this.direccion.setFromObject(row.direccion);
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
    }
    
}
