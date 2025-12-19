
export default class ControladorFilter {
    idTipoControlador: number;
    idPersona: number;
    idControladorSupervisor: number;
    etiqueta: string;

    constructor(
        idTipoControlador: number = 0,
        idPersona: number = 0,
        idControladorSupervisor: number = 0,
        etiqueta: string = ""
        )
    {
        this.idTipoControlador = idTipoControlador;
        this.idPersona = idPersona;
        this.idControladorSupervisor = idControladorSupervisor;
        this.etiqueta = etiqueta;
    }
    
}
