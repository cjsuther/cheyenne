export default class Verificacion {

    id: number;
	idInhumado: number;
	fecha: Date;
	motivoVerificacion: string;
	idTipoDocumentoVerificador: number;
	numeroDocumentoVerificador: string;
	apellidoVerificador: string;
	nombreVerificador: string;
	idResultadoVerificacion: number;

	constructor(
        id: number = 0,
		idInhumado: number = 0,
		fecha: Date = null,
		motivoVerificacion: string = "",
		idTipoDocumentoVerificador: number = 0,
		numeroDocumentoVerificador: string = "",
		apellidoVerificador: string = "",
		nombreVerificador: string = "",
		idResultadoVerificacion: number = 0
	)
	{
        this.id = id;
		this.idInhumado = idInhumado;
		this.fecha = fecha;
		this.motivoVerificacion = motivoVerificacion;
		this.idTipoDocumentoVerificador = idTipoDocumentoVerificador;
		this.numeroDocumentoVerificador = numeroDocumentoVerificador;
		this.apellidoVerificador = apellidoVerificador;
		this.nombreVerificador = nombreVerificador;
		this.idResultadoVerificacion = idResultadoVerificacion;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idInhumado = row.idInhumado ?? 0;
		this.fecha = row.fecha ?? null;
		this.motivoVerificacion = row.motivoVerificacion ?? "";
		this.idTipoDocumentoVerificador = row.idTipoDocumentoVerificador ?? 0;
		this.numeroDocumentoVerificador = row.numeroDocumentoVerificador ?? "";
		this.apellidoVerificador = row.apellidoVerificador ?? "";
		this.nombreVerificador = row.nombreVerificador ?? "";
		this.idResultadoVerificacion = row.idResultadoVerificacion ?? 0;
	}

}
