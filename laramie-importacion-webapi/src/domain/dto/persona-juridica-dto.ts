import PersonaJuridica from '../entities/persona-juridica';
import Direccion from "../entities/direccion";
import DocumentoState from './documento-state';

export default class PersonaJuridicaDTO {

    persona?: PersonaJuridica;
    domicilioLegal: Direccion;
    domicilioFiscal: Direccion;
    documentos: Array<DocumentoState>;
    archivos: [];
    observaciones: [];
    etiquetas: [];
    contactos: [];
    mediosPago: [];
    rubrosAfip: [];

    constructor(
        persona: PersonaJuridica = new PersonaJuridica(),
        domicilioLegal: Direccion = new Direccion(),
        domicilioFiscal: Direccion = new Direccion(),
        documentos: Array<DocumentoState> = []
        )
    {
        this.persona = persona;
        this.domicilioLegal = domicilioLegal;
        this.domicilioFiscal = domicilioFiscal;
        this.documentos = documentos;
        this.archivos = [];
        this.observaciones = [];
        this.etiquetas = [];
        this.contactos = [];
        this.mediosPago = [];
        this.rubrosAfip = [];
    }

    setFromObject = (row) =>
    {
        this.persona.setFromObject(row.persona);
        this.domicilioLegal.setFromObject(row.domicilioLegal);
        this.domicilioFiscal.setFromObject(row.domicilioFiscal);
        this.documentos = row.documentos.map(x => {
            let item = new DocumentoState();
            item.setFromObject(x);
            return item;
        });
    }
    
}
