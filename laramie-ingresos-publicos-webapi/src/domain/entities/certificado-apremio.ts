export default class CertificadoApremio {

    id: number;
	idApremio: number;
	idEstadoCertificadoApremio: number;
	numero: string;
	idCuenta: number;
	idInspeccion: number;
	montoTotal: number;
	fechaCertificado: Date;
	fechaCalculo: Date;
	fechaNotificacion: Date;
	fechaRecepcion: Date;

	constructor(
        id: number = 0,
		idApremio: number = 0,
		idEstadoCertificadoApremio: number = 0,
		numero: string = "",
		idCuenta: number = 0,
		idInspeccion: number = 0,
		montoTotal: number = 0,
		fechaCertificado: Date = null,
		fechaCalculo: Date = null,
		fechaNotificacion: Date = null,
		fechaRecepcion: Date = null
	)
	{
        this.id = id;
		this.idApremio = idApremio;
		this.idEstadoCertificadoApremio = idEstadoCertificadoApremio;
		this.numero = numero;
		this.idCuenta = idCuenta;
		this.idInspeccion = idInspeccion;
		this.montoTotal = montoTotal;
		this.fechaCertificado = fechaCertificado;
		this.fechaCalculo = fechaCalculo;
		this.fechaNotificacion = fechaNotificacion;
		this.fechaRecepcion = fechaRecepcion;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idApremio = row.idApremio ?? 0;
		this.idEstadoCertificadoApremio = row.idEstadoCertificadoApremio ?? 0;
		this.numero = row.numero ?? "";
		this.idCuenta = row.idCuenta ?? 0;
		this.idInspeccion = row.idInspeccion ?? 0;
		this.montoTotal = row.montoTotal ?? 0;
		this.fechaCertificado = row.fechaCertificado ?? null;
		this.fechaCalculo = row.fechaCalculo ?? null;
		this.fechaNotificacion = row.fechaNotificacion ?? null;
		this.fechaRecepcion = row.fechaRecepcion ?? null;
	}

}
