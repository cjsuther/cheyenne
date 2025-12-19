
export default class ExpedienteFilter {
    idTipoExpediente: number;
    expediente: string;
    etiqueta: string;

    constructor(
        idTipoExpediente: number = 0,
        expediente: string = "",
        etiqueta: string = ""
        )
    {
        this.idTipoExpediente = idTipoExpediente;
        this.expediente = expediente;
        this.etiqueta = etiqueta;
    }
    
}
