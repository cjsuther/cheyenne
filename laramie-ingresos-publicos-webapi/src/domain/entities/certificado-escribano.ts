export default class CertificadoEscribano {

    id: number;
	anioCertificado: string;
	numeroCertificado: string;
	idTipoCertificado: number;
	idObjetoCertificado: number;
	idEscribano: number;
	transferencia: string;
	idCuenta: number;
	vendedor: string;
	partida: string;
	direccion: string;
	idPersonaIntermediario: number;
	idTipoPersonaIntermediario: number;
	nombrePersonaIntermediario: string;
	idTipoDocumentoIntermediario: number;
	numeroDocumentoIntermediario: string;
	idPersonaRetiro: number;
	idTipoPersonaRetiro: number;
	nombrePersonaRetiro: string;
	idTipoDocumentoRetiro: number;
	numeroDocumentoRetiro: string;
	fechaEntrada: Date;
	fechaSalida: Date;
	fechaEntrega: Date;

	constructor(
        id: number = 0,
		anioCertificado: string = "",
		numeroCertificado: string = "",
		idTipoCertificado: number = 0,
		idObjetoCertificado: number = 0,
		idEscribano: number = 0,
		transferencia: string = "",
		idCuenta: number = 0,
		vendedor: string = "",
		partida: string = "",
		direccion: string = "",
		idPersonaIntermediario: number = 0,
		idTipoPersonaIntermediario: number = 0,
		nombrePersonaIntermediario: string = "",
		idTipoDocumentoIntermediario: number = 0,
		numeroDocumentoIntermediario: string = "",
		idPersonaRetiro: number = 0,
		idTipoPersonaRetiro: number = 0,
		nombrePersonaRetiro: string = "",
		idTipoDocumentoRetiro: number = 0,
		numeroDocumentoRetiro: string = "",
		fechaEntrada: Date = null,
		fechaSalida: Date = null,
		fechaEntrega: Date = null
	)
	{
        this.id = id;
		this.anioCertificado = anioCertificado;
		this.numeroCertificado = numeroCertificado;
		this.idTipoCertificado = idTipoCertificado;
		this.idObjetoCertificado = idObjetoCertificado;
		this.idEscribano = idEscribano;
		this.transferencia = transferencia;
		this.idCuenta = idCuenta;
		this.vendedor = vendedor;
		this.partida = partida;
		this.direccion = direccion;
		this.idPersonaIntermediario = idPersonaIntermediario;
		this.idTipoPersonaIntermediario = idTipoPersonaIntermediario;
		this.nombrePersonaIntermediario = nombrePersonaIntermediario;
		this.idTipoDocumentoIntermediario = idTipoDocumentoIntermediario;
		this.numeroDocumentoIntermediario = numeroDocumentoIntermediario;
		this.idPersonaRetiro = idPersonaRetiro;
		this.idTipoPersonaRetiro = idTipoPersonaRetiro;
		this.nombrePersonaRetiro = nombrePersonaRetiro;
		this.idTipoDocumentoRetiro = idTipoDocumentoRetiro;
		this.numeroDocumentoRetiro = numeroDocumentoRetiro;
		this.fechaEntrada = fechaEntrada;
		this.fechaSalida = fechaSalida;
		this.fechaEntrega = fechaEntrega;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.anioCertificado = row.anioCertificado ?? "";
		this.numeroCertificado = row.numeroCertificado ?? "";
		this.idTipoCertificado = row.idTipoCertificado ?? 0;
		this.idObjetoCertificado = row.idObjetoCertificado ?? 0;
		this.idEscribano = row.idEscribano ?? 0;
		this.transferencia = row.transferencia ?? "";
		this.idCuenta = row.idCuenta ?? 0;
		this.vendedor = row.vendedor ?? "";
		this.partida = row.partida ?? "";
		this.direccion = row.direccion ?? "";
		this.idPersonaIntermediario = row.idPersonaIntermediario ?? 0;
		this.idTipoPersonaIntermediario = row.idTipoPersonaIntermediario ?? 0;
		this.nombrePersonaIntermediario = row.nombrePersonaIntermediario ?? "";
		this.idTipoDocumentoIntermediario = row.idTipoDocumentoIntermediario ?? 0;
		this.numeroDocumentoIntermediario = row.numeroDocumentoIntermediario ?? "";
		this.idPersonaRetiro = row.idPersonaRetiro ?? 0;
		this.idTipoPersonaRetiro = row.idTipoPersonaRetiro ?? 0;
		this.nombrePersonaRetiro = row.nombrePersonaRetiro ?? "";
		this.idTipoDocumentoRetiro = row.idTipoDocumentoRetiro ?? 0;
		this.numeroDocumentoRetiro = row.numeroDocumentoRetiro ?? "";
		this.fechaEntrada = row.fechaEntrada ?? null;
		this.fechaSalida = row.fechaSalida ?? null;
		this.fechaEntrega = row.fechaEntrega ?? null;
	}

}
