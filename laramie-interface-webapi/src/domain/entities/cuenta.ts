
export default class Cuenta {

    id: number;
    numeroCuenta: string;
    numeroWeb: string;
    idEstadoCuenta: number;
    idTipoTributo: number;
    idTributo: number;
    fechaAlta: Date;
    fechaBaja: Date;
    idContribuyentePrincipal: number;
    idDireccionPrincipal: number;
    idDireccionEntrega: number;

    constructor(
        id: number = 0,
        numeroCuenta: string = "",
        numeroWeb: string = "",
        idEstadoCuenta: number = 0,
        idTipoTributo: number = 0,
        idTributo: number = 0,
        fechaAlta: Date = null,
        fechaBaja: Date = null,
        idContribuyentePrincipal: number = 0,
        idDireccionPrincipal: number = 0,
        idDireccionEntrega: number = 0)
    {
        this.id = id;
        this.numeroCuenta = numeroCuenta;
        this.numeroWeb = numeroWeb;
        this.idEstadoCuenta = idEstadoCuenta;
        this.idTipoTributo = idTipoTributo;
        this.idTributo = idTributo;
        this.fechaAlta = fechaAlta;
        this.fechaBaja = fechaBaja;
        this.idContribuyentePrincipal = idContribuyentePrincipal;
        this.idDireccionPrincipal = idDireccionPrincipal;
        this.idDireccionEntrega = idDireccionEntrega;
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
        this.idContribuyentePrincipal = row.idContribuyentePrincipal ?? 0;
        this.idDireccionPrincipal = row.idDireccionPrincipal ?? 0;
        this.idDireccionEntrega = row.idDireccionEntrega ?? 0;
    }
    
}
