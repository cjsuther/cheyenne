export default class PersonaMin {

	idPersona: number;
	idTipoPersona: number;
	idTipoDocumento: number;
	numeroDocumento: string;
	nombrePersona: string;

	constructor(
		idPersona: number = 0,
		idTipoPersona: number = 0,
		idTipoDocumento: number = 0,
		numeroDocumento: string = "",
		nombrePersona: string = ""
	)
	{
		this.idPersona = idPersona;
		this.idTipoPersona = idTipoPersona;
		this.idTipoDocumento = idTipoDocumento;
		this.numeroDocumento = numeroDocumento;
		this.nombrePersona = nombrePersona;
	}

	setFromObject = (row) =>
	{
		this.idPersona = row.idPersona ?? 0;
		this.idTipoPersona = row.idTipoPersona ?? 0;
		this.idTipoDocumento = row.idTipoDocumento ?? 0;
		this.numeroDocumento = row.numeroDocumento ?? "";
		this.nombrePersona = row.nombrePersona ?? "";
	}

}
