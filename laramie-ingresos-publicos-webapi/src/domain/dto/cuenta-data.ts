import Cuenta from "../entities/cuenta";

export default class CuentaData extends Cuenta {

    vendedor: string;
    partida: string;
    direccion: string;

    constructor(
        id: number = 0,
        numeroCuenta: string = "",
        numeroWeb: string = "",
        idEstadoCuenta: number = 0,
        idTipoTributo: number = 0,
        idTributo: number = 0,
        fechaAlta: Date = null,
        fechaBaja: Date = null,
        vendedor: string = "",
        partida: string = "",
        direccion: string = "")
    {
        super(id, numeroCuenta, numeroWeb, idEstadoCuenta, idTipoTributo, idTributo, fechaAlta, fechaBaja);
        this.vendedor = vendedor;
        this.partida = partida;
        this.direccion = direccion;
    }

    setFromObject = (row) =>
    {
        this.id = row.id ?? 0;
        this.numeroCuenta = row.numeroCuenta ?? "";
        this.numeroWeb = row.numeroWeb ?? "";
        this.idEstadoCuenta = row.idEstadoCuenta ?? 0;
        this.idTipoTributo = row.idTipoTributo ?? 0;
        this.idTributo = row.idTributo ?? 0;
        this.fechaAlta = row.fechaAlta ?? null;
        this.fechaBaja = row.fechaBaja ?? null;
        this.vendedor = row.vendedor ?? "";
        this.partida = row.partida ?? "";
        this.direccion = row.direccion ?? "";
    }
    
}
