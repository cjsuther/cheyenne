
export default class FondeaderoFilter {
    //por cuenta
    numeroCuenta: string;
    numeroWeb: string;
    numeroDocumento: string;
    idPersona: number;
    etiqueta: string;
    //por datos vehiculo
    idTasa: number;
    idSubTasa: number;
    embarcacion: string;

    constructor(
        numeroCuenta: string = "",
        numeroWeb: string = "",
        numeroDocumento: string = "",
        idPersona: number = 0,
        etiqueta: string = "",
        idTasa: number = 0,
        idSubTasa: number = 0,
        embarcacion: string = "",
        )
    {
        this.numeroCuenta = numeroCuenta;
        this.numeroWeb = numeroWeb;
        this.numeroDocumento = numeroDocumento;
        this.idPersona = idPersona;
        this.etiqueta = etiqueta;
        this.idTasa = idTasa;
        this.idSubTasa = idSubTasa;
        this.embarcacion = embarcacion;
    }
    
}
