export default class CertificadoApremioRow {

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
	numeroApremio: string;
    numeroCuenta: string;
    idContribuyente: number;
    idTipoDocumentoContribuyente: number;
    numeroDocumentoContribuyente: string;
    nombreContribuyente: string;

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
		fechaRecepcion: Date = null,
		numeroApremio: string = "",
		numeroCuenta: string = "",
        idContribuyente: number = 0,
        idTipoDocumentoContribuyente: number = 0,
        numeroDocumentoContribuyente: string = "",
        nombreContribuyente: string = ""
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
		this.numeroApremio = numeroApremio;
		this.numeroCuenta = numeroCuenta;
        this.idContribuyente = idContribuyente;
        this.idTipoDocumentoContribuyente = idTipoDocumentoContribuyente;
        this.numeroDocumentoContribuyente = numeroDocumentoContribuyente;
        this.nombreContribuyente = nombreContribuyente;
	}

}
