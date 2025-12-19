
export default class ComercioRow {

    id: number;
    idCuenta: number;
    estadoCarga: string;
    numeroCuenta: string;
    numeroWeb: string;
    idEstadoCuenta: number;
    cuentaInmueble: string;
    rubro: string;
    nombreFantasia: string;

    constructor(
        id: number = 0,
        idCuenta: number = 0,
        estadoCarga: string = "",
        numeroCuenta: string = "",
        numeroWeb: string = "",
        idEstadoCuenta: number = 0,
        cuentaInmueble: string = "",
        rubro: string = "",
        nombreFantasia: string = "",
        )
    {
        this.id = id;
        this.idCuenta = idCuenta;
        this.estadoCarga = estadoCarga;
        this.numeroCuenta = numeroCuenta;
        this.numeroWeb = numeroWeb;
        this.idEstadoCuenta = idEstadoCuenta;
        this.cuentaInmueble = cuentaInmueble;
        this.rubro = rubro;
        this.nombreFantasia = nombreFantasia;
    }
    
}
