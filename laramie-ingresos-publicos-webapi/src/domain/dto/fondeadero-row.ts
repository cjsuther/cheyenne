
export default class FondeaderoRow {

    id: number;
    idCuenta: number;
    estadoCarga: string;
    numeroCuenta: string;
    numeroWeb: string;
    idEstadoCuenta: number;
    descripcionTasa: number;
    descripcionSubTasa: number;
    embarcacion: string;

    constructor(
        id: number = 0,
        idCuenta: number = 0,
        estadoCarga: string = "",
        numeroCuenta: string = "",
        numeroWeb: string = "",
        idEstadoCuenta: number = 0,
        descripcionTasa: number = 0,
        descripcionSubTasa: number = 0,
        embarcacion: string = "",
        )
    {
        this.id = id;
        this.idCuenta = idCuenta;
        this.estadoCarga = estadoCarga;
        this.numeroCuenta = numeroCuenta;
        this.numeroWeb = numeroWeb;
        this.idEstadoCuenta = idEstadoCuenta;
        this.descripcionTasa = descripcionTasa;
        this.descripcionSubTasa = descripcionSubTasa;
        this.embarcacion = embarcacion;
    }
    
}
