export default class SubTasaRequest {

    ejercicio: string;
    codigoTasa: string;
    codigoSubTasa: string;

    constructor(ejercicio: string = "", codigoTasa: string = "", codigoSubTasa: string = "")
    {
        this.ejercicio = ejercicio;
        this.codigoTasa = codigoTasa;
        this.codigoSubTasa = codigoSubTasa;
    }
    
}
