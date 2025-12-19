import Verificacion from "../entities/verificacion";

export default class VerificacionState extends Verificacion {

	state: string;

	constructor(
        id: number = 0,
		idInhumado: number = 0,
		fecha: Date = null,
		motivoVerificacion: string = "",
		idTipoDocumentoVerificador: number = 0,
		numeroDocumentoVerificador: string = "",
		apellidoVerificador: string = "",
		nombreVerificador: string = "",
		idResultadoVerificacion: number = 0,
		state: string = "o"
	)
	{
        super(id, idInhumado, fecha, motivoVerificacion, idTipoDocumentoVerificador, numeroDocumentoVerificador,	
			 apellidoVerificador, nombreVerificador, idResultadoVerificacion);
		this.state = state;
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
		this.state = row.state ?? "o";
	}

}
