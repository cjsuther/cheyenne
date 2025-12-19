import PersonaFisica from '../entities/persona-fisica';
import Direccion from "../entities/direccion";
import DocumentoState from './documento-state';

export default class PersonaFisicaDTO {

    persona?: PersonaFisica;
	direccion: Direccion;
    documentos: Array<DocumentoState>;
    archivos: [];
    observaciones: [];
    etiquetas: [];
    contactos: [];
    mediosPago: [];

    constructor(
        persona: PersonaFisica = new PersonaFisica(),
		direccion: Direccion = new Direccion(),
        documentos: Array<DocumentoState> = []
    )
    {
        this.persona = persona;
		this.direccion = direccion;
        this.documentos = documentos;
        this.archivos = [];
        this.observaciones = [];
        this.etiquetas = [];
        this.contactos = [];
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
    }
    
}
