import ReciboPublicacion from "./recibo-publicacion";

export default class ReciboPublicacionLote {

	numeroLotePublicacion: string;
	fechaPublicacion: Date;
	fechaEnvio: Date;
	fechaConfirmacion: Date;
	masivo: boolean;
	error: boolean;
	observacionEnvio: string;
	observacionConfirmacion: string;
	recibosPublicacion: Array<ReciboPublicacion>;

	constructor(
		numeroLotePublicacion: string = "",
		fechaPublicacion: Date = null,
		fechaEnvio: Date = null,
		fechaConfirmacion: Date = null,
		masivo: boolean = false,
		error: boolean = false,
		observacionEnvio: string = "",
		observacionConfirmacion: string = "",
		recibosPublicacion: Array<ReciboPublicacion> = []
	)
	{
        this.numeroLotePublicacion = numeroLotePublicacion;
        this.fechaPublicacion = fechaPublicacion;
		this.fechaEnvio = fechaEnvio;
		this.fechaConfirmacion = fechaConfirmacion;
		this.masivo = masivo;
		this.error = error;
		this.observacionEnvio = observacionEnvio;
		this.observacionConfirmacion = observacionConfirmacion;
		this.recibosPublicacion = recibosPublicacion;
	}

	setFromObject = (row) =>
	{
		this.numeroLotePublicacion = row.numeroLotePublicacion ?? "";
		this.fechaPublicacion = row.fechaPublicacion ?? null;
		this.fechaEnvio = row.fechaEnvio ?? null;
		this.fechaConfirmacion = row.fechaConfirmacion ?? null;
		this.masivo = row.masivo ?? false;
		this.error = row.error ?? false;
		this.observacionEnvio = row.observacionEnvio ?? "";
		this.observacionConfirmacion = row.observacionConfirmacion ?? "";
		this.recibosPublicacion = row.recibosPublicacion.map(x => {
            let item = new ReciboPublicacion();
            item.setFromObject(x);
            return item;
        });
	}

}
