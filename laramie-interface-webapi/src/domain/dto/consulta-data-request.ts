import { isEmpty } from "../../infraestructure/sdk/utils/validator";

export default class ConsultaDataRequest {
    tipoSolicitud: string;
    codigoTipoDocumento: string;
    numeroDocumento: string;
    numeroCuenta: string;
    numeroCausa: string;
    dominio: string;
    periodo: string;
    fechaDesde: Date;
    fechaHasta: Date;
    fechaVencido: Date;
    periodoDesde: string;
    periodoHasta: string;
    cuotaDesde: number;
    cuotaHasta: number;

    constructor(
        tipoSolicitud: string = "",
        codigoTipoDocumento: string = "",
        numeroDocumento: string = "",
        numeroCuenta: string = "",
        numeroCausa: string = "",
        dominio: string = "",
        periodo: string = "",
        fechaDesde: Date = null,
        fechaHasta: Date = null,
        fechaVencido: Date = null,
        periodoDesde: string = "",
        periodoHasta: string = "",
        cuotaDesde:number = 0,
        cuotaHasta:number = 0
    ) {
        this.tipoSolicitud = tipoSolicitud;
        this.codigoTipoDocumento = codigoTipoDocumento;
        this.numeroDocumento = numeroDocumento;
        this.numeroCuenta = numeroCuenta;
        this.numeroCausa = numeroCausa;
        this.dominio = dominio;
        this.periodo = periodo;
        this.fechaDesde = fechaDesde;
        this.fechaHasta = fechaHasta;
        this.fechaVencido = fechaVencido;
        this.periodoDesde = periodoDesde;
        this.periodoHasta = periodoHasta;
        this.cuotaDesde = cuotaDesde;
        this.cuotaHasta = cuotaHasta;
    }

    setFromObject = (row) =>
    {
        this.tipoSolicitud = row.tipoSolicitud ?? "";
        this.codigoTipoDocumento = row.codigoTipoDocumento ?? "";
        this.numeroDocumento = row.numeroDocumento ?? "";
        this.numeroCuenta = row.numeroCuenta ?? "";
        this.numeroCausa = row.numeroCausa ?? "";
        this.dominio = row.dominio ?? "";
        this.periodo = row.periodo ?? "";
        this.fechaDesde = !isEmpty(row.fechaDesde) ? new Date(row.fechaDesde.toString()) : null;
        this.fechaHasta = !isEmpty(row.fechaHasta) ? new Date(row.fechaHasta.toString()) : null;
        this.fechaVencido = !isEmpty(row.fechaVencido) ? new Date(row.fechaVencido.toString()) : null;
        this.periodoDesde = !isEmpty(row.periodoDesde) ? row.periodoDesde.split('-')[0] : "";
        this.periodoHasta = !isEmpty(row.periodoHasta) ? row.periodoHasta.split('-')[0] : "";
        this.cuotaDesde = !isEmpty(row.periodoDesde) ? parseInt(row.periodoDesde.split('-')[1]) : 0;
        this.cuotaHasta = !isEmpty(row.periodoHasta) ? parseInt(row.periodoHasta.split('-')[1]) : 0;
    }
    
}
