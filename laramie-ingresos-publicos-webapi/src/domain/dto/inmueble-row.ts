
export default class InmuebleRow {

    id: number;
    idCuenta: number;
    estadoCarga: string;
    numeroCuenta: string;
    numeroWeb: string;
    idEstadoCuenta: number;
    direccion: string;

    constructor(
        id: number = 0,
        idCuenta: number = 0,
        estadoCarga: string = "",
        numeroCuenta: string = "",
        numeroWeb: string = "",
        idEstadoCuenta: number = 0,
        direccion: string = "",
        )
    {
        this.id = id;
        this.idCuenta = idCuenta;
        this.estadoCarga = estadoCarga;
        this.numeroCuenta = numeroCuenta;
        this.numeroWeb = numeroWeb;
        this.idEstadoCuenta = idEstadoCuenta;
        this.direccion = direccion;
    }
    
}
