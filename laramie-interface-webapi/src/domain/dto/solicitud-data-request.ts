import { isEmpty } from "../../infraestructure/sdk/utils/validator";
import PersonaDTO from "./persona-dto";

export default class SolicitudDataRequest {
    idSolicitud: number;
    tipoSolicitud: string;
    codigoTipoDocumento: string;
    numeroDocumento: string;
    numeroCuenta: string;
    numeroCuentaInmueble: string;
    numeroCausa: string;
    numeroActa: string;
    codigoInfraccion: string;
    dominio: string;
    periodo: string;
    cuota: number;
    importe: number;
    cantidad: number;
    fechaVencimiento: Date;
    anticipo: number;
    cuotas: number;
    observacion: string;
    persona: PersonaDTO;
    items: any[];

    constructor(
        idSolicitud: number = 0,
        tipoSolicitud: string = "",
        codigoTipoDocumento: string = "",
        numeroDocumento: string = "",
        numeroCuenta: string = "",
        numeroCuentaInmueble: string = "",
        numeroCausa: string = "",
        numeroActa: string = "",
        codigoInfraccion: string = "",
        dominio: string = "",
        periodo: string = "",
        cuota: number = 0,
        importe: number = 0,
        cantidad: number = 0,
        fechaVencimiento: Date = null,
        anticipo: number = 0,
        cuotas: number = 0,
        observacion: string = "",
        persona:PersonaDTO = new PersonaDTO(),
        items: any[] = []
    ) {
        this.idSolicitud = idSolicitud;
        this.tipoSolicitud = tipoSolicitud;
        this.codigoTipoDocumento = codigoTipoDocumento;
        this.numeroDocumento = numeroDocumento;
        this.numeroCuenta = numeroCuenta;
        this.numeroCuentaInmueble = numeroCuentaInmueble;
        this.numeroCausa = numeroCausa;
        this.numeroActa = numeroActa;
        this.codigoInfraccion = codigoInfraccion;
        this.dominio = dominio;
        this.periodo = periodo;
        this.cuota = cuota;
        this.importe = importe;
        this.cantidad = cantidad;
        this.fechaVencimiento = fechaVencimiento;
        this.anticipo = anticipo;
        this.cuotas = cuotas;
        this.observacion = observacion;
        this.persona = persona;
        this.items = items;
    }

    setFromObject = (row) =>
    {
        this.idSolicitud = row.idSolicitud ?? 0;
        this.tipoSolicitud = row.tipoSolicitud ?? "";
        this.codigoTipoDocumento = row.codigoTipoDocumento ?? "";
        this.numeroDocumento = row.numeroDocumento ?? "";
        this.numeroCuenta = row.numeroCuenta ?? "";
        this.numeroCuentaInmueble = row.numeroCuentaInmueble ?? "";
        this.numeroCausa = row.numeroCausa ?? "";
        this.numeroActa = row.numeroActa ?? "";
        this.codigoInfraccion = row.codigoInfraccion ?? "";
        this.dominio = row.dominio ?? "";
        this.periodo = row.periodo ?? "";
        this.cuota = !isEmpty(row.cuota) ? parseInt(row.cuota) : 0;
        this.importe = !isEmpty(row.importe) ? parseFloat(row.importe) : 0;
        this.cantidad = !isEmpty(row.cantidad) ? parseInt(row.cantidad) : 0;
        this.fechaVencimiento = row.fechaVencimiento ?? null;
        this.anticipo = !isEmpty(row.anticipo) ? parseInt(row.anticipo) : 0;
        this.cuotas = !isEmpty(row.cuotas) ? parseInt(row.cuotas) : 0;
        this.observacion = row.observacion ?? "";
        if (row.persona) this.persona.setFromObject(row.persona);
        else this.persona.clear();
        this.items = row.items;
    }
    
}
