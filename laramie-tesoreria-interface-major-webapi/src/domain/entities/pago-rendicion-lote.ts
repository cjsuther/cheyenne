import PagoRendicion from "./pago-rendicion";

export default class PagoRendicionLote {

	numeroLoteRendicion: string;
	fechaRendicion: Date;
	fechaEnvio: Date;
	fechaConfirmacion: Date;
	error: boolean;
	observacionEnvio: string;
	observacionConfirmacion: string;
	pagosRendicion: Array<PagoRendicion>;

	constructor(
		numeroLoteRendicion: string = "",
		fechaRendicion: Date = null,
		fechaEnvio: Date = null,
		fechaConfirmacion: Date = null,
		error: boolean = false,
		observacionEnvio: string = "",
		observacionConfirmacion: string = "",
		pagosRendicion: Array<PagoRendicion> = []
	)
	{
        this.numeroLoteRendicion = numeroLoteRendicion;
        this.fechaRendicion = fechaRendicion;
		this.fechaEnvio = fechaEnvio;
		this.fechaConfirmacion = fechaConfirmacion;
		this.error = error;
		this.observacionEnvio = observacionEnvio;
		this.observacionConfirmacion = observacionConfirmacion;
		this.pagosRendicion = pagosRendicion;
	}

	setFromObject = (row) =>
	{
		this.numeroLoteRendicion = row.numeroLoteRendicion ?? "";
		this.fechaRendicion = row.fechaRendicion ?? null;
		this.fechaEnvio = row.fechaEnvio ?? null;
		this.fechaConfirmacion = row.fechaConfirmacion ?? null;
		this.error = row.error ?? false;
		this.observacionEnvio = row.observacionEnvio ?? "";
		this.observacionConfirmacion = row.observacionConfirmacion ?? "";
		this.pagosRendicion = row.pagosRendicion.map(x => {
            let item = new PagoRendicion();
            item.setFromObject(x);
            return item;
        });
	}

}
