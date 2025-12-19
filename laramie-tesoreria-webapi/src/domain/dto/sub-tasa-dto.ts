import SubTasaImputacion from "../entities/sub-tasa-imputacion";

export default class SubTasaDTO {

    ejercicio: string;
    codigoTasa: string;
    codigoSubTasa: string;
    descripcionTasa: string;
    descripcionSubTasa: string;
    imputacion: SubTasaImputacion;

    constructor()
    {
        this.ejercicio = "";
        this.codigoTasa = "";
        this.codigoSubTasa = "";
        this.descripcionTasa = "";
        this.descripcionSubTasa = "";
        this.imputacion = new SubTasaImputacion ();
    }
    
}
