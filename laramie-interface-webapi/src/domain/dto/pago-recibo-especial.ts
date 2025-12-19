import { RECIBO_TYPE } from "../../infraestructure/sdk/consts/reciboType";
import CuentaCorrienteCondicionEspecial from "../entities/cuenta-corriente-condicion-especial";

export default class PagoReciboEspecial {

    idCuenta: number;
	idPersona: number;
	idTipoPersona: number;
	idTipoDocumento: number;
	numeroDocumento: string;
	nombrePersona: string;
	idReciboEspecial: number;
	cantidad: number;
	periodo: string;
	cuota: number;
	fechaVencimiento: Date;
	derechoEspecial: boolean;
	notificacionPago: boolean;
	idTipoRecibo: number;

	cuentaCorrienteCondicionesEspeciales: CuentaCorrienteCondicionEspecial[];

	constructor(
        idCuenta: number = 0,
		idPersona: number = 0,
		idTipoPersona: number = 0,
		idTipoDocumento: number = 0,
		numeroDocumento: string = "",
		nombrePersona: string = "",
		idReciboEspecial: number = 0,
		cantidad: number = 0,
		periodo: string = "",
		cuota: number = 0,
		fechaVencimiento: Date = null,
		derechoEspecial: boolean = false,
		notificacionPago: boolean = false,
		idTipoRecibo: number = RECIBO_TYPE.RECIBO_MOSTRADOR
	)
	{
        this.idCuenta = idCuenta;
		this.idPersona = idPersona;
		this.idTipoPersona = idTipoPersona;
		this.idTipoDocumento = idTipoDocumento;
		this.numeroDocumento = numeroDocumento;
		this.nombrePersona = nombrePersona;
		this.idReciboEspecial = idReciboEspecial;
		this.cantidad = cantidad;
		this.periodo = periodo;
		this.cuota = cuota;
		this.fechaVencimiento = fechaVencimiento;
		this.derechoEspecial = derechoEspecial;
		this.notificacionPago = notificacionPago;
		this.idTipoRecibo = idTipoRecibo;

		this.cuentaCorrienteCondicionesEspeciales = [];
	}

	setFromObject = (row) =>
	{
        this.idCuenta = row.idCuenta ?? 0;
		this.idPersona = row.idPersona ?? 0;
		this.idTipoPersona = row.idTipoPersona ?? 0;
		this.idPersona = row.idPersona ?? 0;
		this.idTipoDocumento = row.idTipoDocumento ?? 0;
		this.numeroDocumento = row.numeroDocumento ?? "";
		this.nombrePersona = row.nombrePersona ?? "";
		this.idReciboEspecial = row.idReciboEspecial ?? 0;
		this.cantidad = row.cantidad ?? 0;
		this.periodo = row.periodo ?? "";
		this.cuota = row.cuota ?? 0;
		this.fechaVencimiento = row.fechaVencimiento ?? null;
		this.derechoEspecial = row.derechoEspecial ?? false;
		this.notificacionPago = row.notificacionPago ?? false;
		this.idTipoRecibo = row.idTipoRecibo ?? RECIBO_TYPE.RECIBO_MOSTRADOR;
		
		this.cuentaCorrienteCondicionesEspeciales = row.cuentaCorrienteCondicionesEspeciales.map(x => {
			let item = new CuentaCorrienteCondicionEspecial();
			item.setFromObject(x);
			return item;
		});
	}

}
