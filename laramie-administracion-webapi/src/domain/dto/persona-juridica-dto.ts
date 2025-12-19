import PersonaJuridica from '../entities/persona-juridica';
import Direccion from "../entities/direccion";
import ArchivoState from './archivo-state';
import ObservacionState from './observacion-state';
import EtiquetaState from './etiqueta-state';
import DocumentoState from './documento-state';
import ContactoState from './contacto-state';
import MedioPagoState from './medio-pago-state';
import ListaState from './lista-state';


export default class PersonaJuridicaDTO {

    persona?: PersonaJuridica;
    domicilioLegal: Direccion;
    domicilioFiscal: Direccion;
    archivos: Array<ArchivoState>;
    observaciones: Array<ObservacionState>;
    etiquetas: Array<EtiquetaState>;
    documentos: Array<DocumentoState>;
    contactos: Array<ContactoState>;
    mediosPago: Array<MedioPagoState>;
    rubrosAfip: Array<ListaState>;

    constructor(
        persona: PersonaJuridica = new PersonaJuridica(),
        domicilioLegal: Direccion = new Direccion(),
        domicilioFiscal: Direccion = new Direccion(),
        archivos: Array<ArchivoState> = [],
        observaciones: Array<ObservacionState> = [],
        etiquetas: Array<EtiquetaState> = [],
        documentos: Array<DocumentoState> = [],
        contactos: Array<ContactoState> = [],
        mediosPago: Array<MedioPagoState> = [],
        rubrosAfip: Array<ListaState> = []
        )
    {
        this.persona = persona;
        this.domicilioLegal = domicilioLegal;
        this.domicilioFiscal = domicilioFiscal;
        this.archivos = archivos;
        this.observaciones = observaciones;
        this.etiquetas = etiquetas;
        this.documentos = documentos;
        this.contactos = contactos;
        this.mediosPago = mediosPago;
        this.rubrosAfip = rubrosAfip;
    }

    setFromObject = (row) =>
    {
        this.persona.setFromObject(row.persona);
        this.domicilioLegal.setFromObject(row.domicilioLegal);
        this.domicilioFiscal.setFromObject(row.domicilioFiscal);
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
        this.rubrosAfip = row.rubrosAfip.map(x => {
            let item = new ListaState();
            item.setFromObject(x);
            return item;
        });
    }
    
}
