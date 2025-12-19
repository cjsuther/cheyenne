export default class IdentificadorFactura {

    municipioCodigo: string;
    codigoDelegacion: string;
    numeroRecibo: number;
    
    constructor(municipioCodigo: string="", codigoDelegacion: string="", numeroRecibo: number=0)
    {
        this.municipioCodigo = municipioCodigo;
        this.codigoDelegacion = codigoDelegacion;
        this.numeroRecibo = numeroRecibo;
    }
    
}
