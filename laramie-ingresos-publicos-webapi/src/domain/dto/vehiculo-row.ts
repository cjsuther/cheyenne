
export default class VehiculoRow {

    id: number;
    idCuenta: number;
    estadoCarga: string;
    numeroCuenta: string;
    numeroWeb: string;
    idEstadoCuenta: number;
    dominio: string;
    marca: string;
    modelo: string

    constructor(
        id: number = 0,
        idCuenta: number = 0,
        estadoCarga: string = "",
        numeroCuenta: string = "",
        numeroWeb: string = "",
        idEstadoCuenta: number = 0,
        dominio: string = "",
        marca: string = "",
        modelo: string = ""
        )
    {
        this.id = id;
        this.idCuenta = idCuenta;
        this.estadoCarga = estadoCarga;
        this.numeroCuenta = numeroCuenta;
        this.numeroWeb = numeroWeb;
        this.idEstadoCuenta = idEstadoCuenta;
        this.dominio = dominio;
        this.marca = marca;
        this.modelo = modelo;
    }
    
}
